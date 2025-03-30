
import React, { useState, useRef, useEffect } from "react";
import { Video as VideoType } from "../types/video";
import { Play, Pause, ChevronUp } from "lucide-react";
import { formatNumber } from "../utils/formatNumber";


interface VideoPlayerProps {
  video: VideoType;
  isActive: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ video, isActive }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const [showControls, setShowControls] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive) {
      // Autoplay when in view
      if (videoRef.current) {
        videoRef.current.play().catch((e) => {
          console.error("Autoplay failed:", e);
          setIsPlaying(false);
        });
        setIsPlaying(true);
      }
      
      // Reset controls visibility timeout
      resetControlsTimeout();
    } else {
      // Pause when not in view
      if (videoRef.current) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
      
      // Clear timeout when not in view
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      
      // Show controls when not in view
      setShowControls(true);
    }
    
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isActive]);

  const resetControlsTimeout = () => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    
    setShowControls(true);
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 1000);
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch((e) => {
          console.error("Play failed:", e);
        });
      }
      setIsPlaying(!isPlaying);
      resetControlsTimeout();
    }
  };

  const handleVideoPress = () => {
    togglePlayPause();
    resetControlsTimeout();
  };

  const handleMouseMove = () => {
    resetControlsTimeout();
  };

  return (
    <div 
      className="video-snap-item flex items-center justify-center relative bg-shortsizzle-dark overflow-hidden"
      onMouseMove={handleMouseMove}
      onClick={handleVideoPress}
    >
      {/* Phone-like container for short form video */}
      <div className="relative w-[375px] h-[667px] mx-auto bg-black overflow-hidden shadow-xl rounded-2xl border-4 border-shortsizzle-gray">
        <video
          ref={videoRef}
          src={video.url} /*video.url*/ 
          className="absolute w-full h-full object-cover"
          loop
          playsInline
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 pointer-events-none" />
      </div>
      
      {/* Play/Pause button (appears briefly) */}
      {showControls && (
        <button 
          className="absolute inset-0 m-auto w-16 h-16 flex items-center justify-center bg-black/30 rounded-full animate-fade-in"
          onClick={(e) => {
            e.stopPropagation();
            togglePlayPause();
          }}
        >
          {isPlaying ? (
            <Pause className="w-8 h-8 text-white" />
          ) : (
            <Play className="w-8 h-8 text-white" />
          )}
        </button>
      )}

      {/* Video info */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[375px] p-4 z-10 pointer-events-none">
        <div className="mb-14">
          {/* <h2 className="text-white font-bold text-lg">{video.title}</h2> */}
          {/* <p className="text-gray-200 text-sm line-clamp-2 mt-1">{video.description}</p> */}
          
          <div className="flex items-center mt-3 pointer-events-auto">

            {/* <img 
              src={video.author.avatar} 
              alt={video.author.name} 
              className="w-8 h-8 rounded-full object-cover border border-white"
            /> */}
            <div className="ml-2">
              {/* <p className="text-white font-semibold text-sm">{video.author.name}</p> */}
              {/* <p className="text-gray-300 text-xs">{formatNumber(video.author.followers)} followers</p> */}
            </div>
            {/* <button className="ml-auto bg-shortsizzle-red text-white text-sm py-1 px-3 rounded-full">
              Follow
            </button> */}
          </div>
        </div>
      </div>

      {/* Swipe up indicator */}
      <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 animate-bounce pointer-events-none">
        {/* <ChevronUp className="w-6 h-6 text-white opacity-70" /> */}
        {/* <p className="text-white text-xs opacity-70">Swipe up</p> */}
      </div>
    </div>
  );
};

export default VideoPlayer;
