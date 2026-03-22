import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/layout/AdminLayout";
import ImageUpload from "@/components/ui/ImageUpload";
import { toast } from "sonner";
import { Plus, Trash2, Save, Search, Filter, Download, Image, Calendar, Eye, Tag, Clock, Users, Award, Star, Building, Trophy } from "lucide-react";
import { motion } from "framer-motion";

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

const GestionGalerie = () => {
  const queryClient = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAnnee, setSelectedAnnee] = useState<number>(2026);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [form, setForm] = useState({ 
    titre_projet: '',     photo_url: '',     description: '',
    equipe_id: null,     categorie: 'general', // Ancien champ (à supprimer après migration)
    annee: 2026, // Nouveau champ année
    type_categorie: 'general' // Nouveau champ type_categorie
  });

  // Fermer le dropdown quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-dropdown]')) {
        setOpenDropdown(null);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const { data: galerie, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-galerie", selectedAnnee],
    queryFn: async () => {
      let query = supabase.from("galerie").select("*");
      
      // Filtre par année si sélectionnée
      if (selectedAnnee) {
        query = query.eq('annee', selectedAnnee);
      }
      
      // Ordre par date de création
      query = query.order("created_at", { ascending: false });
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const filteredGalerie = galerie?.filter((item) => {
    const matchesSearch = item.titre_projet?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  }) || [];

  // Statistiques par type de catégorie
  const stats = {
    total: galerie?.length || 0,
    team_isoc_esmt: galerie?.filter(item => item.type_categorie === 'team_isoc_esmt').length || 0,
    mentors: galerie?.filter(item => item.type_categorie === 'mentors').length || 0,
    jury: galerie?.filter(item => item.type_categorie === 'jury').length || 0,
    equipes: galerie?.filter(item => item.type_categorie === 'equipes').length || 0,
    partenaires: galerie?.filter(item => item.type_categorie === 'partenaires').length || 0,
    general: galerie?.filter(item => item.type_categorie === 'general').length || 0,
  };

  const addGalerie = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("galerie").insert({ ...form });
      if (error) throw error;
    },
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: ["admin-galerie", selectedAnnee] }); 
      queryClient.invalidateQueries({ queryKey: ["galerie"] }); // Synchronisation page publique
      setShowAdd(false); 
      setEditingItem(null);
      setForm({ titre_projet: '', photo_url: '', description: '', equipe_id: null, categorie: 'general', annee: 2026, type_categorie: 'general' }); // ✅ UUID null // ✅ Champs corrigés // ✅ Nouveaux champs 
      toast.success("Élément ajouté à la galerie avec succès"); 
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  const updateTypeCategorie = useMutation({
    mutationFn: async ({ id, type_categorie }: { id: string; type_categorie: string }) => {
      const { error } = await supabase.from("galerie").update({ type_categorie }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: ["admin-galerie", selectedAnnee] }); 
      queryClient.invalidateQueries({ queryKey: ["galerie"] }); // Synchronisation page publique
      toast.success("Catégorie mise à jour avec succès"); 
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  const updateGalerie = useMutation({
    mutationFn: async ({ id, titre_projet, description }: { id: string; titre_projet: string; description: string }) => {
      const { error } = await supabase.from("galerie").update({ titre_projet, description }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: ["admin-galerie", selectedAnnee] }); 
      queryClient.invalidateQueries({ queryKey: ["galerie"] }); // Synchronisation page publique
      setEditingItem(null);
      toast.success("Élément modifié avec succès"); 
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  const deleteGalerie = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("galerie").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: ["admin-galerie"] }); 
      queryClient.invalidateQueries({ queryKey: ["galerie"] }); // Synchronisation page publique
      toast.success("Élément supprimé de la galerie avec succès"); 
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full border-4 border-[#24366E] border-t-transparent animate-spin"></div>
            <p className="text-[#6C757D]">Chargement de la galerie...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-[#DC2626] text-lg font-bold mb-4">Erreur de chargement</p>
            <p className="text-[#6C757D]">{error.message}</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] to-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#24366E]/10 to-[#FEEB09]/10 backdrop-blur-sm border-b border-[#E9ECEF]/20">
          <div className="container py-6">
            <div className="flex items-center justify-between">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 
                  className="font-display text-3xl font-bold text-[#212529]"
                  style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800 }}
                >
                  Gestion de la Galerie
                </h1>
                <p 
                  className="text-[#6C757D] mt-2"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  Administration du Wall of Fame du Hackathon ISOC-ESMT 2026
                </p>
              </motion.div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setShowAdd(!showAdd)}
                  className="px-4 py-2 rounded-lg bg-[#24366E] text-white hover:bg-[#006450] transition-colors"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  <Plus size={16} className="mr-2" />
                  Ajouter un média
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-lg bg-[bg-white] text-[#6C757D] hover:bg-[#E9ECEF] transition-colors"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  <Download size={16} className="mr-2" />
                  Imprimer
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="container py-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="relative overflow-hidden rounded-2xl border border-[#E9ECEF] bg-[white] p-6 hover:border-[#FEEB09]/50 hover:shadow-xl hover:shadow-[#FEEB09]/10 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#FEEB09]/5 opacity-0"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#24366E]/20 to-[#FEEB09]/20 flex items-center justify-center">
                        <Image size={24} className="text-[#212529]" />
                      </div>
                      <div>
                        <p 
                          className="text-2xl font-bold text-[#212529]"
                          style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700 }}
                        >
                          {stats.total}
                        </p>
                        <p 
                          className="text-xs text-[#6C757D] mt-1"
                          style={{ fontFamily: 'DM Sans, sans-serif' }}
                        >
                          Total médias
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative overflow-hidden rounded-2xl border border-[#E9ECEF] bg-[white] p-6 hover:border-[#10B981]/50 hover:shadow-xl hover:shadow-[#10B981]/10 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#10B981]/5 opacity-0"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#10B981]/20 to-[#10B981]/20 flex items-center justify-center">
                        <Image size={24} className="text-[#212529]" />
                      </div>
                      <div>
                        <p 
                          className="text-2xl font-bold text-[#212529]"
                          style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700 }}
                        >
                          {stats.total}
                        </p>
                        <p 
                          className="text-xs text-[#6C757D] mt-1"
                          style={{ fontFamily: 'DM Sans, sans-serif' }}
                        >
                          Photos
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="relative overflow-hidden rounded-2xl border border-[#E9ECEF] bg-[white] p-6 hover:border-[#F59E0B]/50 hover:shadow-xl hover:shadow-[#F59E0B]/10 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#F59E0B]/5 opacity-0"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#F59E0B]/20 to-[#F59E0B]/20 flex items-center justify-center">
                        <Image size={24} className="text-[#212529]" />
                      </div>
                      <div>
                        <p 
                          className="text-2xl font-bold text-[#212529]"
                          style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700 }}
                        >
                          {stats.team_isoc_esmt}
                        </p>
                        <p 
                          className="text-xs text-[#6C757D] mt-1"
                          style={{ fontFamily: 'DM Sans, sans-serif' }}
                        >
                          Vidéos
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="relative overflow-hidden rounded-2xl border border-[#E9ECEF] bg-[white] p-6 hover:border-[#D4AF37]/50 hover:shadow-xl hover:shadow-[#D4AF37]/10 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#D4AF37]/5 opacity-0"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#D4AF37]/20 to-[#D4AF37]/20 flex items-center justify-center">
                        <Image size={24} className="text-[#212529]" />
                      </div>
                      <div>
                        <p 
                          className="text-2xl font-bold text-[#212529]"
                          style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700 }}
                        >
                          {stats.team_isoc_esmt}
                        </p>
                        <p 
                          className="text-xs text-[#6C757D] mt-1"
                          style={{ fontFamily: 'DM Sans, sans-serif' }}
                        >
                          Équipes
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Add Form */}
        {showAdd && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="container py-6"
          >
            <div className="rounded-2xl border border-[#E9ECEF] bg-[white] p-6">
              <h2 
                className="font-display text-xl font-bold text-[#212529] mb-6"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                {editingItem ? 'Modifier un Média' : 'Ajouter un Média'}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#6C757D] mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>Titre du projet</label>
                    <input 
                      placeholder="Titre du projet" 
                      value={form.titre_projet}                       onChange={(e) => setForm({ ...form, titre_projet: e.target.value })}                       className="w-full px-4 py-2 rounded-xl border border-[#E9ECEF] bg-[bg-white] text-[#212529] placeholder-[#6C757D] focus:outline-none focus:ring-2 focus:ring-[#FEEB09] focus:border-transparent transition-all duration-300"
                      style={{ fontFamily: 'DM Sans, sans-serif' }}
                    />
                  </div>
                  
                                  </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#6C757D] mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>Média (image)</label>
                    <ImageUpload
                      value={form.photo_url}
                      onChange={(url) => setForm({ ...form, photo_url: url })}
                      placeholder="Uploader une image pour la galerie"
                      bucket="galerie"
                      folder="medias"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#6C757D] mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>Année</label>
                    <select 
                      value={form.annee}
                      onChange={(e) => setForm({ ...form, annee: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 rounded-xl border border-[#E9ECEF] bg-[white] text-[#212529] focus:outline-none focus:ring-2 focus:ring-[#FEEB09] focus:border-transparent transition-all duration-300"
                      style={{ fontFamily: 'DM Sans, sans-serif' }}
                    >
                      {ANNEES.map((annee) => (
                        <option key={annee.value} value={annee.value}>{annee.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#6C757D] mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>Type de catégorie</label>
                    <select 
                      value={form.type_categorie}
                      onChange={(e) => setForm({ ...form, type_categorie: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-[#E9ECEF] bg-[white] text-[#212529] focus:outline-none focus:ring-2 focus:ring-[#FEEB09] focus:border-transparent transition-all duration-300"
                      style={{ fontFamily: 'DM Sans, sans-serif' }}
                    >
                      {TYPE_CATEGORIES.map((cat) => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#6C757D] mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>ID Équipe (optionnel)</label>
                    <input 
                      placeholder="ID de l'équipe associée" 
                      value={form.equipe_id} 
                      onChange={(e) => setForm({ ...form, equipe_id: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-[#E9ECEF] bg-[bg-white] text-[#212529] placeholder-[#6C757D] focus:outline-none focus:ring-2 focus:ring-[#FEEB09] focus:border-transparent transition-all duration-300"
                      style={{ fontFamily: 'DM Sans, sans-serif' }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-[#6C757D] mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>Description</label>
                <textarea 
                  placeholder="Description du média..." 
                  value={form.description} 
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 rounded-xl border border-[#E9ECEF] bg-[bg-white] text-[#212529] placeholder-[#6C757D] focus:outline-none focus:ring-2 focus:ring-[#FEEB09] focus:border-transparent transition-all duration-300"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                />
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowAdd(false);
                    setEditingItem(null);
                    setForm({ 
                      titre_projet: '', 
                      photo_url: '', 
                      description: '', 
                      equipe_id: null, 
                      categorie: 'general', 
                      annee: 2026, 
                      type_categorie: 'general' 
                    });
                  }}
                  className="px-6 py-2 rounded-xl border border-[#E9ECEF] text-[#6C757D] hover:bg-[#E9ECEF] transition-colors"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  Annuler
                </button>
                <button
                  onClick={() => editingItem ? updateGalerie.mutate({ id: editingItem.id, titre_projet: form.titre_projet, description: form.description }) : addGalerie.mutate()}
                  className="px-6 py-2 rounded-xl bg-[#24366E] text-white hover:bg-[#006450] transition-colors flex items-center gap-2"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  <Save size={16} />
                  {editingItem ? 'Mettre à jour' : 'Enregistrer'}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Filters and Search */}
        <div className="container py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-center">
              {/* Search */}
              <div className="flex items-center gap-3 flex-1 max-w-md">
                <Search size={20} className="text-[#6C757D]" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Rechercher un média..."
                  className="flex-1 px-4 py-2 rounded-xl border border-[#E9ECEF] bg-[white] text-[#212529] placeholder-[#6C757D] focus:outline-none focus:ring-2 focus:ring-[#FEEB09] focus:border-transparent transition-all duration-300"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                />
              </div>

              {/* Year Filters */}
              <div className="flex flex-wrap gap-2 justify-center">
                <button
                  onClick={() => setSelectedAnnee(0)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    selectedAnnee === 0
                      ? 'bg-gradient-to-r from-[#FEEB09] to-[#24366E] text-white shadow-lg'
                      : 'bg-white text-[#6C757D] border border-[#E9ECEF] hover:border-[#FEEB09]/30 hover:text-[#212529]'
                  }`}
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  <Calendar size={16} />
                  Toutes
                </button>
                
                {ANNEES.map((annee) => (
                  <button
                    key={annee.value}
                    onClick={() => setSelectedAnnee(annee.value)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      selectedAnnee === annee.value
                        ? 'bg-gradient-to-r from-[#FEEB09] to-[#24366E] text-white shadow-lg'
                        : 'bg-white text-[#6C757D] border border-[#E9ECEF] hover:border-[#FEEB09]/30 hover:text-[#212529]'
                    }`}
                    style={{ fontFamily: 'DM Sans, sans-serif' }}
                  >
                    <Calendar size={16} />
                    {annee.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Gallery Grid */}
        <div className="container pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGalerie.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative overflow-hidden rounded-2xl border border-[#E9ECEF] bg-[white] hover:border-[#FEEB09]/50 hover:shadow-xl hover:shadow-[#FEEB09]/10 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#FEEB09]/5 opacity-0"></div>
                
                <div className="relative z-10">
                  <div className="aspect-video mb-4 rounded-lg overflow-hidden bg-[bg-white]">
                    {item.photo_url ? (                       <img 
                        src={item.photo_url}                         alt={item.titre_projet}                         className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Image size={48} className="text-[#6C757D]" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 
                        className="font-bold text-[#212529] text-sm"
                        style={{ fontFamily: 'Sora, sans-serif' }}
                      >
                        {item.titre_projet}                       </h3>
                      <span className="inline-block px-2 py-1 rounded-full text-xs font-bold" 
                            style={{ 
                              backgroundColor: TYPE_CATEGORIES.find(c => c.value === item.type_categorie)?.color + '20' || '#6C757D20',
                              color: TYPE_CATEGORIES.find(c => c.value === item.type_categorie)?.color || '#6C757D'
                            }}>
                        {TYPE_CATEGORIES.find(c => c.value === item.type_categorie)?.label || 'Général'}
                      </span>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => window.open(item.photo_url, '_blank')}                         className="p-2 rounded-lg bg-[#24366E] text-white hover:bg-[#006450] transition-colors"
                        style={{ fontFamily: 'DM Sans, sans-serif' }}
                        title="Voir en grand"
                      >
                        <Eye size={16} />
                      </button>
                      
                      <button
                        onClick={() => {
                          setEditingItem(item);
                          setForm({
                            titre_projet: item.titre_projet,
                            photo_url: item.photo_url,
                            description: item.description || '',
                            equipe_id: item.equipe_id,
                            categorie: item.categorie || 'general',
                            annee: item.annee || 2026,
                            type_categorie: item.type_categorie || 'general'
                          });
                          setShowAdd(true);
                        }}
                        className="p-2 rounded-lg bg-[#F59E0B] text-[#212529] hover:bg-[#F59E0B]/80 transition-colors"
                        style={{ fontFamily: 'DM Sans, sans-serif' }}
                        title="Modifier"
                      >
                        <Save size={16} />
                      </button>
                      
                      <button
                        onClick={() => deleteGalerie.mutate(item.id)}
                        className="p-2 rounded-lg bg-[#DC2626] text-[#212529] hover:bg-[#B91C1C] transition-colors"
                        style={{ fontFamily: 'DM Sans, sans-serif' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  {/* Bouton de classement élégant */}
                  <div className="mb-3">
                    <div className="relative" data-dropdown>
                      <button
                        onClick={() => setOpenDropdown(openDropdown === item.id ? null : item.id)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium bg-gradient-to-r from-[#FEEB09] to-[#24366E] text-white hover:from-[#FEEB09]/90 hover:to-[#24366E]/90 transition-all shadow-md"
                        style={{ fontFamily: 'DM Sans, sans-serif' }}
                      >
                        <Tag size={12} />
                        {TYPE_CATEGORIES.find(c => c.value === item.type_categorie)?.label || 'Classer'}
                        <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                      
                      {/* Menu déroulant */}
                      {openDropdown === item.id && (
                        <div className="absolute bottom-full left-0 mb-1 w-48 bg-white rounded-lg shadow-xl border border-[#E9ECEF] z-[9999] overflow-hidden">
                          <div className="py-1 max-h-64 overflow-y-auto">
                            {TYPE_CATEGORIES.map((categorie) => {
                              const isSelected = item.type_categorie === categorie.value;
                              const Icon = categorie.icon;
                              return (
                                <button
                                  key={categorie.value}
                                  onClick={() => {
                                    updateTypeCategorie.mutate({ id: item.id, type_categorie: categorie.value });
                                    setOpenDropdown(null);
                                  }}
                                  className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium transition-colors ${
                                    isSelected
                                      ? 'bg-[#FEEB09]/10 text-[#FEEB09]'
                                      : 'text-[#6C757D] hover:bg-[#F8F9FA] hover:text-[#212529]'
                                  }`}
                                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                                >
                                  <div 
                                    className="w-4 h-4 rounded flex items-center justify-center"
                                    style={{ backgroundColor: isSelected ? categorie.color : categorie.color + '20' }}
                                  >
                                    <Icon size={10} style={{ color: isSelected ? 'white' : categorie.color }} />
                                  </div>
                                  {categorie.label}
                                  {isSelected && (
                                    <svg className="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {item.description && (
                    <p className="text-xs text-[#6C757D] line-clamp-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                      📝 {item.description}
                    </p>
                  )}
                  
                  <p className="text-xs text-[#6C757D] mt-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                    📅 {new Date(item.created_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default GestionGalerie;
