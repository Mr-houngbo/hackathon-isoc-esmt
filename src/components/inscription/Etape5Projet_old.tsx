import { motion } from "framer-motion";
import { InscriptionData } from "@/types/inscription";
import { Lightbulb, HelpCircle, Brain, Code, Zap, Rocket, CheckCircle } from "lucide-react";

interface Props {
  data: InscriptionData;
  onChange: (d: Partial<InscriptionData>) => void;
}

const domaines = [
  { value: 'Vie étudiante', label: 'Vie étudiante', icon: Code, color: 'text-[#40B2A4]' },
  { value: 'Administration', label: 'Administration', icon: Code, color: 'text-[#40B2A4]' },
  { value: 'Pédagogie', label: 'Pédagogie', icon: Code, color: 'text-[#40B2A4]' },
  { value: 'Campus', label: 'Campus', icon: Code, color: 'text-[#40B2A4]' },
  { value: 'Autre', label: 'Autre', icon: Code, color: 'text-[#6C757D]' }
];

const niveauxAvancement = [
  { value: 'concept', label: 'Concept', desc: 'Idée sur papier', icon: Lightbulb },
  { value: 'esquisse', label: 'Esquisse', desc: 'Maquettes/Wireframes', icon: Code },
  { value: 'prototype', label: 'Prototype', desc: 'Version fonctionnelle', icon: Zap }
];

const Etape5Projet = ({ data, onChange }: Props) => {
  const wordCount = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

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
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#40B2A4] to-[#40B2A4] flex items-center justify-center">
            <Lightbulb size={24} className="text-white" />
          </div>
          <h3 
            className="font-display text-2xl font-bold text-[#212529]"
            style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700 }}
          >
            Votre projet
          </h3>
        </div>
        <p 
          className="text-[#6C757D] text-lg"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          Décrivez votre projet innovant
        </p>
        <div className="w-16 h-1 bg-gradient-to-r from-[#40B2A4] to-[#40B2A4] mx-auto rounded-full mt-4"></div>
      </motion.div>

      {/* Question projet */}
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
          Avez-vous déjà un projet ? <span className="text-[#DC2626]">*</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => onChange({ a_projet: 'oui' })}
            className={`p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
              data.a_projet === 'oui'
                ? 'border-[#40B2A4] bg-[#40B2A4]/10'
                : 'border-[#E9ECEF] bg-white hover:border-[#40B2A4]/30'
            }`}
          >
            <div className="flex flex-col items-center gap-2">
              <CheckCircle 
                size={24} 
                className={data.a_projet === 'oui' ? 'text-[#40B2A4]' : 'text-[#6C757D]'}
              />
              <span 
                className="font-display text-sm font-bold"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                <span className={data.a_projet === 'oui' ? 'text-[#40B2A4]' : 'text-[#212529]'}>
                  Oui
                </span>
              </span>
            </div>
          </button>
          <button
            type="button"
            onClick={() => onChange({ a_projet: 'non' })}
            className={`p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
              data.a_projet === 'non'
                ? 'border-[#40B2A4] bg-[#40B2A4]/10'
                : 'border-[#E9ECEF] bg-white hover:border-[#40B2A4]/30'
            }`}
          >
            <div className="flex flex-col items-center gap-2">
              <CheckCircle 
                size={24} 
                className={data.a_projet === 'non' ? 'text-[#40B2A4]' : 'text-[#6C757D]'}
              />
              <span 
                className="font-display text-sm font-bold"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                <span className={data.a_projet === 'non' ? 'text-[#40B2A4]' : 'text-[#212529]'}>
                  Non
                </span>
              </span>
            </div>
          </button>
        </div>
      </motion.div>

      {/* Champs du projet - uniquement si a_projet === 'oui' */}
      {data.a_projet === 'oui' && (
        <>
          {/* Form Grid */}
          <div className="grid sm:grid-cols-2 gap-6">
        {/* Nom du projet */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-2xl border border-[#E9ECEF] p-6 shadow-lg"
        >
          <label className="block">
            <span 
              className="font-display text-sm font-semibold text-[#212529] mb-2 block"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              Nom du projet <span className="text-[#DC2626]">*</span>
            </span>
            <input
              type="text"
              value={data.nom_projet || ''}
              onChange={(e) => onChange({ nom_projet: e.target.value })}
              placeholder="Nom de votre projet"
              className="w-full px-4 py-3 rounded-xl border border-[#E9ECEF] bg-white text-[#212529] placeholder-[#6C757D] focus:outline-none focus:ring-2 focus:ring-[#40B2A4]/20 focus:border-[#40B2A4]/50 transition-all"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            />
          </label>
        </motion.div>

        {/* Domaine */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl border border-[#E9ECEF] p-6 shadow-lg"
        >
          <label className="block">
            <span 
              className="font-display text-sm font-semibold text-[#212529] mb-2 block"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              Domaine concerné <span className="text-[#DC2626]">*</span>
            </span>
            <select
              value={data.domaine_projet || ''}
              onChange={(e) => onChange({ domaine_projet: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-[#E9ECEF] bg-white text-[#212529] focus:outline-none focus:ring-2 focus:ring-[#40B2A4]/20 focus:border-[#40B2A4]/50 transition-all"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              <option value="">Sélectionnez un domaine</option>
              {domaines.map((domaine) => (
                <option key={domaine.value} value={domaine.value}>
                  {domaine.label}
                </option>
              ))}
            </select>
          </label>
        </motion.div>

        {/* Niveau d'avancement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-2xl border border-[#E9ECEF] p-6 shadow-lg"
        >
          <label className="block">
            <span 
              className="font-display text-sm font-semibold text-[#212529] mb-2 block"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              Niveau d'avancement <span className="text-[#DC2626]">*</span>
            </span>
            <select
              value={data.niveau_avancement || ''}
              onChange={(e) => onChange({ niveau_avancement: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-[#E9ECEF] bg-white text-[#212529] focus:outline-none focus:ring-2 focus:ring-[#40B2A4]/20 focus:border-[#40B2A4]/50 transition-all"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              <option value="">Sélectionnez un niveau</option>
              {niveauxAvancement.map((niveau) => (
                <option key={niveau.value} value={niveau.value}>
                  {niveau.label}
                </option>
              ))}
            </select>
          </label>
        </motion.div>

        {/* Technologies */}
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
              Technologies utilisées <span className="text-[#DC2626]">*</span>
            </span>
            <input
              type="text"
              value={data.technologies || ''}
              onChange={(e) => onChange({ technologies: e.target.value })}
              placeholder="Ex: React, Node.js, MongoDB..."
              className="w-full px-4 py-3 rounded-xl border border-[#E9ECEF] bg-white text-[#212529] placeholder-[#6C757D] focus:outline-none focus:ring-2 focus:ring-[#40B2A4]/20 focus:border-[#40B2A4]/50 transition-all"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            />
          </label>
        </motion.div>
      </div>

      {/* Problématique */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-white rounded-2xl border border-[#E9ECEF] p-6 shadow-lg"
      >
        <label className="block">
          <span 
            className="font-display text-sm font-semibold text-[#212529] mb-2 block"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            Problématique <span className="text-[#DC2626]">*</span>
          </span>
          <textarea
            value={data.problematique || ''}
            onChange={(e) => onChange({ problematique: e.target.value })}
            placeholder="Quel problème votre projet résout-il ?"
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-[#E9ECEF] bg-white text-[#212529] placeholder-[#6C757D] focus:outline-none focus:ring-2 focus:ring-[#40B2A4]/20 focus:border-[#40B2A4]/50 transition-all resize-none"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          />
        </label>
      </motion.div>

      {/* Solution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="bg-white rounded-2xl border border-[#E9ECEF] p-6 shadow-lg"
      >
        <label className="block">
          <span 
            className="font-display text-sm font-semibold text-[#212529] mb-2 block"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            Solution proposée <span className="text-[#DC2626]">*</span>
          </span>
          <textarea
            value={data.solution || ''}
            onChange={(e) => onChange({ solution: e.target.value })}
            placeholder="Quelle solution votre projet apporte-t-il ?"
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-[#E9ECEF] bg-white text-[#212529] placeholder-[#6C757D] focus:outline-none focus:ring-2 focus:ring-[#40B2A4]/20 focus:border-[#40B2A4]/50 transition-all resize-none"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          />
        </label>
      </motion.div>
        </>
      )}
    </div>
  );
};

export default Etape5Projet;
