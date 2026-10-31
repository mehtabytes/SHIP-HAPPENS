
import { useState } from 'react';
import {
  GitCommit,
  PlayCircle,
  ShieldCheck,
  AlertTriangle,
  Loader2,
  XCircle,
} from 'lucide-react';
import { runVerification } from '../services/api';

interface VerificationResult {
  success: boolean;
  state?: string;
  message?: string;
  output?: string;
}

export default function VerificationHistory() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState('');

  async function handleVerification() {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await runVerification();
      setResult(data);
    } catch (err) {
      console.error('Verification error:', err);
      setError(
        'Could not connect to the backend. Make sure your backend server is running.'
      );
    } finally {
      setLoading(false);
    }
  }

  const isWeak = result?.state?.toLowerCase() === 'weak';
  const isProven = result?.success === true;

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-100">
            Verification History
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Run tests and check the repository trust status.
          </p>
        </div>

        <button
          onClick={handleVerification}
          disabled={loading}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <PlayCircle size={18} />
          )}
          {loading ? 'Verifying...' : 'Run Verification'}
        </button>
      </div>

      {error && (
        <div className="bg-trust-weak/10 border border-trust-weak/30 rounded-lg p-4 text-trust-weak">
          {error}
        </div>
      )}

      {result && (
        <div className="bg-dark-panel border border-dark-border rounded-lg p-5">
          <div className="flex items-center gap-2 mb-3">
            {isProven ? (
              <ShieldCheck className="text-trust-proven" size={24} />
            ) : isWeak ? (
              <AlertTriangle className="text-trust-weak" size={24} />
            ) : (
              <XCircle className="text-trust-unproven" size={24} />
            )}

            <h3 className="font-semibold text-gray-100">
              {isProven
                ? 'Verification Passed: Proven'
                : isWeak
                  ? 'Verification Complete: Weak Proof'
                  : 'Verification Failed'}
            </h3>
          </div>

          <p className="text-sm text-gray-400 mb-4">
            {result.message || 'Verification process completed.'}
          </p>

          <div className="bg-dark-bg rounded-lg border border-dark-border p-4">
            <p className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-2">
              Test Output
            </p>
            <pre className="text-sm text-gray-300 whitespace-pre-wrap overflow-auto max-h-96">
              {result.output || 'No test output available.'}
            </pre>
          </div>
        </div>
      )}

      <div className="bg-dark-panel border border-dark-border rounded-lg p-5">
        <div className="flex items-center gap-2 text-gray-300">
          <GitCommit size={20} />
          <span className="font-medium">Verification Activity</span>
        </div>

        <p className="text-sm text-gray-500 mt-2">
          {result
            ? 'The latest verification result is displayed above.'
            : 'Click Run Verification to execute the repository test suite.'}
        </p>
      </div>
    </div>
  );
}
