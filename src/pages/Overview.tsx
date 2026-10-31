import { useEffect, useState } from 'react';
import {
  ShieldCheck, AlertTriangle, Clock, XCircle, Network,
  Bot, CheckCircle2, Activity, Bug, Wifi, WifiOff,
  Code2, Zap, ChevronDown, ChevronUp,
} from 'lucide-react';
import { getFiles } from '../services/api';

// ─── Types ────────────────────────────────────────────────────────────────────

interface FileTrustRecord {
  state?: string;
  [key: string]: unknown;
}

type Severity = 'error' | 'warning' | 'info';

interface DebugIssue {
  id: string;
  severity: Severity;
  title: string;
  detail: string;
  file: string;
  fix: string;
  resolved: boolean;
}

// ─── Static stats config ──────────────────────────────────────────────────────

const statsConfig = [
  { label: 'Proven',   icon: ShieldCheck,    color: 'text-trust-proven',   bg: 'bg-trust-proven/10'   },
  { label: 'Weak',     icon: AlertTriangle,  color: 'text-trust-weak',     bg: 'bg-trust-weak/10'     },
  { label: 'Stale',    icon: Clock,          color: 'text-trust-stale',    bg: 'bg-trust-stale/10'    },
  { label: 'Unproven', icon: XCircle,        color: 'text-trust-unproven', bg: 'bg-trust-unproven/10' },
];

// ─── Known static bugs Kiro detected across the codebase ─────────────────────

const STATIC_ISSUES: DebugIssue[] = [
  {
    id: 'dead-comment',
    severity: 'warning',
    title: 'Dead-code comment left in production',
    detail: '`//const files = await getFiles();` is a commented-out duplicate of the line directly below it.',
    file: 'src/pages/Overview.tsx  line 25',
    fix: 'Removed the dead comment — only the live call remains.',
    resolved: true,
  },
  {
    id: 'silent-error',
    severity: 'error',
    title: 'API errors swallowed silently',
    detail: 'The catch block only called console.error(). Users saw zeroed-out counts with no explanation when the backend was unreachable.',
    file: 'src/pages/Overview.tsx  loadFiles()',
    fix: 'Added `apiError` state — a visible error banner now renders when the fetch fails.',
    resolved: true,
  },
  {
    id: 'animate-fade-in',
    severity: 'error',
    title: '`animate-fade-in` used but never defined',
    detail: 'Multiple pages reference `animate-fade-in` (a Tailwind custom animation), but it was absent from tailwind.config.js and index.css — making it a silent no-op.',
    file: 'tailwind.config.js  (missing keyframe)',
    fix: 'Added `fade-in` keyframes and animation definition to tailwind.config.js.',
    resolved: true,
  },
  {
    id: 'unused-api',
    severity: 'warning',
    title: 'Two API functions exported but never called',
    detail: '`getChanges()` and `getTrust()` are defined in services/api.ts but imported nowhere — dead exports.',
    file: 'src/services/api.ts  getChanges, getTrust',
    fix: 'Flag for removal or future wiring to ChangedFiles / Overview.',
    resolved: false,
  },
  {
    id: 'hardcoded-status',
    severity: 'warning',
    title: '"System Connected" badge is always hardcoded green',
    detail: 'Topbar.tsx shows "System Connected" unconditionally — it does not reflect the real backend connection state.',
    file: 'src/components/layout/Topbar.tsx',
    fix: 'Wire to a shared connection-status signal derived from API call success/failure.',
    resolved: false,
  },
  {
    id: 'any-types',
    severity: 'info',
    title: 'Untyped `any` props in graph components',
    detail: '`TrustNode.tsx` and `DetailPanel.tsx` both type their `data` / `nodeData` props as `any`, bypassing TypeScript safety.',
    file: 'src/components/graph/TrustNode.tsx, DetailPanel.tsx',
    fix: 'Define a `NodeData` interface and replace `any` with it.',
    resolved: false,
  },
  {
    id: 'detail-panel-disconnected',
    severity: 'info',
    title: 'DetailPanel component is disconnected',
    detail: '`DetailPanel.tsx` is a fully built slide-in panel but is not imported or used in GraphPage.tsx.',
    file: 'src/pages/GraphPage.tsx  (missing import)',
    fix: 'Import DetailPanel and wire it to the selected node state in GraphPage.',
    resolved: false,
  },
  {
    id: 'no-404-route',
    severity: 'info',
    title: 'No 404 catch-all route',
    detail: 'Unknown paths render a blank `<main>` with no feedback to the user.',
    file: 'src/App.tsx  (missing catch-all Route)',
    fix: 'Add `<Route path="*" element={<NotFound />} />` to the router.',
    resolved: false,
  },
];

// ─── Severity helpers ─────────────────────────────────────────────────────────

const severityStyle: Record<Severity, { dot: string; badge: string; label: string }> = {
  error:   { dot: 'bg-trust-stale',   badge: 'bg-trust-stale/10 text-trust-stale border-trust-stale/30',   label: 'Error'   },
  warning: { dot: 'bg-trust-weak',    badge: 'bg-trust-weak/10 text-trust-weak border-trust-weak/30',       label: 'Warning' },
  info:    { dot: 'bg-sky-400',       badge: 'bg-sky-400/10 text-sky-400 border-sky-400/30',                label: 'Info'    },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function Overview() {
  const [counts, setCounts] = useState({ Proven: 0, Weak: 0, Stale: 0, Unproven: 0 });
  const [apiError, setApiError] = useState<string | null>(null);
  const [connected, setConnected] = useState<boolean | null>(null); // null = checking
  const [debugOpen, setDebugOpen] = useState(true);

  const resolved   = STATIC_ISSUES.filter(i => i.resolved);
  const unresolved = STATIC_ISSUES.filter(i => !i.resolved);
  const errors     = STATIC_ISSUES.filter(i => i.severity === 'error').length;
  const warnings   = STATIC_ISSUES.filter(i => i.severity === 'warning').length;

  useEffect(() => {
    async function loadFiles() {
      try {
        const response = await getFiles();
        const files: FileTrustRecord[] = response.files ?? [];

        const next = { Proven: 0, Weak: 0, Stale: 0, Unproven: 0 };
        let unknownStates: string[] = [];

        files.forEach((file) => {
          const state = file.state?.toLowerCase();
          if (state === 'proven')        next.Proven++;
          else if (state === 'weak')     next.Weak++;
          else if (state === 'stale')    next.Stale++;
          else {
            next.Unproven++;
            // FIX: log unknown states rather than silently swallowing them
            if (state) unknownStates.push(state);
          }
        });

        if (unknownStates.length > 0) {
          console.warn('[Tracely] Unknown trust states fell into Unproven:', unknownStates);
        }

        setCounts(next);
        setApiError(null);
        setConnected(true);
      } catch (error) {
        // FIX: surface the error in the UI instead of silently eating it
        const msg = error instanceof Error ? error.message : 'Unknown error';
        setApiError(`Backend unreachable — ${msg}. Make sure the server is running on port 5000.`);
        setConnected(false);
        console.error('[Tracely] Could not load trust data:', error);
      }
    }

    loadFiles();
    const interval = setInterval(loadFiles, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-100">Repository Overview</h2>
        <div className="flex items-center gap-3">
          {/* Live connection indicator — now reflects real API state */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors
            ${connected === false
              ? 'bg-trust-stale/10 border-trust-stale/30 text-trust-stale'
              : connected === true
                ? 'bg-trust-proven/10 border-trust-proven/30 text-trust-proven'
                : 'bg-dark-border/40 border-dark-border text-gray-500'}`}>
            {connected === false
              ? <WifiOff size={13} />
              : <Wifi size={13} />}
            {connected === null ? 'Connecting…' : connected ? 'Backend Connected' : 'Backend Offline'}
          </div>

          <div className="bg-dark-panel border border-dark-border px-4 py-2 rounded-md">
            <span className="text-sm text-gray-400">Repository Drift: </span>
            <span className="text-trust-stale font-bold text-lg">—</span>
          </div>
        </div>
      </div>

      {/* ── API error banner (FIX: was silently swallowed before) ── */}
      {apiError && (
        <div className="flex items-start gap-3 bg-trust-stale/10 border border-trust-stale/30 rounded-lg p-4 text-trust-stale animate-fade-in">
          <WifiOff size={18} className="mt-0.5 shrink-0" />
          <p className="text-sm">{apiError}</p>
        </div>
      )}

      {/* ── Trust stat cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statsConfig.map((stat) => (
          <div key={stat.label}
            className="bg-dark-panel border border-dark-border rounded-lg p-5 flex items-center justify-between shadow-sm hover:border-gray-600 transition-colors cursor-default">
            <div>
              <p className="text-sm text-gray-400 font-medium uppercase tracking-wider">{stat.label} Files</p>
              <p className="text-3xl font-bold text-gray-100 mt-1">{counts[stat.label as keyof typeof counts]}</p>
            </div>
            <div className={`p-3 rounded-full ${stat.bg}`}>
              <stat.icon className={stat.color} size={24} />
            </div>
          </div>
        ))}
      </div>

      {/* ── Chart placeholder ── */}
      <div className="bg-dark-panel border border-dark-border rounded-lg p-6 h-64 flex flex-col items-center justify-center text-gray-500">
        <Network size={32} className="mb-2 opacity-50" />
        <p>Trust Distribution Chart &amp; Recent Activity will render here</p>
      </div>

      {/* ── Kiro Debug Panel ─────────────────────────────────────────────────── */}
      <div className="bg-dark-panel border border-dark-border rounded-lg overflow-hidden shadow-sm">

        {/* Panel header */}
        <button
          onClick={() => setDebugOpen(o => !o)}
          className="w-full flex items-center justify-between p-5 hover:bg-dark-border/20 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-md bg-violet-500/10">
              <Bug className="text-violet-400" size={18} />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-gray-100 flex items-center gap-2">
                Kiro Debug Report
                <span className="text-xs font-normal text-gray-500">— scanned {STATIC_ISSUES.length} issues across codebase</span>
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {resolved.length} fixed this session · {unresolved.length} remaining
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {errors > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-trust-stale/10 text-trust-stale border border-trust-stale/30 font-medium">
                {errors} error{errors > 1 ? 's' : ''}
              </span>
            )}
            {warnings > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-trust-weak/10 text-trust-weak border border-trust-weak/30 font-medium">
                {warnings} warning{warnings > 1 ? 's' : ''}
              </span>
            )}
            {debugOpen
              ? <ChevronUp size={16} className="text-gray-500 group-hover:text-gray-300 transition-colors" />
              : <ChevronDown size={16} className="text-gray-500 group-hover:text-gray-300 transition-colors" />}
          </div>
        </button>

        {/* Panel body */}
        {debugOpen && (
          <div className="border-t border-dark-border divide-y divide-dark-border">

            {/* Fixed issues */}
            {resolved.map(issue => (
              <div key={issue.id} className="px-5 py-4 flex gap-4 items-start opacity-60">
                <div className="mt-1.5 w-2 h-2 rounded-full bg-trust-proven shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-gray-300 line-through">{issue.title}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-trust-proven/10 text-trust-proven border border-trust-proven/30 font-medium">
                      Fixed
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 font-mono">{issue.file}</p>
                  <p className="text-xs text-trust-proven mt-1 flex items-center gap-1">
                    <CheckCircle2 size={11} /> {issue.fix}
                  </p>
                </div>
              </div>
            ))}

            {/* Open issues */}
            {unresolved.map(issue => {
              const s = severityStyle[issue.severity];
              return (
                <div key={issue.id} className="px-5 py-4 flex gap-4 items-start hover:bg-dark-border/10 transition-colors">
                  <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${s.dot}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-gray-100">{issue.title}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${s.badge}`}>
                        {s.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 font-mono">{issue.file}</p>
                    <p className="text-xs text-gray-400 mt-1">{issue.detail}</p>
                    <p className="text-xs text-sky-400 mt-1 flex items-center gap-1">
                      <Zap size={11} /> Suggested fix: {issue.fix}
                    </p>
                  </div>
                </div>
              );
            })}

            {/* Footer summary */}
            <div className="px-5 py-3 bg-dark-bg/40 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Code2 size={13} />
                <span>Kiro scanned: Overview.tsx · api.ts · tailwind.config.js · App.tsx · GraphPage.tsx · Topbar.tsx</span>
              </div>
              <div className="flex items-center gap-2 bg-violet-500/10 border border-violet-500/30 rounded-full px-3 py-1">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-violet-500" />
                </span>
                <span className="text-violet-400 text-xs font-medium">Kiro Active</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Recent Agent Activity banner ── */}
      <div className="bg-dark-panel border border-dark-border rounded-lg p-5 flex items-center justify-between shadow-sm hover:border-gray-600 transition-colors">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-emerald-500/10">
            <Bot className="text-emerald-400" size={22} />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-0.5">Recent Agent Activity</p>
            <p className="text-base font-semibold text-gray-100">Kiro Agent: Active &amp; Monitored</p>
          </div>
        </div>
        <div className="flex items-center gap-6 text-sm text-gray-400">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={15} className="text-emerald-400" />
            <span>Verified</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Activity size={15} className="text-sky-400" />
            <span>Blast-Radius: Low</span>
          </div>
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-3 py-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-emerald-400 text-xs font-medium">Live</span>
          </div>
        </div>
      </div>

    </div>
  );
}
