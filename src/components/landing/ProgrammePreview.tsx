import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, ArrowRight, Calendar, Users } from "lucide-react";

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
    case "social": return "bg-[#FBBF24]/10 text-[#FBBF24] border-[#FBBF24]/30";
    case "keynote": return "bg-[#00873E]/10 text-[#00873E] border-[#00873E]/30";
    case "workshop": return "bg-[#111827] text-[#9CA3AF] border-[#2D3748]";
    case "coding": return "bg-[#00873E]/10 text-[#00873E] border-[#00873E]/30";
    case "presentation": return "bg-[#FBBF24]/10 text-[#FBBF24] border-[#FBBF24]/30";
    case "ceremony": return "bg-gradient-to-r from-[#00873E]/10 to-[#FBBF24]/10 text-[#F9FAFB] border-[#2D3748]";
    default: return "bg-[#111827] text-[#9CA3AF] border-[#2D3748]";
  }
};

const ProgrammePreview = () => (
  <section id="programme" className="py-24 bg-[#111827] relative overflow-hidden">
    {/* Background decoration */}
    <div className="absolute inset-0 bg-gradient-to-br from-[#00873E]/3 to-transparent"></div>
    
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
          Programme en <span className="text-gradient">un coup d'œil</span>
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-[#00873E] to-[#FBBF24] mx-auto rounded-full"></div>
        <p 
          className="mt-6 text-[#9CA3AF] max-w-2xl mx-auto text-lg"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          48h d'intense créativité pour transformer vos idées en prototypes.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {[1, 2].map((day) => (
          <motion.div
            key={day}
            initial={{ opacity: 0, x: day === 1 ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: (day - 1) * 0.2 }}
            className="card-premium group relative overflow-hidden rounded-2xl p-8"
          >
            {/* Day header */}
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#00873E] to-[#006B31] text-[#F9FAFB] font-bold text-lg shadow-lg">
                  J{day}
                </div>
                <div>
                  <h3 
                    className="font-display font-bold text-xl text-[#F9FAFB]"
                    style={{ fontFamily: 'Sora, sans-serif' }}
                  >
                    {day === 1 ? "3 Avril" : "4 Avril"}
                  </h3>
                  <p 
                    className="text-sm text-[#9CA3AF]"
                    style={{ fontFamily: 'DM Sans, sans-serif' }}
                  >
                    {day === 1 ? "Idéation & Création" : "Pitch & Récompenses"}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Schedule items */}
            <div className="space-y-4">
              {programmeItems
                .filter((item) => item.day === day)
                .map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: (day - 1) * 0.2 + i * 0.1 }}
                    className="flex items-start gap-4 group/item"
                  >
                    {/* Time */}
                    <div className="flex items-center gap-2 min-w-[80px]">
                      <Clock size={14} className="text-[#FBBF24]" />
                      <span 
                        className="text-sm font-semibold text-[#FBBF24]"
                        style={{ fontFamily: 'Space Mono, monospace' }}
                      >
                        {item.time}
                      </span>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <div className={`inline-flex px-3 py-1 rounded-full text-xs font-medium mb-2 border ${getTypeColor(item.type)}`}>
                        {item.type}
                      </div>
                      <h4 
                        className="font-display font-semibold text-[#F9FAFB] mb-1"
                        style={{ fontFamily: 'Sora, sans-serif' }}
                      >
                        {item.title}
                      </h4>
                    </div>
                    
                    {/* Decorative line */}
                    <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-[#00873E] to-transparent opacity-20"></div>
                  </motion.div>
                ))}
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-4 right-4 w-2 h-2 bg-[#FBBF24] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
          <div className="flex items-center gap-2 text-[#9CA3AF]">
            <Calendar size={16} className="text-[#FBBF24]" />
            <span style={{ fontFamily: 'DM Sans, sans-serif' }}>3-4 Avril 2026</span>
          </div>
          <div className="flex items-center gap-2 text-[#9CA3AF]">
            <Users size={16} className="text-[#FBBF24]" />
            <span style={{ fontFamily: 'DM Sans, sans-serif' }}>40 participants maximum</span>
          </div>
        </div>
        
        <Link
          to="/agenda"
          className="btn-premium inline-flex items-center gap-3 rounded-xl px-8 py-4 text-sm font-semibold text-[#F9FAFB] group"
          style={{ fontFamily: 'Sora, sans-serif' }}
        >
          Voir le programme complet 
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
        </Link>
      </motion.div>
    </div>
  </section>
);

export default ProgrammePreview;
