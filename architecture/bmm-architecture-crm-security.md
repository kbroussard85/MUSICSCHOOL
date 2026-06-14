# Document ID: bmm-architecture-crm-security
# Author: Winston (System Architect)

To protect student schedules, instructor availability, and parent contact notes, the system must utilize strict encryption guardrails. Sensitive columns (like phone numbers, emails, and notes fields) will be encrypted transparently using an encryption key pulled strictly from runtime cloud environment variables (PROCESS_ENV_ENCRYPTION_KEY).

## 1. Relational Database Schema Extensions

```prisma
// packages/database/prisma/schema.prisma
// Extended CRM Schema with Application-Layer Encryption Fields

enum CommunicationType {
  EMAIL
  SMS
  PHONE_CALL
}

enum LeadStatus {
  INQUIRY_RECEIVED
  TRIAL_SCHEDULED
  TRIED_NOT_ENROLLED
  CONVERTED_ACTIVE
  WAITLISTED
}

model Hub {
  id              String           @id @default(uuid())
  name            String           // e.g., "Thornton Core"
  city            String           // e.g., "Thornton"
  createdAt       DateTime         @default(now())
  updatedAt       DateTime         @updatedAt
  
  // Relations
  cohorts         BandCohort[]
  staff           StaffAssignment[]
  crmLeads        CRMLead[]
}

model Staff {
  id              String           @id @default(uuid())
  firstName       String
  lastName        String
  email           String           @unique
  hourlyRate      Decimal          @db.Decimal(10, 2)
  isActive        Boolean          @default(true)

  // Relations
  assignments     StaffAssignment[]
  directedBands   BandCohort[]
  privateLessons  PrivateLesson[]
  masterClasses   MasterClassInstructor[]
}

model StaffAssignment {
  id              String           @id @default(uuid())
  staffId         String
  hubId           String

  staff           Staff            @relation(fields: [staffId], references: [id], onDelete: Cascade)
  hub             Hub              @relation(fields: [hubId], references: [id], onDelete: Cascade)

  @@unique([staffId, hubId])
}

model Student {
  id              String           @id @default(uuid())
  firstName       String
  lastName        String
  emailEncrypted  String           // Encrypted application-side via AES-256-GCM
  emailHash       String           @unique // Deterministic blind index for fast DB indexing/lookups
  parentEmailEnc  String?          // Encrypted parent email string
  stripeCustomerId String?         @unique
  createdAt       DateTime         @default(now())

  // Relations
  bandAssignments BandMember[]
  privateLessons  PrivateLesson[]
  masterClasses   MasterClassAttendee[]
}

model CRMLead {
  id                  String             @id @default(uuid())
  hubId               String
  status              LeadStatus         @default(INQUIRY_RECEIVED)
  parentNameEncrypted String?            // Encrypted
  studentName         String
  phoneEncrypted      String             // Encrypted phone array
  phoneHash           String             @unique // Blind index hash for secure phone searches
  notesEncrypted      String?            @db.Text // Encrypted log notes
  createdAt           DateTime           @default(now())
  updatedAt           DateTime           @updatedAt

  hub                 Hub                @relation(fields: [hubId], references: [id])
  communications      CommunicationLog[]
}

model CommunicationLog {
  id              String            @id @default(uuid())
  leadId          String
  type            CommunicationType
  agentStaffId    String            // Tracking which admin handled outreach
  summaryEncrypted String            @db.Text // Encrypted log entry
  timestamp       DateTime          @default(now())

  lead            CRMLead           @relation(fields: [leadId], references: [id], onDelete: Cascade)
}

model PrivateLesson {
  id              String           @id @default(uuid())
  studentId       String
  instructorId    String
  scheduledAt     DateTime         // Restricted to Mon-Thu off-peak virtual room grids
  durationMinutes Int              @default(45)
  isCompleted     Boolean          @default(false)

  student         Student          @relation(fields: [studentId], references: [id], onDelete: Cascade)
  instructor      Staff            @relation(fields: [instructorId], references: [id])
}

model MasterClass {
  id              String           @id @default(uuid())
  topic           String           // e.g., "Stage Presence and Microphone Technique"
  scheduledAt     DateTime
  durationMinutes Int              @default(60) // Multi-tenant interactive clinics
  maxSeats        Int              @default(25)

  instructors     MasterClassInstructor[]
  attendees       MasterClassAttendee[]
}

model MasterClassInstructor {
  id            String             @id @default(uuid())
  masterClassId String
  instructorId  String

  masterClass   MasterClass        @relation(fields: [masterClassId], references: [id], onDelete: Cascade)
  instructor    Staff              @relation(fields: [instructorId], references: [id], onDelete: Cascade)

  @@unique([masterClassId, instructorId])
}

model MasterClassAttendee {
  id            String             @id @default(uuid())
  masterClassId String
  studentId     String
  attendedAt    DateTime           @default(now())

  masterClass   MasterClass        @relation(fields: [masterClassId], references: [id], onDelete: Cascade)
  student       Student            @relation(fields: [studentId], references: [id], onDelete: Cascade)

  @@unique([masterClassId, studentId])
}
```
