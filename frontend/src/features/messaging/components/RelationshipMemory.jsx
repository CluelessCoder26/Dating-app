import React from 'react';
import PropTypes from 'prop-types';
import { Clock, Heart, Star } from 'lucide-react';

export const RelationshipMemory = ({ sharedMoments, timelineEvents, mutualInterests }) => {
  return (
    <div className="bg-white dark:bg-gray-900 border border-pink-100 dark:border-pink-900/30 rounded-2xl p-5 shadow-sm space-y-6">
      <h3 className="text-xl font-bold flex items-center gap-2 text-pink-600 dark:text-pink-400">
        <Heart className="w-6 h-6 fill-current" />
        Relationship Memory
      </h3>

      {mutualInterests?.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Mutual Interests</h4>
          <div className="flex flex-wrap gap-2">
            {mutualInterests.map((interest, idx) => (
              <span key={idx} className="px-3 py-1 bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300 text-xs rounded-full font-medium">
                {interest}
              </span>
            ))}
          </div>
        </div>
      )}

      {sharedMoments?.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Shared Moments</h4>
          <div className="grid grid-cols-2 gap-3">
            {sharedMoments.map((moment, idx) => (
              <div key={idx} className="relative group rounded-xl overflow-hidden aspect-square bg-gray-100 dark:bg-gray-800">
                {moment.imageUrl ? (
                  <img src={moment.imageUrl} alt={moment.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Star className="w-8 h-8 text-gray-300" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-end p-2 transition-opacity">
                  <span className="text-white text-xs font-medium">{moment.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {timelineEvents?.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Timeline</h4>
          <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-pink-200 before:to-transparent">
            {timelineEvents.map((event, idx) => (
              <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-5 h-5 rounded-full border border-white bg-pink-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2" />
                <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-lg border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <h5 className="font-semibold text-sm">{event.title}</h5>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {event.date}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

RelationshipMemory.propTypes = {
  sharedMoments: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
    imageUrl: PropTypes.string
  })),
  timelineEvents: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
    date: PropTypes.string,
    description: PropTypes.string
  })),
  mutualInterests: PropTypes.arrayOf(PropTypes.string)
};
