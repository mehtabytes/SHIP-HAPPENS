import { ShieldCheck, AlertTriangle, Clock, XCircle, Network } from 'lucide-react';

const stats = [
  { label: 'Proven', value: 12, icon: ShieldCheck, color: 'text-trust-proven', bg: 'bg-trust-proven/10' },
  { label: 'Weak', value: 3, icon: AlertTriangle, color: 'text-trust-weak', bg: 'bg-trust-weak/10' },
  { label: 'Stale', value: 2, icon: Clock, color: 'text-trust-stale', bg: 'bg-trust-stale/10' },
  { label: 'Unproven', value: 1, icon: XCircle, color: 'text-trust-unproven', bg: 'bg-trust-unproven/10' },
];

export default function Overview() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-100">Repository Overview</h2>
        <div className="bg-dark-panel border border-dark-border px-4 py-2 rounded-md">
          <span className="text-sm text-gray-400">Repository Drift: </span>
          <span className="text-trust-stale font-bold text-lg">38%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-dark-panel border border-dark-border rounded-lg p-5 flex items-center justify-between shadow-sm hover:border-gray-600 transition-colors cursor-default">
            <div>
              <p className="text-sm text-gray-400 font-medium uppercase tracking-wider">{stat.label} Files</p>
              <p className="text-3xl font-bold text-gray-100 mt-1">{stat.value}</p>
            </div>
            <div className={`p-3 rounded-full ${stat.bg}`}>
              <stat.icon className={stat.color} size={24} />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-dark-panel border border-dark-border rounded-lg p-6 h-64 flex flex-col items-center justify-center text-gray-500">
        <Network size={32} className="mb-2 opacity-50" />
        <p>Trust Distribution Chart & Recent Activity will render here</p>
      </div>
    </div>
  );
}