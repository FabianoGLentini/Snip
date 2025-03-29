
import React from "react";

const Header: React.FC = () => {
  return (
    <div className="fixed top-0 left-0 right-0 flex justify-center items-center h-14 z-20 bg-gradient-to-b from-black/70 via-black/30 to-transparent pointer-events-none">
      <div className="text-white font-bold text-xl">ShortSizzle</div>
    </div>
  );
};

export default Header;
