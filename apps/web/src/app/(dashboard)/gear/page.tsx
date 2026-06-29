import React from 'react';
import prisma from '@/lib/prisma';
import { getIAMProfile } from '@/lib/iam';
import GearPageClient from './GearPageClient';
import GearAdminClient from './GearAdminClient';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function GearPage({ searchParams }: PageProps) {
  const profile = await getIAMProfile();
  if (!profile) return null;

  const params = await searchParams;
  const category = typeof params.category === 'string' ? params.category : undefined;

  let whereClause: any = {};
  if (category && category !== 'all') {
    whereClause.category = category;
  }

  const gearItems = await prisma.gearItem.findMany({
    where: whereClause,
    orderBy: { price: 'asc' }
  });

  const formattedItems = gearItems.map(item => ({
    id: item.id,
    name: item.name,
    category: item.category,
    price: item.price,
    image: item.image,
    description: item.description,
    stock: item.stock,
    hyperlink: item.hyperlink || ''
  }));

  const isAdminOrDirector = profile.role === 'ADMIN' || profile.role === 'DIRECTOR';

  if (isAdminOrDirector) {
    return (
      <GearAdminClient 
        initialItems={formattedItems}
        initialCategory={category || 'all'}
      />
    );
  }

  return (
    <GearPageClient 
      initialItems={formattedItems} 
      initialCategory={category || 'all'}
    />
  );
}
