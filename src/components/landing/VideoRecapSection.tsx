import { motion } from "framer-motion";
import { Play, Youtube, Sparkles, Calendar, Clock, Users, Trophy } from "lucide-react";

const VideoRecapSection = () => (
  <section className="relative py-20 bg-gradient-to-br from-[#24366E] via-[#1A264A] to-[#0F1535] overflow-hidden">
    {/* Background décoratif */}
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#40B2A4]/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#FFC107]/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#24366E]/30 rounded-full blur-[150px]"></div>
      
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2340B2A4' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>
    </div>

    <div className="container relative z-10">
      {/* Header */}
      <motion.div 
        className="text-center mb-12"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFC107]/20 border border-[#FFC107]/30 mb-6">
          <Youtube className="w-5 h-5 text-[#FFC107]" />
          <span className="text-sm font-semibold text-[#FFC107]">Retour sur l'édition 2026</span>
        </div>
        
        <h2 
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4"
          style={{ fontFamily: 'Sora, sans-serif' }}
        >
          Revivez l'événement en <span className="text-[#FFC107]">vidéo</span>
        </h2>
        <p 
          className="text-lg text-white/60 max-w-2xl mx-auto"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          Plongez au cœur du Hackathon ISOC-ESMT 2026 à travers ce récapitulatif vidéo de l'édition
        </p>
      </motion.div>

      {/* Stats rapides */}
      <motion.div 
        className="flex flex-wrap justify-center gap-4 md:gap-8 mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="flex items-center gap-2 text-white/70">
          <Calendar className="w-5 h-5 text-[#40B2A4]" />
          <span className="text-sm">2 jours d'innovation</span>
        </div>
        <div className="flex items-center gap-2 text-white/70">
          <Users className="w-5 h-5 text-[#40B2A4]" />
          <span className="text-sm">10 projets sélectionnés</span>
        </div>
        <div className="flex items-center gap-2 text-white/70">
          <Clock className="w-5 h-5 text-[#40B2A4]" />
          <span className="text-sm">48h de compétition</span>
        </div>
        <div className="flex items-center gap-2 text-white/70">
          <Trophy className="w-5 h-5 text-[#FFC107]" />
          <span className="text-sm">3 lauréats primés</span>
        </div>
      </motion.div>

      {/* Video Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="max-w-5xl mx-auto"
      >
        <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-[#40B2A4]/20 border-2 border-[#40B2A4]/30">
          {/* Glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-[#40B2A4] via-[#FFC107] to-[#40B2A4] rounded-3xl blur-xl opacity-30"></div>
          
          <div className="relative bg-black rounded-3xl overflow-hidden">
            {/* YouTube Embed */}
            <div className="relative aspect-video">
              <iframe
                src="https://www.youtube.com/embed/ithoe_gP0G8?rel=0&modestbranding=1&playsinline=1"
                title="Hackathon ISOC-ESMT 2026 - Vidéo Récap"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              ></iframe>
            </div>
          </div>
          
          {/* Badge flottant */}
          <motion.div 
            className="absolute top-4 right-4 z-10"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF0000] text-white shadow-lg">
              <Youtube className="w-5 h-5" />
              <span className="text-sm font-semibold">YouTube</span>
            </div>
          </motion.div>
        </div>

        {/* CTA sous la vidéo */}
        <motion.div 
          className="flex flex-wrap justify-center gap-4 mt-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <a 
            href="https://www.youtube.com/watch?v=ithoe_gP0G8"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FF0000] text-white font-semibold hover:bg-[#CC0000] transition-colors shadow-lg"
          >
            <Play className="w-5 h-5" />
            <span>Voir sur YouTube</span>
          </a>
          <a 
            href="/galerie"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 text-white border border-white/20 font-semibold hover:bg-white/20 transition-colors"
          >
            <Sparkles className="w-5 h-5" />
            <span>Galerie photos</span>
          </a>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

export default VideoRecapSection;
