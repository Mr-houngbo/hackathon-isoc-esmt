import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import { Users, User, BookOpen, Trophy, Star, Award, Code, Zap, Target } from "lucide-react";
import { motion } from "framer-motion";

const EquipesSelectionnees = () => {
  const { data: equipes, isLoading, error } = useQuery({
    queryKey: ["equipes-selectionnees"],
    queryFn: async () => {
      console.log("🔍 Récupération des équipes sélectionnées...");
      
      // D'abord, vérifions toutes les équipes
      const { data: allEquipes, error: allError } = await supabase
        .from("equipes")
        .select("*")
        .order("created_at", { ascending: true });
      
      console.log("📊 Toutes les équipes dans la BD:", allEquipes);
      console.log("🔍 Champs disponibles:", allEquipes?.[0] ? Object.keys(allEquipes[0]) : "Aucune équipe");
      
      // Ensuite, récupérons seulement les sélectionnées et publiées avec le bon champ
      const { data, error } = await supabase
        .from("equipes")
        .select("*, membres(*)")
        .eq("statut", "selectionne") // ✅ Champ corrigé
        .eq("publiee", true) // ✅ Seulement les équipes publiées
        .order("created_at", { ascending: true });
      
      console.log("📊 Résultat query équipes sélectionnées:", { data, error });
      
      if (error) {
        console.error("❌ Erreur query équipes:", error);
        throw error;
      }
      
      console.log(`✅ ${data?.length || 0} équipes sélectionnées trouvées`);
      return data;
    },
  });

  const getBadgeColor = (position?: number) => {
    if (position === 1) return 'bg-gradient-to-r from-[#FEEB09] to-[#FEEB09]';
    if (position === 2) return 'bg-gradient-to-r from-[#24366E] to-[#2E4A8C]';
    if (position === 3) return 'bg-gradient-to-r from-[#FFF04D] to-[#FEEB09]';
    return 'bg-gradient-to-r from-[#FEEB09] to-[#24366E]';
  };

  const getBadgeIcon = (position?: number) => {
    if (position === 1) return Trophy;
    if (position === 2) return Award;
    if (position === 3) return Star;
    return Users;
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] to-white">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#FEEB09]/5 via-[#24366E]/5 to-transparent"></div>
          <div className="container relative z-10 py-16">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#FEEB09] to-[#24366E] flex items-center justify-center">
                  <Trophy size={32} className="text-white" />
                </div>
                <h1 
                  className="font-display text-4xl sm:text-5xl font-bold text-[#212529]"
                  style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800 }}
                >
                  Équipes
                </h1>
              </div>
              <p 
                className="text-xl text-[#6C757D] mb-8"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                Sélectionnées — Les talents retenus pour le hackathon
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-[#FEEB09] to-[#24366E] mx-auto rounded-full"></div>
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="container py-8">
          {/* Loading State */}
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full border-4 border-[#FEEB09] border-t-transparent animate-spin"></div>
                <p 
                  className="text-[#6C757D]"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  Chargement des équipes sélectionnées...
                </p>
              </div>
            </div>
          ) : !equipes || equipes.length === 0 ? (
            <motion.div 
              className="text-center py-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="w-24 h-24 rounded-full bg-[#F8F9FA] border border-[#E9ECEF] flex items-center justify-center mx-auto mb-6">
                <Users size={40} className="text-[#6C757D]" />
              </div>
              <h3 
                className="font-display text-xl font-bold text-[#212529] mb-2"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                Sélection en cours
              </h3>
              <p 
                className="text-[#6C757D] max-w-md mx-auto"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                Les équipes sélectionnées seront publiées prochainement. Revenez consulter la liste !
              </p>
            </motion.div>
          ) : (
            <motion.div 
              className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {equipes.map((eq, index) => (
                <motion.div
                  key={eq.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="group"
                >
                  <div className="relative overflow-hidden rounded-2xl border border-[#E9ECEF] bg-white transition-all duration-300 hover:border-[#FEEB09]/50 hover:shadow-xl hover:shadow-[#FEEB09]/10">
                    {/* Badge Position */}
                    {eq.position && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                        className={`absolute -top-3 -right-3 w-12 h-12 ${getBadgeColor(eq.position)} rounded-full flex items-center justify-center shadow-lg z-10`}
                      >
                        {(() => {
                          const Icon = getBadgeIcon(eq.position);
                          return <Icon size={20} className="text-white" />;
                        })()}
                      </motion.div>
                    )}

                    {/* Header */}
                    <div className="p-6 pb-4">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-[#FEEB09]/10 flex items-center justify-center">
                          <Users size={20} className="text-[#FEEB09]" />
                        </div>
                        <div className="flex-1">
                          <h3 
                            className="font-display text-lg font-bold text-[#212529] group-hover:text-[#FEEB09] transition-colors"
                            style={{ fontFamily: 'Sora, sans-serif' }}
                          >
                            {eq.nom_equipe || "Participant individuel"}
                          </h3>
                          {eq.position && (
                            <span 
                              className="text-xs text-[#FEEB09] font-medium"
                              style={{ fontFamily: 'DM Sans, sans-serif' }}
                            >
                              {eq.position === 1 ? '🥇 1er' : eq.position === 2 ? '🥈 2ème' : eq.position === 3 ? '🥉 3ème' : `Top ${eq.position}`}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Project Name */}
                      {eq.nom_projet && (
                        <div className="mb-4">
                          <p 
                            className="text-sm font-semibold text-[#24366E]"
                            style={{ fontFamily: 'DM Sans, sans-serif' }}
                          >
                            {eq.nom_projet}
                          </p>
                        </div>
                      )}
                      
                      {/* Team Stats */}
                      <div className="flex gap-4 mb-4">
                        <div className="flex items-center gap-1">
                          <Users size={14} className="text-[#6C757D]" />
                          <span 
                            className="text-xs text-[#6C757D]"
                            style={{ fontFamily: 'DM Sans, sans-serif' }}
                          >
                            {eq.membres?.length || 0} membres
                          </span>
                        </div>
                        {eq.domaine_projet && (
                          <div className="flex items-center gap-1">
                            <Target size={14} className="text-[#6C757D]" />
                            <span 
                              className="text-xs text-[#6C757D]"
                              style={{ fontFamily: 'DM Sans, sans-serif' }}
                            >
                              {eq.domaine_projet}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Members List */}
                    <div className="px-6 pb-6">
                      <div className="space-y-3">
                        {(eq.membres as any[])?.slice(0, 3).map((m: any) => (
                          <div key={m.id} className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#F8F9FA] border border-[#E9ECEF] flex items-center justify-center">
                              <User size={14} className="text-[#6C757D]" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span 
                                  className="text-sm font-medium text-[#212529]"
                                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                                >
                                  {m.nom_prenom}
                                </span>
                                {m.est_chef && (
                                  <span className="px-2 py-0.5 rounded-full bg-[#24366E]/10 text-[#24366E] text-xs font-bold">
                                    Chef
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <BookOpen size={12} className="text-[#6C757D]" />
                                <span 
                                  className="text-xs text-[#6C757D]"
                                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                                >
                                  {m.filiere}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                        {eq.membres && eq.membres.length > 3 && (
                          <div className="text-center pt-2">
                            <span 
                              className="text-xs text-[#6C757D] font-medium"
                              style={{ fontFamily: 'DM Sans, sans-serif' }}
                            >
                              +{eq.membres.length - 3} autre{eq.membres.length - 3 > 1 ? 's' : ''}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Skills Tags */}
                    {eq.competences_equipe && eq.competences_equipe.length > 0 && (
                      <div className="px-6 pb-6">
                        <div className="flex flex-wrap gap-2">
                          {eq.competences_equipe.slice(0, 4).map((skill: string, idx: number) => (
                            <span 
                              key={idx}
                              className="px-2 py-1 rounded-lg bg-[#FEEB09]/10 text-[#FEEB09] text-xs font-medium"
                              style={{ fontFamily: 'DM Sans, sans-serif' }}
                            >
                              {skill}
                            </span>
                          ))}
                          {eq.competences_equipe.length > 4 && (
                            <span 
                              className="px-2 py-1 rounded-lg bg-[#F8F9FA] border border-[#E9ECEF] text-[#6C757D] text-xs font-medium"
                              style={{ fontFamily: 'DM Sans, sans-serif' }}
                            >
                              +{eq.competences_equipe.length - 4}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Hover Overlay */}
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

export default EquipesSelectionnees;
