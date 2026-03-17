import { describe, it, expect, vi } from 'vitest';
import { calculateRealizedGains, generateTaxReport } from '../lib/taxEngine';
import { Transaction } from '../types';

// Mock historicalPrices to have predictable prices for testing
vi.mock('../lib/historicalPrices', () => ({
  getHistoricalPrice: (symbol: string, timestamp: string) => {
    if (symbol === 'BTC') return 40000;
    if (symbol === 'ETH') return 2000;
    return 1;
  },
}));

describe('taxEngine', () => {
  it('should correctly calculate realized gains for a simple FIFO scenario', () => {
    const txs: Transaction[] = [
      {
        id: '1',
        type: 'buy',
        timestamp: '2024-01-01T12:00:00Z',
        assetIn: 'BTC',
        amountIn: 1,
        assetOut: 'USD',
        amountOut: 30000,
        feeAsset: 'USD',
        feeAmount: 10,
        chain: 'Bitcoin',
        source: 'Binance',
        hash: '0x123'
      },
      {
        id: '2',
        type: 'sell',
        timestamp: '2024-02-01T12:00:00Z',
        assetIn: 'USD',
        amountIn: 45000,
        assetOut: 'BTC',
        amountOut: 1,
        feeAsset: 'USD',
        feeAmount: 10,
        chain: 'Bitcoin',
        source: 'Binance',
        hash: '0x456'
      }
    ];

    const events = calculateRealizedGains(txs);
    expect(events).toHaveLength(1);
    expect(events[0].gainLoss).toBe(15000); // 45000 proceeds - 30000 cost basis
    expect(events[0].term).toBe('short');
  });

  it('should handle FIFO with multiple lots', () => {
    const txs: Transaction[] = [
      {
        id: '1',
        type: 'buy',
        timestamp: '2023-01-01T12:00:00Z',
        assetIn: 'BTC',
        amountIn: 1,
        assetOut: 'USD',
        amountOut: 20000,
        feeAsset: 'USD',
        feeAmount: 10,
        chain: 'Bitcoin',
        source: 'Binance',
        hash: '0x111'
      },
      {
        id: '2',
        type: 'buy',
        timestamp: '2024-01-01T12:00:00Z',
        assetIn: 'BTC',
        amountIn: 1,
        assetOut: 'USD',
        amountOut: 40000,
        feeAsset: 'USD',
        feeAmount: 10,
        chain: 'Bitcoin',
        source: 'Binance',
        hash: '0x222'
      },
      {
        id: '3',
        type: 'sell',
        timestamp: '2024-02-01T12:00:00Z',
        assetIn: 'USD',
        amountIn: 75000,
        assetOut: 'BTC',
        amountOut: 1.5,
        feeAsset: 'USD',
        feeAmount: 10,
        chain: 'Bitcoin',
        source: 'Binance',
        hash: '0x333'
      }
    ];

    // FIFO:
    // Lot 1 (1 BTC): 20000
    // Lot 2 (0.5 BTC of 1 BTC): 20000 (0.5 * 40000)
    // Total Cost Basis: 40000
    // Total Proceeds: 75000
    // Gain: 35000

    const events = calculateRealizedGains(txs);
    expect(events).toHaveLength(1);
    expect(events[0].gainLoss).toBe(35000);
    expect(events[0].costBasis).toBe(40000);
  });

  it('should identify long term gains correctly', () => {
     const txs: Transaction[] = [
      {
        id: '1',
        type: 'buy',
        timestamp: '2022-01-01T12:00:00Z',
        assetIn: 'BTC',
        amountIn: 1,
        assetOut: 'USD',
        amountOut: 20000,
        feeAsset: 'USD',
        feeAmount: 10,
        chain: 'Bitcoin',
        source: 'Binance',
        hash: '0xabc'
      },
      {
        id: '2',
        type: 'sell',
        timestamp: '2024-01-01T12:00:00Z',
        assetIn: 'USD',
        amountIn: 50000,
        assetOut: 'BTC',
        amountOut: 1,
        feeAsset: 'USD',
        feeAmount: 10,
        chain: 'Bitcoin',
        source: 'Binance',
        hash: '0xdef'
      }
    ];

    const events = calculateRealizedGains(txs);
    expect(events[0].term).toBe('long');
  });

  it('should handle airdrops as ordinary income', () => {
    const txs: Transaction[] = [
      {
        id: '1',
        type: 'airdrop',
        timestamp: '2024-01-01T12:00:00Z',
        assetIn: 'ETH',
        amountIn: 5,
        assetOut: null,
        amountOut: null,
        feeAsset: 'ETH',
        feeAmount: 0,
        chain: 'Ethereum',
        source: 'MetaMask',
        hash: '0x789'
      }
    ];

    // Price is mocked to 2000 for ETH
    // Income: 5 * 2000 = 10000

    const events = calculateRealizedGains(txs);
    expect(events).toHaveLength(1);
    expect(events[0].type).toBe('ordinary_income');
    expect(events[0].gainLoss).toBe(10000);
    expect(events[0].costBasis).toBe(0);
  });

  it('should filter events by year in generateTaxReport', () => {
    const txs: Transaction[] = [
      {
        id: '1',
        type: 'buy',
        timestamp: '2023-12-31T23:59:59Z',
        assetIn: 'BTC',
        amountIn: 1,
        assetOut: 'USD',
        amountOut: 20000,
        feeAsset: 'USD',
        feeAmount: 0,
        chain: 'Bitcoin',
        source: 'Binance',
        hash: '0x000'
      },
      {
        id: '2',
        type: 'sell',
        timestamp: '2024-01-01T00:00:01Z',
        assetIn: 'USD',
        amountIn: 40000,
        assetOut: 'BTC',
        amountOut: 1,
        feeAsset: 'USD',
        feeAmount: 0,
        chain: 'Bitcoin',
        source: 'Binance',
        hash: '0x999'
      }
    ];

    const report2024 = generateTaxReport(2024, txs);
    expect(report2024).toHaveLength(1);
    expect(new Date(report2024[0].timestamp).getFullYear()).toBe(2024);

    const report2023 = generateTaxReport(2023, txs);
    expect(report2023).toHaveLength(0);
  });
});
