import React from 'react';
import prisma from '@/lib/prisma';
import { getIAMProfile } from '@/lib/iam';
import AccountPageClient from './AccountPageClient';

export default async function AccountPage() {
  const profile = await getIAMProfile();
  if (!profile) return null;

  // Fetch student details from database
  const student = await prisma.student.findUnique({
    where: { id: profile.id }
  });

  const studentData = {
    id: student?.id || profile.id,
    name: student?.name || profile.name,
    email: profile.email,
    instrument: student?.instrument || 'Keyboard',
    phone: student?.phone || '',
    address: '123 Music Row, Suite 100', // Mock initial address
    city: 'Nashville',
    state: 'TN',
    zip: '37203'
  };

  return (
    <AccountPageClient 
      initialData={studentData}
    />
  );
}
