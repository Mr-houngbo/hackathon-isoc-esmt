import { motion } from "framer-motion";
import { Award, Medal, Crown } from "lucide-react";

const prizes = [
  { 
    rank: "1er Prix", 
    amount: "250 000 FCFA", 
    bonus: "+ 6 mois d'incubation", 
    color: "from-[#FBBF24] to-[#F59E0B]",
    icon: Crown,
    description: "Accompagnement personnalisé et lancement officiel du projet"
  },
  { 
    rank: "2ème Prix", 
    amount: "150 000 FCFA", 
    bonus: "+ 3 mois d'incubation", 
    color: "from-[#9CA3AF] to-[#6B7280]",
    icon: Medal,
    description: "Programme de développement et mise en relation avec des partenaires"
  },
  { 
    rank: "3ème Prix", 
    amount: "50 000 FCFA", 
    bonus: "+ 3 mois d'incubation", 
    color: "from-[#F87171] to-[#DC2626]",
    icon: Award,
    description: "Soutien technique et accès à l'écosystème entrepreneurial"
  },
];

const PrizesSection = () => (
  <section className="py-24 bg-[#0A0A0A] relative overflow-hidden">
    {/* Background decoration */}
    <div className="absolute inset-0 bg-gradient-to-b from-[#00873E]/5 to-transparent"></div>
    
    <div className="container relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 
          className="font-display text-4xl sm:text-5xl font-bold text-[#F9FAFB] mb-4"
          style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800 }}
        >
          Des prix pour <span className="text-gradient">récompenser</span> l'innovation
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-[#FBBF24] to-[#00873E] mx-auto rounded-full"></div>
        <p 
          className="mt-6 text-[#9CA3AF] max-w-2xl mx-auto text-lg"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          Plus qu'une compétition, une opportunité de transformer votre vision en réalité.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {prizes.map((p, i) => (
          <motion.div
            key={p.rank}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.2 }}
            whileHover={{ y: -12, scale: 1.03 }}
            className="relative group"
          >
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#00873E] to-[#FBBF24] rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-300"></div>
            
            {/* Card */}
            <div className="relative card-premium overflow-hidden rounded-2xl">
              {/* Top gradient bar */}
              <div className={`h-2 w-full bg-gradient-to-r ${p.color}`}></div>
              
              {/* Content */}
              <div className="p-8 text-center">
                {/* Icon */}
                <div className="relative mb-6 inline-flex">
                  <div className={`absolute inset-0 bg-gradient-to-r ${p.color} rounded-full blur-lg opacity-30 animate-pulse`}></div>
                  <div className="relative h-16 w-16 rounded-full bg-gradient-to-br from-[#111827] to-[#1F2937] border-2 border-[#2D3748] flex items-center justify-center">
                    <p.icon className={`h-8 w-8 bg-gradient-to-r ${p.color} bg-clip-text text-transparent`} />
                  </div>
                </div>
                
                {/* Rank */}
                <h3 
                  className="font-display text-xl font-bold text-[#F9FAFB] mb-3"
                  style={{ fontFamily: 'Sora, sans-serif' }}
                >
                  {p.rank}
                </h3>
                
                {/* Amount */}
                <p 
                  className={`font-display text-3xl font-extrabold mb-3 bg-gradient-to-r ${p.color} bg-clip-text text-transparent`}
                  style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800 }}
                >
                  {p.amount}
                </p>
                
                {/* Bonus */}
                <div className="badge-premium inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold mb-4">
                  {p.bonus}
                </div>
                
                {/* Description */}
                <p 
                  className="text-sm text-[#9CA3AF] leading-relaxed"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  {p.description}
                </p>
              </div>
              
              {/* Decorative corner */}
              <div className={`absolute top-2 right-2 w-8 h-8 bg-gradient-to-br ${p.color} opacity-10 rounded-full blur-xl`}></div>
            </div>
          </motion.div>
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
        <p 
          className="text-[#9CA3AF] mb-6"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          Au total : <span className="text-[#FBBF24] font-bold">450 000 FCFA</span> de prix + incubation
        </p>
        <div className="flex justify-center">
          <div className="badge-premium inline-flex items-center gap-2 px-6 py-3 rounded-full">
            <Crown className="h-4 w-4 text-[#FBBF24]" />
            <span className="text-sm font-semibold" style={{ fontFamily: 'Sora, sans-serif' }}>
              Limited to 40 participants
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default PrizesSection;
