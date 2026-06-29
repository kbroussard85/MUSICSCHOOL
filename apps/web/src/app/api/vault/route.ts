import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getIAMProfile } from '@/lib/iam';

// POST: Create a new vault asset
export async function POST(request: Request) {
  const profile = await getIAMProfile();
  if (!profile || (profile.role !== 'ADMIN' && profile.role !== 'DIRECTOR')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { title, artist, type, category, url, thumbnail, description } = body;

    if (!title || !type || !category || !url) {
      return NextResponse.json({ error: 'Missing required fields: title, type, category, url' }, { status: 400 });
    }

    const item = await prisma.vaultItem.create({
      data: {
        title,
        artist: artist || null,
        type,
        category,
        url,
        thumbnail: thumbnail || null,
        description: description || null
      }
    });

    return NextResponse.json({ status: 'success', data: item });
  } catch (err) {
    console.error('Error creating vault asset:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT: Update an existing vault asset
export async function PUT(request: Request) {
  const profile = await getIAMProfile();
  if (!profile || (profile.role !== 'ADMIN' && profile.role !== 'DIRECTOR')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { id, title, artist, type, category, url, thumbnail, description } = body;

    if (!id || !title || !type || !category || !url) {
      return NextResponse.json({ error: 'Missing required fields: id, title, type, category, url' }, { status: 400 });
    }

    const item = await prisma.vaultItem.update({
      where: { id },
      data: {
        title,
        artist: artist || null,
        type,
        category,
        url,
        thumbnail: thumbnail || null,
        description: description || null
      }
    });

    return NextResponse.json({ status: 'success', data: item });
  } catch (err) {
    console.error('Error updating vault asset:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE: Remove an existing vault asset
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

    await prisma.vaultItem.delete({
      where: { id }
    });

    return NextResponse.json({ status: 'success' });
  } catch (err) {
    console.error('Error deleting vault asset:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
