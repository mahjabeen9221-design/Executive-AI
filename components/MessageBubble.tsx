
import React from 'react';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  const renderContent = () => {
    if (message.type === 'image' && message.imageUrl) {
      return (
        <div className="space-y-2">
          <p className="whitespace-pre-wrap">{message.content}</p>
          <img 
            src={message.imageUrl} 
            alt="AI Generated" 
            className="rounded-lg max-w-full border border-slate-200 shadow-sm"
          />
        </div>
      );
    }

    if (message.content.includes('```')) {
      const parts = message.content.split('```');
      return (
        <div className="space-y-4">
          {parts.map((part, i) => {
            if (i % 2 === 1) {
              const [lang, ...codeLines] = part.split('\n');
              const code = codeLines.join('\n');
              return (
                <div key={i} className="relative group">
                  <div className="absolute top-0 right-0 p-2 text-[10px] text-slate-400 uppercase font-mono">{lang || 'python'}</div>
                  <pre className="bg-slate-900 p-4 rounded-lg overflow-x-auto border border-slate-800 font-mono text-sm leading-relaxed text-emerald-300">
                    <code>{code}</code>
                  </pre>
                </div>
              );
            }
            return <p key={i} className="whitespace-pre-wrap leading-relaxed">{part}</p>;
          })}
        </div>
      );
    }

    return <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>;
  };

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[85%] md:max-w-[70%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${
          isUser ? 'bg-emerald-600 ml-3' : 'bg-white border border-slate-200 mr-3'
        }`}>
          {isUser ? (
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          )}
        </div>
        <div className={`px-4 py-3 rounded-2xl shadow-sm ${
          isUser 
            ? 'bg-emerald-600 text-white rounded-tr-none' 
            : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
        }`}>
          <div className={`text-[10px] mb-1 font-bold uppercase tracking-wider ${isUser ? 'text-emerald-100' : 'text-slate-400'}`}>
            {isUser ? 'EXECUTIVE' : 'GEMINI CORE'} • {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
