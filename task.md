# Sprint 1 Implementation Checklist

- [x] 1. Configure Root Monorepo Workspaces & Environment
  - [x] Add `"workspaces"` to root `package.json`
  - [x] Create root `.env.example`
- [x] 2. Setup Shared Packages
  - [x] Create `@harmony/database` package
  - [x] Create `@harmony/types` package (now @harmony/common)
  - [x] Create `@harmony/audio-engine` package
  - [x] Create `@harmony/ui` package (Button, Card components)
- [x] 3. Integrate into Next.js Application (`apps/web`)
  - [x] Align Prisma versions in `apps/web/package.json`
  - [x] Add shared packages dependencies to `apps/web/package.json`
  - [x] Create `apps/web/.env.example`
  - [x] Implement Auth0 IAM Role Gate Middleware in `apps/web/src/proxy.ts`
  - [x] Connect database mapping in `apps/web/src/app/(dashboard)/layout.tsx`
- [x] 4. Implement WebRTC Reliability Fixes
  - [x] Update `useWebRTC.ts` to fetch local media before socket connection
  - [x] Replace JSX `<audio autoPlay>` with programmatically managed `AudioPlayer` component in `AudioWorkspace.tsx`
  - [x] Refactor mute and visualizer logic to use single stream reference
- [x] 5. Build Verification
  - [x] Run `npm install` at root
  - [x] Generate Prisma Client bindings
  - [x] Run `npm run build` to verify clean compilation
- [x] 6. Git Commit & Push
  - [x] Commit all code changes
  - [x] Push updates to remote repository

# Sprint 2: Admin Dashboard & Calendar Editor Checklist

- [x] 7. Sprint 2: Database Schema & Core Services
  - [x] Add `age` and `instrument` to `Student` in `schema.prisma`
  - [x] Generate Prisma Client bindings
  - [x] Create mock email dispatcher utility in `apps/web/src/lib/email.ts`
  - [x] Create rescheduling API endpoint `/api/admin/reschedule`
- [x] 8. Sprint 2: Admin Interface & Rescheduling HUD
  - [x] Add Admin link in `Sidebar.tsx`
  - [x] Build `/admin` dashboard with alphabetical student roster table
  - [x] Create interactive Master Calendar schedule editor with reschedule modal
- [x] 9. Sprint 2: Verification & Git Push
  - [x] Run full build to verify compile checks
  - [x] Stage, commit, and push updates to remote repository

# Sprint 3: Unified Calendar, Encryption, Pub/Sub & Outreach HUD

- [x] 10. Cryptography Pipeline (Epic 6)
  - [x] Implement transparent encryption helpers (AES-256-GCM, HMAC-SHA-256) in `apps/web/src/lib/encryption.ts`
  - [x] Update `packages/database/prisma/schema.prisma` with new security fields & models
  - [x] Run migration and generate updated Prisma client bindings
  - [x] Update `apps/web/src/lib/iam.ts` to query by email blind index
- [x] 11. Redis Pub/Sub Tri-Party Router (Epic 7)
  - [x] Implement simulated Redis Pub/Sub in-memory queue client in `apps/web/src/lib/redis.ts`
  - [x] Intercept write events in calendar/outreach/reschedule APIs and publish to queue
  - [x] Write worker thread or background pollers to dispatch tri-party messages and log to `rehearsal_emails.log`
- [x] 12. Calendar & Drag-and-Drop Assignment (Epic 5)
  - [x] Create `POST /api/admin/calendar/assign-lesson` handling capacity / conflict checks
  - [x] Create `GET /api/admin/calendar/master` route fetching consolidated events
  - [x] Build drag-and-drop assignments inside `apps/web/src/app/(dashboard)/schedule/page.tsx`
  - [x] Cleanly differentiate and style Band Rehearsals, Private Lessons, and Masterclasses with hard-corners aesthetic
- [x] 13. SLA Outreach Pipeline & Alert HUD (Epic 8)
  - [x] Implement Edge API capturing incoming ad webhooks, computing indexes, encrypting data, and broadcasting via WS/SSE
  - [x] Integrate WebSocket / Live push dashboard updates in `AdminDashboardClient.tsx`
  - [x] Add pulsing alert anim, audio notification, and strict 120-second countdown SLA timer
- [x] 14. Verification
  - [x] Rebuild database schema and verify type safety
  - [x] Validate compile check via `npm run build`
- [x] 15. UX/UI Overhaul & Stage Music Academy Branding
  - [x] Fix syntax in `AdminDashboardClient.tsx` to restore compiling safety
  - [x] Design dynamic parallax background elements and custom keyframes in `globals.css`
  - [x] Inject global retro scanlines overlay into Root Layout
  - [x] Build fully interactive home page with AudioContext chimes, live telemetry timers, cohort selector, and roster scanner modal
  - [x] Update Master Calendar, Login, and Signup pages to use cyber-cards and neon button animations
  - [x] Validate full compilation of the workspace
- [x] 16. UX/UI Remake (Music School Focus & No Commitment)
  - [x] Strip out "retro computer tech" scanlines overlay and telemetry jargon
  - [x] Replace 90-day minimum lock policy with flexible cancel-anytime terms
  - [x] Reduce cohort levels to only Teens (13-17) and Adults (18+) Performance Bands
  - [x] Integrate live music school metronome/tempo sync monitors instead of ping telemetry
  - [x] Feature the live ensemble/stage performance motto prominently
  - [x] Validate compiling safety and rebuild successfully
- [x] 17. Access Gateway & Privacy Hardening
  - [x] Strip public landing page down to logo, motto, and Log In/Sign Up buttons
  - [x] Restrict navbar to Contact, Log In, and Sign Up (forcing authentication)
  - [x] Create authenticated `/catalog` dashboard showing programs, courses, and instructors
  - [x] Add Google & Facebook OAuth login options to signup and login cards
  - [x] Prevent any public visibility of student data (removed roster lists/scanners)
  - [x] Add Catalog navigation link inside dashboard Sidebar
  - [x] Validate production build safety and resolve all warnings
- [x] 18. Next Stage Music Academy Rebranding & Database Hookup
  - [x] Rename branding from Stage Music Academy to Next Stage Music Academy in metadata, login/signup portals, sidebar, and landing page
  - [x] Update landing page hero copy with the physical/digital performance crossover text
  - [x] Limit hero CTAs to two buttons (Log In, and highlighted "Sign up for your 3 day trial")
  - [x] Implement "Choose your band" section (Teen Rock, All Stars, Adult Jam) with hover effects
  - [x] Implement "We don't just teach notes. We teach the ecosystem of music" three-pillar layout
  - [x] Resolve Prisma database initialization by pushing schema and creating PostgreSQL `harmony_db`
  - [x] Verify compilation and connection integrity



