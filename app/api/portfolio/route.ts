import { NextResponse } from 'next/server';
import { mockPortfolioBalances } from '@/lib/mockData';
import { getMockPrices } from '@/lib/mockCoinGecko';

export async function GET() {
  const prices = getMockPrices();
  
  const enrichedPortfolio = mockPortfolioBalances.map(asset => {
    const livePriceData = prices.find(p => p.symbol === asset.symbol);
    const currentPrice = livePriceData?.currentPrice || asset.currentPrice;
    const value = asset.quantity * currentPrice;
    
    return {
      ...asset,
      currentPrice,
      value,
      unrealizedGain: value - (asset.avgCostBasis * asset.quantity),
      priceChange24h: livePriceData?.priceChange24h || 0,
    };
  });
  
  const totalValue = enrichedPortfolio.reduce((sum, item) => sum + item.value, 0);

  return NextResponse.json({
    assets: enrichedPortfolio,
    totalValue
  });
}
