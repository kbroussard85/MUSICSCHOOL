import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getIAMProfile } from '@/lib/iam';

export async function POST(request: Request) {
  const profile = await getIAMProfile();
  if (!profile || (profile.role !== 'ADMIN' && profile.role !== 'DIRECTOR')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const { studentId } = await request.json();
    if (!studentId) {
      return NextResponse.json({ error: 'Missing studentId' }, { status: 400 });
    }

    await prisma.student.update({
      where: { id: studentId },
      data: { cohortId: null }
    });

    return NextResponse.json({ status: 'success' });
  } catch (err) {
    console.error('Error unassigning student:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
