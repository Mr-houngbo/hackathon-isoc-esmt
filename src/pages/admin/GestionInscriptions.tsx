import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/layout/AdminLayout";
import { toast } from "sonner";
import { Eye, Check, X, Search, Filter, Download, Calendar, Users, UserCheck, AlertTriangle, Trash2, Edit, Save } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const GestionInscriptions = () => {
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<'toutes' | 'selectionnees' | 'individuelles' | 'equipes'>('toutes');
  const [showDetails, setShowDetails] = useState(false);
  
  const { data: equipes, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-equipes-full"],
    queryFn: async () => {
      const { data, error } = await supabase.from("equipes").select("*, membres(*)").order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const filteredEquipes = equipes?.filter((eq) => {
    const matchesSearch = eq.nom_equipe?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.type_candidature?.toLowerCase().includes(searchTerm.toLowerCase());
    
    switch (filterType) {
      case 'selectionnees':
        return matchesSearch && eq.selectionnee;
      case 'individuelles':
        return matchesSearch && eq.type_candidature === 'individuel';
      case 'equipes':
        return matchesSearch && eq.type_candidature === 'equipe';
      default:
        return matchesSearch;
    }
  }) || [];

  const stats = {
    total: equipes?.length || 0,
    selectionnees: equipes?.filter((e) => e.selectionnee).length || 0,
    individuelles: equipes?.filter((e) => e.type_candidature === 'individuel').length || 0,
    equipes: equipes?.filter((e) => e.type_candidature === 'equipe').length || 0,
  };

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("equipes").delete().eq("id", id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      toast.success("Inscription supprimée avec succès");
      refetch();
      if (selected === id) setSelected(null);
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  const selectedEquipe = equipes?.find((eq) => eq.id === selected);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full border-4 border-[#00873E] border-t-transparent animate-spin"></div>
            <p className="text-[#9CA3AF]">Chargement des inscriptions...</p>
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
                  Gestion des Inscriptions
                </h1>
                <p 
                  className="text-[#9CA3AF] mt-2"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  Administration complète des candidatures au Hackathon ISOC-ESMT 2026
                </p>
              </motion.div>
              
              <div className="flex gap-2">
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
                        <Users size={24} className="text-[#F9FAFB]" />
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
                          Total des inscriptions
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative overflow-hidden rounded-2xl border border-[#2D3748] bg-[#111827] p-6 hover:border-[#F59E0B]/50 hover:shadow-xl hover:shadow-[#F59E0B]/10 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#F59E0B]/5 opacity-0"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#F59E0B]/20 to-[#F59E0B]/20 flex items-center justify-center">
                        <UserCheck size={24} className="text-[#F9FAFB]" />
                      </div>
                      <div>
                        <p 
                          className="text-2xl font-bold text-[#F9FAFB]"
                          style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700 }}
                        >
                          {stats.selectionnees}
                        </p>
                        <p 
                          className="text-xs text-[#9CA3AF] mt-1"
                          style={{ fontFamily: 'DM Sans, sans-serif' }}
                        >
                          Équipes sélectionnées
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="relative overflow-hidden rounded-2xl border border-[#2D3748] bg-[#111827] p-6 hover:border-[#10B981]/50 hover:shadow-xl hover:shadow-[#10B981]/10 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#10B981]/5 opacity-0"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#10B981]/20 to-[#10B981]/20 flex items-center justify-center">
                        <Users size={24} className="text-[#F9FAFB]" />
                      </div>
                      <div>
                        <p 
                          className="text-2xl font-bold text-[#F9FAFB]"
                          style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700 }}
                        >
                          {stats.equipes}
                        </p>
                        <p 
                          className="text-xs text-[#9CA3AF] mt-1"
                          style={{ fontFamily: 'DM Sans, sans-serif' }}
                        >
                          Inscriptions d'équipes
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="relative overflow-hidden rounded-2xl border border-[#2D3748] bg-[#111827] p-6 hover:border-[#10B981]/50 hover:shadow-xl hover:shadow-[#10B981]/10 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#10B981]/5 opacity-0"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#10B981]/20 to-[#10B981]/20 flex items-center justify-center">
                        <Users size={24} className="text-[#F9FAFB]" />
                      </div>
                      <div>
                        <p 
                          className="text-2xl font-bold text-[#F9FAFB]"
                          style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700 }}
                        >
                          {stats.individuelles}
                        </p>
                        <p 
                          className="text-xs text-[#9CA3AF] mt-1"
                          style={{ fontFamily: 'DM Sans, sans-serif' }}
                        >
                          Inscriptions individuelles
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Filters and Search */}
        <div className="container py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <Search size={20} className="text-[#9CA3AF]" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Rechercher une inscription..."
                    className="flex-1 px-4 py-2 rounded-xl border border-[#2D3748] bg-[#111827] text-[#F9FAFB] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#FBBF24] focus:border-transparent transition-all duration-300"
                    style={{ fontFamily: 'DM Sans, sans-serif' }}
                  />
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
                      filterType === 'selectionnees' ? 'bg-[#FBBF24] text-[#0A0A0A]' : 'bg-[#1F2937] text-[#9CA3AF] hover:bg-[#2D3748]'
                    }`}
                    style={{ fontFamily: 'DM Sans, sans-serif' }}
                  >
                    Sélectionnées
                  </button>
                  <button
                    onClick={() => setFilterType('individuelles')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      filterType === 'individuelles' ? 'bg-[#10B981] text-[#F9FAFB]' : 'bg-[#1F2937] text-[#9CA3AF] hover:bg-[#2D3748]'
                    }`}
                    style={{ fontFamily: 'DM Sans, sans-serif' }}
                  >
                    Individuelles
                  </button>
                  <button
                    onClick={() => setFilterType('equipes')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      filterType === 'equipes' ? 'bg-[#F59E0B] text-[#F9FAFB]' : 'bg-[#1F2937] text-[#9CA3AF] hover:bg-[#2D3748]'
                    }`}
                    style={{ fontFamily: 'DM Sans, sans-serif' }}
                  >
                    Équipes
                  </button>
                </div>
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

        {/* Table */}
        <div className="container pb-8">
          <div className="rounded-2xl border border-[#2D3748] bg-[#111827] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#1F2937] border-b border-[#2D3748]">
                    <th className="text-left py-4 px-6 text-sm font-bold text-[#F9FAFB]" style={{ fontFamily: 'Sora, sans-serif' }}>Équipe</th>
                    <th className="text-left py-4 px-6 text-sm font-bold text-[#F9FAFB]" style={{ fontFamily: 'Sora, sans-serif' }}>Type</th>
                    <th className="text-left py-4 px-6 text-sm font-bold text-[#F9FAFB]" style={{ fontFamily: 'Sora, sans-serif' }}>Membres</th>
                    <th className="text-left py-4 px-6 text-sm font-bold text-[#F9FAFB]" style={{ fontFamily: 'Sora, sans-serif' }}>Projet</th>
                    <th className="text-left py-4 px-6 text-sm font-bold text-[#F9FAFB]" style={{ fontFamily: 'Sora, sans-serif' }}>Date</th>
                    <th className="text-left py-4 px-6 text-sm font-bold text-[#F9FAFB]" style={{ fontFamily: 'Sora, sans-serif' }}>Statut</th>
                    <th className="text-center py-4 px-6 text-sm font-bold text-[#F9FAFB]" style={{ fontFamily: 'Sora, sans-serif' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEquipes.map((eq) => (
                    <motion.tr
                      key={eq.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="border-b border-[#2D3748]/50 hover:bg-[#1F2937]/30 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <button
                          onClick={() => setSelected(eq.id)}
                          className={`text-left font-medium ${
                            selected === eq.id ? 'text-[#FBBF24]' : 'text-[#9CA3AF] hover:text-[#FBBF24]'
                          }`}
                          style={{ fontFamily: 'DM Sans, sans-serif' }}
                        >
                          {eq.nom_equipe || 'Individuel'}
                        </button>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          eq.type_candidature === 'equipe' ? 'bg-[#F59E0B] text-[#F9FAFB]' : 'bg-[#10B981] text-[#F9FAFB]'
                        }`}>
                          {eq.type_candidature === 'equipe' ? 'Équipe' : 'Individuel'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-[#9CA3AF]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                          {(eq.membres as any[])?.length || 0}
                        </span>
                      </td>
                      <td className="py-4 px-6 max-w-[200px]">
                        <span className="text-[#9CA3AF] truncate" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                          {eq.nom_projet || '—'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-xs text-[#9CA3AF]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                          {new Date(eq.created_at).toLocaleDateString('fr-FR')}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          eq.selectionnee ? 'bg-[#00873E]/20 text-[#00873E]' : 'bg-[#F59E0B]/20 text-[#F59E0B]'
                        }`}>
                          {eq.selectionnee ? '✓ Sélectionnée' : 'En attente'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setShowDetails(eq.id)}
                            className="p-1 rounded bg-[#00873E] text-[#F9FAFB] hover:bg-[#006450] transition-colors"
                            style={{ fontFamily: 'DM Sans, sans-serif' }}
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => deleteMutation.mutate(eq.id)}
                            className="p-1 rounded bg-[#DC2626] text-[#F9FAFB] hover:bg-[#B91C1C] transition-colors"
                            style={{ fontFamily: 'DM Sans, sans-serif' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        {/* Details Modal */}
        {selectedEquipe && showDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-[#0A0A0A]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDetails(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-[#2D3748] bg-[#111827] shadow-2xl"
            >
              <div className="sticky top-0 right-0 p-4 border-b border-[#2D3748] bg-[#1F2937] z-10">
                <button
                  onClick={() => setShowDetails(false)}
                  className="p-2 rounded-lg bg-[#DC2626] text-[#F9FAFB] hover:bg-[#B91C1C] transition-colors"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-6">
                <h2 
                  className="font-display text-2xl font-bold text-[#F9FAFB] mb-4"
                  style={{ fontFamily: 'Sora, sans-serif' }}
                >
                  {selectedEquipe.nom_equipe || 'Inscription Individuelle'}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 
                      className="font-semibold text-[#F9FAFB] mb-2"
                      style={{ fontFamily: 'Sora, sans-serif' }}
                    >
                      Informations générales
                    </h3>
                    <div className="space-y-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-[#9CA3AF]">Type de candidature :</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          selectedEquipe.type_candidature === 'equipe' ? 'bg-[#F59E0B] text-[#F9FAFB]' : 'bg-[#10B981] text-[#F9FAFB]'
                        }`}>
                          {selectedEquipe.type_candidature === 'equipe' ? 'Équipe' : 'Individuel'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#9CA3AF]">Date d'inscription :</span>
                        <span className="text-[#F9FAFB]">{new Date(selectedEquipe.created_at).toLocaleDateString('fr-FR')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#9CA3AF]">Statut :</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          selectedEquipe.selectionnee ? 'bg-[#00873E]/20 text-[#00873E]' : 'bg-[#F59E0B]/20 text-[#F59E0B]'
                        }`}>
                          {selectedEquipe.selectionnee ? '✓ Sélectionnée' : 'En attente'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 
                      className="font-semibold text-[#F9FAFB] mb-2"
                      style={{ fontFamily: 'Sora, sans-serif' }}
                    >
                      Projet
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-[#9CA3AF]">Nom du projet :</span>
                        <span className="text-[#F9FAFB] truncate">{selectedEquipe.nom_projet || 'Non défini'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#9CA3AF]">Problématique :</span>
                        <span className="text-[#F9FAFB] truncate">{selectedEquipe.problematique || 'Non définie'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#9CA3AF]">Solution proposée :</span>
                        <span className="text-[#F9FAFB] truncate">{selectedEquipe.solution || 'Non définie'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 
                      className="font-semibold text-[#F9FAFB] mb-2"
                      style={{ fontFamily: 'Sora, sans-serif' }}
                    >
                      Membres ({(selectedEquipe.membres as any[])?.length || 0})
                    </h3>
                    <div className="space-y-3">
                      {(selectedEquipe.membres as any[])?.map((m: any, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-[#1F2937]/50 border border-[#2D3748]">
                          <div>
                            <p className="font-medium text-[#F9FAFB]">{m.nom_prenom}</p>
                            <p className="text-xs text-[#9CA3AF]">{m.filiere} • {m.email}</p>
                            {m.est_chef && (
                              <span className="ml-2 px-2 py-1 rounded-full bg-[#FBBF24] text-[#0A0A0A] text-xs font-bold">Chef</span>
                            )}
                          </div>
                          <div className="text-right">
                            <span className="text-xs text-[#9CA3AF]">{m.role_equipe}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </AdminLayout>
  );
};

export default GestionInscriptions;
