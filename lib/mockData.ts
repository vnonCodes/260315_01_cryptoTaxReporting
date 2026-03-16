import { Transaction, TransactionType } from '../types';

function createTx(
  id: string,
  timestamp: string,
  type: TransactionType,
  assetIn: string | null,
  amountIn: number | null,
  assetOut: string | null,
  amountOut: number | null,
  feeAsset: string = 'USDC',
  feeAmount: number = 0.5,
  chain: string = 'Ethereum',
  source: string = 'Binance'
): Transaction {
  return {
    id, timestamp, type, assetIn, amountIn, assetOut, amountOut, feeAsset, feeAmount, chain, source, hash: `0x${id.toLowerCase().repeat(4)}`
  };
}

export const mockTransactions: Transaction[] = [
  // 2022 Initial buys 
  createTx('TXP1', '2022-01-15T14:30:00Z', 'buy', 'BTC', 1.5, 'USD', 60000, 'USD', 5, 'Bitcoin', 'Coinbase'), // bought BTC at 40k
  createTx('TXP2', '2022-02-10T09:15:00Z', 'buy', 'ETH', 10, 'USD', 30000, 'USD', 2, 'Ethereum', 'Coinbase'), // bought ETH at 3k
  
  // 2023 Swaps & Trades
  createTx('TXP3', '2023-03-22T11:20:00Z', 'swap', 'SOL', 100, 'ETH', 2, 'ETH', 0.01, 'Ethereum', 'Uniswap'), // 2 ETH -> 100 SOL 
  createTx('TXP4', '2023-06-15T16:45:00Z', 'sell', 'USD', 35000, 'BTC', 0.5, 'USD', 10, 'Bitcoin', 'Kraken'), // sold 0.5 BTC at 70k -> nice gain
  
  // 2024 DeFi
  createTx('TXP5', '2024-01-05T08:00:00Z', 'stake', 'ETH', 5, null, null, 'ETH', 0.005, 'Ethereum', 'Lido'),
  createTx('TXP6', '2024-03-10T12:00:00Z', 'airdrop', 'ARB', 5000, null, null, 'ETH', 0.001, 'Arbitrum', 'Wallet'),
  createTx('TXP7', '2024-05-20T14:15:00Z', 'swap', 'UNI', 1000, 'ETH', 0.5, 'ETH', 0.002, 'Ethereum', 'Uniswap'),
  createTx('TXP8', '2024-08-01T09:00:00Z', 'lp_add', 'USDC', 5000, 'ETH', 1.5, 'ETH', 0.01, 'Ethereum', 'Uniswap'),
  createTx('TXP9', '2024-11-15T10:30:00Z', 'buy', 'SOL', 50, 'USDC', 5000, 'SOL', 0.01, 'Solana', 'Binance'),
  
  // 2025 Recent Activity
  createTx('TXP10', '2025-01-10T15:20:00Z', 'sell', 'USDC', 12000, 'ARB', 5000, 'ETH', 0.005, 'Arbitrum', 'Uniswap'), 
  createTx('TXP11', '2025-02-05T11:45:00Z', 'buy', 'AVAX', 200, 'USDC', 7000, 'AVAX', 0.1, 'Avalanche', 'TraderJoe'),
  createTx('TXP12', '2025-02-28T09:30:00Z', 'swap', 'BNB', 15, 'SOL', 30, 'BNB', 0.001, 'BNB Chain', 'PancakeSwap'),
];

export const mockPortfolioBalances = [
  { symbol: 'BTC', name: 'Bitcoin', chain: 'Bitcoin', quantity: 1.0, currentPrice: 65000, avgCostBasis: 40000 },
  { symbol: 'ETH', name: 'Ethereum', chain: 'Ethereum', quantity: 6.0, currentPrice: 3400, avgCostBasis: 2500 },
  { symbol: 'SOL', name: 'Solana', chain: 'Solana', quantity: 120.0, currentPrice: 145, avgCostBasis: 80 },
  { symbol: 'ARB', name: 'Arbitrum', chain: 'Arbitrum', quantity: 0.0, currentPrice: 1.2, avgCostBasis: 0 },
  { symbol: 'UNI', name: 'Uniswap', chain: 'Ethereum', quantity: 1000.0, currentPrice: 11, avgCostBasis: 8 },
  { symbol: 'AVAX', name: 'Avalanche', chain: 'Avalanche', quantity: 200.0, currentPrice: 42, avgCostBasis: 35 },
  { symbol: 'BNB', name: 'BNB', chain: 'BNB Chain', quantity: 15.0, currentPrice: 580, avgCostBasis: 450 },
];
