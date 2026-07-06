import CountrySelector from './CountrySelector.jsx';
import { formatPhoneInput, stripPhoneDigits } from '../../utils/phone.js';

export default function PhoneInput({
  country,
  onCountryChange,
  value,
  onChange,
  placeholder = 'Mobile Number',
  required = false,
  id,
}) {
  const handleChange = (e) => {
    const digits = stripPhoneDigits(e.target.value);
    onChange(formatPhoneInput(digits, country));
  };

  return (
    <div className="flex gap-3">
      <div className="w-[130px] shrink-0">
        <CountrySelector country={country} onChange={onCountryChange} />
      </div>
      <div className="flex-1 relative">
        <input
          id={id}
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
          className="w-full bg-white/5 border border-white/10 focus:border-white/40 focus:bg-white/10 rounded-2xl py-4 pl-4 pr-4 text-white placeholder-white/40 outline-none transition-all duration-300 focus:shadow-[0_0_20px_rgba(255,255,255,0.1)] text-lg font-medium min-h-[58px]"
        />
      </div>
    </div>
  );
}
