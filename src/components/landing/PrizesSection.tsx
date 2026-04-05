import { useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Medal, Award, Crown } from "lucide-react";
import { GlobeISoc } from "@/components/ui/GlobeISoc";

const prizes = [
  { 
    rank: "1er Prix", 
    amount: "250 000 FCFA", 
    bonus: "+ 6 mois d'accompagnement", 
    color: "from-[#40B2A4] to-[#40B2A4]",
    icon: Crown,
    description: "Accompagnement personnalisé et lancement officiel du projet"
  },
  { 
    rank: "2ème Prix", 
    amount: "150 000 FCFA", 
    bonus: "+ 3 mois d'accompagnement", 
    color: "from-[#24366E] to-[#2E4A8C]",
    icon: Medal,
    description: "Programme de développement et mise en relation avec des partenaires"
  },
  { 
    rank: "3ème Prix", 
    amount: "50 000 FCFA", 
    bonus: "+ 3 mois d'accompagnement", 
    color: "from-[#40B2A4] to-[#40B2A4]",
    icon: Award,
    description: "Soutien technique et accès à l'écosystème entrepreneurial"
  },
];

const PrizeCard = ({ prize, index }: { prize: typeof prizes[0]; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="relative h-80"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ perspective: "1000px" }}
    >
      <motion.div
        className="relative w-full h-full"
        animate={{ rotateY: isHovered ? 180 : 0 }}
        transition={{ duration: 0.4 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front Face */}
        <div 
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white to-[#F8F9FA] border border-[#E9ECEF] shadow-lg hover:shadow-xl transition-all duration-300 hover:border-[#40B2A4]/50"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="flex flex-col items-center justify-center h-full p-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#40B2A4]/10 to-[#24366E]/10 flex items-center justify-center mb-4">
              <prize.icon size={32} className="text-[#40B2A4]" />
            </div>
            <h3 
              className="font-display text-xl font-bold text-[#212529] mb-2"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              {prize.rank}
            </h3>
            <div className="w-16 h-1 bg-gradient-to-r from-[#40B2A4] to-[#24366E] rounded-full mb-4"></div>
            <p 
              className="text-sm text-[#6C757D] text-center"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              Survolez pour découvrir
            </p>
          </div>
        </div>

        {/* Back Face */}
        <div 
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#40B2A4] to-[#24366E] border border-[#40B2A4]/20 shadow-xl"
          style={{ 
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)"
          }}
        >
          <div className="flex flex-col items-center justify-center h-full p-6 text-white">
            <div className="text-2xl font-bold mb-2" style={{ fontFamily: 'Sora, sans-serif' }}>
              {prize.amount}
            </div>
            <div className="text-lg font-semibold mb-4" style={{ fontFamily: 'Sora, sans-serif' }}>
              {prize.bonus}
            </div>
            <p 
              className="text-sm text-center opacity-90"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              {prize.description}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const PrizesSection = () => (
  <section className="py-12 sm:py-24 bg-gradient-to-br from-white to-[#F8F9FA] relative overflow-hidden">
    {/* Background decorative elements */}
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-32 right-1/4 w-72 h-72 bg-[#40B2A4]/3 rounded-full blur-3xl animate-float-elegant hidden sm:block"></div>
      <div className="absolute bottom-32 left-1/4 w-72 h-72 bg-[#24366E]/3 rounded-full blur-3xl animate-float-elegant hidden sm:block"></div>
      
      {/* Globe decorations */}
      <motion.div 
        className="absolute top-20 left-20 hidden sm:block"
        animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <GlobeISoc size={60} opacity={0.2} />
      </motion.div>
    </div>
    
    <div className="container relative z-10 px-3 sm:px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-6 sm:mb-16"
      >
        <h2 
          className="font-display text-xl sm:text-4xl sm:text-5xl font-bold text-[#212529] mb-2 sm:mb-4"
          style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800 }}
        >
          Des prix exceptionnels
        </h2>
        <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-[#40B2A4] to-[#24366E] mx-auto rounded-full mb-3 sm:mb-6"></div>
        <p 
          className="text-[#6C757D] max-w-2xl mx-auto text-xs sm:text-lg leading-relaxed"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          Au total : <span className="text-[#40B2A4] font-bold">450 000 FCFA</span> de prix + accompagnement
        </p>
      </motion.div>

      {/* Desktop: Flip cards / Mobile: Simple cards without flip */}
      <div className="grid grid-cols-3 gap-2 sm:gap-8 max-w-5xl mx-auto">
        {prizes.map((prize, index) => (
          <div key={prize.rank} className="contents">
            {/* Desktop version with flip effect */}
            <div className="hidden sm:block">
              <PrizeCard prize={prize} index={index} />
            </div>
            
            {/* Mobile version - simple static card without flip */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="sm:hidden bg-gradient-to-br from-white to-[#F8F9FA] rounded-xl border border-[#E9ECEF] shadow-md p-2"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#40B2A4]/10 to-[#24366E]/10 flex items-center justify-center mb-1">
                  <prize.icon size={16} className="text-[#40B2A4]" />
                </div>
                <h3 
                  className="font-display text-[10px] font-bold text-[#212529]"
                  style={{ fontFamily: 'Sora, sans-serif' }}
                >
                  {prize.rank}
                </h3>
                <div className="text-xs font-bold text-[#40B2A4] my-0.5" style={{ fontFamily: 'Sora, sans-serif' }}>
                  {prize.amount}
                </div>
                <p 
                  className="text-[8px] text-[#6C757D] leading-tight"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  {prize.bonus}
                </p>
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </div>

    {/* Decorative bottom gradient */}
    <div className="absolute bottom-0 left-0 right-0 h-1 sm:h-2 bg-gradient-to-r from-[#40B2A4] via-[#24366E] to-[#40B2A4]"></div>
  </section>
);

export default PrizesSection;
