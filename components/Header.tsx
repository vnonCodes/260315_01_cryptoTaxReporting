import { Bell, Search, User } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export function Header() {
  return (
    <header className="h-16 border-b border-white/5 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50 flex items-center justify-between px-8">
      
      <div className="flex items-center flex-1">
        <div className="relative w-96 hidden md:block">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search transactions, assets, or addresses..." 
            className="w-full bg-slate-800/50 border border-slate-700/50 rounded-full py-1.5 pl-10 pr-4 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <Badge variant="outline" className="text-[10px] hidden md:flex items-center gap-1.5 border-slate-700 bg-slate-800/30">
          <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse-glow" />
          Last synced: Just now
        </Badge>
        
        <button className="text-slate-400 hover:text-white transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-900" />
        </button>
        
        <div className="flex items-center gap-3 border-l border-white/10 pl-6 cursor-pointer group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 shrink-0 border border-white/10 group-hover:border-white/30 transition-all flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="hidden lg:block text-sm">
            <p className="font-medium text-slate-200 group-hover:text-white transition-colors">Tax Pro User</p>
            <p className="text-xs text-slate-500">Free Tier</p>
          </div>
        </div>
      </div>
      
    </header>
  );
}
