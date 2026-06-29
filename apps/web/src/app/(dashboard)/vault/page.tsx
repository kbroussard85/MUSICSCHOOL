import React from 'react';
import prisma from '@/lib/prisma';
import { getIAMProfile } from '@/lib/iam';
import VaultPageClient from './VaultPageClient';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function VaultPage({ searchParams }: PageProps) {
  const profile = await getIAMProfile();
  if (!profile) return null;

  const params = await searchParams;
  const search = typeof params.search === 'string' ? params.search : undefined;
  const category = typeof params.category === 'string' ? params.category : undefined;
  const type = typeof params.type === 'string' ? params.type : undefined;

  let whereClause: any = {};

  if (search) {
    whereClause.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { artist: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } }
    ];
  }

  if (category && category !== 'all') {
    whereClause.category = category;
  }

  if (type && type !== 'all') {
    whereClause.type = type;
  }

  const items = await prisma.vaultItem.findMany({
    where: whereClause,
    orderBy: { title: 'asc' }
  });

  const formattedItems = items.map(item => ({
    id: item.id,
    title: item.title,
    artist: item.artist || '',
    type: item.type,
    category: item.category,
    url: item.url,
    thumbnail: item.thumbnail || '',
    description: item.description || ''
  }));

  return (
    <VaultPageClient 
      initialItems={formattedItems} 
      initialSearch={search || ''}
      initialCategory={category || 'all'}
      initialType={type || 'all'}
    />
  );
}
