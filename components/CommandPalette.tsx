'use client';

import * as React from 'react';
import { Command } from 'cmdk';
import { Search, Wallet, FileText, ArrowLeftRight, LayoutDashboard, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

export function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  return (
    <>
      <div 
        onClick={() => setOpen(true)}
        className="relative w-96 hidden md:block cursor-pointer group"
      >
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 group-hover:text-primary-400 transition-colors" />
        <div className="w-full bg-slate-800/50 border border-slate-700/50 rounded-full py-1.5 pl-10 pr-4 text-sm text-slate-400 flex items-center justify-between group-hover:border-slate-600 transition-all">
          <span>Search transactions, assets...</span>
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-slate-700 bg-slate-900 px-1.5 font-mono text-[10px] font-medium text-slate-500 opacity-100">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 p-4 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" 
            />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: -20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: -20 }}
              className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden"
            >
              <Command className="flex flex-col h-full">
                <div className="flex items-center border-b border-slate-700 px-4">
                  <Search className="w-5 h-5 text-slate-400" />
                  <Command.Input 
                    placeholder="Type a command or search..." 
                    className="flex-1 bg-transparent border-0 py-4 px-3 text-slate-100 placeholder:text-slate-500 outline-none"
                  />
                  <button onClick={() => setOpen(false)} className="text-[10px] text-slate-500 border border-slate-700 rounded px-1.5 py-0.5 hover:bg-slate-800">ESC</button>
                </div>

                <Command.List className="max-h-[400px] overflow-y-auto p-2 scroll-py-2 custom-scrollbar">
                  <Command.Empty className="py-6 text-center text-sm text-slate-500">No results found.</Command.Empty>

                  <Command.Group heading={<span className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Navigation</span>}>
                    <CommandItem onSelect={() => runCommand(() => router.push('/'))} icon={<LayoutDashboard className="w-4 h-4" />}>Dashboard</CommandItem>
                    <CommandItem onSelect={() => runCommand(() => router.push('/portfolio'))} icon={<Wallet className="w-4 h-4" />}>Portfolio</CommandItem>
                    <CommandItem onSelect={() => runCommand(() => router.push('/transactions'))} icon={<ArrowLeftRight className="w-4 h-4" />}>Transactions</CommandItem>
                    <CommandItem onSelect={() => runCommand(() => router.push('/reports'))} icon={<FileText className="w-4 h-4" />}>Tax Reports</CommandItem>
                  </Command.Group>

                  <Command.Group heading={<span className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Assets</span>}>
                    <CommandItem onSelect={() => runCommand(() => router.push('/portfolio?asset=BTC'))} icon={<span className="w-4 h-4 flex items-center justify-center font-bold text-[10px]">₿</span>}>Bitcoin (BTC)</CommandItem>
                    <CommandItem onSelect={() => runCommand(() => router.push('/portfolio?asset=ETH'))} icon={<span className="w-4 h-4 flex items-center justify-center font-bold text-[10px]">Ξ</span>}>Ethereum (ETH)</CommandItem>
                    <CommandItem onSelect={() => runCommand(() => router.push('/portfolio?asset=SOL'))} icon={<span className="w-4 h-4 flex items-center justify-center font-bold text-[10px]">S</span>}>Solana (SOL)</CommandItem>
                  </Command.Group>

                  <Command.Group heading={<span className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Settings</span>}>
                    <CommandItem onSelect={() => runCommand(() => router.push('/settings'))} icon={<Settings className="w-4 h-4" />}>Settings</CommandItem>
                  </Command.Group>
                </Command.List>
                
                <div className="p-3 border-t border-slate-700 bg-slate-900/50 flex items-center justify-between text-[10px] text-slate-500">
                  <div className="flex gap-4">
                    <span className="flex items-center gap-1"><kbd className="bg-slate-800 border border-slate-700 px-1 rounded">↵</kbd> Select</span>
                    <span className="flex items-center gap-1"><kbd className="bg-slate-800 border border-slate-700 px-1 rounded">↑↓</kbd> Navigate</span>
                  </div>
                  <span>KryptoTax CMD Palette</span>
                </div>
              </Command>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

function CommandItem({ children, icon, onSelect }: { children: React.ReactNode, icon: React.ReactNode, onSelect?:() => void }) {
  return (
    <Command.Item 
      onSelect={onSelect}
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-300 aria-selected:bg-primary-500/10 aria-selected:text-white aria-selected:border-primary-500/20 border border-transparent transition-all cursor-pointer"
    >
      <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700 group-aria-selected:border-primary-500/50">
        {icon}
      </div>
      {children}
    </Command.Item>
  );
}
