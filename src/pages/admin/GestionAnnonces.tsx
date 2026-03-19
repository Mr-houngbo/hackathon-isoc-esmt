import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/layout/AdminLayout";
import { toast } from "sonner";
import { Plus, Trash2, Save, Search, Download, Megaphone, Calendar, Eye } from "lucide-react";
import { motion } from "framer-motion";

const GestionAnnonces = () => {
  const queryClient = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState({ 
    titre: '', 
    contenu: ''
    // ✅ Seuls les champs qui existent dans la BD sont conservés
  });

  const { data: annonces, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-annonces"],
    queryFn: async () => {
      const { data, error } = await supabase.from("annonces").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const filteredAnnonces = annonces?.filter((annonce) => {
    const matchesSearch = annonce.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      annonce.contenu?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  }) || [];

  const stats = {
    total: annonces?.length || 0,
  };

  const addAnnonce = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("annonces").insert({ ...form });
      if (error) throw error;
    },
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: ["admin-annonces"] }); 
      setShowAdd(false); 
      setForm({ titre: '', contenu: '' }); // ✅ Champs corrigés
      toast.success("Annonce ajoutée avec succès"); 
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  const deleteAnnonce = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("annonces").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-annonces"] });
      toast.success("Annonce supprimée avec succès");
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

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
                  Gestion des Annonces
                </h1>
                <p 
                  className="text-[#6C757D] mt-2"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  Administration des annonces pour le Hackathon ISOC-ESMT 2026
                </p>
              </motion.div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setShowAdd(!showAdd)}
                  className="px-4 py-2 rounded-lg bg-[#1E3A5F] text-white hover:bg-[#006450] transition-colors"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  <Plus size={16} className="mr-2" />
                  Ajouter une annonce
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
                        <Megaphone size={24} className="text-[#212529]" />
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
                          Total des annonces
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
                Ajouter une Annonce
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#6C757D] mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>Titre</label>
                  <input 
                    placeholder="Titre de l'annonce" 
                    value={form.titre} 
                    onChange={(e) => setForm({ ...form, titre: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-[#E9ECEF] bg-[bg-white] text-[#212529] placeholder-[#6C757D] focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent transition-all duration-300"
                    style={{ fontFamily: 'DM Sans, sans-serif' }}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#6C757D] mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>Contenu</label>
                  <textarea 
                    placeholder="Contenu de l'annonce..." 
                    value={form.contenu} 
                    onChange={(e) => setForm({ ...form, contenu: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 rounded-xl border border-[#E9ECEF] bg-[bg-white] text-[#212529] placeholder-[#6C757D] focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent transition-all duration-300"
                    style={{ fontFamily: 'DM Sans, sans-serif' }}
                  />
                </div>
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
                  onClick={() => addAnnonce.mutate()}
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
                  placeholder="Rechercher une annonce..."
                  className="flex-1 px-4 py-2 rounded-xl border border-[#E9ECEF] bg-[white] text-[#212529] placeholder-[#6C757D] focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent transition-all duration-300"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Annonces Grid */}
        <div className="container pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAnnonces.map((annonce) => (
              <motion.div
                key={annonce.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative overflow-hidden rounded-2xl border border-[#E9ECEF] bg-[white] hover:border-[#FF6B35]/50 hover:shadow-xl hover:shadow-[#FF6B35]/10 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#FF6B35]/5 opacity-0"></div>
                
                <div className="relative z-10 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 
                        className="font-bold text-[#212529] mb-2"
                        style={{ fontFamily: 'Sora, sans-serif' }}
                      >
                        {annonce.titre}
                      </h3>
                      
                      <div className="flex items-center gap-1 text-xs text-[#6C757D] mb-3">
                        <Calendar size={14} />
                        <span>{new Date(annonce.created_at).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => deleteAnnonce.mutate(annonce.id)}
                      className="p-2 rounded-lg bg-[#DC2626] text-[#212529] hover:bg-[#B91C1C] transition-colors"
                      style={{ fontFamily: 'DM Sans, sans-serif' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-[#6C757D] line-clamp-3" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                      {annonce.contenu}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default GestionAnnonces;
