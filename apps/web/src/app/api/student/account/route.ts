import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getIAMProfile } from '@/lib/iam';

export async function POST(req: Request) {
  try {
    const profile = await getIAMProfile();
    if (!profile) {
      return NextResponse.json({ status: 'error', error: 'Unauthorized', data: null }, { status: 401 });
    }

    const body = await req.json();
    const { name, instrument, phone } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ status: 'error', error: 'Name is required', data: null }, { status: 400 });
    }

    // Update student in database
    const updatedStudent = await prisma.student.update({
      where: { id: profile.id },
      data: {
        name: name.trim(),
        instrument: instrument || 'Keyboard',
        phone: phone || ''
      }
    });

    return NextResponse.json({ status: 'success', data: updatedStudent, error: null });
  } catch (err: any) {
    console.error('[API Student Account Update Error]:', err);
    return NextResponse.json({ status: 'error', error: err.message || 'Internal server error', data: null }, { status: 500 });
  }
}
