import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const TARGET_DATE = new Date("2026-04-03T08:00:00+00:00").getTime();

interface TimeBlock {
  value: number;
  label: string;
}

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState<TimeBlock[]>([]);

  useEffect(() => {
    const update = () => {
      const now = Date.now();
      const diff = Math.max(0, TARGET_DATE - now);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeLeft([
        { value: days, label: "Jours" },
        { value: hours, label: "Heures" },
        { value: minutes, label: "Minutes" },
        { value: seconds, label: "Secondes" },
      ]);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex gap-4 sm:gap-6">
      {timeLeft.map((block, i) => (
        <motion.div
          key={block.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <div className="relative group">
            {/* Card container */}
            <div className="card-premium flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-xl p-1">
              {/* Inner gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#00873E]/10 to-[#FBBF24]/10 rounded-xl"></div>
              
              {/* Number display */}
              <div className="relative z-10">
                <span 
                  className="font-display text-3xl sm:text-4xl font-bold text-[#F9FAFB] block text-center"
                  style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800 }}
                >
                  {String(block.value).padStart(2, "0")}
                </span>
              </div>
              
              {/* Glow effect on hover */}
              <div className="absolute inset-0 rounded-xl glow-vert opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            
            {/* Decorative dots */}
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#FBBF24] rounded-full animate-pulse"></div>
          </div>
          
          {/* Label */}
          <span 
            className="mt-3 text-xs sm:text-sm text-[#9CA3AF] font-medium uppercase tracking-wide"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            {block.label}
          </span>
        </motion.div>
      ))}
      
      {/* Separator lines */}
      <div className="hidden sm:flex items-center">
        <div className="h-px w-8 bg-gradient-to-r from-transparent via-[#2D3748] to-transparent"></div>
      </div>
    </div>
  );
};

export default CountdownTimer;
