// src/components/LoadingScreen.tsx

import React from "react";

const LoadingScreen: React.FC = () => {
  return (
    <div className="h-screen w-full flex flex-col justify-center items-center bg-[#0f0f0f] text-white">
      <h1 className="text-3xl font-bold mb-4">Importing</h1>
      <p className="text-sm text-gray-400 mb-8">Loading, please wait...</p>

      <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>

      <p className="text-xs text-gray-600">May your discovery be fruitfull</p>
    </div>
  );
};

export default LoadingScreen;
