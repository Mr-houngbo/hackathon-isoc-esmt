import { motion } from "framer-motion";
import { InscriptionData } from "@/types/inscription";
import { CheckCircle, Mail, Linkedin, MessageCircle, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

interface Props {
  data: InscriptionData;
}

const Etape8Confirmation = ({ data }: Props) => {
  const LIENS = [
    { icon: Mail, label: 'isoc.esmt@gmail.com', href: 'mailto:isoc.esmt@gmail.com' },
    { icon: Mail, label: 'club_esmt@isoc.sn', href: 'mailto:club_esmt@isoc.sn' },
    { icon: Linkedin, label: 'Club ISOC ESMT', href: 'https://www.linkedin.com/company/club-isoc-esmt/' },
    { icon: MessageCircle, label: 'Rejoindre le groupe WhatsApp', href: 'https://chat.whatsapp.com/F0wmbEY7FHG0D3YazrvwbI?mode=gi_t' },
  ];

  return (
    <div className="text-center space-y-8 py-8">
      {/* Success Icon */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, duration: 0.6 }}
      >
        <div className="relative mx-auto w-24 h-24">
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B35] to-[#1E3A5F] rounded-full animate-pulse opacity-20"></div>
          <div className="relative w-full h-full bg-gradient-to-r from-[#FF6B35] to-[#1E3A5F] rounded-full flex items-center justify-center shadow-lg shadow-[#FF6B35]/25">
            <CheckCircle size={48} className="text-white" strokeWidth={2} />
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="absolute -top-2 -right-2 w-8 h-8 bg-[#FF6B35] rounded-full flex items-center justify-center shadow-lg"
          >
            <CheckCircle size={16} className="text-white" />
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
          Candidature soumise avec succès !
        </h2>
        <p 
          className="text-[#6C757D] text-lg leading-relaxed max-w-2xl mx-auto"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          Merci <strong>{data.chef.nom_prenom}</strong> !{' '}
          {data.type_candidature === 'equipe'
            ? `Votre candidature pour l'équipe "${data.nom_equipe}" a bien été enregistrée.` 
            : 'Votre candidature individuelle a bien été enregistrée.'
          }
        </p>
      </motion.div>

      {/* Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="max-w-2xl mx-auto bg-white rounded-2xl border border-[#E9ECEF] p-6 shadow-lg"
      >
        <div className="flex items-center justify-center gap-2 mb-3">
          <Mail size={20} className="text-[#FF6B35]" />
          <h3 
            className="font-display text-lg font-semibold text-[#212529]"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            Prochaines étapes
          </h3>
        </div>
        <p 
          className="text-[#6C757D] text-sm"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          📬 Le comité de sélection examinera votre dossier et vous contactera par email sous 72h.
        </p>
      </motion.div>

      {/* Date Key */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="max-w-2xl mx-auto bg-gradient-to-r from-[#FF6B35]/10 to-[#1E3A5F]/10 rounded-2xl border border-[#E9ECEF] p-4"
      >
        <div className="flex items-center justify-center gap-2">
          <Calendar size={20} className="text-[#FF6B35]" />
          <p 
            className="text-[#212529] font-medium"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            🚀 Hackathon : 17 & 18 Avril 2026
          </p>
        </div>
      </motion.div>

      {/* Contact Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="max-w-2xl mx-auto bg-white rounded-2xl border border-[#E9ECEF] p-6 shadow-lg"
      >
        <h3 
          className="font-display text-lg font-semibold text-[#212529] mb-4"
          style={{ fontFamily: 'Sora, sans-serif' }}
        >
          Liens officiels
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {LIENS.map((lien, index) => (
            <a
              key={index}
              href={lien.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-[#FF6B35]/10 to-[#1E3A5F]/10 rounded-xl hover:from-[#FF6B35]/20 hover:to-[#1E3A5F]/20 transition-all duration-300"
            >
              <lien.icon 
                size={18} 
                className={lien.label.includes('WhatsApp') ? 'text-[#25D366]' : lien.label.includes('LinkedIn') ? 'text-[#0077B5]' : 'text-[#FF6B35]'} 
              />
              <span 
                className="text-sm font-medium text-[#212529]"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                {lien.label}
              </span>
            </a>
          ))}
        </div>
      </motion.div>

      {/* Action Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="flex justify-center max-w-2xl mx-auto"
      >
        <Link 
          to="/"
          className="btn-premium flex items-center justify-center gap-2 rounded-xl px-8 py-3 text-sm font-semibold transition-all hover:scale-105"
        >
          Retour à l'accueil
        </Link>
      </motion.div>
    </div>
  );
};

export default Etape8Confirmation;
