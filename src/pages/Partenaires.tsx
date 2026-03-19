import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import { ExternalLink, Globe, Building, Star, Crown, Award } from "lucide-react";
import { motion } from "framer-motion";

const tierColors: Record<string, string> = {
  or: 'border-[#FF6B35] bg-[#FF6B35]/10',
  argent: 'border-[#FFA947] bg-[#FFA947]/10',
  bronze: 'border-[#1E3A5F] bg-[#1E3A5F]/10',
};

const tierIcons: Record<string, any> = {
  or: Crown,
  argent: Star,
  bronze: Award,
};

const tierLabels: Record<string, string> = { or: '🥇 Or', argent: '🥈 Argent', bronze: '🥉 Bronze' };

const Partenaires = () => {
  const { data: partenaires, isLoading, error } = useQuery({
    queryKey: ["partenaires"],
    queryFn: async () => {
      console.log("🔍 Récupération des partenaires...");
      
      const { data, error } = await supabase.from("partenaires").select("*").order("created_at");
      
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

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] to-white">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B35]/5 via-[#1E3A5F]/5 to-transparent"></div>
          <div className="container relative z-10 py-16">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#FF6B35] to-[#1E3A5F] flex items-center justify-center">
                  <Building size={32} className="text-white" />
                </div>
                <h1 
                  className="font-display text-4xl sm:text-5xl font-bold text-[#212529]"
                  style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800 }}
                >
                  Partenaires
                </h1>
              </div>
              <p 
                className="text-xl text-[#6C757D] mb-8"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                Les entreprises qui soutiennent l'innovation
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-[#FF6B35] to-[#1E3A5F] mx-auto rounded-full"></div>
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="container py-8">
          {/* Loading State */}
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full border-4 border-[#FF6B35] border-t-transparent animate-spin"></div>
                <p 
                  className="text-[#6C757D]"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  Chargement des partenaires...
                </p>
              </div>
            </div>
          ) : !partenaires || partenaires.length === 0 ? (
            <motion.div 
              className="text-center py-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="w-24 h-24 rounded-full bg-[#F8F9FA] border border-[#E9ECEF] flex items-center justify-center mx-auto mb-6">
                <Building size={40} className="text-[#6C757D]" />
              </div>
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
            <motion.div 
              className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {partenaires.map((partenaire, index) => (
                <motion.div
                  key={partenaire.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="group"
                >
                  <div className="relative overflow-hidden rounded-2xl border border-[#E9ECEF] bg-white transition-all duration-300 hover:border-[#FF6B35]/50 hover:shadow-xl hover:shadow-[#FF6B35]/10">
                    {/* Header */}
                    <div className="p-6 pb-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#FF6B35]/10 to-[#1E3A5F]/10 flex items-center justify-center">
                            {(() => {
                              const Icon = tierIcons[partenaire.niveau];
                              return <Icon size={20} className="text-[#FF6B35]" />;
                            })()}
                          </div>
                          <div>
                            <h3 
                              className="font-display text-lg font-bold text-[#212529] group-hover:text-[#FF6B35] transition-colors"
                              style={{ fontFamily: 'Sora, sans-serif' }}
                            >
                              {partenaire.nom}
                            </h3>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-[#6C757D]">
                                Niveau
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-bold ${tierColors[partenaire.niveau]} text-white`}>
                                {tierLabels[partenaire.niveau]}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {partenaire.site_url && (
                          <div className="flex items-center gap-2 mb-4">
                            <Globe size={14} className="text-[#6C757D]" />
                            <a 
                              href={partenaire.site_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-[#1E3A5F] hover:text-[#FF6B35] transition-colors"
                              style={{ fontFamily: 'DM Sans, sans-serif' }}
                            >
                              Visiter le site
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Content - Simplifié */}
                    <div className="px-6 pb-6">
                      <div className="text-center">
                        <p 
                          className="text-sm text-[#6C757D]"
                          style={{ fontFamily: 'DM Sans, sans-serif' }}
                        >
                          Partenaire de niveau {tierLabels[partenaire.niveau]}
                        </p>
                      </div>
                    </div>
                    
                    {/* Footer */}
                    <div className="px-6 py-4 border-t border-[#E9ECEF] bg-[#F8F9FA]">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ExternalLink size={14} className="text-[#6C757D]" />
                          {partenaire.site_url ? (
                            <a 
                              href={partenaire.site_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-[#1E3A5F] hover:text-[#FF6B35] transition-colors"
                              style={{ fontFamily: 'DM Sans, sans-serif' }}
                            >
                              Site web
                            </a>
                          ) : (
                            <span 
                              className="text-sm text-[#6C757D]"
                              style={{ fontFamily: 'DM Sans, sans-serif' }}
                            >
                              Contact direct
                            </span>
                          )}
                        </div>
                        
                        {partenaire.niveau === 'or' && (
                          <div className="px-3 py-1 rounded-full bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] text-white text-xs font-bold">
                            PARTENAIRE PRINCIPAL
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Hover Effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Partenaires;
