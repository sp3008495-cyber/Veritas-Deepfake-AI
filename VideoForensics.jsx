import React, { useState, useRef, useEffect, useMemo } from 'react';
import { FileVideo, Play, Pause, Zap, Sun } from 'lucide-react';

export default function VideoForensics({ analysisResult }) {
  const [currentFrame, setCurrentFrame] = useState(
    analysisResult.videoMetrics?.flaggedFrames?.[0]?.frame || 1
  );
  const [isScrubPlaying, setIsScrubPlaying] = useState(false);
  const [showLightingVectors, setShowLightingVectors] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    if (!isScrubPlaying) return;
    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev >= 360 ? 1 : prev + 3));
    }, 85);
    return () => clearInterval(interval);
  }, [isScrubPlaying]);

  useEffect(() => {
    if (videoRef.current && videoRef.current.duration) {
      const targetTime = (currentFrame / 360) * videoRef.current.duration;
      if (Number.isFinite(targetTime)) {
        videoRef.current.currentTime = targetTime;
      }
    }
  }, [currentFrame]);

  const activeFlaggedFrame = useMemo(() => {
    if (!analysisResult.videoMetrics?.flaggedFrames?.length) return null;
    return (
      analysisResult.videoMetrics.flaggedFrames.find((f) => Math.abs(f.frame - currentFrame) <= 8) ||
      analysisResult.videoMetrics.flaggedFrames[0]
    );
  }, [analysisResult, currentFrame]);

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      <div className="lg:col-span-7 bg-slate-900/70 border border-slate-800/90 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
            <FileVideo className="w-4 h-4 text-cyan-400" />
            Frame-by-Frame Timeline Scrubber
          </h3>
          <button
            onClick={() => setShowLightingVectors((p) => !p)}
            className={`px-2.5 py-1 rounded text-xs font-mono border ${
              showLightingVectors
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-950 text-slate-400 border-slate-800'
            }`}
          >
            Lighting Check: {showLightingVectors ? 'ON' : 'OFF'}
          </button>
        </div>

        <div className="relative rounded-lg overflow-hidden border border-slate-800 bg-slate-950 min-h-[240px] flex items-center justify-center">
          {analysisResult.previewUrl ? (
            <video
              ref={videoRef}
              src={analysisResult.previewUrl}
              muted
              playsInline
              className="w-full h-auto max-h-[320px] object-contain"
            />
          ) : (
            <FileVideo className="w-10 h-10 text-slate-700" />
          )}

          {showLightingVectors && analysisResult.presetVerdict !== 'authentic' && (
            <svg viewBox="0 0 800 450" className="absolute inset-0 w-full h-full pointer-events-none">
              <line x1="250" y1="65" x2="380" y2="165" stroke="#22d3ee" strokeWidth="2.5" strokeDasharray="5 3" />
              <line x1="420" y1="185" x2="330" y2="150" stroke="#f43f5e" strokeWidth="2.5" />
            </svg>
          )}

          {activeFlaggedFrame && (
            <div
              style={{
                left: `${activeFlaggedFrame.region.x}%`,
                top: `${activeFlaggedFrame.region.y}%`,
                width: `${activeFlaggedFrame.region.w}%`,
                height: `${activeFlaggedFrame.region.h}%`
              }}
              className="absolute border-2 border-rose-500 bg-rose-500/20 pointer-events-none"
            />
          )}

          <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded bg-slate-950/85 border border-slate-800 font-mono text-xs text-cyan-300">
            Frame #{currentFrame} / 360
          </div>
        </div>

        <div className="mt-3 p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsScrubPlaying((p) => !p)}
              className="px-2.5 py-1 rounded bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1"
            >
              {isScrubPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              <span>{isScrubPlaying ? 'Pause' : 'Scrub'}</span>
            </button>
            <input
              type="range"
              min="1"
              max="360"
              value={currentFrame}
              onChange={(e) => setCurrentFrame(Number(e.target.value))}
              className="flex-1 accent-cyan-400"
            />
          </div>

          {analysisResult.videoMetrics?.flaggedFrames?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {analysisResult.videoMetrics.flaggedFrames.map((ff) => (
                <button
                  key={ff.frame}
                  onClick={() => {
                    setIsScrubPlaying(false);
                    setCurrentFrame(ff.frame);
                  }}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono border ${
                    Math.abs(currentFrame - ff.frame) <= 5
                      ? 'bg-rose-500/20 text-rose-200 border-rose-400'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  ⚑ Frame #{ff.frame}: {ff.type}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="lg:col-span-5 bg-slate-900/70 border border-slate-800/90 rounded-xl p-4 space-y-4">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5 mb-2.5">
            <Zap className="w-4 h-4 text-cyan-400" />
            Temporal Consistency Scores
          </h3>
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <div className="text-[11px] text-slate-400">Temporal Consistency</div>
              <div className="text-base font-bold font-mono text-cyan-300 mt-0.5">
                {analysisResult.videoMetrics?.temporalConsistencyScore}%
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <div className="text-[11px] text-slate-400">Lighting Coherence</div>
              <div className="text-base font-bold font-mono text-cyan-300 mt-0.5">
                {analysisResult.videoMetrics?.lightingGeometryScore}%
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5 mb-2.5">
            <Sun className="w-4 h-4 text-amber-400" />
            Lighting & Shadow Warnings
          </h3>
          <div className="space-y-2">
            {analysisResult.videoMetrics?.lightingWarnings?.map((lw) => (
              <div key={lw.id} className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <div className="text-xs font-semibold text-white">{lw.title}</div>
                <p className="text-[11px] text-slate-400 mt-1">{lw.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
