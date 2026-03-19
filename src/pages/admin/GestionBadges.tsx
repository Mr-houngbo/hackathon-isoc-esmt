import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/layout/AdminLayout";
import { toast } from "sonner";
import { Plus, Trash2, Save, Search, Filter, Download, Award, QrCode, Calendar, User } from "lucide-react";
import { motion } from "framer-motion";

const GestionBadges = () => {
  const queryClient = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<'tous' | 'envoyes' | 'non_envoyes'>('tous');
  const [form, setForm] = useState({ 
    membre_id: null, // ✅ UUID null au lieu de chaîne vide
    equipe_id: null, // ✅ UUID null au lieu de chaîne vide
    qr_code_url: '',
    envoye: false,
    date_envoi: null // ✅ Date null au lieu de chaîne vide
  });

  const { data: badges, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-badges"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("badges")
        .select(`
          *,
          membre:membres(nom_prenom, email, filiere),
          equipe:equipes(nom_equipe, nom_projet)
        `)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const filteredBadges = badges?.filter((badge) => {
    const matchesSearch = 
      badge.qr_code_url?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      badge.membre?.nom_prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      badge.equipe?.nom_equipe?.toLowerCase().includes(searchTerm.toLowerCase());
    
    switch (filterType) {
      case 'envoyes':
        return matchesSearch && badge.envoye;
      case 'non_envoyes':
        return matchesSearch && !badge.envoye;
      default:
        return matchesSearch;
    }
  }) || [];

  const stats = {
    total: badges?.length || 0,
    envoyes: badges?.filter((b) => b.envoye).length || 0,
    non_envoyes: badges?.filter((b) => !b.envoye).length || 0,
  };

  const addBadge = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("badges").insert({ 
        membre_id: form.membre_id || null,
        equipe_id: form.equipe_id || null,
        qr_code_url: form.qr_code_url || null,
        envoye: form.envoye,
        date_envoi: form.date_envoi || null
      });
      if (error) throw error;
    },
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: ["admin-badges"] }); 
      setShowAdd(false); 
      setForm({ membre_id: null, equipe_id: null, qr_code_url: '', envoye: false, date_envoi: null }); // ✅ UUID null 
      toast.success("Badge ajouté avec succès"); 
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  const deleteBadge = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("badges").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: ["admin-badges"] }); 
      toast.success("Badge supprimé avec succès"); 
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
            <p className="text-[#6C757D]">Chargement des badges...</p>
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
                  Gestion des Badges
                </h1>
                <p 
                  className="text-[#6C757D] mt-2"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  Administration des badges de participation du Hackathon ISOC-ESMT 2026
                </p>
              </motion.div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setShowAdd(!showAdd)}
                  className="px-4 py-2 rounded-lg bg-[#1E3A5F] text-white hover:bg-[#006450] transition-colors"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  <Plus size={16} className="mr-2" />
                  Ajouter un badge
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                        <Award size={24} className="text-[#212529]" />
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
                          Total badges
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
                        <QrCode size={24} className="text-[#212529]" />
                      </div>
                      <div>
                        <p 
                          className="text-2xl font-bold text-[#212529]"
                          style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700 }}
                        >
                          {stats.envoyes}
                        </p>
                        <p 
                          className="text-xs text-[#6C757D] mt-1"
                          style={{ fontFamily: 'DM Sans, sans-serif' }}
                        >
                          Badges envoyés
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
                        <Award size={24} className="text-[#212529]" />
                      </div>
                      <div>
                        <p 
                          className="text-2xl font-bold text-[#212529]"
                          style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700 }}
                        >
                          {stats.non_envoyes}
                        </p>
                        <p 
                          className="text-xs text-[#6C757D] mt-1"
                          style={{ fontFamily: 'DM Sans, sans-serif' }}
                        >
                          Badges non envoyés
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
                Ajouter un Badge
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#6C757D] mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>ID Membre (optionnel)</label>
                    <input 
                      placeholder="ID du membre" 
                      value={form.membre_id} 
                      onChange={(e) => setForm({ ...form, membre_id: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-[#E9ECEF] bg-[bg-white] text-[#212529] placeholder-[#6C757D] focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent transition-all duration-300"
                      style={{ fontFamily: 'DM Sans, sans-serif' }}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#6C757D] mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>ID Équipe (optionnel)</label>
                    <input 
                      placeholder="ID de l'équipe" 
                      value={form.equipe_id} 
                      onChange={(e) => setForm({ ...form, equipe_id: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-[#E9ECEF] bg-[bg-white] text-[#212529] placeholder-[#6C757D] focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent transition-all duration-300"
                      style={{ fontFamily: 'DM Sans, sans-serif' }}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#6C757D] mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>URL du QR Code</label>
                    <input 
                      placeholder="URL du QR Code" 
                      value={form.qr_code_url} 
                      onChange={(e) => setForm({ ...form, qr_code_url: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-[#E9ECEF] bg-[bg-white] text-[#212529] placeholder-[#6C757D] focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent transition-all duration-300"
                      style={{ fontFamily: 'DM Sans, sans-serif' }}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#6C757D] mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>Date d'envoi</label>
                    <input 
                      type="date"
                      value={form.date_envoi} 
                      onChange={(e) => setForm({ ...form, date_envoi: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-[#E9ECEF] bg-[bg-white] text-[#212529] placeholder-[#6C757D] focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent transition-all duration-300"
                      style={{ fontFamily: 'DM Sans, sans-serif' }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <label className="flex items-center gap-2 text-sm font-medium text-[#6C757D]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                  <input 
                    type="checkbox"
                    checked={form.envoye}
                    onChange={(e) => setForm({ ...form, envoye: e.target.checked })}
                    className="rounded border-[#E9ECEF] bg-[bg-white] text-[#212529] focus:ring-2 focus:ring-[#FF6B35]"
                  />
                  Marquer comme envoyé
                </label>
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
                  onClick={() => addBadge.mutate()}
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
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <Search size={20} className="text-[#6C757D]" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Rechercher un badge..."
                    className="flex-1 px-4 py-2 rounded-xl border border-[#E9ECEF] bg-[white] text-[#212529] placeholder-[#6C757D] focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent transition-all duration-300"
                    style={{ fontFamily: 'DM Sans, sans-serif' }}
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterType('tous')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    filterType === 'tous' ? 'bg-[#1E3A5F] text-white' : 'bg-[bg-white] text-[#6C757D] hover:bg-[#E9ECEF]'
                  }`}
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  Tous
                </button>
                <button
                  onClick={() => setFilterType('envoyes')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    filterType === 'envoyes' ? 'bg-[#10B981] text-[#212529]' : 'bg-[bg-white] text-[#6C757D] hover:bg-[#E9ECEF]'
                  }`}
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  Envoyés
                </button>
                <button
                  onClick={() => setFilterType('non_envoyes')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    filterType === 'non_envoyes' ? 'bg-[#F59E0B] text-[#212529]' : 'bg-[bg-white] text-[#6C757D] hover:bg-[#E9ECEF]'
                  }`}
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  Non envoyés
                </button>
              </div>
              
              <div className="flex items-center gap-2">
                <Filter size={20} className="text-[#6C757D]" />
                <span className="text-sm text-[#6C757D]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                  {filteredBadges.length} résultat{filteredBadges.length > 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Badges Grid */}
        <div className="container pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBadges.map((badge) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative overflow-hidden rounded-2xl border border-[#E9ECEF] bg-[white] hover:border-[#FF6B35]/50 hover:shadow-xl hover:shadow-[#FF6B35]/10 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#FF6B35]/5 opacity-0"></div>
                
                <div className="relative z-10 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {badge.qr_code_url ? (
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-[#FF6B35]/20">
                          <QrCode size={24} className="text-[#FF6B35]" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-[#D4AF37]/20">
                          <Award size={24} className="text-[#D4AF37]" />
                        </div>
                      )}
                      <div className="flex-1">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${
                          badge.envoye ? 'bg-[#10B981]/20 text-[#10B981]' : 'bg-[#F59E0B]/20 text-[#F59E0B]'
                        }`}>
                          {badge.envoye ? '✅ Envoyé' : '⏳ Non envoyé'}
                        </span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => deleteBadge.mutate(badge.id)}
                      className="p-2 rounded-lg bg-[#DC2626] text-[#212529] hover:bg-[#B91C1C] transition-colors"
                      style={{ fontFamily: 'DM Sans, sans-serif' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {badge.membre && (
                      <div className="flex items-center gap-2">
                        <User size={14} className="text-[#FF6B35]" />
                        <span className="text-sm text-[#212529]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                          {badge.membre.nom_prenom}
                        </span>
                      </div>
                    )}
                    
                    {badge.equipe && (
                      <p className="text-sm text-[#212529]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                        🏆 {badge.equipe.nom_equipe}
                      </p>
                    )}
                    
                    {badge.date_envoi && (
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-[#FF6B35]" />
                        <span className="text-xs text-[#6C757D]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                          Envoyé le {new Date(badge.date_envoi).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    )}
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

export default GestionBadges;
