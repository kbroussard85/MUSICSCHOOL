# Document ID: bmm-prd-crm-communications
# Author: John (Product Manager)

## 1. Master Calendar & Assignment Engine

### FR-1.1 (The Unified Grid View)
The Admin Dashboard must render a master calendar interface consolidating all Instructor availability matrices, active Band Rehearsals, Private Lessons, and multi-tenant Masterclasses into a single type-safe calendar layer.

### FR-1.2 (Drag-and-Drop Scheduling Handshake)
Admin operators must be able to drag a student profile block directly onto an instructor's open calendar matrix slot to execute an assignment. The system must programmatically parse structural constraints (ensuring maximum cap checks and blocking instructor cross-bookings).

## 2. Immediate Event-Driven Communication Rules

### FR-2.1 (Instant Scheduling Notifications)
The millisecond an entry is written, mutated, or removed from the database, the server must fire an asynchronous transaction event to our transactional messaging providers (e.g., Resend / Twilio).

### FR-2.2 (The Tri-Party Confirmation Sync)
Notifications must dispatch instantaneously to all affected entities:
- **The Student/Parent**: Receives detailed confirmation via email and SMS detailing the scheduled timestamp, location link, and assigned coach.
- **The Instructor**: Receives an automated dashboard and email log parameter updating their weekly studio payroll ledger metrics.
- **The System Admins**: Receives a log confirmation inside the dashboard telemetry stack.

## 3. Immediate Outreach CRM Engine (The Conversion Funnel)

### FR-3.1 (Instant Real-Time Inquiry Routing)
Web leads captured from localized advertisement variations must immediately generate an edge webhook push notification to our admin outreach queue. The platform must surface a clear alert layout requiring a response within an idealized operational target window of under 120 seconds.

### FR-3.2 (In-Person Trial Scheduling Console)
Admins must have an outreach tracking dashboard displaying open slots specifically designed to log physical, in-person baseline trial appointments.

### FR-3.3 (Secure CRM Log Note Repository)
Admin teams must have rich text field access to capture customer outreach responses, objections, scheduling callbacks, and follow-up metrics. These parameters are handled strictly by the backend application-layer encryption wrapper before executing save mutations.
