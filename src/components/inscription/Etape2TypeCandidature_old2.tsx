import { InscriptionData } from "@/types/inscription";
import { motion } from "framer-motion";
import { User, Users, ArrowRight, Sparkles } from "lucide-react";

interface Props {
  data: InscriptionData;
  onChange: (d: Partial<InscriptionData>) => void;
}

const Etape2TypeCandidature = ({ data, onChange }: Props) => (
  <div className="space-y-8">
    {/* Header */}
    <motion.div 
      className="text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 
        className="font-display text-2xl font-bold text-[#F9FAFB] mb-3"
        style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700 }}
      >
        Type de candidature
      </h3>
      <p 
        className="text-[#9CA3AF] text-lg"
        style={{ fontFamily: 'DM Sans, sans-serif' }}
      >
        Participez-vous seul ou en équipe ?
      </p>
      <div className="w-16 h-1 bg-gradient-to-r from-[#00873E] to-[#FBBF24] mx-auto rounded-full mt-4"></div>
    </motion.div>

    {/* Type Selection Cards */}
    <div className="grid sm:grid-cols-2 gap-6">
      {([
        { 
          value: 'individuel' as const, 
          icon: User, 
          title: 'Candidature Individuelle', 
          desc: 'Je participe seul et serai affecté à une équipe',
          features: ['Flexibilité totale', 'Rencontre de nouveaux talents', 'Idéation collaborative']
        },
        { 
          value: 'equipe' as const, 
          icon: Users, 
          title: 'Candidature Équipe', 
          desc: 'Je m\'inscris avec mon équipe (2 à 4 membres)',
          features: ['Synergie d\'équipe', 'Projet défini', 'Complémentarité des compétences']
        },
      ]).map((opt, index) => (
        <motion.button
          key={opt.value}
          type="button"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ y: -8, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onChange({
            type_candidature: opt.value,
            nombre_membres: opt.value === 'individuel' ? 1 : data.nombre_membres || 2,
            membres: opt.value === 'individuel' ? [] : data.membres,
          })}
          className={`relative overflow-hidden rounded-2xl border-2 p-8 transition-all duration-300 text-left group ${
            data.type_candidature === opt.value
              ? 'border-[#00873E] bg-[#00873E]/10 shadow-lg shadow-[#00873E]/25'
              : 'border-[#2D3748] hover:border-[#00873E]/50 bg-[#111827]'
          }`}
        >
          {/* Background decoration */}
          <div className={`absolute inset-0 bg-gradient-to-br ${
            data.type_candidature === opt.value 
              ? 'from-[#00873E]/5 to-[#FBBF24]/5' 
              : 'from-transparent to-transparent'
          } group-hover:from-[#00873E]/3 group-hover:to-[#FBBF24]/3 transition-all duration-300`}></div>
          
          {/* Content */}
          <div className="relative z-10">
            {/* Icon */}
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 ${
              data.type_candidature === opt.value
                ? 'bg-[#00873E] shadow-lg shadow-[#00873E]/25'
                : 'bg-[#1F2937] group-hover:bg-[#00873E]/20'
            }`}>
              <opt.icon 
                size={32} 
                className={`transition-colors duration-300 ${
                  data.type_candidature === opt.value ? 'text-[#F9FAFB]' : 'text-[#9CA3AF] group-hover:text-[#F9FAFB]'
                }`} 
              />
            </div>
            
            {/* Title and Description */}
            <div className="mb-6">
              <h4 
                className={`font-display text-xl font-bold mb-2 transition-colors duration-300 ${
                  data.type_candidature === opt.value ? 'text-[#F9FAFB]' : 'text-[#9CA3AF] group-hover:text-[#F9FAFB]'
                }`}
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                {opt.title}
              </h4>
              <p 
                className="text-sm leading-relaxed"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                {opt.desc}
              </p>
            </div>
            
            {/* Features */}
            <div className="space-y-2">
              {opt.features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FBBF24]"></div>
                  <span 
                    className="text-xs text-[#9CA3AF]"
                    style={{ fontFamily: 'DM Sans, sans-serif' }}
                  >
                    {feature}
                  </span>
                </div>
              ))}
            </div>
            
            {/* Selection indicator */}
            {data.type_candidature === opt.value && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="absolute top-4 right-4 w-8 h-8 bg-[#FBBF24] rounded-full flex items-center justify-center"
              >
                <Sparkles size={16} className="text-[#0A0A0A]" />
              </motion.div>
            )}
          </div>
        </motion.button>
      ))}
    </div>

    {/* Team Details (conditional) */}
    {data.type_candidature === 'equipe' && (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        transition={{ duration: 0.5 }}
        className="space-y-6 card-premium p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <Users size={24} className="text-[#FBBF24]" />
          <h4 
            className="font-display text-xl font-bold text-[#F9FAFB]"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            Détails de l'équipe
          </h4>
        </div>
        
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label 
              className="block text-sm font-semibold text-[#F9FAFB] mb-3"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              Nom de l'équipe <span className="text-[#DC2626]">*</span>
            </label>
            <input
              type="text"
              value={data.nom_equipe || ''}
              onChange={(e) => onChange({ nom_equipe: e.target.value })}
              placeholder="Ex: Team Innovation"
              className="w-full rounded-xl border-[#2D3748] bg-[#1F2937] px-4 py-3 text-[#F9FAFB] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#00873E] focus:border-transparent transition-all duration-300"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            />
          </div>
          
          <div>
            <label 
              className="block text-sm font-semibold text-[#F9FAFB] mb-3"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              Nombre de membres <span className="text-[#DC2626]">*</span>
            </label>
            <div className="flex gap-3">
              {[2, 3, 4].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => onChange({ nombre_membres: n })}
                  className={`flex-1 h-14 rounded-xl border-2 font-display font-bold transition-all duration-300 ${
                    data.nombre_membres === n 
                      ? 'border-[#00873E] bg-[#00873E] text-[#F9FAFB] shadow-lg shadow-[#00873E]/25' 
                      : 'border-[#2D3748] bg-[#1F2937] text-[#9CA3AF] hover:border-[#00873E]/50 hover:text-[#F9FAFB]'
                  }`}
                  style={{ fontFamily: 'Sora, sans-serif' }}
                >
                  {n}
                </button>
              ))}
            </div>
            <p 
              className="text-xs text-[#9CA3AF] mt-2"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              Vous inclus dans le nombre total
            </p>
          </div>
        </div>
      </motion.div>
    )}
  </div>
);

export default Etape2TypeCandidature;
