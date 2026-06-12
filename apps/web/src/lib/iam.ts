import { auth0 } from './auth0';
import prisma from './prisma';

export interface IAMProfile {
  id: string;
  userId: string;
  email: string;
  name: string;
  role: 'STUDENT' | 'ADMIN' | 'DIRECTOR' | 'INSTRUCTOR';
  hubId: string;
}

export async function getIAMProfile(): Promise<IAMProfile | null> {
  const session = await auth0.getSession();
  if (!session || !session.user) {
    return null;
  }

  const { sub, email } = session.user;
  if (!email) return null;

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
  } catch (error) {
    console.error('[IAM] Error querying database for user profile:', error);
  }

  return null;
}
