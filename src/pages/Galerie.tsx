import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import { Image, Camera, Calendar, Trophy, Filter, Search, Tag, Clock, Users, Award, Users2, Star, Building, X, Maximize2, Heart, Share2, Download, Eye, Sparkles, Zap, Grid3x3, Map, Play, Pause, Smartphone } from "lucide-react";
import { motion, AnimatePresence, PanInfo, useScroll, useTransform } from "framer-motion";
import { useState, useCallback, useEffect, useRef } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { GlobeISoc } from "@/components/ui/GlobeISoc";

const TYPE_CATEGORIES = [
  { value: 'team_isoc_esmt', label: 'TEAM ISOC ESMT', icon: Star, color: '#FEEB09' },
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
  const [selectedAnnee, setSelectedAnnee] = useState(2025);
  const [selectedTypeCategorie, setSelectedTypeCategorie] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());
  const [viewCounts, setViewCounts] = useState<Record<string, number>>({});
  const [viewMode, setViewMode] = useState<'grid' | 'timeline' | 'tiktok'>('grid');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [showMostLiked, setShowMostLiked] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentTikTokIndex, setCurrentTikTokIndex] = useState(0);
  const timelineRef = useRef<HTMLDivElement>(null);
  const tikTokContainerRef = useRef<HTMLDivElement>(null);

  // Détecter si on est sur mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768 && viewMode === 'tiktok') {
        setViewMode('grid');
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [viewMode]);

  // Charger les likes depuis localStorage au montage
  useEffect(() => {
    const savedLikes = localStorage.getItem('galerie_likes');
    if (savedLikes) {
      setLikedItems(new Set(JSON.parse(savedLikes)));
    }
    const savedViews = localStorage.getItem('galerie_views');
    if (savedViews) {
      setViewCounts(JSON.parse(savedViews));
    }
  }, []);

  // Sauvegarder les likes dans localStorage
  useEffect(() => {
    localStorage.setItem('galerie_likes', JSON.stringify([...likedItems]));
  }, [likedItems]);

  // Sauvegarder les vues dans localStorage
  useEffect(() => {
    localStorage.setItem('galerie_views', JSON.stringify(viewCounts));
  }, [viewCounts]);

  const { data: items, isLoading, error } = useQuery({
    queryKey: ["galerie", searchTerm, selectedAnnee, selectedTypeCategorie, showMostLiked],
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
      
      // Trier par likes si le filtre est activé
      if (showMostLiked && data) {
        const savedLikes = JSON.parse(localStorage.getItem('galerie_likes') || '[]');
        return data.sort((a: any, b: any) => {
          const aLiked = savedLikes.includes(a.id) ? 1 : 0;
          const bLiked = savedLikes.includes(b.id) ? 1 : 0;
          return bLiked - aLiked;
        });
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

  const incrementView = useCallback((itemId: string) => {
    setViewCounts(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }));
  }, []);

  const openModal = useCallback((item: any) => {
    setSelectedItem(item);
    setIsModalOpen(true);
    incrementView(item.id);
  }, [incrementView]);

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
          
          {/* Globe decorations */}
          <motion.div
            className="absolute"
            animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            style={{ top: '25%', right: '5%' }}
          >
            <GlobeISoc size={50} opacity={0.2} />
          </motion.div>
          <motion.div
            className="absolute"
            animate={{ y: [0, -8, 0], rotate: [0, -6, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            style={{ top: '45%', left: '3%' }}
          >
            <GlobeISoc size={65} opacity={0.15} />
          </motion.div>
          <motion.div
            className="absolute"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            style={{ bottom: '20%', right: '8%' }}
          >
            <GlobeISoc size={45} opacity={0.12} />
          </motion.div>
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

        {/* Filters Simplifiés Mobile */}
        <div className="container py-6">
          <motion.div className="bg-white/90 backdrop-blur-lg border border-blue-100 rounded-2xl p-4 sm:p-6 shadow-lg">
            {/* Mobile Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              {/* Search */}
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500" size={18} />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-blue-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>

              {/* Year Selector */}
              <div className="relative w-full sm:w-auto">
                <select
                  value={selectedAnnee}
                  onChange={(e) => setSelectedAnnee(Number(e.target.value))}
                  className="w-full sm:w-32 pl-10 pr-4 py-2.5 rounded-lg border border-blue-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none cursor-pointer"
                >
                  {ANNEES.map((annee) => (
                    <option key={annee.value} value={annee.value}>
                      {annee.label}
                    </option>
                  ))}
                </select>
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500" size={16} />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Quick Filters */}
              <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
                <button
                  onClick={() => setSelectedTypeCategorie('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
                    selectedTypeCategorie === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  Tout
                </button>
                {TYPE_CATEGORIES.slice(0, 3).map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.value}
                      onClick={() => setSelectedTypeCategorie(cat.value)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
                        selectedTypeCategorie === cat.value ? 'text-white' : 'bg-gray-100 text-gray-600'
                      }`}
                      style={{ backgroundColor: selectedTypeCategorie === cat.value ? cat.color : undefined }}
                    >
                      <Icon size={12} />
                      {cat.label}
                    </button>
                  );
                })}
              </div>

              {/* Most Liked Filter */}
              <button
                onClick={() => setShowMostLiked(!showMostLiked)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  showMostLiked 
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-600 hover:bg-orange-100 hover:text-orange-600'
                }`}
              >
                <Zap size={12} className={showMostLiked ? 'animate-pulse' : ''} />
                🔥 Plus aimées
              </button>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-md transition-all ${
                    viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'
                  }`}
                  title="Vue grille"
                >
                  <Grid3x3 size={16} />
                </button>
                <button
                  onClick={() => setViewMode('timeline')}
                  className={`p-1.5 rounded-md transition-all ${
                    viewMode === 'timeline' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'
                  }`}
                  title="Vue timeline"
                >
                  <Map size={16} />
                </button>
                {isMobile && (
                  <button
                    onClick={() => setViewMode('tiktok')}
                    className={`p-1.5 rounded-md transition-all ${
                      viewMode === 'tiktok' ? 'bg-white shadow-sm text-pink-600' : 'text-gray-500 hover:text-gray-700'
                    }`}
                    title="Mode TikTok"
                  >
                    <Smartphone size={16} />
                  </button>
                )}
              </div>
            </div>
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
          ) : viewMode === 'tiktok' && isMobile ? (
            /* TikTok View - Mode Mobile Swipe */
            <TikTokView 
              items={items} 
              currentIndex={currentTikTokIndex}
              setCurrentIndex={setCurrentTikTokIndex}
              handleLike={handleLike}
              likedItems={likedItems}
              viewCounts={viewCounts}
              incrementView={incrementView}
              containerRef={tikTokContainerRef}
            />
          ) : viewMode === 'timeline' ? (
            /* Timeline View - Mode Storytelling */
            <TimelineView 
              items={items} 
              openModal={openModal}
              handleLike={handleLike}
              likedItems={likedItems}
              selectedAnnee={selectedAnnee}
              viewCounts={viewCounts}
            />
          ) : (
            <motion.div 
              className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
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
                              <span>{likedItems.has(item.id) ? 1 : 0}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye size={10} />
                              <span>{viewCounts[item.id] || 0}</span>
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
                              <span>{viewCounts[selectedItem.id] || 0} vues</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Heart size={14} />
                              <span>{likedItems.has(selectedItem.id) ? 1 : 0} likes</span>
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

// Composant TimelineView - Mode Storytelling
interface TimelineViewProps {
  items: any[];
  openModal: (item: any) => void;
  handleLike: (itemId: string) => void;
  likedItems: Set<string>;
  selectedAnnee: number;
  viewCounts: Record<string, number>;
}

const TimelineView = ({ items, openModal, handleLike, likedItems, selectedAnnee, viewCounts }: TimelineViewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // Organiser les items par phases du hackathon
  const getPhaseForIndex = (index: number, total: number) => {
    if (index === 0) return { label: "🚀 Lancement", color: "#FEEB09" };
    if (index === Math.floor(total / 3)) return { label: "⚡ En cours", color: "#3B82F6" };
    if (index === Math.floor(total * 2 / 3)) return { label: "🏁 Final", color: "#8B5CF6" };
    if (index === total - 1) return { label: "🏆 Awards", color: "#F59E0B" };
    return null;
  };

  return (
    <div ref={containerRef} className="relative max-w-5xl mx-auto py-12">
      {/* Ligne de timeline centrale avec animation */}
      <div className="absolute left-1/2 top-0 bottom-0 w-1 -translate-x-1/2 bg-gradient-to-b from-[#FEEB09]/20 via-[#3B82F6]/20 to-[#F59E0B]/20 rounded-full overflow-hidden">
        <motion.div 
          className="w-full bg-gradient-to-b from-[#FEEB09] via-[#3B82F6] to-[#F59E0B]"
          style={{ height: lineHeight }}
        />
      </div>

      {/* Items de la timeline */}
      <div className="space-y-16">
        {items.map((item, index) => {
          const isLeft = index % 2 === 0;
          const phase = getPhaseForIndex(index, items.length);
          const categorie = TYPE_CATEGORIES.find(c => c.value === item.type_categorie);
          const Icon = categorie?.icon || Image;
          const isLiked = likedItems.has(item.id);

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className={`relative flex items-center ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}
            >
              {/* Phase Marker (si applicable) */}
              {phase && (
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  className="absolute left-1/2 -translate-x-1/2 z-20"
                  style={{ top: -40 }}
                >
                  <div 
                    className="px-4 py-1.5 rounded-full text-xs font-bold text-white shadow-lg"
                    style={{ backgroundColor: phase.color }}
                  >
                    {phase.label}
                  </div>
                </motion.div>
              )}

              {/* Point sur la timeline */}
              <motion.div
                className="absolute left-1/2 -translate-x-1/2 z-10"
                whileHover={{ scale: 1.3 }}
              >
                <div 
                  className="w-5 h-5 rounded-full border-4 border-white shadow-lg"
                  style={{ backgroundColor: categorie?.color || '#6C757D' }}
                />
                <div 
                  className="absolute inset-0 rounded-full animate-ping opacity-30"
                  style={{ backgroundColor: categorie?.color || '#6C757D' }}
                />
              </motion.div>

              {/* Card */}
              <div className={`w-5/12 ${isLeft ? 'pr-12 text-right' : 'pl-12 text-left'}`}>
                <motion.div
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="relative group cursor-pointer"
                  onClick={() => openModal(item)}
                >
                  {/* Image */}
                  <div className="relative overflow-hidden rounded-2xl shadow-xl">
                    <img
                      src={item.photo_url}
                      alt={item.titre_projet}
                      className="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent" />
                    
                    {/* Badge catégorie */}
                    <div 
                      className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold text-white flex items-center gap-1"
                      style={{ backgroundColor: categorie?.color || '#6C757D' }}
                    >
                      <Icon size={12} />
                      {categorie?.label}
                    </div>

                    {/* Like button avec compteur */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLike(item.id);
                      }}
                      className="absolute top-3 right-3 px-2 py-1 rounded-full bg-white/90 flex items-center gap-1 transition-transform hover:scale-110"
                    >
                      <Heart 
                        size={14} 
                        className={isLiked ? 'text-red-500 fill-red-500' : 'text-gray-500'}
                      />
                      <span className="text-xs font-medium text-gray-700">{isLiked ? 1 : 0}</span>
                    </button>

                    {/* Contenu avec stats */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white font-bold text-lg mb-1" style={{ fontFamily: 'Sora, sans-serif' }}>
                        {item.titre_projet || 'Moment spécial'}
                      </h3>
                      <p className="text-white/80 text-sm line-clamp-2">
                        {item.description}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-white/60 text-xs">
                        <span className="flex items-center gap-1">
                          <Calendar size={10} />
                          {new Date(item.created_at).toLocaleDateString('fr-FR')}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Eye size={10} />
                          {viewCounts[item.id] || 0} vues
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Heart size={10} className={isLiked ? 'text-red-400 fill-red-400' : ''} />
                          {isLiked ? 1 : 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Connector line */}
                  <div 
                    className={`absolute top-1/2 ${isLeft ? 'right-0 translate-x-full' : 'left-0 -translate-x-full'} w-12 h-px bg-gradient-to-r ${isLeft ? 'from-gray-300 to-transparent' : 'from-transparent to-gray-300'}`}
                  />
                </motion.div>
              </div>

              {/* Espace vide pour l'autre côté */}
              <div className="w-5/12" />
            </motion.div>
          );
        })}
      </div>

      {/* Fin de timeline */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="flex justify-center mt-16"
      >
        <div className="w-4 h-4 rounded-full bg-gradient-to-r from-[#FEEB09] via-[#3B82F6] to-[#F59E0B] animate-pulse" />
      </motion.div>
    </div>
  );
};

// Composant TikTokView - Mode Mobile Swipe
interface TikTokViewProps {
  items: any[];
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  handleLike: (itemId: string) => void;
  likedItems: Set<string>;
  viewCounts: Record<string, number>;
  incrementView: (itemId: string) => void;
  containerRef: React.RefObject<HTMLDivElement>;
}

const TikTokView = ({ 
  items, 
  currentIndex, 
  setCurrentIndex, 
  handleLike, 
  likedItems, 
  viewCounts,
  incrementView,
  containerRef 
}: TikTokViewProps) => {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Incrémenter la vue quand on arrive sur une nouvelle photo
  useEffect(() => {
    if (items[currentIndex]) {
      incrementView(items[currentIndex].id);
    }
  }, [currentIndex, items, incrementView]);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientY);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isUpSwipe = distance > minSwipeDistance;
    const isDownSwipe = distance < -minSwipeDistance;

    if (isUpSwipe && currentIndex < items.length - 1 && !isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex(currentIndex + 1);
      setTimeout(() => setIsTransitioning(false), 300);
    }
    if (isDownSwipe && currentIndex > 0 && !isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex(currentIndex - 1);
      setTimeout(() => setIsTransitioning(false), 300);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (isTransitioning) return;
    
    if (e.deltaY > 0 && currentIndex < items.length - 1) {
      setIsTransitioning(true);
      setCurrentIndex(currentIndex + 1);
      setTimeout(() => setIsTransitioning(false), 300);
    } else if (e.deltaY < 0 && currentIndex > 0) {
      setIsTransitioning(true);
      setCurrentIndex(currentIndex - 1);
      setTimeout(() => setIsTransitioning(false), 300);
    }
  };

  const currentItem = items[currentIndex];
  const categorie = TYPE_CATEGORIES.find(c => c.value === currentItem?.type_categorie);
  const Icon = categorie?.icon || Image;
  const isLiked = likedItems.has(currentItem?.id || '');

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 bg-black md:hidden"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onWheel={handleWheel}
    >
      {/* Progress indicator */}
      <div className="absolute top-0 left-0 right-0 z-50 flex gap-1 p-2">
        {items.map((_, idx) => (
          <div 
            key={idx}
            className={`flex-1 h-1 rounded-full transition-all duration-300 ${
              idx === currentIndex ? 'bg-white' : idx < currentIndex ? 'bg-white/50' : 'bg-white/20'
            }`}
          />
        ))}
      </div>

      {/* Photo plein écran */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentItem?.id}
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0"
        >
          <img
            src={currentItem?.photo_url}
            alt={currentItem?.titre_projet}
            className="w-full h-full object-cover"
          />
          
          {/* Gradient overlay bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
        </motion.div>
      </AnimatePresence>

      {/* Top info */}
      <div className="absolute top-12 left-4 right-4 z-40">
        <div className="flex items-center gap-2">
          <div 
            className="px-3 py-1.5 rounded-full text-xs font-bold text-white flex items-center gap-1.5"
            style={{ backgroundColor: categorie?.color || '#6C757D' }}
          >
            <Icon size={14} />
            {categorie?.label || 'Général'}
          </div>
          <span className="text-white/80 text-xs">
            {currentIndex + 1} / {items.length}
          </span>
        </div>
      </div>

      {/* Right side actions */}
      <div className="absolute right-4 bottom-32 z-40 flex flex-col gap-4">
        {/* Like button */}
        <motion.button
          onClick={() => handleLike(currentItem?.id)}
          whileTap={{ scale: 0.9 }}
          className="flex flex-col items-center gap-1"
        >
          <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
            isLiked 
              ? 'bg-red-500 shadow-lg shadow-red-500/50' 
              : 'bg-white/20 backdrop-blur-md'
          }`}>
            <Heart 
              size={24} 
              className={`transition-all ${isLiked ? 'text-white fill-white' : 'text-white'}`}
            />
          </div>
          <span className="text-white text-xs font-medium">
            {isLiked ? 1 : 0}
          </span>
        </motion.button>

        {/* Views count */}
        <div className="flex flex-col items-center gap-1">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
            <Eye size={24} className="text-white" />
          </div>
          <span className="text-white text-xs font-medium">
            {viewCounts[currentItem?.id] || 0}
          </span>
        </div>

        {/* Share button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="flex flex-col items-center gap-1"
        >
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
            <Share2 size={22} className="text-white" />
          </div>
          <span className="text-white text-xs font-medium">Partager</span>
        </motion.button>
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-8 left-4 right-20 z-40">
        <h3 
          className="text-white font-bold text-xl mb-2"
          style={{ fontFamily: 'Sora, sans-serif' }}
        >
          {currentItem?.titre_projet || 'Photo anonyme'}
        </h3>
        
        {currentItem?.description && (
          <p className="text-white/80 text-sm mb-3 line-clamp-2">
            {currentItem.description}
          </p>
        )}
        
        <div className="flex items-center gap-2 text-white/60 text-xs">
          <Calendar size={12} />
          <span>{new Date(currentItem?.created_at).toLocaleDateString('fr-FR')}</span>
        </div>
      </div>

      {/* Scroll hint */}
      {currentIndex === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-white/60 text-xs flex flex-col items-center gap-1"
          >
            <span>Swipe up</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12l7-7 7 7" />
            </svg>
          </motion.div>
        </motion.div>
      )}

      {/* Navigation buttons (desktop testing) */}
      <div className="absolute bottom-1/2 left-4 right-4 z-40 flex justify-between pointer-events-none md:flex">
        <button
          onClick={() => currentIndex > 0 && setCurrentIndex(currentIndex - 1)}
          disabled={currentIndex === 0}
          className={`pointer-events-auto w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center transition-opacity ${
            currentIndex === 0 ? 'opacity-0' : 'opacity-50'
          }`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M18 15l-6-6-6 6" />
          </svg>
        </button>
        <button
          onClick={() => currentIndex < items.length - 1 && setCurrentIndex(currentIndex + 1)}
          disabled={currentIndex === items.length - 1}
          className={`pointer-events-auto w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center transition-opacity ${
            currentIndex === items.length - 1 ? 'opacity-0' : 'opacity-50'
          }`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Galerie;
