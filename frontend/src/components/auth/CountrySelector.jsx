import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactCountryFlag from 'react-country-flag';
import { searchCountries } from '../../data/phoneCountries.js';
import { persistPhoneCountry } from '../../utils/phone.js';

export default function CountrySelector({ country, onChange, className = '' }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef(null);

  const filtered = searchCountries(search);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (c) => {
    persistPhoneCountry(c);
    onChange(c);
    setOpen(false);
    setSearch('');
  };

  return (
    <div ref={ref} className={`relative h-full ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={`Country code ${country.dialCode}`}
        aria-expanded={open}
        className="w-full h-full min-h-[58px] flex items-center justify-center gap-1.5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl px-2.5 transition-all focus:outline-none text-white focus:border-white/40 focus:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
      >
        <ReactCountryFlag
          countryCode={country.iso2}
          svg
          style={{ width: '24px', height: '24px', borderRadius: '4px' }}
        />
        <span className="font-semibold text-[15px]">{country.dialCode}</span>
        <span className="material-symbols-outlined text-[18px] opacity-70">expand_more</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 top-full mt-2 z-50 bg-black/80 backdrop-blur-xl border border-white/15 rounded-2xl shadow-2xl overflow-hidden w-[min(300px,calc(100vw-2rem))]"
          >
            <div className="p-2 border-b border-white/10">
              <input
                autoFocus
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search country or code…"
                className="w-full bg-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-white/50 outline-none focus:bg-white/20 transition-colors"
              />
            </div>
            <ul className="max-h-56 overflow-y-auto p-1 custom-scrollbar" role="listbox">
              {filtered.length === 0 ? (
                <li className="px-3 py-4 text-sm text-white/50 text-center">No countries found</li>
              ) : (
                filtered.map((c) => {
                  const isActive = c.iso2 === country.iso2;
                  return (
                    <li key={c.iso2} role="option" aria-selected={isActive}>
                      <button
                        type="button"
                        onClick={() => handleSelect(c)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors text-left ${
                          isActive
                            ? 'bg-gradient-to-r from-blue-600/80 to-cyan-500/80 font-semibold'
                            : 'hover:bg-white/10'
                        }`}
                      >
                        <ReactCountryFlag
                          countryCode={c.iso2}
                          svg
                          style={{ width: '20px', height: '20px', borderRadius: '4px' }}
                        />
                        <span className={`flex-1 truncate ${isActive ? 'text-white' : 'text-white/90'}`}>
                          {c.name}
                        </span>
                        <span className="text-white/60 text-xs shrink-0">{c.dialCode}</span>
                      </button>
                    </li>
                  );
                })
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
