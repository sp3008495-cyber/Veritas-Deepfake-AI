import React from 'react';
import { getVerdictMeta } from './VerdictBanner';

export default function ReportModal({ isOpen, onClose, analysisResult, onExportJSON }) {
  if (!isOpen || !analysisResult) return null;
  const verdictMeta = getVerdictMeta(analysisResult);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-lg w-full p-5 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white">Forensic Report Summary</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xs">
            ✕
          </button>
        </div>
        <div className="space-y-2 text-xs font-mono bg-slate-950 p-3.5 rounded-lg border border-slate-800">
          <div className="flex justify-between">
            <span className="text-slate-400">File:</span>
            <span className="text-white">{analysisResult.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Modality:</span>
            <span className="text-cyan-300 uppercase">{analysisResult.mode}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Verdict:</span>
            <span className={verdictMeta?.accentColor}>{verdictMeta?.scoreText}</span>
          </div>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">{analysisResult.summary}</p>
        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 text-xs"
          >
            Print / Save PDF
          </button>
          <button
            onClick={onExportJSON}
            className="px-3 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-semibold text-xs"
          >
            Download JSON
          </button>
        </div>
      </div>
    </div>
  );
}
