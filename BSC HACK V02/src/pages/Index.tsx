import React, { useState } from "react";
import VideoFeed from "../components/VideoFeed";
import Header from "../components/Header";
import AddButton from "../components/AddButton";
import PdfUploadModal from "./PdfUploadModal"; 

const Index: React.FC = () => {
  const [showModal, setShowModal] = useState(false); 

  return (
    <div className="h-screen w-full flex flex-col bg-shortsizzle-dark overflow-hidden">
      <Header />

      <div className="flex-1 overflow-hidden">
        {}
        {showModal && (
          <PdfUploadModal onClose={() => setShowModal(false)} />
        )}

        <VideoFeed />
      </div>

      {}
      <AddButton onClick={() => setShowModal(true)} />
    </div>
  );
};

export default Index;
