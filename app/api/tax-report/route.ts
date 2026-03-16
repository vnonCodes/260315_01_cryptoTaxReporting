import { NextResponse } from 'next/server';
import { mockTransactions } from '@/lib/mockData';
import { generateTaxReport } from '@/lib/taxEngine';
import { getMockPrices } from '@/lib/mockCoinGecko';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const yearStr = searchParams.get('year') || '2024';
  const year = parseInt(yearStr, 10);
  
  const prices = getMockPrices().reduce((acc, curr) => {
    acc[curr.symbol] = curr.currentPrice;
    return acc;
  }, {} as Record<string, number>);

  const events = generateTaxReport(year, mockTransactions, prices);
  
  const totalGain = events.filter(e => e.gainLoss > 0).reduce((sum, e) => sum + e.gainLoss, 0);
  const totalLoss = events.filter(e => e.gainLoss < 0).reduce((sum, e) => sum + Math.abs(e.gainLoss), 0);
  const netTaxableIncome = totalGain - totalLoss;
  
  return NextResponse.json({
    year,
    events,
    summary: {
      totalGain,
      totalLoss,
      netTaxableIncome,
      estimatedTax: netTaxableIncome > 0 ? netTaxableIncome * 0.15 : 0 // flat 15% assumption for demo
    }
  });
}
