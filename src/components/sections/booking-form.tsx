"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, Suspense, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCircle2, ChevronDown, Clock3, Loader2 } from "lucide-react";
import {
  bookingFormSchema,
  type BookingFormValues,
  bookingAgreementVersion,
} from "@/lib/validations/booking";
import {
  serviceOptions,
  budgetOptions,
  leadSourceOptions,
  preferredContactMethodOptions,
  BOOKING_AGREEMENT_TEXT,
} from "@/lib/booking-config";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Button } from "@/components/ui/button";
import { DateCalendar } from "@/components/ui/date-calendar";
import { TimeSlotPicker, type AvailableSlot } from "@/components/ui/time-slot-picker";
import { cn } from "@/lib/utils";

const fieldClass =
  "focus-ring w-full rounded-xl border border-hairline bg-white/[0.02] px-4 py-3 text-sm text-foreground placeholder:text-muted-2 transition-colors duration-300 focus:border-accent/40";
const selectClass = cn(fieldClass, "appearance-none pr-10");
const labelClass = "mb-2 block text-[12px] font-medium uppercase tracking-[0.1em] text-muted-2";
const errorClass = "mt-1.5 text-[12px] text-red-400";

function SelectChevron() {
  return (
    <ChevronDown
      className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-2"
      strokeWidth={1.75}
    />
  );
}

function formatDateLabel(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

type SubmitResult =
  | { kind: "standard"; bookingId: string; date: string; time: string }
  | { kind: "emergency"; bookingId: string; date: string; time: string };

function BookingFormInner({ defaultService }: { defaultService?: string }) {
  const searchParams = useSearchParams();
  const prefillService = defaultService ?? searchParams.get("service");

  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [slots, setSlots] = useState<AvailableSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [submissionId, setSubmissionId] = useState("");
  const [attribution, setAttribution] = useState<{ referrer: string; landingPage: string }>({
    referrer: "",
    landingPage: "",
  });

  useEffect(() => {
    setSubmissionId(crypto.randomUUID());
    setAttribution({
      referrer: document.referrer ?? "",
      landingPage: window.location.href,
    });
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      serviceInterest: undefined,
      budgetRange: undefined,
      appointmentType: "standard",
      meetingDate: undefined,
      meetingTime: undefined,
      emergencyDetails: "",
      leadSource: undefined,
      leadSourceOther: "",
      preferredContactMethod: undefined,
      additionalParticipants: [],
      agreementAccepted: false as unknown as true,
      businessWebsite: "",
      website: "",
    },
  });

  const appointmentType = watch("appointmentType");
  const meetingDate = watch("meetingDate");
  const meetingTime = watch("meetingTime");
  const leadSource = watch("leadSource");
  const agreementAccepted = watch("agreementAccepted");
  const isEmergency = appointmentType === "emergency";

  useEffect(() => {
    if (
      prefillService &&
      serviceOptions.some((s) => s.id === prefillService)
    ) {
      setValue("serviceInterest", prefillService as BookingFormValues["serviceInterest"]);
    }
  }, [prefillService, setValue]);

  const fetchAvailability = useCallback(
    async (date: string, type: "standard" | "emergency") => {
      setSlotsLoading(true);
      setSlots([]);
      try {
        const res = await fetch(
          `/api/booking/availability?appointmentType=${type}&date=${date}&timezone=America/Toronto`
        );
        const data = await res.json();
        if (data.success) {
          setSlots(data.slots ?? []);
        } else {
          setSlots([]);
        }
      } catch {
        setSlots([]);
      } finally {
        setSlotsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (meetingDate) {
      setValue("meetingTime", undefined);
      fetchAvailability(meetingDate, appointmentType);
    } else {
      setSlots([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meetingDate, appointmentType]);

  const scheduleLabel = useMemo(
    () => (isEmergency ? "Preferred date & time (subject to approval)" : "Preferred meeting date & time"),
    [isEmergency]
  );

  const onSubmit = async (values: BookingFormValues) => {
    if (values.website) return; // honeypot triggered — silently drop
    setSubmitError(null);
    setStatus("submitting");

    const endpoint = values.appointmentType === "standard" ? "/api/booking/strategy-call" : "/api/booking/emergency";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          submissionId,
          agreementVersion: bookingAgreementVersion,
          agreementTimestamp: new Date().toISOString(),
          pageUrl: attribution.landingPage,
          referrer: attribution.referrer,
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        if (data.code === "SLOT_NO_LONGER_AVAILABLE" && values.meetingDate) {
          setSubmitError(data.message ?? "That time was just booked. Please choose another available time.");
          fetchAvailability(values.meetingDate, values.appointmentType);
          setStatus("idle");
          return;
        }
        setSubmitError(
          data.message ??
            "We could not confirm this appointment right now. Your information has not been lost. Please try again or contact hello@velordigital.com."
        );
        setStatus("idle");
        return;
      }

      setSubmitResult({
        kind: values.appointmentType,
        bookingId: data.bookingId,
        date: values.meetingDate ?? "",
        time: values.meetingTime ?? "",
      });
      setStatus("success");
      reset();
      setSubmissionId(crypto.randomUUID());
    } catch {
      setSubmitError(
        "We could not confirm this appointment right now. Your information has not been lost. Please try again or contact hello@velordigital.com."
      );
      setStatus("idle");
    }
  };

  return (
    <GlassPanel className="p-2" glow>
      <div className="relative rounded-[calc(1.75rem-0.375rem)] p-6 sm:p-9">
        <AnimatePresence mode="wait">
          {status === "success" && submitResult ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4 py-16 text-center"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full border border-accent/30 bg-accent/10">
                <CheckCircle2 className="h-7 w-7 text-accent-soft" strokeWidth={1.5} />
              </span>
              {submitResult.kind === "standard" ? (
                <>
                  <h3 className="font-display text-2xl font-medium text-foreground">
                    Your strategy call has been booked.
                  </h3>
                  <p className="max-w-sm text-sm leading-relaxed text-muted">
                    We sent the meeting details and video-call link to your email.
                  </p>
                  <div className="rounded-2xl border border-hairline bg-white/[0.02] px-5 py-4 text-[13px] text-muted-2">
                    <p>Booking ID: {submitResult.bookingId}</p>
                    {submitResult.date && <p>Date: {formatDateLabel(submitResult.date)}</p>}
                    {submitResult.time && <p>Time: {submitResult.time} ET</p>}
                  </div>
                </>
              ) : (
                <>
                  <h3 className="font-display text-2xl font-medium text-foreground">
                    Your emergency meeting request has been received.
                  </h3>
                  <p className="max-w-sm text-sm leading-relaxed text-muted">
                    This appointment is not confirmed yet. Our team will review your request and
                    contact you shortly.
                  </p>
                  <div className="rounded-2xl border border-orange-400/25 bg-orange-400/[0.06] px-5 py-4 text-[13px] text-muted-2">
                    <p>Request ID: {submitResult.bookingId}</p>
                    {submitResult.date && <p>Requested date: {formatDateLabel(submitResult.date)}</p>}
                    {submitResult.time && <p>Requested time: {submitResult.time} ET</p>}
                  </div>
                </>
              )}
              <Button variant="secondary" size="md" onClick={() => setStatus("idle")}>
                Submit another request
              </Button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit(onSubmit)}
              className="grid grid-cols-1 gap-5 sm:grid-cols-2"
              noValidate
            >
              {/* Honeypot field — hidden from real users, catches bots */}
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden="true"
                {...register("website")}
              />

              <div>
                <label className={labelClass} htmlFor="fullName">
                  Full name
                </label>
                <input id="fullName" className={fieldClass} placeholder="Jordan Leblanc" {...register("fullName")} />
                {errors.fullName && <p className={errorClass}>{errors.fullName.message}</p>}
              </div>

              <div>
                <label className={labelClass} htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className={fieldClass}
                  placeholder="you@business.com"
                  {...register("email")}
                />
                {errors.email && <p className={errorClass}>{errors.email.message}</p>}
              </div>

              <div>
                <label className={labelClass} htmlFor="phone">
                  Phone
                </label>
                <input id="phone" type="tel" className={fieldClass} placeholder="(613) 555-0142" {...register("phone")} />
                {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
              </div>

              <div>
                <label className={labelClass} htmlFor="businessName">
                  Business name
                </label>
                <input
                  id="businessName"
                  className={fieldClass}
                  placeholder="Your business name"
                  {...register("businessName")}
                />
                {errors.businessName && (
                  <p className={errorClass}>{errors.businessName.message}</p>
                )}
              </div>

              <div>
                <label className={labelClass} htmlFor="businessWebsite">
                  Website or social link <span className="normal-case text-muted-2/70">(optional)</span>
                </label>
                <input
                  id="businessWebsite"
                  className={fieldClass}
                  placeholder="yourbusiness.com"
                  {...register("businessWebsite")}
                />
                {errors.businessWebsite && (
                  <p className={errorClass}>{errors.businessWebsite.message}</p>
                )}
              </div>

              <div>
                <label className={labelClass} htmlFor="preferredContactMethod">
                  Preferred contact method <span className="normal-case text-muted-2/70">(optional)</span>
                </label>
                <div className="relative">
                  <select
                    id="preferredContactMethod"
                    className={selectClass}
                    defaultValue=""
                    {...register("preferredContactMethod")}
                  >
                    <option value="">No preference</option>
                    {preferredContactMethodOptions.map((opt) => (
                      <option key={opt.id} value={opt.id} className="bg-surface">
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <SelectChevron />
                </div>
              </div>

              <div>
                <label className={labelClass} htmlFor="serviceInterest">
                  Service interested in
                </label>
                <div className="relative">
                  <select
                    id="serviceInterest"
                    className={selectClass}
                    defaultValue=""
                    {...register("serviceInterest")}
                  >
                    <option value="" disabled>
                      Select a service
                    </option>
                    {serviceOptions.map((opt) => (
                      <option key={opt.id} value={opt.id} className="bg-surface">
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <SelectChevron />
                </div>
                {errors.serviceInterest && (
                  <p className={errorClass}>{errors.serviceInterest.message}</p>
                )}
              </div>

              <div>
                <label className={labelClass} htmlFor="budgetRange">
                  Budget range
                </label>
                <div className="relative">
                  <select
                    id="budgetRange"
                    className={selectClass}
                    defaultValue=""
                    {...register("budgetRange")}
                  >
                    <option value="" disabled>
                      Select a range
                    </option>
                    {budgetOptions.map((opt) => (
                      <option key={opt.id} value={opt.id} className="bg-surface">
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <SelectChevron />
                </div>
                {errors.budgetRange && <p className={errorClass}>{errors.budgetRange.message}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass} htmlFor="projectDetails">
                  Project details
                </label>
                <textarea
                  id="projectDetails"
                  rows={4}
                  className={cn(fieldClass, "resize-none")}
                  placeholder="Tell us about your business, what you're looking to build, and the main problem you want Velor to solve."
                  {...register("projectDetails")}
                />
                {errors.projectDetails && (
                  <p className={errorClass}>{errors.projectDetails.message}</p>
                )}
              </div>

              <div>
                <label className={labelClass} htmlFor="leadSource">
                  Where did you hear about us?
                </label>
                <div className="relative">
                  <select
                    id="leadSource"
                    className={selectClass}
                    defaultValue=""
                    {...register("leadSource")}
                  >
                    <option value="" disabled>
                      Select an option
                    </option>
                    {leadSourceOptions.map((opt) => (
                      <option key={opt.id} value={opt.id} className="bg-surface">
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <SelectChevron />
                </div>
                {errors.leadSource && <p className={errorClass}>{errors.leadSource.message}</p>}
              </div>

              {leadSource === "other" && (
                <div>
                  <label className={labelClass} htmlFor="leadSourceOther">
                    Tell us more
                  </label>
                  <input
                    id="leadSourceOther"
                    className={fieldClass}
                    placeholder="Where did you hear about us?"
                    {...register("leadSourceOther")}
                  />
                  {errors.leadSourceOther && (
                    <p className={errorClass}>{errors.leadSourceOther.message}</p>
                  )}
                </div>
              )}

              <div className="sm:col-span-2">
                <label className={labelClass} htmlFor="additionalParticipants">
                  Additional participants <span className="normal-case text-muted-2/70">(optional, comma-separated emails)</span>
                </label>
                <input
                  id="additionalParticipants"
                  className={fieldClass}
                  placeholder="teammate@business.com, partner@business.com"
                  onChange={(e) => {
                    const emails = e.target.value
                      .split(",")
                      .map((v) => v.trim())
                      .filter(Boolean);
                    setValue("additionalParticipants", emails, { shouldValidate: true });
                  }}
                />
                {errors.additionalParticipants && (
                  <p className={errorClass}>Check the additional participant emails for typos.</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <span className={cn(labelClass, "mb-0")}>{scheduleLabel}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const next = isEmergency ? "standard" : "emergency";
                      setValue("appointmentType", next, { shouldValidate: true });
                      setValue("meetingDate", undefined);
                      setValue("meetingTime", undefined);
                    }}
                    className={cn(
                      "hover-glow focus-ring inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[12px] font-medium transition-colors duration-300",
                      isEmergency
                        ? "border-orange-400/40 bg-orange-400/15 text-orange-300"
                        : "border-hairline bg-white/[0.02] text-muted hover:border-white/[0.14] hover:text-foreground"
                    )}
                  >
                    <AlertTriangle className="h-3.5 w-3.5" strokeWidth={1.75} />
                    {isEmergency ? "Emergency request selected" : "This can't wait — emergency request"}
                  </button>
                </div>

                {isEmergency && (
                  <div className="mb-4 rounded-2xl border border-orange-400/25 bg-orange-400/[0.06] p-5">
                    <p className="text-sm leading-relaxed text-foreground">
                      Skip regular scheduling — tell us your preferred time and what&rsquo;s urgent.
                      Our team reviews every emergency request manually and will confirm, reschedule,
                      or reach out with alternatives. This is not a guaranteed booking.
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-[auto_1fr]">
                  <DateCalendar
                    value={meetingDate}
                    onChange={(date) => setValue("meetingDate", date, { shouldValidate: true })}
                  />
                  <div>
                    <span className="mb-3 flex items-center gap-1.5 text-[12px] text-muted-2">
                      <Clock3 className="h-3.5 w-3.5" strokeWidth={1.5} />
                      {isEmergency
                        ? "Requested time slots — approval required"
                        : "Available slots, Eastern Time"}
                    </span>
                    {meetingDate ? (
                      <TimeSlotPicker
                        slots={slots}
                        value={meetingTime}
                        onChange={(slot) => setValue("meetingTime", slot, { shouldValidate: true })}
                        loading={slotsLoading}
                      />
                    ) : (
                      <div className="rounded-xl border border-hairline bg-white/[0.02] p-4 text-[13px] text-muted-2">
                        Select a date to see available times.
                      </div>
                    )}
                  </div>
                </div>

                {(errors.meetingDate || errors.meetingTime) && (
                  <p className={errorClass}>
                    {errors.meetingDate?.message ?? errors.meetingTime?.message}
                  </p>
                )}
              </div>

              {isEmergency && (
                <div className="sm:col-span-2">
                  <label className={labelClass} htmlFor="emergencyDetails">
                    What&rsquo;s the emergency or urgent issue?
                  </label>
                  <textarea
                    id="emergencyDetails"
                    rows={3}
                    className={cn(fieldClass, "resize-none")}
                    placeholder="Briefly describe what's happening and why it's urgent."
                    {...register("emergencyDetails")}
                  />
                  {errors.emergencyDetails && (
                    <p className={errorClass}>{errors.emergencyDetails.message}</p>
                  )}
                </div>
              )}

              <div className="sm:col-span-2">
                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-hairline bg-white/[0.02] p-4">
                  <input
                    type="checkbox"
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-hairline bg-transparent accent-[var(--accent)]"
                    checked={agreementAccepted === true}
                    onChange={(e) =>
                      setValue("agreementAccepted", e.target.checked as unknown as true, {
                        shouldValidate: true,
                      })
                    }
                  />
                  <span className="text-[13px] leading-relaxed text-muted">{BOOKING_AGREEMENT_TEXT}</span>
                </label>
                {errors.agreementAccepted && (
                  <p className={errorClass}>{errors.agreementAccepted.message}</p>
                )}
              </div>

              {submitError && (
                <div className="sm:col-span-2 rounded-xl border border-red-400/25 bg-red-400/[0.06] p-4 text-[13px] text-red-300">
                  {submitError}
                </div>
              )}

              <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[12px] text-muted-2">
                  By submitting, you agree to be contacted by Velor Digital about your project.
                </p>
                <Button type="submit" size="lg" icon={status !== "submitting"} className="sm:shrink-0">
                  {status === "submitting" ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
                      Sending...
                    </span>
                  ) : isEmergency ? (
                    "Request Emergency Meeting"
                  ) : (
                    "Request Strategy Call"
                  )}
                </Button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </GlassPanel>
  );
}

export function BookingForm({ defaultService }: { defaultService?: string } = {}) {
  return (
    <Suspense fallback={<div className="h-[600px]" />}>
      <BookingFormInner defaultService={defaultService} />
    </Suspense>
  );
}
