
import React, { useState, useRef } from 'react';
import { ModelType } from '../types';
import { editImage } from '../services/geminiService';

const PhotoEditor: React.FC = () => {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [sourceMime, setSourceMime] = useState<string>('');
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSourceMime(file.type);
      const reader = new FileReader();
      reader.onload = (event) => {
        setSourceImage(event.target?.result as string);
        setResultImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    if (!sourceImage || !prompt.trim() || isProcessing) return;
    setIsProcessing(true);
    try {
      const result = await editImage(prompt, sourceImage, sourceMime, ModelType.NANO_BANANA);
      if (result) setResultImage(result);
    } catch (error) {
      console.error("Edit failed:", error);
      alert("Error: Enhancement failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="h-full bg-slate-50 flex flex-col p-6 md:p-10">
      <div className="max-w-6xl mx-auto w-full h-full flex flex-col space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-200 pb-6 space-y-4 md:space-y-0">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Advanced Photo Editor</h2>
            <p className="text-slate-500 text-sm font-medium">Precision enhancement powered by Emerald Flash</p>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-sm font-bold shadow-sm transition-all"
            >
              Select Source
            </button>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
          </div>
        </header>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-0">
          <div className="h-full flex flex-col space-y-4 min-h-0">
            <label className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Input Asset</label>
            <div className="flex-1 bg-white rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden relative shadow-sm">
              {sourceImage ? (
                <img src={sourceImage} className="max-w-full max-h-full object-contain" alt="Source" />
              ) : (
                <button onClick={() => fileInputRef.current?.click()} className="text-slate-300 hover:text-slate-400 flex flex-col items-center transition-colors">
                  <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-xs uppercase font-bold">Import Media</span>
                </button>
              )}
            </div>
          </div>

          <div className="h-full flex flex-col space-y-4 min-h-0">
            <label className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Enhanced Asset</label>
            <div className="flex-1 bg-white rounded-2xl border border-slate-200 flex items-center justify-center overflow-hidden relative shadow-inner">
              {isProcessing ? (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden mb-4">
                    <div className="h-full bg-emerald-500 w-1/2 animate-[shimmer_1.5s_infinite]"></div>
                  </div>
                  <p className="text-xs text-slate-400 animate-pulse font-bold uppercase tracking-widest">Optimizing...</p>
                </div>
              ) : resultImage ? (
                <img src={resultImage} className="max-w-full max-h-full object-contain" alt="Result" />
              ) : (
                <p className="text-slate-300 text-sm font-bold italic">Awaiting Enhancement...</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <input 
                type="text" 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe modifications (e.g. 'Add professional soft lighting')"
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-4 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition-all"
              />
            </div>
            <button
              onClick={handleEdit}
              disabled={!sourceImage || !prompt.trim() || isProcessing}
              className="px-10 py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-100 disabled:text-slate-400 text-white rounded-xl font-bold transition-all shadow-md flex items-center justify-center uppercase tracking-widest text-sm"
            >
              Apply Strategy
            </button>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
};

export default PhotoEditor;
