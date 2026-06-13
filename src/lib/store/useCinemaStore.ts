import { create } from 'zustand';

interface CinemaState {
  isIntroFinished: boolean;
  finishIntro: () => void;
  currentScene: number;
  setCurrentScene: (scene: number) => void;
  isTransitioning: boolean;
  setIsTransitioning: (status: boolean) => void;
}

export const useCinemaStore = create<CinemaState>((set) => ({
  isIntroFinished: false,
  finishIntro: () => set({ isIntroFinished: true }),
  currentScene: 0,
  setCurrentScene: (scene) => set({ currentScene: scene }),
  isTransitioning: false,
  setIsTransitioning: (status) => set({ isTransitioning: status }),
}));
