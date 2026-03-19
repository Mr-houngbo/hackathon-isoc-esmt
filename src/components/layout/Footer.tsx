import { Link } from "react-router-dom";
import { Instagram, Linkedin, Mail, MapPin, Calendar, Trophy, Users } from "lucide-react";
import { motion } from "framer-motion";

const Footer = () => (
  <footer className="relative overflow-hidden bg-[#0A0A0A] border-t border-[#2D3748]">
    {/* Background decoration */}
    <div className="absolute inset-0 bg-hero-gradient opacity-5"></div>
    
    <div className="container relative z-10 py-16">
      <div className="grid gap-12 lg:grid-cols-4">
        {/* Brand */}
        <div className="lg:col-span-1">
          <div className="mb-6">
            <h3 
              className="font-display text-2xl font-bold text-[#F9FAFB] mb-2"
              style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800 }}
            >
              Hackathon
              <span className="text-gradient"> ISOC-ESMT</span>
            </h3>
            <p 
              className="text-[#FBBF24] font-semibold"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              3-4 Avril 2026
            </p>
          </div>
          <p 
            className="text-sm text-[#9CA3AF] leading-relaxed max-w-sm"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            Organisé par le Club ISOC de l'École Supérieure Multinationale des Télécommunications, Dakar, Sénégal.
          </p>
          
          {/* Social links */}
          <div className="flex gap-3 mt-6">
            <a 
              href="https://instagram.com" 
              className="w-10 h-10 rounded-lg bg-[#111827] border border-[#2D3748] flex items-center justify-center text-[#9CA3AF] hover:text-[#FBBF24] hover:border-[#FBBF24]/50 transition-all duration-300 hover:scale-110"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram size={18} />
            </a>
            <a 
              href="https://linkedin.com" 
              className="w-10 h-10 rounded-lg bg-[#111827] border border-[#2D3748] flex items-center justify-center text-[#9CA3AF] hover:text-[#FBBF24] hover:border-[#FBBF24]/50 transition-all duration-300 hover:scale-110"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin size={18} />
            </a>
            <a 
              href="mailto:club.isoc@esmt.sn" 
              className="w-10 h-10 rounded-lg bg-[#111827] border border-[#2D3748] flex items-center justify-center text-[#9CA3AF] hover:text-[#FBBF24] hover:border-[#FBBF24]/50 transition-all duration-300 hover:scale-110"
            >
              <Mail size={18} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 
            className="font-display font-semibold text-[#F9FAFB] mb-6 flex items-center gap-2"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            <div className="w-1 h-4 bg-[#00873E] rounded-full"></div>
            Navigation
          </h4>
          <div className="flex flex-col gap-3">
            <Link 
              to="/inscription" 
              className="text-sm text-[#9CA3AF] hover:text-[#00873E] transition-colors duration-300 flex items-center gap-2"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              <Calendar size={14} /> Inscription
            </Link>
            <Link 
              to="/agenda" 
              className="text-sm text-[#9CA3AF] hover:text-[#00873E] transition-colors duration-300"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              Programme
            </Link>
            <Link 
              to="/equipes-selectionnees" 
              className="text-sm text-[#9CA3AF] hover:text-[#00873E] transition-colors duration-300 flex items-center gap-2"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              <Users size={14} /> Équipes
            </Link>
            <Link 
              to="/galerie" 
              className="text-sm text-[#9CA3AF] hover:text-[#00873E] transition-colors duration-300 flex items-center gap-2"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              <Trophy size={14} /> Wall of Fame
            </Link>
          </div>
        </div>

        {/* Event Info */}
        <div>
          <h4 
            className="font-display font-semibold text-[#F9FAFB] mb-6 flex items-center gap-2"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            <div className="w-1 h-4 bg-[#FBBF24] rounded-full"></div>
            Événement
          </h4>
          <div className="flex flex-col gap-3 text-sm text-[#9CA3AF]">
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-[#FBBF24]" />
              <span style={{ fontFamily: 'DM Sans, sans-serif' }}>ESMT, Dakar, Sénégal</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-[#FBBF24]" />
              <span style={{ fontFamily: 'DM Sans, sans-serif' }}>3 & 4 Avril 2026</span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={14} className="text-[#FBBF24]" />
              <span style={{ fontFamily: 'DM Sans, sans-serif' }}>40 participants max</span>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h4 
            className="font-display font-semibold text-[#F9FAFB] mb-6 flex items-center gap-2"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            <div className="w-1 h-4 bg-[#00873E] rounded-full"></div>
            Contact
          </h4>
          <div className="flex flex-col gap-3 text-sm">
            <a 
              href="mailto:club.isoc@esmt.sn" 
              className="text-[#9CA3AF] hover:text-[#00873E] transition-colors duration-300 flex items-center gap-2"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              <Mail size={14} className="text-[#FBBF24]" />
              club.isoc@esmt.sn
            </a>
            <div 
              className="text-[#9CA3AF]"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              <MapPin size={14} className="inline mr-2 text-[#FBBF24]" />
              ESMT Dakar
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mt-12 pt-8 border-t border-[#2D3748]">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p 
            className="text-xs text-[#9CA3AF]"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            © 2026 Club ISOC — ESMT Dakar. Tous droits réservés.
          </p>
          <div className="flex gap-6 text-xs">
            <Link to="#" className="text-[#9CA3AF] hover:text-[#00873E] transition-colors duration-300" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              Mentions légales
            </Link>
            <Link to="#" className="text-[#9CA3AF] hover:text-[#00873E] transition-colors duration-300" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              Conditions
            </Link>
            <Link to="#" className="text-[#9CA3AF] hover:text-[#00873E] transition-colors duration-300" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              Confidentialité
            </Link>
          </div>
        </div>
      </div>
    </div>

    {/* Decorative gradient line */}
    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00873E] via-[#FBBF24] to-[#00873E]"></div>
  </footer>
);

export default Footer;
