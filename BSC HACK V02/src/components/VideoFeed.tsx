
import React, { useState, useRef, useEffect } from "react";
import VideoPlayer from "./VideoPlayer";
import { useIsMobile } from "../hooks/use-mobile";
import { Video as VideoType } from "../types/video";

interface VideoFeedProps {
  isLoading: boolean; // Accept isLoading as a prop
}

const VideoFeed: React.FC<VideoFeedProps> = ({isLoading}) => {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [url1, setUrl1] = useState("src/components/Test Video.mp4");
  const [url2, setUrl2] = useState("src/components/Test Video.mp4");
  const [url3, setUrl3] = useState("src/components/Test Video.mp4");
  const [url4, setUrl4] = useState("src/components/Test Video.mp4");
  const [url5, setUrl5] = useState("src/components/Test Video.mp4");
  const [url6, setUrl6] = useState("src/components/Test Video.mp4");
  const [url7, setUrl7] = useState("src/components/Test Video.mp4");



  const fetchUrls = async () => {
    console.log("hi")
    try {
      const response = await fetch('http://localhost:3000/getvids', {
        method: 'GET',
        credentials: 'include', 
        headers: {
          'Content-type': 'application/json'
          // 'Content-Type' will be automatically set to 'multipart/form-data' with boundary
        },
      });

      const data = await response.json();
      setUrl1(data.url1 || ''); 
      setUrl2(data.url2 || '');
      setUrl3(data.url3 || '');
      setUrl4(data.url4 || '');
      setUrl5(data.url5 || '');
      setUrl6(data.url6 || '');
      setUrl7(data.url7 || '');

    } catch (error) {
      console.error('Failed to fetch URLs:', error);
    }
  };
  useEffect(() => {
    if(!isLoading) return;
    fetchUrls()
    console.log(isLoading)


  }, [isLoading]); 

  const videos: VideoType[] = [
    {
      id: "1",
      url: url1,
    },
    {
      id: "2",
      url: url2,
    },
    {
      id: "3",
      url: url3,
    },
    {
      id: "4",
      url: url4,
    },
    {
      id: "5",
      url: url5,
    },
    {
      id: "6",
      url: url6,
    },
    {
      id: "7",
      url: url7,
    },
  ];

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
