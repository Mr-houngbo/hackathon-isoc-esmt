import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
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
        ? "glassmorphism border-b border-[#2D3748]/50" 
        : "bg-transparent"
    }`}>
      <div className="container flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="flex flex-col">
            <span 
              className="font-display text-2xl font-bold text-[#F9FAFB] transition-colors group-hover:text-[#00873E]"
              style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800 }}
            >
              ISOC-ESMT
            </span>
            <span 
              className="text-[#FBBF24] text-sm font-semibold tracking-wide"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              Hackathon 2026
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
                  ? "bg-[#00873E]/20 text-[#00873E] border border-[#00873E]/30"
                  : "text-[#9CA3AF] hover:text-[#F9FAFB] hover:bg-[#111827]/50"
              }`}
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/inscription"
            className="btn-premium ml-4 inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-[#F9FAFB]"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            S'inscrire
          </Link>
        </div>

        {/* Mobile & Tablet */}
        <div className="hidden lg:flex xl:hidden items-center gap-2">
          <Link
            to="/inscription"
            className="btn-premium inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-[#F9FAFB]"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            S'inscrire
          </Link>
          <button 
            onClick={() => setOpen(!open)} 
            className="p-2.5 text-[#9CA3AF] hover:text-[#F9FAFB] transition-colors rounded-lg hover:bg-[#111827]/50"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile */}
        <button 
          onClick={() => setOpen(!open)} 
          className="lg:hidden p-2.5 text-[#9CA3AF] hover:text-[#F9FAFB] transition-colors rounded-lg hover:bg-[#111827]/50"
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
            className="lg:hidden glassmorphism border-t border-[#2D3748]/50"
          >
            <div className="container py-6 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                    location.pathname === link.path
                      ? "bg-[#00873E]/20 text-[#00873E] border border-[#00873E]/30"
                      : "text-[#9CA3AF] hover:text-[#F9FAFB] hover:bg-[#111827]/50"
                  }`}
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/inscription"
                onClick={() => setOpen(false)}
                className="mt-4 btn-premium inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-[#F9FAFB]"
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
