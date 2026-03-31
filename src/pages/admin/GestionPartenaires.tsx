import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/layout/AdminLayout";
import ImageUpload from "@/components/ui/ImageUpload";
import { toast } from "sonner";
import { Plus, Trash2, Save, Search, Filter, Download, Building2, Award, Globe } from "lucide-react";
import { motion } from "framer-motion";

// Fonction pour valider et normaliser les URLs
const normalizeUrl = (url: string) => {
  if (!url) return '';
  
  // Supprimer les espaces et les caractères indésirables
  let cleanUrl = url.trim();
  
  // Si l'URL ne commence pas par http:// ou https://, ajouter https://
  if (!cleanUrl.match(/^https?:\/\//)) {
    cleanUrl = `https://${cleanUrl}`;
  }
  
  // Supprimer localhost ou domaines invalides
  if (cleanUrl.includes('localhost') || cleanUrl.includes('127.0.0.1')) {
    return '';
  }
  
  return cleanUrl;
};

const GestionPartenaires = () => {
  const queryClient = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<'tous' | 'or' | 'argent' | 'bronze'>('tous');
  const [form, setForm] = useState({ 
    nom: '', 
    logo_url: '', 
    niveau: 'or' as string, // ✅ Valeur par défaut selon les options de la BD
    site_url: ''
    // ✅ Seuls les champs qui existent dans la BD sont conservés
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
      partenaire.site_url?.toLowerCase().includes(searchTerm.toLowerCase());
    
    switch (filterType) {
      case 'or':
        return matchesSearch && partenaire.niveau === 'or';
      case 'argent':
        return matchesSearch && partenaire.niveau === 'argent';
      case 'bronze':
        return matchesSearch && partenaire.niveau === 'bronze';
      default:
        return matchesSearch;
    }
  }) || [];

  const stats = {
    total: partenaires?.length || 0,
    or: partenaires?.filter((p) => p.niveau === 'or').length || 0,
    argent: partenaires?.filter((p) => p.niveau === 'argent').length || 0,
    bronze: partenaires?.filter((p) => p.niveau === 'bronze').length || 0,
  };

  const addPartenaire = useMutation({
    mutationFn: async () => {
      // Normaliser l'URL du site avant l'insertion
      const normalizedData = {
        ...form,
        site_url: normalizeUrl(form.site_url)
      };
      const { error } = await supabase.from("partenaires").insert(normalizedData);
      if (error) throw error;
    },
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: ["admin-partenaires"] }); 
      queryClient.invalidateQueries({ queryKey: ["partenaires"] }); // Synchronisation page publique
      setShowAdd(false); 
      setForm({ nom: '', logo_url: '', niveau: 'or', site_url: '' }); // ✅ Champs corrigés
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
      queryClient.invalidateQueries({ queryKey: ["partenaires"] }); // Synchronisation page publique
      toast.success("Partenaire supprimé avec succès");
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
            <p className="text-[#D25238] text-lg font-bold mb-4">Erreur de chargement</p>
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
        <div className="bg-gradient-to-r from-[#24366E]/10 to-[#40B2A4]/10 backdrop-blur-sm border-b border-[#E9ECEF]/20">
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
                  Gestion des Partenaires
                </h1>
                <p 
                  className="text-[#6C757D] mt-2"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  Administration des partenaires pour le Hackathon ISOC-ESMT 2026
                </p>
              </motion.div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setShowAdd(!showAdd)}
                  className="px-4 py-2 rounded-lg bg-[#24366E] text-white hover:bg-[#40B2A46450] transition-colors"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  <Plus size={16} className="mr-2" />
                  Ajouter un partenaire
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
                className="relative overflow-hidden rounded-2xl border border-[#E9ECEF] bg-[white] p-6 hover:border-[#40B2A4]/50 hover:shadow-xl hover:shadow-[#40B2A4]/10 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#40B2A4]/5 opacity-0"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#24366E]/20 to-[#40B2A4]/20 flex items-center justify-center">
                        <Building2 size={24} className="text-[#212529]" />
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
                          Total des partenaires
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
                className="relative overflow-hidden rounded-2xl border border-[#E9ECEF] bg-[white] p-6 hover:border-[#40B2A4]/50 hover:shadow-xl hover:shadow-[#40B2A4]/10 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#40B2A4]/5 opacity-0"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#40B2A4]/20 to-[#40B2A4]/20 flex items-center justify-center">
                        <Award size={24} className="text-[#212529]" />
                      </div>
                      <div>
                        <p 
                          className="text-2xl font-bold text-[#212529]"
                          style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700 }}
                        >
                          {stats.or}
                        </p>
                        <p 
                          className="text-xs text-[#6C757D] mt-1"
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
                transition={{ duration: 0.5, delay: 0.3 }}
                className="relative overflow-hidden rounded-2xl border border-[#E9ECEF] bg-[white] p-6 hover:border-[#40B2A4]/50 hover:shadow-xl hover:shadow-[#40B2A4]/10 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#40B2A4]/5 opacity-0"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#40B2A4]/20 to-[#40B2A4]/20 flex items-center justify-center">
                        <Award size={24} className="text-[#212529]" />
                      </div>
                      <div>
                        <p 
                          className="text-2xl font-bold text-[#212529]"
                          style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700 }}
                        >
                          {stats.argent}
                        </p>
                        <p 
                          className="text-xs text-[#6C757D] mt-1"
                          style={{ fontFamily: 'DM Sans, sans-serif' }}
                        >
                          Partenaires Argent
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
                className="relative overflow-hidden rounded-2xl border border-[#E9ECEF] bg-[white] p-6 hover:border-[#7E245C]/50 hover:shadow-xl hover:shadow-[#7E245C]/10 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#7E245C]/5 opacity-0"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#7E245C]/20 to-[#7E245C]/20 flex items-center justify-center">
                        <Award size={24} className="text-[#212529]" />
                      </div>
                      <div>
                        <p 
                          className="text-2xl font-bold text-[#212529]"
                          style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700 }}
                        >
                          {stats.bronze}
                        </p>
                        <p 
                          className="text-xs text-[#6C757D] mt-1"
                          style={{ fontFamily: 'DM Sans, sans-serif' }}
                        >
                          Partenaires Bronze
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
                Ajouter un Partenaire
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#6C757D] mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>Nom du partenaire</label>
                    <input 
                      placeholder="Nom du partenaire" 
                      value={form.nom} 
                      onChange={(e) => setForm({ ...form, nom: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-[#E9ECEF] bg-[bg-white] text-[#212529] placeholder-[#6C757D] focus:outline-none focus:ring-2 focus:ring-[#40B2A4] focus:border-transparent transition-all duration-300"
                      style={{ fontFamily: 'DM Sans, sans-serif' }}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#6C757D] mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>Niveau de partenariat</label>
                    <select 
                      value={form.niveau} 
                      onChange={(e) => setForm({ ...form, niveau: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-[#E9ECEF] bg-[bg-white] text-[#212529] focus:outline-none focus:ring-2 focus:ring-[#40B2A4] focus:border-transparent transition-all duration-300"
                      style={{ fontFamily: 'DM Sans, sans-serif' }}
                    >
                      <option value="or">Or</option>
                      <option value="argent">Argent</option>
                      <option value="bronze">Bronze</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#6C757D] mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>Logo du partenaire</label>
                    <ImageUpload
                      value={form.logo_url}
                      onChange={(url) => setForm({ ...form, logo_url: url })}
                      placeholder="Uploader le logo du partenaire"
                      bucket="partenaires"
                      folder="logos"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#6C757D] mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>URL du site web</label>
                    <input 
                      placeholder="ex: www.exemple.com" 
                      value={form.site_url} 
                      onChange={(e) => setForm({ ...form, site_url: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-[#E9ECEF] bg-[bg-white] text-[#212529] placeholder-[#6C757D] focus:outline-none focus:ring-2 focus:ring-[#40B2A4] focus:border-transparent transition-all duration-300"
                      style={{ fontFamily: 'DM Sans, sans-serif' }}
                    />
                    {form.site_url && (
                      <p className="text-xs text-[#6C757D] mt-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                        {normalizeUrl(form.site_url) ? ` Deviendra: ${normalizeUrl(form.site_url)}` : ' URL invalide (localhost non autorisé)'}
                      </p>
                    )}
                  </div>
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
                  onClick={() => addPartenaire.mutate()}
                  className="px-6 py-2 rounded-xl bg-[#24366E] text-white hover:bg-[#40B2A46450] transition-colors flex items-center gap-2"
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
                    placeholder="Rechercher un partenaire..."
                    className="flex-1 px-4 py-2 rounded-xl border border-[#E9ECEF] bg-[white] text-[#212529] placeholder-[#6C757D] focus:outline-none focus:ring-2 focus:ring-[#40B2A4] focus:border-transparent"
                    style={{ fontFamily: 'DM Sans, sans-serif' }}
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterType('tous')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    filterType === 'tous' ? 'bg-[#24366E] text-white' : 'bg-white text-[#6C757D] hover:bg-[#E9ECEF]'
                  }`}
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  Tous
                </button>
                <button
                  onClick={() => setFilterType('or')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    filterType === 'or' ? 'bg-[#40B2A4] text-[#212529]' : 'bg-white text-[#6C757D] hover:bg-[#E9ECEF]'
                  }`}
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  Or
                </button>
                <button
                  onClick={() => setFilterType('argent')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    filterType === 'argent' ? 'bg-[#40B2A4] text-[#212529]' : 'bg-white text-[#6C757D] hover:bg-[#E9ECEF]'
                  }`}
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  Argent
                </button>
                <button
                  onClick={() => setFilterType('bronze')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    filterType === 'bronze' ? 'bg-[#7E245C] text-[#212529]' : 'bg-white text-[#6C757D] hover:bg-[#E9ECEF]'
                  }`}
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  Bronze
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Partenaires Grid */}
        <div className="container pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPartenaires.map((partenaire) => (
              <motion.div
                key={partenaire.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative overflow-hidden rounded-2xl border border-[#E9ECEF] bg-[white] hover:border-[#40B2A4]/50 hover:shadow-xl hover:shadow-[#40B2A4]/10 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#40B2A4]/5 opacity-0"></div>
                
                <div className="relative z-10 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        {partenaire.logo_url ? (
                          <img 
                            src={partenaire.logo_url} 
                            alt={partenaire.nom}
                            className="w-12 h-12 rounded-lg object-contain border border-[#E9ECEF]"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-[#24366E] to-[#40B2A4] flex items-center justify-center">
                            <Building2 size={24} className="text-white" />
                          </div>
                        )}
                        <div>
                          <h3 
                            className="font-bold text-[#212529]"
                            style={{ fontFamily: 'Sora, sans-serif' }}
                          >
                            {partenaire.nom}
                          </h3>
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                            partenaire.niveau === 'or' ? 'bg-[#40B2A4]/20 text-[#40B2A4]' : 
                            partenaire.niveau === 'argent' ? 'bg-[#40B2A4]/20 text-[#40B2A4]' : 
                            'bg-[#7E245C]/20 text-[#7E245C]'
                          }`}>
                            {partenaire.niveau === 'or' ? '🏆 Or' : 
                             partenaire.niveau === 'argent' ? '🥈 Argent' : 
                             '🥉 Bronze'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => deletePartenaire.mutate(partenaire.id)}
                      className="p-2 rounded-lg bg-[#D25238] text-[#212529] hover:bg-[#D25238] transition-colors"
                      style={{ fontFamily: 'DM Sans, sans-serif' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex gap-2 pt-2">
                      {(() => {
                        const normalizedUrl = normalizeUrl(partenaire.site_url || '');
                        return normalizedUrl ? (
                          <a 
                            href={normalizedUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-[#24366E] hover:text-[#40B2A4] transition-colors flex items-center gap-1"
                            style={{ fontFamily: 'DM Sans, sans-serif' }}
                          >
                            <Globe size={12} />
                            Site web
                          </a>
                        ) : null;
                      })()}
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
