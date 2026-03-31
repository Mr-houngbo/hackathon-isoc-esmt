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
        className="font-display text-2xl font-bold text-[#212529] mb-3"
        style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700 }}
      >
        Type de candidature
      </h3>
      <p 
        className="text-[#6C757D] text-lg"
        style={{ fontFamily: 'DM Sans, sans-serif' }}
      >
        Participez-vous seul ou en équipe ?
      </p>
      <div className="w-16 h-1 bg-gradient-to-r from-[#40B2A4] to-[#24366E] mx-auto rounded-full mt-4"></div>
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
      ] as const).map((type, index) => (
        <motion.div
          key={type.value}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="relative"
        >
          <label className="cursor-pointer">
            <input
              type="radio"
              name="type_candidature"
              value={type.value}
              checked={data.type_candidature === type.value}
              onChange={(e) => onChange({ type_candidature: e.target.value as 'individuel' | 'equipe' })}
              className="sr-only"
            />
            <div className={`relative overflow-hidden rounded-2xl border-2 p-6 transition-all duration-300 ${
              data.type_candidature === type.value
                ? 'border-[#40B2A4] bg-[#40B2A4]/5 shadow-lg shadow-[#40B2A4]/20'
                : 'border-[#E9ECEF] bg-white hover:border-[#40B2A4]/30 hover:shadow-md'
            }`}>
              {/* Selection indicator */}
              {data.type_candidature === type.value && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-4 right-4 w-6 h-6 rounded-full bg-[#40B2A4] flex items-center justify-center"
                >
                  <motion.div
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                      <motion.path
                        d="M1 5.5L4.5 9L11 2"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.div>
                </motion.div>
              )}

              {/* Icon */}
              <div className="flex items-center justify-center mb-4">
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                  data.type_candidature === type.value
                    ? 'bg-gradient-to-r from-[#40B2A4] to-[#24366E]'
                    : 'bg-gradient-to-r from-[#40B2A4]/10 to-[#24366E]/10'
                }`}>
                  <type.icon 
                    size={32} 
                    className={data.type_candidature === type.value ? 'text-white' : 'text-[#40B2A4]'} 
                  />
                </div>
              </div>

              {/* Content */}
              <div className="text-center">
                <h4 
                  className="font-display text-lg font-bold mb-2"
                  style={{ fontFamily: 'Sora, sans-serif' }}
                >
                  <span className={data.type_candidature === type.value ? 'text-[#40B2A4]' : 'text-[#212529]'}>
                    {type.title}
                  </span>
                </h4>
                <p 
                  className="text-sm mb-4"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  <span className={data.type_candidature === type.value ? 'text-[#24366E]' : 'text-[#6C757D]'}>
                    {type.desc}
                  </span>
                </p>

                {/* Features */}
                <div className="space-y-2">
                  {type.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Sparkles 
                        size={14} 
                        className={data.type_candidature === type.value ? 'text-[#40B2A4]' : 'text-[#6C757D]'} 
                      />
                      <span 
                        className="text-xs"
                        style={{ fontFamily: 'DM Sans, sans-serif' }}
                      >
                        <span className={data.type_candidature === type.value ? 'text-[#24366E]' : 'text-[#6C757D]'}>
                          {feature}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hover effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#40B2A4]/5 via-transparent to-[#24366E]/5 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            </div>
          </label>
        </motion.div>
      ))}
    </div>

    {/* Team name input (conditional) */}
    {data.type_candidature === 'equipe' && (
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
            Nom de l'équipe <span className="text-[#DC2626]">*</span>
          </span>
          <input
            type="text"
            value={data.nom_equipe}
            onChange={(e) => onChange({ nom_equipe: e.target.value })}
            placeholder="Nom de votre équipe"
            className="w-full px-4 py-3 rounded-xl border border-[#E9ECEF] bg-white text-[#212529] placeholder-[#6C757D] focus:outline-none focus:ring-2 focus:ring-[#40B2A4]/20 focus:border-[#40B2A4]/50 transition-all"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          />
        </label>
      </motion.div>
    )}
  </div>
);

export default Etape2TypeCandidature;
