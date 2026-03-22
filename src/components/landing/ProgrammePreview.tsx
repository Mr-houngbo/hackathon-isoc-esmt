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
    case "social": return "bg-[#FEEB09]/10 text-[#FEEB09] border-[#FEEB09]/30";
    case "keynote": return "bg-[#24366E]/10 text-[#24366E] border-[#24366E]/30";
    case "workshop": return "bg-[#F8F9FA] text-[#6C757D] border-[#E9ECEF]";
    case "coding": return "bg-[#FEEB09]/10 text-[#FEEB09] border-[#FEEB09]/30";
    case "presentation": return "bg-[#24366E]/10 text-[#24366E] border-[#24366E]/30";
    case "ceremony": return "bg-gradient-to-r from-[#FEEB09]/10 to-[#24366E]/10 text-[#212529] border-[#E9ECEF]";
    default: return "bg-[#F8F9FA] text-[#6C757D] border-[#E9ECEF]";
  }
};

const ProgrammePreview = () => (
  <section id="programme" className="py-24 bg-gradient-to-br from-[#F8F9FA] to-white relative overflow-hidden">
    {/* Background decorative elements */}
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-20 left-1/4 w-64 h-64 bg-[#FEEB09]/3 rounded-full blur-3xl animate-float-elegant"></div>
      <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-[#24366E]/3 rounded-full blur-3xl animate-float-elegant" style={{ animationDelay: '2s' }}></div>
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
          Programme en <span className="text-gradient">un coup d'œil</span>
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-[#FEEB09] to-[#24366E] mx-auto rounded-full mb-6"></div>
        <p 
          className="text-[#6C757D] max-w-2xl mx-auto text-lg leading-relaxed"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          48h d'intense créativité pour transformer vos idées en prototypes fonctionnels.
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
            className="bg-white border border-[#E9ECEF] rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden p-8"
          >
            {/* Day header */}
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-white font-bold text-lg shadow-lg ${
                  day === 1 
                    ? 'bg-gradient-to-br from-[#FEEB09] to-[#FEEB09]' 
                    : 'bg-gradient-to-br from-[#24366E] to-[#2E4A8C]'
                }`}>
                  J{day}
                </div>
                <div>
                  <h3 
                    className="font-display font-bold text-xl text-[#212529]"
                    style={{ fontFamily: 'Sora, sans-serif' }}
                  >
                    {day === 1 ? "17 Avril" : "18 Avril"}
                  </h3>
                  <p 
                    className="text-sm text-[#6C757D]"
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
                    className="flex items-start gap-4 group/item relative"
                  >
                    {/* Time */}
                    <div className="flex items-center gap-2 min-w-[80px]">
                      <Clock size={14} className="text-[#FEEB09]" />
                      <span 
                        className="text-sm font-semibold text-[#FEEB09]"
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
                        className="font-display font-semibold text-[#212529] mb-1"
                        style={{ fontFamily: 'Sora, sans-serif' }}
                      >
                        {item.title}
                      </h4>
                    </div>
                    
                    {/* Decorative line */}
                    <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-[#FEEB09] to-transparent opacity-20"></div>
                  </motion.div>
                ))}
            </div>
            
            {/* Decorative elements */}
            <div className={`absolute top-4 right-4 w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
              day === 1 ? 'bg-[#FEEB09]' : 'bg-[#24366E]'
            }`}></div>
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
        <div className="bg-white rounded-2xl border border-[#E9ECEF] shadow-lg p-8 max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 text-[#6C757D]">
              <Calendar size={16} className="text-[#FEEB09]" />
              <span style={{ fontFamily: 'DM Sans, sans-serif' }}>17-18 Avril 2026</span>
            </div>
            <div className="flex items-center gap-2 text-[#6C757D]">
              <Users size={16} className="text-[#FEEB09]" />
              <span style={{ fontFamily: 'DM Sans, sans-serif' }}>40 participants maximum</span>
            </div>
          </div>
          
          <Link
            to="/agenda"
            className="btn-premium inline-flex items-center gap-3 rounded-xl px-8 py-4 text-sm font-semibold group"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            Voir le programme complet 
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </motion.div>
    </div>

    {/* Decorative bottom gradient */}
    <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-[#FEEB09] via-[#24366E] to-[#FEEB09]"></div>
  </section>
);

export default ProgrammePreview;
