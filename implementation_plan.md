# Implementation Plan - Sprint 2: Admin Dashboard, Master Calendar & Notifications

We are extending Sprint 2 to build a secure Admin Dashboard (`/admin`) that compiles an alphabetical student roster, displays cohort and instrument fields, features an interactive Master Calendar editor, and triggers automated email dispatch logs when rescheduling events.

## User Review Required

> [!IMPORTANT]
> - **Database Schema Migration**: Adding `age` and `instrument` fields to the `Student` model to store required metadata.
> - **Server-Side Authorization Gating**: Access to `/admin` will be strictly restricted to users with the database role `ADMIN`. Unauthorized staff or students will be redirected back to their student dashboard.
> - **Automated Email Dispatch**: Rescheduling a band cohort or a private lesson will automatically invoke a mock notification service that:
>   1. Logs the email dispatch payload in the console.
>   2. Appends the email details to a local log file: `c:\Users\kbrou\Pictures\Saved Pictures\MUSIC SCHOOL\rehearsal_emails.log` for inspection and audit.

---

## Proposed Changes

### 1. Database Schema Extension

#### [MODIFY] [packages/database/prisma/schema.prisma](file:///c:/Users/kbrou/Pictures/Saved%20Pictures/MUSIC%20SCHOOL/packages/database/prisma/schema.prisma)
- Add optional fields to `Student` model:
  - `age` (Int, default 12)
  - `instrument` (String, default "Keyboard")

---

### 2. Notification System & API Handlers

#### [NEW] [apps/web/src/lib/email.ts](file:///c:/Users/kbrou/Pictures/Saved%20Pictures/MUSIC%20SCHOOL/apps/web/src/lib/email.ts)
- Create a mock email dispatcher utility that simulates sending HTML email notifications to students and instructors when slot times are rescheduled, writing output to `rehearsal_emails.log`.

#### [NEW] [apps/web/src/app/api/admin/reschedule/route.ts](file:///c:/Users/kbrou/Pictures/Saved%20Pictures/MUSIC%20SCHOOL/apps/web/src/app/api/admin/reschedule/route.ts)
- Implement POST API handler restricted to `ADMIN` users that:
  - Reschedules a `BandCohort` slot or a `PrivateLesson` datetime.
  - Queries affected students and instructors.
  - Triggers mock email alerts to both parties notifying them of the adjustment.

---

### 3. Admin Dashboard Pages & Components

#### [MODIFY] [apps/web/src/components/Sidebar.tsx](file:///c:/Users/kbrou/Pictures/Saved%20Pictures/MUSIC%20SCHOOL/apps/web/src/components/Sidebar.tsx)
- Enable the "Admin Dashboard" navigation tab pointing to `/admin` for users with role `'ADMIN'`.

#### [NEW] [apps/web/src/app/(dashboard)/admin/page.tsx](file:///c:/Users/kbrou/Pictures/Saved%20Pictures/MUSIC%20SCHOOL/apps/web/src/app/(dashboard)/admin/page.tsx)
- Create the Admin Dashboard view featuring:
  - Alphabetically sorted table list of all students (Name, Age, Cohort, Instrument, Scheduled Days & Times).
  - Client-side search and filters.
  - **Master Calendar View**: Grid layout representing weekly schedules. Shows active cohorts and private lessons.
  - **Reschedule Modal**: Overlay allowing admins to pick a target cohort/lesson, edit details, select new times, and submit the reschedule request.

---

## Verification Plan

### Automated Checks
- Verify `npm run build` succeeds after database migration to ensure type safety.

### Manual Verification
- Log in as an Admin user, select the Admin Dashboard tab.
- Click a cohort or lesson in the Master Calendar, select a new slot, and click "Submit Reschedule".
- Verify that `rehearsal_emails.log` at the root folder is created and correctly logs the notification payload addressed to the student and instructor.
