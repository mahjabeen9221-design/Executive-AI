
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import VisualStudio from './components/VisualStudio';
import PhotoEditor from './components/PhotoEditor';
import PricingView from './components/PricingView';
import AuthView from './components/AuthView';
import VoiceAssistant from './components/VoiceAssistant';
import VideoStudio from './components/VideoStudio';
import StrategicDashboard from './components/StrategicDashboard';
import { AppView, UserTier } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [userTier, setUserTier] = useState<UserTier>(UserTier.FREE);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const handleTierSelect = (tier: UserTier) => {
    setUserTier(tier);
    setCurrentView(AppView.DASHBOARD);
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setCurrentView(AppView.DASHBOARD);
  };

  const renderView = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return <StrategicDashboard />;
      case AppView.CHAT:
        return <ChatWindow />;
      case AppView.VOICE_ASSISTANT:
        return <VoiceAssistant />;
      case AppView.VIDEO_GEN:
        if (userTier === UserTier.FREE) {
          return <PricingView onSelectTier={handleTierSelect} currentTier={userTier} />;
        }
        return <VideoStudio />;
      case AppView.IMAGE_GEN:
        return <VisualStudio userTier={userTier} />;
      case AppView.IMAGE_EDIT:
        if (userTier === UserTier.FREE) {
          return <PricingView onSelectTier={handleTierSelect} currentTier={userTier} />;
        }
        return <PhotoEditor />;
      case AppView.PRICING:
        return <PricingView onSelectTier={handleTierSelect} currentTier={userTier} />;
      case AppView.AUTH:
        return <AuthView onSuccess={handleAuthSuccess} />;
      default:
        return <StrategicDashboard />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden bg-white text-slate-900 selection:bg-emerald-500/20">
      <Sidebar 
        currentView={currentView} 
        onViewChange={(view) => setCurrentView(view)} 
        userTier={userTier}
        isAuthenticated={isAuthenticated}
      />
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {renderView()}
      </main>
    </div>
  );
};

export default App;
