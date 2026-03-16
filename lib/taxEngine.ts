import { Transaction, TaxEvent, TaxLot } from '../types';
import { getHistoricalPrice } from './historicalPrices';

export function calculateRealizedGains(transactions: Transaction[]): TaxEvent[] {
  const events: TaxEvent[] = [];
  const lots: Record<string, TaxLot[]> = {};

  const sortedTxs = [...transactions].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  for (const tx of sortedTxs) {
    const isCryptoBought = tx.assetIn && tx.assetIn !== 'USD' && tx.assetIn !== 'USDC' && tx.assetIn !== 'USDT';
    const isCryptoSold = tx.assetOut && tx.assetOut !== 'USD' && tx.assetOut !== 'USDC' && tx.assetOut !== 'USDT';

    if (tx.type === 'airdrop' && tx.assetIn && tx.amountIn) {
      const priceAtAirdrop = getHistoricalPrice(tx.assetIn, tx.timestamp);
      events.push({
        transactionId: tx.id,
        timestamp: tx.timestamp,
        asset: tx.assetIn,
        amountSold: tx.amountIn,
        proceeds: priceAtAirdrop * tx.amountIn,
        costBasis: 0,
        gainLoss: priceAtAirdrop * tx.amountIn,
        term: 'income',
        type: 'ordinary_income',
      });
      // also create a lot with 0 cost
      if (!lots[tx.assetIn]) lots[tx.assetIn] = [];
      lots[tx.assetIn].push({
        id: tx.id,
        asset: tx.assetIn,
        amount: tx.amountIn,
        pricePerUnit: 0,
        totalCost: 0,
        timestamp: tx.timestamp
      });
    }

    if (isCryptoBought && tx.amountIn && tx.assetIn) {
        if (!lots[tx.assetIn]) lots[tx.assetIn] = [];
        let pricePerUnit = getHistoricalPrice(tx.assetIn, tx.timestamp);
        
        // Use execution price if traded against USD/stables
        if (tx.assetOut && (tx.assetOut === 'USD' || tx.assetOut === 'USDC')) {
            pricePerUnit = (tx.amountOut || 0) / tx.amountIn;
        } else if (tx.assetOut) {
            // Traded against another crypto - use historical price of that crypto at that time
            const assetOutPrice = getHistoricalPrice(tx.assetOut, tx.timestamp);
            pricePerUnit = ((tx.amountOut || 0) * assetOutPrice) / tx.amountIn;
        }

        lots[tx.assetIn].push({
            id: tx.id,
            asset: tx.assetIn,
            amount: tx.amountIn,
            pricePerUnit,
            totalCost: pricePerUnit * tx.amountIn,
            timestamp: tx.timestamp
        });
    }

    if (isCryptoSold && tx.amountOut && tx.assetOut) {
        let amountToSell = tx.amountOut;
        let totalCostBasis = 0;
        let proceedsPerUnit = getHistoricalPrice(tx.assetOut, tx.timestamp);

        if (tx.assetIn && (tx.assetIn === 'USD' || tx.assetIn === 'USDC')) {
            proceedsPerUnit = (tx.amountIn || 0) / tx.amountOut;
        } else if (tx.assetIn) {
            const assetInPrice = getHistoricalPrice(tx.assetIn, tx.timestamp);
            proceedsPerUnit = ((tx.amountIn || 0) * assetInPrice) / tx.amountOut;
        }
        
        const totalProceeds = amountToSell * proceedsPerUnit;
        
        if (lots[tx.assetOut] && lots[tx.assetOut].length > 0) {
            const assetLots = lots[tx.assetOut];
            let holdingPeriodMs = 0;

            while (amountToSell > 0 && assetLots.length > 0) {
                const oldestLot = assetLots[0];
                if (oldestLot.amount <= amountToSell) {
                    amountToSell -= oldestLot.amount;
                    totalCostBasis += oldestLot.totalCost;
                    holdingPeriodMs = new Date(tx.timestamp).getTime() - new Date(oldestLot.timestamp).getTime();
                    assetLots.shift(); 
                } else {
                    oldestLot.amount -= amountToSell;
                    const partialCost = oldestLot.pricePerUnit * amountToSell;
                    oldestLot.totalCost -= partialCost;
                    totalCostBasis += partialCost;
                    holdingPeriodMs = new Date(tx.timestamp).getTime() - new Date(oldestLot.timestamp).getTime();
                    amountToSell = 0;
                }
            }

            const term = holdingPeriodMs > 365 * 24 * 60 * 60 * 1000 ? 'long' : 'short';

            events.push({
                transactionId: tx.id,
                timestamp: tx.timestamp,
                asset: tx.assetOut,
                amountSold: tx.amountOut,
                proceeds: totalProceeds,
                costBasis: totalCostBasis,
                gainLoss: totalProceeds - totalCostBasis,
                term,
                type: 'capital_gain'
            });
        }
    }
  }

  return events;
}

export function generateTaxReport(year: number, transactions: Transaction[]): TaxEvent[] {
  const allEvents = calculateRealizedGains(transactions);
  return allEvents.filter(e => new Date(e.timestamp).getFullYear() === year);
}
