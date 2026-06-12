import { auth0 } from './auth0';
import prisma from './prisma';
import { cookies } from 'next/headers';

export interface IAMProfile {
  id: string;
  userId: string;
  email: string;
  name: string;
  role: 'STUDENT' | 'ADMIN' | 'DIRECTOR' | 'INSTRUCTOR';
  hubId: string;
}

export async function getIAMProfile(): Promise<IAMProfile | null> {
  let sub = '';
  let email = '';

  try {
    const session = await auth0.getSession();
    if (session && session.user) {
      sub = session.user.sub;
      email = session.user.email || '';
    }
  } catch (err) {
    console.warn('[IAM] Could not resolve Auth0 session:', err);
  }

  // Fallback to mock cookie in development if no Auth0 session is present
  if (!email && process.env.NODE_ENV === 'development') {
    try {
      const cookieStore = await cookies();
      const mockEmailCookie = cookieStore.get('mock_user_email');
      if (mockEmailCookie && mockEmailCookie.value) {
        email = mockEmailCookie.value;
        sub = `mock-auth0-${email}`;
      }
    } catch (cookieErr) {
      console.warn('[IAM] Could not read mock cookies:', cookieErr);
    }
  }

  if (!email) {
    return null;
  }

  try {
    // 1. Check if user is staff (ADMIN, DIRECTOR, INSTRUCTOR)
    let staff = await prisma.staff.findUnique({
      where: { email }
    });

    if (staff) {
      if (staff.userId !== sub) {
        staff = await prisma.staff.update({
          where: { email },
          data: { userId: sub }
        });
      }
      return {
        id: staff.id,
        userId: staff.userId,
        email: staff.email,
        name: staff.name,
        role: staff.role as any,
        hubId: staff.hubId
      };
    }

    // 2. Check if user is student
    let student = await prisma.student.findUnique({
      where: { email }
    });

    if (student) {
      if (student.userId !== sub) {
        student = await prisma.student.update({
          where: { email },
          data: { userId: sub }
        });
      }
      return {
        id: student.id,
        userId: student.userId,
        email: student.email,
        name: student.name,
        role: 'STUDENT',
        hubId: student.hubId
      };
    }

    // 3. Fallback mock record in development if database is empty/not seeded
    if (process.env.NODE_ENV === 'development') {
      let role: 'STUDENT' | 'ADMIN' | 'DIRECTOR' = 'STUDENT';
      let name = 'Alex Broussard';
      if (email.includes('admin')) {
        role = 'ADMIN';
        name = 'System Administrator';
      } else if (email.includes('director') || email.includes('teacher')) {
        role = 'DIRECTOR';
        name = 'Band Director';
      }

      return {
        id: `mock-${role.toLowerCase()}-id`,
        userId: sub,
        email,
        name,
        role,
        hubId: 'mock-hub-id'
      };
    }
  } catch (error) {
    console.error('[IAM] Error querying database for user profile:', error);

    // In development, return mock details even if database connection fails
    if (process.env.NODE_ENV === 'development') {
      return {
        id: 'mock-student-id',
        userId: sub || 'mock-sub',
        email: email || 'alex@broussard.com',
        name: 'Alex Broussard',
        role: 'STUDENT',
        hubId: 'mock-hub-id'
      };
    }
  }

  return null;
}
