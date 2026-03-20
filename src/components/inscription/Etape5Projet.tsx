import { motion } from "framer-motion";
import { InscriptionData } from "@/types/inscription";
import { X, Lightbulb } from "lucide-react";

interface Props {
  data: InscriptionData;
  onChange: (d: Partial<InscriptionData>) => void;
  errors?: Record<string, string>;
}

const DOMAINES = ['Vie étudiante', 'Administration', 'Pédagogie', 'Campus', 'Autre'];

const Etape5Projet = ({ data, onChange, errors = {} }: Props) => {
  const wordCount = (text: string) => text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  const isOverLimit = wordCount(data.solution) > 250;

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
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#FF6B35] to-[#1E3A5F] flex items-center justify-center">
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
        <div className="w-16 h-1 bg-gradient-to-r from-[#FF6B35] to-[#1E3A5F] mx-auto rounded-full mt-4"></div>
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
                ? 'border-[#FF6B35] bg-[#FF6B35]/10'
                : 'border-[#E9ECEF] bg-white hover:border-[#FF6B35]/30'
            }`}
          >
            <div className="flex flex-col items-center gap-2">
              <Lightbulb 
                size={24} 
                className={data.a_projet === 'oui' ? 'text-[#FF6B35]' : 'text-[#6C757D]'}
              />
              <span 
                className="font-display text-sm font-bold"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                <span className={data.a_projet === 'oui' ? 'text-[#FF6B35]' : 'text-[#212529]'}>
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
                ? 'border-[#FF6B35] bg-[#FF6B35]/10'
                : 'border-[#E9ECEF] bg-white hover:border-[#FF6B35]/30'
            }`}
          >
            <div className="flex flex-col items-center gap-2">
              <X 
                size={24} 
                className={data.a_projet === 'non' ? 'text-[#FF6B35]' : 'text-[#6C757D]'}
              />
              <span 
                className="font-display text-sm font-bold"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                <span className={data.a_projet === 'non' ? 'text-[#FF6B35]' : 'text-[#212529]'}>
                  Non
                </span>
              </span>
            </div>
          </button>
        </div>
        {errors.a_projet && (
          <p className="text-[#DC2626] text-xs mt-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            {errors.a_projet}
          </p>
        )}
      </motion.div>

      {/* Message si "Non" */}
      {data.a_projet === 'non' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="p-6 rounded-xl bg-gradient-to-r from-[#FF6B35]/10 to-[#1E3A5F]/10 border border-[#E9ECEF] text-center"
        >
          <p 
            className="text-[#212529] font-medium"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            Pas de problème ! Vous pourrez développer votre idée pendant le hackathon.
          </p>
        </motion.div>
      )}

      {/* Champs du projet - uniquement si a_projet === 'oui' */}
      {data.a_projet === 'oui' && (
        <>
          {/* Nom du projet */}
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
                Nom du projet <span className="text-[#DC2626]">*</span>
              </span>
              <input
                type="text"
                value={data.nom_projet || ''}
                onChange={(e) => onChange({ nom_projet: e.target.value })}
                placeholder="Nom de votre projet"
                className="w-full px-4 py-3 rounded-xl border border-[#E9ECEF] bg-white text-[#212529] placeholder-[#6C757D] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35]/50 transition-all"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              />
              {errors.nom_projet && (
                <p className="text-[#DC2626] text-xs mt-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                  {errors.nom_projet}
                </p>
              )}
            </label>
          </motion.div>

          {/* Domaine du projet */}
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
                Domaine du projet <span className="text-[#DC2626]">*</span>
              </span>
              <select
                value={data.domaine_projet || ''}
                onChange={(e) => onChange({ domaine_projet: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-[#E9ECEF] bg-white text-[#212529] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35]/50 transition-all"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                <option value="">Sélectionnez un domaine</option>
                {DOMAINES.map((domaine) => (
                  <option key={domaine} value={domaine}>{domaine}</option>
                ))}
              </select>
              {errors.domaine_projet && (
                <p className="text-[#DC2626] text-xs mt-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                  {errors.domaine_projet}
                </p>
              )}
            </label>

            {/* Champ "Autre" si sélectionné */}
            {data.domaine_projet === 'Autre' && (
              <div className="mt-4">
                <input
                  type="text"
                  value={data.domaine_projet_autre || ''}
                  onChange={(e) => onChange({ domaine_projet_autre: e.target.value })}
                  placeholder="Précisez le domaine du projet"
                  className="w-full px-4 py-3 rounded-xl border border-[#E9ECEF] bg-white text-[#212529] placeholder-[#6C757D] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35]/50 transition-all"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                  required
                />
                {errors.domaine_projet_autre && (
                  <p className="text-[#DC2626] text-xs mt-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                    {errors.domaine_projet_autre}
                  </p>
                )}
              </div>
            )}
          </motion.div>

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
                Problématique identifiée <span className="text-[#DC2626]">*</span>
              </span>
              <textarea
                value={data.problematique || ''}
                onChange={(e) => onChange({ problematique: e.target.value })}
                placeholder="Décrivez le problème que vous souhaitez résoudre..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-[#E9ECEF] bg-white text-[#212529] placeholder-[#6C757D] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35]/50 transition-all resize-none"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              />
              {errors.problematique && (
                <p className="text-[#DC2626] text-xs mt-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                  {errors.problematique}
                </p>
              )}
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
                Solution envisagée <span className="text-[#DC2626]">*</span>
              </span>
              <textarea
                value={data.solution || ''}
                onChange={(e) => onChange({ solution: e.target.value })}
                placeholder="Quelle solution votre projet apporte-t-il ?"
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-[#E9ECEF] bg-white text-[#212529] placeholder-[#6C757D] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35]/50 transition-all resize-none"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              />
              <div className="flex justify-between items-center mt-2">
                <span 
                  className={`text-xs ${isOverLimit ? 'text-[#DC2626]' : 'text-[#6C757D]'}`}
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  {wordCount(data.solution)} / 250 mots
                </span>
                <span 
                  className={`text-xs ${isOverLimit ? 'text-[#DC2626]' : 'text-[#6C757D]'}`}
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  {isOverLimit ? '⚠️ Limite dépassée' : 'Maximum 250 mots'}
                </span>
              </div>
              {errors.solution && (
                <p className="text-[#DC2626] text-xs mt-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                  {errors.solution}
                </p>
              )}
            </label>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default Etape5Projet;
