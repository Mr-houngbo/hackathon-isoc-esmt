import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import { Image, Camera, Calendar, Trophy, Filter, Search, Tag, Clock, Users, Award } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const CATEGORIES = [
  { value: 'general', label: 'Général', icon: Image, color: '#6C757D' },
  { value: 'annee_derniere', label: 'Année dernière', icon: Clock, color: '#FF6B35' },
  { value: 'cette_annee', label: 'Cette année', icon: Calendar, color: '#1E3A5F' },
  { value: 'equipes', label: 'Équipes', icon: Users, color: '#00873E' },
  { value: 'mentors', label: 'Mentors', icon: Award, color: '#8B5CF6' },
  { value: 'partenaires', label: 'Partenaires', icon: Tag, color: '#F59E0B' },
  { value: 'ceremonie', label: 'Cérémonie', icon: Trophy, color: '#DC2626' },
];

const Galerie = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategorie, setSelectedCategorie] = useState<string>('all');

  const { data: items, isLoading, error } = useQuery({
    queryKey: ["galerie", searchTerm, selectedCategorie],
    queryFn: async () => {
      console.log("🔍 Récupération de la galerie...");
      
      let query = supabase
        .from("galerie")
        .select("*, equipes(*)") // Jointure avec équipes pour obtenir le nom
        .order("created_at", { ascending: false });
      
      // Filtre par catégorie
      if (selectedCategorie !== 'all') {
        query = query.eq('categorie', selectedCategorie);
      }
      
      // Filtre par recherche
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
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-center mb-8">
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

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => setSelectedCategorie('all')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  selectedCategorie === 'all'
                    ? 'bg-gradient-to-r from-[#FF6B35] to-[#1E3A5F] text-white shadow-lg'
                    : 'bg-white text-[#6C757D] border border-[#E9ECEF] hover:border-[#FF6B35]/30 hover:text-[#212529]'
                }`}
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                <Filter size={16} />
                Toutes
              </button>
              
              {CATEGORIES.map((categorie) => {
                const Icon = categorie.icon;
                return (
                  <button
                    key={categorie.value}
                    onClick={() => setSelectedCategorie(categorie.value)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      selectedCategorie === categorie.value
                        ? 'text-white shadow-lg'
                        : 'text-[#6C757D] border border-[#E9ECEF] hover:border-[#FF6B35]/30 hover:text-[#212529]'
                    }`}
                    style={{
                      backgroundColor: selectedCategorie === categorie.value ? categorie.color : 'white',
                      fontFamily: 'DM Sans, sans-serif'
                    }}
                  >
                    <Icon size={16} />
                    {categorie.label}
                  </button>
                );
              })}
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
              {items.map((item, index) => {
                const categorie = CATEGORIES.find(c => c.value === item.categorie);
                const Icon = categorie?.icon || Image;
                const categorieColor = categorie?.color || '#6C757D';
                
                return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="group"
                >
                  <div className="relative overflow-hidden rounded-2xl border border-[#E9ECEF] bg-white transition-all duration-500 hover:border-[#FF6B35]/30 hover:shadow-2xl hover:shadow-[#FF6B35]/10">
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4 z-10">
                      <div 
                        className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg"
                        style={{ backgroundColor: categorieColor }}
                      >
                        <Icon size={12} />
                        {categorie?.label || 'Général'}
                      </div>
                    </div>
                    
                    {/* Image */}
                    <div className="relative h-56 overflow-hidden">
                      <img 
                        src={item.photo_url} // ✅ Champ corrigé
                        alt={item.titre_projet}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      />
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-6 relative">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 
                            className="font-display text-xl font-bold text-[#212529] mb-2 group-hover:text-[#FF6B35] transition-colors"
                            style={{ fontFamily: 'Sora, sans-serif' }}
                          >
                            {item.titre_projet}
                          </h3>
                          
                          {item.equipes?.nom_equipe && (
                            <div className="flex items-center gap-2 mb-3">
                              <Trophy size={14} className="text-[#FF6B35]" />
                              <span 
                                className="text-sm font-medium text-[#6C757D]"
                                style={{ fontFamily: 'DM Sans, sans-serif' }}
                              >
                                {item.equipes.nom_equipe}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {item.description && (
                        <p 
                          className="text-sm text-[#6C757D] leading-relaxed mb-4 line-clamp-2 group-hover:line-clamp-3 transition-all duration-300"
                          style={{ fontFamily: 'DM Sans, sans-serif' }}
                        >
                          {item.description}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-xs text-[#6C757D]">
                          <Calendar size={12} className="text-[#FF6B35]" />
                          <span>{new Date(item.created_at).toLocaleDateString('fr-FR')}</span>
                        </div>
                        
                        {/* View Button */}
                        <button
                          onClick={() => window.open(item.photo_url, '_blank')}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium bg-gradient-to-r from-[#FF6B35] to-[#1E3A5F] text-white hover:from-[#FF6B35]/90 hover:to-[#1E3A5F]/90 transition-all opacity-0 group-hover:opacity-100"
                          style={{ fontFamily: 'DM Sans, sans-serif' }}
                        >
                          <Image size={12} />
                          Voir
                        </button>
                      </div>
                    </div>
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

export default Galerie;
