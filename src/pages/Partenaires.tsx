import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import { ExternalLink, Globe, Building, Star, Crown, Award } from "lucide-react";
import { motion } from "framer-motion";

// Fonction pour valider et normaliser les URLs
const normalizeUrl = (url: string) => {
  if (!url) return '';
  
  // Supprimer les espaces et les caractères indésirables
  let cleanUrl = url.trim();
  
  // Si l'URL ne commence pas par http:// ou https://, ajouter https://
  if (!cleanUrl.match(/^https?:\/\//)) {
    cleanUrl = `https://${cleanUrl}`;
  }
  
  // Supprimer localhost ou domaines invalides
  if (cleanUrl.includes('localhost') || cleanUrl.includes('127.0.0.1')) {
    return '';
  }
  
  return cleanUrl;
};

const tierGradients: Record<string, string> = {
  or: 'from-[#FFD700] to-[#FFA500]',
  argent: 'from-[#C0C0C0] to-[#808080]',
  bronze: 'from-[#CD7F32] to-[#8B4513]',
};

const tierColors: Record<string, string> = {
  or: 'border-[#FFD700] bg-[#FFD700]/5',
  argent: 'border-[#C0C0C0] bg-[#C0C0C0]/5',
  bronze: 'border-[#CD7F32] bg-[#CD7F32]/5',
};

const tierIcons: Record<string, any> = {
  or: Crown,
  argent: Star,
  bronze: Award,
};

const tierLabels: Record<string, string> = { or: 'Partenaire Or', argent: 'Partenaire Argent', bronze: 'Partenaire Bronze' };

const Partenaires = () => {
  const { data: partenaires, isLoading, error } = useQuery({
    queryKey: ["partenaires"],
    queryFn: async () => {
      console.log("🔍 Récupération des partenaires...");
      
      const { data, error } = await supabase.from("partenaires").select("*").order("niveau", { ascending: false });
      
      console.log("📊 Résultat query partenaires:", { data, error });
      console.log("🔍 Champs partenaires:", data?.[0] ? Object.keys(data[0]) : "Aucun partenaire");
      
      if (error) {
        console.error("❌ Erreur query partenaires:", error);
        throw error;
      }
      
      console.log(`✅ ${data?.length || 0} partenaires trouvés`);
      return data;
    },
  });

  // Grouper les partenaires par niveau
  const groupedPartenaires = partenaires?.reduce((acc, partenaire) => {
    if (!acc[partenaire.niveau]) {
      acc[partenaire.niveau] = [];
    }
    acc[partenaire.niveau].push(partenaire);
    return acc;
  }, {} as Record<string, any[]>) || {};

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] to-white">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B35]/5 via-[#1E3A5F]/5 to-transparent"></div>
          <div className="container relative z-10 py-16">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 
                className="font-display text-4xl md:text-5xl font-bold text-[#212529] mb-4"
                style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800 }}
              >
                Nos Partenaires
              </h1>
              <p 
                className="text-lg text-[#6C757D] max-w-2xl mx-auto"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                Merci à nos partenaires qui soutiennent le Hackathon ISOC-ESMT 2026
              </p>
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="container py-12">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF6B35]"></div>
              <p className="text-[#6C757D] mt-4">Chargement des partenaires...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <Building size={40} className="text-[#6C757D] mx-auto mb-4" />
              <h3 
                className="font-display text-xl font-bold text-[#212529] mb-2"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                Erreur de chargement
              </h3>
              <p 
                className="text-[#6C757D]"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                Impossible de charger les partenaires pour le moment.
              </p>
            </div>
          ) : !partenaires || partenaires.length === 0 ? (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Building size={40} className="text-[#6C757D] mx-auto mb-4" />
              <h3 
                className="font-display text-xl font-bold text-[#212529] mb-2"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                Partenaires bientôt disponibles
              </h3>
              <p 
                className="text-[#6C757D] max-w-md mx-auto"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                Les entreprises partenaires seront publiées prochainement.
              </p>
            </motion.div>
          ) : (
            <div className="space-y-16">
              {(['or', 'argent', 'bronze'] as const).map((tier, tierIndex) => {
                const tierPartenaires = groupedPartenaires[tier] || [];
                if (tierPartenaires.length === 0) return null;

                return (
                  <motion.div
                    key={tier}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: tierIndex * 0.2 }}
                  >
                    {/* Section Header */}
                    <div className="text-center mb-8">
                      <div className="inline-flex items-center gap-3 mb-4">
                        <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${tierGradients[tier]} flex items-center justify-center shadow-lg`}>
                          {(() => {
                            const Icon = tierIcons[tier];
                            return <Icon size={28} className="text-white" />;
                          })()}
                        </div>
                        <h2 
                          className="font-display text-3xl font-bold text-[#212529]"
                          style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700 }}
                        >
                          {tierLabels[tier]}
                        </h2>
                      </div>
                      <div className={`h-1 w-24 mx-auto bg-gradient-to-r ${tierGradients[tier]} rounded-full`}></div>
                    </div>

                    {/* Partners Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                      {tierPartenaires.map((partenaire, index) => (
                        <motion.div
                          key={partenaire.id}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.6, delay: index * 0.1 }}
                          className="group"
                        >
                          <div className={`relative overflow-hidden rounded-2xl border-2 ${tierColors[tier]} bg-white transition-all duration-500 hover:shadow-2xl hover:scale-105`}>
                            {/* Logo Container */}
                            <div className="aspect-square p-8 flex items-center justify-center bg-gradient-to-br from-white to-gray-50">
                              {partenaire.logo_url ? (
                                <img 
                                  src={partenaire.logo_url} 
                                  alt={partenaire.nom}
                                  className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-110"
                                />
                              ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center">
                                  <Building size={48} className="text-[#6C757D] mb-2" />
                                  <span className="text-xs text-[#6C757D] text-center font-medium">
                                    {partenaire.nom}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Partner Info */}
                            <div className="p-4 bg-white border-t border-gray-100">
                              <h3 
                                className="font-display text-sm font-bold text-[#212529] text-center mb-2 truncate"
                                style={{ fontFamily: 'Sora, sans-serif' }}
                              >
                                {partenaire.nom}
                              </h3>
                              
                              {(() => {
                                const normalizedUrl = normalizeUrl(partenaire.site_url || '');
                                return normalizedUrl ? (
                                  <div className="text-center">
                                    <a 
                                      href={normalizedUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className={`inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-gradient-to-r ${tierGradients[tier]} text-white hover:opacity-90 transition-opacity`}
                                      style={{ fontFamily: 'DM Sans, sans-serif' }}
                                    >
                                      <Globe size={10} />
                                      Visiter
                                    </a>
                                  </div>
                                ) : null;
                              })()}
                            </div>

                            {/* Hover Effect Overlay */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${tierGradients[tier]} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`}></div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Partenaires;
