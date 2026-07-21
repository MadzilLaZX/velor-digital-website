# Velor Strategy Call Booking System

Website + Google Sheets + Google Calendar + Telegram + Email automation for
`velordigital.com/book`.

## Architecture

```
Browser (booking-form.tsx)
  │  GET  /api/booking/availability?appointmentType=&date=&timezone=
  │  POST /api/booking/strategy-call   (or /api/booking/emergency)
  ▼
Next.js API routes (this repo, src/app/api/booking/*)
  - Zod validation, honeypot, rate limiting, idempotency cache,
    formula-injection escaping, HMAC-signs the request
  - Holds NO Calendar/Sheets/Telegram/email credentials
  │  signed POST /availability | /strategy-call | /emergency
  ▼
n8n (self-hosted, n8n/*.json — 5 workflows, imported separately)
  - Verifies the HMAC signature
  - Google Calendar is the source of truth for availability
  - Google Sheets is the operational record (Bookings / Locks / Automation Log)
  - Sends Telegram + email notifications
  - Holds ALL credentials (Calendar, Sheets, Telegram bot, Resend)
```

Every credential (Google service account / OAuth, Telegram bot token, Resend
API key, spreadsheet ID, calendar ID) lives only in n8n's credential store or
its environment — never in this repo, never in Vercel env vars, never sent to
the browser.

## 1. Google Sheets setup

1. Create a new Google Sheets workbook named **"Velor Strategy Call
   Bookings"**.
2. Create these tabs (exact names — the workflow JSON references them):
   - `Bookings`
   - `Locks`
   - `Status Options`
   - `Configuration`
   - `Automation Log`
3. Share the sheet with the Google service account (or OAuth user) that n8n's
   Google Sheets credential will use, with **Editor** access.
4. Copy the spreadsheet ID out of the URL
   (`https://docs.google.com/spreadsheets/d/`**`THIS_PART`**`/edit`) — you'll
   paste it into every `REPLACE_WITH_SPREADSHEET_ID` placeholder across the
   5 workflow JSON files after import.

### `Bookings` tab — columns

Use these headers in row 1, in this exact order (A → AX per the spec, plus
two extra internal-tracking columns AY/AZ used by the automation only):

| Col | Heading | Col | Heading |
|---|---|---|---|
| A | Booking ID | T | Preferred Contact Method |
| B | Submitted At | U | Additional Participants |
| C | Appointment Type | V | Agreement Accepted |
| D | Status | W | Agreement Version |
| E | Meeting Date | X | Agreement Timestamp |
| F | Start Time | Y | Conflict Detected |
| G | End Time | Z | Calendar Event Created |
| H | Time Zone | AA | Calendar Event Link |
| I | Full Name | AB | Google Meet Link |
| J | Email | AC | Calendar Event ID |
| K | Phone | AD | Client Confirmation Sent |
| L | Normalized Phone | AE | Team Email Sent |
| M | Business Name | AF | Telegram Notification Sent |
| N | Business Website | AG | Rescheduled From |
| O | Service Interested In | AH | Cancellation Reason |
| P | Budget Range | AI | Internal Notes |
| Q | Project Details | AJ | Assigned To |
| R | Where Did You Hear About Us? | AK | Last Updated At |
| S | Lead Source Details | AL | Updated By |
| | | AM | Submission Source |
| | | AN | UTM Source |
| | | AO | UTM Medium |
| | | AP | UTM Campaign |
| | | AQ | UTM Content |
| | | AR | UTM Term |
| | | AS | Landing Page |
| | | AT | Referrer |
| | | AU | IP Address |
| | | AV | User Agent |
| | | AW | Automation Version |
| | | AX | Processing Error |
| | | **AY** | **Submission ID (internal)** — idempotency key, do not remove |
| | | **AZ** | **Status Change Processed** — internal, tracks last status the automation acted on |
| | | **BA** | **Retry Count** — internal, notification retry counter |

Freeze row 1, turn on filters, format A/B/E/X/AK as dates or datetimes in
Eastern Time.

### Status dropdown + conditional formatting

1. Select column D (or the whole data range `A2:BA` for full-row coloring).
2. **Data → Data validation** → dropdown with exactly: `Pending`, `Done`,
   `Cancelled`, `Rescheduled`.
3. **Format → Conditional formatting**, add 4 rules over range `A2:BA`, each
   using "Custom formula is":

| Formula | Background | Text |
|---|---|---|
| `=$D2="Pending"` | `#B38600` | white |
| `=$D2="Done"` | `#70AD57` | white |
| `=$D2="Cancelled"` | `#B32626` | white |
| `=$D2="Rescheduled"` | `#245AA8` | white |

Every new row is written with `Status = Pending` by the automation. Your team
manually changes it to `Done` / `Cancelled` / `Rescheduled`, which the Status
Change Processor workflow (04) picks up within 5 minutes and acts on
(cancels/updates the Calendar event, sends the right client email).

### `Status Options` tab

Reference-only table:

| Colour | Status | Example |
|---|---|---|
| Amber | Pending | Pending |
| Green | Done | Done |
| Red | Cancelled | Cancelled |
| Blue | Rescheduled | Rescheduled |

### `Locks` tab — columns

`slotKey | submissionId | lockedAt` — used internally by workflow 02 for
concurrency protection. Don't edit manually; rows are created and deleted
automatically within seconds of each booking attempt. If you ever see stale
rows accumulate (a workflow crashed mid-run), it's safe to clear old rows —
the lock has no meaning once `lockedAt` is more than a minute or two old.

### `Configuration` tab

Informational mirror of the scheduling env vars (edit the env vars on the
n8n instance to actually change behavior — this sheet doesn't drive logic,
it's for your team's reference):

| Setting | Value |
|---|---|
| Time Zone | America/Toronto |
| Standard Start Hour | 9 |
| Standard End Hour | 21 |
| Standard Duration Minutes | 60 |
| Buffer Minutes | 15 |
| Slot Interval Minutes | 60 |
| Minimum Notice Hours | 12 |
| Maximum Days Ahead | 60 |
| Emergency Enabled | TRUE |
| Emergency Start Hour | 8 |
| Emergency End Hour | 22 |
| Emergency Auto Confirm | FALSE |
| Default Status | Pending |
| Automation Version | 1.0.0 |

### `Automation Log` tab — columns

`Timestamp | Booking ID | Workflow Run ID | Action | Result | Attempt Number | Error | Payload Reference | Automation Version`

## 2. Google Calendar setup

1. Create a dedicated calendar named **"Velor Strategy Calls"** (separate
   from any personal calendar).
2. Share it with the Google account/service account n8n's Calendar
   credential uses, with **"Make changes to events"** permission.
3. Copy the Calendar ID (Calendar settings → Integrate calendar → Calendar
   ID, looks like `xxxxx@group.calendar.google.com`).
4. Paste it into every `REPLACE_WITH_VELOR_STRATEGY_CALLS_CALENDAR_ID`
   placeholder in the 5 workflow JSON files after import.
5. In n8n, create a **Google Calendar OAuth2** credential (or service account
   with domain-wide delegation) and attach it to every Google Calendar node
   in all 5 workflows.
6. Google Meet links are created automatically by workflow 02 via
   `conferenceDataUi` on event creation — no separate setup needed beyond
   normal Calendar API OAuth scopes (`calendar.events`).

## 3. Telegram bot setup

1. Message **@BotFather** on Telegram → `/newbot` → follow prompts → copy
   the bot token.
2. Add the bot to your team's Telegram group (or DM it directly for a
   1:1 alert channel).
3. Get the chat ID: send any message in the group, then visit
   `https://api.telegram.org/bot<TOKEN>/getUpdates` and read `chat.id` from
   the response (group chat IDs are negative numbers).
4. In n8n, create a **Telegram API** credential with the bot token, attach it
   to every Telegram node in workflows 02/03/04/05.
5. Set the n8n environment variable `TELEGRAM_CHAT_ID` to the chat ID from
   step 3.

## 4. Email (Resend) setup

1. Create a Resend account, verify the `velordigital.com` sending domain
   (SPF/DKIM records).
2. Create an API key, add it as an n8n **HTTP Header Auth** credential:
   header name `Authorization`, value `Bearer <RESEND_API_KEY>`. Attach it
   to every "Resend: …" HTTP Request node.
3. Set the n8n environment variable `VELOR_NOTIFICATION_EMAILS` to a
   comma-separated list, e.g. `zaber@velordigital.com,ishaat@velordigital.com`.

## 5. n8n setup

1. Import all 5 files from `n8n/` (Workflows → Import from File):
   - `01-availability-check.json`
   - `02-standard-booking.json`
   - `03-emergency-request.json`
   - `04-status-change-processor.json`
   - `05-retry-failed-notifications.json`
2. In each workflow, replace every `REPLACE_WITH_SPREADSHEET_ID` and
   `REPLACE_WITH_VELOR_STRATEGY_CALLS_CALENDAR_ID` placeholder.
3. Attach credentials: Google Sheets OAuth2 (or service account), Google
   Calendar OAuth2, Telegram API, and the Resend HTTP Header Auth credential
   to their respective nodes.
4. Set these environment variables on the n8n instance itself (docker-compose
   `environment:` block, or your hosting panel's env var settings — **not**
   in this repo):

   ```
   N8N_WEBHOOK_SHARED_SECRET=<same value as the website's env var>
   NODE_FUNCTION_ALLOW_BUILTIN=crypto
   TELEGRAM_CHAT_ID=<from Telegram setup>
   VELOR_NOTIFICATION_EMAILS=zaber@velordigital.com,ishaat@velordigital.com
   VELOR_TEAM_ATTENDEE_EMAILS=zaber@velordigital.com,ishaat@velordigital.com
   BOOKING_TIMEZONE=America/Toronto
   STANDARD_MEETING_DURATION_MINUTES=60
   STANDARD_MEETING_BUFFER_MINUTES=15
   EMERGENCY_DURATION_MINUTES=60
   ```

   These should mirror the website's own env vars (section 6) so the slot
   math on both sides agrees.
5. Activate all 5 workflows.
6. Copy each workflow's production webhook URL base (they all share the
   same n8n instance, just different paths — `/webhook/availability`,
   `/webhook/strategy-call`, `/webhook/emergency`). Set the website's
   `N8N_BOOKING_WEBHOOK_URL` to the instance's webhook root, e.g.
   `https://your-n8n-host.example.com/webhook` (the app appends
   `/availability`, `/strategy-call`, `/emergency` itself).

## 6. Website environment variables

See `.env.example` for the full list. Minimum required to go live:

```
N8N_BOOKING_WEBHOOK_URL=https://your-n8n-host.example.com/webhook
N8N_WEBHOOK_SHARED_SECRET=<matches the n8n env var above>
```

Everything else (`BOOKING_TIMEZONE`, `STANDARD_MEETING_DURATION_MINUTES`,
etc.) has a working default in `src/lib/booking-config.ts` and only needs to
be set if you want to override it.

**Without `N8N_BOOKING_WEBHOOK_URL` set**, the availability endpoint falls
back to returning ungated candidate slots (`calendarChecked: false` in the
response) so local development still works, and the submission endpoints
return a clear `BOOKING_BACKEND_NOT_CONFIGURED` error instead of silently
pretending to succeed. **Do not deploy to production without this var set** —
acceptance criteria requires a real Calendar check before slots are offered.

## 7. Test plan

Run through this checklist against a staging n8n workflow + a test Google
Calendar/Sheet before pointing production traffic at it.

**Form validation**
- [ ] Submitting with any required field empty shows the field-level error
      and does not call the API.
- [ ] Agreement checkbox is mandatory — submit is blocked without it.
- [ ] Selecting "Other" for lead source reveals and requires the detail field.
- [ ] Standard vs. emergency toggle changes required fields (emergency
      requires `emergencyDetails`, ≥10 chars).

**Availability**
- [ ] `GET /api/booking/availability?appointmentType=standard&date=<tomorrow>&timezone=America/Toronto`
      returns hourly slots from 9 AM through 8 PM (last start, given a
      60-min meeting and a 9 PM boundary).
- [ ] A date less than `MINIMUM_BOOKING_NOTICE_HOURS` away returns fewer/no
      slots for the very next hours.
- [ ] A date beyond `MAXIMUM_BOOKING_DAYS_AHEAD` returns an empty slot list.
- [ ] Booking an event directly on the "Velor Strategy Calls" Calendar for
      2–3 PM tomorrow, then querying availability for that date, excludes
      2–3 PM (and the 15-min buffer after it) from the results.

**Booking submission**
- [ ] A valid standard submission creates exactly one row in `Bookings`
      (Status = Pending, amber), one Calendar event with a Meet link, and
      triggers Telegram + both emails.
- [ ] Submitting the exact same `submissionId` twice (simulate a double
      click / retry) does not create a second row or a second Calendar event
      — the second response echoes the first result.
- [ ] Two browser tabs submitting the same date/time within a few seconds of
      each other: exactly one succeeds, the other receives
      `SLOT_NO_LONGER_AVAILABLE` and the UI shows the "just booked" message
      and refreshes slots.
- [ ] A value like `=SUM(A1:A9)` typed into Project Details is stored in the
      sheet as literal text (prefixed with `'`), not evaluated as a formula.

**Emergency requests**
- [ ] An emergency submission creates a Pending row with
      `Calendar Event Created = No`, sends the urgent Telegram + team email,
      and the client receives the "not confirmed yet" email — never a
      confirmation.
- [ ] Requesting a time that overlaps an existing Calendar event sets
      `Conflict Detected = Yes` and the Telegram/email both call it out.

**Status changes** (edit the sheet directly to simulate your team's actions)
- [ ] Setting Status → `Cancelled` (within 5 min) deletes the Calendar event,
      sends the client a cancellation email, and turns the row red.
- [ ] Setting Status → `Rescheduled` after updating Meeting Date/Start Time
      updates the existing Calendar event (no duplicate), sends the
      reschedule email, and turns the row blue.
- [ ] Setting Status → `Done` turns the row green and does not email the
      client.

**Reliability**
- [ ] Temporarily break the Telegram credential — the booking still
      completes (Sheet row + Calendar event + emails), `Telegram Notification
      Sent = No`, and workflow 05 retries it within 30 minutes once the
      credential is fixed.
- [ ] `N8N_BOOKING_WEBHOOK_URL` unset on the website → submission returns a
      clean, non-technical error to the user, no crash.

## 8. Deployment

1. Push this repo to `main` (or your deploy branch).
2. In Vercel, import the project (or redeploy if already linked), set the
   env vars from `.env.example` section 6 in Project Settings → Environment
   Variables (Production + Preview).
3. Point `velordigital.com` at the Vercel deployment (already documented in
   the repo's own README under "Domain + hosting").
4. Deploy the n8n workflows first (section 5) and confirm workflow 01
   responds correctly via `curl` before deploying the website — otherwise
   the site's availability endpoint will run in the unguarded dev fallback
   mode in production.
5. Smoke-test `/book` end-to-end in production with a real (test) submission
   before announcing the launch.

## 9. Rollback

- **Website:** revert the deploy in Vercel (Deployments → previous
  deployment → "Promote to Production"), or `git revert` the merge commit
  and redeploy. The booking form fails safe — if `N8N_BOOKING_WEBHOOK_URL`
  is removed/invalid, users see a clear "booking is not yet connected"
  message rather than a broken page.
- **n8n:** deactivate the 5 workflows (toggle "Active" off) to stop
  processing new submissions without deleting anything; the website will
  then surface `SUBMISSION_FAILED` / `502` errors, which is the intended
  fail-safe rather than silent data loss.
- **Data:** the `Bookings` sheet is append-only from the automation's side —
  rolling back code never deletes rows. If a bad deploy created malformed
  rows, fix them manually in the sheet; there's no destructive migration to
  undo.

## Files created / modified

**New**
- `src/lib/booking-config.ts` — central service/budget/lead-source/scheduling config
- `src/lib/validations/booking.ts` — rewritten Zod schema (was already present, fully replaced)
- `src/lib/server/timezone.ts`, `slots.ts`, `rate-limit.ts`, `idempotency.ts`,
  `sheet-sanitize.ts`, `n8n-client.ts`, `booking-id.ts`, `booking-submit.ts`
- `src/app/api/booking/availability/route.ts`
- `src/app/api/booking/strategy-call/route.ts`
- `src/app/api/booking/emergency/route.ts`
- `n8n/01-availability-check.json` … `n8n/05-retry-failed-notifications.json`
- `docs/BOOKING_SYSTEM.md` (this file)

**Modified**
- `src/components/sections/booking-form.tsx` — new fields, live availability,
  standard/emergency split, agreement/lead-source UI
- `src/components/ui/time-slot-picker.tsx` — now driven by live availability
  data instead of a static list
- `src/components/sections/booking-section.tsx`, `src/app/book/page.tsx` —
  duration copy updated from "20 minutes" to "approximately 45–60 minutes"
- `.env.example` — booking backend + scheduling env vars documented
