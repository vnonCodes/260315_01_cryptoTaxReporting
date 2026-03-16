'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function PortfolioPage() {
  const [portfolio, setPortfolio] = useState<{ assets: any[], totalValue: number } | null>(null);

  useEffect(() => {
    fetch('/api/portfolio')
      .then(res => res.json())
      .then(data => setPortfolio(data));
  }, []);

  if (!portfolio) {
    return <div className="text-center p-12 animate-pulse text-slate-400">Loading multi-chain portfolio...</div>;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight">Portfolio</h1>
          <p className="text-slate-400 mt-1">Detailed breakdown of your holdings across all connected wallets and exchanges.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Asset Allocation</CardTitle>
          <CardDescription>Your multi-chain digital assets and cost basis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-slate-400">
                  <th className="font-semibold py-4 px-4">Asset</th>
                  <th className="font-semibold py-4 px-4 text-right">Quantity</th>
                  <th className="font-semibold py-4 px-4 text-right">Price</th>
                  <th className="font-semibold py-4 px-4 text-right">Avg. Cost Basis</th>
                  <th className="font-semibold py-4 px-4 text-right">Total Value</th>
                  <th className="font-semibold py-4 px-4 text-right">Unrealized P&L</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-200">
                {portfolio.assets.map((asset, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors cursor-pointer group">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-primary-400 shadow-inner">{asset.symbol[0]}</div>
                        <div>
                          <div className="font-medium text-white">{asset.name}</div>
                          <div className="text-xs text-slate-500">{asset.chain}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right font-medium">{formatNumber(asset.quantity)} {asset.symbol}</td>
                    <td className="py-4 px-4 text-right">
                      {formatCurrency(asset.currentPrice)}
                      <div className={asset.priceChange24h >= 0 ? 'text-emerald-400 text-xs' : 'text-red-400 text-xs'}>
                         {asset.priceChange24h >= 0 ? '+' : ''}{asset.priceChange24h.toFixed(2)}%
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">{formatCurrency(asset.avgCostBasis)}</td>
                    <td className="py-4 px-4 text-right font-semibold text-white">{formatCurrency(asset.value)}</td>
                    <td className="py-4 px-4 text-right text-emerald-400 font-medium">
                        {asset.unrealizedGain > 0 ? '+' : ''}{formatCurrency(asset.unrealizedGain)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
