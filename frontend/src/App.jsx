/* eslint-disable react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, no-unused-vars */
import { useState, useEffect } from 'react';
import { api } from './api';
import Splash from './components/Splash';
import OnboardingFlow from './components/OnboardingFlow';
import DiscoveryCanvas from './components/DiscoveryCanvas';
import MatchesAndChat from './components/MatchesAndChat';
import ProfileAndSettings from './components/ProfileAndSettings';
import HeartTab from './components/HeartTab';
import { ToastProvider } from './components/Toast';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [myProfile, setMyProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  // Screen flow routing
  const [activeTab, setActiveTab] = useState('discover');

  // Match interaction state passing
  const [selectedMatch, setSelectedMatch] = useState(null); // { matchId, profile }

  // Load user profile context
  const loadProfileContext = async () => {
    const currentToken = localStorage.getItem('token');
    if (!currentToken) return;
    setLoadingProfile(true);
    try {
      const data = await api.getMe();
      setMyProfile(data.profile); // can be null if onboarding incomplete
    } catch (err) {
      console.warn('Failed to load session profile context:', err.message);
      // clear session if token invalid
      handleLogout();
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadProfileContext();
    }
  }, [token]);

  const handleAuthSuccess = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  function handleLogout() {
    api.logout();
    localStorage.removeItem('token');
    setToken('');
    setMyProfile(null);
    setActiveTab('discover');
    setSelectedMatch(null);
  }

  const handleOnboardingComplete = async () => {
    // Check if token was set during onboarding (login/register)
    const newToken = localStorage.getItem('token');
    if (newToken && newToken !== token) {
      setToken(newToken);
    }
    // Reload profile context from backend to sync
    await loadProfileContext();
    setActiveTab('discover');
  };

  const handleOpenChat = (matchId, profile) => {
    setSelectedMatch({ matchId, profile });
    setActiveTab('matches');
  };

  // Render Splash Screen
  if (showSplash) {
    return <Splash onFinish={() => setShowSplash(false)} />;
  }

  // Render Auth screen or Onboarding flow if session profile details are incomplete
  if (!token || token === 'pending_onboarding' || (!loadingProfile && !myProfile)) {
    const isTokenValid = token && token !== 'pending_onboarding';
    return (
      <OnboardingFlow 
        initialStep={isTokenValid ? 4 : 0}
        onComplete={handleOnboardingComplete} 
        onExit={handleLogout} 
      />
    );
  }

  // Loading indicator for fetching profile on initial launch
  if (loadingProfile) {
    return (
      <div className="min-h-screen bg-surface flex flex-col justify-center items-center space-y-3">
        <span className="material-symbols-outlined text-primary text-4xl animate-spin">progress_activity</span>
        <p className="text-xs font-semibold text-secondary">Securing connection context...</p>
      </div>
    );
  }

  // Main Dashboard Shell (Discover / Matches / Profile)
  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col w-screen overflow-hidden">
      
      {/* Top App bar */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-outline-variant/10 px-6 h-16 flex justify-between items-center select-none shadow-sm">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>map_pin_heart</span>
          <span className="font-display-lg text-headline-lg bg-gradient-to-r from-primary to-tertiary bg-clip-text text-transparent !text-[20px]">Spark</span>
        </div>
        
        {/* User avatar on header */}
        <div className="flex items-center gap-3">
          {myProfile && (
            <div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant/30 shadow-sm">
              <img 
                src={myProfile.photos?.[0]?.url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800"} 
                alt="Profile" 
                className="w-full h-full object-cover" 
              />
            </div>
          )}
        </div>
      </header>

      {/* Main Tabs Container */}
      <main className="flex-grow flex flex-col overflow-hidden h-[calc(100vh-4rem-5rem)]">
        {activeTab === 'discover' && myProfile && (
          <DiscoveryCanvas 
            myProfile={myProfile} 
            onOpenChat={handleOpenChat}
            onOpenProfile={() => setActiveTab('profile')}
          />
        )}
        
        {activeTab === 'matches' && myProfile && (
          <MatchesAndChat 
            myProfile={myProfile} 
            activeMatchInfo={selectedMatch}
            onClearActiveMatch={() => setSelectedMatch(null)}
          />
        )}
        
        {activeTab === 'favorite' && myProfile && (
          <HeartTab 
            myProfile={myProfile} 
            onOpenChat={handleOpenChat}
          />
        )}
        
        {activeTab === 'profile' && myProfile && (
          <ProfileAndSettings 
            myProfile={myProfile} 
            onLogout={handleLogout}
            onProfileUpdated={(updated) => setMyProfile(updated)}
          />
        )}
      </main>

      {/* Bottom Navigation tab-bar */}
      <nav className="fixed bottom-0 w-full z-50 bg-surface/80 dark:bg-surface-dim/80 backdrop-blur-xl border-t border-outline-variant/20 shadow-[0_-4px_30px_rgba(0,92,188,0.08)] rounded-t-xl flex justify-around items-center h-20 px-4 pb-safe">
        
        {/* Discover Tab (explore) */}
        <button 
          onClick={() => { setActiveTab('discover'); setSelectedMatch(null); }}
          className={`flex flex-col items-center justify-center p-3 active:scale-90 transition-transform ${
            activeTab === 'discover' 
              ? 'bg-primary-container text-on-primary-container rounded-full' 
              : 'text-on-surface-variant hover:bg-surface-container-high transition-colors'
          }`}
        >
          <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: activeTab === 'discover' ? "'FILL' 1" : "'FILL' 0" }}>explore</span>
        </button>

        {/* Favorite icon (Platinum Hub) */}
        <button 
          onClick={() => { setActiveTab('favorite'); setSelectedMatch(null); }}
          className={`flex flex-col items-center justify-center p-3 active:scale-90 transition-transform ${
            activeTab === 'favorite' 
              ? 'bg-primary-container text-on-primary-container rounded-full' 
              : 'text-on-surface-variant hover:bg-surface-container-high transition-colors'
          }`}
        >
          <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: activeTab === 'favorite' ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
        </button>

        {/* Matches Tab (forum) */}
        <button 
          onClick={() => setActiveTab('matches')}
          className={`flex flex-col items-center justify-center p-3 active:scale-90 transition-transform ${
            activeTab === 'matches' 
              ? 'bg-primary-container text-on-primary-container rounded-full' 
              : 'text-on-surface-variant hover:bg-surface-container-high transition-colors'
          }`}
        >
          <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: activeTab === 'matches' ? "'FILL' 1" : "'FILL' 0" }}>forum</span>
        </button>

        {/* Profile Tab (person) */}
        <button 
          onClick={() => { setActiveTab('profile'); setSelectedMatch(null); }}
          className={`flex flex-col items-center justify-center p-3 active:scale-90 transition-transform ${
            activeTab === 'profile' 
              ? 'bg-primary-container text-on-primary-container rounded-full' 
              : 'text-on-surface-variant hover:bg-surface-container-high transition-colors'
          }`}
        >
          <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: activeTab === 'profile' ? "'FILL' 1" : "'FILL' 0" }}>person</span>
        </button>
      </nav>

    </div>
  );
}

export default function AppWithProvider() {
  return (
    <ToastProvider>
      <App />
    </ToastProvider>
  );
}
