import React from 'react';
import { redirect } from 'next/navigation';
import { getIAMProfile } from '@/lib/iam';
import Sidebar from '@/components/Sidebar';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getIAMProfile();

  // Redirect to login if user is not authenticated or not in CRM database
  if (!profile) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-[#080a0f] text-slate-100 flex flex-col md:flex-row">
      <Sidebar profile={profile} />

      {/* Main Content Pane */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
