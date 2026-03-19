import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/layout/AdminLayout";
import { toast } from "sonner";
import { Plus, Trash2, Save, Search, Filter, Download, Users, Trophy, Award } from "lucide-react";
import { motion } from "framer-motion";

const GestionEquipes = () => {
  const queryClient = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<'toutes' | 'selectionnees' | 'en_attente'>('toutes');
  const [form, setForm] = useState({ 
    nom_equipe: '', 
    nom_projet: '', 
    description: '', 
    logo_url: '', 
    selectionnee: false as boolean
  });

  const { data: equipes, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-equipes"],
    queryFn: async () => {
      const { data, error } = await supabase.from("equipes").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const filteredEquipes = equipes?.filter((equipe) => {
    const matchesSearch = equipe.nom_equipe?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipe.nom_projet?.toLowerCase().includes(searchTerm.toLowerCase());
    
    switch (filterType) {
      case 'selectionnees':
        return matchesSearch && equipe.selectionnee;
      case 'en_attente':
        return matchesSearch && !equipe.selectionnee;
      default:
        return matchesSearch;
    }
  }) || [];

  const stats = {
    total: equipes?.length || 0,
    selectionnees: equipes?.filter((e) => e.selectionnee).length || 0,
    en_attente: equipes?.filter((e) => !e.selectionnee).length || 0,
  };

  const addEquipe = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("equipes").insert({ ...form });
      if (error) throw error;
    },
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: ["admin-equipes"] }); 
      setShowAdd(false); 
      setForm({ nom_equipe: '', nom_projet: '', description: '', logo_url: '', selectionnee: false }); 
      toast.success("Équipe ajoutée avec succès"); 
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  const deleteEquipe = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("equipes").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: ["admin-equipes"] }); 
      toast.success("Équipe supprimée avec succès"); 
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  const toggleSelection = useMutation({
    mutationFn: async ({ id, selectionnee }: { id: string; selectionnee: boolean }) => {
      const { error } = await supabase.from("equipes").update({ selectionnee }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: ["admin-equipes"] }); 
      toast.success("Statut mis à jour"); 
    },
  });

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full border-4 border-[#1E3A5F] border-t-transparent animate-spin"></div>
            <p className="text-[#6C757D]">Chargement des équipes...</p>
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
                  Gestion des Équipes
                </h1>
                <p 
                  className="text-[#6C757D] mt-2"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  Administration des équipes participantes au Hackathon ISOC-ESMT 2026
                </p>
              </motion.div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setShowAdd(!showAdd)}
                  className="px-4 py-2 rounded-lg bg-[#1E3A5F] text-white hover:bg-[#2C5282] transition-colors"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  <Plus size={16} className="mr-2" />
                  Ajouter une Équipe
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-lg bg-white text-[#6C757D] border border-[#E9ECEF] hover:bg-[#F8F9FA] transition-colors"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="relative overflow-hidden rounded-2xl border border-[#E9ECEF] bg-white p-6 hover:border-[#FF6B35]/50 hover:shadow-xl hover:shadow-[#FF6B35]/10 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#FBBF24]/5 opacity-0"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#1E3A5F]/10 to-[#FF6B35]/10 flex items-center justify-center">
                        <Users size={24} className="text-[#1E3A5F]" />
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
                          Total des équipes
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
                className="relative overflow-hidden rounded-2xl border border-[#E9ECEF] bg-white p-6 hover:border-[#1E3A5F]/50 hover:shadow-xl hover:shadow-[#1E3A5F]/10 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#1E3A5F]/5 opacity-0"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#FF6B35]/10 to-[#FF6B35]/10 flex items-center justify-center">
                        <Trophy size={24} className="text-[#FF6B35]" />
                      </div>
                      <div>
                        <p 
                          className="text-2xl font-bold text-[#212529]"
                          style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700 }}
                        >
                          {stats.selectionnees}
                        </p>
                        <p 
                          className="text-xs text-[#6C757D] mt-1"
                          style={{ fontFamily: 'DM Sans, sans-serif' }}
                        >
                          Équipes sélectionnées
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
                className="relative overflow-hidden rounded-2xl border border-[#2D3748] bg-[#111827] p-6 hover:border-[#F59E0B]/50 hover:shadow-xl hover:shadow-[#F59E0B]/10 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#F59E0B]/5 opacity-0"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#1E3A5F]/10 to-[#1E3A5F]/10 flex items-center justify-center">
                        <Award size={24} className="text-[#1E3A5F]" />
                      </div>
                      <div>
                        <p 
                          className="text-2xl font-bold text-[#212529]"
                          style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700 }}
                        >
                          {stats.en_attente}
                        </p>
                        <p 
                          className="text-xs text-[#6C757D] mt-1"
                          style={{ fontFamily: 'DM Sans, sans-serif' }}
                        >
                          En attente
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
            <div className="rounded-2xl border border-[#2D3748] bg-[#111827] p-6">
              <h2 
                className="font-display text-xl font-bold text-[#F9FAFB] mb-6"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                Ajouter une Équipe
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#9CA3AF] mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>Nom de l'équipe</label>
                    <input 
                      placeholder="Nom de l'équipe" 
                      value={form.nom_equipe} 
                      onChange={(e) => setForm({ ...form, nom_equipe: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-[#2D3748] bg-[#1F2937] text-[#F9FAFB] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#FBBF24] focus:border-transparent transition-all duration-300"
                      style={{ fontFamily: 'DM Sans, sans-serif' }}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#9CA3AF] mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>Nom du projet</label>
                    <input 
                      placeholder="Nom du projet" 
                      value={form.nom_projet} 
                      onChange={(e) => setForm({ ...form, nom_projet: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-[#2D3748] bg-[#1F2937] text-[#F9FAFB] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#FBBF24] focus:border-transparent transition-all duration-300"
                      style={{ fontFamily: 'DM Sans, sans-serif' }}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#9CA3AF] mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>Description</label>
                    <textarea 
                      placeholder="Description du projet..." 
                      value={form.description} 
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 rounded-xl border border-[#2D3748] bg-[#1F2937] text-[#F9FAFB] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#FBBF24] focus:border-transparent transition-all duration-300"
                      style={{ fontFamily: 'DM Sans, sans-serif' }}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#9CA3AF] mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>URL Logo</label>
                    <input 
                      placeholder="URL du logo" 
                      value={form.logo_url} 
                      onChange={(e) => setForm({ ...form, logo_url: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-[#2D3748] bg-[#1F2937] text-[#F9FAFB] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#FBBF24] focus:border-transparent transition-all duration-300"
                      style={{ fontFamily: 'DM Sans, sans-serif' }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowAdd(false)}
                  className="px-6 py-2 rounded-xl border border-[#2D3748] text-[#9CA3AF] hover:bg-[#2D3748] transition-colors"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  Annuler
                </button>
                <button
                  onClick={() => addEquipe.mutate()}
                  className="px-6 py-2 rounded-xl bg-[#00873E] text-[#F9FAFB] hover:bg-[#006450] transition-colors flex items-center gap-2"
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
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <Search size={20} className="text-[#9CA3AF]" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Rechercher une équipe..."
                    className="flex-1 px-4 py-2 rounded-xl border border-[#2D3748] bg-[#111827] text-[#F9FAFB] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#FBBF24] focus:border-transparent transition-all duration-300"
                    style={{ fontFamily: 'DM Sans, sans-serif' }}
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterType('toutes')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    filterType === 'toutes' ? 'bg-[#00873E] text-[#F9FAFB]' : 'bg-[#1F2937] text-[#9CA3AF] hover:bg-[#2D3748]'
                  }`}
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  Toutes
                </button>
                <button
                  onClick={() => setFilterType('selectionnees')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    filterType === 'selectionnees' ? 'bg-[#10B981] text-[#F9FAFB]' : 'bg-[#1F2937] text-[#9CA3AF] hover:bg-[#2D3748]'
                  }`}
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  Sélectionnées
                </button>
                <button
                  onClick={() => setFilterType('en_attente')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    filterType === 'en_attente' ? 'bg-[#F59E0B] text-[#F9FAFB]' : 'bg-[#1F2937] text-[#9CA3AF] hover:bg-[#2D3748]'
                  }`}
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  En attente
                </button>
              </div>
              
              <div className="flex items-center gap-2">
                <Filter size={20} className="text-[#9CA3AF]" />
                <span className="text-sm text-[#9CA3AF]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                  {filteredEquipes.length} résultat{filteredEquipes.length > 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Teams Grid */}
        <div className="container pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEquipes.map((equipe) => (
              <motion.div
                key={equipe.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative overflow-hidden rounded-2xl border border-[#2D3748] bg-[#111827] hover:border-[#FBBF24]/50 hover:shadow-xl hover:shadow-[#FBBF24]/10 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#FBBF24]/5 opacity-0"></div>
                
                <div className="relative z-10 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {equipe.logo_url ? (
                        <img 
                          src={equipe.logo_url} 
                          alt={equipe.nom_equipe}
                          className="w-12 h-12 rounded-full object-cover border-2 border-[#2D3748]"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#00873E] to-[#FBBF24] flex items-center justify-center">
                          <span className="text-white font-bold text-lg">
                            {equipe.nom_equipe?.charAt(0)?.toUpperCase() || 'E'}
                          </span>
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 
                          className="font-bold text-[#F9FAFB]"
                          style={{ fontFamily: 'Sora, sans-serif' }}
                        >
                          {equipe.nom_equipe}
                        </h3>
                        <p 
                          className="text-sm text-[#9CA3AF]"
                          style={{ fontFamily: 'DM Sans, sans-serif' }}
                        >
                          {equipe.nom_projet}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleSelection.mutate({ id: equipe.id, selectionnee: !equipe.selectionnee })}
                        className={`p-2 rounded-lg transition-colors ${
                          equipe.selectionnee 
                            ? 'bg-[#10B981] text-[#F9FAFB] hover:bg-[#059669]' 
                            : 'bg-[#F59E0B] text-[#F9FAFB] hover:bg-[#D97706]'
                        }`}
                        style={{ fontFamily: 'DM Sans, sans-serif' }}
                        title={equipe.selectionnee ? 'Désélectionner' : 'Sélectionner'}
                      >
                        <Trophy size={16} />
                      </button>
                      
                      <button
                        onClick={() => deleteEquipe.mutate(equipe.id)}
                        className="p-2 rounded-lg bg-[#DC2626] text-[#F9FAFB] hover:bg-[#B91C1C] transition-colors"
                        style={{ fontFamily: 'DM Sans, sans-serif' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                      equipe.selectionnee ? 'bg-[#10B981]/20 text-[#10B981]' : 'bg-[#F59E0B]/20 text-[#F59E0B]'
                    }`}>
                      {equipe.selectionnee ? '🏆 Sélectionnée' : '⏳ En attente'}
                    </span>
                    
                    {equipe.description && (
                      <p className="text-xs text-[#9CA3AF] line-clamp-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                        📝 {equipe.description}
                      </p>
                    )}
                    
                    <p className="text-xs text-[#9CA3AF]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                      📅 {new Date(equipe.created_at).toLocaleDateString('fr-FR')}
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

export default GestionEquipes;
