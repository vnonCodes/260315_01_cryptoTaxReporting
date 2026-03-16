'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, ArrowRight, Database, Globe, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LiveFeedPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const MOCK_FEED = [
  { id: 1, type: 'Mempool', action: 'Large Swap Detected', asset: 'ETH/USDC', amount: '45.2 ETH', time: 'Just now', icon: <Zap className="w-4 h-4 text-yellow-400" /> },
  { id: 2, type: 'L1 Finality', action: 'Block Confirmed', asset: 'Ethereum Mainnet', amount: 'Slot 892341', time: '12s ago', icon: <Layers className="w-4 h-4 text-indigo-400" /> },
  { id: 3, type: 'Bridge', action: 'Inbound Transfer', asset: 'Arbitrum → ETH', amount: '12,500 ARB', time: '1m ago', icon: <Globe className="w-4 h-4 text-primary-400" /> },
  { id: 4, type: 'Oracle', action: 'Price Push', asset: 'BTC/USD', amount: '$65,432.10', time: '2m ago', icon: <Database className="w-4 h-4 text-emerald-400" /> },
  { id: 5, type: 'Mempool', action: 'Liquidity Added', asset: 'UNI/ETH LP', amount: '$250k TVL', time: '5m ago', icon: <Zap className="w-4 h-4 text-yellow-400" /> },
];

export function LiveFeedPanel({ isOpen, onClose }: LiveFeedPanelProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[120] bg-slate-950/40 backdrop-blur-[2px]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-[130] w-full max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <ActivityIndicator />
                </div>
                <div>
                  <h2 className="text-lg font-display font-bold text-white">Live Operations</h2>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Mempool & Chain Data</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-white transition-all outline-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {MOCK_FEED.map((item) => (
                <div key={item.id} className="p-4 rounded-xl border border-slate-800 bg-slate-950/50 hover:bg-slate-800/50 transition-all group">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center border border-slate-800 group-hover:border-slate-700 transition-colors">
                        {item.icon}
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.type}</span>
                    </div>
                    <span className="text-[10px] text-slate-600 font-mono">{item.time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-200">{item.action}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{item.asset}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-white">{item.amount}</p>
                      <button className="text-[10px] text-primary-400 hover:text-primary-300 flex items-center gap-1 mt-1 transition-colors">
                        View Tx <ArrowRight className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="py-8 text-center">
                <div className="inline-block px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 text-xs text-slate-500">
                  Polling 1,240 nodes worldwide...
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-900/80">
              <button className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium transition-all border border-slate-700">
                Pause Live Synchronization
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function ActivityIndicator() {
  return (
    <div className="relative w-4 h-4">
      <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-75" />
      <div className="relative bg-emerald-500 rounded-full w-4 h-4" />
    </div>
  );
}
