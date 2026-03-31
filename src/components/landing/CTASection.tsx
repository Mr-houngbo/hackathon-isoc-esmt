import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Rocket, Sparkles, Timer } from "lucide-react";
import { GlobeISoc } from "@/components/ui/GlobeISoc";

const CTASection = () => (
  <section className="py-24 bg-gradient-to-br from-white to-[#F8F9FA] relative overflow-hidden hidden lg:block">
    {/* Animated background */}
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#40B2A4]/5 rounded-full blur-3xl animate-float-elegant"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#24366E]/5 rounded-full blur-3xl animate-float-elegant" style={{ animationDelay: '2s' }}></div>
    </div>
    
    <div className="container relative z-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#40B2A4] via-[#24366E] to-[#40B2A4] p-12 sm:p-20 text-center shadow-2xl"
      >
        {/* Floating icons */}
        <motion.div
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-8 left-8 text-white/20"
        >
          <Rocket size={32} />
        </motion.div>
        <motion.div
          animate={{ y: [10, -10, 10] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute top-12 right-12 text-white/20"
        >
          <Sparkles size={24} />
        </motion.div>
        <motion.div
          animate={{ y: [-5, 5, -5] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute bottom-8 left-16 text-white/20"
        >
          <Timer size={28} />
        </motion.div>
        
        {/* Globe decoration */}
        <motion.div
          animate={{ y: [-8, 8, -8], rotate: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute bottom-12 right-20"
        >
          <GlobeISoc size={40} opacity={0.3} className="text-white" />
        </motion.div>
        
        <div className="relative z-10">
          {/* Urgency badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-2 rounded-full mb-8 mx-auto"
          >
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-white" style={{ fontFamily: 'Sora, sans-serif' }}>
              Places limitées
            </span>
          </motion.div>
          
          {/* Main title */}
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="font-display text-4xl sm:text-6xl font-bold text-white mb-6"
            style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800 }}
          >
            Prêt à 
            <span className="text-white"> relever le défi</span> ?
          </motion.h2>
          
          {/* Description */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-white/90 text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            Rejoignez des innovateurs de tous horizons pour 48h de création intensive. 
            Transformez vos idées en prototypes et gagnez jusqu'à 450 000 FCFA (en tout). 
            Ouvert à tous les étudiants, avec priorité ESMT.
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
              <div className="text-3xl font-bold text-white mb-1" style={{ fontFamily: 'Sora, sans-serif' }}>40</div>
              <div className="text-sm text-white/80" style={{ fontFamily: 'DM Sans, sans-serif' }}>Participants</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1" style={{ fontFamily: 'Sora, sans-serif' }}>48h</div>
              <div className="text-sm text-white/80" style={{ fontFamily: 'DM Sans, sans-serif' }}>Création</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1" style={{ fontFamily: 'Sora, sans-serif' }}>450K</div>
              <div className="text-sm text-white/80" style={{ fontFamily: 'DM Sans, sans-serif' }}>FCFA en prix (en tout)</div>
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
              className="btn-orange group relative inline-flex items-center gap-3 rounded-xl px-10 py-5 text-lg font-semibold text-white overflow-hidden shadow-xl hover:shadow-white/20"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              {/* Button glow effect */}
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <span className="relative z-10 flex items-center gap-3">
                S'inscrire maintenant 
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </Link>
            
            <Link
              to="/galerie"
              className="inline-flex items-center gap-3 rounded-xl border-2 border-white/30 px-8 py-5 text-lg font-medium text-white hover:border-white/60 hover:bg-white/10 transition-all duration-300"
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
            className="mt-8 text-sm text-white/80 flex items-center justify-center gap-2"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            <Timer size={14} className="text-white" />
            Les inscriptions ferment le 28 Mars 2026
          </motion.p>
        </div>
        
        {/* Decorative corners */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-tl-3xl"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-white/20 to-transparent rounded-br-3xl"></div>
      </motion.div>
    </div>
  </section>
);

export default CTASection;
