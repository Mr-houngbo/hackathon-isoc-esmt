import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Code2, Trophy, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Accueil", path: "/" },
  { label: "Thématiques", path: "/thematiques" },
  { label: "Équipes", path: "/equipes-selectionnees" },
  { label: "Agenda", path: "/agenda" },
  { label: "Mentors", path: "/mentors" },
  { label: "Partenaires", path: "/partenaires" },
  { label: "Galerie", path: "/galerie" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 z-50 w-full transition-all duration-300 bg-white/95 backdrop-blur-sm border-b border-[#E9ECEF]/50 shadow-sm`}>
      <div className="container h-12 sm:h-16 md:h-28 flex items-center justify-between px-2 sm:px-4">
        <Link to="/" className="flex items-center gap-2 overflow-visible min-w-fit -ml-2 sm:ml-0">
          <img
            src="/logo-isoc-esmt.png"
            alt="Club ISOC ESMT"
            className="!h-[120px] sm:!h-[180px] md:!h-[250px] !w-auto min-h-[100px] sm:min-h-[150px] md:min-h-[250px] object-contain shrink-0"
          />
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                location.pathname === link.path
                  ? "bg-gradient-to-r from-[#24366E] to-[#24366E] text-white shadow-lg shadow-[#24366E]/25 border border-[#24366E]/20"
                  : "text-[#6C757D] hover:text-[#212529] hover:bg-[#F8F9FA]"
              }`}
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/equipes-selectionnees"
            className="bg-gradient-to-r from-[#24366E] to-[#24366E] hover:from-[#1a264f] hover:to-[#1a264f] text-white font-semibold ml-3 inline-flex items-center gap-2 rounded-lg px-5 py-2 text-sm transition-all duration-300 hover:shadow-lg hover:shadow-[#24366E]/25 hover:scale-105"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            Voir les équipes
          </Link>
        </div>

        {/* Mobile & Tablet */}
        <button 
          onClick={() => setOpen(!open)} 
          className="md:hidden p-1.5 sm:p-2.5 -mr-2 sm:mr-0 text-[#6C757D] hover:text-[#212529] transition-colors rounded-lg hover:bg-[#F8F9FA]"
        >
          {open ? <X size={20} className="sm:w-6 sm:h-6" /> : <Menu size={20} className="sm:w-6 sm:h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden glassmorphism border-t border-[#E9ECEF]/50"
          >
            <div className="container py-2 sm:py-4 px-2 sm:px-4 flex flex-col gap-1">
              {/* Liens principaux */}
              <div className="grid grid-cols-2 gap-1.5 sm:gap-2 mb-2 sm:mb-4">
                {navLinks.slice(0, 6).map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setOpen(false)}
                    className={`px-2 sm:px-3 py-2 sm:py-3 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 text-center ${
                      location.pathname === link.path
                        ? "bg-gradient-to-r from-[#24366E] to-[#24366E] text-white shadow-lg shadow-[#24366E]/25"
                        : "text-[#6C757D] hover:text-[#212529] hover:bg-[#F8F9FA]"
                    }`}
                    style={{ fontFamily: 'DM Sans, sans-serif' }}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              
              {/* Liens restants */}
              <div className="grid grid-cols-2 gap-1.5 sm:gap-2 mb-2 sm:mb-4">
                {navLinks.slice(6, 8).map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setOpen(false)}
                    className={`px-2 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 text-center ${
                      location.pathname === link.path
                        ? "bg-gradient-to-r from-[#24366E] to-[#24366E] text-white shadow-lg shadow-[#24366E]/25"
                        : "text-[#6C757D] hover:text-[#212529] hover:bg-[#F8F9FA]"
                    }`}
                    style={{ fontFamily: 'DM Sans, sans-serif' }}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              
              <Link
                to="/equipes-selectionnees"
                onClick={() => setOpen(false)}
                className="btn-premium inline-flex items-center justify-center gap-2 rounded-lg px-4 sm:px-6 py-2.5 sm:py-4 text-xs sm:text-sm font-semibold"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                Voir les équipes sélectionnées
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
