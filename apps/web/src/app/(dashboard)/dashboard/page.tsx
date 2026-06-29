import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { getIAMProfile } from '@/lib/iam';
import { seedIfNeeded } from '@/lib/dbSeeder';
import DashboardClient from './DashboardClient';

export default async function StudentDashboard() {
  const profile = await getIAMProfile();
  if (!profile) return null;

  // Run auto-seeding if first load or database is empty
  await seedIfNeeded(profile.id);

  // Fetch student details with relations
  const student = await prisma.student.findUnique({
    where: { id: profile.id },
    include: {
      cohort: {
        include: {
          director: true,
          setlistSongs: {
            orderBy: { title: 'asc' }
          }
        }
      },
      privateLessons: {
        where: { status: 'SCHEDULED' },
        include: { instructor: true },
        orderBy: { scheduledAt: 'asc' }
      }
    }
  });

  // Fetch Masterclasses
  const masterclasses = await prisma.masterClass.findMany({
    include: { instructors: { include: { instructor: true } } },
    orderBy: { scheduledAt: 'asc' },
    take: 5
  });

  // Fetch Bulletin Notes
  const bulletinNotes = await prisma.bulletinNote.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10
  });

  // Formulate student info
  const studentInfo = {
    id: student?.id || profile.id,
    name: student?.name || profile.name,
    instrument: student?.instrument || 'Not Chosen',
    director: student?.cohort?.director?.name || 'Unassigned',
    directorEmail: student?.cohort?.director?.email || '',
    showcase: student?.cohort?.showcaseTheme || 'Winter Showcase (TBA)',
    venue: student?.cohort?.showcaseVenue || 'Main Hall Rehearsal Studio',
    setlist: student?.cohort?.setlistSongs || [],
    rehearsalDay: student?.cohort?.scheduleDay || 'TBD',
    rehearsalSlot: student?.cohort?.scheduleSlot || 'TBD',
    lessons: student?.privateLessons || [],
    masterclasses: masterclasses || [],
    bulletinNotes: bulletinNotes || []
  };

  return (
    <DashboardClient 
      studentInfo={studentInfo} 
      profileName={profile.name}
    />
  );
}
