export type TransactionType = 'buy' | 'sell' | 'swap' | 'bridge' | 'stake' | 'unstake' | 'lp_add' | 'lp_remove' | 'airdrop' | 'transfer_in' | 'transfer_out';

export interface Asset {
  id: string; // e.g. 'bitcoin'
  symbol: string; // e.g. 'BTC'
  name: string; // e.g. 'Bitcoin'
  quantity: number;
  avgCostBasis: number;
  currentPrice: number;
  chain: string; // e.g. 'Bitcoin', 'Ethereum', 'Solana'
}

export interface Transaction {
  id: string;
  timestamp: string;
  type: TransactionType;
  assetIn: string | null;  // symbol
  amountIn: number | null;
  assetOut: string | null; // symbol
  amountOut: number | null;
  feeAsset: string;
  feeAmount: number;
  chain: string;
  source: string; // e.g. 'Binance', 'MetaMask'
  hash: string;
}

export interface TaxLot {
  id: string;
  asset: string;
  amount: number;
  pricePerUnit: number;
  totalCost: number;
  timestamp: string;
}

export interface TaxEvent {
  transactionId: string;
  timestamp: string;
  asset: string;
  amountSold: number;
  proceeds: number;
  costBasis: number;
  gainLoss: number;
  term: 'short' | 'long' | 'income';
  type: 'capital_gain' | 'ordinary_income';
}

export interface ChainBalance {
  chain: string;
  value: number;
  percentage: number;
}

export interface DeFiPosition {
  id: string;
  protocol: string;
  type: 'lending' | 'liquidity' | 'staking';
  assets: string[];
  value: number;
  rewards: number;
  apy: number;
}

export interface MarketData {
  id: string;
  symbol: string;
  name: string;
  currentPrice: number;
  priceChange24h: number;
  volume24h: number;
  sparkline: number[];
}
