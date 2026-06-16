import React, { useState } from 'react';
import { api } from '../api';

const INTEREST_OPTIONS = [
  { icon: 'palette', label: 'Art & Design' },
  { icon: 'flight', label: 'Travel' },
  { icon: 'piano', label: 'Music' },
  { icon: 'restaurant', label: 'Gastronomy' },
  { icon: 'fitness_center', label: 'Wellness' },
  { icon: 'menu_book', label: 'Literature' },
  { icon: 'camera_enhance', label: 'Photography' },
  { icon: 'wine_bar', label: 'Wine tasting' },
  { icon: 'forest', label: 'Nature' },
  { icon: 'theater_comedy', label: 'Cinema' },
  { icon: 'auto_awesome', label: 'Spirituality' },
  { icon: 'monitoring', label: 'Finance' },
  { icon: 'sports_tennis', label: 'Tennis' },
  { icon: 'sailing', label: 'Sailing' },
  { icon: 'architecture', label: 'Architecture' }
];

const PRE_DEFINED_MOCK_PHOTOS = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAcylLGXr9l3r8nEotQf0E2ZZowDzYRL1MNVM84el_XcIahUHsaec9jlsmU3VoI_8ZbeaX5MewRERQNjv7oT1CxKHDI0kbCtG_p7oCG5_pDyTmakymQLWvG5ZgvtZoMUawlqSbUKJjGVbHV6LvfHXRXx1QKEs2UcHvhIlKfKDg-iLFiVF7l9u5VWebwl4FeRgLQaWIJ5hNrx_XtjqB60U3Fhp3ClM86gab0h57PPR8TXtX3Whi1gkVfTRXxSWU_tU6KecTcoHOsT7Rt",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=800"
];

export default function OnboardingFlow({ onComplete, onExit }) {
  const [step, setStep] = useState(1);
  // Form State
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('female');
  const [preference, setPreference] = useState('male');
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [bio, setBio] = useState('');
  const [photos, setPhotos] = useState([]); // array of Base64 or URLs
  const [location, setLocation] = useState({ latitude: 37.7749, longitude: -122.4194 }); // default SF

  // Aux state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpResendTime, setOtpResendTime] = useState(59);

  // General Error message formatter
  const triggerError = (msg) => {
    setError(msg);
    setTimeout(() => setError(''), 4000);
  };

  // Next/Back Actions
  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => Math.max(1, prev - 1));

  // Step 1: Submit Phone Number & Password (register on database)
  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    if (!/^\+?[1-9]\d{9,14}$/.test(phone)) {
      triggerError('Phone must be in international format (e.g. +15550199 or +919876543210)');
      return;
    }
    if (password.length < 6) {
      triggerError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      // Register or Login if already exists (for a smooth demo user journey)
      const data = await api.register(phone, password).catch(async (err) => {
        if (err.message.includes('already exists')) {
          // Fallback to login
          return await api.login(phone, password);
        }
        throw err;
      });
      // OTP Screen triggers next
      handleNext();
    } catch (err) {
      triggerError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: OTP Confirm (Simulated)
  const handleOtpVerify = async (e) => {
    e.preventDefault();
    const joinedOtp = otp.join('');
    if (joinedOtp.length !== 6) {
      triggerError('Please enter the 6-digit verification code.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      handleNext();
    }, 1200);
  };

  // Step 3: Name
  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (name.trim().length < 2) {
      triggerError('Name must be at least 2 characters.');
      return;
    }
    handleNext();
  };

  // Step 4: Date of Birth
  const handleDobSubmit = (e) => {
    e.preventDefault();
    if (!dob) {
      triggerError('Please enter your date of birth.');
      return;
    }
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    if (age < 18) {
      triggerError('You must be 18 years or older to join Spark.');
      return;
    }
    handleNext();
  };

  // Step 5: Gender / Show Me Preference
  const handleGenderSubmit = (e) => {
    e.preventDefault();
    handleNext();
  };

  // Step 6: Interests Selection
  const toggleInterest = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(prev => prev.filter(i => i !== interest));
    } else {
      if (selectedInterests.length >= 10) {
        triggerError('You can select up to 10 interests.');
        return;
      }
      setSelectedInterests(prev => [...prev, interest]);
    }
  };

  const handleInterestsSubmit = (e) => {
    e.preventDefault();
    if (selectedInterests.length < 3) {
      triggerError('Please select at least 3 interests.');
      return;
    }
    handleNext();
  };

  // Step 7: Bio Prompt
  const handleBioSubmit = (e) => {
    e.preventDefault();
    if (bio.trim().length < 10) {
      triggerError('Please write a slightly longer bio (at least 10 characters).');
      return;
    }
    handleNext();
  };

  // Step 8: Add Photos
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotos(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    }
  };

  const selectMockPhoto = (url) => {
    if (photos.includes(url)) {
      setPhotos(prev => prev.filter(p => p !== url));
    } else {
      setPhotos(prev => [...prev, url]);
    }
  };

  const handlePhotosSubmit = (e) => {
    e.preventDefault();
    if (photos.length === 0) {
      triggerError('Please select or upload at least one photo.');
      return;
    }
    handleNext();
  };

  // Step 9: Location Permission Coords
  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          handleNext();
        },
        (err) => {
          console.warn('Geolocation blocked. Proceeding with default location.');
          handleNext();
        }
      );
    } else {
      handleNext();
    }
  };

  // Step 10: Notification Permission
  const requestNotifications = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then(() => {
        handleNext();
      });
    } else {
      handleNext();
    }
  };

  // Step 11: Save Profile to DB (Profile complete screen trigger)
  const saveCompleteProfile = async () => {
    setLoading(true);
    try {
      // 1. Calculate age from DOB
      const birthDate = new Date(dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      // Format bio with interests tags in it
      const formattedBio = `${bio}\n\nInterests: ${selectedInterests.join(', ')}`;

      // 2. Save profile
      await api.saveProfile({
        name,
        age,
        gender,
        preference,
        bio: formattedBio,
        latitude: location.latitude,
        longitude: location.longitude
      });

      // 3. Upload photos (upload first photo as primary)
      for (let i = 0; i < photos.length; i++) {
        const isPrimary = (i === 0);
        const img = photos[i];
        if (img.startsWith('data:image')) {
          await api.uploadPhoto(img, isPrimary);
        } else {
          // Direct URL save
          await fetch('http://localhost:5000/api/photos/upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ url: img, isPrimary })
          });
        }
      }

      // Finish onboarding and proceed to discover page
      onComplete();
    } catch (err) {
      triggerError(err.message || 'Failed to save profile. Try again.');
    } finally {
      setLoading(false);
    }
  };

  // Render Functions
  return (
    <div className="min-h-screen bg-surface flex flex-col font-body-md relative overflow-x-hidden w-screen">
      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary-container/10 bg-blob blur-[100px]"></div>
        <div className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] rounded-full bg-secondary-container/20 bg-blob blur-[100px]"></div>
      </div>

      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/60 backdrop-blur-xl border-b border-outline-variant/30 px-6 h-16 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>map_pin_heart</span>
          <span className="font-display-lg text-headline-lg bg-gradient-to-r from-primary to-tertiary bg-clip-text text-transparent !text-[20px]">Spark</span>
        </div>
        {step > 1 && step < 11 && (
          <button onClick={handleBack} className="flex items-center gap-1 text-on-surface-variant font-medium hover:text-primary transition-colors text-sm">
            <span className="material-symbols-outlined text-sm">arrow_back</span> Back
          </button>
        )}
        <button onClick={onExit} className="text-on-surface-variant font-semibold hover:text-red-500 transition-colors text-sm">
          Exit
        </button>
      </header>

      <main className="flex-grow pt-24 pb-32 px-6 flex flex-col items-center justify-center relative z-10">
        <div className="w-full max-w-xl mx-auto">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-100 border border-red-200 text-red-700 text-sm flex items-center gap-2 shadow-sm animate-bounce">
              <span className="material-symbols-outlined text-red-500">error</span>
              <span>{error}</span>
            </div>
          )}

          {/* Progress Indicator */}
          {step < 11 && (
            <div className="w-full mb-8">
              <div className="flex justify-between items-center mb-2 text-xs font-semibold">
                <span className="text-on-surface-variant opacity-75">Step {step} of 10</span>
                <span className="text-primary uppercase tracking-wider">Onboarding</span>
              </div>
              <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-primary-container transition-all duration-300" style={{ width: `${step * 10}%` }}></div>
              </div>
            </div>
          )}

          {/* STEP 1: Phone & Password Setup */}
          {step === 1 && (
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">Create Account</h1>
                <p className="text-sm text-on-surface-variant">Verify your number & set a password to begin.</p>
              </div>
              <div className="glass-card rounded-[24px] p-6 md:p-8 shadow-sm">
                <form onSubmit={handlePhoneSubmit} className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold uppercase text-muted mb-2">Phone Number</label>
                    <div className="relative flex items-center group">
                      <div className="absolute left-4 text-primary font-bold pr-3 border-r border-outline-variant/30 flex items-center gap-1">
                        <span className="material-symbols-outlined text-base">public</span>
                        <span className="text-sm">+1</span>
                      </div>
                      <input 
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="555 0101 (or local equivalent)"
                        className="w-full bg-white/40 border-b-2 border-outline-variant focus:border-primary focus:ring-0 text-lg font-semibold py-3 pl-20 pr-4 outline-none rounded-t-xl transition-all"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-muted mb-2">Secure Password</label>
                    <input 
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white/40 border-b-2 border-outline-variant focus:border-primary focus:ring-0 text-base py-3 px-4 outline-none rounded-t-xl transition-all"
                      required
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="glow-button w-full bg-gradient-to-r from-primary to-primary-container text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all"
                  >
                    {loading ? <span className="material-symbols-outlined animate-spin">progress_activity</span> : <>Continue <span className="material-symbols-outlined text-sm">arrow_forward</span></>}
                  </button>
                </form>
              </div>
            </section>
          )}

          {/* STEP 2: OTP Verification */}
          {step === 2 && (
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary-container/50 mb-4">
                  <span className="material-symbols-outlined text-primary text-3xl">mark_email_read</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">Verify Phone</h1>
                <p className="text-sm text-on-surface-variant">We've sent a 6-digit confirmation code. Enter 123456 to bypass.</p>
              </div>
              <div className="glass-card rounded-[24px] p-6 md:p-8 shadow-sm text-center">
                <form onSubmit={handleOtpVerify} className="space-y-6">
                  <div className="flex justify-between gap-2 md:gap-3">
                    {otp.map((val, idx) => (
                      <input 
                        key={idx}
                        id={`otp-${idx}`}
                        type="text"
                        maxLength="1"
                        pattern="[0-9]*"
                        inputMode="numeric"
                        value={val}
                        onChange={(e) => {
                          const v = e.target.value;
                          const newOtp = [...otp];
                          newOtp[idx] = v;
                          setOtp(newOtp);
                          if (v && idx < 5) {
                            document.getElementById(`otp-${idx + 1}`).focus();
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Backspace' && !val && idx > 0) {
                            document.getElementById(`otp-${idx - 1}`).focus();
                          }
                        }}
                        className="w-12 h-12 md:w-14 md:h-14 text-center font-bold text-xl border-b-2 border-outline-variant focus:border-primary focus:ring-0 bg-transparent rounded-lg outline-none"
                      />
                    ))}
                  </div>
                  <button 
                    type="submit"
                    disabled={loading}
                    className="glow-button w-full bg-gradient-to-r from-primary to-primary-container text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all"
                  >
                    {loading ? <span className="material-symbols-outlined animate-spin">progress_activity</span> : <>Verify Code <span className="material-symbols-outlined text-sm">arrow_forward</span></>}
                  </button>
                </form>
                <p className="text-xs text-on-surface-variant mt-6">
                  Didn't receive the code? <span className="text-primary font-bold cursor-pointer">Resend Code (0:59)</span>
                </p>
              </div>
            </section>
          )}

          {/* STEP 3: First Name */}
          {step === 3 && (
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-on-surface mb-2">What's your name?</h1>
                <p className="text-sm text-on-surface-variant font-medium">This will be shown on your profile.</p>
              </div>
              <div className="glass-card rounded-[24px] p-6 md:p-8 shadow-sm">
                <form onSubmit={handleNameSubmit} className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold uppercase text-muted mb-2">First Name</label>
                    <input 
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Sophia"
                      className="w-full bg-white/40 border-b-2 border-outline-variant focus:border-primary focus:ring-0 text-lg py-3 px-4 outline-none rounded-t-xl transition-all"
                      required
                    />
                  </div>
                  <button 
                    type="submit"
                    className="glow-button w-full bg-gradient-to-r from-primary to-primary-container text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2"
                  >
                    Continue <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </form>
              </div>
            </section>
          )}

          {/* STEP 4: Date of Birth */}
          {step === 4 && (
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-on-surface mb-2">When is your birthday?</h1>
                <p className="text-sm text-on-surface-variant font-medium">You must be at least 18 years old to join Spark.</p>
              </div>
              <div className="glass-card rounded-[24px] p-6 md:p-8 shadow-sm">
                <form onSubmit={handleDobSubmit} className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold uppercase text-muted mb-2">Date of Birth</label>
                    <input 
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full bg-white/40 border-b-2 border-outline-variant focus:border-primary focus:ring-0 text-base py-3 px-4 outline-none rounded-t-xl transition-all"
                      required
                    />
                  </div>
                  <button 
                    type="submit"
                    className="glow-button w-full bg-gradient-to-r from-primary to-primary-container text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2"
                  >
                    Continue <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </form>
              </div>
            </section>
          )}

          {/* STEP 5: Gender & Preference Setup */}
          {step === 5 && (
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-on-surface mb-2">Gender Identity</h1>
                <p className="text-sm text-on-surface-variant">Select your identity and preference parameters.</p>
              </div>
              <div className="glass-card rounded-[24px] p-6 md:p-8 shadow-sm">
                <form onSubmit={handleGenderSubmit} className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold uppercase text-muted mb-2">I identify as</label>
                    <div className="grid grid-cols-3 gap-3">
                      {['female', 'male', 'non-binary'].map((g) => (
                        <button
                          type="button"
                          key={g}
                          onClick={() => setGender(g)}
                          className={`py-3 rounded-xl border text-sm font-semibold capitalize transition-all ${
                            gender === g ? 'bg-primary text-white border-transparent shadow-sm' : 'bg-white/40 border-outline-variant/50 text-secondary hover:border-primary/50'
                          }`}
                        >
                          {g.replace('-', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-muted mb-2">Show me</label>
                    <div className="grid grid-cols-3 gap-3">
                      {['female', 'male', 'everyone'].map((p) => (
                        <button
                          type="button"
                          key={p}
                          onClick={() => setPreference(p)}
                          className={`py-3 rounded-xl border text-sm font-semibold capitalize transition-all ${
                            preference === p ? 'bg-primary text-white border-transparent shadow-sm' : 'bg-white/40 border-outline-variant/50 text-secondary hover:border-primary/50'
                          }`}
                        >
                          {p === 'everyone' ? 'Everyone' : p + 's'}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button 
                    type="submit"
                    className="glow-button w-full bg-gradient-to-r from-primary to-primary-container text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2"
                  >
                    Continue <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </form>
              </div>
            </section>
          )}

          {/* STEP 6: Interests */}
          {step === 6 && (
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-on-surface mb-2">What ignites your spark?</h1>
                <p className="text-sm text-on-surface-variant max-w-md mx-auto">Select at least 3 interests to help us match your personality details.</p>
              </div>
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                {INTEREST_OPTIONS.map((item) => {
                  const isSelected = selectedInterests.includes(item.label);
                  return (
                    <button
                      type="button"
                      key={item.label}
                      onClick={() => toggleInterest(item.label)}
                      className={`interest-chip flex items-center gap-2 px-4 py-3 rounded-full border text-xs font-semibold shadow-sm transition-all ${
                        isSelected 
                          ? 'bg-primary text-white border-transparent scale-105' 
                          : 'bg-white/50 border-outline-variant/40 text-on-surface hover:border-primary/40'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
              <button 
                onClick={handleInterestsSubmit}
                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                  selectedInterests.length >= 3 
                    ? 'bg-gradient-to-r from-primary to-primary-container text-white glow-button' 
                    : 'bg-outline-variant text-on-surface-variant/50 cursor-not-allowed'
                }`}
                disabled={selectedInterests.length < 3}
              >
                Continue ({selectedInterests.length}/3 selected) <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </section>
          )}

          {/* STEP 7: Bio Prompt */}
          {step === 7 && (
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-on-surface mb-2">Describe your vibe</h1>
                <p className="text-sm text-on-surface-variant">Write a short bio to introduce yourself.</p>
              </div>
              <div className="glass-card rounded-[24px] p-6 md:p-8 shadow-sm">
                <form onSubmit={handleBioSubmit} className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold uppercase text-muted mb-2">Bio Prompt</label>
                    <textarea 
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="e.g. Travel enthusiast, book collector, loves spontaneous weekend getaways..."
                      className="w-full bg-white/40 border-b-2 border-outline-variant focus:border-primary focus:ring-0 text-base py-3 px-4 outline-none rounded-t-xl transition-all h-28 resize-none"
                      required
                    />
                  </div>
                  <button 
                    type="submit"
                    className="glow-button w-full bg-gradient-to-r from-primary to-primary-container text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2"
                  >
                    Continue <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </form>
              </div>
            </section>
          )}

          {/* STEP 8: Add Photos */}
          {step === 8 && (
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-on-surface mb-2">Add your photos</h1>
                <p className="text-sm text-on-surface-variant">Select a premium demo portrait or upload your own.</p>
              </div>
              <div className="glass-card rounded-[24px] p-6 shadow-sm mb-6">
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {PRE_DEFINED_MOCK_PHOTOS.map((url, idx) => {
                    const isSelected = photos.includes(url);
                    return (
                      <div 
                        key={idx} 
                        onClick={() => selectMockPhoto(url)}
                        className={`aspect-square rounded-xl overflow-hidden cursor-pointer border-2 relative ${
                          isSelected ? 'border-primary shadow-md' : 'border-transparent opacity-60 hover:opacity-90'
                        }`}
                      >
                        <img src={url} alt="Profile option" className="w-full h-full object-cover" />
                        {isSelected && (
                          <div className="absolute top-1 right-1 w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-[14px]">check</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                
                <div className="border-2 border-dashed border-outline-variant/60 rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 relative">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handlePhotoUpload} 
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <span className="material-symbols-outlined text-primary text-3xl mb-2">cloud_upload</span>
                  <p className="text-xs font-semibold text-secondary">Upload Custom Image</p>
                </div>
              </div>

              {photos.length > 0 && (
                <div className="mb-6 flex gap-2 overflow-x-auto py-2">
                  {photos.map((p, i) => (
                    <div key={i} className="w-16 h-16 rounded-lg overflow-hidden border border-outline-variant shrink-0 relative">
                      <img src={p} alt="Selected" className="w-full h-full object-cover" />
                      <button 
                        onClick={() => setPhotos(prev => prev.filter((_, idx) => idx !== i))}
                        className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button 
                onClick={handlePhotosSubmit}
                disabled={photos.length === 0}
                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                  photos.length > 0 ? 'bg-gradient-to-r from-primary to-primary-container text-white glow-button' : 'bg-outline-variant text-on-surface-variant/50 cursor-not-allowed'
                }`}
              >
                Continue <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </section>
          )}

          {/* STEP 9: Location Permission */}
          {step === 9 && (
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-center">
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-container/20 text-primary mb-4 animate-pulse">
                  <span className="material-symbols-outlined text-[48px]">location_on</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-on-surface mb-2">Enable Location</h1>
                <p className="text-sm text-on-surface-variant max-w-sm mx-auto">
                  Spark uses your geolocation coordinates to search for nearby compatible partners.
                </p>
              </div>
              <div className="space-y-4 max-w-xs mx-auto">
                <button 
                  onClick={requestLocation}
                  className="glow-button w-full bg-gradient-to-r from-primary to-primary-container text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2"
                >
                  Share My Location
                </button>
                <button 
                  onClick={handleNext}
                  className="w-full text-secondary font-semibold py-2 hover:text-primary transition-colors text-sm"
                >
                  Skip for Now
                </button>
              </div>
            </section>
          )}

          {/* STEP 10: Notification Permission */}
          {step === 10 && (
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-center">
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-container/20 text-primary mb-4 animate-pulse">
                  <span className="material-symbols-outlined text-[48px]">notifications</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-on-surface mb-2">Enable Alerts</h1>
                <p className="text-sm text-on-surface-variant max-w-sm mx-auto">
                  Stay updated immediately when someone matches back or sends you a direct message.
                </p>
              </div>
              <div className="space-y-4 max-w-xs mx-auto">
                <button 
                  onClick={requestNotifications}
                  className="glow-button w-full bg-gradient-to-r from-primary to-primary-container text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2"
                >
                  Allow Push Notifications
                </button>
                <button 
                  onClick={handleNext}
                  className="w-full text-secondary font-semibold py-2 hover:text-primary transition-colors text-sm"
                >
                  Skip for Now
                </button>
              </div>
            </section>
          )}

          {/* STEP 11: Onboarding Complete & Database Save */}
          {step === 11 && (
            <section className="animate-in fade-in zoom-in-95 duration-700 text-center">
              <div className="mb-8">
                <div className="w-24 h-24 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-6 shadow-sm border border-green-200">
                  <span className="material-symbols-outlined text-[54px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                </div>
                <h1 className="text-3xl font-bold text-green-600 mb-2">Profile Complete!</h1>
                <p className="text-sm text-on-surface-variant max-w-md mx-auto">
                  Your details have been successfully prepared. Click below to write to the PostgreSQL database and open the Discovery feed.
                </p>
              </div>
              
              <div className="font-mono text-xs text-left bg-black/5 border border-outline-variant/30 rounded-xl p-4 mb-8 space-y-1 text-on-surface max-w-sm mx-auto">
                <div><span className="font-bold text-primary">Name:</span> {name}</div>
                <div><span className="font-bold text-primary">Interests:</span> {selectedInterests.slice(0, 3).join(', ')}...</div>
                <div><span className="font-bold text-primary">Location:</span> {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}</div>
                <div><span className="font-bold text-primary">Status:</span> Profile Validated</div>
              </div>

              <button 
                onClick={saveCompleteProfile}
                disabled={loading}
                className="glow-button w-full max-w-sm bg-gradient-to-r from-primary to-primary-container text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 mx-auto active:scale-95 transition-all shadow-md"
              >
                {loading ? <span className="material-symbols-outlined animate-spin">progress_activity</span> : <>Enter Spark Feed <span className="material-symbols-outlined text-sm">arrow_forward</span></>}
              </button>
            </section>
          )}

        </div>
      </main>

      {/* Footer / Copyright */}
      <footer className="fixed bottom-6 w-full text-center z-10 pointer-events-none">
        <p className="font-label-sm text-[11px] text-on-surface-variant/40 tracking-wider">
          Premium Secure Encryption • Spark LLC 2026
        </p>
      </footer>
    </div>
  );
}
