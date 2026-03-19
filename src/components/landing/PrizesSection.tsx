import { useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Medal, Award, Crown } from "lucide-react";

const prizes = [
  { 
    rank: "1er Prix", 
    amount: "250 000 FCFA", 
    bonus: "+ 6 mois d'incubation", 
    color: "from-[#FF6B35] to-[#FF8C42]",
    icon: Crown,
    description: "Accompagnement personnalisé et lancement officiel du projet"
  },
  { 
    rank: "2ème Prix", 
    amount: "150 000 FCFA", 
    bonus: "+ 3 mois d'incubation", 
    color: "from-[#1E3A5F] to-[#2C5282]",
    icon: Medal,
    description: "Programme de développement et mise en relation avec des partenaires"
  },
  { 
    rank: "3ème Prix", 
    amount: "50 000 FCFA", 
    bonus: "+ 3 mois d'incubation", 
    color: "from-[#FFA947] to-[#FF6B35]",
    icon: Award,
    description: "Soutien technique et accès à l'écosystème entrepreneurial"
  },
];

const PrizeCard = ({ prize, index }: { prize: typeof prizes[0]; index: number }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="relative h-80 cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
      style={{ perspective: "1000px" }}
    >
      <motion.div
        className="relative w-full h-full"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front Face */}
        <div 
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white to-[#F8F9FA] border border-[#E9ECEF] shadow-lg hover:shadow-xl transition-all duration-300 hover:border-[#FF6B35]/50"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="flex flex-col items-center justify-center h-full p-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#FF6B35]/10 to-[#1E3A5F]/10 flex items-center justify-center mb-4">
              <prize.icon size={32} className="text-[#FF6B35]" />
            </div>
            <h3 
              className="font-display text-xl font-bold text-[#212529] mb-2"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              {prize.rank}
            </h3>
            <div className="w-16 h-1 bg-gradient-to-r from-[#FF6B35] to-[#1E3A5F] rounded-full mb-4"></div>
            <p 
              className="text-sm text-[#6C757D] text-center"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              Cliquez pour découvrir
            </p>
          </div>
        </div>

        {/* Back Face */}
        <div 
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#FF6B35] to-[#1E3A5F] border border-[#FF6B35]/20 shadow-xl"
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
  <section className="py-24 bg-gradient-to-br from-white to-[#F8F9FA] relative overflow-hidden">
    {/* Background decorative elements */}
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-32 right-1/4 w-72 h-72 bg-[#FF6B35]/3 rounded-full blur-3xl animate-float-elegant"></div>
      <div className="absolute bottom-32 left-1/4 w-72 h-72 bg-[#1E3A5F]/3 rounded-full blur-3xl animate-float-elegant" style={{ animationDelay: '2s' }}></div>
    </div>
    
    <div className="container relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 
          className="font-display text-4xl sm:text-5xl font-bold text-[#212529] mb-4"
          style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800 }}
        >
          Des prix pour <span className="text-gradient">récompenser</span> l'innovation
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-[#FF6B35] to-[#1E3A5F] mx-auto rounded-full mb-6"></div>
        <p 
          className="text-[#6C757D] max-w-2xl mx-auto text-lg leading-relaxed"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          Cliquez sur chaque carte pour découvrir les récompenses exceptionnelles qui attendent les innovateurs.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {prizes.map((prize, index) => (
          <PrizeCard key={prize.rank} prize={prize} index={index} />
        ))}
      </div>
    </div>

    {/* Decorative bottom gradient */}
    <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-[#FF6B35] via-[#1E3A5F] to-[#FF6B35]"></div>
  </section>
);

export default PrizesSection;
