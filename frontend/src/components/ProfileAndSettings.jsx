/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from 'react';
import { api } from '../api';
import { useToast } from './Toast';
import { AnimatePresence, motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import PlatinumHub from './PlatinumHub';

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
  const [occupation, setOccupation] = useState(profile?.occupation || '');
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [photos, setPhotos] = useState([]);

  // Premium Status State
  const [isPremium, setIsPremium] = useState(false);
  const [entitlements, setEntitlements] = useState(null);

  // Settings State — loaded from backend
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [showDistance, setShowDistance] = useState(true);
  const [showAge, setShowAge] = useState(true);
  const [incognitoMode, setIncognitoMode] = useState(false);

  // Preferences State — loaded from backend
  const [prefsLoaded, setPrefsLoaded] = useState(false);
  const [distanceLimit, setDistanceLimit] = useState(25);
  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(50);
  const [preferredGender, setPreferredGender] = useState('everyone');

  // Stats State — loaded from API
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);

  // Location State
  const [locationUpdating, setLocationUpdating] = useState(false);

  // Safety Center State
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportTargetId, setReportTargetId] = useState('');
  const [reportReason, setReportReason] = useState('');
  const [reportDetails, setReportDetails] = useState('');
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  const { showToast } = useToast();

  // Format location display from profile
  const getLocationDisplay = useCallback(() => {
    if (profile?.city) return profile.city;
    if (profile?.latitude && profile?.longitude) {
      return `${profile.latitude.toFixed(2)}°, ${profile.longitude.toFixed(2)}°`;
    }
    return 'Location not set';
  }, [profile]);

  const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('/uploads')) return `http://localhost:5000${url}`;
    return url;
  };

  // Load blocked list when settings tab opens
  useEffect(() => {
    if (activeTab === 'settings') {
      api.getBlocked().then(res => setBlockedUsers(res || [])).catch(console.warn);
    }
  }, [activeTab]);

  // Load settings & preferences from backend when settings tab opens
  useEffect(() => {
    if (activeTab === 'settings' && !settingsLoaded) {
      api.getSettings().then(res => {
        if (res) {
          setShowOnlineStatus(res.showOnlineStatus ?? true);
          setShowDistance(res.showDistance ?? true);
          setShowAge(res.showAge ?? true);
          setIncognitoMode(res.incognitoMode ?? false);
        }
        setSettingsLoaded(true);
      }).catch(err => {
        console.warn('Failed to load settings:', err.message);
        setSettingsLoaded(true);
      });
    }
    if (activeTab === 'settings' && !prefsLoaded) {
      api.getPreferences().then(res => {
        if (res) {
          setDistanceLimit(res.maxDistance ?? 25);
          setMinAge(res.minAge ?? 18);
          setMaxAge(res.maxAge ?? 50);
          setPreferredGender(res.preferredGender ?? 'everyone');
        }
        setPrefsLoaded(true);
      }).catch(err => {
        console.warn('Failed to load preferences:', err.message);
        setPrefsLoaded(true);
      });
    }
  }, [activeTab, settingsLoaded, prefsLoaded]);

  // Load real stats from API when stats tab opens
  useEffect(() => {
    if (activeTab === 'stats') {
      setStatsLoading(true);
      api.getInteractionStats().then(res => {
        setStats(res);
      }).catch(err => {
        console.warn('Failed to load stats:', err.message);
        setStats(null);
      }).finally(() => setStatsLoading(false));
    }
  }, [activeTab]);

  // Load entitlements on mount to check premium status
  useEffect(() => {
    api.getEntitlements().then(res => {
      if (res && (res.isPremium || res.plan || (res.entitlements && res.entitlements.length > 0))) {
        setIsPremium(true);
        setEntitlements(res);
      }
    }).catch(() => {
      // Not premium or endpoint not available
    });
  }, []);

  // Sync initial values from profile
  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setAge(profile.age || 18);
      setOccupation(profile.occupation || '');
      setPhotos(profile.photos || []);

      // Use separate bio and interests fields if available
      if (Array.isArray(profile.interests) && profile.interests.length > 0) {
        setSelectedInterests(profile.interests);
        setBioText(profile.bio || '');
      } else if (profile.bio) {
        // Legacy: extract interests from concatenated bio string
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

  // Persist setting change to backend
  const handleSettingChange = async (key, value) => {
    const setterMap = {
      showOnlineStatus: setShowOnlineStatus,
      showDistance: setShowDistance,
      showAge: setShowAge,
      incognitoMode: setIncognitoMode
    };
    setterMap[key]?.(value);
    try {
      await api.updateSettings({ [key]: value });
    } catch (err) {
      showToast('Failed to update setting: ' + err.message, 'error');
      // Revert
      setterMap[key]?.(!value);
    }
  };

  // Persist preference change to backend (debounced for sliders)
  const handlePrefChange = async (updates) => {
    try {
      await api.updatePreferences(updates);
    } catch (err) {
      showToast('Failed to update preference: ' + err.message, 'error');
    }
  };

  const handleUnblock = async (blockedId) => {
    try {
      await api.unblockUser(blockedId);
      setBlockedUsers(prev => prev.filter(u => u.blockedId !== blockedId));
      showToast('User unblocked successfully.');
    } catch (err) {
      showToast('Failed to unblock user: ' + err.message, 'error');
    }
  };

  // Photo upload — pass File object directly (not base64)
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const res = await api.uploadPhoto(file, photos.length === 0);
      setPhotos(prev => [...prev, res.photo || res]);
      showToast('Photo uploaded successfully.');
    } catch (err) {
      showToast('Photo upload failed: ' + err.message, 'error');
    }
  };

  const handleDeletePhoto = async (photoId) => {
    try {
      await api.deletePhoto(photoId);
      setPhotos(prev => prev.filter(p => p.id !== photoId));
      showToast('Photo deleted successfully.');
    } catch (err) {
      showToast('Photo delete failed: ' + err.message, 'error');
    }
  };

  const handleSetPrimary = async (photoId) => {
    try {
      await api.setPrimaryPhoto(photoId);
      setPhotos(prev => prev.map(p => ({ ...p, isPrimary: p.id === photoId })));
      showToast('Primary photo updated.');
    } catch (err) {
      showToast('Failed to set primary photo: ' + err.message, 'error');
    }
  };

  // Save profile — bio and interests as separate fields
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await api.updateProfile({
        name,
        age: parseInt(age),
        bio: bioText,
        interests: selectedInterests,
        occupation,
        gender: profile.gender || 'female',
        preference: profile.preference || 'everyone'
      });
      const updatedProfile = res.profile || res;
      setProfile(updatedProfile);
      onProfileUpdated(updatedProfile);
      showToast('Profile saved successfully.');
      setActiveTab('profile');
    } catch (err) {
      showToast('Failed to save profile: ' + err.message, 'error');
    }
  };

  const toggleInterest = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(prev => prev.filter(i => i !== interest));
    } else {
      setSelectedInterests(prev => [...prev, interest]);
    }
  };

  // Update location using browser geolocation
  const handleUpdateLocation = async () => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser.', 'error');
      return;
    }
    setLocationUpdating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await api.updateLocation(latitude, longitude);
          const updatedProfile = { ...profile, latitude, longitude, ...(res?.profile || {}) };
          setProfile(updatedProfile);
          onProfileUpdated(updatedProfile);
          showToast('Location updated successfully.');
        } catch (err) {
          showToast('Failed to update location: ' + err.message, 'error');
        } finally {
          setLocationUpdating(false);
        }
      },
      (err) => {
        showToast('Location access denied: ' + err.message, 'error');
        setLocationUpdating(false);
      }
    );
  };

  // Report — uses correct API signature: (targetId, reasonCategory, description)
  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!reportReason) {
      showToast('Please select a reason for reporting.', 'error');
      return;
    }
    if (!reportTargetId.trim()) {
      showToast('Please enter the user ID to report.', 'error');
      return;
    }
    setIsSubmittingReport(true);
    try {
      await api.reportUser(reportTargetId.trim(), reportReason, reportDetails);
      showToast('Report submitted successfully. We will review it shortly.');
      setShowReportModal(false);
      setReportTargetId('');
      setReportReason('');
      setReportDetails('');
    } catch (err) {
      showToast('Failed to submit report: ' + err.message, 'error');
    } finally {
      setIsSubmittingReport(false);
    }
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
              src={getImageUrl(photos[0]?.url) || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800"} 
              alt={profile.name} 
              className="w-full h-full object-cover" 
              loading="lazy"
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
                <span className="text-xs text-on-surface-variant font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">location_on</span>
                  {getLocationDisplay()}
                </span>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="pearl-card p-6 rounded-2xl bg-white/40 backdrop-blur-sm border border-outline-variant/10 shadow-sm space-y-2">
            <h3 className="text-sm font-bold text-primary uppercase tracking-wide">About Me</h3>
            <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
              {bioText || 'Add something interesting about yourself under the Edit Info tab!'}
            </p>
            {occupation && (
              <p className="text-xs text-on-surface-variant flex items-center gap-1 mt-1">
                <span className="material-symbols-outlined text-[14px]">work</span>
                {occupation}
              </p>
            )}
          </div>

          {/* Location & Update */}
          <div className="pearl-card p-4 rounded-2xl bg-white/40 backdrop-blur-sm border border-outline-variant/10 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">my_location</span>
              <div>
                <h4 className="text-xs font-bold text-on-surface">Current Location</h4>
                <p className="text-[10px] text-on-surface-variant">{getLocationDisplay()}</p>
              </div>
            </div>
            <button
              onClick={handleUpdateLocation}
              disabled={locationUpdating}
              className="text-[10px] font-bold text-primary border border-primary/20 hover:bg-primary/5 px-3 py-1.5 rounded-full transition-colors disabled:opacity-50 flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">{locationUpdating ? 'progress_activity' : 'refresh'}</span>
              {locationUpdating ? 'Updating...' : 'Update Location'}
            </button>
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
                  <img src={getImageUrl(p.url)} alt="Moment" className="w-full h-full object-cover" loading="lazy" />
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
                <label className="block text-[10px] font-bold uppercase text-muted mb-2">Occupation</label>
                <input
                  type="text"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  placeholder="e.g. Software Engineer at Google"
                  className="w-full bg-white/40 border-b-2 border-outline-variant focus:border-primary focus:ring-0 text-sm py-2 px-3 outline-none rounded-t-lg transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-muted mb-2">About Me (Bio)</label>
                <textarea
                  value={bioText}
                  onChange={(e) => setBioText(e.target.value)}
                  className="w-full bg-white/40 border-b-2 border-outline-variant focus:border-primary focus:ring-0 text-sm py-2 px-3 outline-none rounded-t-lg transition-all h-24 resize-none"
                  placeholder="Tell people about yourself..."
                />
              </div>

              {/* Photo upload and management */}
              <div className="space-y-3">
                <label className="block text-[10px] font-bold uppercase text-muted">Upload & Manage Photos</label>
                
                <div className="grid grid-cols-4 gap-3">
                  {photos.map((p) => (
                    <div key={p.id} className="aspect-square rounded-lg border border-outline-variant/30 overflow-hidden relative group shadow-sm bg-white/20">
                      <img src={getImageUrl(p.url)} alt="Profile" className="w-full h-full object-cover" loading="lazy" />
                      <button
                        type="button"
                        onClick={() => handleDeletePhoto(p.id)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[11px] hover:bg-red-600 shadow-md transition-colors"
                      >
                        ×
                      </button>
                      {p.isPrimary ? (
                        <div className="absolute bottom-1 left-1 bg-primary text-white text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">
                          Primary
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSetPrimary(p.id)}
                          className="absolute bottom-1 left-1 bg-white/80 text-primary text-[8px] font-bold px-1.5 py-0.5 rounded uppercase opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                        >
                          Set Primary
                        </button>
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
          
          {/* Discovery Preferences */}
          <div className="glass-card rounded-[24px] p-6 shadow-sm space-y-6">
            <h3 className="text-sm font-bold text-primary uppercase tracking-wide">Discovery Preferences</h3>
            
            <div className="space-y-4">
              {/* Distance limit slider */}
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
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setDistanceLimit(val);
                    }}
                    onMouseUp={() => handlePrefChange({ maxDistance: distanceLimit })}
                    onTouchEnd={() => handlePrefChange({ maxDistance: distanceLimit })}
                    className="accent-primary"
                  />
                  <span className="text-xs font-bold text-primary min-w-[50px] text-right">{distanceLimit} miles</span>
                </div>
              </div>

              {/* Age range */}
              <div className="py-2 border-b border-outline-variant/10">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h4 className="text-xs font-bold text-on-surface">Age Range</h4>
                    <p className="text-[10px] text-on-surface-variant mt-0.5">Set preferred age range for matches.</p>
                  </div>
                  <span className="text-xs font-bold text-primary">{minAge} – {maxAge}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-on-surface-variant w-8">Min</span>
                  <input 
                    type="range" min="18" max="70" value={minAge}
                    onChange={(e) => setMinAge(parseInt(e.target.value))}
                    onMouseUp={() => handlePrefChange({ minAge, maxAge })}
                    onTouchEnd={() => handlePrefChange({ minAge, maxAge })}
                    className="accent-primary flex-1"
                  />
                  <span className="text-[10px] text-on-surface-variant w-8">Max</span>
                  <input 
                    type="range" min="18" max="70" value={maxAge}
                    onChange={(e) => setMaxAge(parseInt(e.target.value))}
                    onMouseUp={() => handlePrefChange({ minAge, maxAge })}
                    onTouchEnd={() => handlePrefChange({ minAge, maxAge })}
                    className="accent-primary flex-1"
                  />
                </div>
              </div>

              {/* Gender preference */}
              <div className="flex justify-between items-center py-2 border-b border-outline-variant/10">
                <div>
                  <h4 className="text-xs font-bold text-on-surface">Show Me</h4>
                  <p className="text-[10px] text-on-surface-variant mt-0.5">Preferred gender for discovery.</p>
                </div>
                <select
                  value={preferredGender}
                  onChange={(e) => {
                    setPreferredGender(e.target.value);
                    handlePrefChange({ preferredGender: e.target.value });
                  }}
                  className="bg-white/40 border border-outline-variant/30 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-primary"
                >
                  <option value="everyone">Everyone</option>
                  <option value="male">Men</option>
                  <option value="female">Women</option>
                  <option value="nonbinary">Non-binary</option>
                </select>
              </div>
            </div>
          </div>

          {/* Account Settings */}
          <div className="glass-card rounded-[24px] p-6 shadow-sm space-y-6">
            <h3 className="text-sm font-bold text-primary uppercase tracking-wide">Account Settings</h3>
            
            <div className="space-y-4">
              {/* Show Online Status toggle */}
              <div className="flex justify-between items-center py-2 border-b border-outline-variant/10">
                <div>
                  <h4 className="text-xs font-bold text-on-surface">Show Online Status</h4>
                  <p className="text-[10px] text-on-surface-variant mt-0.5">Let others see when you are active.</p>
                </div>
                <button 
                  onClick={() => handleSettingChange('showOnlineStatus', !showOnlineStatus)}
                  className={`w-11 h-6 rounded-full p-1 transition-colors ${showOnlineStatus ? 'bg-primary' : 'bg-outline-variant/50'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${showOnlineStatus ? 'translate-x-5' : 'translate-x-0'}`}></div>
                </button>
              </div>

              {/* Show Distance toggle */}
              <div className="flex justify-between items-center py-2 border-b border-outline-variant/10">
                <div>
                  <h4 className="text-xs font-bold text-on-surface">Show Distance</h4>
                  <p className="text-[10px] text-on-surface-variant mt-0.5">Display your distance on your profile.</p>
                </div>
                <button 
                  onClick={() => handleSettingChange('showDistance', !showDistance)}
                  className={`w-11 h-6 rounded-full p-1 transition-colors ${showDistance ? 'bg-primary' : 'bg-outline-variant/50'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${showDistance ? 'translate-x-5' : 'translate-x-0'}`}></div>
                </button>
              </div>

              {/* Show Age toggle */}
              <div className="flex justify-between items-center py-2 border-b border-outline-variant/10">
                <div>
                  <h4 className="text-xs font-bold text-on-surface">Show Age</h4>
                  <p className="text-[10px] text-on-surface-variant mt-0.5">Display your age on your profile.</p>
                </div>
                <button 
                  onClick={() => handleSettingChange('showAge', !showAge)}
                  className={`w-11 h-6 rounded-full p-1 transition-colors ${showAge ? 'bg-primary' : 'bg-outline-variant/50'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${showAge ? 'translate-x-5' : 'translate-x-0'}`}></div>
                </button>
              </div>

              {/* Incognito mode toggle */}
              <div className="flex justify-between items-center py-2 border-b border-outline-variant/10">
                <div>
                  <h4 className="text-xs font-bold text-on-surface">Incognito Visibility Mode</h4>
                  <p className="text-[10px] text-on-surface-variant mt-0.5">Hide your profile from discovery feeds unless you swipe right.</p>
                </div>
                <button 
                  onClick={() => handleSettingChange('incognitoMode', !incognitoMode)}
                  className={`w-11 h-6 rounded-full p-1 transition-colors ${incognitoMode ? 'bg-primary' : 'bg-outline-variant/50'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${incognitoMode ? 'translate-x-5' : 'translate-x-0'}`}></div>
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
            <p className="text-xs text-on-surface-variant">Track your visibility, active chats, and match ratios.</p>
          </section>

          {statsLoading ? (
            <div className="flex justify-center items-center py-16">
              <span className="material-symbols-outlined text-primary text-3xl animate-spin">progress_activity</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Stats cards — show only what the API returns */}
              {stats?.profileViews !== undefined && (
                <div className="glass-card rounded-[20px] p-5 flex flex-col justify-center items-center text-center border border-outline-variant/10 shadow-sm">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2 text-primary">
                    <span className="material-symbols-outlined text-[24px]">visibility</span>
                  </div>
                  <div className="text-2xl font-bold text-primary">{stats.profileViews.toLocaleString()}</div>
                  <h4 className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mt-1">Profile Views</h4>
                </div>
              )}

              {stats?.likesReceived !== undefined && (
                <div className="glass-card rounded-xl p-4 flex items-center gap-3 border border-outline-variant/10 shadow-sm">
                  <div className="p-2 bg-primary/10 text-primary rounded-lg">
                    <span className="material-symbols-outlined text-[18px]">favorite</span>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-on-surface">{stats.likesReceived.toLocaleString()}</div>
                    <p className="text-[9px] text-on-surface-variant font-medium">Likes Received</p>
                  </div>
                </div>
              )}

              {stats?.likesSent !== undefined && (
                <div className="glass-card rounded-xl p-4 flex items-center gap-3 border border-outline-variant/10 shadow-sm">
                  <div className="p-2 bg-primary/10 text-primary rounded-lg">
                    <span className="material-symbols-outlined text-[18px]">thumb_up</span>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-on-surface">{stats.likesSent.toLocaleString()}</div>
                    <p className="text-[9px] text-on-surface-variant font-medium">Likes Sent</p>
                  </div>
                </div>
              )}

              {stats?.matches !== undefined && (
                <div className="glass-card rounded-xl p-4 flex items-center gap-3 border border-outline-variant/10 shadow-sm">
                  <div className="p-2 bg-primary/10 text-primary rounded-lg">
                    <span className="material-symbols-outlined text-[18px]">handshake</span>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-on-surface">{stats.matches.toLocaleString()}</div>
                    <p className="text-[9px] text-on-surface-variant font-medium">Total Matches</p>
                  </div>
                </div>
              )}

              {stats?.activeChats !== undefined && (
                <div className="glass-card rounded-xl p-4 flex items-center gap-3 border border-outline-variant/10 shadow-sm">
                  <div className="p-2 bg-primary/10 text-primary rounded-lg">
                    <span className="material-symbols-outlined text-[18px]">forum</span>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-on-surface">{stats.activeChats.toLocaleString()}</div>
                    <p className="text-[9px] text-on-surface-variant font-medium">Active Chats</p>
                  </div>
                </div>
              )}

              {stats?.matchRate !== undefined && (
                <div className="glass-card rounded-xl p-4 flex items-center gap-3 border border-outline-variant/10 shadow-sm">
                  <div className="p-2 bg-primary/10 text-primary rounded-lg">
                    <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-on-surface">{typeof stats.matchRate === 'number' ? `${Math.round(stats.matchRate * 100)}%` : stats.matchRate}</div>
                    <p className="text-[9px] text-on-surface-variant font-medium">Match Rate</p>
                  </div>
                </div>
              )}

              {/* Current tier - always shown */}
              <div className="glass-card rounded-xl p-4 flex items-center gap-3 border border-outline-variant/10 shadow-sm">
                <div className="p-2 bg-primary/10 text-primary rounded-lg">
                  <span className="material-symbols-outlined text-[18px]">workspace_premium</span>
                </div>
                <div>
                  <div className="text-sm font-bold text-on-surface">{isPremium ? 'Spark Gold' : 'Standard'}</div>
                  <p className="text-[9px] text-on-surface-variant font-medium">Current Tier</p>
                </div>
              </div>

              {/* No stats available fallback */}
              {!stats && (
                <div className="md:col-span-3 glass-card rounded-[20px] p-8 border border-outline-variant/10 shadow-sm text-center">
                  <span className="material-symbols-outlined text-primary/30 text-[48px] mb-2">monitoring</span>
                  <p className="text-sm text-on-surface-variant">No insights data available yet. Keep swiping to generate stats!</p>
                </div>
              )}
            </div>
          )}
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

          <div className="mt-8 flex justify-center">
            <button 
              onClick={() => setShowReportModal(true)}
              className="py-3 px-8 bg-error/10 text-error font-bold rounded-full border border-error/20 hover:bg-error/20 transition-colors text-xs tracking-wider uppercase flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[16px]">flag</span> Report an Issue
            </button>
          </div>
        </div>
      )}

      {/* Report Modal — uses correct API: reportUser(targetId, reasonCategory, description) */}
      <AnimatePresence>
        {showReportModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white/90 backdrop-blur-xl border border-outline-variant/30 w-full max-w-sm rounded-[24px] p-6 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-on-surface">Report an Issue</h3>
                <button onClick={() => setShowReportModal(false)} className="text-on-surface-variant hover:text-on-surface p-1">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <form onSubmit={handleReportSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-muted mb-2">User ID to Report</label>
                  <input
                    type="text"
                    value={reportTargetId}
                    onChange={e => setReportTargetId(e.target.value)}
                    className="w-full bg-surface/50 border border-outline-variant/30 rounded-lg p-2.5 text-sm outline-none focus:border-primary"
                    placeholder="Enter the user's ID"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-muted mb-2">Reason</label>
                  <select 
                    value={reportReason} 
                    onChange={e => setReportReason(e.target.value)}
                    className="w-full bg-surface/50 border border-outline-variant/30 rounded-lg p-2.5 text-sm outline-none focus:border-primary"
                    required
                  >
                    <option value="" disabled>Select a reason</option>
                    <option value="inappropriate_behavior">Inappropriate Behavior</option>
                    <option value="spam_fake">Spam or Fake Profile</option>
                    <option value="harassment">Harassment</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-muted mb-2">Details (Optional)</label>
                  <textarea 
                    value={reportDetails}
                    onChange={e => setReportDetails(e.target.value)}
                    className="w-full bg-surface/50 border border-outline-variant/30 rounded-lg p-2.5 text-sm outline-none focus:border-primary h-24 resize-none"
                    placeholder="Provide more context..."
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={isSubmittingReport || !reportReason || !reportTargetId.trim()}
                  className="w-full py-3 bg-error text-white font-bold rounded-xl shadow-md hover:bg-error/90 transition-colors disabled:opacity-50"
                >
                  {isSubmittingReport ? 'Submitting...' : 'Submit Report'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= PLATINUM HUB (PREMIUM) TAB ================= */}
      {activeTab === 'premium' && (
        <div className="animate-in fade-in duration-300">
           <PlatinumHub />
        </div>
      )}

    </div>
  );
}
