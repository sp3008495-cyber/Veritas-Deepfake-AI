import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react';

export function getVerdictMeta(analysisResult) {
  if (!analysisResult) return null;
  const v = analysisResult.presetVerdict;
  if (v === 'authentic') {
    return {
      label: 'Authentic',
      scoreText: `${(100 - analysisResult.fakeProbability).toFixed(1)}% Authentic`,
      borderClass: 'border-emerald-500/40 bg-emerald-950/20',
      badgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
      accentColor: 'text-emerald-400',
      barColor: 'bg-emerald-400',
      Icon: ShieldCheck
    };
  }
  if (v === 'suspicious') {
    return {
      label: 'Suspicious',
      scoreText: `${analysisResult.fakeProbability.toFixed(1)}% Risk`,
      borderClass: 'border-amber-500/40 bg-amber-950/20',
      badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
      accentColor: 'text-amber-400',
      barColor: 'bg-amber-400',
      Icon: AlertTriangle
    };
  }
  return {
    label: 'High Probability of Manipulation / Morphing',
    scoreText: `${analysisResult.fakeProbability.toFixed(1)}% Fake`,
    borderClass: 'border-rose-500/50 bg-rose-950/25',
    badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/50',
    accentColor: 'text-rose-400',
    barColor: 'bg-rose-500',
    Icon: ShieldAlert
  };
}

export default function VerdictBanner({ analysisResult }) {
  const verdictMeta = getVerdictMeta(analysisResult);
  if (!analysisResult || !verdictMeta) return null;

  return (
    <section className={`rounded-xl border p-4 ${verdictMeta.borderClass}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${verdictMeta.badgeClass}`}
            >
              <verdictMeta.Icon className="w-3.5 h-3.5" />
              {verdictMeta.label}
            </span>
            <span className="text-xs font-mono text-slate-400">{analysisResult.name}</span>
          </div>
          <p className="text-xs text-slate-200">{analysisResult.summary}</p>
        </div>

        <div className="sm:text-right shrink-0">
          <div className={`text-xl font-black font-mono ${verdictMeta.accentColor}`}>
            {verdictMeta.scoreText}
          </div>
          <div className="w-36 h-1.5 rounded-full bg-slate-800 overflow-hidden mt-1 sm:ml-auto">
            <div
              className={`h-full ${verdictMeta.barColor}`}
              style={{
                width: `${
                  analysisResult.presetVerdict === 'authentic'
                    ? 100 - analysisResult.fakeProbability
                    : analysisResult.fakeProbability
                }%`
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
