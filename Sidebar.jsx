import React from 'react';
import { Image as ImageIcon, FileAudio, FileVideo, History, Trash2 } from 'lucide-react';

export default function Sidebar({
  activeModality,
  onSelectModality,
  scanHistory,
  onClearHistory,
  onRestoreHistoryItem
}) {
  return (
    <aside className="w-full lg:w-64 shrink-0 flex flex-col gap-4">
      <div className="bg-slate-900/70 border border-slate-800/90 rounded-xl p-3">
        <div className="text-[11px] font-mono uppercase text-slate-400 px-2 pb-2">
          Upload Mode
        </div>
        <div className="grid grid-cols-3 lg:grid-cols-1 gap-1.5">
          {[
            { id: 'image', label: 'Images', icon: ImageIcon },
            { id: 'audio', label: 'Audio', icon: FileAudio },
            { id: 'video', label: 'Video', icon: FileVideo }
          ].map((item) => {
            const IconComp = item.icon;
            const active = activeModality === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectModality(item.id)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-medium transition ${
                  active
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <IconComp className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 bg-slate-900/70 border border-slate-800/90 rounded-xl p-3.5 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
            <History className="w-3.5 h-3.5 text-cyan-400" />
            <span>Recent Scans</span>
          </div>
          {scanHistory.length > 0 && (
            <button
              onClick={onClearHistory}
              title="Clear History"
              className="text-slate-500 hover:text-rose-400 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {scanHistory.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500">
            No files scanned yet.
          </div>
        ) : (
          <div className="space-y-2 overflow-y-auto max-h-80">
            {scanHistory.map((item) => {
              const isManip = item.verdict === 'manipulated';
              const isSusp = item.verdict === 'suspicious';
              return (
                <button
                  key={item.id}
                  onClick={() => onRestoreHistoryItem(item)}
                  className="w-full text-left p-2.5 rounded-lg bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800/80 transition"
                >
                  <div className="text-xs font-medium text-slate-200 truncate">{item.name}</div>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-[10px] font-mono text-slate-500">{item.timestamp}</span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                        isManip
                          ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                          : isSusp
                          ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                          : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                      }`}
                    >
                      {isManip ? 'Manipulated' : isSusp ? 'Suspicious' : 'Authentic'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
}
