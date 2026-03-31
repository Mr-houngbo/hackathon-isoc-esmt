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
    color: 'text-[#40B2A4]'
  },
  { 
    value: 'intermediaire', 
    label: 'Intermédiaire', 
    desc: 'Projets académiques réalisés', 
    icon: Code, 
    color: 'text-[#40B2A4]'
  },
  { 
    value: 'avance', 
    label: 'Avancé', 
    desc: 'Projets personnels ou professionnels', 
    icon: Rocket, 
    color: 'text-[#24366E]'
  }
];

const competencesEquipe = [
  { value: 'Dev Web', icon: Code, color: 'text-[#40B2A4]' },
  { value: 'Dev Mobile', icon: Zap, color: 'text-[#24366E]' },
  { value: 'Design UI-UX', icon: Code, color: 'text-[#40B2A4]' },
  { value: 'Data Science', icon: Code, color: 'text-[#24366E]' },
  { value: 'IA / Machine Learning', icon: Zap, color: 'text-[#40B2A4]' },
  { value: 'Business / Gestion', icon: Code, color: 'text-[#24366E]' },
  { value: 'Communication', icon: Code, color: 'text-[#40B2A4]' },
  { value: 'Hardware / IoT', icon: Zap, color: 'text-[#24366E]' }
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
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#40B2A4] to-[#24366E] flex items-center justify-center">
            <Code size={24} className="text-white" />
          </div>
          <h3 
            className="font-display text-2xl font-bold text-[#212529]"
            style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700 }}
          >
            Profil technique
          </h3>
        </div>
        <p 
          className="text-[#40B2A4] text-lg"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          Compétences et expérience de l'équipe
        </p>
        <div className="w-16 h-1 bg-gradient-to-r from-[#40B2A4] to-[#24366E] mx-auto rounded-full mt-4"></div>
      </motion.div>

      {/* Niveau technique */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-2xl border border-[#E9ECEF] p-6 shadow-lg"
      >
        <h4 
          className="font-display text-lg font-semibold text-[#212529] mb-4"
          style={{ fontFamily: 'Sora, sans-serif' }}
        >
          Niveau technique global
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {niveauxTechniques.map((niveau) => (
            <button
              key={niveau.value}
              type="button"
              onClick={() => onChange({ niveau_technique: niveau.value })}
              className={`p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                data.niveau_technique === niveau.value
                  ? 'border-[#40B2A4] bg-[#40B2A4]/10'
                  : 'border-[#E9ECEF] bg-white hover:border-[#40B2A4]/30'
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <niveau.icon 
                  size={24} 
                  className={data.niveau_technique === niveau.value ? niveau.color : 'text-[#40B2A4]'}
                />
                <span 
                  className="font-display text-sm font-bold"
                  style={{ fontFamily: 'Sora, sans-serif' }}
                >
                  <span className={data.niveau_technique === niveau.value ? niveau.color : 'text-[#212529]'}>
                    {niveau.label}
                  </span>
                </span>
                <span 
                  className="text-xs text-center"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  <span className={data.niveau_technique === niveau.value ? niveau.color : 'text-[#40B2A4]'}>
                    {niveau.desc}
                  </span>
                </span>
              </div>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Compétences équipe */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-2xl border border-[#E9ECEF] p-6 shadow-lg"
      >
        <h4 
          className="font-display text-lg font-semibold text-[#212529] mb-4"
          style={{ fontFamily: 'Sora, sans-serif' }}
        >
          Compétences techniques de l'équipe
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {competencesEquipe.map((competence) => (
            <button
              key={competence.value}
              type="button"
              onClick={() => toggleCompetence(competence.value)}
              className={`p-3 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                data.competences_equipe.includes(competence.value)
                  ? 'border-[#40B2A4] bg-[#40B2A4]/10'
                  : 'border-[#E9ECEF] bg-white hover:border-[#40B2A4]/30'
              }`}
            >
              <competence.icon 
                size={20} 
                className={data.competences_equipe.includes(competence.value) ? competence.color : 'text-[#40B2A4]'}
              />
              <span 
                className="text-xs mt-1 block"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                <span className={data.competences_equipe.includes(competence.value) ? competence.color : 'text-[#40B2A4]'}>
                  {competence.value}
                </span>
              </span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Liens réseaux sociaux */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white rounded-2xl border border-[#E9ECEF] p-6 shadow-lg"
      >
        <h4 
          className="font-display text-lg font-semibold text-[#212529] mb-4"
          style={{ fontFamily: 'Sora, sans-serif' }}
        >
          Réseaux sociaux de l'équipe
        </h4>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block">
              <span 
                className="font-display text-sm font-semibold text-[#212529] mb-2 block"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                Instagram (optionnel)
              </span>
              <input
                type="text"
                value={data.instagram}
                onChange={(e) => onChange({ instagram: e.target.value })}
                placeholder="@votre_equipe"
                className="w-full px-4 py-3 rounded-xl border border-[#E9ECEF] bg-white text-[#212529] placeholder-[#40B2A4] focus:outline-none focus:ring-2 focus:ring-[#40B2A4]/20 focus:border-[#40B2A4]/50 transition-all"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              />
            </label>
          </div>

          <div>
            <label className="block">
              <span 
                className="font-display text-sm font-semibold text-[#212529] mb-2 block"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                LinkedIn (optionnel)
              </span>
              <input
                type="text"
                value={data.linkedin}
                onChange={(e) => onChange({ linkedin: e.target.value })}
                placeholder="linkedin.com/in/votre-entreprise"
                className="w-full px-4 py-3 rounded-xl border border-[#E9ECEF] bg-white text-[#212529] placeholder-[#40B2A4] focus:outline-none focus:ring-2 focus:ring-[#40B2A4]/20 focus:border-[#40B2A4]/50 transition-all"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              />
            </label>
          </div>
        </div>
      </motion.div>

      {/* Portfolio */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white rounded-2xl border border-[#E9ECEF] p-6 shadow-lg"
      >
        <label className="block">
          <span 
            className="font-display text-sm font-semibold text-[#212529] mb-2 block"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            Portfolio ou projets précédents (optionnel)
          </span>
          <textarea
            value={data.portfolio}
            onChange={(e) => onChange({ portfolio: e.target.value })}
            placeholder="Lien vers votre portfolio ou description de projets réalisés..."
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-[#E9ECEF] bg-white text-[#212529] placeholder-[#40B2A4] focus:outline-none focus:ring-2 focus:ring-[#40B2A4]/20 focus:border-[#40B2A4]/50 transition-all resize-none"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          />
        </label>
      </motion.div>
    </div>
  );
};

export default Etape6Profil;
