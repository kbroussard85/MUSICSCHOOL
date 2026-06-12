# Implementation Plan - Sprint 2: CRM Scheduling, WebRTC Metrics, & Stripe Billing Hooks

We are moving into Sprint 2 to build the automated scheduling constraints, integrate Stripe checkout and webhooks, implement a high-fidelity WebRTC diagnostic HUD, and handle failed billing freezes.

## Aligned Product & Design Specifications

Based on the interactive design review, we have aligned on the following structural choices:
1. **Enrollment Flow**: **Subscription First**. Students authorize monthly subscriptions via Stripe first, then choose their band cohort inside their dashboard. If their preferred cohort is full, they register for its waitlist.
2. **90-Day Commitment Lock**: **Contractual Terms Only**. Standard recurring billing is active, but canceling within 90 days from signup flags the account in the CRM for administrative review rather than locking them out.
3. **WebRTC Diagnostics**: **High-Fidelity HUD**. A glassmorphic overlay dashboard showing exact RTT latency, jitter in ms, packet loss, and an SLA status light (Green for <25ms, Yellow for 25-50ms, Red for >50ms).
4. **Scheduling Constraints**: **Instrument-based Registry**. Students can register for multiple cohorts *only* if they register under different instrument roles (e.g. Lead Keyboardist in one, Bassist in another) and slots do not overlap.
5. **Billing Failures**: **Glassmorphic Account Frozen View**. Inactive or past-due subscriptions redirect the user to a dedicated dashboard screen with a direct link to the Stripe Billing Portal.

---

## Proposed Changes

### 1. Database & API (CRM Scheduler)

#### [MODIFY] [packages/database/prisma/schema.prisma](file:///c:/Users/kbrou/Pictures/Saved%20Pictures/MUSIC%20SCHOOL/packages/database/prisma/schema.prisma)
- Verify `Student` and `BandCohort` relationships allow tracking of the instrument role for each student inside a cohort.
- Ensure `commitmentEndDate` is tracked on the student profile.

#### [NEW] [apps/web/src/app/api/schedule/enroll/route.ts](file:///c:/Users/kbrou/Pictures/Saved%20Pictures/MUSIC%20SCHOOL/apps/web/src/app/api/schedule/enroll/route.ts)
- Implement enrollment endpoint validating:
  - Active subscription is in place.
  - Target cohort is not capped (> 10 students).
  - Selected slot fits Tue/Wed 4:00 PM – 8:30 PM.
  - Student is not already registered in another cohort with the same instrument role.
  - Schedule does not overlap.
  - If capped, redirects/writes to the `Waitlist` model.

---

### 2. Stripe Gateway & Billing Webhooks

#### [NEW] [apps/web/src/app/api/checkout/route.ts](file:///c:/Users/kbrou/Pictures/Saved%20Pictures/MUSIC%20SCHOOL/apps/web/src/app/api/checkout/route.ts)
- Create a Stripe checkout session mapping the active logged-in student email, passing metadata to mark signup datetime.

#### [NEW] [apps/web/src/app/api/webhooks/stripe/route.ts](file:///c:/Users/kbrou/Pictures/Saved%20Pictures/MUSIC%20SCHOOL/apps/web/src/app/api/webhooks/stripe/route.ts)
- Handle webhook events:
  - `checkout.session.completed`: Mark subscription as `active` and set `commitmentEndDate` (now + 90 days).
  - `invoice.payment_failed` / `customer.subscription.deleted`: Set status to `past_due` or `canceled`. If canceling before `commitmentEndDate`, flag the account in the database.

---

### 3. Frontend Pages & WebRTC Diagnoser

#### [MODIFY] [apps/web/src/app/(dashboard)/layout.tsx](file:///c:/Users/kbrou/Pictures/Saved%20Pictures/MUSIC%20SCHOOL/apps/web/src/app/(dashboard)/layout.tsx)
- Guard access: if the resolved database profile has a subscription status of `past_due`, `unpaid`, or `canceled`, render a premium glassmorphic "Account Frozen" overlay page with direct links to Stripe Customer Billing Portal.

#### [MODIFY] [apps/web/src/hooks/useWebRTC.ts](file:///c:/Users/kbrou/Pictures/Saved%20Pictures/MUSIC%20SCHOOL/apps/web/src/hooks/useWebRTC.ts)
- Implement `getStats()` polling loop on active `RTCPeerConnection` instances.
- Extract RTT latency, jitter in ms, and packet loss metrics to expose to components.

#### [MODIFY] [apps/web/src/components/jam/JitterBuffer.tsx](file:///c:/Users/kbrou/Pictures/Saved%20Pictures/MUSIC%20SCHOOL/apps/web/src/components/jam/JitterBuffer.tsx)
- Convert mock buffer stats to consume live RTT, jitter, and packet loss statistics.
- Implement the visual SLA traffic light status badge.

#### [MODIFY] [apps/web/src/app/(dashboard)/schedule/page.tsx](file:///c:/Users/kbrou/Pictures/Saved%20Pictures/MUSIC%20SCHOOL/apps/web/src/app/(dashboard)/schedule/page.tsx)
- Replace mock roster slots with actual cohort listings fetched from DB.
- Handle active enrolment clicks, prompt for instrument role selection, and handle waitlist redirection.

---

## Verification Plan

### Automated Checks
- Verify `npm run build` succeeds with zero errors.

### Manual Verification
- Test Stripe webhook simulation using Stripe CLI to confirm checkout completion and payment failure event triggers.
- Verify scheduling blocks trigger correctly when same instrument role is registered twice.
