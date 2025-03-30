import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import VideoFeed from "../components/VideoFeed";
import Header from "../components/Header";
import AddButton from "../components/AddButton";
import PdfUploadModal from "./PdfUploadModal"; 

interface IndexProps {
  isLoading: boolean;
}
const Index: React.FC<IndexProps> = ({isLoading}) => {
  const [showModal, setShowModal] = useState(false); 
  const navigate = useNavigate();

  const handleSubmit = () => {
    navigate("auth")
  }

  return (
    <div className="h-screen w-full flex flex-col bg-shortsizzle-dark overflow-hidden">
      <button onClick={handleSubmit}>Registration</button>
      <Header />

      <div className="flex-1 overflow-hidden">
        {}
        {showModal && (
          <PdfUploadModal onClose={() => setShowModal(false)} />
        )}

        <VideoFeed isLoading={isLoading} />
      </div>

      {}
      <AddButton onClick={() => window.location.href = "http://localhost:3000/docs/new"} />
        
    </div>
  );
};

export default Index;
