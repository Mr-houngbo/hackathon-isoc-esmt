import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Code2, Trophy, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Accueil", path: "/" },
  { label: "Inscription", path: "/inscription" },
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
    <nav className={`fixed top-0 z-50 w-full transition-all duration-300 ${
      scrolled 
        ? "glassmorphism border-b border-[#E9ECEF]/50 shadow-lg" 
        : "bg-transparent"
    }`}>
      <div className="container flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="flex flex-col">
            <span 
              className="font-display text-2xl font-bold text-[#212529] transition-colors group-hover:text-[#FF6B35]"
              style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800 }}
            >
              ISOC-ESMT
            </span>
            <span 
              className="text-[#FF6B35] text-sm font-semibold tracking-wide"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              Hackathon 17-18 Avril 2026
            </span>
          </div>
        </Link>

        {/* Desktop */}
        <div className="hidden xl:flex items-center gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                location.pathname === link.path
                  ? "bg-gradient-to-r from-[#1E3A5F] to-[#1E3A5F] text-white shadow-lg shadow-[#1E3A5F]/25 border border-[#1E3A5F]/20"
                  : "text-[#6C757D] hover:text-[#212529] hover:bg-[#F8F9FA]"
              }`}
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/inscription"
            className="btn-premium ml-4 inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            S'inscrire
          </Link>
        </div>

        {/* Mobile & Tablet */}
        <div className="hidden lg:flex xl:hidden items-center gap-2">
          <Link
            to="/inscription"
            className="btn-premium inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            S'inscrire
          </Link>
          <button 
            onClick={() => setOpen(!open)} 
            className="p-2.5 text-[#6C757D] hover:text-[#212529] transition-colors rounded-lg hover:bg-[#F8F9FA]"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile */}
        <button 
          onClick={() => setOpen(!open)} 
          className="lg:hidden p-2.5 text-[#6C757D] hover:text-[#212529] transition-colors rounded-lg hover:bg-[#F8F9FA]"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
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
            className="lg:hidden glassmorphism border-t border-[#E9ECEF]/50"
          >
            <div className="container py-6 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                    location.pathname === link.path
                      ? "bg-gradient-to-r from-[#1E3A5F] to-[#1E3A5F] text-white shadow-lg shadow-[#1E3A5F]/25 border border-[#1E3A5F]/20"
                      : "text-[#6C757D] hover:text-[#212529] hover:bg-[#F8F9FA]"
                  }`}
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/inscription"
                onClick={() => setOpen(false)}
                className="mt-4 btn-premium inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                S'inscrire maintenant
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
