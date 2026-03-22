import { motion } from "framer-motion";
import { Award, Medal, Crown, RefreshCw } from "lucide-react";
import { useState } from "react";

const prizes = [
  { 
    rank: "1er Prix", 
    amount: "250 000 FCFA", 
    bonus: "+ 6 mois d'incubation", 
    color: "orange",
    icon: Crown,
    description: "Accompagnement personnalisé et lancement officiel du projet"
  },
  { 
    rank: "2ème Prix", 
    amount: "150 000 FCFA", 
    bonus: "+ 3 mois d'incubation", 
    color: "bleu",
    icon: Medal,
    description: "Programme de développement et mise en relation avec des partenaires"
  },
  { 
    rank: "3ème Prix", 
    amount: "50 000 FCFA", 
    bonus: "+ 3 mois d'incubation", 
    color: "orange",
    icon: Award,
    description: "Soutien technique et accès à l'écosystème entrepreneurial"
  },
];

const PrizeCard = ({ prize, index }: { prize: typeof prizes[0]; index: number }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      key={prize.rank}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.2 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="relative group cursor-pointer h-80"
      style={{ perspective: "1000px" }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      {/* Glow effect */}
      <div className={`absolute -inset-1 bg-gradient-to-r ${
        prize.color === 'orange' 
          ? 'from-[#FEEB09] to-[#FEEB09]' 
          : 'from-[#24366E] to-[#2E4A8C]'
      } rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-300`}></div>
      
      {/* 3D Card Container */}
      <motion.div
        className="relative w-full h-full"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front Face */}
        <div 
          className="absolute w-full h-full bg-white border border-[#E9ECEF] rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          {/* Top gradient bar */}
          <div className={`h-2 w-full bg-gradient-to-r ${
            prize.color === 'orange' 
              ? 'from-[#FEEB09] to-[#FEEB09]' 
              : 'from-[#24366E] to-[#2E4A8C]'
          }`}></div>
          
          {/* Content */}
          <div className="p-8 text-center flex flex-col justify-between h-full">
            <div>
              {/* Icon */}
              <div className="relative mb-6 inline-flex">
                <div className={`absolute inset-0 bg-gradient-to-r ${
                  prize.color === 'orange' 
                    ? 'from-[#FEEB09] to-[#FEEB09]' 
                    : 'from-[#24366E] to-[#2E4A8C]'
                } rounded-full blur-lg opacity-20 animate-pulse`}></div>
                <div className={`relative h-16 w-16 rounded-full bg-gradient-to-br ${
                  prize.color === 'orange' 
                    ? 'from-[#FEEB09]/10 to-[#FEEB09]/10' 
                    : 'from-[#24366E]/10 to-[#2E4A8C]/10'
                } border-2 ${
                  prize.color === 'orange' 
                    ? 'border-[#FEEB09]/30' 
                    : 'border-[#24366E]/30'
                } flex items-center justify-center`}>
                  <prize.icon className={`h-8 w-8 ${
                    prize.color === 'orange' ? 'text-[#FEEB09]' : 'text-[#24366E]'
                  }`} />
                </div>
              </div>
              
              {/* Rank */}
              <h3 
                className="font-display text-xl font-bold text-[#212529] mb-4"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                {prize.rank}
              </h3>
              
              {/* Description */}
              <p 
                className="text-sm text-[#6C757D] leading-relaxed font-medium"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                {prize.description}
              </p>
            </div>
            
            {/* Click indicator */}
            <div className="flex items-center justify-center gap-2 text-[#6C757D] mt-6">
              <RefreshCw className="h-4 w-4" />
              <span className="text-sm font-medium">
                Cliquez pour révéler
              </span>
              <RefreshCw className="h-4 w-4" />
            </div>
          </div>
          
          {/* Decorative corner */}
          <div className={`absolute top-2 right-2 w-8 h-8 bg-gradient-to-br ${
            prize.color === 'orange' 
              ? 'from-[#FEEB09] to-[#FEEB09]' 
              : 'from-[#24366E] to-[#2E4A8C]'
          } opacity-10 rounded-full blur-xl`}></div>
        </div>

        {/* Back Face */}
        <div 
          className="absolute w-full h-full bg-gradient-to-br rounded-2xl shadow-xl overflow-hidden"
          style={{ 
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background: prize.color === 'orange' 
              ? 'linear-gradient(135deg, #FEEB09 0%, #FEEB09 50%, #FFF04D 100%)'
              : 'linear-gradient(135deg, #24366E 0%, #2E4A8C 50%, #1A264A 100%)'
          }}
        >
          {/* Content */}
          <div className="p-8 text-center flex flex-col justify-center h-full text-white">
            {/* Amount */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: isFlipped ? 1 : 0 }}
              transition={{ delay: 0.3, duration: 0.4, ease: "backOut" }}
              className="mb-6"
            >
              <p 
                className="font-display text-4xl font-extrabold mb-3"
                style={{ fontFamily: 'Sora, sans-serif', fontWeight: 900 }}
              >
                {prize.amount}
              </p>
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-sm font-semibold">
                {prize.bonus}
              </div>
            </motion.div>
            
            {/* Prize details */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isFlipped ? 1 : 0 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              <div className="w-16 h-1 bg-white/50 mx-auto rounded-full mb-4"></div>
              <p className="text-white/90 text-sm leading-relaxed">
                Récompense exclusive pour les innovateurs exceptionnels
              </p>
            </motion.div>
            
            {/* Click back indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isFlipped ? 1 : 0 }}
              transition={{ delay: 0.6, duration: 0.3 }}
              className="flex items-center justify-center gap-2 text-white/80 mt-6"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="text-xs font-medium">
                Retourner
              </span>
              <RefreshCw className="h-4 w-4" />
            </motion.div>
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
      <div className="absolute top-32 right-1/4 w-72 h-72 bg-[#FEEB09]/3 rounded-full blur-3xl animate-float-elegant"></div>
      <div className="absolute bottom-32 left-1/4 w-72 h-72 bg-[#24366E]/3 rounded-full blur-3xl animate-float-elegant" style={{ animationDelay: '2s' }}></div>
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
        <div className="w-24 h-1 bg-gradient-to-r from-[#FEEB09] to-[#24366E] mx-auto rounded-full mb-6"></div>
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

    {/* Decorative bottom gradient */}
    <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-[#FEEB09] via-[#24366E] to-[#FEEB09]"></div>
  </section>
);
);

export default PrizesSection;
