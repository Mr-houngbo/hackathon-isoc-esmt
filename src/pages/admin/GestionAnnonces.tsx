import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/layout/AdminLayout";
import { toast } from "sonner";
import { Plus, Trash2, Save, Search, Filter, Download, Megaphone, Calendar, Eye } from "lucide-react";
import { motion } from "framer-motion";

const GestionAnnonces = () => {
  const queryClient = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<'toutes' | 'actives' | 'archivees'>('toutes');
  const [form, setForm] = useState({ 
    titre: '', 
    contenu: '',
    date_debut: '',
    date_fin: '',
    type: 'info' as string,
    priorite: 'moyenne' as string
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
    
    switch (filterType) {
      case 'actives':
        return matchesSearch && new Date(annonce.date_fin) >= new Date();
      case 'archivees':
        return matchesSearch && new Date(annonce.date_fin) < new Date();
      default:
        return matchesSearch;
    }
  }) || [];

  const stats = {
    total: annonces?.length || 0,
    actives: annonces?.filter((a) => new Date(a.date_fin) >= new Date()).length || 0,
    archivees: annonces?.filter((a) => new Date(a.date_fin) < new Date()).length || 0,
  };

  const addAnnonce = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("annonces").insert({ ...form });
      if (error) throw error;
    },
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: ["admin-annonces"] }); 
      setShowAdd(false); 
      setForm({ titre: '', contenu: '', date_debut: '', date_fin: '', type: 'info', priorite: 'moyenne' }); 
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

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full border-4 border-[#00873E] border-t-transparent animate-spin"></div>
            <p className="text-[#9CA3AF]">Chargement des annonces...</p>
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
            <p className="text-[#9CA3AF]">{error.message}</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-[#0A0A0A]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#00873E]/10 to-[#FBBF24]/10 backdrop-blur-sm border-b border-[#2D3748]/20">
          <div className="container py-6">
            <div className="flex items-center justify-between">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 
                  className="font-display text-3xl font-bold text-[#F9FAFB]"
                  style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800 }}
                >
                  Gestion des Annonces
                </h1>
                <p 
                  className="text-[#9CA3AF] mt-2"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  Administration des annonces du Hackathon ISOC-ESMT 2026
                </p>
              </motion.div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setShowAdd(!showAdd)}
                  className="px-4 py-2 rounded-lg bg-[#00873E] text-[#F9FAFB] hover:bg-[#006450] transition-colors"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  <Plus size={16} className="mr-2" />
                  Ajouter une annonce
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-lg bg-[#1F2937] text-[#9CA3AF] hover:bg-[#2D3748] transition-colors"
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
                className="relative overflow-hidden rounded-2xl border border-[#2D3748] bg-[#111827] p-6 hover:border-[#FBBF24]/50 hover:shadow-xl hover:shadow-[#FBBF24]/10 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#FBBF24]/5 opacity-0"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#00873E]/20 to-[#FBBF24]/20 flex items-center justify-center">
                        <Megaphone size={24} className="text-[#F9FAFB]" />
                      </div>
                      <div>
                        <p 
                          className="text-2xl font-bold text-[#F9FAFB]"
                          style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700 }}
                        >
                          {stats.total}
                        </p>
                        <p 
                          className="text-xs text-[#9CA3AF] mt-1"
                          style={{ fontFamily: 'DM Sans, sans-serif' }}
                        >
                          Total annonces
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
                className="relative overflow-hidden rounded-2xl border border-[#2D3748] bg-[#111827] p-6 hover:border-[#10B981]/50 hover:shadow-xl hover:shadow-[#10B981]/10 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#10B981]/5 opacity-0"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#10B981]/20 to-[#10B981]/20 flex items-center justify-center">
                        <Megaphone size={24} className="text-[#F9FAFB]" />
                      </div>
                      <div>
                        <p 
                          className="text-2xl font-bold text-[#F9FAFB]"
                          style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700 }}
                        >
                          {stats.actives}
                        </p>
                        <p 
                          className="text-xs text-[#9CA3AF] mt-1"
                          style={{ fontFamily: 'DM Sans, sans-serif' }}
                        >
                          Annonces actives
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
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#F59E0B]/20 to-[#F59E0B]/20 flex items-center justify-center">
                        <Megaphone size={24} className="text-[#F9FAFB]" />
                      </div>
                      <div>
                        <p 
                          className="text-2xl font-bold text-[#F9FAFB]"
                          style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700 }}
                        >
                          {stats.archivees}
                        </p>
                        <p 
                          className="text-xs text-[#9CA3AF] mt-1"
                          style={{ fontFamily: 'DM Sans, sans-serif' }}
                        >
                          Annonces archivées
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
                Ajouter une Annonce
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#9CA3AF] mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>Titre de l'annonce</label>
                    <input 
                      placeholder="Titre de l'annonce" 
                      value={form.titre} 
                      onChange={(e) => setForm({ ...form, titre: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-[#2D3748] bg-[#1F2937] text-[#F9FAFB] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#FBBF24] focus:border-transparent transition-all duration-300"
                      style={{ fontFamily: 'DM Sans, sans-serif' }}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#9CA3AF] mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>Type d'annonce</label>
                    <select 
                      value={form.type} 
                      onChange={(e) => setForm({ ...form, type: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-[#2D3748] bg-[#1F2937] text-[#F9FAFB] focus:outline-none focus:ring-2 focus:ring-[#FBBF24] focus:border-transparent transition-all duration-300"
                      style={{ fontFamily: 'DM Sans, sans-serif' }}
                    >
                      <option value="info">Information</option>
                      <option value="urgent">Urgent</option>
                      <option value="rappel">Rappel</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#9CA3AF] mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>Priorité</label>
                    <select 
                      value={form.priorite} 
                      onChange={(e) => setForm({ ...form, priorite: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-[#2D3748] bg-[#1F2937] text-[#F9FAFB] focus:outline-none focus:ring-2 focus:ring-[#FBBF24] focus:border-transparent transition-all duration-300"
                      style={{ fontFamily: 'DM Sans, sans-serif' }}
                    >
                      <option value="basse">Basse</option>
                      <option value="moyenne">Moyenne</option>
                      <option value="haute">Haute</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#9CA3AF] mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>Date de début</label>
                    <input 
                      type="date"
                      value={form.date_debut} 
                      onChange={(e) => setForm({ ...form, date_debut: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-[#2D3748] bg-[#1F2937] text-[#F9FAFB] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#FBBF24] focus:border-transparent transition-all duration-300"
                      style={{ fontFamily: 'DM Sans, sans-serif' }}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#9CA3AF] mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>Date de fin</label>
                    <input 
                      type="date"
                      value={form.date_fin} 
                      onChange={(e) => setForm({ ...form, date_fin: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-[#2D3748] bg-[#1F2937] text-[#F9FAFB] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#FBBF24] focus:border-transparent transition-all duration-300"
                      style={{ fontFamily: 'DM Sans, sans-serif' }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-[#9CA3AF] mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>Contenu de l'annonce</label>
                <textarea 
                  placeholder="Contenu détaillé de l'annonce..." 
                  value={form.contenu} 
                  onChange={(e) => setForm({ ...form, contenu: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-2 rounded-xl border border-[#2D3748] bg-[#1F2937] text-[#F9FAFB] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#FBBF24] focus:border-transparent transition-all duration-300"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                />
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
                  onClick={() => addAnnonce.mutate()}
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
                    placeholder="Rechercher une annonce..."
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
                  onClick={() => setFilterType('actives')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    filterType === 'actives' ? 'bg-[#10B981] text-[#F9FAFB]' : 'bg-[#1F2937] text-[#9CA3AF] hover:bg-[#2D3748]'
                  }`}
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  Actives
                </button>
                <button
                  onClick={() => setFilterType('archivees')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    filterType === 'archivees' ? 'bg-[#F59E0B] text-[#F9FAFB]' : 'bg-[#1F2937] text-[#9CA3AF] hover:bg-[#2D3748]'
                  }`}
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  Archivées
                </button>
              </div>
              
              <div className="flex items-center gap-2">
                <Filter size={20} className="text-[#9CA3AF]" />
                <span className="text-sm text-[#9CA3AF]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                  {filteredAnnonces.length} résultat{filteredAnnonces.length > 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Announcements List */}
        <div className="container pb-8">
          <div className="space-y-6">
            {filteredAnnonces.map((annonce) => (
              <motion.div
                key={annonce.id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative overflow-hidden rounded-2xl border border-[#2D3748] bg-[#111827] hover:border-[#FBBF24]/50 hover:shadow-xl hover:shadow-[#FBBF24]/10 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#FBBF24]/5 opacity-0"></div>
                
                <div className="relative z-10 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                          annonce.type === 'urgent' ? 'bg-[#DC2626]/20 text-[#DC2626]' : 
                          annonce.type === 'rappel' ? 'bg-[#F59E0B]/20 text-[#F59E0B]' : 
                          'bg-[#10B981]/20 text-[#10B981]'
                        }`}>
                          {annonce.type === 'urgent' ? '🚨 Urgent' : 
                           annonce.type === 'rappel' ? '📢 Rappel' : 
                           'ℹ️ Information'}
                        </span>
                        
                        <h3 
                          className="font-bold text-[#F9FAFB]"
                          style={{ fontFamily: 'Sora, sans-serif' }}
                        >
                          {annonce.titre}
                        </h3>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-[#9CA3AF]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>Du {new Date(annonce.date_debut).toLocaleDateString('fr-FR')}</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>Au {new Date(annonce.date_fin).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => window.open(`/annonces/${annonce.id}`, '_blank')}
                        className="p-2 rounded-lg bg-[#00873E] text-[#F9FAFB] hover:bg-[#006450] transition-colors"
                        style={{ fontFamily: 'DM Sans, sans-serif' }}
                        title="Voir l'annonce"
                      >
                        <Eye size={16} />
                      </button>
                      
                      <button
                        onClick={() => deleteAnnonce.mutate(annonce.id)}
                        className="p-2 rounded-lg bg-[#DC2626] text-[#F9FAFB] hover:bg-[#B91C1C] transition-colors"
                        style={{ fontFamily: 'DM Sans, sans-serif' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-[#9CA3AF] line-clamp-3" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                      📝 {annonce.contenu}
                    </p>
                    
                    <p className="text-xs text-[#9CA3AF]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                      📅 Créée le {new Date(annonce.created_at).toLocaleDateString('fr-FR')}
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
