import { motion } from "framer-motion";
import { InscriptionData } from "@/types/inscription";
import { Zap, Code, Rocket, CheckCircle, Instagram, Linkedin } from "lucide-react";

interface Props {
  data: InscriptionData;
  onChange: (d: Partial<InscriptionData>) => void;
}

const niveauxTechniques = [
  { 
    value: 'debutant', 
    label: 'Débutant', 
    desc: 'Premières expériences en développement', 
    icon: Zap, 
    color: 'text-[#9CA3AF]'
  },
  { 
    value: 'intermediaire', 
    label: 'Intermédiaire', 
    desc: 'Projets académiques réalisés', 
    icon: Code, 
    color: 'text-[#FBBF24]'
  },
  { 
    value: 'avance', 
    label: 'Avancé', 
    desc: 'Projets personnels ou professionnels', 
    icon: Rocket, 
    color: 'text-[#00873E]'
  }
];

const competencesEquipe = [
  { value: 'Dev Web', icon: Code, color: 'text-[#FBBF24]' },
  { value: 'Dev Mobile', icon: Zap, color: 'text-[#00873E]' },
  { value: 'Design UI-UX', icon: Code, color: 'text-[#FBBF24]' },
  { value: 'Data Science', icon: Code, color: 'text-[#00873E]' },
  { value: 'IA / Machine Learning', icon: Zap, color: 'text-[#FBBF24]' },
  { value: 'Business / Gestion', icon: Code, color: 'text-[#00873E]' },
  { value: 'Communication', icon: Code, color: 'text-[#FBBF24]' },
  { value: 'Hardware / IoT', icon: Zap, color: 'text-[#00873E]' }
];

const Etape6Profil = ({ data, onChange }: Props) => {
  const toggleCompetence = (c: string) => {
    const list = data.competences_equipe.includes(c)
      ? data.competences_equipe.filter((x) => x !== c)
      : [...data.competences_equipe, c];
    onChange({ competences_equipe: list });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#FBBF24] to-[#00873E] flex items-center justify-center">
            <Zap size={24} className="text-[#F9FAFB]" />
          </div>
          <h3 
            className="font-display text-2xl font-bold text-[#F9FAFB]"
            style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700 }}
          >
            Profil & Compétences
          </h3>
        </div>
        <p 
          className="text-[#9CA3AF] text-lg"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          Décrivez le niveau technique de votre équipe
        </p>
        <div className="w-16 h-1 bg-gradient-to-r from-[#FBBF24] to-[#00873E] mx-auto rounded-full mt-4"></div>
      </motion.div>

      {/* Niveau technique global */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <label 
          className="block text-sm font-semibold text-[#F9FAFB] mb-4"
          style={{ fontFamily: 'Sora, sans-serif' }}
        >
          Niveau technique global <span className="text-[#DC2626]">*</span>
        </label>
        <div className="grid sm:grid-cols-3 gap-6">
          {niveauxTechniques.map((niv, index) => (
            <motion.button
              key={niv.value}
              type="button"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onChange({ niveau_technique: niv.value })}
              className={`relative overflow-hidden rounded-xl border-2 p-6 transition-all duration-300 group ${
                data.niveau_technique === niv.value
                  ? 'border-[#FBBF24] bg-[#FBBF24]/10 shadow-lg shadow-[#FBBF24]/25'
                  : 'border-[#2D3748] bg-[#111827] hover:border-[#FBBF24]/50'
              }`}
            >
              {/* Background decoration */}
              <div className={`absolute inset-0 bg-gradient-to-br ${
                data.niveau_technique === niv.value ? 'from-[#FBBF24]/5 to-[#00873E]/5' : 'from-transparent to-transparent'
              } group-hover:from-[#FBBF24]/3 group-hover:to-[#00873E]/3 transition-all duration-300`}></div>
              
              {/* Content */}
              <div className="relative z-10 flex flex-col items-center gap-3">
                <niv.icon size={32} className={data.niveau_technique === niv.value ? 'text-[#FBBF24]' : niv.color} />
                <span 
                  className={`font-display font-bold text-lg ${
                    data.niveau_technique === niv.value ? 'text-[#F9FAFB]' : 'text-[#9CA3AF] group-hover:text-[#F9FAFB]'
                  }`}
                  style={{ fontFamily: 'Sora, sans-serif' }}
                >
                  {niv.label}
                </span>
                <span 
                  className="text-xs text-center"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  {niv.desc}
                </span>
              </div>
              
              {/* Selection indicator */}
              {data.niveau_technique === niv.value && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="absolute top-3 right-3 w-6 h-6 bg-[#00873E] rounded-full flex items-center justify-center"
                >
                  <CheckCircle size={16} className="text-[#F9FAFB]" />
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Compétences combinées de l'équipe */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <label 
          className="block text-sm font-semibold text-[#F9FAFB] mb-4"
          style={{ fontFamily: 'Sora, sans-serif' }}
        >
          Compétences combinées de l'équipe
        </label>
        <div className="flex flex-wrap gap-3">
          {competencesEquipe.map((comp) => (
            <button 
              key={comp.value} 
              type="button" 
              onClick={() => toggleCompetence(comp.value)}
              className={`relative overflow-hidden rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all duration-300 group ${
                data.competences_equipe.includes(comp.value)
                  ? 'border-[#00873E] bg-[#00873E]/10 text-[#00873E] shadow-lg shadow-[#00873E]/25' 
                  : 'border-[#2D3748] bg-[#111827] text-[#9CA3AF] hover:border-[#00873E]/50 hover:text-[#F9FAFB]'
              }`}
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              {/* Background decoration */}
              <div className={`absolute inset-0 bg-gradient-to-br ${
                data.competences_equipe.includes(comp.value) 
                  ? 'from-[#00873E]/5 to-[#FBBF24]/5' 
                  : 'from-transparent to-transparent'
              } group-hover:from-[#00873E]/3 group-hover:to-[#FBBF24]/3 transition-all duration-300`}></div>
              
              {/* Content */}
              <div className="relative z-10 flex items-center gap-2">
                <comp.icon size={16} className={data.competences_equipe.includes(comp.value) ? 'text-[#00873E]' : comp.color} />
                <span>{comp.value}</span>
              </div>
              
              {/* Selection indicator */}
              {data.competences_equipe.includes(comp.value) && (
                <div className="absolute top-1 right-1">
                  <CheckCircle size={12} className="text-[#00873E]" />
                </div>
              )}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Réseaux sociaux */}
      <motion.div 
        className="card-premium p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-[#FBBF24]/20 flex items-center justify-center">
            <Instagram size={20} className="text-[#FBBF24]" />
          </div>
          <h4 
            className="font-display text-xl font-bold text-[#F9FAFB]"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            Réseaux sociaux
          </h4>
        </div>
        
        <div className="grid sm:grid-cols-2 gap-6">
          {/* Instagram */}
          <div>
            <label 
              className="block text-sm font-semibold text-[#F9FAFB] mb-3"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              Handle Instagram
            </label>
            <div className="relative">
              <input 
                type="text" 
                value={data.handle_instagram} 
                onChange={(e) => onChange({ handle_instagram: e.target.value })}
                placeholder="@votre_handle"
                className="w-full rounded-xl border-[#2D3748] bg-[#1F2937] px-4 py-3 text-[#F9FAFB] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#FBBF24] focus:border-transparent transition-all duration-300"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
                <Instagram size={18} />
              </div>
            </div>
          </div>
          
          {/* LinkedIn */}
          <div>
            <label 
              className="block text-sm font-semibold text-[#F9FAFB] mb-3"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              Handle LinkedIn
            </label>
            <div className="relative">
              <input 
                type="text" 
                value={data.handle_linkedin} 
                onChange={(e) => onChange({ handle_linkedin: e.target.value })}
                placeholder="linkedin.com/in/..."
                className="w-full rounded-xl border-[#2D3748] bg-[#1F2937] px-4 py-3 text-[#F9FAFB] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#FBBF24] focus:border-transparent transition-all duration-300"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
                <Linkedin size={18} />
              </div>
            </div>
          </div>
        </div>
        
        <p 
          className="text-xs text-[#9CA3AF] mt-4 text-center"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          Optionnel - Aidez-nous à mieux connaître votre équipe
        </p>
      </motion.div>
    </div>
  );
};

export default Etape6Profil;
