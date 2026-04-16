import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import {
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  MapPin,
  Users,
  AlertCircle,
  RefreshCw,
  ArrowLeft,
  Download,
} from "lucide-react";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import QRCode from "qrcode";

const VerificationBadge = () => {
  const { badgeId } = useParams<{ badgeId: string }>();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isDownloading, setIsDownloading] = useState(false);
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const {
    data: badge,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["badge-verification", badgeId],
    queryFn: async () => {
      if (!badgeId) throw new Error("ID de badge requis");

      const { data, error } = await supabase
        .from("badges")
        .select(
          `
          *,
          membre:membres(
            nom_prenom,
            email,
            genre,
            filiere,
            est_chef,
            role_equipe
          ),
          equipe:equipes(
            nom_equipe,
            type_candidature,
            statut
          )
        `,
        )
        .eq("id", badgeId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!badgeId,
  });

  const estValide =
    badge && (badge.type === "staff" || badge.equipe?.statut === "selectionne");

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Fonction pour télécharger le badge PDF
  const downloadBadgePDF = async () => {
    if (!badge || !badgeRef.current) return;
    
    setIsDownloading(true);
    try {
      const element = badgeRef.current;
      
      // Attendre le rendu
      await new Promise(resolve => setTimeout(resolve, 500));
      element.getBoundingClientRect();
      
      const canvas = await html2canvas(element, {
        backgroundColor: '#0B1F3A',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        width: 400,
        height: 250,
        x: 0,
        y: 0,
        scrollX: 0,
        scrollY: -window.scrollY,
        windowWidth: 400,
        windowHeight: 250,
      });

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [105, 66]
      });
      
      const imgData = canvas.toDataURL('image/png', 1.0);
      pdf.addImage(imgData, 'PNG', 0, 0, 105, 66);
      
      const nomFichier = badge.membre?.nom_prenom || (badge as any).staff_info?.nom_prenom || 'badge';
      pdf.save(`badge-${nomFichier.replace(/\s+/g, '-')}.pdf`);
    } catch (error) {
      console.error("Erreur téléchargement PDF:", error);
      alert("Erreur lors du téléchargement du PDF");
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] to-white flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="w-12 h-12 animate-spin text-[#40B2A4] mx-auto mb-4" />
            <p className="text-gray-600">Vérification du badge en cours...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !badge) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full"
          >
            <div className="bg-white rounded-3xl border border-red-200 shadow-2xl overflow-hidden">
              {/* Header rouge */}
              <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <XCircle className="w-12 h-12 text-white" />
                </motion.div>
                <h1 className="text-2xl font-bold mb-2">Badge Non Reconnu</h1>
                <p className="text-red-100">
                  Ce badge n'est pas valide ou n'existe pas
                </p>
              </div>

              {/* Contenu */}
              <div className="p-8 text-center">
                <div className="bg-red-50 rounded-2xl p-6 mb-6">
                  <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <p className="text-gray-700 mb-4">
                    Le badge que vous essayez de vérifier n'est pas valide dans
                    notre système.
                  </p>
                  <div className="text-sm text-gray-600 space-y-2">
                    <p>
                      <strong>ID du badge :</strong> {badgeId}
                    </p>
                    <p>
                      <strong>Raison possible :</strong> Badge inexistant,
                      annulé ou expiré
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={() => window.location.reload()}
                    className="w-full px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4 inline mr-2" />
                    Réessayer la vérification
                  </button>

                  <button
                    onClick={() => navigate("/")}
                    className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4 inline mr-2" />
                    Retour à l'accueil
                  </button>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    Contactez l'organisation si vous pensez qu'il s'agit d'une
                    erreur :
                  </p>
                  <a
                    href="mailto:isoc.esmt@gmail.com"
                    className="text-[#40B2A4] hover:text-[#40B2A4]/80 transition-colors"
                  >
                    isoc.esmt@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Layout>
    );
  }

  if (!estValide) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full"
          >
            <div className="bg-white rounded-3xl border border-orange-200 shadow-2xl overflow-hidden">
              {/* Header orange */}
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <AlertCircle className="w-12 h-12 text-white" />
                </motion.div>
                <h1 className="text-2xl font-bold mb-2">Badge Invalide</h1>
                <p className="text-orange-100">
                  Ce badge n'est pas valide pour cet événement
                </p>
              </div>

              {/* Contenu */}
              <div className="p-8 text-center">
                <div className="bg-orange-50 rounded-2xl p-6 mb-6">
                  <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                  <p className="text-gray-700 mb-4">
                    Ce badge existe mais n'est pas valide pour le 2ème Hackathon
                    ISOC-ESMT 2026.
                  </p>
                  <div className="text-sm text-gray-600 space-y-2">
                    <p>
                      <strong>Statut de l'équipe :</strong>{" "}
                      {badge.equipe?.statut || "Non applicable"}
                    </p>
                    <p>
                      <strong>Type de badge :</strong>{" "}
                      {badge.type === "staff" ? "Staff" : "Participant"}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={() => navigate("/")}
                    className="w-full px-4 py-3 bg-[#40B2A4] text-white rounded-xl hover:bg-[#40B2A4]/90 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4 inline mr-2" />
                    Retour à l'accueil
                  </button>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    Pour plus d'informations, contactez l'organisation :
                  </p>
                  <a
                    href="mailto:isoc.esmt@gmail.com"
                    className="text-[#40B2A4] hover:text-[#40B2A4]/80 transition-colors"
                  >
                    isoc.esmt@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Layout>
    );
  }

  // Badge valide
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full"
        >
          <div className="bg-white rounded-3xl border border-green-200 shadow-2xl overflow-hidden">
            {/* Header vert */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-8 text-white text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle className="w-16 h-16 text-white" />
              </motion.div>
              <h1 className="text-3xl font-bold mb-2">Badge Authentique</h1>
              <p className="text-green-100 text-lg">
                Ce badge est valide pour le 2ème Hackathon ISOC-ESMT 2026
              </p>
            </div>

            {/* Contenu principal */}
            <div className="p-8">
              {/* Carte d'informations */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-green-600" />
                  Informations du Participant
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-1">Nom complet</p>
                    <p className="font-semibold text-gray-900">
                      {badge.membre?.nom_prenom || badge.staff_info?.nom_prenom}
                    </p>
                  </div>

                  <div className="bg-white rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-1">Rôle</p>
                    <p className="font-semibold text-gray-900">
                      {badge.staff_info?.role ||
                        (badge.membre?.est_chef
                          ? "Chef de projet"
                          : badge.membre?.role_equipe)}
                    </p>
                  </div>

                  <div className="bg-white rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-1">Équipe</p>
                    <p className="font-semibold text-gray-900">
                      {badge.equipe?.nom_equipe || "—"}
                    </p>
                  </div>

                  <div className="bg-white rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-1">Type de badge</p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        badge.type === "staff"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {badge.type === "staff" ? "Staff" : "Participant"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Informations événement */}
              <div className="bg-gradient-to-br from-[#40B2A4]/5 to-[#40B2A4]/5 rounded-2xl p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-[#40B2A4]" />
                  Événement
                </h2>

                <div className="space-y-2">
                  <div className="flex items-center text-gray-700">
                    <strong className="mr-2">Nom :</strong>
                    2ème Hackathon ISOC-ESMT 2026
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Calendar className="w-4 h-4 mr-2 text-[#40B2A4]" />
                    <strong className="mr-2">Date :</strong>
                    17 & 18 Avril 2026
                  </div>
                  <div className="flex items-center text-gray-700">
                    <MapPin className="w-4 h-4 mr-2 text-[#40B2A4]" />
                    <strong className="mr-2">Lieu :</strong>
                    ESMT Dakar, Sénégal
                  </div>
                </div>
              </div>

              {/* Informations de vérification */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-blue-600" />
                  Détails de Vérification
                </h2>

                <div className="space-y-3">
                  <div className="flex items-center text-gray-700">
                    <strong className="mr-2">ID du badge :</strong>
                    <code className="bg-gray-200 px-2 py-1 rounded text-sm">
                      {badge.id}
                    </code>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <strong className="mr-2">Vérifié le :</strong>
                    {formatDate(currentTime)} à {formatTime(currentTime)}
                  </div>
                  <div className="flex items-center text-gray-700">
                    <strong className="mr-2">Statut :</strong>
                    <span className="text-green-600 font-semibold">
                      ✓ Valide
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate("/")}
                  className="flex-1 px-6 py-3 bg-[#40B2A4] text-white rounded-xl hover:bg-[#40B2A4]/90 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 inline mr-2" />
                  Retour à l'accueil
                </button>

                <button
                  onClick={downloadBadgePDF}
                  disabled={isDownloading}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className={`w-4 h-4 inline mr-2 ${isDownloading ? 'animate-bounce' : ''}`} />
                  {isDownloading ? 'Téléchargement...' : 'Télécharger mon badge PDF'}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Badge caché pour génération PDF */}
      {badge && (
        <div style={{ position: 'absolute', left: '-9999px', top: '-9999px', opacity: 0, pointerEvents: 'none' }}>
          <BadgePourPDF badge={badge} badgeRef={badgeRef} />
        </div>
      )}
    </Layout>
  );
};

// Composant Badge pour génération PDF
const BadgePourPDF = ({ badge, badgeRef }: { badge: any; badgeRef: React.RefObject<HTMLDivElement> }) => {
  const isStaff = badge.type === 'staff';
  const colors = isStaff
    ? { bg: '#1E3A8A', accent: '#3B82F6', text: '#FFFFFF' }
    : { bg: '#0B1F3A', accent: '#40B2A4', text: '#FFFFFF' };

  return (
    <div
      ref={badgeRef}
      id={`badge-${badge.id}`}
      style={{
        width: '400px',
        height: '250px',
        background: `linear-gradient(135deg, ${colors.bg} 0%, ${colors.bg}dd 100%)`,
        borderRadius: '12px',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'Arial, sans-serif',
        boxSizing: 'border-box',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header avec logo et titre */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            background: colors.accent,
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '12px',
            fontSize: '20px',
            fontWeight: 'bold',
            color: colors.text,
          }}
        >
          IS
        </div>
        <div style={{ flex: 1 }}>
          <p
            style={{
              color: colors.accent,
              fontSize: '11px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              margin: '0 0 2px 0',
            }}
          >
            HACKATHON ISOC-ESMT
          </p>
          <p
            style={{
              color: colors.text,
              fontSize: '10px',
              margin: 0,
            }}
          >
            17 & 18 Avril 2026 • ESMT Dakar
          </p>
        </div>
        <div
          style={{
            background: colors.accent,
            color: colors.bg,
            padding: '4px 10px',
            borderRadius: '12px',
            fontSize: '9px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
          }}
        >
          {isStaff ? 'STAFF' : 'PARTICIPANT'}
        </div>
      </div>

      {/* Contenu principal */}
      <div style={{ display: 'flex', flex: 1, gap: '15px' }}>
        {/* Photo/Avatar placeholder */}
        <div
          style={{
            width: '80px',
            height: '100px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '8px',
            border: '2px solid rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: '40px' }}>👤</span>
        </div>

        {/* Informations */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h2
            style={{
              color: colors.text,
              fontSize: '18px',
              fontWeight: 'bold',
              margin: '0 0 4px 0',
              lineHeight: '1.2',
            }}
          >
            {badge.membre?.nom_prenom || (badge as any).staff_info?.nom_prenom || 'Nom'}
          </h2>
          <p
            style={{
              color: colors.accent,
              fontSize: '12px',
              fontWeight: '600',
              margin: '0 0 8px 0',
              textTransform: 'uppercase',
            }}
          >
            {(badge as any).staff_info?.role ||
              (badge.membre?.est_chef ? 'Chef de projet' : badge.membre?.role_equipe) ||
              'Rôle'}
          </p>
          <p
            style={{
              color: 'rgba(255,255,255,0.8)',
              fontSize: '10px',
              margin: 0,
            }}
          >
            {badge.equipe?.nom_equipe || (badge as any).staff_info?.organisation || 'Hackathon ISOC-ESMT'}
          </p>
        </div>

        {/* QR Code */}
        <div
          style={{
            width: '90px',
            height: '90px',
            background: 'white',
            borderRadius: '8px',
            padding: '5px',
            flexShrink: 0,
          }}
        >
          <img
            src={badge.qr_code_url}
            alt="QR Code"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            crossOrigin="anonymous"
          />
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: 'auto',
          paddingTop: '10px',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <p
          style={{
            color: 'rgba(255,255,255,0.6)',
            fontSize: '8px',
            margin: 0,
          }}
        >
          ID: {badge.id.slice(0, 8)}... • 2ème Édition
        </p>
        <p
          style={{
            color: 'rgba(255,255,255,0.6)',
            fontSize: '8px',
            margin: 0,
          }}
        >
          www.hackathon-isoc-esmt.com
        </p>
      </div>
    </div>
  );
};

export default VerificationBadge;
