import { useCallback, useEffect, useRef, useState } from 'react';
import type { Track, PlayerState } from '../types/music';

const initialState: PlayerState = {
  currentTrack: null,
  isPlaying: false,
  queue: [],
  currentIndex: -1,
  volume: 0.8,
  isMuted: false,
  isShuffle: false,
  repeatMode: 'off',
  progress: 0,
  duration: 0,
  isLoading: false,
  error: null,
};

export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [state, setState] = useState<PlayerState>(initialState);

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'metadata';
    audioRef.current = audio;

    const onTimeUpdate = () => {
      setState((s) => ({ ...s, progress: audio.currentTime, duration: audio.duration || s.duration }));
    };
    const onLoaded = () => {
      setState((s) => ({ ...s, duration: audio.duration, isLoading: false, error: null }));
    };
    const onEnded = () => {
      setState((s) => {
        if (s.repeatMode === 'one') {
          audio.currentTime = 0;
          audio.play().catch(() => {});
          return { ...s, progress: 0 };
        }
        // next track logic handled externally via playNext
        return { ...s, isPlaying: false };
      });
    };
    const onError = () => {
      setState((s) => ({
        ...s,
        isLoading: false,
        isPlaying: false,
        error: 'Unable to play this track. It may be unavailable.',
      }));
    };
    const onPlay = () => setState((s) => ({ ...s, isPlaying: true }));
    const onPause = () => setState((s) => ({ ...s, isPlaying: false }));
    const onWaiting = () => setState((s) => ({ ...s, isLoading: true }));
    const onCanPlay = () => setState((s) => ({ ...s, isLoading: false }));

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoaded);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('canplay', onCanPlay);

    return () => {
      audio.pause();
      audio.src = '';
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoaded);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('canplay', onCanPlay);
    };
  }, []);

  // Sync volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = state.isMuted ? 0 : state.volume;
    }
  }, [state.volume, state.isMuted]);

  const loadAndPlay = useCallback(async (track: Track, queue: Track[] = [], index = 0) => {
    if (!audioRef.current) return;
    if (!track.streamUrl) {
      setState((s) => ({
        ...s,
        error: 'This track has no playable stream.',
        isLoading: false,
        isPlaying: false,
      }));
      return;
    }

    setState((s) => ({
      ...s,
      currentTrack: track,
      queue: queue.length ? queue : [track],
      currentIndex: index,
      isLoading: true,
      error: null,
      progress: 0,
    }));

    const audio = audioRef.current;
    audio.src = track.streamUrl;
    try {
      await audio.play();
      setState((s) => ({ ...s, isPlaying: true, isLoading: false }));
    } catch (err) {
      console.error('Playback failed', err);
      setState((s) => ({
        ...s,
        isPlaying: false,
        isLoading: false,
        error: 'Playback failed. The stream may be restricted.',
      }));
    }
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !state.currentTrack) return;
    if (state.isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => {
        setState((s) => ({ ...s, error: 'Unable to resume playback.' }));
      });
    }
  }, [state.isPlaying, state.currentTrack]);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setState((s) => ({ ...s, progress: time }));
    }
  }, []);

  const setVolume = useCallback((v: number) => {
    setState((s) => ({ ...s, volume: Math.max(0, Math.min(1, v)), isMuted: false }));
  }, []);

  const toggleMute = useCallback(() => {
    setState((s) => ({ ...s, isMuted: !s.isMuted }));
  }, []);

  const playNext = useCallback(() => {
    setState((s) => {
      if (!s.queue.length) return s;
      let nextIndex = s.currentIndex + 1;
      if (s.isShuffle && s.queue.length > 1) {
        do { nextIndex = Math.floor(Math.random() * s.queue.length); }
        while (nextIndex === s.currentIndex);
      } else if (nextIndex >= s.queue.length) {
        if (s.repeatMode === 'all') nextIndex = 0;
        else return { ...s, isPlaying: false };
      }
      const nextTrack = s.queue[nextIndex];
      if (nextTrack) setTimeout(() => loadAndPlay(nextTrack, s.queue, nextIndex), 0);
      return s;
    });
  }, [loadAndPlay]);

  const playPrev = useCallback(() => {
    setState((s) => {
      if (!s.queue.length) return s;
      if ((audioRef.current?.currentTime || 0) > 3) {
        if (audioRef.current) audioRef.current.currentTime = 0;
        return { ...s, progress: 0 };
      }
      let prevIndex = s.currentIndex - 1;
      if (prevIndex < 0) {
        if (s.repeatMode === 'all') prevIndex = s.queue.length - 1;
        else return s;
      }
      const prevTrack = s.queue[prevIndex];
      if (prevTrack) {
        setTimeout(() => loadAndPlay(prevTrack, s.queue, prevIndex), 0);
      }
      return s;
    });
  }, [loadAndPlay]);

  const toggleShuffle = useCallback(() => {
    setState((s) => ({ ...s, isShuffle: !s.isShuffle }));
  }, []);

  const cycleRepeat = useCallback(() => {
    setState((s) => {
      const modes: PlayerState['repeatMode'][] = ['off', 'all', 'one'];
      const idx = modes.indexOf(s.repeatMode);
      return { ...s, repeatMode: modes[(idx + 1) % modes.length] };
    });
  }, []);

  // Auto next on end
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handler = () => {
      if (state.repeatMode !== 'one') {
        playNext();
      }
    };
    audio.addEventListener('ended', handler);
    return () => audio.removeEventListener('ended', handler);
  }, [playNext, state.repeatMode]);

  return {
    ...state,
    audioRef,
    loadAndPlay,
    togglePlay,
    seek,
    setVolume,
    toggleMute,
    playNext,
    playPrev,
    toggleShuffle,
    cycleRepeat,
  };
}
