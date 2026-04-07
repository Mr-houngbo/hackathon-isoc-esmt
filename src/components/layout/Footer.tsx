import { Link } from "react-router-dom";
import { Instagram, Linkedin, Mail, MapPin, Phone, Globe, Heart, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import LegalPopup from "@/components/ui/LegalPopup";

const Footer = () => {
  const [popupState, setPopupState] = useState<{
    isOpen: boolean;
    type: 'privacy' | 'terms' | 'cookies';
  }>({
    isOpen: false,
    type: 'privacy'
  });

  const openPopup = (type: 'privacy' | 'terms' | 'cookies') => {
    setPopupState({ isOpen: true, type });
  };

  const closePopup = () => {
    setPopupState({ ...popupState, isOpen: false });
  };

  const viewFullPage = () => {
    // Navigate to the full page based on type
    const routes = {
      privacy: '/privacy',
      terms: '/termes-conditions',
      cookies: '/cookies'
    };
    window.location.href = routes[popupState.type];
  };

  return (
    <>
      <footer className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
    {/* Background Pattern */}
    <div className="absolute inset-0 opacity-5">
      <div 
        className="absolute inset-0" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>
    </div>

    {/* Top Gradient Border */}
    <div className="h-1 bg-gradient-to-r from-[#40B2A4] via-[#40B2A4] to-[#40B2A4] shadow-lg shadow-[#40B2A4]/20"></div>

    <div className="container relative z-10 py-16">
      {/* Main Footer Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        
        {/* Brand Section */}
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col items-start gap-2">
            <img
              src="/logo-isoc-esmt.png"
              alt="Club ISOC ESMT"
              style={{ height: '88px', width: 'auto', opacity: 1 }}
            />
          </div>
          <div className="flex items-center gap-2 text-xs text-[#40B2A4]/70">
            <Sparkles className="w-3 h-3" />
            <span>Premium Experience 2026 by enverse</span>
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h4 
            className="font-semibold text-sm uppercase tracking-wider text-[#40B2A4] flex items-center gap-2"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            <Globe className="w-4 h-4" />
            Navigation
          </h4>
          <nav className="space-y-2">
            <Link 
              to="/inscription" 
              className="block text-sm text-slate-300 hover:text-[#40B2A4] transition-all duration-300 hover:translate-x-1"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              Inscription
            </Link>
            <Link 
              to="/equipes-selectionnees" 
              className="block text-sm text-slate-300 hover:text-[#40B2A4] transition-all duration-300 hover:translate-x-1"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              Équipes Sélectionnées
            </Link>
            <Link 
              to="/galerie" 
              className="block text-sm text-slate-300 hover:text-[#40B2A4] transition-all duration-300 hover:translate-x-1"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              Galerie
            </Link>
            <Link 
              to="/contact" 
              className="block text-sm text-slate-300 hover:text-[#40B2A4] transition-all duration-300 hover:translate-x-1"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              Contact
            </Link>
          </nav>
        </motion.div>

        {/* Contact Info */}
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h4 
            className="font-semibold text-sm uppercase tracking-wider text-[#40B2A4] flex items-center gap-2"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            <MapPin className="w-4 h-4" />
            Contact
          </h4>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-[#40B2A4] mt-0.5 flex-shrink-0" />
              <span className="text-sm text-slate-300">ESMT Dakar, Sénégal</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-[#40B2A4] flex-shrink-0" />
              <a href="mailto:club_esmt@isoc.sn" className="text-sm text-slate-300 hover:text-[#40B2A4] transition-colors">
                club_esmt@isoc.sn
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-[#40B2A4] flex-shrink-0" />
              <span className="text-sm text-slate-300">+221 77 161 62 86</span>
            </div>
          </div>
        </motion.div>

        {/* Social & Newsletter */}
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h4 
            className="font-semibold text-sm uppercase tracking-wider text-[#40B2A4]"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            Suivez-nous
          </h4>
          <div className="flex gap-3">
            <a 
              href="https://instagram.com" 
              className="w-10 h-10 bg-gradient-to-br from-[#40B2A4]/20 to-[#40B2A4]/20 border border-[#40B2A4]/30 rounded-lg flex items-center justify-center text-[#40B2A4] hover:from-[#40B2A4] hover:to-[#40B2A4] hover:text-white transition-all duration-300 hover:shadow-lg hover:shadow-[#40B2A4]/25"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram size={18} />
            </a>
            <a 
              href="https://www.linkedin.com/company/club-isoc-esmt/" 
              className="w-10 h-10 bg-gradient-to-br from-[#40B2A4]/20 to-[#40B2A4]/20 border border-[#40B2A4]/30 rounded-lg flex items-center justify-center text-[#40B2A4] hover:from-[#40B2A4] hover:to-[#40B2A4] hover:text-white transition-all duration-300 hover:shadow-lg hover:shadow-[#40B2A4]/25"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin size={18} />
            </a>
            <a 
              href="mailto:club_esmt@isoc.sn" 
              className="w-10 h-10 bg-gradient-to-br from-[#40B2A4]/20 to-[#40B2A4]/20 border border-[#40B2A4]/30 rounded-lg flex items-center justify-center text-[#40B2A4] hover:from-[#40B2A4] hover:to-[#40B2A4] hover:text-white transition-all duration-300 hover:shadow-lg hover:shadow-[#40B2A4]/25"
            >
              <Mail size={18} />
            </a>
          </div>
          <div className="text-xs text-slate-400">
            <p>Rejoignez notre communauté</p>
            <p className="text-[#40B2A4] font-semibold mt-1">500+ membres actifs</p>
          </div>
        </motion.div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#40B2A4]/50 to-transparent mb-8"></div>

      {/* Bottom Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <span> 2026 Club ISOC — ESMT Dakar</span>
          <span className="text-[#40B2A4]">•</span>
          <span className="text-slate-600 mx-1">•</span>
          <Link 
            to="/admin/dashboard" 
            className="text-slate-700/50 hover:text-slate-600/70 transition-colors duration-300 cursor-default" 
            style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '8px', letterSpacing: '-0.3px' }}
            title="Accès Admin"
          >
            ad
          </Link>
          <Link 
            to="/comite/login" 
            className="text-slate-700/50 hover:text-slate-600/70 transition-colors duration-300 cursor-default" 
            style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '8px', letterSpacing: '-0.3px' }}
            title="Accès Comité"
          >
            co
          </Link>
        </div>
        
        <div className="flex items-center gap-6 text-xs text-slate-400">
          <button 
            onClick={() => openPopup('privacy')} 
            className="hover:text-[#40B2A4] transition-colors"
          >
            Privacy
          </button>
          <button 
            onClick={() => openPopup('terms')} 
            className="hover:text-[#40B2A4] transition-colors"
          >
            Terms
          </button>
          <button 
            onClick={() => openPopup('cookies')} 
            className="hover:text-[#40B2A4] transition-colors"
          >
            Cookies
          </button>
        </div>
      </div>
    </div>

    {/* Bottom Gradient Line */}
    <div className="h-1 bg-gradient-to-r from-[#40B2A4] via-[#40B2A4] to-[#40B2A4] shadow-lg shadow-[#40B2A4]/30"></div>
  </footer>

  {/* Legal Popup */}
  <LegalPopup
    isOpen={popupState.isOpen}
    onClose={closePopup}
    type={popupState.type}
    onViewFull={viewFullPage}
  />
  </>
  );
};

export default Footer;
