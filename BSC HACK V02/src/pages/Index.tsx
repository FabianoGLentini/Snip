
import React from "react";
import VideoFeed from "../components/VideoFeed";
import Header from "../components/Header";
import AddButton from "../components/AddButton";

const Index = () => {
  return (
    <div className="h-screen w-full flex flex-col bg-shortsizzle-dark overflow-hidden">
      <Header />
      <div className="flex-1 overflow-hidden">
        <VideoFeed />
      </div>
      <AddButton />
    </div>
  );
};

export default Index;
