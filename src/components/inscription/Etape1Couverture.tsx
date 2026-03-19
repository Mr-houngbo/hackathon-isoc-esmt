import { motion } from "framer-motion";
import { InscriptionData } from "@/types/inscription";
import heroBg from "@/assets/hero-bg.jpg";
import { Calendar, MapPin, Clock, CheckSquare, Users, Trophy, ArrowRight } from "lucide-react";

interface Props {
  data: InscriptionData;
  onChange: (d: Partial<InscriptionData>) => void;
  errors?: Record<string, string>;
}

const Etape1Couverture = ({ data, onChange, errors = {} }: Props) => (
  <div className="space-y-8">
    {/* Hero Section */}
    <div className="relative overflow-hidden rounded-2xl">
      <img src={heroBg} alt="Hackathon ISOC-ESMT" className="h-64 w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#FF6B35]/90 via-[#1E3A5F]/80 to-[#212529]/95 flex items-center justify-center">
        <div className="text-center text-white p-8">
          <motion.h2 
            className="font-display text-3xl sm:text-4xl font-bold mb-4"
            style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            2ème Hackathon
            <span className="text-gradient"> ISOC-ESMT</span>
          </motion.h2>
          <motion.p 
            className="text-lg mb-6"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            48h d'innovation à l'ESMT Dakar
          </motion.p>
        </div>
      </div>
    </div>

    {/* Key Info Cards */}
    <div className="grid sm:grid-cols-3 gap-6">
      <motion.div 
        className="bg-white rounded-2xl border border-[#E9ECEF] p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-[#FF6B35]/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        whileHover={{ y: -4 }}
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#FF6B35]/10 to-[#1E3A5F]/10 flex items-center justify-center">
            <Calendar size={20} className="text-[#FF6B35]" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-[#212529]" style={{ fontFamily: 'Sora, sans-serif' }}>
              17 & 18 Avril 2026
            </h3>
            <p className="text-sm text-[#6C757D]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              Nouvelles dates
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="bg-white rounded-2xl border border-[#E9ECEF] p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-[#1E3A5F]/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        whileHover={{ y: -4 }}
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#1E3A5F]/10 to-[#2C5282]/10 flex items-center justify-center">
            <MapPin size={20} className="text-[#1E3A5F]" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-[#212529]" style={{ fontFamily: 'Sora, sans-serif' }}>
              ESMT, Dakar
            </h3>
            <p className="text-sm text-[#6C757D]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              Lieu historique
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="bg-white rounded-2xl border border-[#E9ECEF] p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-[#FF6B35]/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        whileHover={{ y: -4 }}
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#FF6B35]/10 to-[#1E3A5F]/10 flex items-center justify-center">
            <Clock size={20} className="text-[#FF6B35]" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-[#212529]" style={{ fontFamily: 'Sora, sans-serif' }}>
              48h non-stop
            </h3>
            <p className="text-sm text-[#6C757D]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              Création intensive
            </p>
          </div>
        </div>
      </motion.div>
    </div>

    {/* Terms and Conditions */}
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <div className="bg-white rounded-2xl border border-[#E9ECEF] p-6 shadow-lg">
        <h3 className="font-display text-lg font-semibold text-[#212529] mb-4 flex items-center gap-2" style={{ fontFamily: 'Sora, sans-serif' }}>
          <CheckSquare size={20} className="text-[#FF6B35]" />
          Participation
        </h3>
        
        <label className="flex items-start gap-4 cursor-pointer group p-4 rounded-xl hover:bg-[#FF6B35]/5 transition-colors">
          <input
            type="checkbox"
            checked={data.accepte_conditions}
            onChange={(e) => onChange({ accepte_conditions: e.target.checked })}
            className="mt-1 h-5 w-5 rounded border border-[#E9ECEF] bg-white text-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 focus:ring-offset-0"
          />
          <div className="flex-1">
            <span className="text-sm text-[#6C757D] leading-relaxed" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              J'ai lu et j'accepte les{" "}
              <a href="/termes-conditions" className="text-[#1E3A5F] hover:text-[#FF6B35] underline transition-colors font-medium" style={{ fontFamily: 'DM Sans, sans-serif' }} target="_blank" rel="noopener noreferrer">
                termes et conditions
              </a>
              <span className="text-[#DC2626] ml-1">*</span>
            </span>
            {errors.accepte_conditions && (
              <p className="text-[#DC2626] text-xs mt-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                {errors.accepte_conditions}
              </p>
            )}
          </div>
        </label>
      </div>

      <div className="bg-white rounded-2xl border border-[#E9ECEF] p-6 shadow-lg">
        <label className="flex items-start gap-4 cursor-pointer group p-4 rounded-xl hover:bg-[#FF6B35]/5 transition-colors">
          <input
            type="checkbox"
            checked={data.autorise_photos}
            onChange={(e) => onChange({ autorise_photos: e.target.checked })}
            className="mt-1 h-5 w-5 rounded border border-[#E9ECEF] bg-white text-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 focus:ring-offset-0"
          />
          <div className="flex-1">
            <span className="text-sm text-[#6C757D] leading-relaxed" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              J'autorise le Club ISOC ESMT à utiliser mes photos et vidéos à des fins de communication
              <span className="text-[#DC2626] ml-1">*</span>
            </span>
            {errors.autorise_photos && (
              <p className="text-[#DC2626] text-xs mt-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                {errors.autorise_photos}
              </p>
            )}
          </div>
        </label>
      </div>

      <div className="bg-white rounded-2xl border border-[#E9ECEF] p-6 shadow-lg">
        <p className="text-xs text-[#6C757D]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
          <strong className="text-[#DC2626]">*</strong> Champs obligatoires pour continuer votre inscription.
        </p>
      </div>
    </motion.div>
  </div>
);

export default Etape1Couverture;
