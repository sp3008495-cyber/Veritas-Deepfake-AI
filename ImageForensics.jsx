import React, { useState } from 'react';
import { Eye, FileCode } from 'lucide-react';

export default function ImageForensics({ analysisResult }) {
  const [elaEnabled, setElaEnabled] = useState(false);
  const [showFaceBoxes, setShowFaceBoxes] = useState(true);

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      <div className="lg:col-span-7 bg-slate-900/70 border border-slate-800/90 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-cyan-400" />
            Image Forensic View
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setElaEnabled((p) => !p)}
              className={`px-2.5 py-1 rounded text-xs font-mono border transition ${
                elaEnabled
                  ? 'bg-cyan-500/20 text-cyan-200 border-cyan-400'
                  : 'bg-slate-950 text-slate-400 border-slate-800'
              }`}
            >
              ELA: {elaEnabled ? 'ON' : 'OFF'}
            </button>
            <button
              onClick={() => setShowFaceBoxes((p) => !p)}
              className={`px-2.5 py-1 rounded text-xs font-mono border transition ${
                showFaceBoxes
                  ? 'bg-rose-500/20 text-rose-200 border-rose-400/60'
                  : 'bg-slate-950 text-slate-400 border-slate-800'
              }`}
            >
              Face Boxes: {showFaceBoxes ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        <div className="relative rounded-lg overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center min-h-[260px]">
          {analysisResult.previewUrl && (
            <img
              src={analysisResult.previewUrl}
              alt={analysisResult.name}
              className="w-full h-auto max-h-[360px] object-contain select-none"
              style={
                elaEnabled
                  ? {
                      filter:
                        'contrast(240%) brightness(75%) saturate(220%) invert(70%) hue-rotate(175deg)'
                    }
                  : undefined
              }
            />
          )}

          {elaEnabled &&
            analysisResult.elaHotspots?.map((spot, i) => (
              <div
                key={i}
                className="absolute pointer-events-none rounded-full mix-blend-screen"
                style={{
                  left: `${spot.x - spot.r}%`,
                  top: `${spot.y - spot.r}%`,
                  width: `${spot.r * 2}%`,
                  height: `${spot.r * 2}%`,
                  background:
                    'radial-gradient(circle, rgba(244,63,94,0.75) 0%, rgba(6,182,212,0.3) 50%, transparent 75%)'
                }}
              />
            ))}

          {showFaceBoxes &&
            analysisResult.faceBoxes?.map((box) => {
              const isAuth = box.type === 'authentic';
              return (
                <div
                  key={box.id}
                  style={{
                    left: `${box.x}%`,
                    top: `${box.y}%`,
                    width: `${box.w}%`,
                    height: `${box.h}%`
                  }}
                  className={`absolute ${
                    isAuth
                      ? 'border-2 border-emerald-400 bg-emerald-500/10'
                      : 'border-2 border-rose-500 bg-rose-500/15'
                  }`}
                >
                  <div
                    className={`absolute -top-5 left-0 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                      isAuth ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500 text-white'
                    }`}
                  >
                    {box.label} ({box.confidence}%)
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      <div className="lg:col-span-5 bg-slate-900/70 border border-slate-800/90 rounded-xl p-4 flex flex-col justify-between gap-4">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5 mb-3">
            <FileCode className="w-4 h-4 text-cyan-400" />
            Metadata Integrity Checks
          </h3>
          <div className="space-y-2">
            {analysisResult.metadataChecks?.map((item, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-2"
              >
                <div>
                  <div className="text-xs font-medium text-slate-200">{item.field}</div>
                  <div className="text-[11px] font-mono text-slate-400">{item.value}</div>
                </div>
                <span
                  className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                    item.status === 'pass'
                      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                      : item.status === 'warn'
                      ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                      : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                  }`}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {analysisResult.faceBoxes?.map((box) => (
          <div key={box.id} className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs">
            <div className="flex justify-between font-semibold text-white mb-1">
              <span>{box.label}</span>
              <span className="font-mono text-cyan-400">{box.confidence}%</span>
            </div>
            <p className="text-slate-400 text-[11px]">{box.detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
