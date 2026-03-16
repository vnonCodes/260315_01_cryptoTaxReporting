import { NextResponse } from 'next/server';
import { getMockPrices } from '@/lib/mockCoinGecko';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const coins = searchParams.get('coins');
  
  let prices = getMockPrices();
  if (coins) {
    const coinList = coins.split(',');
    prices = prices.filter(p => coinList.includes(p.symbol));
  }
  
  return NextResponse.json(prices);
}
