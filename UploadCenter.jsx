import React, { useRef, useState } from 'react';
import { Upload, FileAudio, FileVideo, Scan, RefreshCw } from 'lucide-react';
import { ANALYSIS_STEPS } from './forensicEngine';

export default function UploadCenter({
  activeModality,
  stagedFile,
  isAnalyzing,
  analysisStepIndex,
  analysisProgress,
  onUploadFile,
  onClearFile,
  onRunAnalysis
}) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  return (
    <section className="bg-slate-900/70 border border-slate-800/90 rounded-xl p-5">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          const file = e.dataTransfer.files?.[0];
          if (file) onUploadFile(file);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition ${
          isDragging
            ? 'border-cyan-400 bg-cyan-500/10'
            : 'border-slate-700/80 hover:border-cyan-500/50 bg-slate-950/60'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={
            activeModality === 'image'
              ? '.jpg,.jpeg,.png,.webp,image/*'
              : activeModality === 'audio'
              ? '.mp3,.wav,.m4a,audio/*'
              : '.mp4,.mov,.webm,video/*'
          }
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onUploadFile(file);
          }}
          className="hidden"
        />
        <Upload className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
        <p className="text-sm font-semibold text-slate-200">
          Drag & drop your {activeModality} file here, or{' '}
          <span className="text-cyan-400 underline">browse device</span>
        </p>
        <p className="text-xs text-slate-500 font-mono mt-1">
          {activeModality === 'image' && 'Supported formats: .JPG, .PNG, .WEBP'}
          {activeModality === 'audio' && 'Supported formats: .MP3, .WAV, .M4A'}
          {activeModality === 'video' && 'Supported formats: .MP4, .MOV, .WEBM'}
        </p>
      </div>

      {stagedFile && (
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            {stagedFile.mode === 'image' && stagedFile.previewUrl ? (
              <img
                src={stagedFile.previewUrl}
                alt={stagedFile.name}
                className="w-12 h-12 rounded-lg object-cover border border-slate-700 shrink-0"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
                {stagedFile.mode === 'audio' ? (
                  <FileAudio className="w-5 h-5 text-cyan-400" />
                ) : (
                  <FileVideo className="w-5 h-5 text-cyan-400" />
                )}
              </div>
            )}

            <div className="min-w-0">
              <div className="text-sm font-bold text-white truncate">{stagedFile.name}</div>
              <div className="text-xs font-mono text-slate-400 mt-0.5 flex flex-wrap items-center gap-2">
                <span>{stagedFile.size}</span>
                <span>•</span>
                <span>{stagedFile.resolution}</span>
                {stagedFile.duration && (
                  <>
                    <span>•</span>
                    <span>{stagedFile.duration}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                if (fileInputRef.current) fileInputRef.current.value = '';
                onClearFile();
              }}
              className="px-3 py-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs text-slate-400 hover:text-slate-200 transition"
            >
              Remove
            </button>
            <button
              onClick={onRunAnalysis}
              disabled={isAnalyzing}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center gap-2 transition cursor-pointer"
            >
              <Scan className="w-4 h-4" />
              <span>Run Analysis</span>
            </button>
          </div>
        </div>
      )}

      {isAnalyzing && (
        <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-cyan-500/40 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-cyan-300 flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
              {ANALYSIS_STEPS[analysisStepIndex]}
            </span>
            <span className="text-emerald-400 font-bold">{analysisProgress}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-150"
              style={{ width: `${analysisProgress}%` }}
            />
          </div>
        </div>
      )}
    </section>
  );
}
