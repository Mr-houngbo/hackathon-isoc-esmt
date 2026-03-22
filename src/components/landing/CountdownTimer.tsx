import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const TARGET_DATE = new Date("2026-04-17T08:00:00+00:00").getTime();

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
    <div className="flex gap-6 sm:gap-8">
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
            <div className="card-premium flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-2xl p-1 shadow-lg">
              {/* Inner gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#FEEB09]/5 to-[#24366E]/5 rounded-2xl"></div>
              
              {/* Number display */}
              <div className="relative z-10">
                <span 
                  className="font-display text-3xl sm:text-4xl font-bold text-[#212529] block text-center"
                  style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800 }}
                >
                  {String(block.value).padStart(2, "0")}
                </span>
              </div>
              
              {/* Glow effect on hover */}
              <div className="absolute inset-0 rounded-2xl glow-orange opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            
            {/* Decorative dots */}
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#FEEB09] rounded-full animate-pulse"></div>
          </div>
          
          {/* Label */}
          <span 
            className="mt-3 text-xs sm:text-sm text-[#6C757D] font-medium uppercase tracking-wide"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            {block.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
};

export default CountdownTimer;
