import React from 'react';
import { motion } from 'framer-motion';
import { Check, CheckCheck } from 'lucide-react';
import PropTypes from 'prop-types';

export const TypingIndicator = () => {
  return (
    <div className="flex items-center space-x-1 p-2 bg-gray-100 dark:bg-gray-800 rounded-full w-16 justify-center">
      <motion.div
        className="w-2 h-2 bg-gray-500 rounded-full"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
      />
      <motion.div
        className="w-2 h-2 bg-gray-500 rounded-full"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
      />
      <motion.div
        className="w-2 h-2 bg-gray-500 rounded-full"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
      />
    </div>
  );
};

export const PresenceIndicator = ({ isOnline, lastActive }) => {
  return (
    <div className="flex items-center space-x-2">
      <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
      <span className="text-sm text-gray-500 dark:text-gray-400">
        {isOnline ? 'Online' : `Last active ${lastActive}`}
      </span>
    </div>
  );
};

PresenceIndicator.propTypes = {
  isOnline: PropTypes.bool.isRequired,
  lastActive: PropTypes.string,
};

export const ReadReceipt = ({ status }) => {
  if (status === 'sent') {
    return <Check className="w-4 h-4 text-gray-400" />;
  }
  if (status === 'delivered') {
    return <CheckCheck className="w-4 h-4 text-gray-400" />;
  }
  if (status === 'seen') {
    return <CheckCheck className="w-4 h-4 text-blue-500" />;
  }
  return null;
};

ReadReceipt.propTypes = {
  status: PropTypes.oneOf(['sent', 'delivered', 'seen']).isRequired,
};
