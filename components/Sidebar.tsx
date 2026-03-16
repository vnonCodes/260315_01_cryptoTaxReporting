'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Wallet, 
  ArrowLeftRight, 
  FileText, 
  Blocks,
  Settings 
} from 'lucide-react';
import { motion } from 'framer-motion';

const NAV_ITEMS = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Portfolio', href: '/portfolio', icon: Wallet },
  { name: 'Transactions', href: '/transactions', icon: ArrowLeftRight },
  { name: 'Tax Reports', href: '/reports', icon: FileText },
  { name: 'Integrations', href: '/integrations', icon: Blocks },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-white/5 bg-slate-900/50 backdrop-blur-xl h-screen flex flex-col fixed left-0 top-0 pt-6">
      <div className="px-6 mb-8 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary-600 to-indigo-500 flex items-center justify-center text-white font-bold text-xl">
          τ
        </div>
        <span className="text-xl font-display font-bold text-white tracking-tight">Krypto<span className="text-primary-400">Tax</span></span>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link key={item.name} href={item.href}>
              <span className={cn(
                "group flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 relative",
                isActive ? "text-white" : "text-slate-400 hover:text-white hover:bg-white/5"
              )}>
                {isActive && (
                  <motion.div 
                    layoutId="active-nav"
                    className="absolute inset-0 bg-primary-500/10 border border-primary-500/20 rounded-xl"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon className={cn("w-5 h-5 relative z-10", isActive ? "text-primary-400" : "text-slate-400 group-hover:text-white")} />
                <span className="relative z-10">{item.name}</span>
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto">
        <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-500/10 to-primary-500/10 border border-white/5">
          <p className="text-xs text-slate-300 font-medium mb-2">Sync Status</p>
          <div className="flex items-center gap-2 text-xs text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            All APIs connected
          </div>
        </div>
      </div>
    </aside>
  );
}
