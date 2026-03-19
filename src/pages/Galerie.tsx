import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import { Image, Camera, Calendar, Trophy, Filter, Search } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const Galerie = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const { data: items, isLoading, error } = useQuery({
    queryKey: ["galerie", searchTerm],
    queryFn: async () => {
      console.log("🔍 Récupération de la galerie...");
      
      let query = supabase
        .from("galerie")
        .select("*, equipes(*)") // Jointure avec équipes pour obtenir le nom
        .order("created_at", { ascending: false });
      
      // Pas de filtre par édition car le champ n'existe pas dans la BD
      
      if (searchTerm) {
        query = query.ilike('titre_projet', `%${searchTerm}%`);
      }
      
      const { data, error } = await query;
      
      console.log("📊 Résultat query galerie:", { data, error });
      console.log("🔍 Champs galerie:", data?.[0] ? Object.keys(data[0]) : "Aucun élément");
      
      if (error) {
        console.error("❌ Erreur query galerie:", error);
        throw error;
      }
      
      console.log(`✅ ${data?.length || 0} éléments trouvés`);
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
                  <Image size={32} className="text-white" />
                </div>
                <h1 
                  className="font-display text-4xl sm:text-5xl font-bold text-[#212529]"
                  style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800 }}
                >
                  Galerie
                </h1>
              </div>
              <p 
                className="text-xl text-[#6C757D] mb-8"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                Les projets innovants des éditions précédentes
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-[#FF6B35] to-[#1E3A5F] mx-auto rounded-full"></div>
            </motion.div>
          </div>
        </div>

        {/* Filters */}
        <div className="container py-8">
          <div className="flex justify-center mb-8">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6C757D]" size={20} />
              <input
                type="text"
                placeholder="Rechercher un projet..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-[#E9ECEF] bg-white text-[#212529] placeholder-[#6C757D] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35]/50 transition-all"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container pb-8">
          {/* Loading State */}
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full border-4 border-[#FF6B35] border-t-transparent animate-spin"></div>
                <p 
                  className="text-[#6C757D]"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  Chargement de la galerie...
                </p>
              </div>
            </div>
          ) : !items || items.length === 0 ? (
            <motion.div 
              className="text-center py-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="w-24 h-24 rounded-full bg-[#F8F9FA] border border-[#E9ECEF] flex items-center justify-center mx-auto mb-6">
                <Image size={40} className="text-[#6C757D]" />
              </div>
              <h3 
                className="font-display text-xl font-bold text-[#212529] mb-2"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                Aucun projet trouvé
              </h3>
              <p 
                className="text-[#6C757D] max-w-md mx-auto"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                Aucun projet ne correspond à votre recherche.
              </p>
            </motion.div>
          ) : (
            <motion.div 
              className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="group"
                >
                  <div className="relative overflow-hidden rounded-2xl border border-[#E9ECEF] bg-white transition-all duration-300 hover:border-[#FF6B35]/50 hover:shadow-xl hover:shadow-[#FF6B35]/10">
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={item.photo_url} // ✅ Champ corrigé
                        alt={item.titre_projet}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      />
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Edition Badge - Supprimé car le champ n'existe pas */}
                      {/* <div className="absolute top-4 right-4">
                        <span className="px-3 py-1 rounded-full bg-[#1E3A5F]/90 text-white text-xs font-bold backdrop-blur-sm">
                          {item.edition}
                        </span>
                      </div> */}
                    </div>
                    
                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 
                            className="font-display text-lg font-bold text-[#212529] mb-2 group-hover:text-[#FF6B35] transition-colors"
                            style={{ fontFamily: 'Sora, sans-serif' }}
                          >
                            {item.titre_projet}
                          </h3>
                          
                          {item.equipes?.nom_equipe && (
                            <div className="flex items-center gap-2 mb-3">
                              <Trophy size={14} className="text-[#FF6B35]" />
                              <span 
                                className="text-sm text-[#6C757D]"
                                style={{ fontFamily: 'DM Sans, sans-serif' }}
                              >
                                {item.equipes.nom_equipe}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        {/* Position - Supprimé car le champ n'existe pas */}
                        {/* {item.position && (
                          <div className="text-right">
                            <span className="text-xs text-[#1E3A5F] font-medium">
                              {item.position === 1 ? '🥇 1er' : item.position === 2 ? '🥈 2ème' : item.position === 3 ? '🥉 3ème' : `Top ${item.position}`}
                            </span>
                          </div>
                        )} */}
                      </div>
                      
                      {item.description && (
                        <p 
                          className="text-sm text-[#6C757D] leading-relaxed mb-4"
                          style={{ fontFamily: 'DM Sans, sans-serif' }}
                        >
                          {item.description}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-4 text-xs text-[#6C757D]">
                        <div className="flex items-center gap-1">
                          <Calendar size={12} className="text-[#FF6B35]" />
                          <span>{new Date(item.created_at).toLocaleDateString()}</span>
                        </div>
                        
                        {/* Technologies - Supprimé car le champ n'existe pas */}
                        {/* {item.technologies && (
                          <div className="flex items-center gap-1">
                            <Camera size={12} className="text-[#1E3A5F]" />
                            <span>{item.technologies}</span>
                          </div>
                        )} */}
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

export default Galerie;
