import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CalendarX, ArrowRight, Users, Trophy, Mail } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const InscriptionsFermees = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#F8F9FA]">
      <Navbar />
      
      <main className="pt-32 pb-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            {/* Icône */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-24 h-24 bg-gradient-to-br from-[#24366E] to-[#40B2A4] rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-[#24366E]/20"
            >
              <CalendarX size={48} className="text-white" />
            </motion.div>

            {/* Titre */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl font-bold text-[#212529] mb-6"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              Inscriptions <span className="text-[#40B2A4]">terminées</span>
            </motion.h1>

            {/* Message */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-[#6C757D] mb-8 leading-relaxed"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              Les inscriptions pour le Hackathon ISOC-ESMT 2026 sont désormais closes. 
              Merci à tous les participants pour votre enthousiasme !
            </motion.p>

            {/* Info box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-[#24366E]/5 to-[#40B2A4]/5 border border-[#24366E]/10 rounded-2xl p-8 mb-10"
            >
              <div className="flex items-center justify-center gap-2 mb-4">
                <Users size={20} className="text-[#24366E]" />
                <span className="font-semibold text-[#24366E]" style={{ fontFamily: 'Sora, sans-serif' }}>
                  Les équipes sélectionnées sont annoncées
                </span>
              </div>
              <p className="text-[#6C757D] mb-6" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                Découvrez les équipes qui participeront à cette édition du hackathon.
              </p>
              <Link
                to="/equipes-selectionnees"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#24366E] to-[#24366E] text-white font-semibold px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-[#24366E]/25 transition-all duration-300"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                Voir les équipes
                <ArrowRight size={18} />
              </Link>
            </motion.div>

            {/* CTA Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <Link
                to="/agenda"
                className="group bg-white border border-[#E9ECEF] rounded-xl p-6 hover:border-[#40B2A4]/50 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 bg-[#40B2A4]/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#40B2A4]/20 transition-colors">
                  <Trophy size={24} className="text-[#40B2A4]" />
                </div>
                <h3 className="font-semibold text-[#212529] mb-2" style={{ fontFamily: 'Sora, sans-serif' }}>
                  Agenda du hackathon
                </h3>
                <p className="text-sm text-[#6C757D]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                  Consultez le programme complet de l'événement
                </p>
              </Link>

              <a
                href="mailto:club_esmt@isoc.sn"
                className="group bg-white border border-[#E9ECEF] rounded-xl p-6 hover:border-[#24366E]/50 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 bg-[#24366E]/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#24366E]/20 transition-colors">
                  <Mail size={24} className="text-[#24366E]" />
                </div>
                <h3 className="font-semibold text-[#212529] mb-2" style={{ fontFamily: 'Sora, sans-serif' }}>
                  Une question ?
                </h3>
                <p className="text-sm text-[#6C757D]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                  Contactez-nous par email
                </p>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default InscriptionsFermees;
