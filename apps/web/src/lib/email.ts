import fs from 'fs';

export interface RescheduleEmailParams {
  studentName: string;
  studentEmail: string;
  instructorName: string;
  instructorEmail: string;
  eventName: string; // e.g. "Thornton Rockers Cohort" or "Private Guitar Lesson"
  oldSchedule: string; // e.g. "Tuesday @ 4:00 PM"
  newSchedule: string; // e.g. "Wednesday @ 5:30 PM"
}

export async function sendRescheduleEmail(params: RescheduleEmailParams) {
  const {
    studentName,
    studentEmail,
    instructorName,
    instructorEmail,
    eventName,
    oldSchedule,
    newSchedule
  } = params;

  const timestamp = new Date().toISOString();
  
  const emailContent = `
=========================================
EMAIL NOTIFICATION - RESCHEDULE EVENT
Timestamp: ${timestamp}
Event: ${eventName}
=========================================

[TO STUDENT]
To: ${studentName} <${studentEmail}>
Subject: Schedule Change Notification: ${eventName}

Dear ${studentName},

Please be advised that your rehearsal slot for "${eventName}" has been updated.

- Old Schedule: ${oldSchedule}
- New Schedule: ${newSchedule}

If you have any scheduling conflicts, please contact your Band Director.

-----------------------------------------

[TO INSTRUCTOR]
To: Prof. ${instructorName} <${instructorEmail}>
Subject: Class Schedule Updated: ${eventName}

Dear Prof. ${instructorName},

Your roster schedule for "${eventName}" has been adjusted by the hub administrator.

- Old Schedule: ${oldSchedule}
- New Schedule: ${newSchedule}

Please review your updated schedule in the instructor portal.

=========================================
`;

  // 1. Log to console
  console.log('[Email Service] Simulated Dispatch:');
  console.log(emailContent);

  // 2. Append to log file in the workspace
  try {
    const logFilePath = 'c:/Users/kbrou/Pictures/Saved Pictures/MUSIC SCHOOL/rehearsal_emails.log';
    fs.appendFileSync(logFilePath, emailContent, 'utf-8');
  } catch (err) {
    console.error('[Email Service] Failed to write log file:', err);
  }
}
