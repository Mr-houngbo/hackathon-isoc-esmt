import { motion } from "framer-motion";
import { InscriptionData } from "@/types/inscription";
import { Heart, Target, Sparkles, CheckCircle } from "lucide-react";

interface Props {
  data: InscriptionData;
  onChange: (d: Partial<InscriptionData>) => void;
}

const sources = [
  { value: 'Affiche ESMT', label: 'Affiche ESMT', icon: Target, color: 'text-[#FEEB09]' },
  { value: 'Réseaux sociaux', label: 'Réseaux sociaux', icon: Heart, color: 'text-[#24366E]' },
  { value: 'Bouche à oreille', label: 'Bouche à oreille', icon: Sparkles, color: 'text-[#FEEB09]' },
  { value: 'Passage en salle', label: 'Passage en salle', icon: Target, color: 'text-[#24366E]' },
  { value: 'Autre', label: 'Autre', icon: Sparkles, color: 'text-[#6C757D]' }
];

const Etape7Motivation = ({ data, onChange }: Props) => {
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
            Pourquoi voulez-vous participer au hackathon ? <span className="text-[#DC2626]">*</span>
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
              className="text-xs text-[#6C757D]"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              {wordCount(data.motivation)} / 100 mots
            </span>
            <span 
              className="text-xs text-[#6C757D]"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              Maximum 100 mots
            </span>
          </div>
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
            Qu'attendez-vous de cette expérience ? <span className="text-[#DC2626]">*</span>
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
              className="text-xs text-[#6C757D]"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              {wordCount(data.esperances)} / 100 mots
            </span>
            <span 
              className="text-xs text-[#6C757D]"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              Maximum 100 mots
            </span>
          </div>
        </label>
      </motion.div>

      {/* Source d'information */}
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
          Comment avez-vous entendu parler du hackathon ? <span className="text-[#DC2626]">*</span>
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {sources.map((source) => (
            <button
              key={source.value}
              type="button"
              onClick={() => onChange({ source_info: source.value })}
              className={`p-3 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                data.source_info === source.value
                  ? 'border-[#FEEB09] bg-[#FEEB09]/10'
                  : 'border-[#E9ECEF] bg-white hover:border-[#FEEB09]/30'
              }`}
            >
              <source.icon 
                size={20} 
                className={data.source_info === source.value ? source.color : 'text-[#6C757D]'}
              />
              <span 
                className="text-xs mt-1 block"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                <span className={data.source_info === source.value ? source.color : 'text-[#6C757D]'}>
                  {source.label}
                </span>
              </span>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Etape7Motivation;
