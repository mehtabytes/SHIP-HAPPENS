
import { Handle, Position } from '@xyflow/react';
import { ShieldCheck, AlertTriangle, Clock, XCircle, FileCode2 } from 'lucide-react';

const stateConfig = {
  proven: { icon: ShieldCheck, color: 'text-trust-proven', glow: '#10b981' },
  weak: { icon: AlertTriangle, color: 'text-trust-weak', glow: '#f59e0b' },
  stale: { icon: Clock, color: 'text-trust-stale', glow: '#ef4444' },
  unproven: { icon: XCircle, color: 'text-trust-unproven', glow: '#6b7280' },
};

export default function TrustNode({ data }: { data: any }) {
  const config = stateConfig[data.state as keyof typeof stateConfig];
  const Icon = config.icon;

  return (
    <div className="relative w-64 rounded-xl overflow-hidden p-[2px] shadow-2xl">
      {/* Revolving Light Background */}
      <div 
        className="absolute inset-[-100%] animate-spin"
        style={{
          animationDuration: '4s',
          background: `conic-gradient(from 90deg at 50% 50%, transparent 50%, ${config.glow} 100%)`
        }}
      />
      
      {/* Inner Card Content */}
      <div className="relative bg-[#0f1115] h-full w-full rounded-lg p-4 flex flex-col gap-3 z-10 border border-gray-800">
        <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-gray-500 border-none" />
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FileCode2 size={16} className="text-gray-400" />
            <span className="font-semibold text-gray-200 text-sm">{data.label}</span>
          </div>
          <div className={`p-1 rounded bg-dark-bg/50 ${config.color}`}>
            <Icon size={14} />
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-2 flex justify-between items-center">
          <span className="text-xs text-gray-500">Coverage:</span>
          <span className={`text-xs font-mono font-medium ${config.color}`}>{data.coverage}%</span>
        </div>

        <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-gray-500 border-none" />
      </div>
    </div>
  );
}