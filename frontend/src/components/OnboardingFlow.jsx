import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../api';
import ReactCountryFlag from "react-country-flag";
import bgImage from '../assets/image.png';

const COUNTRY_CODES = [
  { code: '+1',   country: 'US' },
  { code: '+1',   country: 'CA'},
  { code: '+44',  country: 'UK' },
  { code: '+91',  country: 'IN' },
  { code: '+61',  country: 'AU' },
  { code: '+81',  country: 'JP'},
  { code: '+49',  country: 'DE' },
  { code: '+33',  country: 'FR' },
  { code: '+86',  country: 'CN' },
  { code: '+55',  country: 'BR' },
  { code: '+52',  country: 'MX' },
  { code: '+971', country: 'AE'},
  { code: '+27',  country: 'ZA' },
  { code: '+39',  country: 'IT' },
  { code: '+34',  country: 'ES' },
  { code: '+82',  country: 'KR' },
  { code: '+7',   country: 'RU' },
  { code: '+90',  country: 'TR' },
  { code: '+966', country: 'SA' },
  { code: '+54',  country: 'AR'},
  { code: '+234', country: 'NG' },
  { code: '+20',  country: 'EG' },
  { code: '+62',  country: 'ID' },
  { code: '+92',  country: 'PK' },
  { code: '+880', country: 'BD' },
  { code: '+63',  country: 'PH' },
  { code: '+84',  country: 'VN' },
  { code: '+66',  country: 'TH' },
  { code: '+60',  country: 'MY' },
  { code: '+65',  country: 'SG' },
  { code: '+64',  country: 'NZ'},
  { code: '+46',  country: 'SE'},
  { code: '+47',  country: 'NO' },
  { code: '+358', country: 'FI' },
  { code: '+45',  country: 'DK' },
  { code: '+31',  country: 'NL' },
  { code: '+32',  country: 'BE' },
  { code: '+41',  country: 'CH' },
  { code: '+43',  country: 'AT' },
];

const INTEREST_OPTIONS = [
  { icon: 'palette',         label: 'Art & Design' },
  { icon: 'flight',          label: 'Travel' },
  { icon: 'piano',           label: 'Music' },
  { icon: 'restaurant',      label: 'Gastronomy' },
  { icon: 'fitness_center',  label: 'Wellness' },
  { icon: 'menu_book',       label: 'Literature' },
  { icon: 'camera_enhance',  label: 'Photography' },
  { icon: 'wine_bar',        label: 'Wine tasting' },
  { icon: 'forest',          label: 'Nature' },
  { icon: 'theater_comedy',  label: 'Cinema' },
  { icon: 'auto_awesome',    label: 'Spirituality' },
  { icon: 'monitoring',      label: 'Finance' },
  { icon: 'sports_tennis',   label: 'Tennis' },
  { icon: 'sailing',         label: 'Sailing' },
  { icon: 'architecture',    label: 'Architecture' },
];

const PRE_DEFINED_MOCK_PHOTOS = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAcylLGXr9l3r8nEotQf0E2ZZowDzYRL1MNVM84el_XcIahUHsaec9jlsmU3VoI_8ZbeaX5MewRERQNjv7oT1CxKHDI0kbCtG_p7oCG5_pDyTmakymQLWvG5ZgvtZoMUawlqSbUKJjGVbHV6LvfHXRXx1QKEs2UcHvhIlKfKDg-iLFiVF7l9u5VWebwl4FeRgLQaWIJ5hNrx_XtjqB60U3Fhp3ClM86gab0h57PPR8TXtX3Whi1gkVfTRXxSWU_tU6KecTcoHOsT7Rt',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=800',
];

const STEP_CONTENT = {
  0: { title: "Welcome Back", subtitle: "Sign in to ignite your spark." },
  1: { title: "Meet Someone Unforgettable", subtitle: "Your journey to a meaningful connection begins here." },
  2: { title: "Secure Verification", subtitle: "We sent a secure code to your number." },
  3: { title: "Protect Your Account", subtitle: "Set a secure password for your new profile." },
  4: { title: "What's Your Name?", subtitle: "This will be displayed on your profile." },
  5: { title: "When Is Your Birthday?", subtitle: "You must be 18 or older to join Spark." },
  6: { title: "Identity & Preferences", subtitle: "Help us find the right matches for you." },
  7: { title: "What Ignites Your Spark?", subtitle: "Select at least 3 passions." },
  8: { title: "Describe Your Vibe", subtitle: "A few words about what makes you unique." },
  9: { title: "Add Your Best Photos", subtitle: "First impressions are everything." },
  10: { title: "Enable Location", subtitle: "Find compatible matches nearby." },
  11: { title: "Never Miss a Spark", subtitle: "Stay updated on new matches and messages." },
  12: { title: "Ready to Spark?", subtitle: "Your profile is beautifully crafted." },
};

/* ─── Reusable UI Components ─────────────────────────────────────────────── */

const FloatingParticles = () => {
  const [particles] = useState(() => Array.from({ length: 20 }).map(() => ({
    size: Math.random() * 4 + 2,
    initialX: `${Math.random() * 100}vw`,
    initialOpacity: Math.random() * 0.3 + 0.1,
    animateX: `${Math.random() * 100}vw`,
    animateOpacity: Math.random() * 0.4 + 0.2,
    duration: Math.random() * 15 + 10,
    delay: Math.random() * 10
  })));

  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute bg-blue-100 rounded-full"
          style={{ width: p.size, height: p.size, filter: 'blur(1px)' }}
          initial={{
            y: "100vh",
            x: p.initialX,
            opacity: p.initialOpacity
          }}
          animate={{
            y: "-10vh",
            x: p.animateX,
            opacity: [0, p.animateOpacity, 0]
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "linear",
            delay: p.delay
          }}
        />
      ))}
    </div>
  );
};

const RomanticBackground = ({ children }) => (
  <div className="relative w-full bg-[#0A0A0A] text-white selection:bg-blue-500/30 font-sans min-h-[120vh] overflow-x-hidden">
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');
      body { font-family: 'Outfit', sans-serif; }
      .material-symbols-outlined {
        font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
      }
      ::-webkit-scrollbar { width: 6px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 10px; }
    `}</style>
    
    {/* Fixed Background Layers to allow native page scrolling */}
    <div className="fixed inset-0 z-0 pointer-events-none">
      <motion.div 
        className="absolute inset-0 origin-center"
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 30, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/90" />
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 via-cyan-500/10 to-transparent mix-blend-overlay" />
      <div className="absolute inset-0 shadow-[inset_0_0_200px_rgba(0,0,0,0.9)]" />
      <FloatingParticles />
    </div>
    
    {/* Scrollable Content */}
    <div className="relative z-10 flex flex-col min-h-[120vh]">
      {children}
    </div>
  </div>
);

const GlassCard = ({ children, className = '' }) => (
  <motion.div 
    initial={{ opacity: 0, y: 40, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 20, scale: 0.95 }}
    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    className={`rounded-[32px] p-6 md:p-8 relative overflow-hidden w-full ${className}`}
    style={{
      background: 'rgba(255,255,255,0.06)',
      backdropFilter: 'blur(32px)',
      WebkitBackdropFilter: 'blur(32px)',
      border: '1px solid rgba(255,255,255,0.15)',
      boxShadow: '0 30px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.2)'
    }}
  >
    {children}
  </motion.div>
);

const HeroHeader = ({ title, subtitle }) => (
  <motion.div 
    key={title}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    className="mb-8 px-2"
  >
    <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight text-white drop-shadow-xl" style={{ fontFamily: "'Outfit', sans-serif" }}>
      {title}
    </h1>
    {subtitle && (
      <p className="text-lg md:text-xl text-white/90 font-medium drop-shadow-lg">
        {subtitle}
      </p>
    )}
  </motion.div>
);

const ProgressDots = ({ current, total }) => (
  <div className="flex justify-center gap-2 mb-8">
    {Array.from({ length: total }).map((_, i) => {
      const isActive = i === current;
      const isPast = i < current;
      return (
        <motion.div
          key={i}
          className={`h-1.5 rounded-full ${isActive ? 'bg-blue-400 shadow-[0_0_12px_rgba(96,165,250,0.9)]' : isPast ? 'bg-white/50' : 'bg-white/20'}`}
          initial={false}
          animate={{ width: isActive ? 32 : 8 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      );
    })}
  </div>
);

const PrimaryButton = ({ children, onClick, disabled, loading, type = 'button', icon }) => (
  <motion.button
    type={type}
    onClick={onClick}
    disabled={disabled || loading}
    whileHover={disabled ? {} : { scale: 1.02, y: -2 }}
    whileTap={disabled ? {} : { scale: 0.98 }}
    className={`w-full py-4 rounded-2xl font-bold text-[17px] flex items-center justify-center gap-2 shadow-2xl transition-all duration-300 relative overflow-hidden
      ${disabled 
        ? 'bg-white/10 text-white/40 border border-white/5 cursor-not-allowed' 
        : 'bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white hover:shadow-[0_8px_40px_rgba(59,130,246,0.5)] border border-white/20'
      }`}
  >
    {loading ? (
      <span className="material-symbols-outlined animate-spin">progress_activity</span>
    ) : (
      <>
        {children}
        {icon && <span className="material-symbols-outlined text-[20px]">{icon}</span>}
      </>
    )}
  </motion.button>
);

const GlassInput = ({ icon, ...props }) => (
  <div className="relative group">
    {icon && (
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 group-focus-within:text-white transition-colors">
        <span className="material-symbols-outlined text-[20px]">{icon}</span>
      </div>
    )}
    <input 
      className={`w-full bg-white/5 border border-white/10 focus:border-white/40 focus:bg-white/10 rounded-2xl py-4 ${icon ? 'pl-12' : 'pl-4'} pr-4 text-white placeholder-white/40 outline-none transition-all duration-300 focus:shadow-[0_0_20px_rgba(255,255,255,0.1)] text-lg font-medium`}
      {...props}
    />
  </div>
);

function CountryDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef(null);

  const selected = COUNTRY_CODES.find(c => c.code === value && (value !== '+1' || c.country === 'US')) || COUNTRY_CODES[0];
  const filtered = search ? COUNTRY_CODES.filter(c => c.country.toLowerCase().includes(search.toLowerCase()) || c.code.includes(search)) : COUNTRY_CODES;

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) { setOpen(false); setSearch(''); } };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative h-full">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full h-full min-h-[58px] flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl px-3 transition-all focus:outline-none text-white focus:border-white/40 focus:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
      >
        <ReactCountryFlag countryCode={selected.country === "UK" ? "GB" : selected.country} svg style={{ width: "24px", height: "24px", borderRadius: "4px" }} />
        <span className="font-semibold text-[16px]">{selected.code}</span>
        <span className="material-symbols-outlined text-[18px] opacity-70">expand_more</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 top-full mt-2 z-50 bg-black/80 backdrop-blur-xl border border-white/15 rounded-2xl shadow-2xl overflow-hidden w-[260px]"
          >
            <div className="p-2 border-b border-white/10">
              <input
                autoFocus
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full bg-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-white/50 outline-none focus:bg-white/20 transition-colors"
              />
            </div>
            <ul className="max-h-56 overflow-y-auto p-1 custom-scrollbar">
              {filtered.map((c, idx) => {
                const isActive = c.code === value && c.country === selected.country;
                return (
                  <li key={`${c.code}-${c.country}-${idx}`}>
                    <button
                      type="button"
                      onClick={() => { onChange(c.code); setOpen(false); setSearch(''); }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors text-left ${isActive ? 'bg-gradient-to-r from-blue-600/80 to-cyan-500/80 font-semibold' : 'hover:bg-white/10'}`}
                    >
                      <ReactCountryFlag countryCode={c.country === "UK" ? "GB" : c.country} svg style={{ width: "20px", height: "20px", borderRadius: "4px" }} />
                      <span className={`flex-1 ${isActive ? 'text-white' : 'text-white/90'}`}>{c.country}</span>
                      <span className="text-white/60 text-xs">{c.code}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Success Outros ──────────────────────────────────────────────────────── */

const LoveSuccessOutro = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-xl"
    >
      <div className="text-center flex flex-col items-center">
        <motion.div
          animate={{ scale: [1, 1.15, 1], filter: ['drop-shadow(0 0 20px rgba(59,130,246,0.4))', 'drop-shadow(0 0 60px rgba(59,130,246,0.8))', 'drop-shadow(0 0 20px rgba(59,130,246,0.4))'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="mb-6"
        >
          <span className="material-symbols-outlined text-[100px] text-blue-500" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}
          className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight"
        >
          You're In
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.8 }}
          className="text-xl text-white/80 font-medium"
        >
          Your story begins now.
        </motion.p>
      </div>
    </motion.div>
  );
};

const WelcomeBackOutro = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-xl"
    >
      <div className="text-center flex flex-col items-center">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="mb-6"
        >
          <span className="material-symbols-outlined text-[80px] text-cyan-400 drop-shadow-[0_0_40px_rgba(34,211,238,0.8)]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}
          className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight"
        >
          Welcome Back
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.8 }}
          className="text-xl text-white/80 font-medium"
        >
          We found your spark.
        </motion.p>
      </div>
    </motion.div>
  );
};

/* ─── Main Component ──────────────────────────────────────────────────────── */

export default function OnboardingFlow({ onComplete, onExit }) {
  const [step, setStep] = useState(0);
  const [successMode, setSuccessMode] = useState(null); // 'login' | 'signup'

  const [countryCode, setCountryCode] = useState('+1');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('female');
  const [preference, setPreference] = useState('male');
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [bio, setBio] = useState('');
  const [photos, setPhotos] = useState([]);
  const [location, setLocation] = useState({ latitude: 37.7749, longitude: -122.4194 });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const triggerError = (msg) => {
    setError(msg);
    setTimeout(() => setError(''), 4000);
  };

  const handleNext = () => {
    setStep((prev) => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleBack = () => {
    setStep((prev) => Math.max(0, prev - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const cleanPhone = phone.replace(/\s+/g, '');
    if (!/^\d{7,14}$/.test(cleanPhone)) return triggerError('Please enter a valid phone number.');
    if (password.length < 6) return triggerError('Please enter your password.');
    
    setLoading(true);
    try {
      const fullPhoneNumber = `${countryCode}${cleanPhone}`;
      await api.login(fullPhoneNumber, password);
      setSuccessMode('login');
    } catch (err) {
      triggerError(err.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    const cleanPhone = phone.replace(/\s+/g, '');
    if (!/^\d{7,14}$/.test(cleanPhone)) return triggerError('Please enter a valid phone number.');
    setLoading(true);
    setTimeout(() => { setLoading(false); handleNext(); }, 1200);
  };

  const handleOtpVerify = async (e) => {
    e.preventDefault();
    if (otp.join('').length !== 6) return triggerError('Please enter the 6-digit verification code.');
    setLoading(true);
    setTimeout(() => { setLoading(false); handleNext(); }, 1200);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) return triggerError('Password must be at least 6 characters');
    setLoading(true);
    try {
      const fullPhoneNumber = `${countryCode}${phone.replace(/\s+/g, '')}`;
      await api.register(fullPhoneNumber, password);
      handleNext();
    } catch (err) {
      triggerError(err.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (name.trim().length < 2) return triggerError('Name must be at least 2 characters.');
    handleNext();
  };

  const handleDobSubmit = (e) => {
    e.preventDefault();
    if (!dob) return triggerError('Please enter your date of birth.');
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    if (age < 18) return triggerError('You must be 18 years or older to join Spark.');
    handleNext();
  };

  const handleGenderSubmit = (e) => { e.preventDefault(); handleNext(); };

  const toggleInterest = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests((prev) => prev.filter((i) => i !== interest));
    } else {
      if (selectedInterests.length >= 10) return triggerError('You can select up to 10 interests.');
      setSelectedInterests((prev) => [...prev, interest]);
    }
  };

  const handleInterestsSubmit = (e) => {
    e.preventDefault();
    if (selectedInterests.length < 3) return triggerError('Please select at least 3 interests.');
    handleNext();
  };

  const handleBioSubmit = (e) => {
    e.preventDefault();
    if (bio.trim().length < 10) return triggerError('Please write a slightly longer bio (at least 10 characters).');
    handleNext();
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotos((prev) => [...prev, reader.result]);
      reader.readAsDataURL(file);
    }
  };

  const selectMockPhoto = (url) => {
    if (photos.includes(url)) setPhotos((prev) => prev.filter((p) => p !== url));
    else setPhotos((prev) => [...prev, url]);
  };

  const handlePhotosSubmit = (e) => {
    e.preventDefault();
    if (photos.length === 0) return triggerError('Please select or upload at least one photo.');
    handleNext();
  };

  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => { setLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }); handleNext(); },
        () => handleNext()
      );
    } else { handleNext(); }
  };

  const requestNotifications = () => {
    if ('Notification' in window) Notification.requestPermission().then(() => handleNext());
    else handleNext();
  };

  const saveCompleteProfile = async () => {
    setLoading(true);
    try {
      const birthDate = new Date(dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;

      const formattedBio = `${bio}\n\nInterests: ${selectedInterests.join(', ')}`;
      await api.saveProfile({ name, age, gender, preference, bio: formattedBio, latitude: location.latitude, longitude: location.longitude });

      for (let i = 0; i < photos.length; i++) {
        const isPrimary = i === 0;
        const img = photos[i];
        if (img.startsWith('data:image')) {
          await api.uploadPhoto(img, isPrimary);
        } else {
          await fetch('http://localhost:5000/api/photos/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
            body: JSON.stringify({ url: img, isPrimary }),
          });
        }
      }
      setSuccessMode('signup');
    } catch (err) {
      triggerError(err.message || 'Failed to save profile. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const startRegistration = () => { setPhone(''); setPassword(''); setStep(1); };
  const startLogin = () => { setPhone(''); setPassword(''); setStep(0); };

  return (
    <RomanticBackground>
      <AnimatePresence>
        {successMode === 'login' && <WelcomeBackOutro onComplete={onComplete} />}
        {successMode === 'signup' && <LoveSuccessOutro onComplete={onComplete} />}
      </AnimatePresence>

      {/* Error Toast */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="fixed top-8 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm"
          >
            <div className="p-4 rounded-2xl bg-red-500/90 backdrop-blur-xl border border-red-400 text-white font-medium text-[15px] flex items-center gap-3 shadow-2xl">
              <span className="material-symbols-outlined text-white">error</span>
              <span>{error}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header - Sticky so it's always at the top even when scrolling */}
      <header className="sticky top-0 pt-8 pb-4 px-6 md:px-10 flex justify-between items-center z-50 shrink-0 bg-gradient-to-b from-black/60 to-transparent">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-white text-[32px] drop-shadow-xl text-blue-500" style={{ fontVariationSettings: "'FILL' 1" }}>map_pin_heart</span>
          <span className="font-bold text-white text-[24px] tracking-wide drop-shadow-lg">Spark</span>
        </div>
        <div className="flex gap-4">
          {step > 0 && step < 12 && (
            <button onClick={handleBack} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-colors backdrop-blur-md">
              <span className="material-symbols-outlined text-white text-[20px]">arrow_back</span>
            </button>
          )}
          <button onClick={onExit} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-colors backdrop-blur-md">
            <span className="material-symbols-outlined text-white text-[20px]">close</span>
          </button>
        </div>
      </header>

      {/* Scrollable layout with intentional luxury spacing to guarantee scrollability on all devices */}
      <div className="w-full px-4 md:px-8 z-40 max-w-xl mx-auto pt-[15vh] md:pt-[20vh] pb-[25vh] md:pb-[30vh]">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              <HeroHeader title={STEP_CONTENT[step]?.title} subtitle={STEP_CONTENT[step]?.subtitle} />

              {step > 0 && step < 12 && <ProgressDots current={step - 1} total={11} />}

              <GlassCard>
                {/* ── STEP 0: Login ── */}
                {step === 0 && (
                  <form onSubmit={handleLoginSubmit} className="space-y-6">
                    <div className="flex gap-3">
                      <div className="w-[120px]"><CountryDropdown value={countryCode} onChange={setCountryCode} /></div>
                      <div className="flex-1"><GlassInput type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="000 000 0000" required /></div>
                    </div>
                    <GlassInput icon="lock" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
                    <PrimaryButton type="submit" loading={loading} icon="arrow_forward">Login</PrimaryButton>
                    <div className="text-center pt-2">
                      <p className="text-[15px] font-medium text-white/70">
                        New to Spark?{' '}
                        <button type="button" onClick={startRegistration} className="font-bold text-white hover:text-blue-400 transition-colors">Create Account</button>
                      </p>
                    </div>
                  </form>
                )}

                {/* ── STEP 1: Phone Registration ── */}
                {step === 1 && (
                  <form onSubmit={handlePhoneSubmit} className="space-y-6">
                    <div className="flex gap-3">
                      <div className="w-[120px]"><CountryDropdown value={countryCode} onChange={setCountryCode} /></div>
                      <div className="flex-1"><GlassInput type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="000 000 0000" required /></div>
                    </div>
                    <p className="text-[13px] font-medium text-white/60 flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px]">lock</span> Verification is private and secure.</p>
                    <PrimaryButton type="submit" loading={loading} icon="arrow_forward">Continue</PrimaryButton>
                    <div className="text-center pt-2">
                      <p className="text-[15px] font-medium text-white/70">
                        Already have an account?{' '}
                        <button type="button" onClick={startLogin} className="font-bold text-white hover:text-blue-400 transition-colors">Log In</button>
                      </p>
                    </div>
                  </form>
                )}

                {/* ── STEP 2: OTP ── */}
                {step === 2 && (
                  <form onSubmit={handleOtpVerify} className="space-y-8">
                    <div className="flex justify-between gap-2">
                      {otp.map((val, idx) => (
                        <input
                          key={idx} id={`otp-${idx}`} type="text" maxLength="1" inputMode="numeric" value={val}
                          onChange={(e) => {
                            const v = e.target.value; const newOtp = [...otp]; newOtp[idx] = v; setOtp(newOtp);
                            if (v && idx < 5) document.getElementById(`otp-${idx + 1}`).focus();
                          }}
                          onKeyDown={(e) => { if (e.key === 'Backspace' && !val && idx > 0) document.getElementById(`otp-${idx - 1}`).focus(); }}
                          className="w-12 h-14 md:w-14 md:h-16 text-center font-bold text-2xl border border-white/20 bg-white/5 focus:bg-white/10 focus:border-white/50 text-white rounded-2xl outline-none transition-all shadow-inner"
                        />
                      ))}
                    </div>
                    <PrimaryButton type="submit" loading={loading} icon="arrow_forward">Verify Code</PrimaryButton>
                    <p className="text-[14px] text-center text-white/70 font-medium">
                      Didn't receive code? <button type="button" className="font-bold text-white hover:text-blue-400 transition-colors">Resend (0:59)</button>
                    </p>
                  </form>
                )}

                {/* ── STEP 3: Password ── */}
                {step === 3 && (
                  <form onSubmit={handlePasswordSubmit} className="space-y-6">
                    <GlassInput icon="lock" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
                    <PrimaryButton type="submit" loading={loading} icon="arrow_forward">Create Account</PrimaryButton>
                  </form>
                )}

                {/* ── STEP 4: Name ── */}
                {step === 4 && (
                  <form onSubmit={handleNameSubmit} className="space-y-6">
                    <GlassInput icon="person" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Sophia" required />
                    <PrimaryButton type="submit" icon="arrow_forward">Continue</PrimaryButton>
                  </form>
                )}

                {/* ── STEP 5: DOB ── */}
                {step === 5 && (
                  <form onSubmit={handleDobSubmit} className="space-y-6">
                    <GlassInput icon="calendar_today" type="date" value={dob} onChange={(e) => setDob(e.target.value)} style={{ colorScheme: 'dark' }} required />
                    <PrimaryButton type="submit" icon="arrow_forward">Continue</PrimaryButton>
                  </form>
                )}

                {/* ── STEP 6: Gender ── */}
                {step === 6 && (
                  <form onSubmit={handleGenderSubmit} className="space-y-8">
                    <div>
                      <label className="block text-[13px] font-bold uppercase text-white/60 mb-3 tracking-wider">I identify as</label>
                      <div className="grid grid-cols-3 gap-3">
                        {['female', 'male', 'non-binary'].map((g) => (
                          <button
                            type="button" key={g} onClick={() => setGender(g)}
                            className={`py-3.5 rounded-2xl border text-sm font-semibold capitalize transition-all duration-300 ${gender === g ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white border-transparent shadow-[0_4px_20px_rgba(59,130,246,0.4)]' : 'bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20'}`}
                          >{g.replace('-', ' ')}</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-[13px] font-bold uppercase text-white/60 mb-3 tracking-wider">Show me</label>
                      <div className="grid grid-cols-3 gap-3">
                        {['female', 'male', 'everyone'].map((p) => (
                          <button
                            type="button" key={p} onClick={() => setPreference(p)}
                            className={`py-3.5 rounded-2xl border text-sm font-semibold capitalize transition-all duration-300 ${preference === p ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white border-transparent shadow-[0_4px_20px_rgba(59,130,246,0.4)]' : 'bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20'}`}
                          >{p === 'everyone' ? 'Everyone' : p + 's'}</button>
                        ))}
                      </div>
                    </div>
                    <PrimaryButton type="submit" icon="arrow_forward">Continue</PrimaryButton>
                  </form>
                )}

                {/* ── STEP 7: Interests ── */}
                {step === 7 && (
                  <div className="space-y-6">
                    <div className="flex flex-wrap gap-2.5">
                      {INTEREST_OPTIONS.map((item) => {
                        const isSelected = selectedInterests.includes(item.label);
                        return (
                          <motion.button
                            type="button" key={item.label} onClick={() => toggleInterest(item.label)}
                            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-[14px] font-semibold transition-all duration-300 ${isSelected ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-[0_4px_15px_rgba(59,130,246,0.4)] border border-transparent' : 'bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/30'}`}
                          >
                            <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                            <span>{item.label}</span>
                          </motion.button>
                        );
                      })}
                    </div>
                    <PrimaryButton onClick={handleInterestsSubmit} disabled={selectedInterests.length < 3} icon="arrow_forward">
                      Continue ({selectedInterests.length}/3)
                    </PrimaryButton>
                  </div>
                )}

                {/* ── STEP 8: Bio ── */}
                {step === 8 && (
                  <form onSubmit={handleBioSubmit} className="space-y-6">
                    <textarea
                      value={bio} onChange={(e) => setBio(e.target.value)}
                      placeholder="e.g. Travel enthusiast, book collector, loves spontaneous weekend getaways..."
                      className="w-full bg-white/5 border border-white/10 focus:border-white/40 focus:bg-white/10 text-white text-lg py-4 px-5 outline-none rounded-2xl transition-all duration-300 h-32 resize-none placeholder-white/40 focus:shadow-[0_0_20px_rgba(255,255,255,0.1)] custom-scrollbar"
                      required
                    />
                    <PrimaryButton type="submit" icon="arrow_forward">Continue</PrimaryButton>
                  </form>
                )}

                {/* ── STEP 9: Photos ── */}
                {step === 9 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-3 gap-3">
                      {PRE_DEFINED_MOCK_PHOTOS.map((url, idx) => {
                        const isSelected = photos.includes(url);
                        return (
                          <motion.div
                            key={idx} onClick={() => selectMockPhoto(url)} whileHover={{ scale: 1.03 }}
                            className={`aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer relative transition-all duration-300 ${isSelected ? 'shadow-[0_0_0_2px_#3b82f6]' : 'opacity-70 hover:opacity-100'}`}
                          >
                            <img src={url} alt="Profile" className="w-full h-full object-cover" />
                            <AnimatePresence>
                              {isSelected && (
                                <motion.div 
                                  initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
                                  className="absolute top-2 right-2 w-6 h-6 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-full flex items-center justify-center shadow-lg"
                                >
                                  <span className="material-symbols-outlined text-[14px] text-white">check</span>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        );
                      })}
                    </div>
                    <div className="border border-dashed border-white/30 rounded-2xl p-4 text-center cursor-pointer hover:border-white/60 hover:bg-white/5 relative transition-all duration-300">
                      <input type="file" accept="image/*" onChange={handlePhotoUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                      <span className="material-symbols-outlined text-white/80 text-2xl mb-1">cloud_upload</span>
                      <p className="text-sm font-semibold text-white/80">Upload Custom Image</p>
                    </div>
                    <PrimaryButton onClick={handlePhotosSubmit} disabled={photos.length === 0} icon="arrow_forward">Continue</PrimaryButton>
                  </div>
                )}

                {/* ── STEP 10: Location ── */}
                {step === 10 && (
                  <div className="space-y-5 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 border border-white/20 mb-2 shadow-2xl backdrop-blur-md">
                      <span className="material-symbols-outlined text-white text-[40px] text-blue-400 drop-shadow-lg">location_on</span>
                    </div>
                    <PrimaryButton onClick={requestLocation}>Allow Location Access</PrimaryButton>
                    <button onClick={handleNext} className="text-white/60 font-semibold py-2 hover:text-white transition-colors text-[15px]">Skip for Now</button>
                  </div>
                )}

                {/* ── STEP 11: Notifications ── */}
                {step === 11 && (
                  <div className="space-y-5 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 border border-white/20 mb-2 shadow-2xl backdrop-blur-md">
                      <span className="material-symbols-outlined text-white text-[40px] text-cyan-400 drop-shadow-lg">notifications</span>
                    </div>
                    <PrimaryButton onClick={requestNotifications}>Enable Notifications</PrimaryButton>
                    <button onClick={handleNext} className="text-white/60 font-semibold py-2 hover:text-white transition-colors text-[15px]">Skip for Now</button>
                  </div>
                )}

                {/* ── STEP 12: Complete ── */}
                {step === 12 && (
                  <div className="space-y-6 text-center">
                    <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center mx-auto border border-white/20 shadow-2xl backdrop-blur-md">
                      <span className="material-symbols-outlined text-white text-[50px] text-blue-500 drop-shadow-lg" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    </div>
                    <div className="font-mono text-[13px] text-left bg-black/40 border border-white/10 rounded-2xl p-5 space-y-3 text-white/90 shadow-inner">
                      <div className="flex justify-between"><span className="text-white/50">Name:</span> <span>{name}</span></div>
                      <div className="flex justify-between"><span className="text-white/50">Interests:</span> <span>{selectedInterests.length} selected</span></div>
                      <div className="flex justify-between"><span className="text-white/50">Location:</span> <span>{location.latitude.toFixed(2)}, {location.longitude.toFixed(2)}</span></div>
                      <div className="flex justify-between"><span className="text-white/50">Status:</span> <span className="text-blue-400 font-bold">Validated</span></div>
                    </div>
                    <PrimaryButton onClick={saveCompleteProfile} loading={loading} icon="auto_awesome">Enter Spark</PrimaryButton>
                  </div>
                )}
              </GlassCard>
            </motion.div>
          </AnimatePresence>
      </div>
    </RomanticBackground>
  );
}