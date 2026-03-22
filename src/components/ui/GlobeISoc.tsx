import { motion } from "framer-motion";

interface GlobeISocProps {
  size?: number;
  opacity?: number;
  className?: string;
}

export const GlobeISoc = ({ size = 28, opacity = 0.6, className = '' }: GlobeISocProps) => (
  <svg width={size} height={size} viewBox="0 0 28 28" className={className}>
    <circle cx="14" cy="14" r="12" fill="none" stroke="#24366E" strokeWidth="1.2" opacity={opacity}/>
    <ellipse cx="14" cy="14" rx="7" ry="12" fill="none" stroke="#24366E" strokeWidth="0.8" opacity={opacity * 0.7}/>
    <ellipse cx="14" cy="14" rx="12" ry="5" fill="none" stroke="#24366E" strokeWidth="0.8" opacity={opacity * 0.7}/>
    <circle cx="14" cy="14" r="2.5" fill="#24366E" opacity={opacity + 0.2}/>
    <circle cx="8" cy="9" r="1.5" fill="#24366E" opacity={opacity * 0.7}/>
    <circle cx="20" cy="10" r="1.2" fill="#24366E" opacity={opacity * 0.6}/>
    <line x1="14" y1="14" x2="8" y2="9" stroke="#24366E" strokeWidth="0.7" opacity={opacity * 0.5}/>
    <line x1="14" y1="14" x2="20" y2="10" stroke="#24366E" strokeWidth="0.7" opacity={opacity * 0.5}/>
  </svg>
);

interface GlobeBackgroundProps {
  size?: number;
  className?: string;
}

export const GlobeBackground = ({ size = 200, className = '' }: GlobeBackgroundProps) => (
  <svg width={size} height={size} viewBox="0 0 200 200" className={className}>
    <circle cx="100" cy="100" r="85" fill="none" stroke="#24366E" strokeWidth="1.5"/>
    <ellipse cx="100" cy="100" rx="50" ry="85" fill="none" stroke="#24366E" strokeWidth="1"/>
    <ellipse cx="100" cy="100" rx="85" ry="32" fill="none" stroke="#24366E" strokeWidth="1"/>
    <ellipse cx="100" cy="100" rx="85" ry="60" fill="none" stroke="#24366E" strokeWidth="0.8"/>
    <line x1="15" y1="100" x2="185" y2="100" stroke="#24366E" strokeWidth="0.8"/>
    <line x1="100" y1="15" x2="100" y2="185" stroke="#24366E" strokeWidth="0.8"/>
  </svg>
);

// Animated version with subtle floating animation
export const GlobeAnimated = ({ size = 28, opacity = 0.6, className = '' }: GlobeISocProps) => (
  <motion.div
    animate={{ 
      y: [0, -5, 0],
      rotate: [0, 5, 0, -5, 0]
    }}
    transition={{ 
      duration: 4, 
      repeat: Infinity, 
      ease: "easeInOut" 
    }}
    className={className}
  >
    <GlobeISoc size={size} opacity={opacity} />
  </motion.div>
);

// Rotating globe for backgrounds
export const GlobeRotating = ({ size = 200, className = '' }: GlobeBackgroundProps) => (
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
    className={className}
  >
    <GlobeBackground size={size} />
  </motion.div>
);

// Small decorative globe cluster
export const GlobeCluster = ({ className = '' }: { className?: string }) => (
  <div className={`relative ${className}`}>
    <motion.div
      className="absolute top-0 left-0"
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      <GlobeISoc size={16} opacity={0.4} />
    </motion.div>
    <motion.div
      className="absolute top-2 left-4"
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
    >
      <GlobeISoc size={24} opacity={0.5} />
    </motion.div>
    <motion.div
      className="absolute top-6 left-2"
      animate={{ y: [0, -2, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
    >
      <GlobeISoc size={20} opacity={0.35} />
    </motion.div>
  </div>
);
