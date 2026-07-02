import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';

const MediaSharing = ({ onUpload }) => {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Simulate upload progress
      setUploading(true);
      let p = 0;
      const interval = setInterval(() => {
        p += 20;
        setProgress(p);
        if (p >= 100) {
          clearInterval(interval);
          setUploading(false);
          setProgress(0);
          onUpload(file);
        }
      }, 200);
    }
  };

  return (
    <div className="relative flex items-center">
      <input 
        type="file" 
        accept="image/*" 
        className="hidden" 
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <button 
        className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        aria-label="Share Media"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </button>

      {uploading && (
        <div className="absolute bottom-12 left-0 bg-white p-2 rounded shadow text-xs flex items-center space-x-2 w-32 border z-10">
          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-red-500 transition-all duration-200" style={{ width: `${progress}%` }}></div>
          </div>
          <span className="font-medium">{progress}%</span>
        </div>
      )}
    </div>
  );
};

MediaSharing.propTypes = {
  onUpload: PropTypes.func.isRequired,
};

export default MediaSharing;
