import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ShieldCheck, MapPin, Briefcase, GraduationCap, Star } from 'lucide-react';
import { Blurhash } from 'react-blurhash';
import { ProfileQuickView } from './ProfileQuickView';

export const DiscoveryCard = ({ profile, isActive }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);

  if (!profile) return null;

  return (
    <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-xl bg-gray-900 group">
      {/* Background Image with Blurhash Placeholder */}
      <div className="absolute inset-0 z-0">
        {!imageLoaded && profile.blurhash && (
          <Blurhash
            hash={profile.blurhash}
            width="100%"
            height="100%"
            resolutionX={32}
            resolutionY={32}
            punch={1}
            className="absolute inset-0 object-cover"
          />
        )}
        <img
          src={profile.primaryPhoto}
          alt={profile.name}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
        />
        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/0 to-black/80" />
      </div>

      {/* Trust Badges */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        {profile.isVerified && (
          <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-2 py-1 rounded-full text-white text-xs font-medium">
            <ShieldCheck size={14} className="text-blue-400" />
            Verified
          </div>
        )}
        {profile.isPremium && (
          <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-2 py-1 rounded-full text-white text-xs font-medium">
            <Star size={14} className="text-yellow-400" fill="currentColor" />
            Premium
          </div>
        )}
      </div>

      {/* Profile Info (Bottom) */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
        <div className="flex items-end justify-between mb-2">
          <div>
            <h2 className="text-3xl font-bold text-white flex items-center gap-2 drop-shadow-md">
              {profile.name}, {profile.age}
            </h2>
            <div className="flex items-center gap-4 mt-2 text-gray-200 text-sm font-medium drop-shadow-md">
              <span className="flex items-center gap-1">
                <MapPin size={16} />
                {profile.distance} miles away
              </span>
            </div>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setShowQuickView(!showQuickView);
            }}
            className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors"
          >
            <span className="sr-only">Toggle info</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {showQuickView ? <path d="M19 12H5"/> : <path d="M12 5v14M5 12h14"/>}
            </svg>
          </button>
        </div>

        <div className="flex flex-col gap-1 mt-3">
          {profile.occupation && (
            <div className="flex items-center gap-2 text-gray-300 text-sm font-medium drop-shadow-md">
              <Briefcase size={14} />
              <span>{profile.occupation}</span>
            </div>
          )}
          {profile.education && (
            <div className="flex items-center gap-2 text-gray-300 text-sm font-medium drop-shadow-md">
              <GraduationCap size={14} />
              <span>{profile.education}</span>
            </div>
          )}
        </div>
      </div>

      {/* Expandable Quick View */}
      {showQuickView && (
        <div 
          className="absolute inset-x-0 bottom-0 top-1/2 z-20 bg-white dark:bg-gray-900 rounded-t-3xl shadow-2xl transition-transform transform translate-y-0"
          onClick={(e) => e.stopPropagation()}
        >
          <ProfileQuickView profile={profile} onClose={() => setShowQuickView(false)} />
        </div>
      )}
    </div>
  );
};

DiscoveryCard.propTypes = {
  profile: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    age: PropTypes.number.isRequired,
    distance: PropTypes.number,
    primaryPhoto: PropTypes.string.isRequired,
    blurhash: PropTypes.string,
    isVerified: PropTypes.bool,
    isPremium: PropTypes.bool,
    occupation: PropTypes.string,
    education: PropTypes.string,
  }),
  isActive: PropTypes.bool,
};
