import React, { useState, useEffect } from 'react';
import { Sparkles, Scan } from 'lucide-react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import UploadCenter from './components/UploadCenter';
import VerdictBanner from './components/VerdictBanner';
import ImageForensics from './components/ImageForensics';
import AudioForensics from './components/AudioForensics';
import VideoForensics from './components/VideoForensics';
import ReportModal from './components/ReportModal';
import { ANALYSIS_STEPS, buildFileForensics, formatSeconds } from './utils/forensicEngine';

export default function App() {
  const [activeModality, setActiveModality] = useState('image');
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const [stagedFile, setStagedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStepIndex, setAnalysisStepIndex] = useState(0);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState(null);

  const [scanHistory, setScanHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('veritas_ai_user_scans_only');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('veritas_ai_user_scans_only', JSON.stringify(scanHistory));
    } catch (e) {}
  }, [scanHistory]);

  const triggerToast = (msg, type = 'info') => {
    setToastMessage({ msg, type });
    setTimeout(() => {
      setToastMessage((prev) => (prev?.msg === msg ? null : prev));
    }, 3000);
  };

  const handleUploadedFile = (file) => {
    if (!file) return;
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    let detectedMode = activeModality;

    if (['jpg', 'jpeg', 'png', 'webp'].includes(ext) || file.type.startsWith('image/')) {
      detectedMode = 'image';
    } else if (['mp3', 'wav', 'm4a', 'ogg', 'aac'].includes(ext) || file.type.startsWith('audio/')) {
      detectedMode = 'audio';
    } else if (['mp4', 'mov', 'webm', 'mkv'].includes(ext) || file.type.startsWith('video/')) {
      detectedMode = 'video';
    } else {
      triggerToast(`Unsupported file ".${ext}". Please upload an Image, Audio, or Video file.`, 'error');
      return;
    }

    setActiveModality(detectedMode);
    setAnalysisResult(null);

    const sizeFormatted =
      file.size < 1024 * 1024
        ? `${(file.size / 1024).toFixed(1)} KB`
        : `${(file.size / (1024 * 1024)).toFixed(2)} MB`;

    const objectUrl = URL.createObjectURL(file);

    const baseFileObj = {
      id: 'file-' + Date.now(),
      name: file.name,
      mode: detectedMode,
      size: sizeFormatted,
      resolution:
        detectedMode === 'image'
          ? 'Checking dimensions...'
          : detectedMode === 'audio'
          ? '48 kHz / PCM'
          : '1080p @ 30fps',
      duration: detectedMode === 'image' ? null : '00:12.0',
      format: ext.toUpperCase(),
      previewUrl: objectUrl
    };

    if (detectedMode === 'image') {
      const img = new window.Image();
      img.onload = () => {
        setStagedFile((prev) =>
          prev && prev.id === baseFileObj.id
            ? { ...prev, resolution: `${img.naturalWidth} × ${img.naturalHeight} px` }
            : prev
        );
      };
      img.src = objectUrl;
    } else if (detectedMode === 'audio') {
      const aud = new window.Audio();
      aud.onloadedmetadata = () => {
        setStagedFile((prev) =>
          prev && prev.id === baseFileObj.id
            ? { ...prev, duration: formatSeconds(aud.duration) }
            : prev
        );
      };
      aud.src = objectUrl;
    } else if (detectedMode === 'video') {
      const vid = document.createElement('video');
      vid.onloadedmetadata = () => {
        setStagedFile((prev) =>
          prev && prev.id === baseFileObj.id
            ? {
                ...prev,
                resolution:
                  vid.videoWidth && vid.videoHeight
                    ? `${vid.videoWidth} × ${vid.videoHeight} px`
                    : '1920 × 1080 px',
                duration: formatSeconds(vid.duration)
              }
            : prev
        );
      };
      vid.src = objectUrl;
    }

    setStagedFile(baseFileObj);
  };

  const handleClearFile = () => {
    setStagedFile(null);
    setAnalysisResult(null);
    setIsAnalyzing(false);
  };

  const handleRunAnalysis = () => {
    if (!stagedFile || isAnalyzing) return;
    setIsAnalyzing(true);
    setAnalysisStepIndex(0);
    setAnalysisProgress(8);

    let tick = 0;
    const totalTicks = 20;

    const timer = setInterval(() => {
      tick += 1;
      const pct = Math.min(99, Math.round((tick / totalTicks) * 100));
      setAnalysisProgress(pct);
      setAnalysisStepIndex(
        Math.min(ANALYSIS_STEPS.length - 1, Math.floor((tick / totalTicks) * ANALYSIS_STEPS.length))
      );

      if (tick >= totalTicks) {
        clearInterval(timer);
        const finalResult = buildFileForensics(stagedFile);
        setAnalysisResult(finalResult);
        setIsAnalyzing(false);
        setAnalysisProgress(100);

        const newEntry = {
          id: 'scan-' + Date.now(),
          name: finalResult.name,
          mode: finalResult.mode,
          size: finalResult.size,
          verdict: finalResult.presetVerdict,
          fakeProbability: finalResult.fakeProbability,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          fullData: finalResult
        };
        setScanHistory((prev) => [newEntry, ...prev.slice(0, 14)]);
        triggerToast(`Analysis complete for "${finalResult.name}"`, 'success');
      }
    }, 110);
  };

  const handleExportJSON = () => {
    if (!analysisResult) return;
    const payload = {
      platform: 'Veritas AI Forensic Report',
      generatedAt: new Date().toISOString(),
      file: {
        name: analysisResult.name,
        modality: analysisResult.mode,
        size: analysisResult.size,
        resolution: analysisResult.resolution,
        duration: analysisResult.duration
      },
      verdict: {
        status: analysisResult.presetVerdict.toUpperCase(),
        fakeConfidencePct: analysisResult.fakeProbability,
        summary: analysisResult.summary
      }
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Veritas_Report_${analysisResult.name}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    triggerToast('Exported JSON forensic report.', 'success');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50">
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-slate-900 border border-cyan-500/50 text-xs text-cyan-100 shadow-xl">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{toastMessage.msg}</span>
          </div>
        </div>
      )}

      <Header
        hasResult={Boolean(analysisResult)}
        onOpenReportModal={() => setReportModalOpen(true)}
        onExportJSON={handleExportJSON}
      />

      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col lg:flex-row gap-5 p-4 lg:p-6">
        <Sidebar
          activeModality={activeModality}
          onSelectModality={setActiveModality}
          scanHistory={scanHistory}
          onClearHistory={() => setScanHistory([])}
          onRestoreHistoryItem={(item) => {
            if (item.fullData) {
              setActiveModality(item.fullData.mode);
              setStagedFile(item.fullData);
              setAnalysisResult(item.fullData);
            }
          }}
        />

        <main className="flex-1 min-w-0 flex flex-col gap-4">
          <UploadCenter
            activeModality={activeModality}
            stagedFile={stagedFile}
            isAnalyzing={isAnalyzing}
            analysisStepIndex={analysisStepIndex}
            analysisProgress={analysisProgress}
            onUploadFile={handleUploadedFile}
            onClearFile={handleClearFile}
            onRunAnalysis={handleRunAnalysis}
          />

          {!analysisResult && !isAnalyzing && (
            <div className="flex-1 bg-slate-900/40 border border-dashed border-slate-800/80 rounded-xl p-10 flex flex-col items-center justify-center text-center">
              <Scan className="w-8 h-8 text-slate-600 mb-2.5" />
              <h3 className="text-sm font-semibold text-slate-300">No Active Forensic Report</h3>
              <p className="text-xs text-slate-500 max-w-md mt-1">
                Upload an image, audio recording, or video file above and click{' '}
                <span className="text-slate-300 font-medium">Run Analysis</span> to inspect manipulation
                heatmaps, metadata integrity, and confidence scores.
              </p>
            </div>
          )}

          <VerdictBanner analysisResult={analysisResult} />

          {analysisResult?.mode === 'image' && <ImageForensics analysisResult={analysisResult} />}
          {analysisResult?.mode === 'audio' && <AudioForensics analysisResult={analysisResult} />}
          {analysisResult?.mode === 'video' && <VideoForensics analysisResult={analysisResult} />}
        </main>
      </div>

      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        analysisResult={analysisResult}
        onExportJSON={handleExportJSON}
      />
    </div>
  );
}
