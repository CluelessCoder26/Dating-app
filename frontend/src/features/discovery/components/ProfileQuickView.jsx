import React from 'react';
import PropTypes from 'prop-types';
import { X, Heart, Coffee, Music, Plane, Camera, Book, Dumbbell } from 'lucide-react';

const iconMap = {
  coffee: Coffee,
  music: Music,
  travel: Plane,
  photography: Camera,
  reading: Book,
  fitness: Dumbbell,
};

export const ProfileQuickView = ({ profile, onClose }) => {
  return (
    <div className="h-full flex flex-col overflow-y-auto custom-scrollbar p-6 relative">
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      >
        <X size={18} />
      </button>

      <div className="mb-6 pr-10">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          {profile.name}, {profile.age}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {profile.pronouns && <span className="mr-2 capitalize">{profile.pronouns}</span>}
          {profile.zodiac && <span>{profile.zodiac}</span>}
        </p>
      </div>

      <div className="mb-6">
        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">About Me</h4>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
          {profile.bio || "This user hasn't written a bio yet, but they seem interesting!"}
        </p>
      </div>

      <div className="mb-6">
        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Interests</h4>
        <div className="flex flex-wrap gap-2">
          {profile.interests && profile.interests.map((interest, idx) => {
            const Icon = iconMap[interest.icon] || Heart;
            return (
              <span 
                key={idx} 
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium border border-primary-100 dark:border-primary-800"
              >
                <Icon size={14} />
                {interest.label}
              </span>
            );
          })}
          {(!profile.interests || profile.interests.length === 0) && (
            <span className="text-sm text-gray-500 italic">No interests specified</span>
          )}
        </div>
      </div>
      
      <div className="mb-8">
        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Lifestyle</h4>
        <div className="grid grid-cols-2 gap-4">
          {profile.lifestyle && profile.lifestyle.map((item, idx) => (
            <div key={idx} className="flex flex-col">
              <span className="text-xs text-gray-500 dark:text-gray-400">{item.category}</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{item.value}</span>
            </div>
          ))}
          {(!profile.lifestyle || profile.lifestyle.length === 0) && (
            <span className="text-sm text-gray-500 italic col-span-2">No lifestyle details provided</span>
          )}
        </div>
      </div>
      
      <div className="h-12"></div>
    </div>
  );
};

ProfileQuickView.propTypes = {
  profile: PropTypes.shape({
    name: PropTypes.string.isRequired,
    age: PropTypes.number.isRequired,
    pronouns: PropTypes.string,
    zodiac: PropTypes.string,
    bio: PropTypes.string,
    interests: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      icon: PropTypes.string
    })),
    lifestyle: PropTypes.arrayOf(PropTypes.shape({
      category: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    }))
  }).isRequired,
  onClose: PropTypes.func.isRequired
};
