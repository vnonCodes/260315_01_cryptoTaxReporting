'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Download } from 'lucide-react';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';

export default function ReportsPage() {
  const [year, setYear] = useState('2024');

  const { data: report, isLoading } = useQuery({
    queryKey: ['tax-report', year],
    queryFn: () => fetch(`/api/tax-report?year=${year}`).then(res => res.json())
  });

  const exportCSV = () => {
    if (!report || !report.events) return;
    const { events } = report;
    const headers = ['Description,Date,Proceeds (USD),Cost Basis (USD),Gain/Loss (USD),Term'];
    const rows = events.map((e: any) => 
      `${e.amountSold} ${e.asset},${new Date(e.timestamp).toLocaleDateString()},${e.proceeds.toFixed(2)},${e.costBasis.toFixed(2)},${e.gainLoss.toFixed(2)},${e.term}`
    );
    const csvContent = "data:text/csv;charset=utf-8," + headers.concat(rows).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Form_8949_${year}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading || !report) {
    return <div className="text-center p-12 text-slate-400">Compiling your tax events...</div>;
  }

  const { summary, events } = report;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight">Tax Reports</h1>
          <p className="text-slate-400 mt-1">Ready-to-file Form 8949 documents and year-end summaries.</p>
        </div>
        <div className="flex gap-4">
          <select 
            value={year} 
            onChange={(e) => setYear(e.target.value)}
            className="bg-slate-800 border-white/10 text-white rounded-lg px-4 py-2 focus:ring-1 focus:ring-primary-500 outline-none"
          >
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
          </select>
          <button 
            onClick={exportCSV}
            className="flex items-center gap-2 border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg text-sm text-white transition-all active:scale-95"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardDescription>Total Capital Gains</CardDescription>
            <CardTitle className="text-2xl mt-1 text-red-400 font-bold">{formatCurrency(summary.totalGain)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Total Capital Loss</CardDescription>
            <CardTitle className="text-2xl mt-1 text-emerald-400 font-bold">{formatCurrency(summary.totalLoss)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Net Taxable Income</CardDescription>
            <CardTitle className="text-2xl mt-1 text-white font-bold">{formatCurrency(summary.netTaxableIncome)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Estimated Tax</CardDescription>
            <CardTitle className="text-2xl mt-1 text-white font-bold">{formatCurrency(summary.estimatedTax)}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Form 8949 Events</CardTitle>
              <CardDescription>Sales and other dispositions of capital assets.</CardDescription>
            </div>
            <Badge variant="outline" className="border-indigo-500/30 text-indigo-400">
              {events.length} Taxable Events
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
             <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-slate-400">
                  <th className="font-semibold py-4 px-4 text-left">Description of Property (a)</th>
                  <th className="font-semibold py-4 px-4 text-left">Date Disposed (c)</th>
                  <th className="font-semibold py-4 px-4 text-right">Proceeds (d)</th>
                  <th className="font-semibold py-4 px-4 text-right">Cost Basis (e)</th>
                  <th className="font-semibold py-4 px-4 text-right">Gain / Loss (h)</th>
                  <th className="font-semibold py-4 px-4 text-center">Term</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-200">
                {events.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-slate-500 font-medium">No taxable events found for {year}.</td>
                  </tr>
                ) : events.map((event: any, i: number) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors group">
                    <td className="py-4 px-4">
                      <div className="font-medium text-white">{formatNumber(event.amountSold)} {event.asset}</div>
                      <div className="text-xs text-slate-500">ID: {event.transactionId}</div>
                    </td>
                    <td className="py-4 px-4 text-slate-400">{new Date(event.timestamp).toLocaleDateString()}</td>
                    <td className="py-4 px-4 text-right">{formatCurrency(event.proceeds)}</td>
                    <td className="py-4 px-4 text-right text-slate-400">{formatCurrency(event.costBasis)}</td>
                    <td className={`py-4 px-4 text-right font-semibold ${event.gainLoss > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                      {event.gainLoss > 0 ? '+' : ''}{formatCurrency(event.gainLoss)}
                    </td>
                    <td className="py-4 px-4 text-center">
                       <Badge variant="outline" className={`capitalize ${event.term === 'short' ? 'border-orange-500/30 text-orange-400' : 'border-indigo-500/30 text-indigo-400'}`}>
                         {event.term} term
                       </Badge>
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
