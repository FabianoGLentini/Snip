
import React from "react";
import { Plus } from "lucide-react";

const AddButton: React.FC = () => {
  const handleAddClick = () => {
    
    console.log("Add button clicked");
    // Add your functionality here
  };

  return (
    <button
      onClick={handleAddClick}
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-20 bg-shortsizzle-red hover:bg-blue-600 transition-colors w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
      aria-label="Add new content"
    >
      <Plus className="w-8 h-8 text-white" />
    </button>
  );
};

export default AddButton;
