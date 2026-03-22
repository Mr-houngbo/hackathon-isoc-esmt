import { motion } from "framer-motion";
import { Award, Medal, Crown, ChevronDown } from "lucide-react";
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
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <motion.div
      key={prize.rank}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.2 }}
      whileHover={{ y: -12, scale: 1.02 }}
      className="relative group cursor-pointer"
      onClick={() => setIsRevealed(!isRevealed)}
    >
      {/* Glow effect */}
      <div className={`absolute -inset-1 bg-gradient-to-r ${
        prize.color === 'orange' 
          ? 'from-[#FEEB09] to-[#FEEB09]' 
          : 'from-[#24366E] to-[#2E4A8C]'
      } rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-300`}></div>
      
      {/* Card */}
      <div className="relative bg-white border border-[#E9ECEF] rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
        {/* Top gradient bar */}
        <div className={`h-2 w-full bg-gradient-to-r ${
          prize.color === 'orange' 
            ? 'from-[#FEEB09] to-[#FEEB09]' 
            : 'from-[#24366E] to-[#2E4A8C]'
        }`}></div>
        
        {/* Content */}
        <div className="p-8 text-center">
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
          
          {/* Amount - Hidden by default, revealed on click */}
          <motion.div 
            className="mb-4 overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ 
              height: isRevealed ? "auto" : 0, 
              opacity: isRevealed ? 1 : 0 
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <p 
              className={`font-display text-3xl font-extrabold mb-2 ${
                prize.color === 'orange' ? 'text-[#FEEB09]' : 'text-[#24366E]'
              }`}
              style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800 }}
            >
              {prize.amount}
            </p>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
              prize.color === 'orange' 
                ? 'bg-[#FEEB09]/10 text-[#FEEB09] border border-[#FEEB09]/30' 
                : 'bg-[#24366E]/10 text-[#24366E] border border-[#24366E]/30'
            }`}>
              {prize.bonus}
            </div>
          </motion.div>
          
          {/* Click indicator */}
          <motion.div 
            className="flex items-center justify-center gap-2 text-[#6C757D] mb-4"
            animate={{ rotate: isRevealed ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="h-4 w-4" />
            <span className="text-sm font-medium">
              {isRevealed ? "Masquer" : "Révéler"} le montant
            </span>
            <ChevronDown className="h-4 w-4" />
          </motion.div>
          
          {/* Description */}
          <p 
            className="text-sm text-[#6C757D] leading-relaxed font-medium"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            {prize.description}
          </p>
        </div>
        
        {/* Decorative corner */}
        <div className={`absolute top-2 right-2 w-8 h-8 bg-gradient-to-br ${
          prize.color === 'orange' 
            ? 'from-[#FEEB09] to-[#FEEB09]' 
            : 'from-[#24366E] to-[#2E4A8C]'
        } opacity-10 rounded-full blur-xl`}></div>
      </div>
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
          Plus qu'une compétition, une opportunité de transformer votre vision en réalité avec un accompagnement de prestige.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {prizes.map((prize, index) => (
          <PrizeCard key={prize.rank} prize={prize} index={index} />
        ))}
      </div>
      
      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6 }}
        className="text-center mt-16"
      >
        <div className="bg-white rounded-2xl border border-[#E9ECEF] shadow-lg p-8 max-w-2xl mx-auto">
          <p 
            className="text-[#6C757D] mb-4 text-lg font-medium"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            Au total : <span className="text-[#FEEB09] font-bold text-xl">450 000 FCFA</span> de prix + incubation
          </p>
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-[#24366E]/10 border border-[#24366E]/20">
              <Crown className="h-5 w-5 text-[#FEEB09]" />
              <span className="text-sm font-semibold text-[#24366E]" style={{ fontFamily: 'Sora, sans-serif' }}>
                Limité à 40 participants
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default PrizesSection;
