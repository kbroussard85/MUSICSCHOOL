import { NextRequest, NextResponse } from 'next/server';
import { getIAMProfile } from '@/lib/iam';
import prisma from '@/lib/prisma';
import { publishSchedulingEvent } from '@/lib/redis';
import { decryptText } from '@/lib/encryption';

export async function POST(request: NextRequest) {
  // 1. Authenticate and authorize ADMIN or DIRECTOR role
  const profile = await getIAMProfile();
  if (!profile || (profile.role !== 'ADMIN' && profile.role !== 'DIRECTOR')) {
    return NextResponse.json({ error: 'Unauthorized. Admin or Director access required.' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { type, id, newDay, newSlot, newDateTime } = body;

    if (!id || !type) {
      return NextResponse.json({ error: 'Missing required parameters: id, type' }, { status: 400 });
    }

    if (type === 'cohort') {
      if (!newDay || !newSlot) {
        return NextResponse.json({ error: 'Missing cohort schedule fields: newDay, newSlot' }, { status: 400 });
      }

      // Fetch the cohort with its director (instructor) and students
      const cohort = await prisma.bandCohort.findUnique({
        where: { id },
        include: {
          director: true,
          students: true
        }
      });

      if (!cohort) {
        return NextResponse.json({ error: 'Cohort not found' }, { status: 404 });
      }

      const oldSchedule = `${cohort.scheduleDay}s @ ${cohort.scheduleSlot}`;
      const newSchedule = `${newDay}s @ ${newSlot}`;

      // Update in database
      await prisma.bandCohort.update({
        where: { id },
        data: {
          scheduleDay: newDay,
          scheduleSlot: newSlot
        }
      });

      // Dispatch notifications to all students and the director via Redis Pub/Sub
      const instructorName = cohort.director?.name || 'Unassigned Instructor';
      const instructorEmail = cohort.director?.email || 'admin@harmony.com';

      for (const student of cohort.students) {
        publishSchedulingEvent({
          type: 'COHORT_RESCHEDULE',
          studentName: student.name,
          studentEmail: decryptText(student.emailEncrypted),
          parentEmail: student.parentEmailEnc ? decryptText(student.parentEmailEnc) : undefined,
          instructorName,
          instructorEmail,
          eventName: `${cohort.name} Band Cohort`,
          oldSchedule,
          newSchedule,
          timestamp: new Date().toISOString()
        });
      }

      // Handle case when there are no students yet
      if (cohort.students.length === 0 && cohort.director) {
        publishSchedulingEvent({
          type: 'COHORT_RESCHEDULE',
          studentName: 'No Students Enrolled',
          studentEmail: 'admin@harmony.com',
          instructorName,
          instructorEmail,
          eventName: `${cohort.name} Band Cohort`,
          oldSchedule,
          newSchedule,
          timestamp: new Date().toISOString()
        });
      }

      return NextResponse.json({ success: true, message: 'Cohort rescheduled successfully and notifications logged.' });

    } else if (type === 'lesson') {
      if (!newDateTime) {
        return NextResponse.json({ error: 'Missing lesson schedule field: newDateTime' }, { status: 400 });
      }

      // Fetch private lesson with student and instructor
      const lesson = await prisma.privateLesson.findUnique({
        where: { id },
        include: {
          student: true,
          instructor: true
        }
      });

      if (!lesson) {
        return NextResponse.json({ error: 'Private lesson not found' }, { status: 404 });
      }

      const oldSchedule = new Date(lesson.scheduledAt).toLocaleString();
      const newSchedule = new Date(newDateTime).toLocaleString();

      // Update database
      await prisma.privateLesson.update({
        where: { id },
        data: {
          scheduledAt: new Date(newDateTime)
        }
      });

      // Dispatch notifications via Redis Pub/Sub
      publishSchedulingEvent({
        type: 'LESSON_RESCHEDULE',
        studentName: lesson.student.name,
        studentEmail: decryptText(lesson.student.emailEncrypted),
        parentEmail: lesson.student.parentEmailEnc ? decryptText(lesson.student.parentEmailEnc) : undefined,
        instructorName: lesson.instructor.name,
        instructorEmail: lesson.instructor.email,
        eventName: `Private Lesson (${lesson.type})`,
        oldSchedule,
        newSchedule,
        timestamp: new Date().toISOString()
      });

      return NextResponse.json({ success: true, message: 'Private lesson rescheduled successfully and notification logged.' });
    }

    return NextResponse.json({ error: 'Invalid reschedule type: must be cohort or lesson' }, { status: 400 });

  } catch (err: any) {
    console.error('[Reschedule API] Execution error:', err);
    return NextResponse.json({ error: 'Internal Server Error', details: err.message }, { status: 500 });
  }
}
