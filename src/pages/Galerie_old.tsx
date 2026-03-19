import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import { Image, Camera, Calendar, Trophy, Filter, Search } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const Galerie = () => {
  const [filterEdition, setFilterEdition] = useState<string>('toutes');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const { data: items, isLoading } = useQuery({
    queryKey: ["galerie", filterEdition, searchTerm],
    queryFn: async () => {
      let query = supabase
        .from("galerie")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (filterEdition !== 'toutes') {
        query = query.eq('edition', filterEdition);
      }
      
      if (searchTerm) {
        query = query.ilike('titre_projet', `%${searchTerm}%`);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const editions = [
    { value: 'toutes', label: 'Toutes éditions', color: 'text-[#9CA3AF]' },
    { value: '2026', label: 'Édition 2026', color: 'text-[#00873E]' },
    { value: '2025', label: 'Édition 2025', color: 'text-[#FBBF24]' },
  ];

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
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#00873E] to-[#FBBF24] flex items-center justify-center">
                  <Camera size={32} className="text-[#F9FAFB]" />
                </div>
                <h1 
                  className="font-display text-4xl sm:text-5xl font-bold text-[#F9FAFB]"
                  style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800 }}
                >
                  Galerie
                </h1>
              </div>
              <p 
                className="text-xl text-[#9CA3AF] mb-8"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                Wall of Fame — Les projets et moments forts du hackathon
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-[#00873E] to-[#FBBF24] mx-auto rounded-full"></div>
            </motion.div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="container py-8">
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]" size={20} />
              <input
                type="text"
                placeholder="Rechercher un projet..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border-[#2D3748] bg-[#1F2937] pl-12 pr-4 py-3 text-[#F9FAFB] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#FBBF24] focus:border-transparent transition-all duration-300"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              />
            </div>

            {/* Edition Filter */}
            <div className="flex gap-2">
              {editions.map((edition) => (
                <button
                  key={edition.value}
                  onClick={() => setFilterEdition(edition.value)}
                  className={`px-4 py-2 rounded-xl border-2 font-medium transition-all duration-300 ${
                    filterEdition === edition.value
                      ? 'border-[#00873E] bg-[#00873E]/10 text-[#00873E] shadow-lg shadow-[#00873E]/25'
                      : 'border-[#2D3748] bg-[#111827] text-[#9CA3AF] hover:border-[#00873E]/50 hover:text-[#F9FAFB]'
                  }`}
                  style={{ fontFamily: 'Sora, sans-serif' }}
                >
                  <span className={filterEdition === edition.value ? 'text-[#00873E]' : edition.color}>
                    {edition.label}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Loading State */}
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full border-4 border-[#00873E] border-t-transparent animate-spin"></div>
                <p 
                  className="text-[#9CA3AF]"
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
              <div className="w-24 h-24 rounded-full bg-[#1F2937] flex items-center justify-center mx-auto mb-6">
                <Camera size={40} className="text-[#9CA3AF]" />
              </div>
              <h3 
                className="font-display text-xl font-bold text-[#F9FAFB] mb-2"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                Galerie bientôt disponible
              </h3>
              <p 
                className="text-[#9CA3AF] max-w-md mx-auto"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                La galerie sera disponible après le hackathon. Revenez voir les projets et moments forts !
              </p>
            </motion.div>
          ) : (
            <motion.div 
              className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6"
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
                  className="break-inside-avoid group"
                >
                  <div className="relative overflow-hidden rounded-2xl border border-[#2D3748] bg-[#111827] transition-all duration-300 hover:border-[#FBBF24]/50 hover:shadow-xl hover:shadow-[#FBBF24]/10">
                    {/* Image */}
                    {item.photo_url && (
                      <div className="relative overflow-hidden">
                        <img 
                          src={item.photo_url} 
                          alt={item.titre_projet} 
                          className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        {/* Overlay Icons */}
                        <div className="absolute top-4 right-4 flex gap-2">
                          {item.edition && (
                            <span className="px-3 py-1 rounded-full bg-[#00873E]/90 text-[#F9FAFB] text-xs font-bold backdrop-blur-sm">
                              {item.edition}
                            </span>
                          )}
                          {item.gagnant && (
                            <div className="w-8 h-8 rounded-full bg-[#FBBF24] flex items-center justify-center">
                              <Trophy size={16} className="text-[#0A0A0A]" />
                            </div>
                          )}
                        </div>
                        
                        {/* Date */}
                        {item.date_evenement && (
                          <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1 rounded-full bg-[#1F2937]/90 backdrop-blur-sm">
                              <Calendar size={12} className="text-[#FBBF24]" />
                              <span className="text-[#F9FAFB] text-xs font-medium">
                                {new Date(item.date_evenement).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                              </span>
                            </div>
                        )}
                      </div>
                    )}
                    
                    {/* Content */}
                    <div className="p-6">
                      <h3 
                        className="font-display text-lg font-bold text-[#F9FAFB] mb-2 group-hover:text-[#FBBF24] transition-colors"
                        style={{ fontFamily: 'Sora, sans-serif' }}
                      >
                        {item.titre_projet}
                      </h3>
                      {item.description && (
                        <p 
                          className="text-sm text-[#9CA3AF] leading-relaxed line-clamp-3"
                          style={{ fontFamily: 'DM Sans, sans-serif' }}
                        >
                          {item.description}
                        </p>
                      )}
                      
                      {/* Tags */}
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {item.tags.slice(0, 3).map((tag: string, idx: number) => (
                            <span 
                              key={idx}
                              className="px-2 py-1 rounded-lg bg-[#00873E]/10 text-[#00873E] text-xs font-medium"
                              style={{ fontFamily: 'DM Sans, sans-serif' }}
                            >
                              {tag}
                            </span>
                          ))}
                          {item.tags.length > 3 && (
                            <span 
                              className="px-2 py-1 rounded-lg bg-[#1F2937] text-[#9CA3AF] text-xs font-medium"
                              style={{ fontFamily: 'DM Sans, sans-serif' }}
                            >
                              +{item.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
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
