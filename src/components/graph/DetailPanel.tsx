import { X, ShieldCheck, AlertTriangle, Clock, XCircle, FileCode2, Terminal } from 'lucide-react';

const stateConfig = {
  proven: { icon: ShieldCheck, color: 'text-trust-proven', text: 'Proven', reason: 'Tests cover 95% of changed lines. No mutations survived.' },
  weak: { icon: AlertTriangle, color: 'text-trust-weak', text: 'Weak Proof', reason: 'Tests passed, but only covered 45% of agent-modified lines.' },
  stale: { icon: Clock, color: 'text-trust-stale', text: 'Stale Proof', reason: 'Proof existed, but file was modified by agent after tests ran.' },
  unproven: { icon: XCircle, color: 'text-trust-unproven', text: 'Unproven', reason: 'No test execution evidence found for these changes.' },
};

export default function DetailPanel({ nodeData, onClose }: { nodeData: any; onClose: () => void }) {
  if (!nodeData) return null;
  
  const config = stateConfig[nodeData.state as keyof typeof stateConfig];
  const Icon = config.icon;

  return (
    <div className="absolute top-0 right-0 w-80 h-full bg-dark-panel border-l border-dark-border shadow-2xl flex flex-col z-10 animate-fade-in">
      <div className="p-4 border-b border-dark-border flex justify-between items-center bg-dark-bg/50">
        <div className="flex items-center gap-2">
          <FileCode2 size={18} className="text-gray-400" />
          <h3 className="font-semibold text-gray-100">{nodeData.label}</h3>
        </div>
        <button onClick={onClose} className="p-1 text-gray-500 hover:text-gray-200 hover:bg-dark-border rounded">
          <X size={18} />
        </button>
      </div>

      <div className="p-5 flex-1 overflow-y-auto space-y-6">
        {/* Status Header */}
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded ${config.color.replace('text-', 'bg-').replace('trust', 'trust')}/10`}>
            <Icon size={24} className={config.color} />
          </div>
          <div>
            <div className={`font-bold ${config.color}`}>{config.text}</div>
            <div className="text-xs text-gray-400">Last verified: 10 mins ago</div>
          </div>
        </div>

        {/* Verification Explanation */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Verification Status</h4>
          <p className="text-sm text-gray-300 bg-dark-bg p-3 rounded border border-dark-border">
            {config.reason}
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-dark-bg p-3 rounded border border-dark-border">
            <div className="text-xs text-gray-500 mb-1">Coverage</div>
            <div className="text-lg font-mono text-gray-200">{nodeData.coverage}%</div>
          </div>
          <div className="bg-dark-bg p-3 rounded border border-dark-border">
            <div className="text-xs text-gray-500 mb-1">Changed Lines</div>
            <div className="text-lg font-mono text-gray-200">{nodeData.coverage > 0 ? '24' : '112'}</div>
          </div>
        </div>

        {/* Simulated Terminal Output */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Evidence Log</h4>
          <div className="bg-black p-3 rounded border border-dark-border font-mono text-[10px] text-gray-400 leading-relaxed">
            <div className="flex items-center gap-2 mb-2 border-b border-gray-800 pb-2">
              <Terminal size={12} />
              <span>npm run test:coverage</span>
            </div>
            {nodeData.state === 'proven' ? (
              <span className="text-trust-proven">✓ 4 tests passed<br/>✓ Coverage met</span>
            ) : nodeData.state === 'weak' ? (
              <span className="text-trust-weak">✓ tests passed<br/>! warning: lines 45-80 uncovered</span>
            ) : (
              <span className="text-trust-stale">! tests stale<br/>hashes mismatched</span>
            )}
          </div>
        </div>
      </div>

      {/* Footer Action */}
      <div className="p-4 border-t border-dark-border bg-dark-bg">
        <button className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-sm font-medium transition-colors">
          Re-run Verification
        </button>
      </div>
    </div>
  );
}