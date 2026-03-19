import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/layout/AdminLayout";
import { toast } from "sonner";
import { Plus, Trash2, Save, Search, Filter, Download, Image, Calendar, Eye } from "lucide-react";
import { motion } from "framer-motion";

const GestionGalerie = () => {
  const queryClient = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState({ 
    titre_projet: '', // ✅ Champ corrigé
    photo_url: '', // ✅ Champ corrigé
    description: '',
    equipe_id: null // ✅ UUID null au lieu de chaîne vide
  });

  const { data: galerie, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-galerie"],
    queryFn: async () => {
      const { data, error } = await supabase.from("galerie").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const filteredGalerie = galerie?.filter((item) => {
    const matchesSearch = item.titre_projet?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtre simple par recherche, plus de filtre par type car le champ n'existe pas
    return matchesSearch;
  }) || [];

  const stats = {
    total: galerie?.length || 0,
    // Le champ 'type' n'existe pas, on compte juste le total
    equipes: 0,
    photos: galerie?.length || 0,
    videos: 0,
  };

  const addGalerie = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("galerie").insert({ ...form });
      if (error) throw error;
    },
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: ["admin-galerie"] }); 
      queryClient.invalidateQueries({ queryKey: ["galerie"] }); // Synchronisation page publique
      setShowAdd(false); 
      setForm({ titre_projet: '', photo_url: '', description: '', equipe_id: null }); // ✅ UUID null // ✅ Champs corrigés 
      toast.success("Élément ajouté à la galerie avec succès"); 
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
            <div className="w-12 h-12 rounded-full border-4 border-[#1E3A5F] border-t-transparent animate-spin"></div>
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
        <div className="bg-gradient-to-r from-[#1E3A5F]/10 to-[#FF6B35]/10 backdrop-blur-sm border-b border-[#E9ECEF]/20">
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
                  className="px-4 py-2 rounded-lg bg-[#1E3A5F] text-white hover:bg-[#006450] transition-colors"
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
                className="relative overflow-hidden rounded-2xl border border-[#E9ECEF] bg-[white] p-6 hover:border-[#FF6B35]/50 hover:shadow-xl hover:shadow-[#FF6B35]/10 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#FF6B35]/5 opacity-0"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#1E3A5F]/20 to-[#FF6B35]/20 flex items-center justify-center">
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
                          {stats.photos}
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
                          {stats.videos}
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
                          {stats.equipes}
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
                Ajouter un Média
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#6C757D] mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>Titre du projet</label>
                    <input 
                      placeholder="Titre du projet" 
                      value={form.titre_projet} // ✅ Champ corrigé
                      onChange={(e) => setForm({ ...form, titre_projet: e.target.value })} // ✅ Champ corrigé
                      className="w-full px-4 py-2 rounded-xl border border-[#E9ECEF] bg-[bg-white] text-[#212529] placeholder-[#6C757D] focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent transition-all duration-300"
                      style={{ fontFamily: 'DM Sans, sans-serif' }}
                    />
                  </div>
                  
                  // Champ 'type' supprimé car il n'existe pas dans la BD
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#6C757D] mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>URL du média</label>
                    <input 
                      placeholder="URL de l'image ou vidéo" 
                      value={form.photo_url} // ✅ Champ corrigé
                      onChange={(e) => setForm({ ...form, photo_url: e.target.value })} // ✅ Champ corrigé
                      className="w-full px-4 py-2 rounded-xl border border-[#E9ECEF] bg-[bg-white] text-[#212529] placeholder-[#6C757D] focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent transition-all duration-300"
                      style={{ fontFamily: 'DM Sans, sans-serif' }}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#6C757D] mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>ID Équipe (optionnel)</label>
                    <input 
                      placeholder="ID de l'équipe associée" 
                      value={form.equipe_id} 
                      onChange={(e) => setForm({ ...form, equipe_id: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-[#E9ECEF] bg-[bg-white] text-[#212529] placeholder-[#6C757D] focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent transition-all duration-300"
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
                  className="w-full px-4 py-2 rounded-xl border border-[#E9ECEF] bg-[bg-white] text-[#212529] placeholder-[#6C757D] focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent transition-all duration-300"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                />
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowAdd(false)}
                  className="px-6 py-2 rounded-xl border border-[#E9ECEF] text-[#6C757D] hover:bg-[#E9ECEF] transition-colors"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  Annuler
                </button>
                <button
                  onClick={() => addGalerie.mutate()}
                  className="px-6 py-2 rounded-xl bg-[#1E3A5F] text-white hover:bg-[#006450] transition-colors flex items-center gap-2"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  <Save size={16} />
                  Enregistrer
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
            <div className="flex justify-center">
              <div className="flex items-center gap-3 flex-1 max-w-md">
                <Search size={20} className="text-[#6C757D]" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Rechercher un média..."
                  className="flex-1 px-4 py-2 rounded-xl border border-[#E9ECEF] bg-[white] text-[#212529] placeholder-[#6C757D] focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent transition-all duration-300"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                />
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
                className="relative overflow-hidden rounded-2xl border border-[#E9ECEF] bg-[white] hover:border-[#FF6B35]/50 hover:shadow-xl hover:shadow-[#FF6B35]/10 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#FF6B35]/5 opacity-0"></div>
                
                <div className="relative z-10">
                  <div className="aspect-video mb-4 rounded-lg overflow-hidden bg-[bg-white]">
                    {item.photo_url ? ( // ✅ Champ corrigé
                      <img 
                        src={item.photo_url} // ✅ Champ corrigé
                        alt={item.titre_projet} // ✅ Champ corrigé
                        className="w-full h-full object-cover"
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
                        {item.titre_projet} // ✅ Champ corrigé
                      </h3>
                      <span className="inline-block px-2 py-1 rounded-full text-xs font-bold bg-[#10B981]/20 text-[#10B981]">
                        📷 Média
                      </span>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => window.open(item.photo_url, '_blank')} // ✅ Champ corrigé
                        className="p-2 rounded-lg bg-[#1E3A5F] text-white hover:bg-[#006450] transition-colors"
                        style={{ fontFamily: 'DM Sans, sans-serif' }}
                        title="Voir en grand"
                      >
                        <Eye size={16} />
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
