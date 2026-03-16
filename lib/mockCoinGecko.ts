import { MarketData } from '../types';

const MOCK_PRICES: Record<string, { price: number; name: string }> = {
  BTC: { name: 'Bitcoin', price: 65000 },
  ETH: { name: 'Ethereum', price: 3400 },
  SOL: { name: 'Solana', price: 145 },
  BNB: { name: 'BNB', price: 580 },
  MATIC: { name: 'Polygon', price: 0.90 },
  AVAX: { name: 'Avalanche', price: 42 },
  UNI: { name: 'Uniswap', price: 11 },
  AAVE: { name: 'Aave', price: 120 },
  CRV: { name: 'Curve DAO Token', price: 0.45 },
  ARB: { name: 'Arbitrum', price: 1.20 },
  OP: { name: 'Optimism', price: 2.80 },
};

// Add realistic sparklines and random drift
function generateSparkline(currentPrice: number): number[] {
  const sparkline = [currentPrice];
  let price = currentPrice;
  for (let i = 0; i < 23; i++) {
    const change = price * (Math.random() * 0.04 - 0.02); // 2% up or down
    price += change;
    sparkline.push(price);
  }
  return sparkline.reverse();
}

export function getMockPrices(): MarketData[] {
  const data: MarketData[] = [];
  
  for (const [symbol, info] of Object.entries(MOCK_PRICES)) {
    // Simulate real-time drift per request
    const drift = info.price * (Math.random() * 0.01 - 0.005);
    const simulatedPrice = info.price + drift;
    
    data.push({
      id: info.name.toLowerCase().replace(/ /g, '-'),
      symbol,
      name: info.name,
      currentPrice: simulatedPrice,
      priceChange24h: (Math.random() * 10 - 5), // -5% to +5%
      volume24h: simulatedPrice * 100000 * Math.random(),
      sparkline: generateSparkline(simulatedPrice),
    });
  }
  
  return data;
}

export function getPrice(symbol: string): number {
  return MOCK_PRICES[symbol.toUpperCase()]?.price || 1; // Fallback to 1 USD
}
