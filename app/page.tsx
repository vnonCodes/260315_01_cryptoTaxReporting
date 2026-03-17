'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { motion } from 'framer-motion';
import { Wallet, Activity, ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { LiveFeedPanel } from '@/components/LiveFeedPanel';
import { useState } from 'react';

export default function DashboardPage() {
  const [isLiveFeedOpen, setIsLiveFeedOpen] = useState(false);
  const { data: portfolio, isLoading: isPortfolioLoading } = useQuery({
    queryKey: ['portfolio'],
    queryFn: () => fetch('/api/portfolio').then(res => res.json())
  });

  const { data: transactions, isLoading: isTxsLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => fetch('/api/transactions').then(res => res.json())
  });

  const { data: taxReport, isLoading: isReportLoading } = useQuery({
    queryKey: ['tax-report', '2025'],
    queryFn: () => fetch('/api/tax-report?year=2025').then(res => res.json())
  });

  const isLoading = isPortfolioLoading || isTxsLoading || isReportLoading;

  if (isLoading || !portfolio || !taxReport) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin w-8 h-8 rounded-full border-t-2 border-primary-500 border-r-2 border-r-transparent" />
      </div>
    );
  }

  const sortedAssets = [...portfolio.assets].sort((a, b) => b.value - a.value).slice(0, 3);
  const recentTxs = transactions?.slice(0, 5) || [];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight">Dashboard</h1>
          <p className="text-slate-400 mt-1">Real-time consolidated view of your multi-chain assets.</p>
        </div>
        <div className="flex gap-3">
           <button 
            className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition flex items-center gap-2 text-sm font-medium"
            onClick={() => setIsLiveFeedOpen(true)}
           >
            <Activity className="w-4 h-4 text-emerald-400" /> Live Feed
           </button>
        </div>
      </div>

      <LiveFeedPanel isOpen={isLiveFeedOpen} onClose={() => setIsLiveFeedOpen(false)} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-2 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-primary-500/20 transition-all duration-700" />
          <CardHeader>
            <CardDescription className="flex items-center gap-2">
              <Wallet className="w-4 h-4" /> Total Portfolio Value
            </CardDescription>
            <div className="flex items-baseline gap-3 mt-2">
              <CardTitle className="text-4xl lg:text-5xl font-bold text-white tracking-tight">
                {formatCurrency(portfolio.totalValue)}
              </CardTitle>
              <Badge variant="success" className="text-sm px-2.5 py-1">
                +4.2% (24h)
              </Badge>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>2025 Realized Gains</CardDescription>
            <CardTitle className="text-2xl mt-1 text-emerald-400 font-bold">
              {formatCurrency(taxReport.summary.totalGain - taxReport.summary.totalLoss)}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Est. 2025 Tax Liability</CardDescription>
            <CardTitle className="text-2xl mt-1 text-red-400 font-bold">
              {formatCurrency(taxReport.summary.estimatedTax)}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Top Holdings</CardTitle>
              <CardDescription>Your largest multi-chain positions</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mt-4">
              {sortedAssets.map(asset => (
                <div key={asset.id || asset.symbol} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition border border-transparent hover:border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-primary-400 border border-slate-700">
                      {asset.symbol[0]}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-200">{asset.name}</h4>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span>{formatNumber(asset.quantity)} {asset.symbol}</span>
                         • 
                        <span className="text-slate-500">{asset.chain}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-white">{formatCurrency(asset.value)}</p>
                    <div className="flex items-center justify-end gap-1 mt-0.5">
                      {asset.priceChange24h >= 0 ? (
                        <>
                          <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                          <span className="text-xs text-emerald-400">{asset.priceChange24h.toFixed(2)}%</span>
                        </>
                      ) : (
                        <>
                          <ArrowDownRight className="w-3 h-3 text-red-400" />
                          <span className="text-xs text-red-400">{Math.abs(asset.priceChange24h).toFixed(2)}%</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Constant tax basis updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mt-2">
              {recentTxs.map((tx: any) => (
                <div key={tx.id} className="text-sm flex gap-3 pb-3 border-b border-white/5 last:border-0 border-transparent hover:bg-white/5 p-1 rounded-lg transition-all">
                  <div className="mt-0.5 shrink-0">
                    {tx.type === 'buy' || tx.type === 'receive' || tx.type === 'airdrop' ? (
                      <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center"><ArrowDownRight className="w-3 h-3" /></div>
                    ) : tx.type === 'sell' ? (
                      <div className="w-6 h-6 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center"><ArrowUpRight className="w-3 h-3" /></div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center"><TrendingUp className="w-3 h-3" /></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-200 capitalize truncate max-w-[120px]">{tx.type.replace('_', ' ')} {(tx.assetIn || tx.assetOut)}</span>
                      <span className="text-[10px] text-slate-500 whitespace-nowrap">{new Date(tx.timestamp).toLocaleDateString()}</span>
                    </div>
                    {tx.taxImpact && tx.taxImpact.gainLoss !== 0 && (
                      <p className="text-[11px] mt-0.5 text-slate-400">
                        Basis: <span className={tx.taxImpact.gainLoss > 0 ? 'text-red-400' : 'text-emerald-400'}>
                          {tx.taxImpact.gainLoss > 0 ? '+' : ''}{formatCurrency(tx.taxImpact.gainLoss)}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
