import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getIAMProfile } from '@/lib/iam';

export async function POST(request: Request) {
  const profile = await getIAMProfile();
  if (!profile || (profile.role !== 'ADMIN' && profile.role !== 'DIRECTOR')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const { cohortId, rehearsalDate, records } = await request.json();

    if (!cohortId || !rehearsalDate || !Array.isArray(records)) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const parsedDate = new Date(rehearsalDate);

    for (const rec of records) {
      const existing = await prisma.attendance.findFirst({
        where: {
          studentId: rec.studentId,
          cohortId,
          rehearsalDate: parsedDate
        }
      });

      if (existing) {
        await prisma.attendance.update({
          where: { id: existing.id },
          data: { present: rec.present }
        });
      } else {
        await prisma.attendance.create({
          data: {
            studentId: rec.studentId,
            cohortId,
            rehearsalDate: parsedDate,
            present: rec.present
          }
        });
      }
    }

    return NextResponse.json({ status: 'success' });
  } catch (err) {
    console.error('Error saving attendance:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
