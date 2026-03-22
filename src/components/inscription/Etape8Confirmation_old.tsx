import { motion } from "framer-motion";
import { CheckCircle, Calendar, Instagram, Linkedin, Trophy, Sparkles, ArrowRight } from "lucide-react";
import { InscriptionData } from "@/types/inscription";
import { Link } from "react-router-dom";

interface Props {
  data: InscriptionData;
}

const Etape8Confirmation = ({ data }: Props) => (
  <div className="text-center space-y-8 py-8">
    {/* Success Icon */}
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 15, duration: 0.6 }}
    >
      <div className="relative mx-auto w-24 h-24">
        <div className="absolute inset-0 bg-gradient-to-r from-[#FEEB09] to-[#24366E] rounded-full animate-pulse opacity-20"></div>
        <div className="relative w-full h-full bg-gradient-to-r from-[#FEEB09] to-[#24366E] rounded-full flex items-center justify-center shadow-lg shadow-[#FEEB09]/25">
          <CheckCircle size={48} className="text-white" strokeWidth={2} />
        </div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          className="absolute -top-2 -right-2 w-8 h-8 bg-[#FEEB09] rounded-full flex items-center justify-center shadow-lg"
        >
          <Sparkles size={16} className="text-white" />
        </motion.div>
      </div>
    </motion.div>

    {/* Title and Message */}
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <h2 
        className="font-display text-3xl font-bold text-[#212529] mb-4"
        style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800 }}
      >
        Candidature envoyée !
        <span className="text-gradient"> 🎉</span>
      </h2>
      <p 
        className="text-[#6C757D] text-lg leading-relaxed max-w-2xl mx-auto"
        style={{ fontFamily: 'DM Sans, sans-serif' }}
      >
        Votre candidature au 2ème Hackathon ISOC-ESMT a été soumise avec succès. 
        Nous vous remercions pour votre intérêt et votre enthousiasme.
      </p>
    </motion.div>

    {/* Summary Card */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="max-w-2xl mx-auto bg-white rounded-2xl border border-[#E9ECEF] p-8 shadow-lg"
    >
      <h3 
        className="font-display text-xl font-bold text-[#212529] mb-6"
        style={{ fontFamily: 'Sora, sans-serif' }}
      >
        Récapitulatif de votre candidature
      </h3>

      <div className="grid md:grid-cols-2 gap-6 text-left">
        {/* Left Column */}
        <div className="space-y-4">
          <div>
            <h4 
              className="font-display text-sm font-semibold text-[#FEEB09] mb-2"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              Type de candidature
            </h4>
            <p 
              className="text-[#212529]"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              {data.type_candidature === 'individuel' ? 'Candidature individuelle' : 'Candidature en équipe'}
            </p>
            {data.type_candidature === 'equipe' && data.nom_equipe && (
              <p 
                className="text-[#6C757D] text-sm mt-1"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                Équipe: {data.nom_equipe}
              </p>
            )}
          </div>

          <div>
            <h4 
              className="font-display text-sm font-semibold text-[#FEEB09] mb-2"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              Chef d'équipe
            </h4>
            <p 
              className="text-[#212529]"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              {data.chef_nom_prenom}
            </p>
            <p 
              className="text-[#6C757D] text-sm mt-1"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              {data.chef_email}
            </p>
          </div>

          {data.nom_projet && (
            <div>
              <h4 
                className="font-display text-sm font-semibold text-[#FEEB09] mb-2"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                Projet
              </h4>
              <p 
                className="text-[#212529]"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                {data.nom_projet}
              </p>
              <p 
                className="text-[#6C757D] text-sm mt-1"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                {data.domaine_projet}
              </p>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <div>
            <h4 
              className="font-display text-sm font-semibold text-[#24366E] mb-2"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              Événement
            </h4>
            <div className="flex items-center gap-2 text-[#212529]">
              <Calendar size={16} className="text-[#FEEB09]" />
              <span style={{ fontFamily: 'DM Sans, sans-serif' }}>
                17-18 Avril 2026
              </span>
            </div>
            <p 
              className="text-[#6C757D] text-sm mt-1"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              ESMT, Dakar
            </p>
          </div>

          <div>
            <h4 
              className="font-display text-sm font-semibold text-[#24366E] mb-2"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              Prochaines étapes
            </h4>
            <ul 
              className="text-[#212529] text-sm space-y-1"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              <li>• Réception de votre candidature</li>
              <li>• Évaluation par le jury</li>
              <li>• Annonce des équipes sélectionnées</li>
              <li>• Préparation pour le hackathon</li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>

    {/* Contact Info */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="bg-white rounded-2xl border border-[#E9ECEF] p-6 shadow-lg max-w-2xl mx-auto"
    >
      <h4 
        className="font-display text-lg font-semibold text-[#212529] mb-4"
        style={{ fontFamily: 'Sora, sans-serif' }}
      >
        Restez connecté
      </h4>
      <div className="flex justify-center gap-6">
        <a 
          href="https://instagram.com/isoc_esmt" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FEEB09]/10 to-[#24366E]/10 rounded-xl hover:from-[#FEEB09]/20 hover:to-[#24366E]/20 transition-all duration-300"
        >
          <Instagram size={18} className="text-[#FEEB09]" />
          <span 
            className="text-sm font-medium text-[#212529]"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            Instagram
          </span>
        </a>
        <a 
          href="https://linkedin.com/company/isoc-esmt" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FEEB09]/10 to-[#24366E]/10 rounded-xl hover:from-[#FEEB09]/20 hover:to-[#24366E]/20 transition-all duration-300"
        >
          <Linkedin size={18} className="text-[#24366E]" />
          <span 
            className="text-sm font-medium text-[#212529]"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            LinkedIn
          </span>
        </a>
      </div>
    </motion.div>

    {/* Action Buttons */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto"
    >
      <Link 
        to="/"
        className="btn-premium flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all hover:scale-105"
      >
        Retour à l'accueil
        <ArrowRight size={16} />
      </Link>
    </motion.div>
  </div>
);

export default Etape8Confirmation;
