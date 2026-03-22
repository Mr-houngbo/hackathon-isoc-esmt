import { motion } from "framer-motion";
import { InscriptionData } from "@/types/inscription";
import { Code, Zap, Rocket } from "lucide-react";

interface Props {
  data: InscriptionData;
  onChange: (d: Partial<InscriptionData>) => void;
  errors?: Record<string, string>;
}

const NIVEAUX_TECHNIQUES = [
  { 
    value: 'debutant', 
    label: 'Débutant', 
    desc: "Peu d'expérience en développement ou design", 
    icon: '🌱'
  },
  { 
    value: 'intermediaire', 
    label: 'Intermédiaire', 
    desc: 'Quelques projets réalisés, à l\'aise avec les outils', 
    icon: '⚡'
  },
  { 
    value: 'avance', 
    label: 'Avancé', 
    desc: 'Expérience solide, capable de livrer un MVP en 48h', 
    icon: '🚀'
  }
];

const Etape6Profil = ({ data, onChange, errors = {} }: Props) => {
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
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#FEEB09] to-[#24366E] flex items-center justify-center">
            <Code size={24} className="text-white" />
          </div>
          <h3 
            className="font-display text-2xl font-bold text-[#212529]"
            style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700 }}
          >
            {data.type_candidature === 'individuel' ? 'Votre profil technique' : 'Profil technique de l\'équipe'}
          </h3>
        </div>
        <p 
          className="text-[#6C757D] text-lg"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          Évaluez votre niveau technique global
        </p>
        <div className="w-16 h-1 bg-gradient-to-r from-[#FEEB09] to-[#24366E] mx-auto rounded-full mt-4"></div>
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
          Niveau technique global <span className="text-[#DC2626]">*</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {NIVEAUX_TECHNIQUES.map((niveau) => (
            <button
              key={niveau.value}
              type="button"
              onClick={() => onChange({ niveau_technique: niveau.value as 'debutant' | 'intermediaire' | 'avance' })}
              className={`p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                data.niveau_technique === niveau.value
                  ? 'border-[#FEEB09] bg-[#FEEB09]/10'
                  : 'border-[#E9ECEF] bg-white hover:border-[#FEEB09]/30'
              }`}
            >
              <div className="flex flex-col items-center gap-3">
                <div className="text-3xl">{niveau.icon}</div>
                <div className="text-center">
                  <span 
                    className="font-display text-sm font-bold block"
                    style={{ fontFamily: 'Sora, sans-serif' }}
                  >
                    <span className={data.niveau_technique === niveau.value ? 'text-[#FEEB09]' : 'text-[#212529]'}>
                      {niveau.label}
                    </span>
                  </span>
                  <span 
                    className="text-xs mt-1 block"
                    style={{ fontFamily: 'DM Sans, sans-serif' }}
                  >
                    <span className={data.niveau_technique === niveau.value ? 'text-[#FEEB09]' : 'text-[#6C757D]'}>
                      {niveau.desc}
                    </span>
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
        {errors.niveau_technique && (
          <p className="text-[#DC2626] text-xs mt-3 text-center" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            {errors.niveau_technique}
          </p>
        )}
      </motion.div>

      {/* Info sur le niveau */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-gradient-to-r from-[#FEEB09]/10 to-[#24366E]/10 rounded-2xl border border-[#E9ECEF] p-4"
      >
        <p 
          className="text-center text-sm"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          <span className="text-[#212529]">
            💡 Soyez honnête dans votre évaluation. Le jury prendra en compte votre niveau pour adapter les défis.
          </span>
        </p>
      </motion.div>
    </div>
  );
};

export default Etape6Profil;
