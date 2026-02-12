
import React, { useState, useEffect } from 'react';
import { IntelligenceBrief } from '../types';
import { fetchIntelligenceBrief } from '../services/geminiService';

const StrategicDashboard: React.FC = () => {
  const [brief, setBrief] = useState<IntelligenceBrief | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [goals, setGoals] = useState<string[]>(["Digital Transformation 2025", "Global Expansion - APAC", "ESG Compliance Standards"]);

  const generateBrief = async () => {
    setIsLoading(true);
    try {
      const data = await fetchIntelligenceBrief("AI Industry and Global Markets");
      setBrief(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full bg-[#f8fafc] overflow-y-auto p-4 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Executive Command</h1>
            <p className="text-slate-500 font-medium">Strategic Overview • {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          </div>
          <button 
            onClick={generateBrief}
            disabled={isLoading}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-100 transition-all flex items-center space-x-2"
          >
            {isLoading ? (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            )}
            <span>Generate Strategic Brief</span>
          </button>
        </div>

        {/* Intelligence Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Market Intelligence - Grounded */}
          <div className="lg:col-span-2 bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-black text-slate-800 uppercase tracking-widest text-xs">Real-time Intelligence</h3>
              <span className="flex items-center space-x-1 text-emerald-600 text-[10px] font-bold">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                <span>Live Feed</span>
              </span>
            </div>
            <div className="flex-1 p-8 overflow-y-auto">
              {brief ? (
                <div className="space-y-6">
                  <div className="prose prose-slate max-w-none">
                    <p className="text-slate-700 leading-relaxed text-lg font-medium whitespace-pre-wrap">{brief.summary}</p>
                  </div>
                  {brief.sources.length > 0 && (
                    <div className="pt-6 border-t border-slate-100">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-3">Intelligence Sources</p>
                      <div className="flex flex-wrap gap-2">
                        {brief.sources.map((source, i) => (
                          <a 
                            key={i} 
                            href={source.uri} 
                            target="_blank" 
                            className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:border-emerald-500 hover:text-emerald-700 transition-all flex items-center"
                          >
                            <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                            {source.title}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                  <svg className="w-16 h-16 text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-sm italic">Awaiting Briefing Command</p>
                </div>
              )}
            </div>
          </div>

          {/* Strategic Focus & Metrics */}
          <div className="space-y-8 flex flex-col">
            <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden group flex-1">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M13 3l-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2 2-2 2h14v-20h-14z"/></svg>
              </div>
              <h3 className="font-black uppercase tracking-widest text-[10px] text-emerald-400 mb-6">Strategic Focus 2025</h3>
              <div className="space-y-4">
                {goals.map((goal, i) => (
                  <div key={i} className="flex items-center justify-between group/item">
                    <span className="text-sm font-bold text-slate-100">{goal}</span>
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  </div>
                ))}
              </div>
              <div className="mt-10 pt-6 border-t border-white/10">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-4">Network Velocity</p>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[84%] rounded-full animate-pulse"></div>
                </div>
                <p className="text-[10px] text-slate-500 mt-2 text-right">84% Core Integrity</p>
              </div>
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
              <h3 className="font-black text-slate-800 uppercase tracking-widest text-[10px] mb-6">Executive Systems</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <p className="text-[10px] text-emerald-600 font-bold uppercase">Uptime</p>
                  <p className="text-xl font-black text-emerald-900">99.9%</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Tokens</p>
                  <p className="text-xl font-black text-slate-900">14.2M</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Dock */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Draft Memo', 'Analyze Risk', 'Code Audit', 'Visual Audit'].map((act, i) => (
            <button key={i} className="p-6 bg-white border border-slate-200 rounded-2xl text-center hover:border-emerald-500 hover:shadow-lg transition-all">
              <span className="text-xs font-black text-slate-800 uppercase tracking-widest">{act}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StrategicDashboard;
