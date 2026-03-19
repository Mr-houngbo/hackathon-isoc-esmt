import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Rocket, Sparkles, Timer } from "lucide-react";

const CTASection = () => (
  <section className="py-24 bg-[#0A0A0A] relative overflow-hidden">
    {/* Animated background */}
    <div className="absolute inset-0">
      <div className="absolute inset-0 bg-gradient-to-r from-[#00873E]/5 via-[#FBBF24]/5 to-[#00873E]/5 animate-pulse"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00873E]/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#FBBF24]/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
    </div>
    
    <div className="container relative z-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#111827] via-[#1F2937] to-[#111827] p-12 sm:p-20 text-center border border-[#2D3748]"
      >
        {/* Glass overlay */}
        <div className="absolute inset-0 glassmorphism rounded-3xl"></div>
        
        {/* Floating icons */}
        <motion.div
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-8 left-8 text-[#FBBF24]/20"
        >
          <Rocket size={32} />
        </motion.div>
        <motion.div
          animate={{ y: [10, -10, 10] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute top-12 right-12 text-[#00873E]/20"
        >
          <Sparkles size={24} />
        </motion.div>
        <motion.div
          animate={{ y: [-5, 5, -5] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute bottom-8 left-16 text-[#FBBF24]/20"
        >
          <Timer size={28} />
        </motion.div>
        
        <div className="relative z-10">
          {/* Urgency badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 badge-premium px-4 py-2 rounded-full mb-8 mx-auto"
          >
            <div className="w-2 h-2 bg-[#FBBF24] rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold" style={{ fontFamily: 'Sora, sans-serif' }}>
              Limited spots available
            </span>
          </motion.div>
          
          {/* Main title */}
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="font-display text-4xl sm:text-6xl font-bold text-[#F9FAFB] mb-6"
            style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800 }}
          >
            Prêt à 
            <span className="text-gradient"> relever le défi</span> ?
          </motion.h2>
          
          {/* Description */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-[#9CA3AF] text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            Rejoignez 40 innovateurs pour 48h de création intensive. 
            Transformez vos idées en prototypes et gagnez jusqu'à 250 000 FCFA.
          </motion.p>
          
          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-8 mb-12"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-[#FBBF24] mb-1" style={{ fontFamily: 'Sora, sans-serif' }}>40</div>
              <div className="text-sm text-[#9CA3AF]" style={{ fontFamily: 'DM Sans, sans-serif' }}>Participants</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#00873E] mb-1" style={{ fontFamily: 'Sora, sans-serif' }}>48h</div>
              <div className="text-sm text-[#9CA3AF]" style={{ fontFamily: 'DM Sans, sans-serif' }}>Création</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#FBBF24] mb-1" style={{ fontFamily: 'Sora, sans-serif' }}>450K</div>
              <div className="text-sm text-[#9CA3AF]" style={{ fontFamily: 'DM Sans, sans-serif' }}>FCFA en prix</div>
            </div>
          </motion.div>
          
          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link
              to="/inscription"
              className="btn-premium group relative inline-flex items-center gap-3 rounded-xl px-10 py-5 text-lg font-semibold text-[#F9FAFB] overflow-hidden"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              {/* Button glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#00873E] to-[#FBBF24] opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              
              <span className="relative z-10 flex items-center gap-3">
                S'inscrire maintenant 
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </Link>
            
            <Link
              to="/galerie"
              className="inline-flex items-center gap-3 rounded-xl border border-[#2D3748] px-8 py-5 text-lg font-medium text-[#9CA3AF] hover:border-[#00873E]/50 hover:text-[#F9FAFB] transition-all duration-300"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              Voir l'édition précédente
            </Link>
          </motion.div>
          
          {/* Deadline warning */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            className="mt-8 text-sm text-[#9CA3AF] flex items-center justify-center gap-2"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            <Timer size={14} className="text-[#FBBF24]" />
            Les inscriptions ferment le 28 Mars 2026
          </motion.p>
        </div>
        
        {/* Decorative corners */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-[#00873E]/20 to-transparent rounded-tl-3xl"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-[#FBBF24]/20 to-transparent rounded-br-3xl"></div>
      </motion.div>
    </div>
  </section>
);

export default CTASection;
