import { NextResponse } from 'next/server';
import { mockTransactions } from '@/lib/mockData';
import { calculateRealizedGains } from '@/lib/taxEngine';
import { getMockPrices } from '@/lib/mockCoinGecko';

export async function GET() {
  const prices = getMockPrices().reduce((acc, curr) => {
    acc[curr.symbol] = curr.currentPrice;
    return acc;
  }, {} as Record<string, number>);

  const taxEvents = calculateRealizedGains(mockTransactions, prices);
  
  const enrichedTransactions = mockTransactions.map(tx => {
    const event = taxEvents.find(e => e.transactionId === tx.id);
    return {
      ...tx,
      taxImpact: event || null
    };
  }).reverse(); // newest first
  
  return NextResponse.json(enrichedTransactions);
}
