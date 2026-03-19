import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/layout/AdminLayout";
import { toast } from "sonner";
import { Plus, Trash2, Save, Search, Filter, Download, Building2, Award, Globe } from "lucide-react";
import { motion } from "framer-motion";

const GestionPartenaires = () => {
  const queryClient = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<'tous' | 'platine' | 'or' | 'argent'>('tous');
  const [form, setForm] = useState({ 
    nom: '', 
    type: 'platine' as string,
    logo_url: '', 
    site_web: '', 
    description: '',
    contact_email: '',
    niveau: 'platine'
  });

  const { data: partenaires, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-partenaires"],
    queryFn: async () => {
      const { data, error } = await supabase.from("partenaires").select("*").order("niveau", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const filteredPartenaires = partenaires?.filter((partenaire) => {
    const matchesSearch = partenaire.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partenaire.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    switch (filterType) {
      case 'platine':
        return matchesSearch && partenaire.niveau === 'platine';
      case 'or':
        return matchesSearch && partenaire.niveau === 'or';
      case 'argent':
        return matchesSearch && partenaire.niveau === 'argent';
      default:
        return matchesSearch;
    }
  }) || [];

  const stats = {
    total: partenaires?.length || 0,
    platine: partenaires?.filter((p) => p.niveau === 'platine').length || 0,
    or: partenaires?.filter((p) => p.niveau === 'or').length || 0,
    argent: partenaires?.filter((p) => p.niveau === 'argent').length || 0,
  };

  const addPartenaire = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("partenaires").insert({ ...form, niveau: form.type });
      if (error) throw error;
    },
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: ["admin-partenaires"] }); 
      setShowAdd(false); 
      setForm({ nom: '', type: 'platine', logo_url: '', site_web: '', description: '', contact_email: '', niveau: 'platine' }); 
      toast.success("Partenaire ajouté avec succès"); 
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  const deletePartenaire = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("partenaires").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: ["admin-partenaires"] }); 
      toast.success("Partenaire supprimé avec succès"); 
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
            <p className="text-[#9CA3AF]">Chargement des partenaires...</p>
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
                  Gestion des Partenaires
                </h1>
                <p 
                  className="text-[#9CA3AF] mt-2"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  Administration des partenaires du Hackathon ISOC-ESMT 2026
                </p>
              </motion.div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setShowAdd(!showAdd)}
                  className="px-4 py-2 rounded-lg bg-[#00873E] text-[#F9FAFB] hover:bg-[#006450] transition-colors"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  <Plus size={16} className="mr-2" />
                  Ajouter un Partenaire
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                        <Building2 size={24} className="text-[#F9FAFB]" />
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
                          Total partenaires
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
                className="relative overflow-hidden rounded-2xl border border-[#2D3748] bg-[#111827] p-6 hover:border-[#9CA3AF]/50 hover:shadow-xl hover:shadow-[#9CA3AF]/10 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#9CA3AF]/5 opacity-0"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#9CA3AF]/20 to-[#9CA3AF]/20 flex items-center justify-center">
                        <Award size={24} className="text-[#F9FAFB]" />
                      </div>
                      <div>
                        <p 
                          className="text-2xl font-bold text-[#F9FAFB]"
                          style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700 }}
                        >
                          {stats.platine}
                        </p>
                        <p 
                          className="text-xs text-[#9CA3AF] mt-1"
                          style={{ fontFamily: 'DM Sans, sans-serif' }}
                        >
                          Partenaires Platine
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
                className="relative overflow-hidden rounded-2xl border border-[#2D3748] bg-[#111827] p-6 hover:border-[#FBBF24]/50 hover:shadow-xl hover:shadow-[#FBBF24]/10 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#FBBF24]/5 opacity-0"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#FBBF24]/20 to-[#FBBF24]/20 flex items-center justify-center">
                        <Award size={24} className="text-[#F9FAFB]" />
                      </div>
                      <div>
                        <p 
                          className="text-2xl font-bold text-[#F9FAFB]"
                          style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700 }}
                        >
                          {stats.or}
                        </p>
                        <p 
                          className="text-xs text-[#9CA3AF] mt-1"
                          style={{ fontFamily: 'DM Sans, sans-serif' }}
                        >
                          Partenaires Or
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
                className="relative overflow-hidden rounded-2xl border border-[#2D3748] bg-[#111827] p-6 hover:border-[#D4AF37]/50 hover:shadow-xl hover:shadow-[#D4AF37]/10 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#D4AF37]/5 opacity-0"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#D4AF37]/20 to-[#D4AF37]/20 flex items-center justify-center">
                        <Award size={24} className="text-[#F9FAFB]" />
                      </div>
                      <div>
                        <p 
                          className="text-2xl font-bold text-[#F9FAFB]"
                          style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700 }}
                        >
                          {stats.argent}
                        </p>
                        <p 
                          className="text-xs text-[#9CA3AF] mt-1"
                          style={{ fontFamily: 'DM Sans, sans-serif' }}
                        >
                          Partenaires Argent
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
                Ajouter un Partenaire
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#9CA3AF] mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>Nom du partenaire</label>
                    <input 
                      placeholder="Nom du partenaire" 
                      value={form.nom} 
                      onChange={(e) => setForm({ ...form, nom: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-[#2D3748] bg-[#1F2937] text-[#F9FAFB] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#FBBF24] focus:border-transparent transition-all duration-300"
                      style={{ fontFamily: 'DM Sans, sans-serif' }}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#9CA3AF] mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>Niveau de partenariat</label>
                    <select 
                      value={form.type} 
                      onChange={(e) => setForm({ ...form, type: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-[#2D3748] bg-[#1F2937] text-[#F9FAFB] focus:outline-none focus:ring-2 focus:ring-[#FBBF24] focus:border-transparent transition-all duration-300"
                      style={{ fontFamily: 'DM Sans, sans-serif' }}
                    >
                      <option value="platine">Partenaire Platine</option>
                      <option value="or">Partenaire Or</option>
                      <option value="argent">Partenaire Argent</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#9CA3AF] mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>Email de contact</label>
                    <input 
                      type="email"
                      placeholder="Email de contact" 
                      value={form.contact_email} 
                      onChange={(e) => setForm({ ...form, contact_email: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-[#2D3748] bg-[#1F2937] text-[#F9FAFB] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#FBBF24] focus:border-transparent transition-all duration-300"
                      style={{ fontFamily: 'DM Sans, sans-serif' }}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#9CA3AF] mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>Site web</label>
                    <input 
                      placeholder="Site web" 
                      value={form.site_web} 
                      onChange={(e) => setForm({ ...form, site_web: e.target.value })}
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
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-[#9CA3AF] mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>Description</label>
                <textarea 
                  placeholder="Description du partenariat..." 
                  value={form.description} 
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
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
                  onClick={() => addPartenaire.mutate()}
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
                    placeholder="Rechercher un partenaire..."
                    className="flex-1 px-4 py-2 rounded-xl border border-[#2D3748] bg-[#111827] text-[#F9FAFB] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#FBBF24] focus:border-transparent transition-all duration-300"
                    style={{ fontFamily: 'DM Sans, sans-serif' }}
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterType('tous')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    filterType === 'tous' ? 'bg-[#00873E] text-[#F9FAFB]' : 'bg-[#1F2937] text-[#9CA3AF] hover:bg-[#2D3748]'
                  }`}
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  Tous
                </button>
                <button
                  onClick={() => setFilterType('platine')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    filterType === 'platine' ? 'bg-[#9CA3AF] text-[#F9FAFB]' : 'bg-[#1F2937] text-[#9CA3AF] hover:bg-[#2D3748]'
                  }`}
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  Platine
                </button>
                <button
                  onClick={() => setFilterType('or')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    filterType === 'or' ? 'bg-[#FBBF24] text-[#0A0A0A]' : 'bg-[#1F2937] text-[#9CA3AF] hover:bg-[#2D3748]'
                  }`}
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  Or
                </button>
                <button
                  onClick={() => setFilterType('argent')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    filterType === 'argent' ? 'bg-[#D4AF37] text-[#0A0A0A]' : 'bg-[#1F2937] text-[#9CA3AF] hover:bg-[#2D3748]'
                  }`}
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  Argent
                </button>
              </div>
              
              <div className="flex items-center gap-2">
                <Filter size={20} className="text-[#9CA3AF]" />
                <span className="text-sm text-[#9CA3AF]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                  {filteredPartenaires.length} résultat{filteredPartenaires.length > 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Partners Grid */}
        <div className="container pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPartenaires.map((partenaire) => (
              <motion.div
                key={partenaire.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative overflow-hidden rounded-2xl border border-[#2D3748] bg-[#111827] hover:border-[#FBBF24]/50 hover:shadow-xl hover:shadow-[#FBBF24]/10 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#FBBF24]/5 opacity-0"></div>
                
                <div className="relative z-10 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {partenaire.logo_url ? (
                        <img 
                          src={partenaire.logo_url} 
                          alt={partenaire.nom}
                          className="w-12 h-12 rounded-lg object-cover border-2 border-[#2D3748]"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-[#00873E] to-[#FBBF24] flex items-center justify-center">
                          <Building2 size={20} className="text-white" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 
                          className="font-bold text-[#F9FAFB]"
                          style={{ fontFamily: 'Sora, sans-serif' }}
                        >
                          {partenaire.nom}
                        </h3>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${
                          partenaire.niveau === 'platine' ? 'bg-[#9CA3AF]/20 text-[#9CA3AF]' : 
                          partenaire.niveau === 'or' ? 'bg-[#FBBF24]/20 text-[#FBBF24]' : 
                          'bg-[#D4AF37]/20 text-[#D4AF37]'
                        }`}>
                          {partenaire.niveau === 'platine' ? '🥉 Platine' : 
                           partenaire.niveau === 'or' ? '🥇 Or' : 
                           '🥈 Argent'}
                        </span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => deletePartenaire.mutate(partenaire.id)}
                      className="p-2 rounded-lg bg-[#DC2626] text-[#F9FAFB] hover:bg-[#B91C1C] transition-colors"
                      style={{ fontFamily: 'DM Sans, sans-serif' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {partenaire.description && (
                      <p className="text-xs text-[#9CA3AF] line-clamp-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                        📝 {partenaire.description}
                      </p>
                    )}
                    
                    <div className="flex gap-2 pt-2">
                      {partenaire.site_web && (
                        <a 
                          href={partenaire.site_web}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-[#00873E] hover:text-[#FBBF24] transition-colors flex items-center gap-1"
                          style={{ fontFamily: 'DM Sans, sans-serif' }}
                        >
                          <Globe size={12} />
                          Site
                        </a>
                      )}
                      
                      {partenaire.contact_email && (
                        <a 
                          href={`mailto:${partenaire.contact_email}`}
                          className="text-xs text-[#00873E] hover:text-[#FBBF24] transition-colors"
                          style={{ fontFamily: 'DM Sans, sans-serif' }}
                        >
                          ✉️ Email
                        </a>
                      )}
                    </div>
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

export default GestionPartenaires;
