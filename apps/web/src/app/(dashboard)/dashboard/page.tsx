import React from 'react';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { getIAMProfile } from '@/lib/iam';
import { seedIfNeeded } from '@/lib/dbSeeder';
import DashboardClient from './DashboardClient';

export default async function StudentDashboard() {
  const profile = await getIAMProfile();
  if (!profile) return null;

  // Read cookies for selected location and user name
  const cookieStore = await cookies();
  const selectedHubCity = cookieStore.get('selected_hub_city')?.value || 'Thornton';
  const mockUserName = cookieStore.get('mock_user_name')?.value || profile.name;

  // Run auto-seeding if first load or database is empty
  await seedIfNeeded(profile.id, selectedHubCity, mockUserName);

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

  // Fetch all Hubs & Cohorts for Roster Enrollment Chart
  const hubs = await prisma.hub.findMany({
    orderBy: { city: 'asc' }
  });

  const cohorts = await prisma.bandCohort.findMany({
    include: {
      students: { select: { id: true } }
    },
    orderBy: { name: 'asc' }
  });

  const allHubs = hubs.map(h => ({
    id: h.id,
    name: h.name,
    city: h.city,
    address: h.address
  }));

  const allCohorts = cohorts.map(c => ({
    id: c.id,
    name: c.name,
    ageGroup: c.ageGroup,
    scheduleDay: c.scheduleDay,
    scheduleSlot: c.scheduleSlot,
    hubId: c.hubId,
    showcaseTheme: c.showcaseTheme,
    showcaseVenue: c.showcaseVenue,
    rosterCount: c.students.length
  }));

  // Formulate student info
  const studentInfo = {
    id: student?.id || profile.id,
    name: student?.name || profile.name,
    instrument: student?.instrument || 'Keyboard',
    cohortId: student?.cohortId || null,
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
      profileName={mockUserName}
      allHubs={allHubs}
      allCohorts={allCohorts}
      initialSelectedHubCity={selectedHubCity}
    />
  );
}
