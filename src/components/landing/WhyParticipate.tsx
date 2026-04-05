import { motion } from "framer-motion";
import { Lightbulb, Trophy, Users, Rocket } from "lucide-react";
import { GlobeISoc } from "@/components/ui/GlobeISoc";

const reasons = [
  {
    icon: Lightbulb,
    title: "Innover ensemble",
    description: "Transformez vos idées en solutions concrètes pour améliorer la vie étudiante et le campus.",
    color: "orange"
  },
  {
    icon: Trophy,
    title: "Gagner des prix",
    description: "Jusqu'à 450 000 FCFA (en tout) + des mois d'accompagnement pour les meilleurs projets.",
    color: "bleu"
  },
  {
    icon: Users,
    title: "Réseau & Mentoring",
    description: "Accédez à des mentors experts et développez votre réseau professionnel.",
    color: "orange"
  },
  {
    icon: Rocket,
    title: "Lancer votre projet",
    description: "Passez du concept au prototype en 48h avec un accompagnement dédié.",
    color: "bleu"
  },
];

const WhyParticipate = () => (
  <section className="py-8 sm:py-24 bg-gradient-to-br from-[#F8F9FA] to-white relative overflow-hidden">
    {/* Background decorative elements */}
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-20 left-1/4 w-64 h-64 bg-[#40B2A4]/3 rounded-full blur-3xl animate-float-elegant hidden sm:block"></div>
      <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-[#24366E]/3 rounded-full blur-3xl animate-float-elegant hidden sm:block"></div>
      
      {/* Globe decorations */}
      <motion.div 
        className="absolute top-32 right-16 hidden sm:block"
        animate={{ y: [0, -10, 0], rotate: [0, 6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <GlobeISoc size={55} opacity={0.2} />
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
          Pourquoi <span className="text-gradient">participer</span> ?
        </h2>
        <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-[#40B2A4] to-[#24366E] mx-auto rounded-full mb-4 sm:mb-6"></div>
        <p 
          className="text-[#6C757D] max-w-2xl mx-auto text-xs sm:text-lg leading-relaxed hidden sm:block"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          Une expérience unique pour développer vos compétences et porter vos idées avec l'accompagnement des meilleurs experts. Ouvert à tous les étudiants, avec une priorité pour ceux de l'ESMT.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-6 lg:gap-8">
        {reasons.map((r, i) => (
          <motion.div
            key={r.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="group relative overflow-hidden rounded-lg sm:rounded-xl sm:rounded-2xl p-2 sm:p-4 lg:p-8 bg-white border border-[#E9ECEF] shadow-md sm:shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {/* Gradient background on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${
              r.color === 'orange' 
                ? 'from-[#40B2A4]/5 to-[#40B2A4]/5' 
                : 'from-[#24366E]/5 to-[#2E4A8C]/5'
            } opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
            
            {/* Icon container */}
            <div className={`relative z-10 mb-2 sm:mb-6 flex h-6 w-6 sm:h-12 sm:w-12 lg:h-16 lg:w-16 items-center justify-center rounded-lg sm:rounded-xl transition-all duration-300 ${
              r.color === 'orange'
                ? 'bg-[#40B2A4]/10 border-2 border-[#40B2A4]/20 group-hover:bg-[#40B2A4]/20 group-hover:border-[#40B2A4]/40'
                : 'bg-[#24366E]/10 border-2 border-[#24366E]/20 group-hover:bg-[#24366E]/20 group-hover:border-[#24366E]/40'
            }`}>
              <r.icon className={`h-3 w-3 sm:h-6 sm:w-6 lg:h-8 lg:w-8 transition-colors duration-300 ${
                r.color === 'orange' ? 'text-[#40B2A4]' : 'text-[#24366E]'
              }`} />
            </div>
            
            {/* Content */}
            <div className="relative z-10">
              <h3 
                className="font-display font-bold text-[10px] sm:text-base lg:text-xl mb-1 sm:mb-3 text-[#212529] transition-colors duration-300"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                {r.title}
              </h3>
              <p 
                className="text-[#6C757D] leading-relaxed text-[9px] sm:text-sm hidden sm:block"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                {r.description}
              </p>
            </div>
            
            {/* Decorative elements */}
            <div className={`absolute top-2 right-2 w-1.5 h-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
              r.color === 'orange' ? 'bg-[#40B2A4]' : 'bg-[#24366E]'
            } hidden sm:block`}></div>
            
            {/* Bottom accent line */}
            <div className={`absolute bottom-0 left-0 right-0 h-0.5 sm:h-1 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ${
              r.color === 'orange' 
                ? 'bg-gradient-to-r from-[#40B2A4] to-[#40B2A4]' 
                : 'bg-gradient-to-r from-[#24366E] to-[#2E4A8C]'
            }`}></div>
          </motion.div>
        ))}
      </div>
    </div>

    {/* Decorative bottom gradient */}
    <div className="absolute bottom-0 left-0 right-0 h-1 sm:h-2 bg-gradient-to-r from-[#40B2A4] via-[#24366E] to-[#40B2A4]"></div>
  </section>
);

export default WhyParticipate;
