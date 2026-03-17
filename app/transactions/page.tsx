'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';

export default function TransactionsPage() {
  const { data: transactions, isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => fetch('/api/transactions').then(res => res.json())
  });

  if (isLoading || !transactions) {
    return <div className="text-center p-12 animate-pulse text-slate-400">Loading transactions and calculating tax impact...</div>;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight">Transactions</h1>
          <p className="text-slate-400 mt-1">Every trade evaluated with real-time tax implications.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>History & Tax Impact</CardTitle>
          <CardDescription>All your historical transactions across wallets, exchanges, and DeFi protocols.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-slate-400">
                  <th className="font-semibold py-4 px-4 whitespace-nowrap">Date</th>
                  <th className="font-semibold py-4 px-4">Type</th>
                  <th className="font-semibold py-4 px-4 text-center">Asset In</th>
                  <th className="font-semibold py-4 px-4 text-center">Asset Out</th>
                  <th className="font-semibold py-4 px-4 text-right">Fee</th>
                  <th className="font-semibold py-4 px-4 text-right">Tax Impact</th>
                  <th className="font-semibold py-4 px-4 text-center">Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-200">
                {transactions.map((tx: Transaction) => {
                   const impact = tx.taxImpact;
                   let impactColor = "text-slate-500";
                   let impactText = "None";
                   let gainLossStr = "";

                   if (impact) {
                       if (impact.type === 'ordinary_income') {
                           impactColor = "text-orange-400";
                           impactText = "DeFi Income";
                       } else if (impact.gainLoss > 0) {
                           impactColor = "text-red-400";
                           impactText = `Capital Gain (${impact.term})`;
                       } else if (impact.gainLoss < 0) {
                           impactColor = "text-emerald-400";
                           impactText = `Capital Loss (${impact.term})`;
                       }
                       if (impact.gainLoss !== 0) {
                           gainLossStr = formatCurrency(Math.abs(impact.gainLoss));
                       }
                   }

                   return (
                  <tr key={tx.id} className="hover:bg-white/5 transition-colors group cursor-pointer">
                    <td className="py-4 px-4 text-slate-400 whitespace-nowrap">
                      {new Date(tx.timestamp).toLocaleString()}
                    </td>
                    <td className="py-4 px-4 capitalize font-medium text-white">
                      <Badge variant="outline" className="border-indigo-500/30 bg-indigo-500/10 text-indigo-300">
                        {tx.type.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-center">
                      {tx.assetIn ? (
                          <div className="font-medium">{formatNumber(tx.amountIn || 0)} <span className="text-slate-400">{tx.assetIn}</span></div>
                      ) : '-'}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {tx.assetOut ? (
                          <div className="font-medium">{formatNumber(tx.amountOut || 0)} <span className="text-slate-400">{tx.assetOut}</span></div>
                      ) : '-'}
                    </td>
                    <td className="py-4 px-4 text-right text-slate-500">
                      {formatNumber(tx.feeAmount)} {tx.feeAsset}
                    </td>
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                       <div className={`font-semibold ${impactColor}`}>
                           {impact ? (impact.gainLoss > 0 ? `+${gainLossStr}` : `-${gainLossStr}`) : '-'}
                       </div>
                       <div className="text-xs text-slate-500 mt-0.5">{impactText}</div>
                    </td>
                    <td className="py-4 px-4 text-center text-xs text-slate-400 uppercase tracking-wider">
                       {tx.source}
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
