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
  <section className="py-24 bg-gradient-to-br from-[#F8F9FA] to-white relative overflow-hidden">
    {/* Background decorative elements */}
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-20 left-1/4 w-64 h-64 bg-[#FEEB09]/3 rounded-full blur-3xl animate-float-elegant"></div>
      <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-[#24366E]/3 rounded-full blur-3xl animate-float-elegant" style={{ animationDelay: '2s' }}></div>
      
      {/* Globe decorations */}
      <motion.div 
        className="absolute top-32 right-16"
        animate={{ y: [0, -10, 0], rotate: [0, 6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <GlobeISoc size={55} opacity={0.2} />
      </motion.div>
      <motion.div 
        className="absolute bottom-32 left-10"
        animate={{ y: [0, -8, 0], rotate: [0, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <GlobeISoc size={65} opacity={0.15} />
      </motion.div>
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
          Pourquoi <span className="text-gradient">participer</span> ?
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-[#FEEB09] to-[#24366E] mx-auto rounded-full mb-6"></div>
        <p 
          className="text-[#6C757D] max-w-2xl mx-auto text-lg leading-relaxed"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          Une expérience unique pour développer vos compétences et porter vos idées avec l'accompagnement des meilleurs experts. Ouvert à tous les étudiants, avec une priorité pour ceux de l'ESMT.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {reasons.map((r, i) => (
          <motion.div
            key={r.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="group relative overflow-hidden rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-8 bg-white border border-[#E9ECEF] shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {/* Gradient background on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${
              r.color === 'orange' 
                ? 'from-[#FEEB09]/5 to-[#FEEB09]/5' 
                : 'from-[#24366E]/5 to-[#2E4A8C]/5'
            } opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
            
            {/* Icon container */}
            <div className={`relative z-10 mb-3 sm:mb-6 flex h-8 w-8 sm:h-12 sm:w-12 lg:h-16 lg:w-16 items-center justify-center rounded-xl sm:rounded-2xl transition-all duration-300 ${
              r.color === 'orange'
                ? 'bg-[#FEEB09]/10 border-2 border-[#FEEB09]/20 group-hover:bg-[#FEEB09]/20 group-hover:border-[#FEEB09]/40'
                : 'bg-[#24366E]/10 border-2 border-[#24366E]/20 group-hover:bg-[#24366E]/20 group-hover:border-[#24366E]/40'
            }`}>
              <r.icon className={`h-4 w-4 sm:h-6 sm:w-6 lg:h-8 lg:w-8 transition-colors duration-300 ${
                r.color === 'orange' ? 'text-[#FEEB09]' : 'text-[#24366E]'
              }`} />
            </div>
            
            {/* Content */}
            <div className="relative z-10">
              <h3 
                className="font-display font-bold text-xs sm:text-base lg:text-xl mb-2 sm:mb-3 text-[#212529] transition-colors duration-300"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                {r.title}
              </h3>
              <p 
                className="text-[#6C757D] leading-relaxed text-xs sm:text-sm font-medium"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                {r.description}
              </p>
            </div>
            
            {/* Decorative elements */}
            <div className={`absolute top-4 right-4 w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
              r.color === 'orange' ? 'bg-[#FEEB09]' : 'bg-[#24366E]'
            }`}></div>
            
            {/* Bottom accent line */}
            <div className={`absolute bottom-0 left-0 right-0 h-1 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ${
              r.color === 'orange' 
                ? 'bg-gradient-to-r from-[#FEEB09] to-[#FEEB09]' 
                : 'bg-gradient-to-r from-[#24366E] to-[#2E4A8C]'
            }`}></div>
          </motion.div>
        ))}
      </div>
    </div>

    {/* Decorative bottom gradient */}
    <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-[#FEEB09] via-[#24366E] to-[#FEEB09]"></div>
  </section>
);

export default WhyParticipate;
