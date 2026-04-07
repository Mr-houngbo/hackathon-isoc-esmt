import { useState } from "react";
import { MessageSquare, X } from "lucide-react";
import { Link } from "react-router-dom";

const FloatingFeedbackButton = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      to="/feedback"
      className="fixed bottom-6 right-6 z-50 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Tooltip */}
      <div
        className={`absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-2 bg-[#212529] text-white text-sm rounded-lg whitespace-nowrap transition-all duration-300 ${
          isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2 pointer-events-none"
        }`}
        style={{ fontFamily: 'DM Sans, sans-serif' }}
      >
        Donnez votre avis
        <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-[#212529] rotate-45"></div>
      </div>

      {/* Button */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[#40B2A4] to-[#24366E] rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
        <button
          className="relative w-14 h-14 bg-gradient-to-r from-[#40B2A4] to-[#24366E] rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform duration-300"
          aria-label="Donner mon feedback"
        >
          <MessageSquare size={24} className="text-white" />
        </button>
        
        {/* Notification badge (optional) */}
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#DC2626] rounded-full border-2 border-white"></span>
      </div>
    </Link>
  );
};

export default FloatingFeedbackButton;
