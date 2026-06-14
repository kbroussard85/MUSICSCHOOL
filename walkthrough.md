# Walkthrough - Sprint 3 (Unified Calendar, Cryptography, Redis Pub/Sub, & CRM Outreach HUD)

All Sprint 3 requirements have been implemented, compiled, and verified. The dashboard is now a fully secured CRM hub managing schedules, encryption pipelines, real-time message brokers, and outreach campaign SLA counters.

## Changes Made

### 1. Cryptography Pipeline (Epic 6)
- **Encryption Helper**: Created [encryption.ts](file:///c:/Users/kbrou/Pictures/Saved%20Pictures/MUSIC%20SCHOOL/apps/web/src/lib/encryption.ts) using standard Node.js `crypto` routines.
  - **AES-256-GCM symmetric encryption**: Transparently scrambles PII (names, phone numbers, emails, notes) in memory using `DATABASE_ENCRYPTION_KEY`.
  - **HMAC-SHA-256 blind indexing**: Standardizes query lookups (lowercase & trim) and generates secure, searchable hashes (`emailHash`, `phoneHash`) using `BLIND_INDEX_SECRET`.
- **Schema Updates**: Extended [schema.prisma](file:///c:/Users/kbrou/Pictures/Saved%20Pictures/MUSIC%20SCHOOL/packages/database/prisma/schema.prisma) to support `CRMLead`, `CommunicationLog`, `MasterClass`, `StaffAssignment`, `BandMember`, enums, and replaced plain student emails with `emailEncrypted` and `emailHash` columns.
- **IAM Identity Resolution**: Updated [iam.ts](file:///c:/Users/kbrou/Pictures/Saved%20Pictures/MUSIC%20SCHOOL/apps/web/src/lib/iam.ts) to lookup student credentials by computing the email blind index and querying `emailHash`, decrypting student attributes transparently upon retrieval.

### 2. Event-Driven Multi-Party Notification Array (Epic 7)
- **Redis Pub/Sub Simulator**: Built a simulated Redis Pub/Sub engine in [redis.ts](file:///c:/Users/kbrou/Pictures/Saved%20Pictures/MUSIC%20SCHOOL/apps/web/src/lib/redis.ts) utilizing a Node.js event broker model.
- **Background Worker**: Configured a polling worker thread that consumes events and dispatches asynchronous tri-party confirmations:
  - **Student/Parent**: Simulates email/text confirmation with scheduled times, coach info, and practice room links.
  - **Instructor**: Updates weekly payroll ledger logs.
  - **Admin Panel**: Dispatches database commit success codes.
  - **Rehearsal Log**: Appends all notifications cleanly to `rehearsal_emails.log`.
- **Mutation Hooks**: Integrated hooks into the assign-lesson and reschedule route handlers.

### 3. Master Calendar & Drag-and-Drop Assignment Engine (Epic 5)
- **Unified Master Grid view**: Built [schedule/page.tsx](file:///c:/Users/kbrou/Pictures/Saved%20Pictures/MUSIC%20SCHOOL/apps/web/src/app/(dashboard)/schedule/page.tsx) that pulls multi-tenant event arrays concurrently from `/api/admin/calendar/master` and visualizes Rehearsals (Emerald), Private Lessons (Indigo), and Masterclasses (Amber).
- **Drag-and-Drop matrix**: Added HTML5 drag-and-drop in [AdminDashboardClient.tsx](file:///c:/Users/kbrou/Pictures/Saved%20Pictures/MUSIC%20SCHOOL/apps/web/src/components/admin/AdminDashboardClient.tsx). Student roster blocks can be dragged and dropped directly onto instructor slots.
- **Resource conflict blocks**: The backend route `/api/admin/calendar/assign-lesson` validates instructor schedule conflicts (overlapping lessons or band rehearsals) and roster capacities, returning a `422 Unprocessable Entity` to block double-bookings.

### 4. 120-Second Campaign Outreach Queue (Epic 8)
- **Campaign Webhook API**: Created `/api/admin/outreach/lead-webhook` capturing localized advertisement inquiries, encrypting details, computing blind indexes, committing to DB, and broadcasting live events via Server-Sent Events (SSE).
- **Live Stream SSE Endpoint**: Built `/api/admin/outreach/sse` enabling live push updates to active admin dashboard consoles.
- **Alert HUD**: Added a pulsing campaign alert banner with a synthesized Audio Context chime and a live-updating countdown SLA timer (120-second target window).
- **Outreach drawer**: Created detail logging forms where coordinators log notes (encrypted on save) and schedule physical, in-person trials tracked inside the **In-Person Trial Console**.
- **Visual styling**: Standardized all elements to enforce hard corners globally.

---

## Verification & Build Results

All components compile successfully.
- Generated Prisma client successfully.
- Web app workspace builds without errors.
- Notifications append correctly to `rehearsal_emails.log`.
