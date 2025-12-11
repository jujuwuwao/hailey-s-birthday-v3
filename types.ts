export type Phase = 'tree' | 'blooming' | 'nebula' | 'collapsing';
export type GestureType = 'None' | 'Open_Palm' | 'Closed_Fist';

export interface AppState {
  phase: Phase;
  setPhase: (phase: Phase) => void;
  audioPlaying: boolean;
  setAudioPlaying: (playing: boolean) => void;
  activePhotoIndex: number | null;
  setActivePhotoIndex: (index: number | null) => void;
  cameraEnabled: boolean;
  setCameraEnabled: (enabled: boolean) => void;
  gesture: GestureType;
  setGesture: (gesture: GestureType) => void;
}

export interface ParticleData {
  position: [number, number, number];
  color: string;
  size: number;
}