import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { studentId, cohortId } = await request.json();

    if (!studentId || !cohortId) {
      return NextResponse.json(
        { status: 'error', error: 'Missing studentId or cohortId parameters' },
        { status: 400 }
      );
    }

    // 1. Fetch cohort details and current roster density
    const cohort = await prisma.bandCohort.findUnique({
      where: { id: cohortId },
      include: { students: { select: { id: true } } }
    });

    if (!cohort) {
      return NextResponse.json(
        { status: 'error', error: 'Target band cohort not found' },
        { status: 404 }
      );
    }

    // 2. Enforce the strict 10-student capacity limit
    if (cohort.students.length >= 10) {
      return NextResponse.json(
        { status: 'error', error: 'This band roster is capped at 10 students. Please select another slot.' },
        { status: 400 }
      );
    }

    // 3. Update the student record
    await prisma.student.update({
      where: { id: studentId },
      data: {
        cohortId: cohort.id,
        hubId: cohort.hubId // Keep location and band location aligned
      }
    });

    return NextResponse.json({ status: 'success' });
  } catch (err) {
    console.error('[Enrollment API Error]:', err);
    return NextResponse.json(
      { status: 'error', error: 'Internal server error during enrollment' },
      { status: 500 }
    );
  }
}
