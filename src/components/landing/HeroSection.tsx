import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, MapPin, Users, Code2 } from "lucide-react";
import CountdownTimer from "./CountdownTimer";
import { GlobeISoc, GlobeBackground } from "@/components/ui/GlobeISoc";

const HeroSection = () => (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-[#F8F9FA] to-white sm:min-h-screen">
    {/* Background décoratif subtil - masqué sur mobile */}
    <div className="absolute inset-0 overflow-hidden hidden sm:block">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#40B2A4]/3 rounded-full blur-3xl animate-float-elegant"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#24366E]/3 rounded-full blur-3xl animate-float-elegant" style={{ animationDelay: '2s' }}></div>
      
      {/* Globe decorations */}
      <motion.div 
        className="absolute top-20 right-10 opacity-30"
        animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <GlobeISoc size={60} opacity={0.3} />
      </motion.div>
      <motion.div 
        className="absolute bottom-40 left-10 opacity-20"
        animate={{ y: [0, -8, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <GlobeISoc size={80} opacity={0.2} />
      </motion.div>
    </div>

    <div className="container relative z-10 py-6 sm:py-16 lg:py-32">
      <div className="mx-auto max-w-7xl">
        
        {/* LAYOUT PRINCIPAL : Texte à gauche, Vidéo à droite */}
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-12 items-center min-h-[400px] sm:min-h-[600px]">
          
          {/* GAUCHE : CONTENU TEXTE */}
          <motion.div 
            className="order-2 lg:order-1 text-center lg:text-left"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            {/* Titre Principal */}
            <h1 
              className="font-display text-2xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-2 sm:mb-6"
              style={{ fontFamily: 'Sora, sans-serif', fontWeight: 900 }}
            >
              <span className="text-[#212529] block mb-1 sm:mb-2 text-xl sm:text-5xl">Hackathon</span>
              <span className="text-gradient bg-gradient-to-r from-[#40B2A4] to-[#24366E] bg-clip-text text-transparent block text-xl sm:text-5xl">
                ISOC-ESMT 2026
              </span>
            </h1>

            {/* Description - version mobile ultra compacte */}
            <p 
              className="text-xs sm:text-lg text-[#6C757D] leading-relaxed mb-3 sm:mb-8 max-w-lg px-2 sm:px-0"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              48h d'innovation pour transformer le campus. 
              <span className="text-[#24366E] font-semibold hidden sm:inline"> Idéation, prototypage et pitch</span> 
              <span className="hidden sm:inline">{" "}devant un jury d'experts.</span>
            </p>

            {/* Countdown Timer */}
            <div className="mb-3 sm:mb-8">
              <div className="bg-white rounded-xl sm:rounded-2xl border border-[#E9ECEF] shadow-lg p-2 sm:p-4 w-fit overflow-hidden mx-auto lg:mx-0">
                <CountdownTimer />
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center lg:justify-start w-full lg:w-auto px-4 sm:px-0">
              <Link
                to="/inscription"
                className="group relative overflow-hidden rounded-lg sm:rounded-xl px-4 sm:px-8 py-2 sm:py-4 font-display font-bold text-xs sm:text-base shadow-lg hover:shadow-[#24366E]/30 text-center flex-1 sm:flex-initial bg-[#24366E] text-white"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                <span className="relative z-10 flex items-center justify-center gap-1 sm:gap-2">
                  <span className="sm:hidden">S'inscrire</span>
                  <span className="hidden sm:inline">S'inscrire maintenant</span> 
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#40B2A4] to-[#40B2A4] opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>
              
              <a
                href="#programme"
                className="group relative overflow-hidden rounded-lg sm:rounded-xl border-2 border-[#24366E] bg-white px-4 sm:px-8 py-2 sm:py-4 font-display font-bold text-xs sm:text-base text-[#24366E] shadow-lg hover:shadow-[#24366E]/20 transition-all duration-300 hover:scale-105 text-center flex-1 sm:flex-initial hidden sm:inline-flex"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                <span className="flex items-center justify-center gap-2">
                  <Code2 size={20} />
                  Voir le programme
                </span>
              </a>
            </div>
          </motion.div>

          {/* DROITE : VIDÉO 3D INCLINÉE */}
          <motion.div 
            className="order-1 lg:order-2 relative px-2 sm:px-0"
            initial={{ opacity: 0, x: 50, rotateY: 10 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 1.2, delay: 0.4 }}
            style={{ perspective: '1000px' }}
          >
            {/* Container vidéo 3D - sans rotation sur mobile */}
            <div 
              className="relative w-full max-w-4xl mx-auto lg:mx-0"
              style={{ 
                transform: 'none',
                transformStyle: 'preserve-3d'
              }}
            >
              {/* Vidéo */}
              <div className="relative rounded-xl sm:rounded-3xl overflow-hidden shadow-lg sm:shadow-2xl bg-black">
                <div className="relative aspect-video">
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                    poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1920 1080'%3E%3Crect fill='%23FF6B35'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='white' font-family='sans-serif' font-size='48'%3EChargement...%3C/text%3E%3C/svg%3E"
                  >
                    <source src="https://imgur.com/BTKm4He.mp4" type="video/mp4" />
                  </video>
                  
                  {/* Overlay subtil pour profondeur */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none"></div>
                </div>
                
                {/* Badge vidéo flottant */}
                <div className="absolute top-2 sm:top-6 right-2 sm:right-6 z-20">
                  <div className="bg-white/90 backdrop-blur-sm px-2 sm:px-4 py-1 sm:py-2 rounded-full shadow-lg border border-white/20">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#40B2A4] rounded-full animate-pulse"></div>
                      <span className="text-[#212529] text-[10px] sm:text-sm font-semibold">Teaser</span>
                    </div>
                  </div>
                </div>
                
                {/* Globe decoration near video - hidden on mobile */}
                <motion.div 
                  className="absolute -top-2 -left-2 sm:-top-4 sm:-left-4 z-10 hidden sm:block"
                  animate={{ y: [0, -5, 0], rotate: [0, 10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <GlobeISoc size={24} opacity={0.5} />
                </motion.div>
                
                {/* Bordure premium */}
                <div className="absolute inset-0 rounded-xl sm:rounded-3xl border-2 border-[#40B2A4]/20 pointer-events-none"></div>
              </div>
              
              {/* Shadow 3D - hidden on mobile */}
              <div 
                className="hidden sm:block absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-gradient-to-r from-[#40B2A4]/20 via-[#24366E]/20 to-[#40B2A4]/20 rounded-full blur-xl"
                style={{ 
                  transform: 'rotate(4deg) translateX(-50%)',
                  filter: 'blur(12px)'
                }}
              ></div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>

    {/* Animation CSS pour le flottement - desktop only */}
    <style>{`
      @keyframes float {
        0%, 100% { transform: rotate(-4deg) translateY(0px); }
        50% { transform: rotate(-4deg) translateY(-10px); }
      }
      @media (max-width: 640px) {
        .animate-float-elegant {
          animation: none !important;
        }
      }
    `}</style>

    {/* Decorative bottom gradient */}
    <div className="absolute bottom-0 left-0 right-0 h-1 sm:h-2 bg-gradient-to-r from-[#40B2A4] via-[#24366E] to-[#40B2A4]"></div>
  </section>
);

export default HeroSection;
