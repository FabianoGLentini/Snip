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
  const [showControls, setShowControls] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive) {
      if (videoRef.current) {
        videoRef.current.play().catch((e) => {
          console.error("Autoplay failed:", e);
          setIsPlaying(false);
        });
        setIsPlaying(true);
      }
      resetControlsTimeout();
    } else {
      if (videoRef.current) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
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

    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 500);
    }
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
      <div className="relative w-[375px] h-[667px] mx-auto bg-black overflow-hidden shadow-xl rounded-2xl border-4 border-shortsizzle-gray">
        <video
          ref={videoRef}
          src={"src/components/Test Video.mp4"} /*video.url*/
          className="absolute w-full h-full object-cover"
          loop
          playsInline
          muted
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 pointer-events-none" />
      </div>

      {(showControls || !isPlaying) && (
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

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[375px] p-4 z-10 pointer-events-none">
        <div className="mb-14">
          <div className="flex items-center mt-3 pointer-events-auto">
            <div className="ml-2"></div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 animate-bounce pointer-events-none"></div>
    </div>
  );
};

export default VideoPlayer;
