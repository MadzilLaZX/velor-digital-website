"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";
import {
  bookingFormSchema,
  type BookingFormValues,
  serviceInterestOptions,
  budgetRangeOptions,
} from "@/lib/validations/booking";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

const fieldClass =
  "focus-ring w-full rounded-xl border border-hairline bg-white/[0.02] px-4 py-3 text-sm text-foreground placeholder:text-muted-2 transition-colors duration-300 focus:border-accent/40";
const labelClass = "mb-2 block text-[12px] font-medium uppercase tracking-[0.1em] text-muted-2";
const errorClass = "mt-1.5 text-[12px] text-red-400";

function BookingFormInner({ defaultService }: { defaultService?: string }) {
  const searchParams = useSearchParams();
  const prefillService = defaultService ?? searchParams.get("service");

  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      serviceInterest: undefined,
      budgetRange: undefined,
      website: "",
    },
  });

  useEffect(() => {
    if (
      prefillService &&
      (serviceInterestOptions as readonly string[]).includes(prefillService)
    ) {
      setValue("serviceInterest", prefillService as BookingFormValues["serviceInterest"]);
    }
  }, [prefillService, setValue]);

  const onSubmit = async (values: BookingFormValues) => {
    if (values.website) return; // honeypot triggered — silently drop
    setStatus("submitting");

    // TODO(integration): replace with a real submission handler.
    // Recommended wiring: POST to an n8n webhook (or a Next.js Route Handler
    // at /api/booking) which then:
    //   1. Upserts the lead into Supabase (or the CRM of record)
    //   2. Sends a confirmation email to the client (Resend/Postmark) and a
    //      notification to hello@velordigital.com
    //   3. Optionally triggers an SMS confirmation via Twilio
    // Example:
    // await fetch("/api/booking", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(values),
    // });
    await new Promise((resolve) => setTimeout(resolve, 900));

    setStatus("success");
    reset();
  };

  return (
    <GlassPanel className="p-2" glow>
      <div className="relative rounded-[calc(1.75rem-0.375rem)] p-6 sm:p-9">
        <AnimatePresence mode="wait">
          {status === "success" ? (
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
              <h3 className="font-display text-2xl font-medium text-foreground">
                Request received.
              </h3>
              <p className="max-w-sm text-sm leading-relaxed text-muted">
                Our team will contact you shortly. In the meantime, feel free to reach us
                directly at{" "}
                <a href={`mailto:${siteConfig.email}`} className="hover-glow-text text-accent-soft underline underline-offset-4">
                  {siteConfig.email}
                </a>
                .
              </p>
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
                <label className={labelClass} htmlFor="serviceInterest">
                  Service interested in
                </label>
                <select
                  id="serviceInterest"
                  className={cn(fieldClass, "appearance-none")}
                  defaultValue=""
                  {...register("serviceInterest")}
                >
                  <option value="" disabled>
                    Select a service
                  </option>
                  {serviceInterestOptions.map((opt) => (
                    <option key={opt} value={opt} className="bg-surface">
                      {opt}
                    </option>
                  ))}
                </select>
                {errors.serviceInterest && (
                  <p className={errorClass}>{errors.serviceInterest.message}</p>
                )}
              </div>

              <div>
                <label className={labelClass} htmlFor="budgetRange">
                  Budget range
                </label>
                <select
                  id="budgetRange"
                  className={cn(fieldClass, "appearance-none")}
                  defaultValue=""
                  {...register("budgetRange")}
                >
                  <option value="" disabled>
                    Select a range
                  </option>
                  {budgetRangeOptions.map((opt) => (
                    <option key={opt} value={opt} className="bg-surface">
                      {opt}
                    </option>
                  ))}
                </select>
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
                  placeholder="Tell us about your business and what you're looking to build."
                  {...register("projectDetails")}
                />
                {errors.projectDetails && (
                  <p className={errorClass}>{errors.projectDetails.message}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass} htmlFor="preferredDateTime">
                  Preferred meeting date/time
                </label>
                <input
                  id="preferredDateTime"
                  className={fieldClass}
                  placeholder="e.g. Weekday afternoons, week of July 14"
                  {...register("preferredDateTime")}
                />
                {errors.preferredDateTime && (
                  <p className={errorClass}>{errors.preferredDateTime.message}</p>
                )}
              </div>

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
