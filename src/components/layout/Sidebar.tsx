import { LayoutDashboard, Network, FileCode2, ListChecks, History, Settings } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { name: 'Overview', icon: LayoutDashboard, path: '/' },
  { name: 'Trust Graph', icon: Network, path: '/graph' },
  { name: 'Changed Files', icon: FileCode2, path: '/files' },
  { name: 'Review Queue', icon: ListChecks, path: '/review' },
  { name: 'Verification History', icon: History, path: '/history' },
  { name: 'Settings', icon: Settings, path: '/settings' },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-dark-panel border-r border-dark-border h-screen flex flex-col">
      <div className="p-6">
        <h1 className="text-xl font-bold tracking-wider text-gray-100 flex items-center gap-3">
          <Network className="text-trust-proven" />
          TRACELY
        </h1>
      </div>
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors text-sm font-medium ${
                isActive 
                  ? 'bg-blue-500/10 text-blue-400' 
                  : 'text-gray-400 hover:bg-dark-border hover:text-gray-200'
              }`
            }
          >
            <item.icon size={18} />
            {item.name}
          </NavLink>
        ))}
      </nav>
      <div className="p-6 border-t border-dark-border text-xs text-gray-500 space-y-1">
        <p>Repo: <span className="text-gray-300">sample-repo</span></p>
        <p>Branch: <span className="text-gray-300">main</span></p>
      </div>
    </aside>
  );
}