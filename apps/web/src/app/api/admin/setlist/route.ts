import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getIAMProfile } from '@/lib/iam';

// POST: Add a new song to the setlist of a cohort
export async function POST(request: Request) {
  const profile = await getIAMProfile();
  if (!profile || (profile.role !== 'ADMIN' && profile.role !== 'DIRECTOR')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const { cohortId, title, artist } = await request.json();

    if (!cohortId || !title || !artist) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const song = await prisma.setlistSong.create({
      data: {
        cohortId,
        title,
        artist,
        progress: 0
      }
    });

    return NextResponse.json({ status: 'success', data: song });
  } catch (err) {
    console.error('Error adding setlist song:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT: Update progress of a setlist song
export async function PUT(request: Request) {
  const profile = await getIAMProfile();
  if (!profile || (profile.role !== 'ADMIN' && profile.role !== 'DIRECTOR')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const { id, progress } = await request.json();

    if (!id || progress === undefined) {
      return NextResponse.json({ error: 'Missing required parameters: id, progress' }, { status: 400 });
    }

    const song = await prisma.setlistSong.update({
      where: { id },
      data: {
        progress: Math.min(Math.max(parseInt(progress), 0), 100)
      }
    });

    return NextResponse.json({ status: 'success', data: song });
  } catch (err) {
    console.error('Error updating setlist song progress:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE: Remove a song from the setlist
export async function DELETE(request: Request) {
  const profile = await getIAMProfile();
  if (!profile || (profile.role !== 'ADMIN' && profile.role !== 'DIRECTOR')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 });
    }

    await prisma.setlistSong.delete({
      where: { id }
    });

    return NextResponse.json({ status: 'success' });
  } catch (err) {
    console.error('Error deleting setlist song:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
