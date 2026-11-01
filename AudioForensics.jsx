import React, { useState, useRef, useEffect } from 'react';
import { Radio, Play, Pause, Activity } from 'lucide-react';

export default function AudioForensics({ analysisResult }) {
  const [audioViewMode, setAudioViewMode] = useState('spectrogram');
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioPlayhead, setAudioPlayhead] = useState(0);
  const audioRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleTogglePlay = () => {
    if (isAudioPlaying) {
      setIsAudioPlaying(false);
      if (audioRef.current) audioRef.current.pause();
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    setIsAudioPlaying(true);
    if (audioRef.current && analysisResult?.previewUrl) {
      audioRef.current.play().catch(() => {});
    }
    timerRef.current = setInterval(() => {
      if (audioRef.current && audioRef.current.duration) {
        const pct = (audioRef.current.currentTime / audioRef.current.duration) * 100;
        setAudioPlayhead(Number(pct.toFixed(1)));
      } else {
        setAudioPlayhead((prev) => (prev >= 98 ? 0 : Number((prev + 2.5).toFixed(1))));
      }
    }, 120);
  };

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      <div className="lg:col-span-7 bg-slate-900/70 border border-slate-800/90 rounded-xl p-4">
        {analysisResult.previewUrl && (
          <audio
            ref={audioRef}
            src={analysisResult.previewUrl}
            onEnded={() => {
              setIsAudioPlaying(false);
              if (timerRef.current) clearInterval(timerRef.current);
            }}
            className="hidden"
          />
        )}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
            <Radio className="w-4 h-4 text-cyan-400" />
            Spectrogram & Phase Analysis
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handleTogglePlay}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-cyan-500 text-slate-950 font-bold text-xs"
            >
              {isAudioPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              <span>{isAudioPlaying ? 'Pause' : 'Play Audio'}</span>
            </button>
            <button
              onClick={() => setAudioViewMode((m) => (m === 'spectrogram' ? 'phase' : 'spectrogram'))}
              className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300"
            >
              View: {audioViewMode === 'spectrogram' ? 'Spectrogram' : 'Phase Inversion'}
            </button>
          </div>
        </div>

        {audioViewMode === 'spectrogram' ? (
          <div className="relative h-48 flex items-end gap-1 pt-6 pb-2 px-2 bg-slate-950 rounded-lg border border-slate-800 overflow-hidden">
            <div className="absolute top-2 left-2 right-2 flex justify-between text-[10px] font-mono text-rose-400">
              <span>Frequency Spectrum Analysis</span>
              <span>STFT Domain</span>
            </div>
            {Array.from({ length: 40 }).map((_, idx) => {
              const seed = ((idx * 17 + 11) % 37) / 37;
              const isAnom =
                analysisResult.presetVerdict !== 'authentic' &&
                ((idx >= 7 && idx <= 11) || (idx >= 24 && idx <= 29));
              return (
                <div
                  key={idx}
                  onClick={() => setAudioPlayhead(Math.round((idx / 40) * 100))}
                  className="flex-1 h-full flex items-end cursor-pointer"
                >
                  <div
                    className={`w-full rounded-t ${
                      isAnom
                        ? 'bg-gradient-to-t from-cyan-600 to-rose-500'
                        : 'bg-gradient-to-t from-slate-800 to-cyan-500/70'
                    }`}
                    style={{ height: `${Math.round(25 + seed * 65)}%` }}
                  />
                </div>
              );
            })}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-cyan-300"
              style={{ left: `${audioPlayhead}%` }}
            />
          </div>
        ) : (
          <div className="h-48 bg-slate-950 rounded-lg border border-slate-800 p-4 flex flex-col justify-between">
            <svg viewBox="0 0 600 140" className="w-full h-full">
              <line x1="0" y1="70" x2="600" y2="70" stroke="#1e293b" strokeDasharray="4 4" />
              <polyline
                fill="none"
                stroke="#06b6d4"
                strokeWidth="2"
                points="0,70 40,50 80,95 120,60 155,15 160,130 210,70 260,55 310,90 375,15 380,130 430,65 500,85 560,60 600,70"
              />
            </svg>
            <div className="text-[11px] font-mono text-slate-400">
              Phase correlation waveform across audio duration
            </div>
          </div>
        )}

        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
          {analysisResult.audioMetrics?.anomalies?.map((a, i) => (
            <div key={i} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs">
              <div className="font-semibold text-white">{a.label}</div>
              <div className="text-[11px] font-mono text-cyan-400 mt-0.5">
                {a.time} ({a.freq})
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="lg:col-span-5 bg-slate-900/70 border border-slate-800/90 rounded-xl p-4 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
          <Activity className="w-4 h-4 text-cyan-400" />
          Voice Artifact & Phase Scores
        </h3>
        {[
          {
            label: 'Synthetic Voice Artifact Score',
            val: analysisResult.audioMetrics?.vocoderScore || 0,
            bad: true
          },
          {
            label: 'Phase Inversion Discontinuity',
            val: analysisResult.audioMetrics?.phaseDiscontinuityScore || 0,
            bad: true
          },
          {
            label: 'Vocal Pitch Naturalness',
            val: analysisResult.audioMetrics?.microTremorNaturalness || 0,
            bad: false
          }
        ].map((m, idx) => (
          <div key={idx} className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
            <div className="flex justify-between text-xs font-medium mb-1.5">
              <span className="text-slate-200">{m.label}</span>
              <span className="font-mono text-cyan-300">{m.val}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div
                className={`h-full ${m.bad && m.val > 60 ? 'bg-rose-500' : 'bg-emerald-400'}`}
                style={{ width: `${m.val}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
