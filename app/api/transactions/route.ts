import { NextResponse } from 'next/server';
import { mockTransactions } from '@/lib/mockData';
import { calculateRealizedGains } from '@/lib/taxEngine';

export async function GET() {
  const taxEvents = calculateRealizedGains(mockTransactions);
  
  const enrichedTransactions = mockTransactions.map(tx => {
    const event = taxEvents.find(e => e.transactionId === tx.id);
    return {
      ...tx,
      taxImpact: event || null
    };
  }).reverse(); // newest first
  
  return NextResponse.json(enrichedTransactions);
}
