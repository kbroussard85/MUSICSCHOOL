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
    const { content, authorName, authorRole } = body;

    if (!content || !content.trim()) {
      return NextResponse.json({ status: 'error', error: 'Content is required', data: null }, { status: 400 });
    }

    const note = await prisma.bulletinNote.create({
      data: {
        content: content.trim(),
        authorName: authorName || profile.name,
        authorRole: authorRole || profile.role
      }
    });

    return NextResponse.json({ status: 'success', data: note, error: null });
  } catch (err: any) {
    console.error('[API Bulletin Note Post Error]:', err);
    return NextResponse.json({ status: 'error', error: err.message || 'Internal server error', data: null }, { status: 500 });
  }
}
