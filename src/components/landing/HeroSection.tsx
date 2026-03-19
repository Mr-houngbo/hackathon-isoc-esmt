import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, MapPin, Users } from "lucide-react";
import CountdownTimer from "./CountdownTimer";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => (
  <section className="relative overflow-hidden bg-hero-gradient">
    {/* Background */}
    <div className="absolute inset-0">
      <img src={heroBg} alt="" className="h-full w-full object-cover opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/90 via-[#0A0A0A]/80 to-[#0A0A0A]/95" />
    </div>

    <div className="container relative z-10 py-24 sm:py-32 lg:py-36">
      <div className="mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#2D3748] bg-[#111827]/50 px-6 py-2 text-sm text-[#9CA3AF] backdrop-blur-md"
        >
          <span className="h-2 w-2 rounded-full bg-[#FBBF24] animate-pulse" />
          2ème édition — Inscriptions ouvertes
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight text-[#F9FAFB]"
          style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800 }}
        >
          Hackathon
          <br />
          <span className="text-gradient">ISOC-ESMT 2026</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-8 max-w-2xl text-xl text-[#9CA3AF]"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          48h d'innovation pour transformer le campus. Idéation, prototypage et pitch devant un jury d'experts.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-[#9CA3AF]"
        >
          <span className="flex items-center gap-2">
            <Calendar size={16} className="text-[#FBBF24]" />
            3 & 4 Avril 2026
          </span>
          <span className="flex items-center gap-2">
            <MapPin size={16} className="text-[#FBBF24]" />
            ESMT, Dakar
          </span>
          <span className="flex items-center gap-2">
            <Users size={16} className="text-[#FBBF24]" />
            40 participants max
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 flex justify-center"
        >
          <CountdownTimer />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <Link
            to="/inscription"
            className="btn-premium inline-flex items-center gap-3 rounded-xl px-10 py-4 font-display font-semibold text-[#F9FAFB]"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            S'inscrire maintenant <ArrowRight size={20} />
          </Link>
          <a
            href="#programme"
            className="inline-flex items-center gap-3 rounded-xl border border-[#2D3748] px-10 py-4 font-display font-medium text-[#F9FAFB] transition-all duration-300 hover:border-[#00873E]/50 hover:bg-[#111827]/50"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            Voir le programme
          </a>
        </motion.div>
      </div>
    </div>

    {/* Ligne décorative */}
    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
      <div className="w-48 h-0.5 bg-gradient-to-r from-transparent via-[#00873E] to-transparent"></div>
    </div>
  </section>
);

export default HeroSection;
