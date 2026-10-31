import { Search, RefreshCw, Wifi } from 'lucide-react';

export default function Topbar() {
  return (
    <header className="h-16 bg-dark-bg border-b border-dark-border flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input 
            type="text" 
            placeholder="Search files..." 
            className="bg-dark-panel border border-dark-border rounded-md pl-9 pr-4 py-1.5 text-sm text-gray-200 focus:outline-none focus:border-blue-500 transition-colors w-64"
          />
        </div>
      </div>
      <div className="flex items-center gap-6 text-sm text-gray-400">
        <div className="flex items-center gap-2">
          <RefreshCw size={14} className="cursor-pointer hover:text-gray-200" />
          <span>Last verified: Just now</span>
        </div>
        <div className="flex items-center gap-2 text-trust-proven bg-trust-proven/10 px-3 py-1 rounded-full">
          <Wifi size={14} />
          <span className="font-medium text-xs">System Connected</span>
        </div>
      </div>
    </header>
  );
}