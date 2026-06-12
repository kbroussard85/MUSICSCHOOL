import React from 'react';
import { redirect } from 'next/navigation';
import { getIAMProfile } from '@/lib/iam';
import prisma from '@/lib/prisma';
import AdminDashboardClient, { StudentData, CohortData, LessonData } from '@/components/admin/AdminDashboardClient';

export default async function AdminDashboardPage() {
  // 1. Authorize: user must be ADMIN
  const profile = await getIAMProfile();
  if (!profile || profile.role !== 'ADMIN') {
    redirect('/practice-room');
  }

  // 2. Load CRM data with mock fallbacks in development
  let students: StudentData[] = [];
  let cohorts: CohortData[] = [];
  let lessons: LessonData[] = [];

  try {
    const dbCohorts = await prisma.bandCohort.findMany({
      include: { director: true }
    });

    const dbStudents = await prisma.student.findMany({
      include: { cohort: { include: { director: true } } }
    });

    const dbLessons = await prisma.privateLesson.findMany({
      include: { student: true, instructor: true }
    });

    cohorts = dbCohorts.map(c => ({
      id: c.id,
      name: c.name,
      scheduleDay: c.scheduleDay,
      scheduleSlot: c.scheduleSlot,
      directorName: c.director?.name || 'Unassigned Instructor',
      directorEmail: c.director?.email || 'admin@harmony.com'
    }));

    students = dbStudents.map(s => ({
      id: s.id,
      name: s.name,
      email: s.email,
      age: s.age || 14,
      instrument: s.instrument || 'Guitar',
      cohortName: s.cohort?.name || 'Unassigned Cohort',
      scheduleDay: s.cohort?.scheduleDay || 'Unassigned Day',
      scheduleSlot: s.cohort?.scheduleSlot || 'Unassigned Slot',
      directorName: s.cohort?.director?.name || 'Unassigned',
      directorEmail: s.cohort?.director?.email || ''
    }));

    lessons = dbLessons.map(l => ({
      id: l.id,
      studentName: l.student.name,
      studentEmail: l.student.email,
      instructorName: l.instructor.name,
      instructorEmail: l.instructor.email,
      scheduledAt: l.scheduledAt.toISOString(),
      type: l.type,
      status: l.status
    }));

  } catch (err) {
    console.warn('[Admin Dashboard] Database query failed, using fallbacks:', err);
  }

  // 3. Fallback mock data in development if database is empty/unreachable
  if (cohorts.length === 0 && process.env.NODE_ENV === 'development') {
    cohorts = [
      { id: 'cohort-1', name: 'Thornton Rockers', scheduleDay: 'Tuesday', scheduleSlot: '4:00 PM - 5:30 PM', directorName: 'Sarah Jenkins', directorEmail: 'sarah@harmony.com' },
      { id: 'cohort-2', name: 'Westminster Teens', scheduleDay: 'Tuesday', scheduleSlot: '5:30 PM - 7:00 PM', directorName: 'Sarah Jenkins', directorEmail: 'sarah@harmony.com' },
      { id: 'cohort-3', name: 'Adult Ensemble', scheduleDay: 'Tuesday', scheduleSlot: '7:00 PM - 8:30 PM', directorName: 'Sarah Jenkins', directorEmail: 'sarah@harmony.com' },
      { id: 'cohort-4', name: 'Broomfield Juniors', scheduleDay: 'Wednesday', scheduleSlot: '4:00 PM - 5:30 PM', directorName: 'Mike Tyson', directorEmail: 'mike@harmony.com' },
      { id: 'cohort-5', name: 'Thornton Teens II', scheduleDay: 'Wednesday', scheduleSlot: '5:30 PM - 7:00 PM', directorName: 'Mike Tyson', directorEmail: 'mike@harmony.com' },
      { id: 'cohort-6', name: 'Adult Blues Hub', scheduleDay: 'Wednesday', scheduleSlot: '7:00 PM - 8:30 PM', directorName: 'Mike Tyson', directorEmail: 'mike@harmony.com' }
    ];
  }

  if (students.length === 0 && process.env.NODE_ENV === 'development') {
    students = [
      { id: 'stud-1', name: 'Alex Broussard', email: 'alex@broussard.com', age: 16, instrument: 'Lead Keyboardist', cohortName: 'Thornton Rockers', scheduleDay: 'Tuesday', scheduleSlot: '4:00 PM - 5:30 PM', directorName: 'Sarah Jenkins', directorEmail: 'sarah@harmony.com' },
      { id: 'stud-2', name: 'Charlie Davis', email: 'charlie@davis.com', age: 11, instrument: 'Bassist', cohortName: 'Thornton Rockers', scheduleDay: 'Tuesday', scheduleSlot: '4:00 PM - 5:30 PM', directorName: 'Sarah Jenkins', directorEmail: 'sarah@harmony.com' },
      { id: 'stud-3', name: 'Emma Watson', email: 'emma@watson.com', age: 22, instrument: 'Lead Vocalist', cohortName: 'Adult Ensemble', scheduleDay: 'Tuesday', scheduleSlot: '7:00 PM - 8:30 PM', directorName: 'Sarah Jenkins', directorEmail: 'sarah@harmony.com' },
      { id: 'stud-4', name: 'John Smith', email: 'john@smith.com', age: 15, instrument: 'Drummer', cohortName: 'Westminster Teens', scheduleDay: 'Tuesday', scheduleSlot: '5:30 PM - 7:00 PM', directorName: 'Sarah Jenkins', directorEmail: 'sarah@harmony.com' },
      { id: 'stud-5', name: 'Sophia Loren', email: 'sophia@loren.com', age: 25, instrument: 'Lead Guitarist', cohortName: 'Adult Blues Hub', scheduleDay: 'Wednesday', scheduleSlot: '7:00 PM - 8:30 PM', directorName: 'Mike Tyson', directorEmail: 'mike@harmony.com' }
    ];
  }

  if (lessons.length === 0 && process.env.NODE_ENV === 'development') {
    const nextTue = new Date('2026-06-16T15:00:00');
    const nextWed = new Date('2026-06-17T15:00:00');
    
    lessons = [
      { id: 'less-1', studentName: 'Alex Broussard', studentEmail: 'alex@broussard.com', instructorName: 'Sarah Jenkins', instructorEmail: 'sarah@harmony.com', scheduledAt: nextTue.toISOString(), type: 'ONLINE_STANDARD', status: 'SCHEDULED' },
      { id: 'less-2', studentName: 'John Smith', studentEmail: 'john@smith.com', instructorName: 'Mike Tyson', instructorEmail: 'mike@harmony.com', scheduledAt: nextWed.toISOString(), type: 'ONLINE_STANDARD', status: 'SCHEDULED' }
    ];
  }

  return (
    <AdminDashboardClient 
      initialStudents={students}
      initialCohorts={cohorts}
      initialLessons={lessons}
    />
  );
}
