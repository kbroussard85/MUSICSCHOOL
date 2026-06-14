import { EventEmitter } from 'events';
import fs from 'fs';

// Redis Pub/Sub client simulator using Node.js event broker
class RedisPubSubSimulator extends EventEmitter {
  publish(channel: string, message: string): number {
    this.emit(channel, message);
    return 1; // Returns number of subscribers received message
  }
  
  subscribe(channel: string, callback: (message: string) => void) {
    this.on(channel, callback);
  }
}

export const redisPubSub = new RedisPubSubSimulator();

const QUEUE_CHANNEL = 'scheduler-notifications';

export interface NotificationPayload {
  type: 'COHORT_RESCHEDULE' | 'LESSON_RESCHEDULE' | 'LESSON_ASSIGNMENT' | 'LEAD_OUTREACH';
  studentName: string;
  studentEmail: string;
  parentEmail?: string;
  instructorName: string;
  instructorEmail: string;
  eventName: string;
  oldSchedule?: string;
  newSchedule?: string;
  timestamp: string;
}

// Background Worker subscription thread
redisPubSub.subscribe(QUEUE_CHANNEL, (message: string) => {
  try {
    const payload: NotificationPayload = JSON.parse(message);
    
    // Simulate background worker asynchronous polling & queue ingestion
    setTimeout(async () => {
      await processNotification(payload);
    }, 150);
  } catch (err) {
    console.error('[Pub/Sub Worker] Error parsing queue message:', err);
  }
});

/**
 * Executes a synchronized tri-party dispatch matching our system rules:
 * - Student/Parent: Receives confirmation via email and text message.
 * - Instructor: Receives a ledger allocation metric update to adjust payroll visibility logs.
 * - Admin Panel: Receives a tracking telemetry confirmation message log.
 */
async function processNotification(payload: NotificationPayload) {
  const timestamp = new Date().toISOString();
  
  // 1. Student / Parent Confirmation (Email & SMS text simulation)
  const studentText = `
[TO STUDENT/PARENT - EMAIL & SMS]
To: ${payload.studentName} <${payload.studentEmail}> ${payload.parentEmail ? `Parent: <${payload.parentEmail}>` : ''}
SMS to Student/Parent: Simulated SMS confirmation sent successfully.
Subject: Schedule Change Confirmation: ${payload.eventName}
Timestamp: ${timestamp}

Dear ${payload.studentName},

We have processed your scheduling update for "${payload.eventName}".
- Schedule: ${payload.newSchedule || 'N/A'}
- Location Link: https://harmony.school/rooms/${payload.eventName.toLowerCase().replace(/\s+/g, '-')}
- Assigned Coach: Prof. ${payload.instructorName}

If you have any questions, please contact the administrator.
-----------------------------------------
`;

  // 2. Instructor Studio Payroll Ledger (dashboard & email updating payroll ledger metrics)
  const instructorText = `
[TO INSTRUCTOR - WEEKLY STUDIO PAYROLL LEDGER]
To: Prof. ${payload.instructorName} <${payload.instructorEmail}>
Subject: Weekly Studio Payroll Update: ${payload.eventName}
Timestamp: ${timestamp}

Dear Prof. ${payload.instructorName},

Your weekly studio payroll ledger metrics have been updated:
- Event Class: ${payload.eventName}
- Student: ${payload.studentName}
- Schedule: ${payload.newSchedule || 'N/A'}
- Ledger Update Code: PAYROLL_MUTATION_${payload.type}_${Date.now()}
- Action: Studio Hours Adjusted

Please review your updated ledger log inside the Instructor Portal.
-----------------------------------------
`;

  // 3. System Admin Log Confirmation (Dashboard Telemetry Stack)
  const adminTelemetryText = `
[ADMIN SYSTEM TELEMETRY CONFIRMATION LOG]
Channel: telemetry-stream
Event ID: ${payload.type}_${Date.now()}
Timestamp: ${timestamp}
Status: COMMIT_SUCCESS
Telemetry: Transaction completed. Student "${payload.studentName}" has been successfully assigned to "${payload.eventName}" with coach "${payload.instructorName}".
-----------------------------------------
`;

  const fullEmailLog = `
=========================================
REDIS PUBSUB TRANSACTION EVENT DISPATCH
Event Type: ${payload.type}
Timestamp: ${payload.timestamp}
=========================================
${studentText}
${instructorText}
${adminTelemetryText}
=========================================
`;

  // Write logs to console
  console.log('[Pub/Sub Worker] Tri-party notification dispatched:');
  console.log(fullEmailLog);

  // Append logs strictly to the system admin log file
  try {
    const logFilePath = 'c:/Users/kbrou/Pictures/Saved Pictures/MUSIC SCHOOL/rehearsal_emails.log';
    fs.appendFileSync(logFilePath, fullEmailLog, 'utf-8');
  } catch (err) {
    console.error('[Pub/Sub Worker] Failed to write to rehearsal_emails.log:', err);
  }
}

/**
 * Publishes a scheduling event into the simulated Redis Pub/Sub array.
 */
export function publishSchedulingEvent(payload: NotificationPayload) {
  redisPubSub.publish(QUEUE_CHANNEL, JSON.stringify(payload));
}
