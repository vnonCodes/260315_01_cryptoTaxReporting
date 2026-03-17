'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { motion } from 'framer-motion';
import { CheckCircle2, RotateCw, Plus, Key, Link as LinkIcon } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/utils';

const INTEGRATIONS = [
  { name: 'Coinbase', type: 'Exchange', status: 'connected', lastSync: '10 mins ago', id: 'coinbase' },
  { name: 'Binance', type: 'Exchange', status: 'connected', lastSync: '1 hour ago', id: 'binance' },
  { name: 'MetaMask', type: 'Wallet', status: 'connected', lastSync: 'Just now', id: 'metamask' },
  { name: 'Phantom', type: 'Wallet', status: 'syncing', lastSync: '-', id: 'phantom' },
  { name: 'Kraken', type: 'Exchange', status: 'disconnected', lastSync: '-', id: 'kraken' },
  { name: 'Uniswap', type: 'DeFi Protocol', status: 'auto-detected', lastSync: 'Just now', id: 'uniswap' },
];

export default function IntegrationsPage() {
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const handleSync = (id: string) => {
    setSyncingId(id);
    // Simulate sync delay
    setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      setSyncingId(null);
    }, 1500);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight">Integrations</h1>
          <p className="text-slate-400 mt-1">Connect exchanges, wallets, and DeFi protocols.</p>
        </div>
        <button 
          onClick={() => setIsApiModalOpen(true)}
          className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-primary-500/20"
        >
          <Plus className="w-4 h-4" /> Add Integration
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {INTEGRATIONS.map((integration, i) => (
          <motion.div 
            key={integration.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="h-full flex flex-col group hover:border-primary-500/50 transition-colors">
              <CardHeader className="pb-4 border-b border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-indigo-500/10 transition-all duration-500" />
                <div className="flex justify-between items-start z-10 relative">
                  <div>
                    <CardTitle className="text-lg">{integration.name}</CardTitle>
                    <CardDescription className="mt-1">{integration.type}</CardDescription>
                  </div>
                  <div className="text-right">
                    {(integration.status === 'connected' || syncingId === integration.id) && syncingId !== integration.id && (
                      <Badge variant="success" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 flex gap-1.5 items-center">
                        <CheckCircle2 className="w-3 h-3" /> Connected
                      </Badge>
                    )}
                    {(integration.status === 'syncing' || syncingId === integration.id) && (
                      <Badge variant="warning" className="bg-orange-500/10 text-orange-400 border-orange-500/20 flex gap-1.5 items-center">
                        <RotateCw className="w-3 h-3 animate-spin" /> Syncing
                      </Badge>
                    )}
                    {integration.status === 'disconnected' && syncingId !== integration.id && (
                      <Badge variant="secondary" className="bg-slate-700/50 text-slate-400 border-transparent">
                        Disconnected
                      </Badge>
                    )}
                     {integration.status === 'auto-detected' && syncingId !== integration.id && (
                      <Badge variant="outline" className="border-indigo-500/30 text-indigo-400">
                        Auto-detected
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4 flex-1 flex flex-col justify-end">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Last synced</span>
                  <span className="text-slate-300 font-medium">{syncingId === integration.id ? 'Syncing...' : integration.lastSync}</span>
                </div>
                {integration.status === 'disconnected' && (
                  <button 
                    onClick={() => setIsApiModalOpen(true)}
                    data-testid={`connect-${integration.id}`}
                    className="w-full mt-4 flex items-center justify-center gap-2 border border-slate-700 bg-slate-800 hover:bg-slate-700 hover:border-slate-600 text-slate-300 py-2 rounded-lg text-sm transition-all shadow-md active:scale-[0.98]"
                  >
                    <Key className="w-4 h-4" /> Connect API
                  </button>
                )}
                {integration.status !== 'disconnected' && (
                  <button 
                    onClick={() => handleSync(integration.id)}
                    disabled={syncingId !== null}
                    data-testid={`sync-${integration.id}`}
                    className="w-full mt-4 flex items-center justify-center gap-2 border border-slate-800 bg-slate-900/50 hover:bg-slate-800 hover:border-slate-700 text-slate-400 hover:text-white py-2 rounded-lg text-sm transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <RotateCw className={cn("w-4 h-4", syncingId === integration.id && "animate-spin")} /> {syncingId === integration.id ? 'Syncing...' : 'Sync Now'}
                  </button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
        
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: INTEGRATIONS.length * 0.1 }}
          >
             <button 
              onClick={() => setIsWalletModalOpen(true)}
              className="h-full min-h-[220px] w-full border-2 border-dashed border-slate-700 hover:border-slate-500 hover:bg-slate-800/30 rounded-xl flex flex-col items-center justify-center gap-3 text-slate-500 hover:text-slate-300 transition-all group"
             >
                <div className="w-12 h-12 rounded-full bg-slate-800 group-hover:bg-slate-700 flex items-center justify-center transition-colors">
                  <Plus className="w-6 h-6 text-primary-500" />
                </div>
                <div className="font-medium text-lg">Add New Wallet</div>
                <div className="text-sm px-6 text-center text-slate-500">Support for 100+ blockchains and exchanges.</div>
             </button>
          </motion.div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={isApiModalOpen}
        onClose={() => setIsApiModalOpen(false)}
        title="Connect Exchange API"
        description="Securely sync your trade history via read-only API keys or OAuth."
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {['Coinbase', 'Binance', 'Kraken', 'KuCoin'].map(ex => (
              <button key={ex} className="flex items-center gap-3 p-3 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 hover:border-primary-500/50 transition-all text-sm text-slate-200">
                <div className="w-6 h-6 rounded bg-slate-700" /> {ex}
              </button>
            ))}
          </div>
          <div className="pt-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">API Key</label>
            <input type="text" placeholder="Enter API Key" className="w-full mt-1.5 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm outline-none focus:border-primary-500/50" />
          </div>
          <div className="pt-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">API Secret</label>
            <input type="password" placeholder="••••••••••••" className="w-full mt-1.5 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm outline-none focus:border-primary-500/50" />
          </div>
          <button className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-primary-500/20">
            Validate & Sync
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        title="Connect Web3 Wallet"
        description="Resolve your holdings across 100+ chains including Ethereum, Solana, and L2s."
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-2">
            {['MetaMask', 'Phantom', 'WalletConnect', 'Coinbase Wallet'].map(w => (
              <button key={w} className="flex items-center justify-between p-4 rounded-xl border border-slate-800 bg-slate-950 hover:bg-slate-900 hover:border-primary-500/50 transition-all group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-sm">{w[0]}</div>
                  <span className="text-sm font-medium text-slate-200">{w}</span>
                </div>
                <LinkIcon className="w-4 h-4 text-slate-600 group-hover:text-primary-400 transition-colors" />
              </button>
            ))}
          </div>
          <div className="relative py-4">
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-slate-800" />
            <span className="relative bg-slate-900 px-3 text-[10px] font-bold text-slate-600 uppercase tracking-widest left-1/2 -translate-x-1/2">Or manual entry</span>
          </div>
          <div>
             <input type="text" placeholder="ens.eth or 0x..." className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm outline-none focus:border-primary-500/50 font-mono" />
          </div>
          <button className="w-full bg-slate-100 hover:bg-white text-slate-950 font-bold py-3 rounded-xl transition-all">
            Resolve Balance
          </button>
        </div>
      </Modal>
    </motion.div>
  );
}
