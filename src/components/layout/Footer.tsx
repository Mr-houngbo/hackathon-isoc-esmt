import { Link } from "react-router-dom";
import { Instagram, Linkedin, Mail, MapPin, Calendar, Trophy, Users } from "lucide-react";
import { motion } from "framer-motion";

const Footer = () => (
  <footer className="relative overflow-hidden bg-[#F8F9FA] border-t border-[#E9ECEF]">
    {/* Background decoration */}
    <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B35]/5 via-transparent to-[#1E3A5F]/5"></div>
    
    <div className="container relative z-10 py-16">
      <div className="grid gap-12 lg:grid-cols-4">
        {/* Brand */}
        <div className="lg:col-span-1">
          <div className="mb-6">
            <h3 
              className="font-display text-2xl font-bold text-[#212529] mb-2"
              style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800 }}
            >
              Hackathon
              <span className="text-gradient"> ISOC-ESMT</span>
            </h3>
            <p 
              className="text-[#FF6B35] font-semibold"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              17-18 Avril 2026
            </p>
          </div>
          <p 
            className="text-sm text-[#6C757D] leading-relaxed max-w-sm"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            Organisé par le Club ISOC de l'École Supérieure Multinationale des Télécommunications, Dakar, Sénégal.
          </p>
          
          {/* Social links */}
          <div className="flex gap-3 mt-6">
            <a 
              href="https://instagram.com" 
              className="w-10 h-10 rounded-lg bg-white border border-[#E9ECEF] flex items-center justify-center text-[#6C757D] hover:text-[#FF6B35] hover:border-[#FF6B35]/50 hover:bg-[#FF6B35]/5 transition-all duration-300 hover:scale-110"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram size={18} />
            </a>
            <a 
              href="https://www.linkedin.com/company/club-isoc-esmt/" 
              className="w-10 h-10 rounded-lg bg-white border border-[#E9ECEF] flex items-center justify-center text-[#6C757D] hover:text-[#FF6B35] hover:border-[#FF6B35]/50 hover:bg-[#FF6B35]/5 transition-all duration-300 hover:scale-110"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin size={18} />
            </a>
            <a 
              href="mailto:club_esmt@isoc.sn" 
              className="w-10 h-10 rounded-lg bg-white border border-[#E9ECEF] flex items-center justify-center text-[#6C757D] hover:text-[#FF6B35] hover:border-[#FF6B35]/50 hover:bg-[#FF6B35]/5 transition-all duration-300 hover:scale-110"
            >
              <Mail size={18} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 
            className="font-display font-semibold text-[#212529] mb-6 flex items-center gap-2"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            <div className="w-1 h-4 bg-[#FF6B35] rounded-full"></div>
            Navigation
          </h4>
          <div className="flex flex-col gap-3">
            <Link 
              to="/inscription" 
              className="text-sm text-[#6C757D] hover:text-[#FF6B35] transition-colors duration-300 flex items-center gap-2"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              <Calendar size={14} /> Inscription
            </Link>
            <Link 
              to="/agenda" 
              className="text-sm text-[#6C757D] hover:text-[#FF6B35] transition-colors duration-300"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              Programme
            </Link>
            <Link 
              to="/equipes-selectionnees" 
              className="text-sm text-[#6C757D] hover:text-[#FF6B35] transition-colors duration-300 flex items-center gap-2"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              <Users size={14} /> Équipes
            </Link>
            <Link 
              to="/galerie" 
              className="text-sm text-[#6C757D] hover:text-[#FF6B35] transition-colors duration-300 flex items-center gap-2"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              <Trophy size={14} /> Wall of Fame
            </Link>
          </div>
        </div>

        {/* Event Info */}
        <div>
          <h4 
            className="font-display font-semibold text-[#212529] mb-6 flex items-center gap-2"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            <div className="w-1 h-4 bg-[#1E3A5F] rounded-full"></div>
            Événement
          </h4>
          <div className="flex flex-col gap-3 text-sm text-[#6C757D]">
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-[#FF6B35]" />
              <span style={{ fontFamily: 'DM Sans, sans-serif' }}>ESMT, Dakar, Sénégal</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-[#FF6B35]" />
              <span style={{ fontFamily: 'DM Sans, sans-serif' }}>17 & 18 Avril 2026</span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={14} className="text-[#FF6B35]" />
              <span style={{ fontFamily: 'DM Sans, sans-serif' }}>40 participants max</span>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h4 
            className="font-display font-semibold text-[#212529] mb-6 flex items-center gap-2"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            <div className="w-1 h-4 bg-[#FF6B35] rounded-full"></div>
            Contact
          </h4>
          <div className="flex flex-col gap-3 text-sm">
            <a 
              href="mailto:club_esmt@isoc.sn" 
              className="text-[#6C757D] hover:text-[#FF6B35] transition-colors duration-300 flex items-center gap-2"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              <Mail size={14} className="text-[#FF6B35]" />
              club_esmt@isoc.sn
            </a>
            <div 
              className="text-[#6C757D]"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              <MapPin size={14} className="inline mr-2 text-[#FF6B35]" />
              ESMT Dakar
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mt-12 pt-8 border-t border-[#E9ECEF]">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p 
            className="text-xs text-[#6C757D]"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            © 2026 Club ISOC — ESMT Dakar. Tous droits réservés.
          </p>
          <div className="flex gap-6 text-xs">
            <a href="/termes-conditions#mentions-legales" className="text-[#6C757D] hover:text-[#FF6B35] transition-colors duration-300" style={{ fontFamily: 'DM Sans, sans-serif' }} target="_blank" rel="noopener noreferrer">
              Mentions légales
            </a>
            <a href="/termes-conditions" className="text-[#6C757D] hover:text-[#FF6B35] transition-colors duration-300" style={{ fontFamily: 'DM Sans, sans-serif' }} target="_blank" rel="noopener noreferrer">
              Conditions
            </a>
            <a href="/termes-conditions#confidentialite" className="text-[#6C757D] hover:text-[#FF6B35] transition-colors duration-300" style={{ fontFamily: 'DM Sans, sans-serif' }} target="_blank" rel="noopener noreferrer">
              Confidentialité
            </a>
            <Link 
              to="/admin/dashboard" 
              className="text-[#DEE2E6] hover:text-[#ADB5BD] transition-colors duration-300" 
              style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px' }}
              title="Accès Admin"
            >
              ad
            </Link>
            <Link 
              to="/comite/login" 
              className="text-[#DEE2E6] hover:text-[#ADB5BD] transition-colors duration-300 ml-2" 
              style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px' }}
              title="Espace Comité"
            >
              co
            </Link>
          </div>
        </div>
      </div>
    </div>

    {/* Decorative gradient line */}
    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF6B35] via-[#1E3A5F] to-[#FF6B35]"></div>
  </footer>
);

export default Footer;
