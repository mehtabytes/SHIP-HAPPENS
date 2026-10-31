import { Save, Terminal,  Cpu } from 'lucide-react';

export default function Settings() {
  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div>
        <h2 className="text-2xl font-bold text-gray-100">Configuration</h2>
        <p className="text-sm text-gray-400 mt-1">Manage your local watcher, verification engine, and agent hooks</p>
      </div>

      <div className="space-y-6">
        {/* Verification Engine Settings */}
        <div className="bg-dark-panel border border-dark-border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-5 text-gray-200 font-semibold border-b border-dark-border pb-3">
            <Terminal size={18} className="text-blue-400" />
            <h3>Verification Engine</h3>
          </div>
          
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Test & Coverage Command</label>
              <input 
                type="text" 
                defaultValue="npx c8 npm test" 
                className="w-full bg-dark-bg border border-dark-border rounded-md px-4 py-2 text-sm text-gray-200 focus:outline-none focus:border-blue-500 font-mono" 
              />
              <p className="text-xs text-gray-500 mt-1.5">The command the Watcher runs to generate the coverage report.</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Proof Strength Threshold (%)</label>
              <input 
                type="number" 
                defaultValue="80" 
                className="w-32 bg-dark-bg border border-dark-border rounded-md px-4 py-2 text-sm text-gray-200 focus:outline-none focus:border-blue-500 font-mono" 
              />
              <p className="text-xs text-gray-500 mt-1.5">Coverage below this percentage will be flagged as Weak Proof.</p>
            </div>
          </div>
        </div>

        {/* Agent Integration Settings */}
        <div className="bg-dark-panel border border-dark-border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-5 text-gray-200 font-semibold border-b border-dark-border pb-3">
            <Cpu size={18} className="text-purple-400" />
            <h3>Agent Integration</h3>
          </div>
          
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Assumptions & Decision Log Path</label>
              <input 
                type="text" 
                defaultValue="./kiro-assumptions.md" 
                className="w-full bg-dark-bg border border-dark-border rounded-md px-4 py-2 text-sm text-gray-200 focus:outline-none focus:border-purple-500 font-mono" 
              />
              <p className="text-xs text-gray-500 mt-1.5">The steering file where the agent writes its citations and decisions.</p>
            </div>
          </div>
        </div>
        
        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-md text-sm font-medium transition-colors shadow-lg shadow-blue-900/20">
            <Save size={16} />
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
}