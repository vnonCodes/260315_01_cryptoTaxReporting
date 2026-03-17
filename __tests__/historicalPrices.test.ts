import { describe, it, expect } from 'vitest';
import { getHistoricalPrice } from '../lib/historicalPrices';

describe('historicalPrices', () => {
  it('should be deterministic for same symbol and date', () => {
    const symbol = 'BTC';
    const timestamp = '2024-01-01T12:00:00Z';
    
    const price1 = getHistoricalPrice(symbol, timestamp);
    const price2 = getHistoricalPrice(symbol, timestamp);
    
    expect(price1).toBe(price2);
    expect(price1).toBeGreaterThan(0);
  });

  it('should return different prices for different dates', () => {
    const symbol = 'BTC';
    const price1 = getHistoricalPrice(symbol, '2024-01-01T12:00:00Z');
    const price2 = getHistoricalPrice(symbol, '2024-02-01T12:00:00Z');
    
    expect(price1).not.toBe(price2);
  });

  it('should handle unknown symbols with a fallback', () => {
    const price = getHistoricalPrice('UNKNOWN_COIN_XYZ', '2024-01-01T12:00:00Z');
    expect(price).toBeGreaterThan(0);
  });
  
  it('should handle different cases for symbols', () => {
    const priceUpper = getHistoricalPrice('BTC', '2024-01-01T12:00:00Z');
    const priceLower = getHistoricalPrice('btc', '2024-01-01T12:00:00Z');
    
    expect(priceUpper).toBe(priceLower);
  });
});
