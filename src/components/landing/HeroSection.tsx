import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, MapPin, Users, Code2 } from "lucide-react";
import CountdownTimer from "./CountdownTimer";

const HeroSection = () => (
  <section className="relative overflow-hidden bg-gradient-to-br from-white via-[#F8F9FA] to-white">
    {/* Background decorative elements */}
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FF6B35]/5 rounded-full blur-3xl animate-float-elegant"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#1E3A5F]/5 rounded-full blur-3xl animate-float-elegant" style={{ animationDelay: '2s' }}></div>
    </div>

    {/* Video Background */}
    <div className="absolute inset-0 flex items-center justify-center opacity-8">
      <div className="w-full h-full bg-gradient-to-r from-[#FF6B35]/10 via-transparent to-[#1E3A5F]/10"></div>
    </div>

    <div className="container relative z-10 py-20 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-5xl">
        
        <motion.div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-6xl sm:text-7xl lg:text-8xl font-extrabold leading-tight mb-6"
            style={{ fontFamily: 'Sora, sans-serif', fontWeight: 900 }}
          >
            <span className="text-[#212529]">Hackathon</span>
            <br />
            <span className="text-gradient">ISOC-ESMT 2026</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mx-auto max-w-3xl text-xl text-[#6C757D] leading-relaxed mb-8"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            48h d'innovation pure pour transformer le campus. 
            <span className="text-[#1E3A5F] font-semibold"> Idéation, prototypage et pitch</span> 
            {" "}devant un jury d'experts de l'industrie.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-8 text-sm font-medium text-[#6C757D] mb-12"
          >
            <span className="flex items-center gap-2 px-4 py-2 bg-[#F8F9FA] rounded-full border border-[#E9ECEF]">
              <Calendar size={18} className="text-[#FF6B35]" />
              <span>17 & 18 Avril 2026</span>
            </span>
            <span className="flex items-center gap-2 px-4 py-2 bg-[#F8F9FA] rounded-full border border-[#E9ECEF]">
              <MapPin size={18} className="text-[#FF6B35]" />
              <span>ESMT, Dakar</span>
            </span>
            <span className="flex items-center gap-2 px-4 py-2 bg-[#F8F9FA] rounded-full border border-[#E9ECEF]">
              <Users size={18} className="text-[#FF6B35]" />
              <span>40 participants max</span>
            </span>
          </motion.div>
        </motion.div>

        {/* Countdown Timer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex justify-center mb-16"
        >
          <div className="bg-white rounded-2xl border border-[#E9ECEF] shadow-xl p-8">
            <CountdownTimer />
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <Link
            to="/inscription"
            className="btn-orange group relative overflow-hidden rounded-xl px-12 py-5 font-display font-bold text-lg shadow-2xl hover:shadow-[#FF6B35]/30"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            <span className="relative z-10 flex items-center gap-3">
              S'inscrire maintenant 
              <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </Link>
          
          <a
            href="#programme"
            className="group relative overflow-hidden rounded-xl border-2 border-[#1E3A5F] bg-white px-12 py-5 font-display font-bold text-lg text-[#1E3A5F] shadow-xl hover:shadow-[#1E3A5F]/20 transition-all duration-300 hover:scale-105"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            <span className="flex items-center gap-3">
              <Code2 size={24} />
              Voir le programme
            </span>
          </a>
        </motion.div>
      </div>
    </div>

    {/* Decorative bottom gradient */}
    <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-[#FF6B35] via-[#1E3A5F] to-[#FF6B35]"></div>
  </section>
);

export default HeroSection;
