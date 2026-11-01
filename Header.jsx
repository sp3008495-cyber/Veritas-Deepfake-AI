import React from 'react';
import { Shield, FileText, Download } from 'lucide-react';

export default function Header({ hasResult, onOpenReportModal, onExportJSON }) {
  return (
    <header className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur px-5 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-400/40 flex items-center justify-center">
            <Shield className="w-4 h-4 text-cyan-400" />
          </div>
          <span className="text-base font-bold tracking-tight text-white">Veritas AI</span>
          <span className="text-xs text-slate-500 hidden sm:inline">
            • Media Forensics & Deepfake Detection
          </span>
        </div>

        {hasResult && (
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenReportModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-200 transition"
            >
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span>PDF Summary</span>
            </button>
            <button
              onClick={onExportJSON}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
