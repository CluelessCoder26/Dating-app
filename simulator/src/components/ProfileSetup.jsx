import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { Camera, MapPin, Loader2, Sparkles, LogOut, Trash } from 'lucide-react';

export default function ProfileSetup({ userProfile, onProfileSaved, onLogout }) {
  const [name, setName] = useState('');
  const [age, setAge] = useState(22);
  const [gender, setGender] = useState('female');
  const [preference, setPreference] = useState('male');
  const [bio, setBio] = useState('');
  const [latitude, setLatitude] = useState(37.7749); // default SF
  const [longitude, setLongitude] = useState(-122.4194);
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [locationStatus, setLocationStatus] = useState('');

  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name || '');
      setAge(userProfile.age || 22);
      setGender(userProfile.gender || 'female');
      setPreference(userProfile.preference || 'male');
      setBio(userProfile.bio || '');
      setLatitude(userProfile.latitude || 37.7749);
      setLongitude(userProfile.longitude || -122.4194);
      setPhotos(userProfile.photos || []);
    }
  }, [userProfile]);

  const detectLocation = () => {
    setLocationStatus('Detecting...');
    if (!navigator.geolocation) {
      setLocationStatus('Not supported');
      setError('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(parseFloat(position.coords.latitude.toFixed(6)));
        setLongitude(parseFloat(position.coords.longitude.toFixed(6)));
        setLocationStatus('Detected!');
        setTimeout(() => setLocationStatus(''), 2000);
      },
      (err) => {
        console.warn(err);
        setLocationStatus('Failed (using SF)');
        setLatitude(37.7749);
        setLongitude(-122.4194);
      }
    );
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (photos.length >= 6) {
      setError('You can upload a maximum of 6 photos');
      return;
    }

    setPhotoLoading(true);
    setError('');

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64Data = reader.result;
        const res = await api.uploadPhoto(base64Data, photos.length === 0);
        setPhotos([...photos, res.photo]);
      } catch (err) {
        setError(err.message || 'Photo upload failed');
      } finally {
        setPhotoLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePhotoDelete = async (photoId) => {
    setError('');
    try {
      await api.deletePhoto(photoId);
      setPhotos(photos.filter(p => p.id !== photoId));
    } catch (err) {
      setError(err.message || 'Failed to delete photo');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!name || name.trim().length < 2) {
      setError('Name must be at least 2 characters');
      setLoading(false);
      return;
    }

    if (age < 18) {
      setError('You must be 18 years or older to use Ignite');
      setLoading(false);
      return;
    }

    if (photos.length === 0) {
      setError('Please upload at least one profile photo');
      setLoading(false);
      return;
    }

    try {
      const data = await api.saveProfile({
        name,
        age: parseInt(age),
        gender,
        preference,
        bio,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude)
      });
      onProfileSaved(data.profile);
    } catch (err) {
      setError(err.message || 'Failed to save profile details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-setup flex justify-center items-center py-6">
      <div className="glass-panel w-full max-w-2xl p-8 relative overflow-hidden">
        {/* Glowing backgrounds */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-color-pink/10 rounded-full filter blur-3xl pointer-events-none"></div>
        
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Sparkles className="text-color-pink fill-current" size={20} />
            <h2 className="text-xl font-bold text-white">
              {userProfile ? 'Edit Your Profile' : 'Set Up Your Profile'}
            </h2>
          </div>
          <button onClick={onLogout} className="btn-secondary text-xs flex items-center gap-1.5 border-none hover:text-rose-400">
            <LogOut size={13} /> Logout
          </button>
        </div>

        {error && (
          <div className="error-box bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs p-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Photo section */}
          <div>
            <label className="block text-[11px] font-bold text-muted uppercase tracking-wider mb-2">
              Profile Photos ({photos.length}/6)
            </label>
            <p className="text-[10px] text-dim mb-4">First image will be your primary profile photo.</p>

            <div className="grid grid-cols-3 gap-3">
              {photos.map((p, idx) => (
                <div key={p.id} className="photo-slot relative aspect-square rounded-xl overflow-hidden border border-white/10 group">
                  <img src={p.url} alt={`photo-${idx}`} className="w-full h-full object-cover" />
                  {p.isPrimary && (
                    <span className="absolute top-1 left-1 bg-color-pink text-white text-[8px] font-bold px-1.5 py-0.5 rounded-md uppercase">
                      Primary
                    </span>
                  )}
                  <button
                    onClick={() => handlePhotoDelete(p.id)}
                    className="absolute bottom-1 right-1 bg-black/70 hover:bg-rose-600 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash size={12} />
                  </button>
                </div>
              ))}

              {photos.length < 6 && (
                <label className="aspect-square rounded-xl border-2 border-dashed border-white/20 hover:border-color-pink hover:bg-white/5 flex flex-col items-center justify-center cursor-pointer transition-all">
                  {photoLoading ? (
                    <Loader2 className="animate-spin text-color-pink" size={20} />
                  ) : (
                    <>
                      <Camera size={20} className="text-muted" />
                      <span className="text-[10px] text-muted mt-1">Upload</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    disabled={photoLoading}
                  />
                </label>
              )}
            </div>
          </div>

          {/* Details section */}
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-muted uppercase tracking-wider mb-1">
                Display Name
              </label>
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-input"
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-muted uppercase tracking-wider mb-1">
                  Age
                </label>
                <input
                  type="number"
                  min="18"
                  max="100"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="text-input"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-muted uppercase tracking-wider mb-1">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="text-input"
                  disabled={loading}
                >
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="non-binary">Non-Binary</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-muted uppercase tracking-wider mb-1">
                Show Me
              </label>
              <select
                value={preference}
                onChange={(e) => setPreference(e.target.value)}
                className="text-input"
                disabled={loading}
              >
                <option value="male">Men</option>
                <option value="female">Women</option>
                <option value="everyone">Everyone</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-muted uppercase tracking-wider mb-1">
                Bio
              </label>
              <textarea
                placeholder="Tell us about yourself..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="text-input resize-none"
                disabled={loading}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-[11px] font-bold text-muted uppercase tracking-wider">
                  Location (GPS)
                </label>
                <button
                  type="button"
                  onClick={detectLocation}
                  className="text-[10px] text-color-pink font-semibold hover:underline flex items-center gap-1"
                >
                  <MapPin size={10} /> {locationStatus || 'Use current location'}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  step="0.0001"
                  placeholder="Latitude"
                  value={latitude}
                  onChange={(e) => setLatitude(parseFloat(e.target.value))}
                  className="text-input font-mono text-[11px]"
                  disabled={loading}
                />
                <input
                  type="number"
                  step="0.0001"
                  placeholder="Longitude"
                  value={longitude}
                  onChange={(e) => setLongitude(parseFloat(e.target.value))}
                  className="text-input font-mono text-[11px]"
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 rounded-xl flex items-center justify-center font-bold text-xs tracking-wider uppercase mt-6 relative"
            >
              {loading ? (
                <span className="spinner"></span>
              ) : (
                'Save Profile'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
