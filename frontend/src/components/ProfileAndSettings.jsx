import React, { useState, useEffect } from 'react';
import { api } from '../api';

const INTERESTS_LIST = [
  'Art & Design', 'Travel', 'Music', 'Gastronomy', 'Wellness',
  'Literature', 'Photography', 'Wine tasting', 'Nature', 'Cinema',
  'Spirituality', 'Finance', 'Tennis', 'Sailing', 'Architecture'
];

export default function ProfileAndSettings({ myProfile, onLogout, onProfileUpdated }) {
  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'edit', 'settings', 'stats', 'safety', 'premium'
  const [profile, setProfile] = useState(myProfile);
  const [blockedUsers, setBlockedUsers] = useState([]);
  
  // Edit Profile States
  const [name, setName] = useState(profile?.name || '');
  const [age, setAge] = useState(profile?.age || 18);
  const [bioText, setBioText] = useState('');
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [photos, setPhotos] = useState([]);

  // Premium Status State
  const [isPremium, setIsPremium] = useState(false);

  // Settings State
  const [distanceLimit, setDistanceLimit] = useState(25);
  const [incognitoMode, setIncognitoMode] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(true);

  // Load blocked list when settings tab opens
  useEffect(() => {
    if (activeTab === 'settings') {
      api.getBlocked().then(res => setBlockedUsers(res || [])).catch(console.warn);
    }
  }, [activeTab]);

  // Sync initial values
  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setAge(profile.age);
      setPhotos(profile.photos || []);

      // Extract interests and bio text from database bio field
      if (profile.bio) {
        if (profile.bio.includes('\n\nInterests: ')) {
          const parts = profile.bio.split('\n\nInterests: ');
          setBioText(parts[0]);
          setSelectedInterests(parts[1].split(', '));
        } else {
          setBioText(profile.bio);
          setSelectedInterests([]);
        }
      }
    }
  }, [profile]);

  const handleUnblock = async (blockedId) => {
    try {
      await api.unblockUser(blockedId);
      setBlockedUsers(prev => prev.filter(u => u.blockedId !== blockedId));
    } catch (err) {
      alert('Failed to unblock user: ' + err.message);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const res = await api.uploadPhoto(reader.result, photos.length === 0);
          setPhotos(prev => [...prev, res.photo]);
        } catch (err) {
          alert('Photo upload failed: ' + err.message);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeletePhoto = async (photoId) => {
    try {
      await api.deletePhoto(photoId);
      setPhotos(prev => prev.filter(p => p.id !== photoId));
    } catch (err) {
      alert('Photo delete failed: ' + err.message);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const formattedBio = `${bioText}\n\nInterests: ${selectedInterests.join(', ')}`;
      const res = await api.saveProfile({
        name,
        age: parseInt(age),
        gender: profile.gender || 'female',
        preference: profile.preference || 'everyone',
        bio: formattedBio,
        latitude: profile.latitude,
        longitude: profile.longitude
      });
      setProfile(res.profile);
      onProfileUpdated(res.profile);
      setActiveTab('profile');
    } catch (err) {
      alert('Failed to save profile: ' + err.message);
    }
  };

  const toggleInterest = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(prev => prev.filter(i => i !== interest));
    } else {
      setSelectedInterests(prev => [...prev, interest]);
    }
  };

  const handlePurchasePremium = (tier) => {
    setIsPremium(true);
    alert(`🎉 Congratulations! You have successfully upgraded to Spark ${tier}! Unlimited swipes, match boosts, and stats are now unlocked.`);
    setActiveTab('profile');
  };

  return (
    <div className="flex-grow pt-16 pb-24 w-full h-full max-w-4xl mx-auto px-6 overflow-y-auto bg-background selection:bg-primary/20">
      
      {/* Upper Tab Navigation */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar py-3 border-b border-outline-variant/20 mb-6 shrink-0">
        {[
          { id: 'profile', label: 'My Profile', icon: 'person' },
          { id: 'edit', label: 'Edit Info', icon: 'edit' },
          { id: 'settings', label: 'Settings', icon: 'settings' },
          { id: 'stats', label: 'Insights', icon: 'monitoring' },
          { id: 'safety', label: 'Safety Center', icon: 'shield' },
          { id: 'premium', label: 'Platinum Hub', icon: 'workspace_premium' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all active:scale-95 ${
              activeTab === tab.id 
                ? 'bg-primary text-white shadow-sm' 
                : 'bg-white/40 text-on-surface-variant hover:bg-white/70 border border-outline-variant/10'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ================= MY PROFILE TAB ================= */}
      {activeTab === 'profile' && profile && (
        <div className="animate-in fade-in duration-300 space-y-6">
          {/* Card Hero */}
          <div className="relative w-full h-80 rounded-[24px] overflow-hidden shadow-lg border border-outline-variant/10">
            <img 
              src={photos[0]?.url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800"} 
              alt={profile.name} 
              className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent"></div>
            
            <div className="absolute bottom-4 left-6 flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl md:text-2xl font-bold text-on-surface">{profile.name}, {profile.age}</h2>
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
              </div>
              
              <div className="flex items-center gap-2">
                {isPremium ? (
                  <div className="gold-member-badge px-2.5 py-0.5 rounded-full border border-primary/20 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
                    <span className="text-[9px] font-bold text-primary uppercase">Spark Gold</span>
                  </div>
                ) : (
                  <div className="bg-white/40 border border-outline-variant/30 px-2.5 py-0.5 rounded-full">
                    <span className="text-[9px] font-bold text-secondary uppercase">Standard Member</span>
                  </div>
                )}
                <span className="text-xs text-on-surface-variant font-medium">SF, California</span>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="pearl-card p-6 rounded-2xl bg-white/40 backdrop-blur-sm border border-outline-variant/10 shadow-sm space-y-2">
            <h3 className="text-sm font-bold text-primary uppercase tracking-wide">About Me</h3>
            <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
              {bioText || 'Add something interesting about yourself under the Edit Info tab!'}
            </p>
          </div>

          {/* Interests Chips */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-primary uppercase tracking-wide">My Interests</h3>
            {selectedInterests.length === 0 ? (
              <p className="text-xs text-on-surface-variant italic">No interests selected yet.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {selectedInterests.map((interest, idx) => (
                  <span key={idx} className="px-3.5 py-1.5 bg-surface-container-low rounded-full border border-outline-variant/10 text-tertiary font-semibold text-xs flex items-center gap-1 hover:bg-surface-container-high transition-colors">
                    {interest}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Photos Grid */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-primary uppercase tracking-wide">My Moments ({photos.length})</h3>
            <div className="grid grid-cols-3 gap-3">
              {photos.map((p, idx) => (
                <div key={idx} className="aspect-square rounded-xl overflow-hidden pearl-card border border-outline-variant/10 shadow-sm relative group">
                  <img src={p.url} alt="Moment" className="w-full h-full object-cover" />
                  <div className="absolute top-1 right-1 bg-primary/20 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold">
                    {idx + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= EDIT INFO TAB ================= */}
      {activeTab === 'edit' && (
        <div className="animate-in fade-in duration-300">
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="glass-card rounded-[24px] p-6 md:p-8 shadow-sm space-y-6">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-muted mb-2">Display Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white/40 border-b-2 border-outline-variant focus:border-primary focus:ring-0 text-sm py-2 px-3 outline-none rounded-t-lg transition-all"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-[10px] font-bold uppercase text-muted mb-2">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full bg-white/40 border-b-2 border-outline-variant focus:border-primary focus:ring-0 text-sm py-2 px-3 outline-none rounded-t-lg transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-muted mb-2">About Me (Bio)</label>
                <textarea
                  value={bioText}
                  onChange={(e) => setBioText(e.target.value)}
                  className="w-full bg-white/40 border-b-2 border-outline-variant focus:border-primary focus:ring-0 text-sm py-2 px-3 outline-none rounded-t-lg transition-all h-24 resize-none"
                  required
                />
              </div>

              {/* Photo upload and management */}
              <div className="space-y-3">
                <label className="block text-[10px] font-bold uppercase text-muted">Upload & Manage Photos</label>
                
                <div className="grid grid-cols-4 gap-3">
                  {photos.map((p) => (
                    <div key={p.id} className="aspect-square rounded-lg border border-outline-variant/30 overflow-hidden relative group shadow-sm bg-white/20">
                      <img src={p.url} alt="Profile" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleDeletePhoto(p.id)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[11px] hover:bg-red-600 shadow-md transition-colors"
                      >
                        ×
                      </button>
                      {p.isPrimary && (
                        <div className="absolute bottom-1 left-1 bg-primary text-white text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">
                          Primary
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {/* File upload trigger */}
                  <div className="aspect-square border border-dashed border-outline-variant/60 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 relative bg-white/40">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handlePhotoUpload} 
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <span className="material-symbols-outlined text-primary text-xl mb-1">add_a_photo</span>
                    <span className="text-[9px] font-bold text-secondary uppercase">Add Photo</span>
                  </div>
                </div>
              </div>

              {/* Interest Toggles */}
              <div className="space-y-3">
                <label className="block text-[10px] font-bold uppercase text-muted">Toggle Interests</label>
                <div className="flex flex-wrap gap-2">
                  {INTERESTS_LIST.map((interest) => {
                    const isSelected = selectedInterests.includes(interest);
                    return (
                      <button
                        type="button"
                        key={interest}
                        onClick={() => toggleInterest(interest)}
                        className={`px-3 py-1.5 rounded-full border text-[10px] font-bold shadow-sm transition-all ${
                          isSelected 
                            ? 'bg-primary text-white border-transparent' 
                            : 'bg-white/40 border-outline-variant/30 text-on-surface hover:border-primary/40'
                        }`}
                      >
                        {interest}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-primary to-primary-container text-white font-bold rounded-xl shadow-md glow-button"
            >
              Save Profile Changes
            </button>
          </form>
        </div>
      )}

      {/* ================= SETTINGS TAB ================= */}
      {activeTab === 'settings' && (
        <div className="animate-in fade-in duration-300 space-y-6">
          
          <div className="glass-card rounded-[24px] p-6 shadow-sm space-y-6">
            <h3 className="text-sm font-bold text-primary uppercase tracking-wide">Account Settings</h3>
            
            <div className="space-y-4">
              {/* Distance limit slide */}
              <div className="flex justify-between items-center py-2 border-b border-outline-variant/10">
                <div>
                  <h4 className="text-xs font-bold text-on-surface">Maximum Distance Range</h4>
                  <p className="text-[10px] text-on-surface-variant mt-0.5">Filter candidates based on proximity.</p>
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    type="range" 
                    min="10" 
                    max="100" 
                    value={distanceLimit}
                    onChange={(e) => setDistanceLimit(parseInt(e.target.value))}
                    className="accent-primary"
                  />
                  <span className="text-xs font-bold text-primary min-w-[50px] text-right">{distanceLimit} miles</span>
                </div>
              </div>

              {/* Incognito mode toggle */}
              <div className="flex justify-between items-center py-2 border-b border-outline-variant/10">
                <div>
                  <h4 className="text-xs font-bold text-on-surface">Incognito Visibility Mode</h4>
                  <p className="text-[10px] text-on-surface-variant mt-0.5">Hide your profile from discovery feeds unless you swipe right.</p>
                </div>
                <button 
                  onClick={() => setIncognitoMode(!incognitoMode)}
                  className={`w-11 h-6 rounded-full p-1 transition-colors ${incognitoMode ? 'bg-primary' : 'bg-outline-variant/50'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${incognitoMode ? 'translate-x-5' : 'translate-x-0'}`}></div>
                </button>
              </div>

              {/* Push notifications toggle */}
              <div className="flex justify-between items-center py-2 border-b border-outline-variant/10">
                <div>
                  <h4 className="text-xs font-bold text-on-surface">Push Notification Alerts</h4>
                  <p className="text-[10px] text-on-surface-variant mt-0.5">Alert immediately on matches, messages, and ELO boosts.</p>
                </div>
                <button 
                  onClick={() => setPushEnabled(!pushEnabled)}
                  className={`w-11 h-6 rounded-full p-1 transition-colors ${pushEnabled ? 'bg-primary' : 'bg-outline-variant/50'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${pushEnabled ? 'translate-x-5' : 'translate-x-0'}`}></div>
                </button>
              </div>
            </div>
          </div>

          {/* Blocked Users settings mapping */}
          <div className="glass-card rounded-[24px] p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-primary uppercase tracking-wide">Blocked Relationships ({blockedUsers.length})</h3>
            
            {blockedUsers.length === 0 ? (
              <p className="text-xs text-on-surface-variant italic">No users blocked currently.</p>
            ) : (
              <div className="space-y-3">
                {blockedUsers.map((user) => (
                  <div key={user.id} className="flex justify-between items-center p-3 bg-white/40 border border-outline-variant/20 rounded-xl">
                    <span className="text-xs font-bold text-on-surface">{user.blockedPhone || 'Spark Member'}</span>
                    <button 
                      onClick={() => handleUnblock(user.blockedId)}
                      className="text-[10px] font-bold text-primary border border-primary/20 hover:bg-primary/5 px-3 py-1 rounded-full transition-colors"
                    >
                      UNBLOCK
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={onLogout}
            className="w-full py-4 bg-red-100 hover:bg-red-200 text-red-600 font-bold rounded-xl transition-colors text-xs tracking-wider uppercase flex items-center justify-center gap-2 border border-red-200 shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">logout</span> Log Out Account
          </button>
        </div>
      )}

      {/* ================= PERFORMANCE INSIGHTS (STATS) TAB ================= */}
      {activeTab === 'stats' && (
        <div className="animate-in fade-in duration-300 space-y-6">
          <section className="text-center md:text-left mb-4">
            <h2 className="text-lg font-bold text-primary">Performance Insights</h2>
            <p className="text-xs text-on-surface-variant">Track your visibility, active chats, and weekly match ratios.</p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Matches Per Week chart */}
            <div className="md:col-span-2 glass-card rounded-[20px] p-5 flex flex-col justify-between border border-outline-variant/10 shadow-sm">
              <div className="flex justify-between mb-4">
                <div>
                  <h4 className="text-xs font-bold text-on-surface">Weekly Matches</h4>
                  <p className="text-[10px] text-green-500 font-semibold">+12% increase this week</p>
                </div>
                <span className="text-[10px] font-bold bg-primary/10 text-primary px-2.5 py-0.5 rounded-full uppercase">Last 7 Days</span>
              </div>
              
              {/* Bars chart */}
              <div className="h-32 flex items-end gap-3 px-2">
                {[
                  { d: 'MON', h: 'h-10' },
                  { d: 'TUE', h: 'h-16' },
                  { d: 'WED', h: 'h-14' },
                  { d: 'THU', h: 'h-24' },
                  { d: 'FRI', h: 'h-20' },
                  { d: 'SAT', h: 'h-28' },
                  { d: 'SUN', h: 'h-22' }
                ].map((bar, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1.5">
                    <div className={`${bar.h} w-full bg-primary/20 hover:bg-primary rounded-t-md transition-all duration-300 cursor-pointer`} title={bar.d}></div>
                    <span className="text-[8px] font-bold text-on-surface-variant">{bar.d}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Profile Views indicator */}
            <div className="glass-card rounded-[20px] p-5 flex flex-col justify-center items-center text-center border border-outline-variant/10 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2 text-primary">
                <span className="material-symbols-outlined text-[24px]">visibility</span>
              </div>
              <div className="text-2xl font-bold text-primary">1,284</div>
              <h4 className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mt-1">Profile Views</h4>
              <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden mt-4">
                <div className="h-full bg-gradient-to-r from-primary to-primary-container w-[68%] rounded-full"></div>
              </div>
              <p className="text-[9px] text-on-surface-variant mt-2 font-medium">Top 5% of active users</p>
            </div>

            {/* Stats list */}
            {[
              { label: 'Active Chats', val: '42', icon: 'forum' },
              { label: 'Match Strength', val: '91%', icon: 'favorite' },
              { label: 'Current Tier', val: isPremium ? 'Spark Gold' : 'Standard', icon: 'auto_awesome' }
            ].map((stat, idx) => (
              <div key={idx} className="glass-card rounded-xl p-4 flex items-center gap-3 border border-outline-variant/10 shadow-sm">
                <div className="p-2 bg-primary/10 text-primary rounded-lg">
                  <span className="material-symbols-outlined text-[18px]">{stat.icon}</span>
                </div>
                <div>
                  <div className="text-sm font-bold text-on-surface">{stat.val}</div>
                  <p className="text-[9px] text-on-surface-variant font-medium">{stat.label}</p>
                </div>
              </div>
            ))}

            {/* Engagement map */}
            <div className="md:col-span-3 glass-card rounded-[20px] p-5 border border-outline-variant/10 shadow-sm space-y-4">
              <h4 className="text-xs font-bold text-on-surface">Global Resonance Hotspots</h4>
              <div className="h-32 bg-cover bg-center rounded-xl relative overflow-hidden bg-primary/5 flex items-center justify-center">
                <span className="material-symbols-outlined text-[48px] text-primary/10 select-none">public</span>
                
                {/* Simulated pulsers */}
                <div className="absolute top-1/2 left-1/3 w-3 h-3 bg-primary rounded-full animate-ping"></div>
                <div className="absolute top-1/4 right-1/4 w-3 h-3 bg-primary rounded-full animate-ping" style={{ animationDelay: '0.4s' }}></div>
                <div className="absolute bottom-1/3 left-1/2 w-3 h-3 bg-primary rounded-full animate-ping" style={{ animationDelay: '0.8s' }}></div>
              </div>
              
              <div className="flex gap-4 justify-center">
                <div className="flex items-center gap-1.5 text-[10px] text-on-surface font-semibold">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  <span>San Francisco — High</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-on-surface font-semibold">
                  <span className="w-2 h-2 rounded-full bg-primary-container"></span>
                  <span>London — Medium</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= SAFETY CENTER TAB ================= */}
      {activeTab === 'safety' && (
        <div className="animate-in fade-in duration-300 space-y-6">
          <section className="text-center md:text-left mb-4">
            <h2 className="text-lg font-bold text-primary">Safety Center</h2>
            <p className="text-xs text-on-surface-variant">Your wellness and security are our highest priority.</p>
          </section>

          <div className="space-y-4">
            {[
              {
                title: 'Safe Meeting Protocols',
                desc: 'Always arrange first dates in well-lit, public settings. Let friends or family know where you are going, and manage your own transportation to and from the venue.',
                icon: 'meeting_room'
              },
              {
                title: 'Secure Chats & Info Sharing',
                desc: 'Keep conversations inside the Spark platform. Never share sensitive credentials, home addresses, or financial/banking details with someone you have not met or verified.',
                icon: 'encrypted'
              },
              {
                title: 'Report & Block Bad Behavior',
                desc: 'If anyone makes you feel unsafe, harassing, or behaves suspiciously, use the block option inside settings or report their profile immediately. We review reports within 24 hours.',
                icon: 'report'
              }
            ].map((tip, idx) => (
              <div key={idx} className="pearl-card p-5 rounded-2xl bg-white/40 border border-outline-variant/10 shadow-sm flex items-start gap-4">
                <div className="p-3 bg-primary/10 text-primary rounded-xl shrink-0">
                  <span className="material-symbols-outlined text-[24px]">{tip.icon}</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-on-surface mb-1">{tip.title}</h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed">{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= PLATINUM HUB (PREMIUM) TAB ================= */}
      {activeTab === 'premium' && (
        <div className="animate-in fade-in duration-300 space-y-6">
          <section className="text-center mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-tertiary bg-clip-text text-transparent">Spark Platinum Hub</h2>
            <p className="text-xs text-on-surface-variant max-w-sm mx-auto mt-1">Unlock premium dating benefits and connect on a completely higher level.</p>
          </section>

          {/* Pricing tiers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Spark Gold card */}
            <div className="glass-card rounded-[24px] p-6 border-2 border-outline-variant/20 flex flex-col justify-between text-center relative overflow-hidden">
              <div>
                <span className="text-[9px] font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider">Spark Gold</span>
                <div className="text-2xl font-bold text-on-surface mt-3">$14.99<span className="text-xs text-on-surface-variant font-normal"> / mo</span></div>
                
                <ul className="text-xs text-on-surface-variant space-y-2 my-6 text-left max-w-xs mx-auto">
                  <li className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-green-500 text-sm">check_circle</span> Unlimited Discovery Swipes
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-green-500 text-sm">check_circle</span> 5 Super Likes per day
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-green-500 text-sm">check_circle</span> See who likes your profile
                  </li>
                </ul>
              </div>
              <button 
                onClick={() => handlePurchasePremium('Gold')}
                className="w-full py-3 bg-primary text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-md"
              >
                Upgrade to Gold
              </button>
            </div>

            {/* Spark Platinum card */}
            <div className="glass-card rounded-[24px] p-6 border-2 border-primary flex flex-col justify-between text-center relative overflow-hidden bg-primary/5">
              <div className="absolute top-2 right-2 bg-primary text-white text-[8px] font-bold px-2 py-0.5 rounded uppercase">Best Value</div>
              
              <div>
                <span className="text-[9px] font-bold text-tertiary bg-tertiary/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider">Spark Platinum</span>
                <div className="text-2xl font-bold text-on-surface mt-3">$29.99<span className="text-xs text-on-surface-variant font-normal"> / mo</span></div>
                
                <ul className="text-xs text-on-surface-variant space-y-2 my-6 text-left max-w-xs mx-auto">
                  <li className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-green-500 text-sm">check_circle</span> All Gold Tier features
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-green-500 text-sm">check_circle</span> Direct message before matching
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-green-500 text-sm">check_circle</span> ELO priority visibility boosts
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-green-500 text-sm">check_circle</span> Advanced Performance Insights
                  </li>
                </ul>
              </div>
              
              <button 
                onClick={() => handlePurchasePremium('Platinum')}
                className="w-full py-3 bg-gradient-to-r from-primary to-primary-container text-white font-bold text-xs uppercase tracking-wider rounded-xl glow-button"
              >
                Upgrade to Platinum
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
