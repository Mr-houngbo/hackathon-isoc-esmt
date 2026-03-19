import { motion } from "framer-motion";
import { InscriptionData } from "@/types/inscription";
import { Heart, Target, Sparkles, CheckCircle } from "lucide-react";

interface Props {
  data: InscriptionData;
  onChange: (d: Partial<InscriptionData>) => void;
}

const sources = [
  { value: 'Affiche ESMT', label: 'Affiche ESMT', icon: Target, color: 'text-[#00873E]' },
  { value: 'Réseaux sociaux', label: 'Réseaux sociaux', icon: Heart, color: 'text-[#FBBF24]' },
  { value: 'Bouche à oreille', label: 'Bouche à oreille', icon: Sparkles, color: 'text-[#00873E]' },
  { value: 'Passage en salle', label: 'Passage en salle', icon: Target, color: 'text-[#FBBF24]' },
  { value: 'Autre', label: 'Autre', icon: Sparkles, color: 'text-[#9CA3AF]' }
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
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#FBBF24] to-[#00873E] flex items-center justify-center">
            <Heart size={24} className="text-[#F9FAFB]" />
          </div>
          <h3 
            className="font-display text-2xl font-bold text-[#F9FAFB]"
            style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700 }}
          >
            Motivation
          </h3>
        </div>
        <p 
          className="text-[#9CA3AF] text-lg"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          Dites-nous pourquoi vous souhaitez participer
        </p>
        <div className="w-16 h-1 bg-gradient-to-r from-[#FBBF24] to-[#00873E] mx-auto rounded-full mt-4"></div>
      </motion.div>

      {/* Motivation */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <label 
          className="block text-sm font-semibold text-[#F9FAFB] mb-3"
          style={{ fontFamily: 'Sora, sans-serif' }}
        >
          Pourquoi participer au hackathon ? <span className="text-[#DC2626]">*</span>
        </label>
        <div className="relative">
          <textarea 
            value={data.motivation} 
            onChange={(e) => {
              if (wordCount(e.target.value) <= 100) onChange({ motivation: e.target.value });
            }}
            rows={5} 
            placeholder="Décrivez votre motivation en quelques mots... Soyez authentique !"
            className="w-full rounded-xl border-[#2D3748] bg-[#1F2937] px-4 py-3 text-[#F9FAFB] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#FBBF24] focus:border-transparent transition-all duration-300 resize-none"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          />
          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Heart size={14} className="text-[#FBBF24]" />
              <span 
                className="text-xs text-[#9CA3AF]"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                {wordCount(data.motivation)}/100 mots
              </span>
            </div>
            {wordCount(data.motivation) >= 90 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Sparkles size={14} className="text-[#FBBF24]" />
              </motion.div>
            )}
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mt-2">
          <div className="w-full h-2 bg-[#1F2937] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#FBBF24] to-[#00873E]"
              initial={{ width: 0 }}
              animate={{ width: `${(wordCount(data.motivation) / 100) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </motion.div>

      {/* Espérances */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <label 
          className="block text-sm font-semibold text-[#F9FAFB] mb-3"
          style={{ fontFamily: 'Sora, sans-serif' }}
        >
          Qu'espérez-vous accomplir ? <span className="text-[#DC2626]">*</span>
        </label>
        <div className="relative">
          <textarea 
            value={data.esperances} 
            onChange={(e) => onChange({ esperances: e.target.value })}
            rows={4} 
            placeholder="Vos objectifs, apprentissages, réussites attendues..."
            className="w-full rounded-xl border-[#2D3748] bg-[#1F2937] px-4 py-3 text-[#F9FAFB] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#FBBF24] focus:border-transparent transition-all duration-300 resize-none"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          />
          <div className="absolute top-3 right-3">
            <Target size={16} className="text-[#00873E]" />
          </div>
        </div>
      </motion.div>

      {/* Source d'information */}
      <motion.div 
        className="card-premium p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-[#FBBF24]/20 flex items-center justify-center">
            <Sparkles size={20} className="text-[#FBBF24]" />
          </div>
          <h4 
            className="font-display text-xl font-bold text-[#F9FAFB]"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            Comment avez-vous entendu parler du hackathon ?
          </h4>
        </div>
        
        <div className="grid sm:grid-cols-2 gap-4">
          {sources.map((source, index) => (
            <motion.button
              key={source.value}
              type="button"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onChange({ source_info: source.value })}
              className={`relative overflow-hidden rounded-xl border-2 p-4 transition-all duration-300 group ${
                data.source_info === source.value
                  ? 'border-[#00873E] bg-[#00873E]/10 shadow-lg shadow-[#00873E]/25'
                  : 'border-[#2D3748] bg-[#111827] hover:border-[#00873E]/50'
              }`}
            >
              {/* Background decoration */}
              <div className={`absolute inset-0 bg-gradient-to-br ${
                data.source_info === source.value ? 'from-[#00873E]/5 to-[#FBBF24]/5' : 'from-transparent to-transparent'
              } group-hover:from-[#00873E]/3 group-hover:to-[#FBBF24]/3 transition-all duration-300`}></div>
              
              {/* Content */}
              <div className="relative z-10 flex items-center gap-3">
                <source.icon size={20} className={data.source_info === source.value ? 'text-[#00873E]' : source.color} />
                <span 
                  className={`font-display font-bold ${
                    data.source_info === source.value ? 'text-[#F9FAFB]' : 'text-[#9CA3AF] group-hover:text-[#F9FAFB]'
                  }`}
                  style={{ fontFamily: 'Sora, sans-serif' }}
                >
                  {source.label}
                </span>
              </div>
              
              {/* Selection indicator */}
              {data.source_info === source.value && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="absolute top-2 right-2 w-5 h-5 bg-[#FBBF24] rounded-full flex items-center justify-center"
                >
                  <CheckCircle size={14} className="text-[#0A0A0A]" />
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>
        
        <p 
          className="text-xs text-[#9CA3AF] mt-4 text-center"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          Cela nous aide à améliorer notre communication
        </p>
      </motion.div>
    </div>
  );
};

export default Etape7Motivation;
