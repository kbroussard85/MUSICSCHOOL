Winston (Architect): "Understood, Reid! Switching to autopilot execution mode (#yolo) to generate the complete, conflict-free architecture mapping for your hybrid music performance platform. Per our core instructions in team-fullstack_10.xml, this document serves as an immutable consistency contract for any developer agents to prevent code mismatch or system collisions."

# Decision Architecture Document

## Executive Summary
This document specifies a scale-adaptive, multi-hub system architecture engineered for an asset-light, hybrid performance music school. It provides a single source of truth to coordinate high-retention automated business logic (90-day commitments, roster constraints, and hub isolation) with a custom real-time WebRTC media pipeline designed to sustain concurrent, sub-25ms synchronized online rehearsals within a 500-mile operating radius.

## Project Initialization
The first implementation story must execute the standard application initialization sequence to establish our base platform with default tooling configurations:

```bash
npx create-next-app@latest my-hybrid-music-school --typescript --tailwind --app --eslint --src-dir --import-alias "@/*"
```

This establishes our workspace layer with standard linting, static typing via TypeScript, modern utilities via Tailwind, and the optimized directory hierarchy required for multi-hub sharding.

## 1. Decision Summary Matrix

| Architectural Category | Decided Choice | Target Production Version | Affected Epics / FRs | Architectural Rationale & Agent Guardrails |
| :--- | :--- | :--- | :--- | :--- |
| **Data Persistence** | PostgreSQL | 16.x LTS | Epic 1 (All CRM & Hub Logs) | High reliability for complex relational indexing, transactional locks for roster caps, and structural hub data isolation. |
| **ORM Framework** | Prisma ORM | 5.x | Epic 1, Epic 3 | Clean, type-safe database access layer preventing developer agents from writing conflicting raw SQL state mutations. |
| **Caching / Pub-Sub** | Redis | 7.x | Epic 1, Epic 2 | Fast in-memory state tracking for socket channel pooling, live room presences, and space usage calculations. |
| **Application Core** | Next.js | 15.x | Epic 1, Epic 3, Epic 4 | Unified React environment handling high-conversion visual marketing layouts alongside serverless transaction check endpoints. |
| **Signaling / API** | Fastify | 4.x | Epic 1, Epic 2 | Low-overhead Node.js backend runner dedicated to WebSocket channel management and lighting-fast CRM record updates. |
| **Real-Time Audio Grid** | Mediasoup SFU | 3.x | Epic 2 (Sub-25ms Rehearsals) | Custom C++/Node Selective Forwarding Unit bypassing heavy audio-mixing execution delays to route raw P2P tracks natively. |
| **Identity / Auth Gate** | Auth0 Integration | @auth0/nextjs-auth0 | Epic 1 (All Portal Security) | Secure enterprise identity token federation, enforcing automatic context sharding based on user hub association attributes. |
| **Transaction Gateway** | Stripe Billing | 2024-xx | Epic 3 (Commitments & Fees) | Invariant programmatic handling of 3-month recurring billing terms, auto-locking tokens on payment failures or chargebacks. |
| **Hosting Platform** | Vercel Edge Grid | Production | All client-facing systems | Global static deployment layer for frontend client components coupled with localized sub-routing near target hub regions. |

## 2. Comprehensive Source Tree
Developer agents must write code files strictly inside this structural footprint:

```plaintext
my-hybrid-music-school/
├── apps/
│   └── web/                               # Next.js Client Application Layer
│       ├── src/
│       │   ├── app/                       # Next.js App Router Hierarchy
│       │   │   ├── (auth)/                # Third-Party Authentication Handlers
│       │   │   │   ├── login/
│       │   │   │   └── signup/
│       │   │   ├── (dashboard)/           # Protected Session Layout Gateways
│       │   │   │   ├── lessons/           # HD Curriculums & DRM Player Containers
│       │   │   │   ├── practice-room/     # Custom Real-Time WebRTC Workspace Portal
│       │   │   │   └── schedule/          # CRM Booking Grid and Availability Monitors
│       │   │   ├── (admin)/               # Corporate Management Gateways
│       │   │   │   ├── hubs/              # Multi-Hub Scaling and Roster Controls
│       │   │   │   ├── billing/           # Stripe Webhook Transaction Log Audits
│       │   │   │   └── rosters/           # Roster Ceiling and Waitlist Management
│       │   │   ├── api/                   # Local Fastify API Pipeline Handlers
│       │   │   ├── layout.tsx
│       │   │   └── page.tsx               # High-Conversion Visual Marketing Landing Page
│       │   ├── components/                # Modular UI Core Interface Elements
│       │   │   ├── jam/
│       │   │   │   ├── AudioWorkspace.tsx # P2P Audio Context Execution Container
│       │   │   │   └── JitterBuffer.tsx   # Latency Budget Network Stream Monitor
│       │   │   └── ui/                    # Sleek Dark-Theme Design System Layout Primitives
│       │   ├── hooks/
│       │   │   └── useWebRTC.ts           # Real-Time Edge Peer Session Hook
│       │   └── lib/
│       │       ├── prisma.ts              # Global Relational Singleton Interface
│       │       └── stripe.ts              # Transaction API Configuration Gateway
├── packages/
│   ├── database/                          # Invariant Data Persistence Definition Layer
│   │   ├── prisma/
│   │   │   └── schema.prisma              # Relational Multi-Hub Schema Mapping
│   └── webrtc-sfu/                        # P2P Audio Signaling Router Pipeline
│       ├── src/
│       │   ├── server.ts                  # Mediasoup Edge Server Initialization
│       │   └── rooms.ts                   # Multi-Room Virtual State Engine logic
```

## 3. Epic to Architecture Mapping
To verify absolute requirements coverage, every epic defined by John maps to explicit architectural subsystems:

* **Epic 1: Multi-Hub CRM & Roster Engine** $\rightarrow$ PostgreSQL Schema + Auth0 Context: Database indices partition tables cleanly via relational data parameters. Auth0 custom rules pass the student's local `hub_id` claim, forcing the frontend rendering layers to read and display rows sharded purely to that localized physical entity.
* **Epic 2: Ultra-Low-Latency Online Workspace** $\rightarrow$ Mediasoup Edge Server Cluster: The WebRTC media grid targets decentralization. Signaling servers utilize separate Socket.io processes to manage connections directly near regional exchange routes, minimizing packet routing hops to meet the strict sub-25ms audio performance ceiling.
* **Epic 3: Stripe Checkout Gateway & Structural Locks** $\rightarrow$ Stripe Billing Engine: Serverless payment endpoint routes pass rigid transaction options forcing 3 billing loops prior to contract access liberation, completely implementing the invariant 90-day minimum contractual block.
* **Epic 4: HD Video Curriculum & Tablature Engine** $\rightarrow$ DRM Video Streaming API: Media streaming controllers intercept authorization headers from the database context, dynamically verifying subscription validity records prior to serving tab files or curriculum assets to enforce asset protection.

## 4. Implementation Patterns (Preventing Agent Conflicts)

### 4.1 Naming and Routing Conventions
* **API Directory Paths:** All endpoint routes must implement singular, clean, task-oriented REST names. Prohibit mixing plurals. Route patterns follow: `/api/hub/:hubId/cohort/:cohortId`.
* **Database Schema Fields:** Enforce complete `snake_case` notation across all PostgreSQL relational tables (`band_member_id`, `commitment_end_date`). Translate attributes smoothly to `camelCase` across client interface layers.

### 4.2 Error Handling & Unified API Contract Pattern
All asynchronous API route controllers must handle unexpected process failures using an un-alterable, scannable wrapper template layout to guarantee predictable frontend responses:

```json
{
  "status": "error",
  "data": null,
  "error": {
    "code": "RESOURCE_MAX_CAPACITY_REACHED",
    "message": "Target band cohort has reached its rigid ceiling limit of 10 students."
  }
}
```

### 4.3 Low-Latency Audio Constraints Code Enforcement
* Developer agents writing client audio context hooks are strictly barred from injecting standard processing nodes that increase overhead. The `AudioContext` configurations must be hardcoded to an immutable high-fidelity stereo runtime instance:
  ```typescript
  const audioContext = new AudioContext({
    sampleRate: 48000, // Locked to 48kHz sampling parameters
    latencyHint: "interactive" // Forces the browser engine into low-delay execution mode
  });
  ```

## 5. System Consistency ADRs

### Architecture Decision Record: ADR-001 - Low-Latency Audio Pipeline
* **Status:** Approved
* **Context:** The system requires latency-free online jamming functionality within a 500-mile operating loop, demanding an end-to-end delay under 25ms.
* **Considered Options:** Standard multi-party video libraries, native custom WebSockets, WebRTC SFU Media Server Grid.
* **Decision:** Deploy an optimized WebRTC SFU engine powered by Mediasoup.
* **Consequences:** Bypassing high-overhead native video processing tracks slashes data transmission delays. Audio data is locked to the Opus codec at a 128kbps Constant Bit Rate using constant Forward Error Correction flags to handle unexpected packet failures across unstable home networks.

### Architecture Decision Record: ADR-002 - Relational Roster Guardrails
* **Status:** Approved
* **Context:** The operational business metrics depend completely on ensuring band cohort sizing caps do not overrun the maximum threshold of 10 active student links.
* **Considered Options:** Application-layer data checking, atomic database transaction blocks via raw SQL, Prisma database field locks.
* **Decision:** Apply a native database transaction loop utilizing PostgreSQL query isolation thresholds inside our Prisma middle layer.
* **Consequences:** This guarantees absolute safety against race conditions. If two simultaneous signup streams attempt to capture the final remaining slot inside a hot band roster, the data persistence controller handles them sequentially, locking out the late entity and routing them cleanly into the hub waitlist table automatically.

---
Bob (Scrum Master): "Outstanding, Winston! The Decision Architecture Document has been generated, fully specified with versions and enforcement constraints, and safely archived in our default output directory tracker!"
