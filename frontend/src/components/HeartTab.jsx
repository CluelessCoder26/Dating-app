import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../api';

function formatLikedAt(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now - d;
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString();
}

const HeartTab = ({ myProfile, onOpenChat }) => {
  const [likes, setLikes] = useState([]);
  const [canSeeProfiles, setCanSeeProfiles] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [emptyMessage, setEmptyMessage] = useState('');
  const [actionId, setActionId] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebratingMatch, setCelebratingMatch] = useState(null);

  const loadLikes = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const data = await api.getLikesReceived(1, 50);
      setLikes(data.likes || []);
      setCanSeeProfiles(data.canSeeProfiles !== false);
      setEmptyMessage(data.message || '');
    } catch (err) {
      setError(err.message || 'Failed to load likes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLikes();
  }, [loadLikes]);

  useEffect(() => {
    const socket = api.getSocket();
    if (!socket) return;

    const onLikeReceived = (payload) => {
      setLikes((prev) => {
        if (prev.some((l) => l.likerId === payload.likerId)) return prev;
        return [payload, ...prev];
      });
    };

    socket.on('like_received', onLikeReceived);
    return () => socket.off('like_received', onLikeReceived);
  }, []);

  const handleAccept = async (like) => {
    setActionId(like.likerId);
    try {
      const result = await api.acceptLike(like.likerId);
      setLikes((prev) => prev.filter((l) => l.likerId !== like.likerId));

      if (result.isMatch) {
        setCelebratingMatch({
          ...like,
          matchId: result.match?.id,
        });
        setShowCelebration(true);
      }
    } catch (err) {
      setError(err.message || 'Could not accept like');
    } finally {
      setActionId(null);
    }
  };

  const handleReject = async (like) => {
    setActionId(like.likerId);
    try {
      await api.rejectLike(like.likerId);
      setLikes((prev) => prev.filter((l) => l.likerId !== like.likerId));
    } catch (err) {
      setError(err.message || 'Could not dismiss like');
    } finally {
      setActionId(null);
    }
  };

  const closeCelebration = () => {
    setShowCelebration(false);
    setCelebratingMatch(null);
  };

  const handleSendMessage = () => {
    if (!celebratingMatch) return;
    const p = celebratingMatch.profile;
    onOpenChat(celebratingMatch.matchId, {
      userId: celebratingMatch.likerId,
      name: p?.name,
      photos: p?.photos || [],
      bio: p?.bio || '',
    });
    closeCelebration();
  };

  if (showCelebration && celebratingMatch) {
    const photo = celebratingMatch.profile?.photos?.[0]?.url;
    return (
      <main className="relative flex-grow flex flex-col items-center justify-center px-6 text-center pb-24 overflow-hidden h-full w-full bg-background">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary/10 via-background to-tertiary/10" />
        <div className="relative z-20 flex flex-col items-center w-full max-w-lg mt-12 fade-in">
          <h1 className="font-display-lg text-5xl md:text-6xl text-primary mb-4 leading-tight">It&apos;s a Spark!</h1>
          <p className="font-body-lg text-on-surface-variant max-w-xs mx-auto">
            You and {celebratingMatch.profile?.name || 'your match'} have found a meaningful connection.
          </p>
          <div className="relative flex items-center justify-center gap-12 my-8 w-full">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-lg overflow-hidden">
              <img
                alt="Your profile"
                className="w-full h-full object-cover"
                src={myProfile?.photos?.[0]?.url || ''}
                loading="lazy"
              />
            </div>
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-lg overflow-hidden">
              <img alt="Match" className="w-full h-full object-cover" src={photo || ''} loading="lazy" />
            </div>
          </div>
          <div className="flex flex-col gap-4 w-full max-w-xs mt-4">
            <button
              type="button"
              onClick={handleSendMessage}
              className="w-full py-4 px-8 bg-gradient-to-r from-primary to-primary-container text-on-primary font-title-md rounded-full shadow-lg"
            >
              Send a Message
            </button>
            <button
              type="button"
              onClick={closeCelebration}
              className="w-full py-4 px-8 bg-transparent text-primary font-title-md rounded-full border-2 border-outline-variant"
            >
              Keep Discovering
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-grow pt-24 pb-28 px-4 md:px-8 w-full max-w-4xl mx-auto overflow-y-auto hide-scrollbar h-full">
      <section className="mb-6 text-center">
        <h1 className="font-headline-lg text-on-surface mb-2">Match Requests</h1>
        <p className="font-body-md text-secondary">
          See who has already liked you. Tap to spark a connection!
        </p>
        {!canSeeProfiles && (
          <p className="text-xs text-primary mt-2 font-medium">
            Upgrade to Platinum to reveal who liked you
          </p>
        )}
      </section>

      {loading && (
        <div className="flex flex-col items-center justify-center mt-16 gap-3">
          <span className="material-symbols-outlined text-primary text-4xl animate-spin">progress_activity</span>
          <p className="text-sm text-on-surface-variant">Loading your admirers…</p>
        </div>
      )}

      {!loading && error && (
        <div className="flex flex-col items-center justify-center mt-12 gap-4 text-center px-4">
          <span className="material-symbols-outlined text-error text-4xl">error_outline</span>
          <p className="text-sm text-on-surface-variant">{error}</p>
          <button
            type="button"
            onClick={loadLikes}
            className="px-6 py-2 bg-primary text-on-primary rounded-full text-sm font-semibold"
          >
            Try again
          </button>
        </div>
      )}

      {!loading && !error && likes.length === 0 && (
        <div className="flex flex-col items-center justify-center mt-12 text-center px-4">
          <div className="w-20 h-20 bg-surface-container-high rounded-full flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-outline text-4xl">favorite_border</span>
          </div>
          <p className="font-body-md text-on-surface-variant max-w-sm">
            {emptyMessage || "You don't have any pending match requests right now. Keep exploring!"}
          </p>
        </div>
      )}

      {!loading && !error && likes.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pb-8">
          {likes.map((like) => {
            const blurred = like.profile?.blurred;
            const photo = like.profile?.photos?.[0]?.url;
            const busy = actionId === like.likerId;

            return (
              <div
                key={like.likerId}
                className="relative group rounded-2xl overflow-hidden aspect-[3/4] pearl-card shadow-sm border border-outline-variant/20"
              >
                {photo ? (
                  <img
                    src={photo}
                    alt=""
                    className={`w-full h-full object-cover ${blurred ? 'blur-xl scale-110' : ''}`}
                    loading="lazy"
                  />
                ) : (
                  <div className={`w-full h-full bg-surface-container-high ${blurred ? 'blur-sm' : ''}`} />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent flex flex-col justify-end p-4">
                  {blurred ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <span className="material-symbols-outlined text-white text-3xl mb-2">lock</span>
                      <p className="font-title-md text-white">Hidden Spark</p>
                      <p className="text-xs text-white/80 mt-1">{formatLikedAt(like.likedAt)}</p>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-1 mb-1">
                        {like.isSuperLike && (
                          <span className="text-[10px] font-bold uppercase tracking-wide bg-amber-400 text-black px-2 py-0.5 rounded-full">
                            Super
                          </span>
                        )}
                        {like.isMutualLike && (
                          <span className="text-[10px] font-bold uppercase tracking-wide bg-primary text-white px-2 py-0.5 rounded-full">
                            Mutual
                          </span>
                        )}
                      </div>
                      <h3 className="font-title-md text-white text-lg">
                        {like.profile?.name}
                        {like.profile?.age != null ? `, ${like.profile.age}` : ''}
                      </h3>
                      <p className="text-xs text-white/70 mt-0.5">{formatLikedAt(like.likedAt)}</p>
                      <div className="flex gap-2 mt-3 w-full">
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => handleReject(like)}
                          className="flex-1 bg-surface/20 backdrop-blur-md text-white py-2 rounded-xl flex justify-center disabled:opacity-50"
                        >
                          <span className="material-symbols-outlined text-[20px]">close</span>
                        </button>
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => handleAccept(like)}
                          className="flex-1 bg-primary text-on-primary py-2 rounded-xl flex justify-center disabled:opacity-50"
                        >
                          <span
                            className="material-symbols-outlined text-[20px]"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            favorite
                          </span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
};

export default HeartTab;
