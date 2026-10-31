import { ShieldCheck, AlertTriangle, Clock, XCircle, Filter } from 'lucide-react';

// Simplified feature names instead of raw file names
const filesData = [
  { id: 1, name: 'Login & Authentication', state: 'proven', coverage: 95, lines: 12 },
  { id: 2, name: 'User Profile Manager', state: 'stale', coverage: 82, lines: 45 },
  { id: 3, name: 'Payment Checkout Logic', state: 'weak', coverage: 45, lines: 28 },
  { id: 4, name: 'Main Dashboard Shell', state: 'unproven', coverage: 0, lines: 8 },
];

const stateConfig = {
  proven: { icon: ShieldCheck, color: 'text-trust-proven', bg: 'bg-trust-proven/10', text: 'Proven' },
  weak: { icon: AlertTriangle, color: 'text-trust-weak', bg: 'bg-trust-weak/10', text: 'Weak' },
  stale: { icon: Clock, color: 'text-trust-stale', bg: 'bg-trust-stale/10', text: 'Stale' },
  unproven: { icon: XCircle, color: 'text-trust-unproven', bg: 'bg-trust-unproven/10', text: 'Unproven' },
};

export default function ChangedFiles() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-100">Changed Files</h2>
        <button className="flex items-center gap-2 px-3 py-1.5 bg-dark-panel border border-dark-border rounded text-sm text-gray-300 hover:text-white transition-colors">
          <Filter size={16} />
          Filter
        </button>
      </div>

      <div className="bg-dark-panel border border-dark-border rounded-lg overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-dark-bg/50 border-b border-dark-border text-gray-400">
            <tr>
              <th className="px-6 py-4 font-medium">Feature Changed</th>
              <th className="px-6 py-4 font-medium">Trust State</th>
              <th className="px-6 py-4 font-medium">Coverage</th>
              <th className="px-6 py-4 font-medium">Lines Changed</th>
              <th className="px-6 py-4 font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-border">
            {filesData.map((file) => {
              const config = stateConfig[file.state as keyof typeof stateConfig];
              const Icon = config.icon;
              
              return (
                <tr key={file.id} className="hover:bg-dark-bg/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-200">{file.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
                      <Icon size={14} />
                      {config.text}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-mono ${file.coverage >= 80 ? 'text-trust-proven' : 'text-trust-weak'}`}>
                      {file.coverage}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-300 font-mono">
                    +{file.lines}
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-blue-400 hover:text-blue-300 text-xs font-medium transition-colors">
                      Review Diff
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}