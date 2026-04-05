import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, ArrowRight, Calendar, Users } from "lucide-react";
import { GlobeISoc } from "@/components/ui/GlobeISoc";

const programmeItems = [
  { time: "08h00", title: "Accueil & Petit-déjeuner", day: 1, type: "social" },
  { time: "09h00", title: "Cérémonie d'ouverture", day: 1, type: "keynote" },
  { time: "10h00", title: "Formation des équipes & Idéation", day: 1, type: "workshop" },
  { time: "14h00", title: "Développement & Prototypage", day: 1, type: "coding" },
  { time: "09h00", title: "Sprint final", day: 2, type: "coding" },
  { time: "14h00", title: "Pitch devant le jury", day: 2, type: "presentation" },
  { time: "17h00", title: "Remise des prix & Clôture", day: 2, type: "ceremony" },
];

const getTypeColor = (type: string) => {
  switch (type) {
    case "social": return "bg-[#40B2A4]/10 text-[#40B2A4] border-[#40B2A4]/30";
    case "keynote": return "bg-[#24366E]/10 text-[#24366E] border-[#24366E]/30";
    case "workshop": return "bg-[#F8F9FA] text-[#6C757D] border-[#E9ECEF]";
    case "coding": return "bg-[#40B2A4]/10 text-[#40B2A4] border-[#40B2A4]/30";
    case "presentation": return "bg-[#24366E]/10 text-[#24366E] border-[#24366E]/30";
    case "ceremony": return "bg-gradient-to-r from-[#40B2A4]/10 to-[#24366E]/10 text-[#212529] border-[#E9ECEF]";
    default: return "bg-[#F8F9FA] text-[#6C757D] border-[#E9ECEF]";
  }
};

const ProgrammePreview = () => (
  <section id="programme" className="py-8 sm:py-24 bg-gradient-to-br from-[#F8F9FA] to-white relative overflow-hidden">
    {/* Background decorative elements */}
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-20 left-1/4 w-64 h-64 bg-[#40B2A4]/3 rounded-full blur-3xl animate-float-elegant hidden sm:block"></div>
      <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-[#24366E]/3 rounded-full blur-3xl animate-float-elegant hidden sm:block"></div>
      
      {/* Globe decorations */}
      <motion.div 
        className="absolute top-32 left-10 hidden sm:block"
        animate={{ y: [0, -8, 0], rotate: [0, 6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <GlobeISoc size={50} opacity={0.2} />
      </motion.div>
    </div>
    
    <div className="container relative z-10 px-3 sm:px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-5 sm:mb-16"
      >
        <h2 
          className="font-display text-lg sm:text-4xl sm:text-5xl font-bold text-[#212529] mb-2 sm:mb-4"
          style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800 }}
        >
          Programme en <span className="text-gradient">un coup d'œil</span>
        </h2>
        <div className="w-12 sm:w-24 h-1 bg-gradient-to-r from-[#40B2A4] to-[#24366E] mx-auto rounded-full mb-3 sm:mb-6"></div>
        <p 
          className="text-[#6C757D] max-w-2xl mx-auto text-xs sm:text-lg leading-relaxed hidden sm:block"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          48h d'intense créativité pour transformer vos idées en prototypes fonctionnels.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-3 sm:gap-8 max-w-5xl mx-auto">
        {[1, 2].map((day) => (
          <motion.div
            key={day}
            initial={{ opacity: 0, x: day === 1 ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: (day - 1) * 0.2 }}
            className="bg-white border border-[#E9ECEF] rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden p-3 sm:p-8"
          >
            {/* Day header */}
            <div className="mb-3 sm:mb-6">
              <div className="flex items-center gap-2 sm:gap-4 mb-2 sm:mb-4">
                <div className={`flex h-8 w-8 sm:h-12 sm:w-12 items-center justify-center rounded-lg sm:rounded-xl text-white font-bold text-sm sm:text-lg shadow-lg ${
                  day === 1 
                    ? 'bg-gradient-to-br from-[#40B2A4] to-[#40B2A4]' 
                    : 'bg-gradient-to-br from-[#24366E] to-[#2E4A8C]'
                }`}>
                  J{day}
                </div>
                <div>
                  <h3 
                    className="font-display font-bold text-sm sm:text-xl text-[#212529]"
                    style={{ fontFamily: 'Sora, sans-serif' }}
                  >
                    {day === 1 ? "17 Avril" : "18 Avril"}
                  </h3>
                  <p 
                    className="text-[10px] sm:text-sm text-[#6C757D] hidden sm:block"
                    style={{ fontFamily: 'DM Sans, sans-serif' }}
                  >
                    {day === 1 ? "Idéation & Création" : "Pitch & Récompenses"}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Schedule items - ultra compact sur mobile */}
            <div className="space-y-1.5 sm:space-y-4">
              {programmeItems
                .filter((item) => item.day === day)
                .map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: (day - 1) * 0.2 + i * 0.1 }}
                    className="flex items-center gap-2 sm:gap-4 group/item relative py-1 sm:py-0"
                  >
                    {/* Time */}
                    <div className="flex items-center gap-1 sm:gap-2 min-w-[50px] sm:min-w-[80px]">
                      <Clock size={12} className="text-[#40B2A4] sm:hidden" />
                      <Clock size={14} className="text-[#40B2A4] hidden sm:block" />
                      <span 
                        className="text-[10px] sm:text-sm font-semibold text-[#40B2A4]"
                        style={{ fontFamily: 'Space Mono, monospace' }}
                      >
                        {item.time}
                      </span>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className={`hidden sm:inline-flex px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium mb-1 border ${getTypeColor(item.type)}`}>
                        {item.type}
                      </div>
                      <h4 
                        className="font-display font-semibold text-[11px] sm:text-base text-[#212529] truncate"
                        style={{ fontFamily: 'Sora, sans-serif' }}
                      >
                        {item.title}
                      </h4>
                    </div>
                  </motion.div>
                ))}
            </div>
            
            {/* Decorative elements */}
            <div className={`absolute top-2 right-2 sm:top-4 sm:right-4 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
              day === 1 ? 'bg-[#40B2A4]' : 'bg-[#24366E]'
            }`}></div>
          </motion.div>
        ))}
      </div>

      {/* Bottom CTA - caché sur mobile pour gagner de l'espace */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6 }}
        className="text-center mt-6 sm:mt-16 hidden sm:block"
      >
        <div className="bg-white rounded-xl sm:rounded-2xl border border-[#E9ECEF] shadow-md sm:shadow-lg p-4 sm:p-8 max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-4 sm:mb-8">
            <div className="flex items-center gap-2 text-[#6C757D]">
              <Calendar size={16} className="text-[#40B2A4]" />
              <span style={{ fontFamily: 'DM Sans, sans-serif' }}>17-18 Avril 2026</span>
            </div>
            <div className="flex items-center gap-2 text-[#6C757D]">
              <Users size={16} className="text-[#40B2A4]" />
              <span style={{ fontFamily: 'DM Sans, sans-serif' }}>40 participants maximum</span>
            </div>
          </div>
          
          <Link
            to="/agenda"
            className="btn-premium inline-flex items-center gap-2 sm:gap-3 rounded-lg sm:rounded-xl px-4 sm:px-8 py-2 sm:py-4 text-xs sm:text-sm font-semibold group"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            Voir le programme complet 
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </motion.div>
    </div>

    {/* Decorative bottom gradient */}
    <div className="absolute bottom-0 left-0 right-0 h-1 sm:h-2 bg-gradient-to-r from-[#40B2A4] via-[#24366E] to-[#40B2A4]"></div>
  </section>
);

export default ProgrammePreview;
