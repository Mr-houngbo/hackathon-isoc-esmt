import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import { ExternalLink, Globe, Building, Star, Crown, Award } from "lucide-react";
import { motion } from "framer-motion";

const tierColors: Record<string, string> = {
  or: 'border-[#FBBF24] bg-[#FBBF24]/10',
  argent: 'border-[#9CA3AF] bg-[#9CA3AF]/10',
  bronze: 'border-[#D97706] bg-[#D97706]/10',
};

const tierIcons: Record<string, any> = {
  or: Crown,
  argent: Star,
  bronze: Award,
};

const tierLabels: Record<string, string> = { or: '🥇 Or', argent: '🥈 Argent', bronze: '🥉 Bronze' };

const Partenaires = () => {
  const { data: partenaires, isLoading } = useQuery({
    queryKey: ["partenaires"],
    queryFn: async () => {
      const { data, error } = await supabase.from("partenaires").select("*").order("created_at");
      if (error) throw error;
      return data;
    },
  });

  return (
    <Layout>
      <div className="min-h-screen bg-[#0A0A0A]">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00873E]/20 via-[#FBBF24]/10 to-[#0A0A0A]"></div>
          <div className="container relative z-10 py-16">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#FBBF24] to-[#00873E] flex items-center justify-center">
                  <Building size={32} className="text-[#F9FAFB]" />
                </div>
                <h1 
                  className="font-display text-4xl sm:text-5xl font-bold text-[#F9FAFB]"
                  style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800 }}
                >
                  Partenaires
                </h1>
              </div>
              <p 
                className="text-xl text-[#9CA3AF] mb-8"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                Merci à ceux qui rendent cet événement possible
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-[#FBBF24] to-[#00873E] mx-auto rounded-full"></div>
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="container py-8">
          {/* Loading State */}
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full border-4 border-[#FBBF24] border-t-transparent animate-spin"></div>
                <p 
                  className="text-[#9CA3AF]"
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
              <div className="w-24 h-24 rounded-full bg-[#1F2937] flex items-center justify-center mx-auto mb-6">
                <Building size={48} className="text-[#9CA3AF]" />
              </div>
              <h3 
                className="font-display text-xl font-bold text-[#F9FAFB] mb-2"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                Partenaires bientôt disponibles
              </h3>
              <p 
                className="text-[#9CA3AF] max-w-md mx-auto"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                Nos partenaires seront publiés prochainement. Revenez découvrir nos collaborations !
              </p>
            </motion.div>
          ) : (
            <motion.div 
              className="space-y-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {['or', 'argent', 'bronze'].map((tier, tierIndex) => {
                const list = partenaires.filter((p) => p.niveau === tier);
                const Icon = tierIcons[tier];
                
                if (list.length === 0) return null;
                
                return (
                  <motion.div
                    key={tier}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 + tierIndex * 0.2 }}
                  >
                    {/* Tier Header */}
                    <div className="mb-8">
                      <div className="flex items-center gap-4 mb-6">
                        <div className={`w-12 h-12 rounded-xl ${tierColors[tier]} flex items-center justify-center`}>
                          <Icon size={24} className={tier === 'or' ? 'text-[#FBBF24]' : tier === 'argent' ? 'text-[#9CA3AF]' : 'text-[#D97706]'} />
                        </div>
                        <h2 
                          className="font-display text-3xl font-bold text-[#F9FAFB]"
                          style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700 }}
                        >
                          {tierLabels[tier]}
                        </h2>
                      </div>
                      <p 
                        className="text-lg text-[#9CA3AF] mb-8"
                        style={{ fontFamily: 'DM Sans, sans-serif' }}
                      >
                        {tier === 'or' ? 'Partenaires principaux' : tier === 'argent' ? 'Partenaires premium' : 'Partenaires officiels'}
                      </p>
                      <div className="w-16 h-1 bg-gradient-to-r from-[#FBBF24] to-[#00873E] rounded-full"></div>
                    </div>
                    
                    {/* Partners Grid */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                      {list.map((partenaire, index) => (
                        <motion.div
                          key={partenaire.id}
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.1 * index }}
                          className="group"
                        >
                          <div className={`relative overflow-hidden rounded-2xl border-2 ${tierColors[tier]} transition-all duration-300 hover:border-opacity-100 hover:shadow-xl hover:shadow-current/20`}>
                            {/* Logo */}
                            <div className="relative h-32 overflow-hidden bg-[#111827]">
                              {partenaire.logo_url ? (
                                <img 
                                  src={partenaire.logo_url} 
                                  alt={partenaire.nom} 
                                  className="w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-105" 
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <div className={`w-16 h-16 rounded-xl ${tierColors[tier]} flex items-center justify-center`}>
                                    <span 
                                      className={`font-display text-2xl font-bold ${tier === 'or' ? 'text-[#FBBF24]' : tier === 'argent' ? 'text-[#9CA3AF]' : 'text-[#D97706]'}`}
                                      style={{ fontFamily: 'Sora, sans-serif' }}
                                    >
                                      {partenaire.nom.charAt(0)}
                                    </span>
                                  </div>
                                </div>
                              )}
                              
                              {/* Tier Badge */}
                              <div className="absolute top-4 right-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm ${
                                  tier === 'or' ? 'bg-[#FBBF24]/90 text-[#0A0A0A]' : 
                                  tier === 'argent' ? 'bg-[#9CA3AF]/90 text-[#F9FAFB]' : 
                                  'bg-[#D97706]/90 text-[#F9FAFB]'
                                }`}>
                                  {tier.toUpperCase()}
                                </span>
                              </div>
                            </div>
                            
                            {/* Info */}
                            <div className="p-6">
                              <h3 
                                className={`font-display text-lg font-bold mb-3 group-hover:opacity-80 transition-opacity ${
                                  tier === 'or' ? 'text-[#FBBF24]' : tier === 'argent' ? 'text-[#9CA3AF]' : 'text-[#D97706]'
                                }`}
                                style={{ fontFamily: 'Sora, sans-serif' }}
                              >
                                {partenaire.nom}
                              </h3>
                              
                              {partenaire.description && (
                                <p 
                                  className="text-sm text-[#9CA3AF] leading-relaxed mb-4"
                                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                                >
                                  {partenaire.description}
                                </p>
                              )}
                              
                              {/* Actions */}
                              <div className="flex gap-3">
                                {partenaire.site_url && (
                                  <a 
                                    href={partenaire.site_url} 
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 group ${
                                      tier === 'or' ? 'bg-[#FBBF24]/20 text-[#FBBF24] hover:bg-[#FBBF24]/30' :
                                      tier === 'argent' ? 'bg-[#9CA3AF]/20 text-[#9CA3AF] hover:bg-[#9CA3AF]/30' :
                                      'bg-[#D97706]/20 text-[#D97706] hover:bg-[#D97706]/30'
                                    }`}
                                    style={{ fontFamily: 'DM Sans, sans-serif' }}
                                  >
                                    <Globe size={14} />
                                    Site web
                                  </a>
                                )}
                                {partenaire.site_url && (
                                  <a 
                                    href={partenaire.site_url} 
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-300 group ${
                                      tier === 'or' ? 'border-[#FBBF24] text-[#FBBF24] hover:bg-[#FBBF24]/10' :
                                      tier === 'argent' ? 'border-[#9CA3AF] text-[#9CA3AF] hover:bg-[#9CA3AF]/10' :
                                      'border-[#D97706] text-[#D97706] hover:bg-[#D97706]/10'
                                    }`}
                                  >
                                    <ExternalLink size={14} />
                                  </a>
                                )}
                              </div>
                            </div>
                            
                            {/* Hover Effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-current/5 via-transparent to-current/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Partenaires;
