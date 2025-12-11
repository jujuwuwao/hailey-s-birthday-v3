import { create } from 'zustand';
import { AppState } from './types';

export const useStore = create<AppState>((set) => ({
  phase: 'tree',
  setPhase: (phase) => set({ phase }),
  audioPlaying: false,
  setAudioPlaying: (playing) => set({ audioPlaying: playing }),
  activePhotoIndex: null,
  setActivePhotoIndex: (index) => set({ activePhotoIndex: index }),
  cameraEnabled: false,
  setCameraEnabled: (enabled) => set({ cameraEnabled: enabled }),
  gesture: 'None',
  setGesture: (gesture) => set({ gesture }),
}));