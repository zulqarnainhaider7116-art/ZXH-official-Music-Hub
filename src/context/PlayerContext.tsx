import { createContext, useContext, type ReactNode } from 'react';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import type { Track } from '../types/music';

type PlayerContextType = ReturnType<typeof useAudioPlayer>;

const PlayerContext = createContext<PlayerContextType | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const player = useAudioPlayer();
  return <PlayerContext.Provider value={player}>{children}</PlayerContext.Provider>;
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider');
  return ctx;
}

export type { Track };
