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
    const { items } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ status: 'error', error: 'Order items are required', data: null }, { status: 400 });
    }

    // Perform atomic transaction to verify stock and decrement values
    await prisma.$transaction(async (tx) => {
      for (const orderItem of items) {
        const gear = await tx.gearItem.findUnique({
          where: { id: orderItem.id }
        });

        if (!gear) {
          throw new Error(`Gear item not found: ${orderItem.id}`);
        }

        if (gear.stock < orderItem.quantity) {
          throw new Error(`Insufficient stock for ${gear.name}. Available: ${gear.stock}, Ordered: ${orderItem.quantity}`);
        }

        // Decrement stock
        await tx.gearItem.update({
          where: { id: orderItem.id },
          data: {
            stock: {
              decrement: orderItem.quantity
            }
          }
        });
      }
    });

    return NextResponse.json({ status: 'success', data: null, error: null });
  } catch (err: any) {
    console.error('[API Gear Checkout Transaction Error]:', err);
    return NextResponse.json({ status: 'error', error: err.message || 'Transaction authorization failed', data: null }, { status: 500 });
  }
}
