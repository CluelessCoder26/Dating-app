import React, { useState, useEffect } from 'react';
import { api } from './api';
import AuthScreen from './components/AuthScreen';
import ProfileSetup from './components/ProfileSetup';
import DiscoverScreen from './components/DiscoverScreen';
import MatchesScreen from './components/MatchesScreen';
import ChatScreen from './components/ChatScreen';
import { Flame, Sparkles, MessageSquare, Heart, Compass, User, LogOut } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [myProfile, setMyProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  
  // Navigation
  const [currentScreen, setCurrentScreen] = useState('discover'); // 'discover', 'matches', 'profile', 'chat'
  const [chatMatchId, setChatMatchId] = useState(null);
  const [chatOtherProfile, setChatOtherProfile] = useState(null);

  // Load user profile if authenticated
  const loadProfile = async () => {
    if (!token) {
      setProfileLoading(false);
      return;
    }

    setProfileLoading(true);
    try {
      const data = await api.getMe();
      setMyProfile(data.profile); // can be null if not set up yet
    } catch (err) {
      console.warn('Failed to load profile:', err.message);
      // If unauthorized, token is cleared by api helper
      setToken('');
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [token]);

  // Handle Socket events on top-level (like match notification toasts)
  useEffect(() => {
    if (token && myProfile) {
      const socket = api.getSocket();
      if (socket) {
        socket.on('match_created', (data) => {
          // Trigger confetti for match notification if another user likes back while we are online
          confetti({
            particleCount: 100,
            spread: 60,
            origin: { y: 0.8 }
          });
          alert(`🎉 It's a Match! You matched with someone new!`);
        });

        return () => {
          socket.off('match_created');
        };
      }
    }
  }, [token, myProfile]);

  const handleAuthSuccess = (newToken) => {
    setToken(newToken);
  };

  const handleProfileSaved = (newProfile) => {
    setMyProfile(newProfile);
    setCurrentScreen('discover');
  };

  const handleLogout = () => {
    api.logout();
    setToken('');
    setMyProfile(null);
  };

  const handleOpenChat = (matchId, otherProfile) => {
    setChatMatchId(matchId);
    setChatOtherProfile(otherProfile);
    setCurrentScreen('chat');
  };

  // Render Loader
  if (token && profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-color-pink" size={36} />
      </div>
    );
  }

  // Render Auth screen if not authenticated
  if (!token) {
    return (
      <div className="app-container">
        <header className="navbar">
          <div className="navbar-brand">
            <div className="navbar-brand-logo">
              <Flame size={20} className="text-white fill-current" />
            </div>
            <h1 className="navbar-title">Ignite</h1>
          </div>
        </header>
        <main className="main-content">
          <AuthScreen onAuthSuccess={handleAuthSuccess} />
        </main>
      </div>
    );
  }

  // Render Profile Setup if profile doesn't exist
  if (!myProfile) {
    return (
      <div className="app-container">
        <main className="main-content">
          <ProfileSetup
            userProfile={null}
            onProfileSaved={handleProfileSaved}
            onLogout={handleLogout}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <header className="navbar">
        <div className="navbar-brand">
          <div className="navbar-brand-logo">
            <Flame size={20} className="text-white fill-current animate-pulse" />
          </div>
          <div className="navbar-title-container">
            <h1 className="navbar-title">
              Ignite
              <span className="text-xs font-mono font-normal bg-purple-900/40 text-color-purple px-2 py-0.5 rounded-full border border-purple-500/30">
                Real-Time
              </span>
            </h1>
          </div>
        </div>

        <div className="navbar-actions">
          <button onClick={handleLogout} className="btn-secondary text-xs flex items-center gap-1">
            <LogOut size={12} /> Logout
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="main-content flex-1 flex flex-col justify-center">
        {currentScreen === 'discover' && (
          <DiscoverScreen userProfile={myProfile} onOpenChat={handleOpenChat} />
        )}
        
        {currentScreen === 'matches' && (
          <MatchesScreen onOpenChat={handleOpenChat} />
        )}
        
        {currentScreen === 'profile' && (
          <ProfileSetup
            userProfile={myProfile}
            onProfileSaved={handleProfileSaved}
            onLogout={handleLogout}
          />
        )}

        {currentScreen === 'chat' && (
          <ChatScreen
            matchId={chatMatchId}
            otherProfile={chatOtherProfile}
            myUserId={myProfile.userId}
            onBack={() => setCurrentScreen('matches')}
          />
        )}
      </main>

      {/* Bottom Mobile Nav Bar */}
      {currentScreen !== 'chat' && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#0c0a14] border-t border-white/5 py-3 px-6 flex justify-around items-center z-40 backdrop-blur-md">
          <button
            onClick={() => setCurrentScreen('discover')}
            className={`flex flex-col items-center gap-1 transition-colors ${
              currentScreen === 'discover' ? 'text-color-pink' : 'text-muted hover:text-white'
            }`}
          >
            <Compass size={18} />
            <span className="text-[10px] font-semibold">Discover</span>
          </button>
          
          <button
            onClick={() => setCurrentScreen('matches')}
            className={`flex flex-col items-center gap-1 transition-colors ${
              currentScreen === 'matches' ? 'text-color-pink' : 'text-muted hover:text-white'
            }`}
          >
            <Heart size={18} />
            <span className="text-[10px] font-semibold">Matches</span>
          </button>
          
          <button
            onClick={() => setCurrentScreen('profile')}
            className={`flex flex-col items-center gap-1 transition-colors ${
              currentScreen === 'profile' ? 'text-color-pink' : 'text-muted hover:text-white'
            }`}
          >
            <User size={18} />
            <span className="text-[10px] font-semibold">Profile</span>
          </button>
        </div>
      )}
    </div>
  );
}

function Loader2({ size = 24, className = '' }) {
  return (
    <svg
      className={`animate-spin ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      width={size}
      height={size}
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
