import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, MapPin, Users, Code2 } from "lucide-react";
import CountdownTimer from "./CountdownTimer";

const HeroSection = () => (
  <section className="relative overflow-hidden bg-gradient-to-br from-white via-[#F8F9FA] to-white min-h-screen">
    {/* Background décoratif subtil */}
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FF6B35]/3 rounded-full blur-3xl animate-float-elegant"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#1E3A5F]/3 rounded-full blur-3xl animate-float-elegant" style={{ animationDelay: '2s' }}></div>
    </div>

    <div className="container relative z-10 py-20 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl">
        
        {/* LAYOUT PRINCIPAL : Texte à gauche, Vidéo à droite */}
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[600px]">
          
          {/* GAUCHE : CONTENU TEXTE */}
          <motion.div 
            className="order-2 lg:order-1 text-center lg:text-left"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            {/* Titre Principal */}
            <h1 
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6"
              style={{ fontFamily: 'Sora, sans-serif', fontWeight: 900 }}
            >
              <span className="text-[#212529] block mb-2">Hackathon</span>
              <span className="text-gradient bg-gradient-to-r from-[#FF6B35] to-[#1E3A5F] bg-clip-text text-transparent block">
                ISOC-ESMT 2026
              </span>
            </h1>

            {/* Description */}
            <p 
              className="text-lg text-[#6C757D] leading-relaxed mb-8 max-w-lg"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              48h d'innovation pure pour transformer le campus. 
              <span className="text-[#1E3A5F] font-semibold"> Idéation, prototypage et pitch</span> 
              {" "}devant un jury d'experts de l'industrie.
            </p>

            {/* Countdown Timer */}
            <div className="mb-8">
              <div className="bg-white rounded-2xl border border-[#E9ECEF] shadow-lg p-4 w-auto lg:w-fit overflow-hidden">
                <CountdownTimer />
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start w-full lg:w-auto">
              <Link
                to="/inscription"
                className="btn-orange group relative overflow-hidden rounded-xl px-8 py-4 font-display font-bold text-base shadow-lg hover:shadow-[#FF6B35]/30 text-center flex-1 sm:flex-initial"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  S'inscrire maintenant 
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>
              
              <a
                href="#programme"
                className="group relative overflow-hidden rounded-xl border-2 border-[#1E3A5F] bg-white px-8 py-4 font-display font-bold text-base text-[#1E3A5F] shadow-lg hover:shadow-[#1E3A5F]/20 transition-all duration-300 hover:scale-105 text-center flex-1 sm:flex-initial"
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
            className="order-1 lg:order-2 relative"
            initial={{ opacity: 0, x: 50, rotateY: 10 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 1.2, delay: 0.4 }}
            style={{ perspective: '1000px' }}
          >
            {/* Container vidéo 3D */}
            <div 
              className="relative w-full max-w-4xl mx-auto lg:mx-0"
              style={{ 
                transform: 'rotate(-4deg)',
                transformStyle: 'preserve-3d',
                animation: 'float 6s ease-in-out infinite'
              }}
            >
              {/* Vidéo */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-black">
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
                <div className="absolute top-6 right-6 z-20">
                  <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-white/20">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#FF6B35] rounded-full animate-pulse"></div>
                      <span className="text-[#212529] text-sm font-semibold">🎬 Teaser</span>
                    </div>
                  </div>
                </div>
                
                {/* Bordure premium */}
                <div className="absolute inset-0 rounded-3xl border-2 border-[#FF6B35]/20 pointer-events-none"></div>
              </div>
              
              {/* Shadow 3D */}
              <div 
                className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-gradient-to-r from-[#FF6B35]/20 via-[#1E3A5F]/20 to-[#FF6B35]/20 rounded-full blur-xl"
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

    {/* Animation CSS pour le flottement */}
    <style>{`
      @keyframes float {
        0%, 100% { transform: rotate(-4deg) translateY(0px); }
        50% { transform: rotate(-4deg) translateY(-10px); }
      }
    `}</style>

    {/* Decorative bottom gradient */}
    <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-[#FF6B35] via-[#1E3A5F] to-[#FF6B35]"></div>
  </section>
);

export default HeroSection;
