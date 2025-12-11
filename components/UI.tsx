import React, { useEffect, useRef } from 'react';
import { useStore } from '../store';
import { BGM_URL } from '../constants';

const UI: React.FC = () => {
  const { 
      phase, 
      audioPlaying, 
      setAudioPlaying,
      activePhotoIndex
  } = useStore();
  
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
      if(audioRef.current) {
          if(audioPlaying) {
              audioRef.current.play().catch(e => console.log("Interaction needed first"));
          } else {
              audioRef.current.pause();
          }
      }
  }, [audioPlaying]);

  return (
    <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-6">
      <audio ref={audioRef} src={BGM_URL} loop />

      {/* Header / Instructions - Square & Narrow */}
      <div className="flex flex-col items-start w-full pt-4 pointer-events-auto">
        <div className="glass-panel w-24 min-h-[96px] p-3 rounded-2xl text-white backdrop-blur-md bg-white/5 border border-white/10 flex flex-col items-center justify-center text-center">
            <h3 className="text-[9px] font-bold tracking-widest uppercase opacity-60 mb-2 text-yellow-200">
                Guide
            </h3>
            <div className="text-[10px] font-light leading-tight">
                {phase === 'tree' && "Double click to Open"}
                {phase === 'nebula' && (
                    activePhotoIndex !== null ? "Double click: Back" : "Double click: Home"
                )}
                {(phase === 'blooming' || phase === 'collapsing') && "..."}
            </div>
        </div>
      </div>

      {/* Center Title - Removed animate-pulse */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none z-20 w-full px-4">
          <h1 className="font-cursive text-6xl md:text-9xl text-yellow-200 drop-shadow-[0_5px_5px_rgba(0,0,0,1)]">
              Merry Christmas
          </h1>
          <h2 className="font-cursive text-4xl md:text-7xl text-white mt-4 drop-shadow-[0_5px_5px_rgba(0,0,0,1)]">
              & Happy Birthday
          </h2>
      </div>

      {/* Footer / Music Player */}
      <div className="w-full flex justify-center pointer-events-auto pb-6">
          <div className="glass-panel backdrop-blur-xl bg-black/40 border border-white/10 px-6 py-3 rounded-full flex items-center gap-4 text-white shadow-2xl hover:bg-black/50 transition-colors cursor-pointer" onClick={() => setAudioPlaying(!audioPlaying)}>
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all border border-white/30">
                    {audioPlaying ? (
                        <span className="animate-spin text-xl">❄️</span>
                    ) : (
                        <span className="text-xl pl-1">▶</span>
                    )}
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest">Now Playing</span>
                    <div className="w-40 overflow-hidden whitespace-nowrap mask-gradient">
                        <p className={`text-sm font-light ${audioPlaying ? 'animate-marquee' : ''}`}>
                             Merry Christmas Mr. Lawrence - Ryuichi Sakamoto
                        </p>
                    </div>
                </div>
                {/* Visualizer bars */}
                <div className="flex gap-1 h-4 items-end">
                    {[1,2,3,4].map(i => (
                        <div key={i} className={`w-1 bg-yellow-200/80 rounded-t ${audioPlaying ? 'animate-music-bar' : 'h-1'}`} style={{animationDelay: `${i*0.1}s`}} />
                    ))}
                </div>
          </div>
      </div>

      <style>{`
        .font-cursive { font-family: 'Great Vibes', cursive; }
        .animate-marquee { display: inline-block; padding-left: 100%; animation: marquee 10s linear infinite; }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-100%); } }
        @keyframes music-bar { 0%, 100% { height: 20%; } 50% { height: 100%; } }
        .animate-music-bar { animation: music-bar 0.8s ease-in-out infinite; }
        .glass-panel { box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1); }
      `}</style>
    </div>
  );
};

export default UI;