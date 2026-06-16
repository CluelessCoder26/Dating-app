import React, { useState, useEffect } from 'react';
import { api } from './api';
import Splash from './components/Splash';
import OnboardingFlow from './components/OnboardingFlow';
import DiscoveryCanvas from './components/DiscoveryCanvas';
import MatchesAndChat from './components/MatchesAndChat';
import ProfileAndSettings from './components/ProfileAndSettings';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [myProfile, setMyProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  // Screen flow routing
  const [activeTab, setActiveTab] = useState('discover');
  const [isLoginView, setIsLoginView] = useState(true);
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Register form state
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');

  // Match interaction state passing
  const [selectedMatch, setSelectedMatch] = useState(null); // { matchId, profile }

  // Load user profile context
  const loadProfileContext = async () => {
    if (!token) return;
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

  const handleLogout = () => {
    api.logout();
    localStorage.removeItem('token');
    setToken('');
    setMyProfile(null);
    setActiveTab('discover');
    setSelectedMatch(null);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    if (!loginPhone || !loginPassword) {
      setAuthError('All fields are required.');
      setAuthLoading(false);
      return;
    }

    // Normalize phone: prepend '+' if not present
    const normalizedPhone = loginPhone.trim().startsWith('+') 
      ? loginPhone.trim() 
      : '+' + loginPhone.trim();

    try {
      const data = await api.login(normalizedPhone, loginPassword);
      handleAuthSuccess(data.token);
    } catch (err) {
      setAuthError(err.message || 'Login failed. Try again.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    if (!regPhone || !regPassword || !regConfirm) {
      setAuthError('All fields are required.');
      return;
    }
    if (regPassword !== regConfirm) {
      setAuthError('Passwords do not match.');
      return;
    }
    if (regPassword.length < 6) {
      setAuthError('Password must be at least 6 characters.');
      return;
    }
    setAuthLoading(true);
    const normalizedPhone = regPhone.trim().startsWith('+') ? regPhone.trim() : '+' + regPhone.trim();
    try {
      const data = await api.register(normalizedPhone, regPassword);
      handleAuthSuccess(data.token);
    } catch (err) {
      setAuthError(err.message || 'Registration failed. Try again.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleOnboardingComplete = async () => {
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

  // Render Auth screen if not logged in
  if (!token) {
    return (
      <div className="min-h-screen bg-surface flex flex-col justify-center items-center px-6 font-body-md w-screen relative overflow-hidden select-none">
        {/* Ambient background decoration */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary-container/10 bg-blob blur-[120px]"></div>
          <div className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] rounded-full bg-secondary-container/20 bg-blob blur-[120px]"></div>
        </div>

        <div className="glass-card w-full max-w-md p-8 rounded-[32px] shadow-xl border border-outline-variant/20 relative z-10 text-center">
          
          {/* Brand Logo */}
          <div className="w-16 h-16 bg-gradient-to-tr from-primary to-primary-container rounded-full flex items-center justify-center mx-auto mb-4 shadow-md animate-pulse">
            <span className="material-symbols-outlined text-white text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
          </div>
          <h2 className="text-2xl font-bold text-on-surface mb-1">Welcome to Spark</h2>
          <p className="text-xs text-on-surface-variant mb-6 font-medium">Discover, Match, and Chat in Real-Time</p>

          {/* Error Message */}
          {authError && (
            <div className="mb-4 p-3 rounded-lg bg-red-100 border border-red-200 text-red-700 text-xs text-left">
              {authError}
            </div>
          )}

          {isLoginView ? (
            /* Login view */
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-[10px] font-bold text-muted uppercase mb-1">Phone Number</label>
                <input 
                  type="tel"
                  placeholder="e.g. +15550101"
                  value={loginPhone}
                  onChange={(e) => setLoginPhone(e.target.value)}
                  className="w-full bg-white/40 border-b border-outline-variant focus:border-primary focus:ring-0 text-sm py-2 px-3 outline-none rounded-t-lg transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-muted uppercase mb-1">Password</label>
                <input 
                  type="password"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full bg-white/40 border-b border-outline-variant focus:border-primary focus:ring-0 text-sm py-2 px-3 outline-none rounded-t-lg transition-all"
                  required
                />
              </div>
              <button 
                type="submit" 
                disabled={authLoading}
                className="w-full bg-gradient-to-r from-primary to-primary-container text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider glow-button mt-6 flex items-center justify-center gap-2"
              >
                {authLoading ? <span className="material-symbols-outlined animate-spin text-base">progress_activity</span> : 'Enter Spark'}
              </button>
              <div className="text-center mt-4">
                <span className="text-[11px] text-on-surface-variant font-medium">
                  Don't have an account?{' '}
                  <span onClick={() => { setIsLoginView(false); setAuthError(''); }} className="text-primary font-bold cursor-pointer hover:underline">
                    Register
                  </span>
                </span>
              </div>
            </form>
          ) : (
            /* Register form */
            <form onSubmit={handleRegisterSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-[10px] font-bold text-muted uppercase mb-1">Phone Number</label>
                <input
                  type="tel"
                  placeholder="e.g. +905525923"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  className="w-full bg-white/40 border-b border-outline-variant focus:border-primary focus:ring-0 text-sm py-2 px-3 outline-none rounded-t-lg transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-muted uppercase mb-1">Password</label>
                <input
                  type="password"
                  placeholder="Min. 6 characters"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full bg-white/40 border-b border-outline-variant focus:border-primary focus:ring-0 text-sm py-2 px-3 outline-none rounded-t-lg transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-muted uppercase mb-1">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Repeat password"
                  value={regConfirm}
                  onChange={(e) => setRegConfirm(e.target.value)}
                  className="w-full bg-white/40 border-b border-outline-variant focus:border-primary focus:ring-0 text-sm py-2 px-3 outline-none rounded-t-lg transition-all"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={authLoading}
                className="w-full bg-gradient-to-r from-primary to-primary-container text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider glow-button mt-6 flex items-center justify-center gap-2"
              >
                {authLoading ? <span className="material-symbols-outlined animate-spin text-base">progress_activity</span> : 'Create Account'}
              </button>
              <div className="text-center mt-4">
                <span className="text-[11px] text-on-surface-variant font-medium">
                  Already have an account?{' '}
                  <span onClick={() => { setIsLoginView(true); setAuthError(''); }} className="text-primary font-bold cursor-pointer hover:underline">
                    Login
                  </span>
                </span>
              </div>
            </form>
          )}

          {/* Demo Details info */}
          <div className="mt-6 border-t border-outline-variant/30 pt-4 text-[10px] text-on-surface-variant/70 text-left space-y-0.5">
            <div><strong>Demo Phone:</strong> +15550101 &nbsp;(or +15550102 … +15550112)</div>
            <div><strong>Demo Password:</strong> password123</div>
          </div>
        </div>
      </div>
    );
  }

  // Render Onboarding flow if session profile details are incomplete
  if (token === 'pending_onboarding' || (!loadingProfile && !myProfile)) {
    return (
      <OnboardingFlow 
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
        
        {activeTab === 'profile' && myProfile && (
          <ProfileAndSettings 
            myProfile={myProfile} 
            onLogout={handleLogout}
            onProfileUpdated={(updated) => setMyProfile(updated)}
          />
        )}
      </main>

      {/* Bottom Navigation tab-bar */}
      <nav className="fixed bottom-0 w-full z-50 bg-white/85 backdrop-blur-xl border-t border-outline-variant/20 shadow-lg flex justify-around items-center h-20 px-4 pb-safe select-none">
        
        <button 
          onClick={() => { setActiveTab('discover'); setSelectedMatch(null); }}
          className={`flex flex-col items-center justify-center p-3 transition-colors active:scale-90 ${
            activeTab === 'discover' ? 'text-primary scale-105' : 'text-on-surface-variant hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: activeTab === 'discover' ? "'FILL' 1" : "'FILL' 0" }}>explore</span>
        </button>

        <button 
          onClick={() => setActiveTab('matches')}
          className={`flex flex-col items-center justify-center p-3 transition-colors active:scale-90 relative ${
            activeTab === 'matches' ? 'text-primary scale-105' : 'text-on-surface-variant hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: activeTab === 'matches' ? "'FILL' 1" : "'FILL' 0" }}>forum</span>
        </button>

        <button 
          onClick={() => { setActiveTab('profile'); setSelectedMatch(null); }}
          className={`flex flex-col items-center justify-center p-3 transition-colors active:scale-90 ${
            activeTab === 'profile' ? 'text-primary scale-105' : 'text-on-surface-variant hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: activeTab === 'profile' ? "'FILL' 1" : "'FILL' 0" }}>person</span>
        </button>
      </nav>

    </div>
  );
}
