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
    type_candidature: 'equipe' as string,
    nom_equipe: '', 
    nombre_membres: 1,
    a_projet: 'oui' as string,
    nom_projet: '',
    domaine_projet: '',
    problematique: '',
    solution: '',
    technologies: '',
    niveau_avancement: 'concept' as string,
    contraintes_techniques: '',
    niveau_technique: 'debutant' as string,
    motivation: '',
    esperances: '',
    source_info: '',
    statut: 'en_attente' as string,
    domaine_projet_autre: ''
    // ✅ Champs alignés avec le schéma de la BD
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
        return matchesSearch && equipe.statut === 'selectionne';
      case 'en_attente':
        return matchesSearch && equipe.statut === 'en_attente';
      default:
        return matchesSearch;
    }
  }) || [];

  const stats = {
    total: equipes?.length || 0,
    selectionnees: equipes?.filter((e) => e.statut === 'selectionne').length || 0,
    en_attente: equipes?.filter((e) => e.statut === 'en_attente').length || 0,
  };

  const addEquipe = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("equipes").insert({ ...form });
      if (error) throw error;
    },
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: ["admin-equipes"] }); 
      queryClient.invalidateQueries({ queryKey: ["equipes-selectionnees"] }); // Synchronisation page publique
      setShowAdd(false); 
      setForm({ 
        type_candidature: 'equipe',
        nom_equipe: '', 
        nombre_membres: 1,
        a_projet: 'oui',
        nom_projet: '',
        domaine_projet: '',
        problematique: '',
        solution: '',
        technologies: '',
        niveau_avancement: 'concept',
        contraintes_techniques: '',
        niveau_technique: 'debutant',
        motivation: '',
        esperances: '',
        source_info: '',
        statut: 'en_attente',
        domaine_projet_autre: ''
      });
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
      queryClient.invalidateQueries({ queryKey: ["equipes-selectionnees"] }); // Synchronisation page publique
      toast.success("Équipe supprimée avec succès");
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  const toggleSelection = useMutation({
    mutationFn: async (id: string) => {
      const equipe = equipes?.find(e => e.id === id);
      if (!equipe) throw new Error("Équipe non trouvée");
      
      const newStatut = equipe.statut === 'selectionne' ? 'non_selectionne' : 'selectionne';
      const { error } = await supabase.from("equipes").update({ statut: newStatut }).eq("id", id);
      if (error) throw error;
      return newStatut;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-equipes"] });
      queryClient.invalidateQueries({ queryKey: ["equipes-selectionnees"] }); // Synchronisation page publique
      toast.success("Statut de sélection mis à jour");
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
                  Gestion des Équipes
                </h1>
                <p 
                  className="text-[#6C757D] mt-2"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  Administration des équipes pour le Hackathon ISOC-ESMT 2026
                </p>
              </motion.div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setShowAdd(!showAdd)}
                  className="px-4 py-2 rounded-lg bg-[#1E3A5F] text-white hover:bg-[#006450] transition-colors"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  <Plus size={16} className="mr-2" />
                  Ajouter une équipe
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
                        <Users size={24} className="text-[#212529]" />
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
                className="relative overflow-hidden rounded-2xl border border-[#E9ECEF] bg-[white] p-6 hover:border-[#10B981]/50 hover:shadow-xl hover:shadow-[#10B981]/10 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#10B981]/5 opacity-0"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#10B981]/20 to-[#10B981]/20 flex items-center justify-center">
                        <Trophy size={24} className="text-[#212529]" />
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
            <div className="rounded-2xl border border-[#E9ECEF] bg-[white] p-6">
              <h2 
                className="font-display text-xl font-bold text-[#212529] mb-6"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                Ajouter une Équipe
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#6C757D] mb-2">Type de candidature</label>
                    <select 
                      value={form.type_candidature}
                      onChange={(e) => setForm({ ...form, type_candidature: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-[#E9ECEF] bg-white text-[#212529] focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                    >
                      <option value="individuel">Individuel</option>
                      <option value="equipe">Équipe</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#6C757D] mb-2">Nom de l'équipe</label>
                    <input 
                      placeholder="Nom de l'équipe" 
                      value={form.nom_equipe} 
                      onChange={(e) => setForm({ ...form, nom_equipe: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-[#E9ECEF] bg-white text-[#212529] placeholder-[#6C757D] focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#6C757D] mb-2">Nombre de membres</label>
                    <input 
                      type="number"
                      placeholder="Nombre de membres" 
                      value={form.nombre_membres} 
                      onChange={(e) => setForm({ ...form, nombre_membres: parseInt(e.target.value) || 1 })}
                      className="w-full px-4 py-2 rounded-xl border border-[#E9ECEF] bg-white text-[#212529] placeholder-[#6C757D] focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#6C757D] mb-2">A un projet ?</label>
                    <select 
                      value={form.a_projet}
                      onChange={(e) => setForm({ ...form, a_projet: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-[#E9ECEF] bg-white text-[#212529] focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                    >
                      <option value="oui">Oui</option>
                      <option value="non">Non</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#6C757D] mb-2">Nom du projet</label>
                    <input 
                      placeholder="Nom du projet" 
                      value={form.nom_projet} 
                      onChange={(e) => setForm({ ...form, nom_projet: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-[#E9ECEF] bg-white text-[#212529] placeholder-[#6C757D] focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#6C757D] mb-2">Domaine du projet</label>
                    <input 
                      placeholder="Domaine du projet" 
                      value={form.domaine_projet} 
                      onChange={(e) => setForm({ ...form, domaine_projet: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-[#E9ECEF] bg-white text-[#212529] placeholder-[#6C757D] focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#6C757D] mb-2">Domaine projet (autre)</label>
                    <input 
                      placeholder="Autre domaine" 
                      value={form.domaine_projet_autre} 
                      onChange={(e) => setForm({ ...form, domaine_projet_autre: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-[#E9ECEF] bg-white text-[#212529] placeholder-[#6C757D] focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#6C757D] mb-2">Statut</label>
                    <select 
                      value={form.statut}
                      onChange={(e) => setForm({ ...form, statut: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-[#E9ECEF] bg-white text-[#212529] focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                    >
                      <option value="en_attente">En attente</option>
                      <option value="selectionne">Sélectionné</option>
                      <option value="non_selectionne">Non sélectionné</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#6C757D] mb-2">Problématique</label>
                  <textarea 
                    placeholder="Problématique à résoudre..." 
                    value={form.problematique} 
                    onChange={(e) => setForm({ ...form, problematique: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 rounded-xl border border-[#E9ECEF] bg-white text-[#212529] placeholder-[#6C757D] focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#6C757D] mb-2">Solution proposée</label>
                  <textarea 
                    placeholder="Solution proposée..." 
                    value={form.solution} 
                    onChange={(e) => setForm({ ...form, solution: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 rounded-xl border border-[#E9ECEF] bg-white text-[#212529] placeholder-[#6C757D] focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowAdd(false)}
                  className="px-6 py-2 rounded-xl border border-[#E9ECEF] text-[#6C757D] hover:bg-[#E9ECEF] transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={() => addEquipe.mutate()}
                  className="px-6 py-2 rounded-xl bg-[#1E3A5F] text-white hover:bg-[#006450] transition-colors flex items-center gap-2"
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
                    placeholder="Rechercher une équipe..."
                    className="flex-1 px-4 py-2 rounded-xl border border-[#E9ECEF] bg-white text-[#212529] placeholder-[#6C757D] focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterType('toutes')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    filterType === 'toutes' ? 'bg-[#1E3A5F] text-white' : 'bg-white text-[#6C757D] hover:bg-[#E9ECEF]'
                  }`}
                >
                  Toutes
                </button>
                <button
                  onClick={() => setFilterType('selectionnees')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    filterType === 'selectionnees' ? 'bg-[#10B981] text-[#212529]' : 'bg-white text-[#6C757D] hover:bg-[#E9ECEF]'
                  }`}
                >
                  Sélectionnées
                </button>
                <button
                  onClick={() => setFilterType('en_attente')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    filterType === 'en_attente' ? 'bg-[#F59E0B] text-[#212529]' : 'bg-white text-[#6C757D] hover:bg-[#E9ECEF]'
                  }`}
                >
                  En attente
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Equipes Grid */}
        <div className="container pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEquipes.map((equipe) => (
              <motion.div
                key={equipe.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative overflow-hidden rounded-2xl border border-[#E9ECEF] bg-white hover:border-[#FF6B35]/50 hover:shadow-xl hover:shadow-[#FF6B35]/10 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#FF6B35]/5 opacity-0"></div>
                
                <div className="relative z-10 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 
                        className="font-bold text-[#212529] mb-2"
                        style={{ fontFamily: 'Sora, sans-serif' }}
                      >
                        {equipe.nom_equipe}
                      </h3>
                      
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-2 ${
                        equipe.statut === 'selectionne' ? 'bg-[#10B981]/20 text-[#10B981]' : 
                        equipe.statut === 'non_selectionne' ? 'bg-[#DC2626]/20 text-[#DC2626]' : 
                        'bg-[#F59E0B]/20 text-[#F59E0B]'
                      }`}>
                        {equipe.statut === 'selectionne' ? '✅ Sélectionnée' : 
                         equipe.statut === 'non_selectionne' ? '❌ Non sélectionnée' : 
                         '⏳ En attente'}
                      </span>
                      
                      {equipe.nom_projet && (
                        <p className="text-sm text-[#6C757D] mb-2">
                          📋 {equipe.nom_projet}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleSelection.mutate(equipe.id)}
                        className="p-2 rounded-lg bg-[#1E3A5F] text-white hover:bg-[#006450] transition-colors"
                        title="Changer le statut"
                      >
                        <Trophy size={16} />
                      </button>
                      
                      <button
                        onClick={() => deleteEquipe.mutate(equipe.id)}
                        className="p-2 rounded-lg bg-[#DC2626] text-[#212529] hover:bg-[#B91C1C] transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-[#6C757D]">
                      <Users size={14} />
                      <span>{equipe.nombre_membres} membre{equipe.nombre_membres > 1 ? 's' : ''}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-[#6C757D]">
                      <span>Type: {equipe.type_candidature}</span>
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

export default GestionEquipes;
