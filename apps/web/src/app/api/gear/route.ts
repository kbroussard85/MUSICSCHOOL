import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getIAMProfile } from '@/lib/iam';

// POST: Create a new gear item
export async function POST(request: Request) {
  const profile = await getIAMProfile();
  if (!profile || (profile.role !== 'ADMIN' && profile.role !== 'DIRECTOR')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { name, category, price, image, description, stock, hyperlink } = body;

    if (!name || !category || price === undefined || !image || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const item = await prisma.gearItem.create({
      data: {
        name,
        category,
        price: parseFloat(price),
        image,
        description,
        stock: stock ? parseInt(stock) : 10,
        hyperlink: hyperlink || null
      }
    });

    return NextResponse.json({ status: 'success', data: item });
  } catch (err) {
    console.error('Error creating gear item:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT: Update an existing gear item
export async function PUT(request: Request) {
  const profile = await getIAMProfile();
  if (!profile || (profile.role !== 'ADMIN' && profile.role !== 'DIRECTOR')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { id, name, category, price, image, description, stock, hyperlink } = body;

    if (!id || !name || !category || price === undefined || !image || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const item = await prisma.gearItem.update({
      where: { id },
      data: {
        name,
        category,
        price: parseFloat(price),
        image,
        description,
        stock: stock ? parseInt(stock) : 10,
        hyperlink: hyperlink || null
      }
    });

    return NextResponse.json({ status: 'success', data: item });
  } catch (err) {
    console.error('Error updating gear item:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE: Remove an existing gear item
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

    await prisma.gearItem.delete({
      where: { id }
    });

    return NextResponse.json({ status: 'success' });
  } catch (err) {
    console.error('Error deleting gear item:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
