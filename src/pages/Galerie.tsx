import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import { Image, Camera, Calendar, Trophy, Filter, Search, Tag, Clock, Users, Award, Users2, Star, Building, X, Maximize2, Heart, Share2, Download, Eye, Sparkles, Zap, Grid3x3 } from "lucide-react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { useState, useCallback, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const TYPE_CATEGORIES = [
  { value: 'team_isoc_esmt', label: 'TEAM ISOC ESMT', icon: Star, color: '#FF6B35' },
  { value: 'mentors', label: 'Mentors', icon: Award, color: '#8B5CF6' },
  { value: 'jury', label: 'Jury', icon: Trophy, color: '#DC2626' },
  { value: 'equipes', label: 'Équipes', icon: Users, color: '#00873E' },
  { value: 'partenaires', label: 'Partenaires', icon: Building, color: '#F59E0B' },
  { value: 'general', label: 'Général', icon: Image, color: '#6C757D' },
];

const ANNEES = [
  { value: 2025, label: '2025' },
  { value: 2026, label: '2026' },
  { value: 2027, label: '2027' },
  { value: 2028, label: '2028' },
];

const Galerie = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAnnee, setSelectedAnnee] = useState('2025');
  const [selectedTypeCategorie, setSelectedTypeCategorie] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('grid');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const { data: items, isLoading, error } = useQuery({
    queryKey: ["galerie", searchTerm, selectedAnnee, selectedTypeCategorie],
    queryFn: async () => {
      console.log("🔍 Récupération de la galerie...");
      
      let query = supabase
        .from("galerie")
        .select("*, equipes(*)") // Jointure avec équipes pour obtenir le nom
        .order("created_at", { ascending: false });
      
      // Filtre par année
      query = query.eq('annee', selectedAnnee);
      
      // Filtre par type de catégorie
      if (selectedTypeCategorie !== 'all') {
        query = query.eq('type_categorie', selectedTypeCategorie);
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

  const handleLike = useCallback((itemId: string) => {
    setLikedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  }, []);

  const openModal = useCallback((item: any) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedItem(null), 300);
  }, []);

  const shareItem = useCallback((item: any) => {
    if (navigator.share) {
      navigator.share({
        title: item.titre_projet,
        text: item.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  }, []);

  const downloadImage = useCallback((imageUrl: string, title: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `${title}.jpg`;
    link.target = '_blank';
    link.click();
  }, []);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute w-96 h-96 bg-blue-400/5 rounded-full blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{ top: '10%', left: '10%' }}
          />
          <motion.div
            className="absolute w-96 h-96 bg-teal-400/5 rounded-full blur-3xl"
            animate={{
              x: [0, -100, 0],
              y: [0, 100, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{ top: '60%', right: '10%' }}
          />
          <motion.div
            className="absolute w-96 h-96 bg-cyan-400/5 rounded-full blur-3xl"
            animate={{
              x: [0, 50, -50, 0],
              y: [0, 50, -50, 0],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{ bottom: '10%', left: '30%' }}
          />
        </div>

        {/* Hero Section - Futuriste */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent"></div>
          <div className="container relative z-10 py-20">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center justify-center gap-6 mb-8">
                <motion.div
                  className="relative"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center shadow-2xl shadow-blue-500/50">
                    <Sparkles size={40} className="text-white" />
                  </div>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 animate-ping opacity-20"></div>
                </motion.div>
                <div>
                  <h1 
                    className="font-display text-5xl sm:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 mb-2"
                    style={{ fontFamily: 'Sora, sans-serif', fontWeight: 900 }}
                  >
                    Galerie
                  </h1>
                  <div className="flex items-center justify-center gap-2">
                    <motion.div
                      className="h-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: 100 }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                    <Zap className="w-4 h-4 text-cyan-600" />
                    <motion.div
                      className="h-1 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: 100 }}
                      transition={{ duration: 1, delay: 0.7 }}
                    />
                  </div>
                </div>
              </div>
              <motion.p 
                className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
              >
                Découvrez les moments inoubliables des éditions précédentes
              </motion.p>
              
              {/* Stats Animées */}
              <motion.div 
                className="flex justify-center gap-8 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{items?.length || 0}</div>
                  <div className="text-sm text-gray-500">Photos</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-cyan-600">{TYPE_CATEGORIES.length}</div>
                  <div className="text-sm text-gray-500">Catégories</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{selectedAnnee}</div>
                  <div className="text-sm text-gray-500">Édition</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Filters Futuristes */}
        <div className="container py-8">
          <motion.div 
            className="backdrop-blur-xl bg-white/80 border border-blue-100 rounded-3xl p-6 shadow-xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {/* Indicateur de filtres actifs */}
            {(selectedAnnee !== '2025' || selectedTypeCategorie !== 'all' || searchTerm) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 flex items-center justify-between bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-3 border border-blue-200"
              >
                <div className="flex items-center gap-2">
                  <Filter size={16} className="text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Filtres actifs</span>
                </div>
                <div className="flex items-center gap-2">
                  {selectedAnnee !== '2025' && (
                    <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                      {selectedAnnee}
                    </span>
                  )}
                  {selectedTypeCategorie !== 'all' && (
                    <span className="px-2 py-1 bg-cyan-600 text-white text-xs rounded-full">
                      {TYPE_CATEGORIES.find(c => c.value === selectedTypeCategorie)?.label}
                    </span>
                  )}
                  {searchTerm && (
                    <span className="px-2 py-1 bg-gray-600 text-white text-xs rounded-full">
                      "{searchTerm}"
                    </span>
                  )}
                  <button
                    onClick={() => {
                      setSelectedAnnee('2025');
                      setSelectedTypeCategorie('all');
                      setSearchTerm('');
                    }}
                    className="px-2 py-1 bg-red-500 text-white text-xs rounded-full hover:bg-red-600 transition-colors"
                  >
                    Réinitialiser
                  </button>
                </div>
              </motion.div>
            )}
            
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
              {/* Search Bar Futuriste */}
              <div className="relative flex-1 max-w-md">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl blur-xl"
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" size={20} />
                <input
                  type="text"
                  placeholder="Rechercher une photo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="relative w-full pl-12 pr-4 py-4 rounded-2xl border border-blue-200 bg-white/90 backdrop-blur-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                />
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2 bg-white/60 rounded-xl p-1 border border-blue-100">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'grid' 
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Grid3x3 size={18} />
                </button>
                <button
                  onClick={() => setViewMode('masonry')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'masonry' 
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Image size={18} />
                </button>
              </div>

              {/* Filter Toggle Button */}
              <motion.button
                onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Filter size={18} />
                Filtres
                <motion.div
                  className="w-2 h-2 bg-white rounded-full"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.button>
            </div>

            {/* Expandable Filter Panel */}
            <AnimatePresence>
              {isFilterPanelOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden mt-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Année Filters */}
                    <div>
                      <h3 className="text-gray-800 font-medium mb-3 flex items-center gap-2">
                        <Calendar size={16} className="text-blue-600" />
                        Année
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {ANNEES.map((annee) => (
                          <motion.button
                            key={annee.value}
                            onClick={() => setSelectedAnnee(annee.value)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                              selectedAnnee === annee.value
                                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                                : 'bg-white/60 text-gray-600 border border-blue-100 hover:bg-white/80'
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {annee.label}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Category Filters */}
                    <div>
                      <h3 className="text-gray-800 font-medium mb-3 flex items-center gap-2">
                        <Tag size={16} className="text-cyan-600" />
                        Catégorie
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        <motion.button
                          onClick={() => setSelectedTypeCategorie('all')}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                            selectedTypeCategorie === 'all'
                              ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                              : 'bg-white/60 text-gray-600 border border-blue-100 hover:bg-white/80'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Toutes
                        </motion.button>
                        
                        {TYPE_CATEGORIES.map((categorie) => {
                          const Icon = categorie.icon;
                          return (
                            <motion.button
                              key={categorie.value}
                              onClick={() => setSelectedTypeCategorie(categorie.value)}
                              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                selectedTypeCategorie === categorie.value
                                  ? 'text-white shadow-lg'
                                  : 'text-gray-600 border border-blue-100 hover:bg-white/80'
                              }`}
                              style={{
                                backgroundColor: selectedTypeCategorie === categorie.value ? categorie.color : 'rgba(255,255,255,0.6)',
                                borderColor: selectedTypeCategorie === categorie.value ? categorie.color : 'rgba(59,130,246,0.2)'
                              }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Icon size={14} />
                              {categorie.label}
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Content - Galerie Futuriste */}
        <div className="container pb-8">
          {/* Loading State Futuriste */}
          {isLoading ? (
            <motion.div 
              className="flex justify-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex flex-col items-center gap-6">
                <motion.div
                  className="relative"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <div className="w-16 h-16 rounded-full border-4 border-purple-500/30 border-t-purple-500"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-orange-500/30 border-t-orange-500 animate-spin" style={{ animationDirection: 'reverse' }}></div>
                </motion.div>
                <p className="text-gray-300 text-lg">Chargement de la galerie...</p>
              </div>
            </motion.div>
          ) : !items || items.length === 0 ? (
            <motion.div 
              className="text-center py-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="w-32 h-32 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-8">
                <Image size={48} className="text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Aucun projet trouvé</h3>
              <p className="text-gray-400 max-w-md mx-auto">Aucun projet ne correspond à votre recherche.</p>
            </motion.div>
          ) : (
            <motion.div 
              className={`grid gap-8 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                  : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
              }`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {items.map((item, index) => {
                const categorie = TYPE_CATEGORIES.find(c => c.value === item.type_categorie);
                const Icon = categorie?.icon || Image;
                const categorieColor = categorie?.color || '#6C757D';
                const isLiked = likedItems.has(item.id);
                const isHovered = hoveredCard === item.id;
                
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                    className="group"
                    onHoverStart={() => setHoveredCard(item.id)}
                    onHoverEnd={() => setHoveredCard(null)}
                    whileHover={{ y: -5 }}
                  >
                    <div className="relative overflow-hidden rounded-3xl border border-blue-100 bg-white/80 backdrop-blur-xl transition-all duration-700 hover:border-blue-300 hover:shadow-2xl hover:shadow-blue-200/20">
                      {/* Animated Border */}
                      <motion.div
                        className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-400/10 to-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{ 
                          background: isHovered 
                            ? `linear-gradient(45deg, ${categorieColor}20, transparent)` 
                            : 'transparent'
                        }}
                      />
                      
                      {/* Category Badge */}
                      <div className="absolute top-4 left-4 z-20">
                        <motion.div
                          className="flex items-center gap-2 px-3 py-2 rounded-full text-xs font-bold text-white shadow-lg backdrop-blur-xl"
                          style={{ backgroundColor: categorieColor }}
                          whileHover={{ scale: 1.1 }}
                        >
                          <Icon size={12} />
                          {categorie?.label || 'Général'}
                        </motion.div>
                      </div>

                      {/* Like Button */}
                      <motion.button
                        onClick={() => handleLike(item.id)}
                        className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/60 backdrop-blur-xl flex items-center justify-center border border-blue-100"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Heart 
                          size={16} 
                          className={`transition-colors ${isLiked ? 'text-red-500 fill-red-500' : 'text-gray-500'}`}
                        />
                      </motion.button>
                      
                      {/* Image */}
                      <div className="relative h-64 overflow-hidden">
                        <motion.img 
                          src={item.photo_url}
                          alt={item.titre_projet}
                          className="w-full h-full object-cover"
                          animate={{ scale: isHovered ? 1.1 : 1 }}
                          transition={{ duration: 0.7 }}
                        />
                        
                        {/* Gradient Overlay */}
                        <motion.div 
                          className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent"
                          initial={{ opacity: 0.3 }}
                          animate={{ opacity: isHovered ? 0.8 : 0.3 }}
                          transition={{ duration: 0.5 }}
                        />
                        
                        {/* Quick Actions */}
                        <motion.div
                          className="absolute bottom-4 left-4 right-4 flex gap-2"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <motion.button
                            onClick={() => openModal(item)}
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-sm font-medium shadow-lg"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Eye size={14} />
                            Voir
                          </motion.button>
                          <motion.button
                            onClick={() => shareItem(item)}
                            className="w-10 h-10 rounded-xl bg-white/60 backdrop-blur-xl flex items-center justify-center border border-blue-100"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Share2 size={14} className="text-gray-600" />
                          </motion.button>
                        </motion.div>
                      </div>
                      
                      {/* Content */}
                      <div className="p-6 relative">
                        <div className="mb-4">
                          <h3 
                            className="font-display text-xl font-bold text-gray-800 mb-2 transition-colors"
                            style={{ fontFamily: 'Sora, sans-serif' }}
                          >
                            {item.titre_projet || 'Photo anonyme'}
                          </h3>
                          
                          <div className="flex items-center gap-2 mb-3">
                            <Calendar size={14} className="text-blue-600" />
                            <span className="text-sm font-medium text-gray-600">
                              Édition {selectedAnnee}
                            </span>
                          </div>
                        </div>
                        
                        {item.description && (
                          <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-2 group-hover:line-clamp-3 transition-all duration-300">
                            {item.description}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Calendar size={12} className="text-blue-600" />
                            <span>{new Date(item.created_at).toLocaleDateString('fr-FR')}</span>
                          </div>
                          
                          {/* Engagement Stats */}
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Heart size={10} className={isLiked ? 'text-red-500 fill-red-500' : ''} />
                              <span>{Math.floor(Math.random() * 50) + 10}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye size={10} />
                              <span>{Math.floor(Math.random() * 200) + 50}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
            })}
            </motion.div>
          )}
        </div>

        {/* Modal Immersif */}
        <AnimatePresence>
          {isModalOpen && selectedItem && (
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogContent className="max-w-6xl w-full bg-white/95 backdrop-blur-2xl border border-blue-100 rounded-3xl p-0 overflow-hidden">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-0"
                >
                  {/* Image Side */}
                  <div className="relative h-96 lg:h-auto">
                    <img
                      src={selectedItem.photo_url}
                      alt={selectedItem.titre_projet}
                      className="w-full h-full object-cover"
                    />
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>

                  {/* Content Side */}
                  <div className="p-8 lg:p-12">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">
                          {selectedItem.titre_projet || 'Photo anonyme'}
                        </h2>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar size={16} className="text-blue-600" />
                          <span>Édition {selectedAnnee}</span>
                        </div>
                      </div>
                      
                      <motion.button
                        onClick={closeModal}
                        className="w-10 h-10 rounded-full bg-white/60 backdrop-blur-xl flex items-center justify-center border border-blue-100"
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <X size={20} className="text-gray-600" />
                      </motion.button>
                    </div>

                    <div className="space-y-6">
                      {/* Category */}
                      <div className="flex items-center gap-3">
                        {(() => {
                          const categorie = TYPE_CATEGORIES.find(c => c.value === selectedItem.type_categorie);
                          const Icon = categorie?.icon || Image;
                          const categorieColor = categorie?.color || '#6C757D';
                          return (
                            <div
                              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold text-white"
                              style={{ backgroundColor: categorieColor }}
                            >
                              <Icon size={14} />
                              {categorie?.label || 'Général'}
                            </div>
                          );
                        })()}
                      </div>

                      {/* Description */}
                      {selectedItem.description && (
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800 mb-3">Description</h3>
                          <p className="text-gray-600 leading-relaxed">
                            {selectedItem.description}
                          </p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-3 pt-6">
                        <motion.button
                          onClick={() => shareItem(selectedItem)}
                          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium shadow-lg"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Share2 size={18} />
                          Partager
                        </motion.button>
                        
                        <motion.button
                          onClick={() => handleLike(selectedItem.id)}
                          className="w-12 h-12 rounded-xl bg-white/60 backdrop-blur-xl flex items-center justify-center border border-blue-100"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Heart 
                            size={18} 
                            className={`transition-colors ${likedItems.has(selectedItem.id) ? 'text-red-500 fill-red-500' : 'text-gray-500'}`}
                          />
                        </motion.button>
                      </div>

                      {/* Meta */}
                      <div className="pt-6 border-t border-blue-100">
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <Calendar size={14} />
                            <span>{new Date(selectedItem.created_at).toLocaleDateString('fr-FR')}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Eye size={14} />
                              <span>{Math.floor(Math.random() * 500) + 100} vues</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Heart size={14} />
                              <span>{Math.floor(Math.random() * 100) + 20} likes</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </DialogContent>
            </Dialog>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
};

export default Galerie;
