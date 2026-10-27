import { NextResponse } from 'next/server';
import { INITIAL_TRANSACTIONS } from '@/lib/seed-data';

export async function GET() {
  return NextResponse.json({
    success: true,
    storeName: 'SweetCrumb Artisan Bakery',
    transactions: INITIAL_TRANSACTIONS,
    recordCount: INITIAL_TRANSACTIONS.length,
  });
}

export async function POST() {
  return NextResponse.json({
    success: true,
    message: 'Store reset to 25 fresh SweetCrumb Bakery transactions and invoices.',
    transactions: INITIAL_TRANSACTIONS,
    recordCount: INITIAL_TRANSACTIONS.length,
  });
}
