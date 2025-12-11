import React from 'react';
import Scene from './components/Scene';
import UI from './components/UI';
import { useStore } from './store';
import HandTracker from './components/HandTracker';

const App: React.FC = () => {
  const { phase, setPhase, activePhotoIndex, setActivePhotoIndex } = useStore();

  const handleDoubleClick = () => {
    if (phase === 'tree') {
      setPhase('blooming');
    } else if (phase === 'nebula') {
      if (activePhotoIndex !== null) {
        // Return to photo wall view
        setActivePhotoIndex(null);
      } else {
        // Return to tree view
        setPhase('collapsing');
      }
    }
  };

  return (
    <div 
      className="relative w-full h-screen bg-black overflow-hidden select-none"
      onDoubleClick={handleDoubleClick}
    >
      <Scene />
      <UI />
      
      {/* Hand Tracker Overlay (Hidden visual, logic only if needed or debug visible) */}
      <div className="absolute bottom-4 right-4 w-32 h-24 z-50 opacity-0 pointer-events-none">
         <HandTracker />
      </div>
    </div>
  );
};

export default App;