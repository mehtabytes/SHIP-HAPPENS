import { GitCommit, PlayCircle, ShieldCheck, AlertTriangle } from 'lucide-react';

const timelineData = [
  {
    id: 1,
    time: '10:45 AM',
    date: 'Today',
    type: 'agent_commit',
    title: 'Kiro Agent Committed Changes',
    description: 'Agent generated and committed new code to the repository.',
    icon: GitCommit,
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
    border: 'border-blue-500/30'
  },
  {
    id: 2,
    time: '10:45 AM',
    date: 'Today',
    type: 'watcher_trigger',
    title: 'Tracely Watcher Triggered',
    description: 'Detected git commit. Initiating test suite with coverage.',
    icon: PlayCircle,
    color: 'text-gray-300',
    bg: 'bg-gray-700/50',
    border: 'border-gray-600'
  },
  {
    id: 3,
    time: '10:46 AM',
    date: 'Today',
    type: 'verification_result',
    title: 'Verification Complete: Weak Proof',
    description: 'Tests passed, but agent-modified lines lack coverage.',
    metrics: { coverage: '45%', duration: '4.2s', state: 'Weak' },
    icon: AlertTriangle,
    color: 'text-trust-weak',
    bg: 'bg-trust-weak/10',
    border: 'border-trust-weak/50'
  },
  {
    id: 4,
    time: '09:15 AM',
    date: 'Today',
    type: 'verification_result',
    title: 'Verification Complete: Proven',
    description: 'AuthService tests executed successfully covering all new lines.',
    metrics: { coverage: '95%', duration: '2.1s', state: 'Proven' },
    icon: ShieldCheck,
    color: 'text-trust-proven',
    bg: 'bg-trust-proven/10',
    border: 'border-trust-proven/50'
  }
];

export default function VerificationHistory() {
  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-gray-100">Verification History</h2>
        <p className="text-sm text-gray-400 mt-1">Chronological log of agent changes and trust state calculations</p>
      </div>

      <div className="relative border-l border-dark-border ml-6 pl-8 space-y-8 mt-8">
        {timelineData.map((event) => {
          const Icon = event.icon;
          
          return (
            <div key={event.id} className="relative">
              {/* Timeline dot */}
              <div className={`absolute -left-[41px] top-1 p-1.5 rounded-full bg-dark-bg border-2 ${event.border}`}>
                <Icon size={16} className={event.color} />
              </div>
              
              {/* Content Card */}
              <div className="bg-dark-panel border border-dark-border rounded-lg p-5 hover:border-gray-600 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-200 text-lg">{event.title}</h3>
                  <span className="text-xs text-gray-500 font-mono bg-dark-bg px-2 py-1 rounded border border-dark-border">
                    {event.date} • {event.time}
                  </span>
                </div>
                
                <p className="text-sm text-gray-400 mb-4">{event.description}</p>
                
                {event.metrics && (
                  <div className="flex gap-4">
                    <div className="bg-dark-bg px-3 py-2 rounded border border-dark-border flex flex-col">
                      <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">State</span>
                      <span className={`text-sm font-medium ${event.color}`}>{event.metrics.state}</span>
                    </div>
                    <div className="bg-dark-bg px-3 py-2 rounded border border-dark-border flex flex-col">
                      <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">Coverage</span>
                      <span className="text-sm font-mono text-gray-300">{event.metrics.coverage}</span>
                    </div>
                    <div className="bg-dark-bg px-3 py-2 rounded border border-dark-border flex flex-col">
                      <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">Duration</span>
                      <span className="text-sm font-mono text-gray-300">{event.metrics.duration}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}