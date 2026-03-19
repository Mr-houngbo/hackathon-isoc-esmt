import { motion } from "framer-motion";
import { CheckCircle, Calendar, Instagram, Linkedin, Trophy, Sparkles, ArrowRight } from "lucide-react";
import { InscriptionData } from "@/types/inscription";
import { Link } from "react-router-dom";

interface Props {
  data: InscriptionData;
}

const Etape8Confirmation = ({ data }: Props) => (
  <div className="text-center space-y-8 py-8">
    {/* Success Icon */}
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 15, duration: 0.6 }}
    >
      <div className="relative mx-auto w-24 h-24">
        <div className="absolute inset-0 bg-gradient-to-r from-[#00873E] to-[#FBBF24] rounded-full animate-pulse opacity-20"></div>
        <div className="relative w-full h-full bg-gradient-to-r from-[#00873E] to-[#FBBF24] rounded-full flex items-center justify-center shadow-lg shadow-[#00873E]/25">
          <CheckCircle size={48} className="text-[#F9FAFB]" strokeWidth={2} />
        </div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          className="absolute -top-2 -right-2 w-8 h-8 bg-[#FBBF24] rounded-full flex items-center justify-center shadow-lg"
        >
          <Sparkles size={16} className="text-[#0A0A0A]" />
        </motion.div>
      </div>
    </motion.div>

    {/* Title and Message */}
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <h2 
        className="font-display text-3xl font-bold text-[#F9FAFB] mb-4"
        style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800 }}
      >
        Candidature envoyée !
        <span className="text-gradient"> 🎉</span>
      </h2>
      <p 
        className="text-[#9CA3AF] text-lg leading-relaxed max-w-2xl mx-auto"
        style={{ fontFamily: 'DM Sans, sans-serif' }}
      >
        Merci 
        <span 
          className="font-bold text-[#FBBF24] mx-1"
          style={{ fontFamily: 'Sora, sans-serif' }}
        >
          {data.chef_nom_prenom}
        </span>
        {data.type_candidature === 'equipe' && data.nom_equipe && (
          <>
            {' '}et l'équipe
            <span 
              className="font-bold text-[#FBBF24] mx-1"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              {data.nom_equipe}
            </span>
          </>
        )}
        {' '}pour votre inscription au 2ème Hackathon ISOC-ESMT 2026.
      </p>
    </motion.div>

    {/* Success Stats */}
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="grid grid-cols-3 gap-6 max-w-lg mx-auto"
    >
      <div className="text-center">
        <div className="w-12 h-12 rounded-full bg-[#00873E]/20 flex items-center justify-center mx-auto mb-2">
          <Calendar size={20} className="text-[#00873E]" />
        </div>
        <p 
          className="text-xs text-[#9CA3AF]"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          Réponse sous
        </p>
        <p 
          className="text-sm font-bold text-[#F9FAFB]"
          style={{ fontFamily: 'Sora, sans-serif' }}
        >
          72h
        </p>
      </div>
      <div className="text-center">
        <div className="w-12 h-12 rounded-full bg-[#FBBF24]/20 flex items-center justify-center mx-auto mb-2">
          <Calendar size={20} className="text-[#FBBF24]" />
        </div>
        <p 
          className="text-xs text-[#9CA3AF]"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          Dates
        </p>
        <p 
          className="text-sm font-bold text-[#F9FAFB]"
          style={{ fontFamily: 'Sora, sans-serif' }}
        >
          3 & 4 Avril
        </p>
      </div>
      <div className="text-center">
        <div className="w-12 h-12 rounded-full bg-[#00873E]/20 flex items-center justify-center mx-auto mb-2">
          <Trophy size={20} className="text-[#00873E]" />
        </div>
        <p 
          className="text-xs text-[#9CA3AF]"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          Lieu
        </p>
        <p 
          className="text-sm font-bold text-[#F9FAFB]"
          style={{ fontFamily: 'Sora, sans-serif' }}
        >
          ESMT
        </p>
      </div>
    </motion.div>

    {/* Info Card */}
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7, duration: 0.5 }}
      className="card-premium p-6 max-w-md mx-auto"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-full bg-[#FBBF24]/20 flex items-center justify-center">
          <Sparkles size={16} className="text-[#FBBF24]" />
        </div>
        <h4 
          className="font-display text-lg font-bold text-[#F9FAFB]"
          style={{ fontFamily: 'Sora, sans-serif' }}
        >
          Prochaines étapes
        </h4>
      </div>
      <div className="space-y-3 text-left">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[#00873E]"></div>
          <p 
            className="text-sm text-[#9CA3AF]"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            Email de confirmation envoyé à {data.chef_email}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[#FBBF24]"></div>
          <p 
            className="text-sm text-[#9CA3AF]"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            Réponse de sélection sous 72h
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[#00873E]"></div>
          <p 
            className="text-sm text-[#9CA3AF]"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            Préparez-vous pour 48h d'innovation !
          </p>
        </div>
      </div>
    </motion.div>

    {/* Social Links */}
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9, duration: 0.5 }}
      className="flex justify-center gap-6"
    >
      <a 
        href="#" 
        className="group flex items-center gap-2 px-4 py-2 rounded-xl border border-[#2D3748] bg-[#111827] hover:border-[#FBBF24] transition-all duration-300"
      >
        <Instagram size={18} className="text-[#9CA3AF] group-hover:text-[#FBBF24] transition-colors" />
        <span 
          className="text-sm text-[#9CA3AF] group-hover:text-[#F9FAFB] transition-colors"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          Club ISOC ESMT
        </span>
      </a>
      <a 
        href="#" 
        className="group flex items-center gap-2 px-4 py-2 rounded-xl border border-[#2D3748] bg-[#111827] hover:border-[#00873E] transition-all duration-300"
      >
        <Linkedin size={18} className="text-[#9CA3AF] group-hover:text-[#00873E] transition-colors" />
        <span 
          className="text-sm text-[#9CA3AF] group-hover:text-[#F9FAFB] transition-colors"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          LinkedIn
        </span>
      </a>
    </motion.div>

    {/* CTA Button */}
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.1, duration: 0.5 }}
    >
      <Link 
        to="/" 
        className="inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-[#00873E] to-[#FBBF24] px-8 py-4 text-sm font-bold text-[#F9FAFB] shadow-lg shadow-[#00873E]/25 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#00873E]/40 group"
        style={{ fontFamily: 'Sora, sans-serif' }}
      >
        Retour à l'accueil
        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
      </Link>
    </motion.div>
  </div>
);

export default Etape8Confirmation;
