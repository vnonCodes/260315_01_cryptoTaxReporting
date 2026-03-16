// lib/historicalPrices.ts

// A mock oracle that provides historical daily close prices.
// In a real app, this would fetch from an API like CoinGecko's /coins/{id}/history.

const HISTORICAL_BASE: Record<string, number> = {
  BTC: 45000,
  ETH: 2500,
  SOL: 100,
  BNB: 300,
  MATIC: 0.8,
  AVAX: 30,
  UNI: 7,
  AAVE: 90,
  CRV: 0.5,
  ARB: 1.0,
  OP: 2.0,
};

export function getHistoricalPrice(symbol: string, timestamp: string): number {
  const base = HISTORICAL_BASE[symbol.toUpperCase()] || 1;
  const date = new Date(timestamp);
  
  // Deterministic "historical" price based on date and symbol
  // This ensures the same timestamp/symbol always returns the same price
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
  const yearOffset = (date.getFullYear() - 2022) * 500;
  
  // A pseudo-random but deterministic swing based on the day
  const seed = dayOfYear + yearOffset + symbol.length;
  const swing = Math.sin(seed) * (base * 0.2); // +/- 20% swing
  
  return base + swing;
}
