import React, { useState } from 'react';
import { ShieldCheck, UserCheck, Code, Eye, FileText, Image as ImageIcon } from 'lucide-react';

export default function Phase1() {
  const [step, setStep] = useState(1); // 1: Auth, 2: Details, 3: Success
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('female');
  const [preference, setPreference] = useState('male');
  const [bio, setBio] = useState('');
  const [photo, setPhoto] = useState(null);
  
  // Simulation states
  const [validationErrors, setValidationErrors] = useState({});
  const [cloudinaryStats, setCloudinaryStats] = useState(null);
  const [viewMode, setViewMode] = useState('zod'); // 'zod' or 'postgres'
  const [isVerifying, setIsVerifying] = useState(false);

  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    if (!/^\+?[1-9]\d{9,14}$/.test(phone)) {
      setValidationErrors({ phone: 'Invalid phone format. Must be +[CountryCode][Number] (e.g., +15550199)' });
      return;
    }
    setValidationErrors({});
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setStep(2);
    }, 1200);
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (name.length < 2) errors.name = 'Name must be at least 2 characters';
    if (!age || parseInt(age) < 18) errors.age = 'Must be 18 years or older to onboard';
    if (bio.length < 10) errors.bio = 'Bio must be at least 10 characters to build a rich profile';
    if (!photo) errors.photo = 'Profile photo is required';

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors({});
    setStep(3);
  };

  const simulatePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(URL.createObjectURL(file));
      setCloudinaryStats({
        originalSize: (file.size / 1024).toFixed(1) + ' KB',
        optimizedSize: (file.size / 1024 * 0.22).toFixed(1) + ' KB (WebP)',
        compressionRatio: '78% Saved',
        dimensions: '800x800 px (Auto face-cropped)',
        facialCoordinates: 'x: 232, y: 140, w: 180, h: 180 (Verified Centered)'
      });
    }
  };

  const resetForm = () => {
    setStep(1);
    setPhone('');
    setOtp('');
    setName('');
    setAge('');
    setBio('');
    setPhoto(null);
    setCloudinaryStats(null);
    setValidationErrors({});
  };

  const getZodSchema = () => {
    return `// backend/validators/auth.js
import { z } from 'zod';

export const PhoneAuthSchema = z.object({
  phone: z.string().regex(/^\\+?[1-9]\\d{9,14}$/, 'Invalid phone number format')
});

export const ProfileSetupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  age: z.number().min(18, 'Must be 18 years or older'),
  gender: z.enum(['male', 'female', 'non-binary']),
  preference: z.enum(['male', 'female', 'everyone']),
  bio: z.string().min(10).max(500, 'Bio must be between 10-500 chars'),
  photoUrl: z.string().url('Invalid photo CDN reference')
});`;
  };

  const getPostgresSchema = () => {
    return `-- db/migrations/init.sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone VARCHAR(20) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(50) NOT NULL,
  age INT NOT NULL,
  gender VARCHAR(20) NOT NULL,
  preference VARCHAR(20) NOT NULL,
  bio TEXT,
  profile_photo_id UUID,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  cloudinary_url VARCHAR(255) NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  crop_data JSONB,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);`;
  };

  return (
    <div className="split-grid animate-fade-in">
      
      {/* Interactive Simulator Side */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <span className="text-xs font-bold uppercase" style={{ color: 'var(--color-pink)', background: 'rgba(255, 45, 122, 0.15)', padding: '4px 12px', borderRadius: '20px', display: 'inline-block', marginBottom: '16px' }}>
            Phase 1 Simulator
          </span>
          <h2 className="text-2xl font-bold" style={{ margin: '0 0 8px 0' }}>Onboarding & Phone Auth</h2>
          <p className="text-xs text-muted" style={{ margin: '0 0 24px 0' }}>
            Experience the secure JWT onboarding process. Input data to trigger validation checks and optimize assets.
          </p>

          {step === 1 && (
            <form onSubmit={handlePhoneSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label className="text-xs font-bold uppercase text-muted">Phone Number</label>
                <input
                  type="text"
                  placeholder="+15550199"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input-field"
                />
                {validationErrors.phone && (
                  <p className="text-xs" style={{ color: 'var(--color-rose)', margin: '4px 0 0 0' }}>{validationErrors.phone}</p>
                )}
              </div>
              <div className="form-group">
                <label className="text-xs font-bold uppercase text-muted">Verification Code (Simulated)</label>
                <input
                  type="text"
                  placeholder="Sent via Firebase OTP"
                  value="123456"
                  disabled
                  className="input-field"
                  style={{ opacity: 0.6, cursor: 'not-allowed' }}
                />
              </div>
              <button type="submit" disabled={isVerifying} className="btn-primary" style={{ justifyContent: 'center' }}>
                {isVerifying ? 'Verifying OTP & Issuing JWT...' : 'Send Verification OTP'}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-row">
                <div className="form-group">
                  <label className="text-xs font-bold uppercase text-muted">First Name</label>
                  <input
                    type="text"
                    placeholder="Sophia"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field"
                  />
                  {validationErrors.name && (
                    <p className="text-xs" style={{ color: 'var(--color-rose)', margin: '2px 0 0 0' }}>{validationErrors.name}</p>
                  )}
                </div>
                <div className="form-group">
                  <label className="text-xs font-bold uppercase text-muted">Age</label>
                  <input
                    type="number"
                    placeholder="24"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="input-field"
                  />
                  {validationErrors.age && (
                    <p className="text-xs" style={{ color: 'var(--color-rose)', margin: '2px 0 0 0' }}>{validationErrors.age}</p>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="text-xs font-bold uppercase text-muted">Gender</label>
                  <select 
                    value={gender} 
                    onChange={(e) => setGender(e.target.value)}
                    className="input-field"
                  >
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="non-binary">Non-Binary</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="text-xs font-bold uppercase text-muted">Show Me</label>
                  <select 
                    value={preference} 
                    onChange={(e) => setPreference(e.target.value)}
                    className="input-field"
                  >
                    <option value="male">Men</option>
                    <option value="female">Women</option>
                    <option value="everyone">Everyone</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="text-xs font-bold uppercase text-muted">Bio</label>
                <textarea
                  placeholder="Tell us about yourself..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="input-field"
                  style={{ height: '70px', resize: 'none' }}
                />
                {validationErrors.bio && (
                  <p className="text-xs" style={{ color: 'var(--color-rose)', margin: '2px 0 0 0' }}>{validationErrors.bio}</p>
                )}
              </div>

              <div className="form-group">
                <label className="text-xs font-bold uppercase text-muted">Upload Profile Photo</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <label className="btn-secondary" style={{ cursor: 'pointer' }}>
                    <ImageIcon size={14} /> Choose Photo
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={simulatePhotoUpload} />
                  </label>
                  {photo && <img src={photo} alt="Avatar Preview" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--color-pink)' }} />}
                </div>
                {validationErrors.photo && (
                  <p className="text-xs" style={{ color: 'var(--color-rose)', margin: '4px 0 0 0' }}>{validationErrors.photo}</p>
                )}
              </div>

              {cloudinaryStats && (
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-glass)', borderRadius: '8px', padding: '12px', fontSize: '11px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span className="font-bold text-gradient-blue" style={{ marginBottom: '2px' }}>Cloudinary CDN Auto-Compression:</span>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', color: 'var(--text-muted)' }}>
                    <div>Original Size: <span className="font-mono text-white">{cloudinaryStats.originalSize}</span></div>
                    <div>Compressed Size: <span className="font-mono text-white" style={{ color: 'var(--color-emerald)' }}>{cloudinaryStats.optimizedSize}</span></div>
                    <div>Dimensions: <span className="font-mono text-white">{cloudinaryStats.dimensions}</span></div>
                    <div>Face Coordinates: <span className="font-mono text-white">{cloudinaryStats.facialCoordinates}</span></div>
                  </div>
                </div>
              )}

              <button type="submit" className="btn-primary" style={{ justifyContent: 'center' }}>
                Submit Profile & Save DB
              </button>
            </form>
          )}

          {step === 3 && (
            <div style={{ textAlign: 'center', padding: '24px 0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="pulse-glow-pink" style={{ width: '56px', height: '56px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid var(--color-emerald)', color: 'var(--color-emerald)', borderRadius: '50%', display: 'flex', alignItems: 'center', justify: 'center', alignSelf: 'center', justifyContent: 'center' }}>
                <UserCheck size={28} />
              </div>
              <h3 className="text-xl font-bold" style={{ color: 'var(--color-emerald)', margin: 0 }}>Profile Onboarded Successfully!</h3>
              <p className="text-xs text-muted" style={{ margin: 0 }}>
                Your profile was written to Postgres tables (`users`, `profiles`, `photos`). A signed JWT token was issued for secure requests.
              </p>
              
              <div className="font-mono text-xs text-gradient-blue" style={{ background: 'rgba(0, 0, 0, 0.3)', border: '1px solid var(--border-glass)', borderRadius: '8px', padding: '16px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div><span className="text-muted">Header:</span> {"{ \"alg\": \"HS256\", \"typ\": \"JWT\" }"}</div>
                <div><span className="text-muted">Payload:</span> {"{ \"userId\": \"9f6b4d32-cdb2...\", \"phone\": \"" + phone + "\", \"roles\": [\"user\"] }"}</div>
                <div><span className="text-muted">Signature:</span> HS256(Header + Payload, SECRET_KEY) <span style={{ color: 'var(--color-emerald)' }}>[Verified]</span></div>
              </div>

              <button onClick={resetForm} className="btn-secondary" style={{ justifyContent: 'center' }}>
                Reset & Try Again
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Code / Architecture Details Side */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '12px' }}>
            <h3 className="font-bold text-sm" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Code size={16} className="text-color-pink" />
              Technical Code Spec
            </h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={() => setViewMode('zod')}
                className={`btn-secondary`}
                style={{
                  padding: '4px 10px',
                  fontSize: '11px',
                  borderColor: viewMode === 'zod' ? 'var(--color-pink)' : '',
                  color: viewMode === 'zod' ? 'var(--color-pink)' : ''
                }}
              >
                Zod Schema
              </button>
              <button 
                onClick={() => setViewMode('postgres')}
                className={`btn-secondary`}
                style={{
                  padding: '4px 10px',
                  fontSize: '11px',
                  borderColor: viewMode === 'postgres' ? 'var(--color-pink)' : '',
                  color: viewMode === 'postgres' ? 'var(--color-pink)' : ''
                }}
              >
                Postgres SQL
              </button>
            </div>
          </div>

          <div className="code-container" style={{ height: '300px' }}>
            <pre className="m-0" style={{ margin: 0, whiteSpace: 'pre', fontSize: '10px', lineHeight: '1.4' }}>
              {viewMode === 'zod' ? getZodSchema() : getPostgresSchema()}
            </pre>
          </div>
        </div>

        <div style={{ marginTop: '24px', borderTop: '1px solid var(--border-glass)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11px', color: 'var(--text-muted)' }}>
          <h4 className="font-bold text-white" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={14} style={{ color: 'var(--color-emerald)' }} />
            Backend Verification Workflow
          </h4>
          <p style={{ margin: 0 }}>1. **Firebase Auth** verifies phone number via OTP on device, returns a Firebase Token.</p>
          <p style={{ margin: 0 }}>2. Client sends token to Node.js backend. Backend calls **Firebase Admin SDK** to verify signature.</p>
          <p style={{ margin: 0 }}>3. Backend checks DB. If user does not exist, it inserts records in `users` and `profiles` tables.</p>
          <p style={{ margin: 0 }}>4. Photos are passed to **Cloudinary SDK**, which automatically center-crops around faces (`c_thumb,g_face`) and compresses to size.</p>
        </div>
      </div>

    </div>
  );
}
