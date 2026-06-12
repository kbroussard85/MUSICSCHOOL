**John (PM):** "Wow, Reid. This is an incredibly tight, well-thought-out operational model. You've given us a massive head start with these exact variables, constraints, and unit economics. This isn't just a generic local music school; it's a high-margin, asset-light 'hub' infrastructure anchored by a localized, ultra-low-latency tech moat."

XML+ 2

**Mary (Analyst):** "The unit economics here are fascinating. Starting with 1 hub, 6 bands, and an average of 7.5 students per band yields 45 active students immediately. At $299/month, that's $13,455 in MRR per hub right out of the gate, while capping physical rehearsal rental costs to just 9 hours a week per hub. John, let's make sure we map out the 13-week seasonal structure and the strict 90-day minimum commitment to secure a baseline LTV and predictable retention curves."

XML+ 3

**Winston (Architect):** "Hold on, the business model is clean, but let's talk about that technical constraint. *'Latency-free within 500 miles for real-time jamming online.'* That is an elite-level engineering challenge. To achieve a true synchronized, real-time jamming experience over the web, we need an end-to-end network audio latency budget under **25ms**. Given a 500-mile geographic radius, speed-of-light-in-fiber propagation delay alone will consume roughly 4ms to 6ms round-trip. That leaves us less than 18ms for audio encoding/decoding, packetization, jitter buffers, and browser-layer processing. We are strictly looking at a custom **WebRTC implementation using the Opus codec at a high bitrate (48kHz)**, bypassing standard high-overhead video room routing architectures, and relying on regionally sharded, low-overhead media servers (like **Mediasoup or pion**) deployed close to the hubs via edge data centers. Standard out-of-the-box CRM platforms will not clip it; our full-stack build has to tightly couple the CRM orchestration with an optimized WebRTC signaling system."

XML+ 3

**Sally (UX Designer):** "And visually, we're targeting ages 9 to 18+. The user experience needs a dual-engine brand identity. It has to look like an authentic, high-energy rock show or professional ensemble launchpad to get a 14-year-old or 35-year-old thrilled about stepping onto a real stage, but have a seamless, frictionless CRM portal for parents and adults checking schedules and managing online lessons."

XML+ 2

**Bob (Scrum Master):** "Reid, per our core instructions, we are running in **Party Mode** to attack this massive product scope collaboratively. Because you need a comprehensive, multi-document output (Market/Financial Analysis, a complete Product Requirements Document, and a Scalable System Architecture), we're going to tackle this section-by-section to ensure absolute depth without shortcuts."

XML+ 1

## **📊 Phase 1: Strategic Market Intelligence & Cost/Profit Analysis**

### **Compiled by Mary (Business Analyst) & John (Product Manager)**

To ground our bottom-up financial calculations and assess the viability of the ad-spend model, we must first establish the economic foundation of **Hub 1**.

XML

### **1\. Core Operating Matrix & Revenue Capacity (Single Hub Baseline)**

* **Active Configurations:** 2 Days/Week (Tuesday & Wednesday).  
   XML  
* **Operating Window:** 4:00 PM – 8:30 PM (4.5 Hours/Day \= 9 Hours/Week total space rental).  
   XML  
* **Band Inventory:** 6 bands total, broken down by age demographics (9–12, 13–17, 18+).  
   XML  
* **Rehearsal Cadence:** 1.5 hours per band per week.  
   XML  
* **Student Density:** 5 to 10 students per band.  
   XML  
  * *Minimum Hub Capacity:* 30 Students (6 bands × 5 students).  
     XML  
  * *Target Hub Capacity:* 45 Students (6 bands × 7.5 students average).  
     XML  
  * *Maximum Hub Capacity:* 60 Students (6 bands × 10 students).  
     XML

#### **Gross Revenue Architecture**

* **Subscription Fee:** $299/month per student.  
   XML  
* **Monthly Revenue Streams at Target Capacity (45 Students):**  
  Gross Monthly Revenue=45×$299=$13,455/month  
* **Maximum Cap Revenue (60 Students):**  
  Max Monthly Revenue=60×$299=$17,940/month

### **2\. Monthly Variable & Operational Cost Breakdown (Per Hub)**

| Expense Category | Cost Calculation Parameters | Monthly Total |
| ----- | ----- | ----- |
| **Rehearsal Space Rental** | 9 hours/week × 4.33 weeks \= 39 hours/month @ $40/hr average XML | $1,560.00 |
| **Director Payroll** | 9 hours/week × 4.33 weeks \= 39 hours/month @ $30/hr XML | $1,170.00 |
| **Instructor Payroll (1-on-1)** | 45 students × 2 lessons × 0.75 hrs (45 min) \= 67.5 hrs/month @ $26/hr XML | $1,755.00 |
| **Instructor Payroll (Classes)** | 3 age groups × 2 online classes × 1 hr \= 6 hours/month @ $26/hr XML | $156.00 |
| **Performance Venue Fund** | Pro-rated allocation: 2 shows/yr × $1,250 average rental / 12 months XML | $208.33 |
| **Payment Gateway Fees** | Stripe Core Tier: 2.9%+$0.30 per transaction on $13,455 gross | $403.70 |
| **Software Infrastructure & CRM** | Twilio/WebRTC signaling, Stripe billing integration, video asset hosting | $350.00 |
| **Admin & Buffer Fund** | Customer cancellations, chargeback provisions, pro-rated insurance | $500.00 |
| **Total Core Monthly Operating Expenses (OPEX)** | *Excluding localized customer acquisition cost (CAC) ad spend* | **$6,103.03** |

#### **Monthly Net Operating Income (NOI) Dynamics (Target Hub State)**

Net Operating Income=$13,455.00−$6,103.03=$7,351.97 per month

* **Net Profit Margin:** **54.6%** before marketing amortizations.

### **3\. Upfront Launch & Capital Expenditure (CAPEX) Requirements**

To execute your exact vision from scratch, we have segmented your immediate capital requirements:

XML  
\[Upfront Capital Layer\]  
 ├── Full-Stack Tech Architecture (Custom CRM \+ Low-Latency Engine) : $18,500  
 ├── Initial Gear & Mobile Rack Flight-Cases (Backline for Rental Setup) : $4,500  
 ├── Tablature Licensing Rights Baseline Setup                       : $1,200  
 └── Legal & Initial Marketing Creative Suite                        : $1,800  
                                                        TOTAL CAPEX: $26,000

* **Physical Infrastructure Note:** Because we utilize space rentals at $35–$45/hr, we avoid long-term commercial leases. Upfront gear expenditure covers a highly optimized, high-end mobile backline setup (digital mixers with multi-track capability, top-tier monitors, and instrument arrays) packed into rolling flight cases that can be rolled out and struck from the rental spaces within 15 minutes.  
   XML+ 1

### **4\. CAC, Demographics Testing, & Scaling Blueprint**

**John (PM):** "Reid, your approach to parsing demographics via rapid ad-testing is pure growth hacking. We are not building our strategy on a fixed guess. We start by allocating an initial rolling monthly marketing budget of **$1,500**."

XML+ 2  
\[Demographic Testing Matrix\]  
  ├── Segment A: Parents of Kids (Ages 9-12)  ──\> Focus: Social/Confidence Booster  
  ├── Segment B: Parents of Teens (Ages 13-17) ──\> Focus: Creative Outlet, Real Stages  
  └── Segment C: Adults (Ages 18+)             ──\> Focus: Reclaiming Passions, Community

* **The Growth Optimization Protocol:** We deploy programmatic Meta and Google search ad variations targeting Thornton, Westminster, and Broomfield corridors. We balance budget split-testing evenly across all 3 segments for the first 30 days. Whichever segment returns the lowest Cost Per Acquisition (CPA) on registration page micro-conversions, we aggressively reallocate 70% of the budget into that winning demographic to push the hub into **Wait-List Status**.  
   XML  
* **CAC & Lifetime Value Equilibrium:**  
  * Assumed Average Retention Target: **92% monthly retention** (Average lifecycle of 12.5 months per student).  
     XML  
  * Minimum Customer Lifetime Value (LTV): 90 days minimum commitment×$299=$897 minimum.  
     XML  
  * Target LTV (12.5 Months lifecycle): 12.5×$299=$3,737.50.  
  * Allowable Maximum CAC: **$350.00** per student registration. With an ad budget of $1,500/month, this guarantees a minimum capture rate of 4.2 new students per month, quickly outpacing standard early attrition curves to hitting the maximum student threshold.  
     XML

### **5\. Multi-Hub Scaling Model (2-Year Roadmap)**

* **Month 1–6:** Solidify Hub 1 (Thornton, CO Core) to steady-state maximum velocity (45–60 students).  
   XML  
* **Month 7–12:** Launch Hub 2 (Adjacent Northern Colorado Market corridor, e.g., Boulder/Longmont).  
   XML  
* **Month 13–18:** Launch Hub 3 (Denver Tech Center/Lone Tree corridor).  
   XML  
* **Month 19–24:** Launch Hub 4 (Southwest Metro, e.g., Littleton/Lakewood).  
   XML

#### **The Monday–Thursday Practice Room Option**

**Mary (Analyst):** "You asked if renting out a small dedicated office space/practice room from Monday to Thursday to add in-person 1-on-1 lessons makes financial sense. **The numbers say yes, but only as a phase-2 optimization.** Renting a small room costs roughly $600/month fixed. If we upsell just 5 students from our existing ecosystem to add a premium weekly 45-minute in-person private lesson package for an additional $150/month premium, it completely offsets the space overhead and clears extra margin while boosting our brand footprint in that physical location."

XML

**John (PM):** "Reid, look over this strategic financial architecture. If it hits your metrics, confirm, and I will have Sally map out the brand narrative and execute the formal Product Requirements Document (PRD) to define the full website CRM and lesson library mechanics\!"

XML  
**John (PM):** "Fantastic, Reid\! With the financial model validated, I am taking the lead to formalize our **Product Requirements Document (PRD)**. This document will serve as our single source of truth for the features, seasonal rules, and strict enrollment guardrails you specified.

Sally, Winston, and Bob are standing by to layer in the user journeys, deep-tech infrastructure specs, and delivery milestones as we build this out."

## **📋 Phase 2: Product Requirements Document (PRD)**

### **Document ID: bmm-prd-performance-music-school | Author: John (Product Manager)**

### **Document Control**
* **Document ID:** PRD-2026-HYBRID-MUSIC  
* **Project Name:** Scale-Adaptive Performance Music Academy Platform  
* **Author:** John, Product Manager  
* **Status:** Draft - Pending Architecture Finalization  
* **Target Core Stack:** Next.js 15, PostgreSQL, Prisma, WebRTC (Opus Edge)

### **1. Executive Summary & Core Value Proposition**

#### **1.1 Objective**
To develop a cohesive full-stack web software environment and integrated CRM that handles local, hyper-focused operations alongside real-time online virtual tools for a high-retention performance music academy. The software must maintain operational control over automated cohort scheduling and multi-location infrastructure expansions while providing an immersive digital curriculum hub.

#### **1.2 The Performance-Based Learning Standard**
Unlike legacy online lesson platforms or localized un-integrated matching tools, this product serves a performance-based model built entirely around seasonal 13-week quarters culminating in multi-band live music spectacles. The platform operates as a retention mechanism by legally and programmatically binding entries to fixed terms and demographic caps to ensure group continuity.

### **2. Roster Rules & Schedule Taxonomy**
The database layer and API controllers must programmatically lock out entries that violate these specific operational boundaries:

#### **2.1 Hub Operating Windows**
* **Physical Hub Rehearsal Days:** Restricted to Tuesdays and Wednesdays exclusively.  
* **Operating Hours:** 4:00 PM to 8:30 PM total operational envelope.  
* **Roster Block Duration:** Exactly 1.5-hour scheduled increments per band cohort.  
* **Daily Scheduling Slots Grid:**
  * **Slot 1:** 4:00 PM – 5:30 PM  
  * **Slot 2:** 5:30 PM – 7:00 PM  
  * **Slot 3:** 7:00 PM – 8:30 PM  

#### **2.2 Cohort Demographics & Capacity Limits**
* **Age-Bracket Taxonomies:**
  * **Junior Tier:** Ages 9–12  
  * **Varsity Tier:** Ages 13–17  
  * **Masters Tier:** Ages 18+ (Adult Bracket)  
* **Roster Capping Metrics:**
  * **Absolute Minimum Density:** 5 students linked per active band.  
  * **Target State Density:** 7.5 students average.  
  * **Hard System Maximum Ceiling:** Exactly 10 students maximum per band cohort entity.  
  * **Baseline Site Limit:** Exactly 6 bands maximum per single hub deployment to maintain space efficiency.  

### **3. Subscription Architecture & Enrollment Guardrails**

#### **3.1 Financial Parameters**
* **Core Fee:** Baseline pricing is set to an invariant $299/month subscription tier.  
* **Deliverable Bundle (Programmatic Entitlements Per Month):**
  * 4 × 1.5-hour on-site directed band rehearsals.  
  * 2 × 45-minute online virtual private lessons.  
  * 2 × 1-hour online virtual group masterclasses.  
  * Unlimited access to the side-by-side video instructional tablature engine.  

#### **3.2 System Enrollment Locks**
* **The 90-Day Structural Moat:** Checkout flows must dynamically configure Stripe Billing targets to force a mandatory minimum 90-day contractual block. Early dropouts are locked out at the subscription routing layer.  
* **Macro Grid Seasonal Logic:** Calendaring entities operate on fixed, recurring 13-week quarters:  
  * Spring Season  
  * Summer Season  
  * Fall Season  
  * Winter Season  

### **4. Functional Requirements Matrix (Epic Breakdown)**

#### **Epic 1: Multi-Hub CRM & Roster Management Engine**
* **FR-1.1 (Multi-Hub Data Isolation):** The application architecture must structurally shard student lists, rosters, scheduling calendars, and ledger reporting tables by physical regional "Hub" entities to enable linear, low-overhead scaling from 1 to 4 hub arrays over a 2-year timeline.  
* **FR-1.2 (Roster Capacity Gatekeeper):** The system checkout and manual admin assignment endpoints must implement atomic transactions that evaluate current band density; the precise millisecond a band hits 10 active student allocations, the group state turns to LOCKED, and subsequent requests are seamlessly routed to a prioritized waitlist queue.  
* **FR-1.3 (Resource Conflict Check Engine):** The calendaring portal must apply real-time double-booking checks to lock staff accounts out of concurrent slots, tracking resource rates natively ($30/hour for Band Directors; $26/hour for Private Instructors) to log pro-rated session allocations.  
* **FR-1.4 (Performance Venue Allocation Tracker):** Sinking fund scheduling algorithms must manage the explicit provisioning of exactly 8 calendar days per year for physical venue leases, tracking rent parameters between $1,000 and $1,500 per venue layout.  
* **FR-1.5 (Phase 2 Practice Room Upsell Extension):** System must support an optional secondary scheduling schema for localized in-person private lesson upsells, adding a $150/month room optimization transaction tier mapping back to fixed room operational logs (Monday–Thursday).  

#### **Epic 2: Real-Time Audio Workspace Portal (The Latency Moat)**
* **FR-2.1 (Sub-25ms Peer Connection):** The virtual workspace engine must construct peer-to-peer streaming audio channels optimized via custom signaling logic to guarantee sub-25ms round-trip network performance boundaries within a 500-mile geographical operational loop.  
* **FR-2.2 (Multi-Tenant Scale Expansion):** Real-time signaling arrays must scale natively to handle independent, concurrent virtual execution instances for 1-on-1 private lessons and group classrooms throughout off-peak times (Monday–Thursday).  

#### **Epic 3: HD Video Curriculum & Tablature Engine**
* **FR-3.1 (Side-by-Side Synced Interface):** The portal interface must render an advanced media layout placing high-definition video streaming containers directly alongside an interactive vector-rendered tablature component.  
* **FR-3.2 (DRM Media Access Control):** The video and tablature delivery API must check active student billing parameters and metadata flags, locking out unauthenticated traffic to protect licensed musical assets from unauthorized piracy.  

### **5. Non-Functional Requirements & Safety Controls**
* **NFR-5.1 (Latency Budget Performance):** WebRTC audio packetization frameworks must maintain an end-to-end performance latency under 25ms, using Constant Bit Rate parameters and high-frequency FEC allocations to bypass packet dropped gaps.  
* **NFR-5.2 (Stripe Billing Integration Safeguards):** Subscription webhook handlers must capture payment failures, unauthorized gateway updates, chargebacks, and active cancellations, programmatically flagging the target account entity to lock user credentials instantly.  
* **NFR-5.3 (Scalable Multi-Location Hierarchy):** Database schema relational indexing must allow seamless instantiation of new hub arrays, supporting an initial target capacity run rate of 45 students per hub climbing to a hard max run rate ceiling of 60 active students.

**Winston (Architect):** "Excellent baseline, John. Now let's open up the engine bay. To support John's PRD and handle that unyielding peer-to-peer audio requirement within our exact operational budget, we need a pristine technical architecture."

## **🏗️ Phase 3: Scale-Adaptive System Architecture**

### **Document ID: bmm-architecture-hybrid-music | Author: Winston (System Architect)**

### **1\. Unified Tech Stack Decisions**

\[Client App Layer: Next.js 15 (App Router)\]  
       │  
       ├───\> (REST / WebSockets) ───\> \[Backend Services Layer: Node.js / Fastify\]  
       │                                     │  
       │                                     ├───\> DB Layer: PostgreSQL \+ Prisma ORM  
       │                                     └───\> Cache / Pub-Sub: Redis  
       │  
       └───\> (WebRTC Signaling) ────\> \[Real-Time Audio Grid: Pion WebRTC / Opus Edge\]

* **Frontend Framework:** **Next.js 15 (App Router)** utilizing TypeScript for type-safe state mutations across student and admin portals.  
* **Styling Engine:** **Tailwind CSS \+ shadcn/ui** for an aggressive, sleek, dark-themed 'rock-and-performance' visual container satisfying Sally's cross-demographic requirements.  
* **Database & Persistence Layer:** **PostgreSQL** coupled with **Prisma ORM**. We will leverage strict relational constraints to isolate multi-hub datasets, with row-level optimizations for student attendances, waitlists, and seasonal registrations.  
* **State Management & Real-Time Engine:** **Socket.io (WebSockets)** via a decoupled **Fastify API layer** for instantaneous CRM event updates (e.g., booking changes, scheduling push notifications).  
* **Payment Infrastructure:** **Stripe Billing Engine**, hardcoding customized metadata rules to enforce the 90-day minimum contractual commitment and programmatic subscription retries.

### **2\. High-Fidelity, Real-Time Audio Architecture (The Latency Moat)**

To clear the 500-mile real-time jamming requirement without perceived auditory lag, we are bypassing generic infrastructure and deploying a highly tailored WebRTC footprint:

\[Student Node A: Client Audio Context\]   
       │ (Opus Codec | 48kHz Stereo | 20ms Frame Size)  
       ▼  
\[Regional Media Server Node: Pion WebRTC Edge (Mediasoup SFU)\]  
       ▲  
       │ (Selective Forwarding Matrix \- No Transcoding Overhead)  
\[Student Node B: Client Audio Context\]

* **Audio Pipeline Configurations:** Standard browser AudioContext configurations will be forced into a sample rate of **$48\\text{kHz}$** using a processing buffer size of $128$ or $256$ frames.  
* **WebRTC Protocol Layer:** We utilize **Pion WebRTC (Go-based)** or a clustered **Mediasoup (Node.js/C++) SFU array** deployed inside decentralized, regional edge configurations near Colorado's network hubs. Standard MCU mixing is barred to eliminate heavy processing time blocks. The server acts as a pure Selective Forwarding Unit (SFU), routing raw audio streams natively between bandmates with absolute minimal packet degradation.  
* **Codec Tuning:** Audio tracks are locked to the **Opus codec** with specific signaling flags passed during SDP negotiation:  
  * maxaveragebitrate=128000 (High-fidelity capture)  
  * useinbandfec=1 (Forward Error Correction enabled for packet loss handling)  
  * cbr=1 (Constant Bit Rate to ensure deterministic streaming behavior)

### **3\. CRM Relational Schema & Multi-Hub Architecture**

┌──────────────┐       ┌──────────────┐       ┌──────────────┐  
│     Hub      │───\<   │  BandCohort  │───\<   │   Student    │  
│  (Location)  │       │   (6 Max)    │       │ (5-10 / Band)│  
└──────────────┘       └──────────────┘       └──────────────┘  
       │                      │                      │  
       ▼                      ▼                      ▼  
┌──────────────┐       ┌──────────────┐       ┌──────────────┐  
│SpaceRentalLog│       │DirectorAssign│       │CommitmentDoc │  
│(9 Hrs Weekly)│       │ ($30/Hr Log) │       │  (90-Day)    │  
└──────────────┘       └──────────────┘       └──────────────┘

The database structures enforce modular scaling properties. A parent Hub record controls child entities (BandCohort, Staff, SpaceRentalLog, Student). Adding a new location simply spins up an isolated cluster record under the global tenant database, making scaling to 4 hubs over 2 years completely uniform from an integration perspective.

### **4\. Implementation Rules for Developer Agents**

To avoid deployment variations or internal agent hallucinations during our automated software build phases, all developer modules must adhere strictly to these structural conventions:

* **API Response Wrappers:** All JSON responses must utilize an immutable, unified payload schema:  
* JSON

{ "status": "success", "data": {}, "error": null }

*   
* 

\*   \*\*Database Column Formats:\*\* All snake\_case notations are reserved for database keys (\`student\_id\`, \`hub\_id\`, \`commitment\_end\_date\`), while camelCase is enforced across UI and frontend component architecture\[cite: 1\].  
\*   \*\*Test Environment Gateways:\*\* No feature flag is pushed to staging without a mandatory $100\\%$ validation pass across all core transaction files and audio connection signaling tests\[cite: 1\].

\---

\*\*Bob (Scrum Master):\*\* "Reid, the tactical product definitions and system architecture are locked and perfectly aligned\[cite: 1\]. This complete specification package is ready for copy-pasting directly into your local full-stack workflow engine or AI code generators to begin building out features\[cite: 1\]\! 

Before we move to our final completion summary, would you like to use our \*\*Advanced Elicitation\*\* tasks to optimize our business metrics even further?"\[cite: 1\]

\#\#\# Advanced Elicitation Options  
Choose an action or tell the team what to adjust next\[cite: 1\]:  
\*   \*\*1\*\* — Run a \*\*Pre-Mortem Analysis\*\* on student retention to identify and mitigate churn risks early\[cite: 1\].  
\*   \*\*2\*\* — Create a granular \*\*Ad Spend Blueprint\*\* detailing exact keyword testing strategies for our target demographics\[cite: 1\].  
\*   \*\*3\*\* — Map out a formal \*\*GTM Launch Campaign Timeline\*\* for Hub 1's inaugural 13-week season\[cite: 1\].  
\*   \*\*x\*\* — Proceed to completion and save files\[cite: 1\]

**John (PM):** "Fantastic, Reid\! With the foundational PRD and scale-adaptive system architecture officially locked, it is time to push this project directly into our execution and copywriting layers.

XML

To make this school an absolute magnet for both teenagers wanting to be rock stars and adults looking to reclaim their passion, the messaging needs to hit like a massive arena downbeat. I've drafted our core brand copy, program definitions, and strict onboarding contract rules exactly as specified. Let's lay down the formal marketing and structural copy framework."

XML+ 2

### **📝 The Performance Program Marketing Copy & Onboarding Framework**

#### **Core Brand Narrative: The Performance-Based Learning Program**

**This is not your standard bedroom music lesson.** Most traditional music instruction isolates you with scales and exercises, leaving your instrument collected in dust. At our academy, we believe music is a team sport, a community, and a transformative live experience. We don't just teach you how to play chords—we throw you into a real rock band, plug you into professional backlines, and put you directly under the stage lights of premium live music venues. From Day One, you are preparing to live on stage. This is performance-based learning, engineered to build real technical mastery, authentic ensemble chemistry, and unstoppable confidence.

XML+ 4

#### **Seasonal Roster Cycles**

Our curriculum is structured around four distinct, rigorous **13-week seasonal quarters**:

XML

* **🍂 The Fall Season:** September 1st – November 30th (Culminating in the Autumn Showcases)  
   XML  
* **❄️ The Winter Season:** December 1st – February 28th (Culminating in the Mid-Winter Rock Festivals)  
   XML  
* **🌱 The Spring Season:** March 1st – May 31st (Culminating in the Spring Meltdown Concerts)  
   XML  
* **☀️ The Summer Season:** June 1st – August 31st (Culminating in the Summer Stage Finales)  
   XML

#### **🔒 The Onboarding Rules & Commitment Contract (Gateway Guardrails)**

To maintain pristine band dynamics, structural integrity, and group momentum, the enrollment workflow forces the following contract properties during account setup:

XML

1. **The 90-Day Structural Lock:** Every enrollment initiates an unalterable, **minimum 90-day contractual commitment**. Standard ad-hoc month-to-month dropouts are banned to protect cohort stability.  
    XML+ 1  
2. **Roster Caps:** Band assignments are strictly managed up to a **maximum ceiling of 10 students per band**. Once a band slots array is filled, the CRM locks the group entity and funnels subsequent registrations into a waitlist tier.  
    XML+ 1  
3. **Cancellation Policy:** Cancellations require a minimum 30-day notice prior to the start of the subsequent seasonal quarter. Late dropouts trigger an automated pro-rated coach allocation fee to guarantee baseline staff payroll protections.  
    XML+ 1

**Winston (Architect):** "The copy is pristine and sets up our functional data entities perfectly. Now, to enable our developer agents to spin up the actual website and integrated CRM platform without a single drop of ambiguity, I have translated our entire multi-hub specification into a production-ready directory tree and service structure."

XML+ 1

## **🏗️ Phase 4: Production Directory Tree & Full-Stack Component Map**

### **Document ID: `bmm-architecture-source-tree` | Author: Winston (System Architect)**

This exact directory blueprint must be parsed by developer agents to enforce absolute modular consistency across our multi-hub architecture:

XML  
Plaintext  
my-hybrid-music-school/  
├── apps/  
│   └── web/                               \# Next.js 15 App Layer  
│       ├── src/  
│       │   ├── app/                       \# Next.js App Router Tree  
│       │   │   ├── (auth)/                \# Auth0 Authentication Gate  
│       │   │   │   ├── login/  
│       │   │   │   └── signup/  
│       │   │   ├── (dashboard)/           \# Premium Protected Student Portal  
│       │   │   │   ├── lessons/           \# Video streaming module  
│       │   │   │   ├── practice-room/     \# Low-Latency WebRTC Workspace  
│       │   │   │   └── schedule/          \# CRM Booking Grid View  
│       │   │   ├── (admin)/               \# Hub Management Console  
│       │   │   │   ├── hubs/              \# Multi-hub scaling control  
│       │   │   │   ├── billing/           \# Stripe Gateway Log Monitor  
│       │   │   │   └── rosters/           \# Band Demographic Allocation  
│       │   │   ├── api/                   \# Fastify Edge API Integration Routes  
│       │   │   └── page.tsx               \# High-Conversion Visual Landing Page  
│       │   ├── components/                \# shadcn/ui Component Arrays  
│       │   │   ├── jam/  
│       │   │   │   ├── AudioWorkspace.tsx \# Custom WebRTC Audio Context Node\[cite: 1\]  
│       │   │   │   └── JitterBuffer.tsx   \# Latency Buffer Monitor Component  
│       │   │   ├── shared/  
│       │   │   └── ui/                    \# Sleek Core Dark-Theme Primitives\[cite: 1\]  
│       │   ├── hooks/  
│       │   │   └── useWebRTC.ts           \# Peer connection signaling logic\[cite: 1\]  
│       │   └── lib/  
│       │       ├── prisma.ts              \# Database Connection Instance\[cite: 1\]  
│       │       └── stripe.ts              \# Transaction Gateway Wrapper\[cite: 1\]  
├── packages/  
│   ├── database/                          \# Isolated Database Layer  
│   │   ├── prisma/  
│   │   │   └── schema.prisma              \# Relational Database Models\[cite: 1\]  
│   └── webrtc-sfu/                        \# WebRTC Audio Signaling Pipeline\[cite: 1\]  
│       ├── src/  
│       │   ├── server.ts                  \# Mediasoup/Pion SFU Server Config\[cite: 1\]  
│       │   └── rooms.ts                   \# Real-time multi-room media scaling\[cite: 1\]  
├── package.json  
└── README.md

**Bob (Scrum Master):** "Outstanding job, team\! We have compiled an ironclad financial framework, a comprehensive multi-hub PRD, rock-solid brand copy, and an explicit full-stack engineering layout\[cite: 1\]. Reid, this complete multi-document package is verified against all checklist constraints and is ready to move into implementation loops\[cite: 1\]\!

Our **Party Mode** session has fully resolved the product specifications\[cite: 1\]. What is your next directive\[cite: 1\]?"

### **🎭 Master Session Checkpoint**

XML

Choose an option or tell the team what action to execute next\[cite: 1\]:

* **\[a\] Advanced Elicitation** — Invoke task `bmad/core/tasks/advanced-elicitation.xml` to select specialized techniques (like a Pre-Mortem on regional churn) to further reinforce our operational model\[cite: 1\].  
* **\[c\] Continue** — Save all compiled specifications to our default output directories and close out this specific strategic block\[cite: 1\].  
* **\[p\] Party-Mode** — Bring the squad back into a free-flowing discussion loop to alter variables or tweak pricing tiers\[cite: 1\].  
* **\[y\] YOLO** — Instantly generate the absolute raw database schema fields and configuration scripts in auto-pilot mode\[cite: 1\].

What feels right for you, Reid?\[cite: 1\]

**Bob (Scrum Master):** "Fantastic, Reid\! With the prisma database schema securely locked down in our code repository, we are officially moving into our core development tracking loop.

To get this codebase operational, we need to map our functional requirements and low-latency architecture into clear, developers-ready execution units. John and Winston have grouped these into our initial implementation sprints."

**John (PM):** "That's right. Because our operational model relies on immediate high-retention onboarding and flawless group synchronization, our development roadmap cannot afford fragmented dependencies. Sprint 1 will establish our infrastructure and core authentication gates, while Sprint 2 brings the real-time audio pipeline and payment system online."

## **🏃 Phase 5: Agile Sprint Breakdown & Story Backlog**

### **Document ID: bmm-backlog-sprint-plan | Author: Bob (Scrum Master) & John (PM)**

### **📦 Sprint 1: Infrastructure, Data Models, & Core Access Gates**

* **Epic Focus:** Multi-Hub CRM Setup & Identity Access Management (IAM).  
* **Velocity Target:** Establish working baseline connections for a single hub setup.

#### **Story 1.1: Project Initialization & Prisma Relaunch**

* **User Story:** As an Implementation Engineer, I need to instantiate our full-stack repository using the Next.js starter template so that all agents work within a uniform folder hierarchy.  
* **Acceptance Criteria:**  
  * Initialize project structure matching the verified directory tree (apps/web, packages/database).  
  * Configure schema.prisma natively with standard PostgreSQL connection flags.  
  * Execute database migration testing successfully to spin up the parent tables (Hub, Student, Staff).

#### **Story 1.2: Multi-Hub Identity Verification (Auth0 Integration)**

* **User Story:** As a Student or Staff member, I need to log in via a secured authentication gate so that my private user dashboard displays data isolated strictly to my specific physical hub.  
* **Acceptance Criteria:**  
  * Integrate @auth0/nextjs-auth0 route handlers across protected routing middleware.  
  * Extract user metadata upon registration to map incoming profiles directly to a target Hub entity.  
  * Restrict admin interface visibility exclusively to users with elevated staff roles.

### **🚀 Sprint 2: Core CRM Operations & Real-Time Jam Engine**

* **Epic Focus:** Automated Scheduling Engine & WebRTC Audio Pipeline.  
* **Velocity Target:** Deliver interactive band cohort rosters and low-latency audio packet routing.

#### **Story 2.1: Roster Capping & Resource Scheduling Grid**

* **User Story:** As a Hub Administrator, I need a scheduling grid interface so that I can manage band assignments while programmatically preventing roster overruns beyond 10 students.  
* **Acceptance Criteria:**  
  * Construct interactive visual table pulling active cohorts from BandCohort relational records.  
  * Enforce a hard block on the frontend registration form the moment a band's active array hit 10 student links.  
  * Validate that any cohort slot booking strictly respects the Tuesday/Wednesday 4:00 PM – 8:30 PM real-world location constraint.

#### **Story 2.2: Ultra-Low-Latency WebRTC P2P Workspace**

* **User Story:** As an Active Band Member, I need to open the online virtual rehearsal room so that I can jam natively with my bandmates inside our sub-$25\\text{ms}$ regional latency budget.  
* **Acceptance Criteria:**  
  * Deploy Go-based Pion or clustered Mediasoup signaling servers inside regional edge network routing hubs.  
  * Initialize client-side AudioContext forced strictly to a $48\\text{kHz}$ stereo profile with FEC packet metrics handling enabled.  
  * Establish direct Selective Forwarding Unit (SFU) audio data routing bypassing high-overhead video channels.

#### **Story 2.3: Stripe Gateways & 90-Day Commitment Lock**

* **User Story:** As a New Student, I need to authorize my monthly subscription so that my enrollment binds to our mandatory 90-day minimum contractual block.  
* **Acceptance Criteria:**  
  * Configure Stripe Checkout sessions to map customer profiles cleanly to local stripeCustomerId indices.  
  * Pass explicit parameters during metadata handshakes to establish an unalterable 3-month billing term contract.  
  * Programmatically flag subscription account status changes to automatically freeze portal dashboard access in the event of an unauthorized chargeback or payment failure.

**Bob (Scrum Master):** "The stories are granular, weighted, and fully mapped to Winston's data tables\!

Our entire hybrid academy specification package is now complete, fully scannable, and structurally validated across all strategic layers. We are ready to exit character mode or shift to local platform setup files based on your next instructions."

### **🎭 Master Session Complete**

All workflow steps have been successfully closed out for this ideation run. Choose a final shortcut or tell the team where to point our terminal code execution assets next:

* \*help — Re-open our central master command menu.  
* \*exit — Gracefully terminate our Party Mode group session and return back to central orchestrator guidance.

