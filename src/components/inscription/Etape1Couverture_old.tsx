import { motion } from "framer-motion";
import { InscriptionData } from "@/types/inscription";
import heroBg from "@/assets/hero-bg.jpg";
import { Calendar, MapPin, Clock, CheckSquare, Users, Trophy, ArrowRight } from "lucide-react";

interface Props {
  data: InscriptionData;
  onChange: (d: Partial<InscriptionData>) => void;
}

const Etape1Couverture = ({ data, onChange }: Props) => (
  <div className="space-y-8">
    {/* Hero Section */}
    <div className="relative overflow-hidden rounded-2xl">
      <img src={heroBg} alt="Hackathon ISOC-ESMT" className="h-64 w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#00873E]/90 via-[#00873E]/80 to-[#0A0A0A]/95 flex items-center justify-center">
        <div className="text-center text-[#F9FAFB] p-8">
          <motion.h2 
            className="font-display text-3xl sm:text-4xl font-bold mb-3"
            style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            2ème Hackathon
            <span className="text-gradient"> ISOC-ESMT</span>
          </motion.h2>
          <motion.p 
            className="text-lg text-[#F9FAFB]/90"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            48h d'innovation à l'ESMT Dakar
          </motion.p>
        </div>
      </div>
    </div>

    {/* Key Info Cards */}
    <div className="grid sm:grid-cols-3 gap-4">
      <motion.div 
        className="card-premium p-4 text-center group"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        whileHover={{ y: -4 }}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-[#00873E]/10 flex items-center justify-center group-hover:bg-[#00873E]/20 transition-colors">
            <Calendar size={20} className="text-[#FBBF24]" />
          </div>
          <span className="text-sm font-semibold text-[#F9FAFB]" style={{ fontFamily: 'Sora, sans-serif' }}>
            3 & 4 Avril 2026
          </span>
        </div>
      </motion.div>

      <motion.div 
        className="card-premium p-4 text-center group"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        whileHover={{ y: -4 }}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-[#00873E]/10 flex items-center justify-center group-hover:bg-[#00873E]/20 transition-colors">
            <MapPin size={20} className="text-[#FBBF24]" />
          </div>
          <span className="text-sm font-semibold text-[#F9FAFB]" style={{ fontFamily: 'Sora, sans-serif' }}>
            ESMT, Dakar
          </span>
        </div>
      </motion.div>

      <motion.div 
        className="card-premium p-4 text-center group"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        whileHover={{ y: -4 }}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-[#00873E]/10 flex items-center justify-center group-hover:bg-[#00873E]/20 transition-colors">
            <Clock size={20} className="text-[#FBBF24]" />
          </div>
          <span className="text-sm font-semibold text-[#F9FAFB]" style={{ fontFamily: 'Sora, sans-serif' }}>
            48 heures
          </span>
        </div>
      </motion.div>
    </div>

    {/* Description */}
    <motion.div 
      className="card-premium p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <p 
        className="text-[#9CA3AF] leading-relaxed text-center"
        style={{ fontFamily: 'DM Sans, sans-serif' }}
      >
        Rejoignez le 2ème Hackathon organisé par le Club ISOC de l'ESMT. 
        Formez une équipe, proposez un projet innovant et pitchez devant un jury d'experts. 
        Des prix allant jusqu'à <span className="text-[#FBBF24] font-bold">250 000 FCFA</span> + incubation sont à gagner !
      </p>
    </motion.div>

    {/* Stats */}
    <motion.div 
      className="grid grid-cols-3 gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 text-[#FBBF24] mb-1">
          <Users size={16} />
          <span className="text-2xl font-bold" style={{ fontFamily: 'Sora, sans-serif' }}>40</span>
        </div>
        <span className="text-xs text-[#9CA3AF]" style={{ fontFamily: 'DM Sans, sans-serif' }}>Participants max</span>
      </div>
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 text-[#00873E] mb-1">
          <Trophy size={16} />
          <span className="text-2xl font-bold" style={{ fontFamily: 'Sora, sans-serif' }}>450K</span>
        </div>
        <span className="text-xs text-[#9CA3AF]" style={{ fontFamily: 'DM Sans, sans-serif' }}>FCFA en prix</span>
      </div>
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 text-[#FBBF24] mb-1">
          <Clock size={16} />
          <span className="text-2xl font-bold" style={{ fontFamily: 'Sora, sans-serif' }}>48h</span>
        </div>
        <span className="text-xs text-[#9CA3AF]" style={{ fontFamily: 'DM Sans, sans-serif' }}>Création</span>
      </div>
    </motion.div>

    {/* Terms and Conditions */}
    <motion.div 
      className="space-y-4 card-premium p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.7 }}
    >
      <h3 
        className="font-display text-lg font-semibold text-[#F9FAFB] mb-4 flex items-center gap-2"
        style={{ fontFamily: 'Sora, sans-serif' }}
      >
        <CheckSquare size={20} className="text-[#FBBF24]" />
        Conditions de participation
      </h3>
      
      <label className="flex items-start gap-4 cursor-pointer group p-3 rounded-xl hover:bg-[#111827]/50 transition-colors">
        <input
          type="checkbox"
          checked={data.accepte_conditions}
          onChange={(e) => onChange({ accepte_conditions: e.target.checked })}
          className="mt-1 h-5 w-5 rounded border-[#2D3748] bg-[#111827] text-[#00873E] focus:ring-[#00873E] focus:ring-offset-0"
        />
        <span className="text-sm text-[#9CA3AF] leading-relaxed flex-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>
          J'ai lu et j'accepte les{" "}
          <a 
            href="#" 
            className="text-[#FBBF24] hover:text-[#00873E] underline transition-colors font-medium"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            termes et conditions
          </a>{" "}
          du hackathon.
          <span className="text-[#DC2626] ml-1">*</span>
        </span>
      </label>

      <label className="flex items-start gap-4 cursor-pointer group p-3 rounded-xl hover:bg-[#111827]/50 transition-colors">
        <input
          type="checkbox"
          checked={data.autorise_photos}
          onChange={(e) => onChange({ autorise_photos: e.target.checked })}
          className="mt-1 h-5 w-5 rounded border-[#2D3748] bg-[#111827] text-[#00873E] focus:ring-[#00873E] focus:ring-offset-0"
        />
        <span className="text-sm text-[#9CA3AF] leading-relaxed flex-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>
          J'autorise le Club ISOC ESMT à utiliser mes photos/vidéos prises lors de l'événement.
          <span className="text-[#DC2626] ml-1">*</span>
        </span>
      </label>

      <div className="mt-4 p-3 rounded-xl bg-[#00873E]/10 border border-[#00873E]/30">
        <p className="text-xs text-[#00873E]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
          <strong>*</strong> Champs obligatoires pour continuer votre inscription.
        </p>
      </div>
    </motion.div>
  </div>
);

export default Etape1Couverture;
