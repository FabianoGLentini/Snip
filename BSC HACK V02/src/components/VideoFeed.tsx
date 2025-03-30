
import React, { useState, useRef, useEffect } from "react";
import { videos } from "../data/videos";
import VideoPlayer from "./VideoPlayer";
import { useIsMobile } from "../hooks/use-mobile";

const VideoFeed: React.FC = () => {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (container) {
        const scrollTop = container.scrollTop;
        const itemHeight = container.clientHeight;
        const index = Math.round(scrollTop / itemHeight);
        setActiveVideoIndex(index);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="flex items-center justify-center h-full bg-shortsizzle-dark">
      <div 
        ref={containerRef} 
        className="video-snap-container hide-scrollbar max-w-[375px] h-[calc(100vh-60px)]"
      >
        {videos.map((video, index) => (
          <VideoPlayer
            key={video.id}
            video={video}
            isActive={index === activeVideoIndex}
          />
        ))}
      </div>
    </div>
  );
};

export default VideoFeed;
