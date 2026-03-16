import { Transaction, TaxEvent, TaxLot } from '../types';

export function calculateRealizedGains(transactions: Transaction[], currentPrices: Record<string, number>): TaxEvent[] {
  const events: TaxEvent[] = [];
  const lots: Record<string, TaxLot[]> = {};

  const sortedTxs = [...transactions].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  for (const tx of sortedTxs) {
    const isCryptoBought = tx.assetIn && tx.assetIn !== 'USD' && tx.assetIn !== 'USDC' && tx.assetIn !== 'USDT';
    const isCryptoSold = tx.assetOut && tx.assetOut !== 'USD' && tx.assetOut !== 'USDC' && tx.assetOut !== 'USDT';

    if (tx.type === 'airdrop' && tx.assetIn && tx.amountIn) {
      events.push({
        transactionId: tx.id,
        timestamp: tx.timestamp,
        asset: tx.assetIn,
        amountSold: tx.amountIn,
        proceeds: (currentPrices[tx.assetIn] || 1) * tx.amountIn, // Using current price for simplicity instead of historical
        costBasis: 0,
        gainLoss: (currentPrices[tx.assetIn] || 1) * tx.amountIn,
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
        let pricePerUnit = currentPrices[tx.assetIn] || 1; 
        
        // Approximate cost basis
        if (tx.assetOut && (tx.assetOut === 'USD' || tx.assetOut === 'USDC')) {
            pricePerUnit = (tx.amountOut || 0) / tx.amountIn;
        } else if (tx.assetOut && currentPrices[tx.assetOut]) {
            pricePerUnit = ((tx.amountOut || 0) * currentPrices[tx.assetOut]) / tx.amountIn;
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
        let proceedsPerUnit = currentPrices[tx.assetOut] || 1;

        if (tx.assetIn && (tx.assetIn === 'USD' || tx.assetIn === 'USDC')) {
            proceedsPerUnit = (tx.amountIn || 0) / tx.amountOut;
        } else if (tx.assetIn && currentPrices[tx.assetIn]) {
            proceedsPerUnit = ((tx.amountIn || 0) * currentPrices[tx.assetIn]) / tx.amountOut;
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

export function generateTaxReport(year: number, transactions: Transaction[], currentPrices: Record<string, number>): TaxEvent[] {
  const allEvents = calculateRealizedGains(transactions, currentPrices);
  return allEvents.filter(e => new Date(e.timestamp).getFullYear() === year);
}
