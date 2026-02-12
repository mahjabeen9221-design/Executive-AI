
import React, { useState } from 'react';
import { generateVideo, downloadVideoAsset } from '../services/geminiService';

const VideoStudio: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [resolution, setResolution] = useState<'720p' | '1080p'>('720p');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [includeCaptions, setIncludeCaptions] = useState(true);
  const [includeVoice, setIncludeVoice] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [pipelineStep, setPipelineStep] = useState(0);

  const pipeline = [
    { label: "Visual Synthesis", desc: "Constructing realistic cinematic frames..." },
    { label: "Motion Logic", desc: "Applying executive-grade physics and movement..." },
    { label: "Captions Render", desc: "Embedding professional visual text overlays..." },
    { label: "Voice Sync", desc: "Aligning automated narrative metadata..." },
    { label: "Mastering", desc: "Final high-resolution encode in progress..." }
  ];

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    if (!(await (window as any).aistudio.hasSelectedApiKey())) {
      await (window as any).aistudio.openSelectKey();
    }

    setIsGenerating(true);
    setVideoUrl(null);
    setPipelineStep(0);
    
    const interval = setInterval(() => {
      setPipelineStep(prev => (prev < pipeline.length - 1 ? prev + 1 : prev));
    }, 25000);

    try {
      // Enhanced automated prompt for the production build
      let productionPrompt = `High-end cinematic realism, masterpiece quality. ${prompt}.`;
      if (includeCaptions) productionPrompt += " Professional bold captions appearing in frame as visual elements.";
      if (includeVoice) productionPrompt += " Scene designed for deep professional baritone voiceover narration.";

      const url = await generateVideo(productionPrompt, resolution, aspectRatio);
      if (url) {
        setVideoUrl(url);
        setPipelineStep(pipeline.length - 1);
      }
    } catch (err) {
      console.error(err);
      alert("Executive Production Node: Signal lost. Verify API project billing.");
    } finally {
      clearInterval(interval);
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (videoUrl) {
      downloadVideoAsset(videoUrl, `executive_production_${Date.now()}.mp4`);
    }
  };

  return (
    <div className="h-full bg-slate-50 flex flex-col p-4 md:p-8">
      <div className="max-w-7xl mx-auto w-full h-full flex flex-col space-y-6">
        <header className="flex justify-between items-center border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Automated Production Suite</h2>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Veo 3.1 • Cinema Engine</p>
          </div>
          {videoUrl && !isGenerating && (
            <button
              onClick={handleDownload}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-100 transition-all flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Download Master</span>
            </button>
          )}
        </header>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
          {/* Production Controls */}
          <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-200 p-5 space-y-6 shadow-sm overflow-y-auto">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Format & Scope</label>
              <div className="grid grid-cols-2 gap-2">
                <select 
                  value={resolution} 
                  onChange={(e) => setResolution(e.target.value as any)}
                  className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-bold focus:ring-1 focus:ring-emerald-500 outline-none"
                >
                  <option value="720p">720p HD</option>
                  <option value="1080p">1080p Ultra</option>
                </select>
                <select 
                  value={aspectRatio} 
                  onChange={(e) => setAspectRatio(e.target.value as any)}
                  className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-bold focus:ring-1 focus:ring-emerald-500 outline-none"
                >
                  <option value="16:9">Widescreen</option>
                  <option value="9:16">Portrait</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Production Options</label>
              <div className="space-y-2">
                <button 
                  onClick={() => setIncludeCaptions(!includeCaptions)}
                  className={`w-full flex justify-between items-center p-3 rounded-xl border transition-all ${includeCaptions ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-white border-slate-100 text-slate-400'}`}
                >
                  <span className="text-xs font-bold">Cinematic Captions</span>
                  <div className={`w-8 h-4 rounded-full relative transition-colors ${includeCaptions ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                    <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${includeCaptions ? 'right-0.5' : 'left-0.5'}`}></div>
                  </div>
                </button>
                <button 
                  onClick={() => setIncludeVoice(!includeVoice)}
                  className={`w-full flex justify-between items-center p-3 rounded-xl border transition-all ${includeVoice ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-white border-slate-100 text-slate-400'}`}
                >
                  <span className="text-xs font-bold">Vocal Narrative</span>
                  <div className={`w-8 h-4 rounded-full relative transition-colors ${includeVoice ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                    <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${includeVoice ? 'right-0.5' : 'left-0.5'}`}></div>
                  </div>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Creative Brief</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the automated realism you seek..."
                className="w-full h-32 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs font-medium focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all resize-none"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full py-4 bg-slate-900 hover:bg-black disabled:bg-slate-100 disabled:text-slate-400 text-white rounded-2xl font-black uppercase tracking-[0.2em] transition-all shadow-xl flex items-center justify-center space-x-3 text-xs"
            >
              {isGenerating ? 'Synthesizing...' : 'Build Production'}
            </button>
          </div>

          {/* Production Preview & Pipeline */}
          <div className="lg:col-span-3 flex flex-col space-y-4">
            <div className="flex-1 bg-slate-900 rounded-[2.5rem] border-[12px] border-slate-800 shadow-2xl overflow-hidden relative flex items-center justify-center">
              {isGenerating ? (
                <div className="flex flex-col items-center space-y-8 p-12 text-center">
                  <div className="w-24 h-24 relative">
                    <div className="absolute inset-0 border-4 border-emerald-500/10 rounded-full scale-150 animate-pulse"></div>
                    <div className="absolute inset-0 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-emerald-400 font-black uppercase tracking-[0.3em] text-sm">{pipeline[pipelineStep].label}</p>
                    <p className="text-slate-500 text-[10px] font-bold uppercase">{pipeline[pipelineStep].desc}</p>
                  </div>
                  {/* Pipeline Progress Vis */}
                  <div className="flex space-x-1">
                    {pipeline.map((_, i) => (
                      <div key={i} className={`h-1 w-8 rounded-full transition-all duration-1000 ${i <= pipelineStep ? 'bg-emerald-500' : 'bg-slate-700'}`}></div>
                    ))}
                  </div>
                </div>
              ) : videoUrl ? (
                <video src={videoUrl} controls autoPlay loop className="w-full h-full object-contain" />
              ) : (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto border border-slate-700">
                    <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Emerald Motion Suite Idle</p>
                </div>
              )}
            </div>

            {/* Stage Feedback */}
            {isGenerating && (
              <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
                  <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Active Production Stream</span>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Est. Time Remaining: ~2.5 Minutes</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoStudio;
