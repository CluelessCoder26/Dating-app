import React, { useState } from 'react';

const HeartTab = ({ myProfile, onOpenChat }) => {
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebratingMatch, setCelebratingMatch] = useState(null);

  // Mock match requests (people who liked the user)
  const [requests, setRequests] = useState([
    {
      id: 1,
      name: 'Elena',
      age: 28,
      photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDdmBmAMxAxrQHgB4wRWcTUZpU6WIgv3MFa0_dyuFM49y4CgZV7f3drYWM3qNoHIVb1_sR0LqW15xz7bpZ9jHdNMXBPAqElDxxS9PdGtFx1YmH0XtSarSaRaqN556kJKducmr73brqKvA5H5nLuxIMna6ZhPyyz5VQWLMNjJnIA_Q5w_sE5NFpGCsIJ7iuyksayKgJnGCMUuapSqsFY2faFrOGnKYg0Jh00Rz2TYVA_w9l6oTvn0xnex4FfbYrmHBDZ7N7JJeeYgZko',
      blur: false,
    },
    {
      id: 2,
      name: 'Sarah',
      age: 26,
      photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=800',
      blur: true, // Requires platinum to see
    },
    {
      id: 3,
      name: 'Jessica',
      age: 29,
      photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800',
      blur: true,
    },
    {
      id: 4,
      name: 'Emily',
      age: 25,
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
      blur: true,
    }
  ]);

  const handleAcceptRequest = (request) => {
    setCelebratingMatch(request);
    setShowCelebration(true);
  };

  const closeCelebration = () => {
    setRequests(requests.filter(r => r.id !== celebratingMatch.id));
    setShowCelebration(false);
    setCelebratingMatch(null);
  };

  const handleSendMessage = () => {
    const matchProfile = {
      userId: celebratingMatch.id.toString(),
      name: celebratingMatch.name,
      photos: [{ url: celebratingMatch.photo }],
      bio: `Loves hiking and photography\n\nInterests: Travel, Art`
    };
    onOpenChat(celebratingMatch.id.toString(), matchProfile);
    closeCelebration();
  };

  if (showCelebration && celebratingMatch) {
    // Render the Match Celebration design
    return (
      <main className="relative flex-grow flex flex-col items-center justify-center px-6 text-center pb-24 overflow-hidden h-full w-full bg-background selection:bg-primary-container selection:text-on-primary-container">
        {/* WebGL Background simulation */}
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary/10 via-background to-tertiary/10"></div>
        
        {/* Content Overlay */}
        <div className="relative z-20 flex flex-col items-center w-full max-w-lg mt-12 fade-in">
          <div className="mb-8">
            <h1 className="font-display-lg text-5xl md:text-6xl text-primary mb-4 leading-tight pop-in">It's a Spark!</h1>
            <p className="font-body-lg text-on-surface-variant max-w-xs mx-auto">You and {celebratingMatch.name} have found a meaningful connection.</p>
          </div>
          
          <div className="relative flex items-center justify-center gap-12 md:gap-24 my-8 w-full">
            {/* User Avatar */}
            <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-[0_0_30px_rgba(0,114,229,0.3)] overflow-hidden floating">
              <img 
                alt="Your Profile" 
                className="w-full h-full object-cover" 
                src={myProfile?.photos?.[0]?.url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800"} 
              />
            </div>
            {/* Match Avatar */}
            <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-[0_0_30px_rgba(112,46,222,0.3)] overflow-hidden floating" style={{ animationDelay: '0.5s' }}>
              <img 
                alt={`${celebratingMatch.name}'s Profile`} 
                className="w-full h-full object-cover" 
                src={celebratingMatch.photo} 
              />
            </div>
            
            {/* Connection Sparkle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="w-4 h-4 rounded-full bg-primary spark-pulse flex items-center justify-center">
                 <span className="material-symbols-outlined text-[14px] text-white" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col gap-4 w-full max-w-xs mt-8">
            <button 
              onClick={handleSendMessage}
              className="w-full py-4 px-8 bg-gradient-to-r from-primary to-primary-container text-on-primary font-title-md rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95"
            >
              Send a Message
            </button>
            <button 
              onClick={closeCelebration}
              className="w-full py-4 px-8 bg-transparent text-primary font-title-md rounded-full border-2 border-outline-variant hover:bg-surface-container-low transition-all active:scale-95"
            >
              Keep Discovering
            </button>
          </div>
        </div>
      </main>
    );
  }

  // Render Match Requests
  return (
    <main className="flex-grow pt-24 pb-28 px-4 md:px-8 w-full max-w-4xl mx-auto overflow-y-auto hide-scrollbar selection:bg-primary-container selection:text-on-primary-container h-full">
      <section className="mb-stack-lg text-center fade-in">
        <h1 className="font-headline-lg text-on-surface mb-2">Match Requests</h1>
        <p className="font-body-md text-secondary">See who has already liked you. Tap to spark a connection!</p>
      </section>

      {requests.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-12 fade-in">
          <div className="w-20 h-20 bg-surface-container-high rounded-full flex items-center justify-center mb-4">
             <span className="material-symbols-outlined text-outline text-4xl">favorite_border</span>
          </div>
          <p className="font-body-md text-on-surface-variant text-center max-w-sm">
            You don't have any pending match requests right now. Keep exploring to find your spark!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pb-8 fade-in">
          {requests.map((req) => (
            <div key={req.id} className="relative group rounded-2xl overflow-hidden aspect-[3/4] pearl-card shadow-sm border border-outline-variant/20 hover:shadow-md transition-all">
              <img 
                src={req.photo} 
                alt="Match Request" 
                className={`w-full h-full object-cover transition-all duration-500 ${req.blur ? 'blur-xl scale-110' : 'group-hover:scale-105'}`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent flex flex-col justify-end p-4">
                {req.blur ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-3 text-white">
                      <span className="material-symbols-outlined">lock</span>
                    </div>
                    <p className="font-title-md text-white drop-shadow-md">Hidden Spark</p>
                    <p className="font-label-sm text-white/80 mt-1">Upgrade to Platinum to reveal</p>
                  </div>
                ) : (
                  <>
                    <h3 className="font-title-md text-white text-lg drop-shadow-md">{req.name}, {req.age}</h3>
                    <div className="flex gap-2 mt-3 w-full">
                      <button 
                        className="flex-1 bg-surface/20 backdrop-blur-md text-white py-2 rounded-xl flex justify-center items-center hover:bg-surface/40 transition-colors active:scale-95"
                      >
                        <span className="material-symbols-outlined text-[20px]">close</span>
                      </button>
                      <button 
                        onClick={() => handleAcceptRequest(req)}
                        className="flex-1 bg-primary text-on-primary py-2 rounded-xl flex justify-center items-center shadow-[0_4px_12px_rgba(0,114,229,0.3)] hover:shadow-[0_6px_16px_rgba(0,114,229,0.4)] transition-all active:scale-95"
                      >
                        <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default HeartTab;
