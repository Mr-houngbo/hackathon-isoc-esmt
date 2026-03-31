import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Home, Search, ArrowLeft, Compass, Zap, AlertCircle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Rediriger vers la page d'accueil avec une recherche si nécessaire
      window.location.href = `/?search=${encodeURIComponent(searchTerm)}`;
    }
  };

  const quickLinks = [
    { icon: Home, label: "Accueil", href: "/" },
    { icon: Compass, label: "Inscription", href: "/inscription" },
    { icon: Zap, label: "Agenda", href: "/agenda" },
    { icon: Search, label: "Mentors", href: "/mentors" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#40B2A4]/5 via-white to-[#24366E]/5 flex items-center justify-center px-4 py-12">
      <div className="max-w-4xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* 404 Animation */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 200, 
              damping: 15, 
              duration: 0.8,
              delay: 0.2
            }}
            className="relative mb-8"
          >
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-[#40B2A4] to-[#24366E] rounded-full blur-3xl opacity-20 animate-pulse"></div>
              <div className="relative">
                <div className="text-[180px] sm:text-[220px] font-black leading-none bg-gradient-to-r from-[#40B2A4] to-[#24366E] bg-clip-text text-transparent"
                     style={{ fontFamily: 'Sora, sans-serif' }}>
                  404
                </div>
              </div>
            </div>
          </motion.div>

          {/* Error Messages */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-4 mb-8"
          >
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#212529]"
                style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800 }}>
              Oups ! Page introuvable
            </h1>
            
            <div className="flex items-center justify-center gap-2 mb-4">
              <AlertCircle className="text-[#40B2A4]" size={24} />
              <p className="text-lg sm:text-xl text-[#6C757D]"
                 style={{ fontFamily: 'DM Sans, sans-serif' }}>
                La page que vous cherchez semble avoir disparu dans le cyber-espace
              </p>
            </div>

            <p className="text-[#6C757D] max-w-2xl mx-auto"
               style={{ fontFamily: 'DM Sans, sans-serif' }}>
              L'URL <code className="bg-[#E9ECEF] px-2 py-1 rounded text-[#212529] font-mono text-sm">
                {location.pathname}
              </code> n'existe pas ou a été déplacée.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="max-w-md mx-auto mb-8"
          >
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher sur le site..."
                className="w-full px-6 py-4 pr-12 rounded-2xl border-2 border-[#E9ECEF] bg-white text-[#212529] placeholder-[#6C757D] focus:outline-none focus:ring-2 focus:ring-[#40B2A4]/20 focus:border-[#40B2A4] transition-all shadow-lg"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-gradient-to-r from-[#40B2A4] to-[#24366E] text-white rounded-xl hover:from-[#40B2A4]/90 hover:to-[#24366E]/90 transition-all"
              >
                <Search size={18} />
              </button>
            </form>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mb-8"
          >
            <h2 className="font-display text-lg font-semibold text-[#212529] mb-4"
                style={{ fontFamily: 'Sora, sans-serif' }}>
              Pages populaires
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
              {quickLinks.map((link, index) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.9 + index * 0.1 }}
                >
                  <Link
                    to={link.href}
                    className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border-2 border-[#E9ECEF] hover:border-[#40B2A4]/30 hover:shadow-lg transition-all group"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#40B2A4]/10 to-[#24366E]/10 flex items-center justify-center group-hover:from-[#40B2A4]/20 group-hover:to-[#24366E]/20 transition-all">
                      <link.icon 
                        size={20} 
                        className="text-[#40B2A4] group-hover:scale-110 transition-transform" 
                      />
                    </div>
                    <span className="text-sm font-medium text-[#212529]"
                          style={{ fontFamily: 'DM Sans, sans-serif' }}>
                      {link.label}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Main CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/"
              className="btn-premium flex items-center justify-center gap-2 rounded-xl px-8 py-4 text-base font-semibold transition-all hover:scale-105 shadow-lg"
            >
              <Home size={20} />
              Retour à l'accueil
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-[#E9ECEF] text-[#212529] rounded-xl hover:border-[#40B2A4]/30 hover:shadow-lg transition-all font-semibold"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              <ArrowLeft size={20} />
              Page précédente
            </button>
          </motion.div>

          {/* Fun Animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="mt-12 text-sm text-[#9CA3AF]"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            <p className="flex items-center justify-center gap-2">
              <Zap size={16} className="text-[#40B2A4]" />
              Même les meilleurs hackathons ont parfois des bugs... 😉
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
