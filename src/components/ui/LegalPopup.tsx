import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, Shield, Cookie, FileText } from "lucide-react";

interface LegalPopupProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'privacy' | 'terms' | 'cookies';
  onViewFull: () => void;
}

const LegalPopup = ({ isOpen, onClose, type, onViewFull }: LegalPopupProps) => {
  const getContent = () => {
    switch (type) {
      case 'privacy':
        return {
          icon: <Shield className="w-6 h-6" />,
          title: "Politique de Confidentialité",
          preview: "Nous collectons uniquement les informations nécessaires à l'organisation du hackathon. Vos données sont protégées conformément à la loi n°2008-12 et ne sont jamais partagées avec des tiers sans consentement.",
          fullContent: "Les informations personnelles collectées lors de l'inscription (nom, email, téléphone, etc.) sont exclusivement utilisées pour l'organisation du hackathon ISOC-ESMT. Finalité : gestion des candidatures, communication avec les participants, organisation logistique. Conservation : 6 mois maximum après l'événement. Droits : accès, modification, suppression sur demande."
        };
      case 'terms':
        return {
          icon: <FileText className="w-6 h-6" />,
          title: "Termes et Conditions",
          preview: "En participant au 2ème Hackathon ISOC-ESMT, vous acceptez nos règles d'éthique, de fair-play et nos conditions de participation. Équipes de 4 membres, présence obligatoire, projets originaux.",
          fullContent: "Les présents termes régissent la participation au Hackathon ISOC-ESMT. Conditions : équipes de 4 membres prioritaires, présence obligatoire les 17-18 Avril 2026, projets créés pendant le hackathon, utilisation d'IA déclarée, respect mutuel obligatoire. Droits d'auteur : propriété exclusive des auteurs. Droit à l'image : autorisation pour communication du club."
        };
      case 'cookies':
        return {
          icon: <Cookie className="w-6 h-6" />,
          title: "Politique des Cookies",
          preview: "Nous utilisons des cookies techniques essentiels pour le fonctionnement du site et des cookies d'analyse pour améliorer votre expérience. Aucun cookie publicitaire n'est utilisé.",
          fullContent: "Notre site utilise des cookies techniques essentiels (authentification, panier, préférences) et des cookies d'analyse (Google Analytics anonymisé) pour améliorer nos services. Durée de conservation : 13 mois maximum. Vous pouvez les désactiver dans les paramètres de votre navigateur. Pas de cookies publicitaires ou de tracking tiers."
        };
      default:
        return null;
    }
  };

  const content = getContent();

  if (!content) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Popup Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-5 text-white">
              <div className="flex items-center gap-3 pr-10">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  {content.icon}
                </div>
                <div>
                  <h2 className="text-lg font-bold" style={{ fontFamily: 'Sora, sans-serif' }}>
                    {content.title}
                  </h2>
                  <p className="text-amber-100 text-xs">
                    Informations importantes
                  </p>
                </div>
              </div>
              
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-3 right-3 w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content - Scrollable */}
            <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
              {/* Preview */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
                <p className="text-slate-700 text-sm leading-relaxed" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                  {content.preview}
                </p>
              </div>

              {/* Full Content */}
              <div>
                <h3 className="font-semibold text-slate-900 flex items-center gap-2 mb-2 text-sm">
                  <Eye className="w-4 h-4 text-amber-500" />
                  Détails complets
                </h3>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <p className="text-slate-600 text-sm leading-relaxed" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                    {content.fullContent}
                  </p>
                </div>
              </div>

              {/* Additional Info */}
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-blue-800 text-xs" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                  <strong>📅 Dernière mise à jour :</strong> Mars 2026<br/>
                  <strong>📧 Contact :</strong> club_esmt@isoc.sn
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="border-t border-slate-200 p-4 bg-slate-50 flex flex-col sm:flex-row gap-2">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 bg-slate-200 text-slate-700 rounded-lg font-semibold transition-all hover:bg-slate-300 text-sm"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                Fermer
              </button>
              <button
                onClick={onViewFull}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg font-semibold transition-all hover:shadow-md flex items-center justify-center gap-2 text-sm"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                <Eye className="w-4 h-4" />
                Voir la page complète
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LegalPopup;
