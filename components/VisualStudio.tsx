
import React, { useState } from 'react';
import { ModelType, UserTier } from '../types';
import { generateImage } from '../services/geminiService';

interface VisualStudioProps {
  userTier: UserTier;
}

const VisualStudio: React.FC<VisualStudioProps> = ({ userTier }) => {
  const [prompt, setPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState<ModelType>(ModelType.NANO_BANANA);
  const [aspectRatio, setAspectRatio] = useState<"1:1" | "16:9" | "9:16">("1:1");
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    if (selectedModel === ModelType.NANO_BANANA_PRO) {
      if (!(await (window as any).aistudio.hasSelectedApiKey())) {
        await (window as any).aistudio.openSelectKey();
      }
    }

    setIsGenerating(true);
    setResultImage(null);
    try {
      const url = await generateImage(prompt, selectedModel, aspectRatio);
      if (url) setResultImage(url);
    } catch (error) {
      console.error("Generation failed:", error);
      alert("Error: Visualization engine failure.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-full bg-white flex flex-col md:flex-row overflow-hidden">
      <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-slate-200 p-6 space-y-8 bg-slate-50/50">
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Model Core</label>
          <div className="grid grid-cols-1 gap-2">
            <button
              onClick={() => setSelectedModel(ModelType.NANO_BANANA)}
              className={`p-3 text-left rounded-lg border transition-all ${
                selectedModel === ModelType.NANO_BANANA 
                ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm' 
                : 'border-slate-200 hover:border-slate-300 bg-white text-slate-500'
              }`}
            >
              <div className="font-bold text-sm">Nano Banana</div>
              <div className="text-[10px] opacity-70 font-semibold">Standard Output</div>
            </button>
            <button
              onClick={() => {
                if (userTier === UserTier.PRO) {
                  setSelectedModel(ModelType.NANO_BANANA_PRO);
                }
              }}
              className={`p-3 text-left rounded-lg border transition-all relative overflow-hidden ${
                selectedModel === ModelType.NANO_BANANA_PRO 
                ? 'border-green-600 bg-green-50 text-green-800 shadow-sm' 
                : 'border-slate-200 hover:border-slate-300 bg-white text-slate-500'
              } ${userTier === UserTier.FREE ? 'opacity-70 grayscale' : ''}`}
            >
              <div className="font-bold text-sm flex items-center justify-between">
                <span>Nano Banana Pro</span>
                {userTier === UserTier.FREE && (
                  <svg className="w-3 h-3 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="text-[10px] opacity-70 font-semibold">Pro High-Res (1K-4K)</div>
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Frame Ratio</label>
          <div className="grid grid-cols-3 gap-2">
            {(["1:1", "16:9", "9:16"] as const).map(ratio => (
              <button
                key={ratio}
                onClick={() => setAspectRatio(ratio)}
                disabled={userTier === UserTier.FREE && ratio !== "1:1"}
                className={`py-2 text-xs font-bold rounded-md border transition-all ${
                  aspectRatio === ratio 
                  ? 'border-slate-800 bg-slate-800 text-white' 
                  : 'border-slate-200 bg-white text-slate-400'
                } disabled:opacity-30`}
              >
                {ratio}
              </button>
            ))}
          </div>
          {userTier === UserTier.FREE && (
            <p className="text-[10px] text-amber-600 mt-2 font-bold uppercase tracking-tight">Upgrade for custom ratios</p>
          )}
        </div>

        <div className="flex-1">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Visual Description</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Define the visualization requirements..."
            className="w-full h-32 bg-white text-slate-800 rounded-xl p-4 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none border border-slate-200 shadow-sm text-sm"
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
          className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-100 disabled:text-slate-400 text-white rounded-xl font-bold uppercase tracking-widest transition-all shadow-md flex items-center justify-center space-x-2"
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Processing...</span>
            </>
          ) : (
            <span>Render Visualization</span>
          )}
        </button>
      </div>

      <div className="flex-1 bg-slate-50 p-6 flex items-center justify-center">
        {resultImage ? (
          <div className="relative group max-w-full max-h-full">
            <img 
              src={resultImage} 
              alt="Output" 
              className={`rounded-2xl shadow-xl border border-white object-contain ${
                aspectRatio === "16:9" ? "aspect-video" : aspectRatio === "9:16" ? "aspect-[9/16]" : "aspect-square"
              }`}
              style={{ maxHeight: '80vh' }}
            />
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div className="w-24 h-24 bg-white rounded-3xl border border-slate-200 flex items-center justify-center mx-auto shadow-sm">
              <svg className="w-10 h-10 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-slate-400 font-medium italic">Visualization terminal ready.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisualStudio;
