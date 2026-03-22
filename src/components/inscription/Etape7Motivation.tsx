import { motion } from "framer-motion";
import { InscriptionData } from "@/types/inscription";
import { Heart, Target, Sparkles } from "lucide-react";

interface Props {
  data: InscriptionData;
  onChange: (d: Partial<InscriptionData>) => void;
  errors?: Record<string, string>;
}

const SOURCES = [
  'Affiche ESMT',
  'Réseaux sociaux',
  'Bouche à oreille',
  'Passage en salle',
  'Autre'
];

const Etape7Motivation = ({ data, onChange, errors = {} }: Props) => {
  const wordCount = (text: string) => text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  const isMotivationOverLimit = wordCount(data.motivation) > 250;
  const isEsperancesOverLimit = wordCount(data.esperances) > 250;

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
            <Heart size={24} className="text-white" />
          </div>
          <h3 
            className="font-display text-2xl font-bold text-[#212529]"
            style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700 }}
          >
            Motivation
          </h3>
        </div>
        <p 
          className="text-[#6C757D] text-lg"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          Dites-nous pourquoi vous souhaitez participer
        </p>
        <div className="w-16 h-1 bg-gradient-to-r from-[#FEEB09] to-[#24366E] mx-auto rounded-full mt-4"></div>
      </motion.div>

      {/* Motivation */}
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
            Pourquoi souhaitez-vous participer au hackathon ? <span className="text-[#DC2626]">*</span>
          </span>
          <textarea
            value={data.motivation || ''}
            onChange={(e) => onChange({ motivation: e.target.value })}
            placeholder="Exprimez votre motivation en quelques mots..."
            rows={6}
            className="w-full px-4 py-3 rounded-xl border border-[#E9ECEF] bg-white text-[#212529] placeholder-[#6C757D] focus:outline-none focus:ring-2 focus:ring-[#FEEB09]/20 focus:border-[#FEEB09]/50 transition-all resize-none"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          />
          <div className="flex justify-between items-center mt-2">
            <span 
              className={`text-xs ${isMotivationOverLimit ? 'text-[#DC2626]' : 'text-[#6C757D]'}`}
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              {wordCount(data.motivation)} / 250 mots
            </span>
            <span 
              className={`text-xs ${isMotivationOverLimit ? 'text-[#DC2626]' : 'text-[#6C757D]'}`}
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              {isMotivationOverLimit ? '⚠️ Limite dépassée' : 'Maximum 250 mots'}
            </span>
          </div>
          {errors.motivation && (
            <p className="text-[#DC2626] text-xs mt-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              {errors.motivation}
            </p>
          )}
        </label>
      </motion.div>

      {/* Espérances */}
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
            Qu'espérez-vous apprendre ou accomplir ? <span className="text-[#DC2626]">*</span>
          </span>
          <textarea
            value={data.esperances || ''}
            onChange={(e) => onChange({ esperances: e.target.value })}
            placeholder="Décrivez vos attentes et objectifs..."
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-[#E9ECEF] bg-white text-[#212529] placeholder-[#6C757D] focus:outline-none focus:ring-2 focus:ring-[#FEEB09]/20 focus:border-[#FEEB09]/50 transition-all resize-none"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          />
          <div className="flex justify-between items-center mt-2">
            <span 
              className={`text-xs ${isEsperancesOverLimit ? 'text-[#DC2626]' : 'text-[#6C757D]'}`}
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              {wordCount(data.esperances)} / 250 mots
            </span>
            <span 
              className={`text-xs ${isEsperancesOverLimit ? 'text-[#DC2626]' : 'text-[#6C757D]'}`}
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              {isEsperancesOverLimit ? '⚠️ Limite dépassée' : 'Maximum 250 mots'}
            </span>
          </div>
          {errors.esperances && (
            <p className="text-[#DC2626] text-xs mt-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              {errors.esperances}
            </p>
          )}
        </label>
      </motion.div>

      {/* Source d'information */}
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
            Comment avez-vous entendu parler du hackathon ? <span className="text-[#DC2626]">*</span>
          </span>
          <select
            value={data.source_info || ''}
            onChange={(e) => onChange({ source_info: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-[#E9ECEF] bg-white text-[#212529] focus:outline-none focus:ring-2 focus:ring-[#FEEB09]/20 focus:border-[#FEEB09]/50 transition-all"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            <option value="">Comment avez-vous entendu parler du hackathon ?</option>
            {SOURCES.map((source) => (
              <option key={source} value={source}>{source}</option>
            ))}
          </select>
          {errors.source_info && (
            <p className="text-[#DC2626] text-xs mt-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              {errors.source_info}
            </p>
          )}
        </label>
      </motion.div>

      {/* Info sur la motivation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-gradient-to-r from-[#FEEB09]/10 to-[#24366E]/10 rounded-2xl border border-[#E9ECEF] p-4"
      >
        <p 
          className="text-center text-sm"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          <span className="text-[#212529]">
            ✍️ Votre motivation nous aide à mieux comprendre votre profil et vos attentes.
          </span>
        </p>
      </motion.div>
    </div>
  );
};

export default Etape7Motivation;
