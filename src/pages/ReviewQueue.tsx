import { useState } from 'react';
import { AlertTriangle, Clock, XCircle, CheckCircle2, GitPullRequest } from 'lucide-react';

const queueData = [
  { id: 1, name: 'User Profile Manager', state: 'stale', priority: 'High', blastRadius: 14, reason: '14 modules depend on this profile logic and its proof is stale.', action: 'Review git diff and rerun tests' },
  { id: 2, name: 'Payment Checkout Logic', state: 'weak', priority: 'High', blastRadius: 8, reason: 'Payment logic lacks test coverage for lines added by the agent.', action: 'Write missing unit tests' },
  { id: 3, name: 'Main Dashboard Shell', state: 'unproven', priority: 'Medium', blastRadius: 2, reason: 'Dashboard modified by agent with no proof recorded.', action: 'Execute test suite' },
];

const stateConfig = {
  weak: { icon: AlertTriangle, color: 'text-trust-weak', border: 'border-trust-weak' },
  stale: { icon: Clock, color: 'text-trust-stale', border: 'border-trust-stale' },
  unproven: { icon: XCircle, color: 'text-trust-unproven', border: 'border-trust-unproven' },
};

export default function ReviewQueue() {
  const [reviewedItems, setReviewedItems] = useState<Set<number>>(new Set());

  const toggleReview = (id: number) => {
    const newSet = new Set(reviewedItems);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setReviewedItems(newSet);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-100">Blast-Radius Review Queue</h2>
          <p className="text-sm text-gray-400 mt-1">Ranked by dependency impact times distrust weight</p>
        </div>
        <div className="bg-dark-panel px-4 py-2 rounded-md border border-dark-border text-sm">
          <span className="text-gray-400">Pending Reviews: </span>
          <span className="text-gray-100 font-bold">{queueData.length - reviewedItems.size}</span>
        </div>
      </div>

      <div className="space-y-4">
        {queueData.map((item) => {
          const isReviewed = reviewedItems.has(item.id);
          const config = stateConfig[item.state as keyof typeof stateConfig];
          const Icon = config.icon;

          return (
            <div 
              key={item.id} 
              className={`bg-dark-panel border ${isReviewed ? 'border-dark-border opacity-50' : 'border-gray-700'} rounded-lg p-5 transition-all duration-300 relative overflow-hidden flex gap-5`}
            >
              {/* Left Color Bar */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${isReviewed ? 'bg-gray-700' : config.border.replace('border-', 'bg-')}`}></div>
              
              {/* Icon & Priority */}
              <div className="flex flex-col items-center justify-start gap-2 pl-2">
                <div className={`p-2 rounded-full ${isReviewed ? 'bg-dark-bg text-gray-500' : config.color.replace('text-', 'bg-') + '/10 ' + config.color}`}>
                  <Icon size={20} />
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${item.priority === 'High' && !isReviewed ? 'text-red-400' : 'text-gray-500'}`}>
                  {item.priority}
                </span>
              </div>

              {/* Main Content */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h3 className={`font-semibold text-lg ${isReviewed ? 'text-gray-500 line-through' : 'text-gray-200'}`}>
                      {item.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 bg-dark-bg px-2 py-1 rounded border border-dark-border">
                    <GitPullRequest size={12} />
                    Blast Radius: {item.blastRadius} modules
                  </div>
                </div>
                
                <p className={`text-sm ${isReviewed ? 'text-gray-600' : 'text-gray-300'}`}>
                  <span className="font-semibold text-gray-500 mr-2">Reason:</span>
                  {item.reason}
                </p>
                <p className={`text-sm ${isReviewed ? 'text-gray-600' : 'text-blue-400/80'}`}>
                  <span className="font-semibold text-gray-500 mr-2">Action:</span>
                  {item.action}
                </p>
              </div>

              {/* Review Button */}
              <div className="flex items-center justify-center border-l border-dark-border pl-5 ml-2">
                <button 
                  onClick={() => toggleReview(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-medium transition-colors ${
                    isReviewed 
                      ? 'bg-dark-bg text-gray-400 border border-dark-border hover:text-gray-200' 
                      : 'bg-blue-600/10 text-blue-400 border border-blue-500/30 hover:bg-blue-600/20'
                  }`}
                >
                  <CheckCircle2 size={16} />
                  {isReviewed ? 'Reviewed' : 'Mark Reviewed'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}