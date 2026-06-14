# Implementation Plan - CRM Communications & Database Encryption (Combined Spec)

This plan integrates the database extensions and transparent application-layer encryption (from Winston's architecture) with the unified calendar grid, drag-and-drop scheduling, and real-time CRM outreach queue (from John's PRD).

## User Review Required

> [!IMPORTANT]
> - **Schema Integration**: We will update the schema to include `CRMLead`, `CommunicationLog`, `MasterClass`, `StaffAssignment`, and `BandMember`. To preserve existing system functionality (such as authentication and user profile access), we will keep `userId` and `role` on `Staff`, and `cohortId` on `Student` as a primary cohort reference, alongside many-to-many structures.
> - **Encryption & Blind Indexes**: Emails, phone numbers, parent contact details, and note fields will be encrypted transparently using `PROCESS_ENV_ENCRYPTION_KEY` (AES-256-GCM). Deterministic blind indexes (HMAC-SHA-256) will enable database-level search indexing for encrypted fields.
> - **Drag-and-Drop Scheduling**: Adding HTML5 Drag and Drop capability to the Admin Calendar grid to drag students onto slots.
> - **CRM Outreach Queue**: Adding a new outreach panel in the Admin Dashboard tracking localized advertisement web leads with an operational target SLA of under 120 seconds.
> - **Tri-Party Confirmation Sync**: On mutations, we will fire automated transactional events that output simulated messages (SMS/Email) to the student, parent, instructor, and log them to `rehearsal_emails.log`.

## Open Questions

> [!NOTE]
> - **Database Encryption Key**: We'll define a development default key (e.g. `fallback-dev-key-32-chars-length!!`) in `.env` if `PROCESS_ENV_ENCRYPTION_KEY` is not set. Is this approach acceptable for development?
> - **Mock Web Leads**: We will seed some mock CRM leads in development to display in the outreach queue (with some created < 2 minutes ago to test the active SLA timer).

## Proposed Changes

### 1. Cryptography Infrastructure

#### [NEW] [encryption.ts](file:///c:/Users/kbrou/Pictures/Saved%20Pictures/MUSIC%20SCHOOL/apps/web/src/lib/encryption.ts)
- Create transparent encryption helpers using AES-256-GCM and HMAC-SHA-256:
  - `encryptText(plainText: string): string`
  - `decryptText(cipherText: string): string`
  - `getBlindIndex(text: string): string`
  - Uses `PROCESS_ENV_ENCRYPTION_KEY` from environment variables.

### 2. Prisma Database Schema Extensions

#### [MODIFY] [schema.prisma](file:///c:/Users/kbrou/Pictures/Saved%20Pictures/MUSIC%20SCHOOL/packages/database/prisma/schema.prisma)
- Add enums `CommunicationType` and `LeadStatus`.
- Refactor `Student` model:
  - Keep `email` (or rename to `emailEncrypted` and add `emailHash` for blind indexing). To prevent Auth0 disruption, we will query `emailHash` during sign-in using `getBlindIndex(email)`.
  - Add `parentEmailEnc` and `bandAssignments BandMember[]`.
- Refactor `Staff` model:
  - Add `firstName`, `lastName`, and `isActive` flag.
  - Set up relations `assignments StaffAssignment[]`, `directedBands BandCohort[]`, `privateLessons PrivateLesson[]`, `masterClasses MasterClassInstructor[]`.
- Add new models:
  - `StaffAssignment`: Join model mapping Staff to Hubs.
  - `BandMember`: Join model mapping Students to BandCohorts.
  - `CRMLead`: outreach lead records with encrypted details (`parentNameEncrypted`, `phoneEncrypted`, `notesEncrypted`) and a phone search index (`phoneHash`).
  - `CommunicationLog`: Log interaction history w/ encrypted summaries.
  - `MasterClass`, `MasterClassInstructor`, `MasterClassAttendee`: Multi-tenant clinics scheduling.

### 3. Identity and Profile Access

#### [MODIFY] [iam.ts](file:///c:/Users/kbrou/Pictures/Saved%20Pictures/MUSIC%20SCHOOL/apps/web/src/lib/iam.ts)
- Update profile lookups to resolve student emails by generating the blind index hash and querying `emailHash`.
- Decrypt profiles transparently before returning user claims.

### 4. API Endpoints

#### [MODIFY] [/api/admin/reschedule/route.ts](file:///c:/Users/kbrou/Pictures/Saved%20Pictures/MUSIC%20SCHOOL/apps/web/src/app/api/admin/reschedule/route.ts) (or create new if it is in an existing page)
- We will find the rescheduling API endpoint. Let's verify where `/api/admin/reschedule` is implemented. If it is a separate route file, we will modify it to handle CRM/encryption-safe writes and fire the notification hook.
- Create `/api/admin/outreach` to handle lead creations and saving rich text log notes.

### 5. Admin Calendar & Outreach Console

#### [MODIFY] [AdminDashboardClient.tsx](file:///c:/Users/kbrou/Pictures/Saved%20Pictures/MUSIC%20SCHOOL/apps/web/src/components/admin/AdminDashboardClient.tsx)
- **Drag-and-Drop**:
  - Add HTML5 draggable attributes to students in the roster list.
  - Make calendar grid cells drop targets. When a student is dropped on a cell:
    - Validate cohort capacity (cap at 10 students).
    - Validate instructor booking (block cross-bookings/instructor conflict).
    - Trigger confirmation and save to database.
- **Outreach Queue**:
  - Render an "Admin Outreach Queue" section listing incoming web leads.
  - Include an interactive alert box tracking elapsed time relative to the 120-second target operational window.
  - Provide an outreach detail drawer where admins can log responses and callback schedules. Notes will be encrypted transparently on save.
- **In-Person Trial Console**:
  - Show a scheduler dedicated specifically to logging physical, in-person baseline trials.

### 6. Notifications and Logging Telemetry

#### [MODIFY] [email.ts](file:///c:/Users/kbrou/Pictures/Saved%20Pictures/MUSIC%20SCHOOL/apps/web/src/lib/email.ts)
- Enhance the transaction hooks so any database mutation immediately triggers a simulated email/SMS dispatch to:
  1. The student/parent (schedule confirmation details).
  2. The instructor (payroll/metrics updates).
  3. The system admin log file (`rehearsal_emails.log`).

---

## Verification Plan

### Automated Tests
- Run `npx prisma generate` to rebuild TypeScript client types.
- Run `npm run build` to verify compiling safety.

### Manual Verification
- Log in to the admin panel, drag a student card onto a calendar slot, and verify the capacity and cross-booking checks.
- Add an outreach log note and verify that the data gets encrypted.
- Verify that scheduling notifications are appended to `rehearsal_emails.log`.
