import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/layout/AdminLayout";
import { toast } from "sonner";
import { Plus, Trash2, Users, Mail, CheckCircle, AlertCircle, Shuffle, UserCheck } from "lucide-react";
import { motion } from "framer-motion";

interface ComiteMember {
  id: string;
  nom_prenom: string;
  email: string;
  created_at: string;
}

interface Assignment {
  id: string;
  comite_id: string;
  equipe_id: string;
  equipe?: {
    id: string;
    nom_equipe: string;
    type_candidature: string;
    statut: string;
  };
  comite?: {
    id: string;
    nom_prenom: string;
    email: string;
  };
}

interface Equipe {
  id: string;
  nom_equipe: string;
  type_candidature: string;
  statut: string;
  nombre_membres: number;
}

const GestionComite = () => {
  const queryClient = useQueryClient();
  const [showAddMember, setShowAddMember] = useState(false);
  const [selectedDossiers, setSelectedDossiers] = useState<string[]>([]);
  const [newMember, setNewMember] = useState({ nom_prenom: '', email: '' });

  // Récupérer les membres du comité
  const { data: comiteMembers, isLoading: loadingComite, refetch: refetchComite } = useQuery({
    queryKey: ["comite-members"],
    queryFn: async () => {
      const { data, error } = await supabase.from("comite").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as ComiteMember[];
    },
  });

  // Récupérer toutes les équipes (dossiers)
  const { data: equipes, isLoading: loadingEquipes } = useQuery({
    queryKey: ["equipes-all"],
    queryFn: async () => {
      const { data, error } = await supabase.from("equipes").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as Equipe[];
    },
  });

  // Récupérer les assignments
  const { data: assignments, isLoading: loadingAssignments, refetch: refetchAssignments } = useQuery({
    queryKey: ["assignments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("assignments")
        .select(`
          *,
          comite:comite(id, nom_prenom, email),
          equipe:equipes(id, nom_equipe, type_candidature, statut)
        `)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Assignment[];
    },
  });

  // Calculer les statistiques
  const stats = {
    totalMembers: comiteMembers?.length || 0,
    totalDossiers: equipes?.length || 0,
    assignedDossiers: assignments?.length || 0,
    unassignedDossiers: (equipes?.length || 0) - (assignments?.length || 0),
  };

  // Ajouter un membre au comité
  const addMemberMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("comite").insert([newMember]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comite-members"] });
      setShowAddMember(false);
      setNewMember({ nom_prenom: '', email: '' });
      toast.success("Membre du comité ajouté avec succès");
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  // Supprimer un membre du comité
  const deleteMemberMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("comite").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comite-members"] });
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
      toast.success("Membre supprimé avec succès");
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  // Assigner des dossiers
  const assignDossiersMutation = useMutation({
    mutationFn: async ({ comiteId, equipeIds }: { comiteId: string; equipeIds: string[] }) => {
      const assignmentsToInsert = equipeIds.map(equipeId => ({
        comite_id: comiteId,
        equipe_id: equipeId,
      }));
      const { error } = await supabase.from("assignments").insert(assignmentsToInsert);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
      setSelectedDossiers([]);
      toast.success("Dossiers assignés avec succès");
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  // Assigner automatiquement
  const assignerAutomatiquement = async () => {
    if (!comiteMembers?.length || !equipes?.length) return;

    const unassignedEquipes = equipes.filter(equipe => 
      !assignments?.some(assignment => assignment.equipe_id === equipe.id)
    );

    if (unassignedEquipes.length === 0) {
      toast.info("Tous les dossiers sont déjà assignés");
      return;
    }

    // Distribuer équitablement
    const assignmentsToCreate: { comiteId: string; equipeIds: string[] }[] = [];
    comiteMembers.forEach((member, index) => {
      const memberAssignments = unassignedEquipes
        .filter((_, i) => i % comiteMembers.length === index)
        .slice(0, Math.ceil(unassignedEquipes.length / comiteMembers.length));
      
      if (memberAssignments.length > 0) {
        assignmentsToCreate.push({
          comiteId: member.id,
          equipeIds: memberAssignments.map(e => e.id),
        });
      }
    });

    // Exécuter toutes les assignments
    for (const assignment of assignmentsToCreate) {
      await assignDossiersMutation.mutateAsync(assignment);
    }
  };

  // Obtenir le nombre d'évaluateurs pour une équipe
  const getNbEvaluateurs = (equipeId: string) => {
    return assignments?.filter(a => a.equipe_id === equipeId).length || 0;
  };

  // Vérifier si une équipe a suffisamment d'évaluateurs
  const hasEnoughEvaluators = (equipeId: string) => {
    return getNbEvaluateurs(equipeId) >= 2;
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] to-white">
        {/* Header */}
        <div className="container py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 
                  className="font-display text-3xl font-bold text-[#212529] mb-2"
                  style={{ fontFamily: 'Sora, sans-serif' }}
                >
                  Gestion du Comité de Sélection
                </h1>
                <p 
                  className="text-[#6C757D]"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  Gérez les membres du comité et l'assignment des dossiers
                </p>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={assignerAutomatiquement}
                  disabled={loadingAssignments || stats.unassignedDossiers === 0}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#24366E] text-white hover:bg-[#2E4A8C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  <Shuffle size={16} />
                  Assigner automatiquement
                </button>
                <button
                  onClick={() => setShowAddMember(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#40B2A4] text-white hover:bg-[#40B2A4] transition-colors"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  <Plus size={16} />
                  Ajouter un membre
                </button>
              </div>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-xl p-4 border border-[#E9ECEF]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#40B2A4]/10 flex items-center justify-center">
                    <Users className="text-[#40B2A4]" size={20} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#212529]" style={{ fontFamily: 'Sora, sans-serif' }}>
                      {stats.totalMembers}
                    </p>
                    <p className="text-sm text-[#6C757D]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                      Membres du comité
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 border border-[#E9ECEF]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#24366E]/10 flex items-center justify-center">
                    <Mail className="text-[#24366E]" size={20} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#212529]" style={{ fontFamily: 'Sora, sans-serif' }}>
                      {stats.totalDossiers}
                    </p>
                    <p className="text-sm text-[#6C757D]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                      Total dossiers
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 border border-[#E9ECEF]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#40B2A4]/10 flex items-center justify-center">
                    <CheckCircle className="text-[#40B2A4]" size={20} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#212529]" style={{ fontFamily: 'Sora, sans-serif' }}>
                      {stats.assignedDossiers}
                    </p>
                    <p className="text-sm text-[#6C757D]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                      Dossiers assignés
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 border border-[#E9ECEF]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#F59E0B]/10 flex items-center justify-center">
                    <AlertCircle className="text-[#F59E0B]" size={20} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#212529]" style={{ fontFamily: 'Sora, sans-serif' }}>
                      {stats.unassignedDossiers}
                    </p>
                    <p className="text-sm text-[#6C757D]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                      Dossiers non assignés
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Section 1 - Membres du comité */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-2xl border border-[#E9ECEF] p-6 shadow-lg mb-8"
          >
            <h2 
              className="font-display text-xl font-bold text-[#212529] mb-4"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              Membres du Comité
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#E9ECEF]">
                    <th className="text-left py-3 px-4 font-semibold text-[#212529]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                      Nom
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-[#212529]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                      Email
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-[#212529]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                      Nb dossiers assignés
                    </th>
                    <th className="text-center py-3 px-4 font-semibold text-[#212529]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comiteMembers?.map((member) => (
                    <tr key={member.id} className="border-b border-[#E9ECEF] hover:bg-[#F8F9FA]">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <UserCheck size={16} className="text-[#24366E]" />
                          <span className="font-medium text-[#212529]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                            {member.nom_prenom}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-[#6C757D]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                          {member.email}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#24366E]/10 rounded-lg text-sm font-medium text-[#24366E]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                          {assignments?.filter(a => a.comite_id === member.id).length || 0}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => deleteMemberMutation.mutate(member.id)}
                          className="p-2 rounded-lg bg-[#D25238] text-white hover:bg-[#D25238] transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Section 2 - Assignment des dossiers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl border border-[#E9ECEF] p-6 shadow-lg"
          >
            <h2 
              className="font-display text-xl font-bold text-[#212529] mb-4"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              Assignment des Dossiers
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Liste des dossiers */}
              <div>
                <h3 
                  className="font-semibold text-[#212529] mb-4"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  Dossiers à assigner
                </h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {equipes?.map((equipe) => {
                    const nbEvaluateurs = getNbEvaluateurs(equipe.id);
                    const hasEnough = hasEnoughEvaluators(equipe.id);
                    
                    return (
                      <div
                        key={equipe.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          selectedDossiers.includes(equipe.id)
                            ? 'border-[#40B2A4] bg-[#40B2A4]/10'
                            : 'border-[#E9ECEF] hover:border-[#40B2A4]/30'
                        }`}
                        onClick={() => {
                          if (selectedDossiers.includes(equipe.id)) {
                            setSelectedDossiers(prev => prev.filter(id => id !== equipe.id));
                          } else {
                            setSelectedDossiers(prev => [...prev, equipe.id]);
                          }
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-[#212529]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                              {equipe.nom_equipe || `Équipe ${equipe.id}`}
                            </p>
                            <p className="text-sm text-[#6C757D]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                              {equipe.type_candidature} • {equipe.nombre_membres} membres
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${
                              hasEnough
                                ? 'bg-[#40B2A4]/10 text-[#40B2A4]'
                                : 'bg-[#F59E0B]/10 text-[#F59E0B]'
                            }`} style={{ fontFamily: 'DM Sans, sans-serif' }}>
                              {nbEvaluateurs}/2 évaluateurs
                            </span>
                            {selectedDossiers.includes(equipe.id) && (
                              <CheckCircle size={16} className="text-[#40B2A4]" />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Liste des membres du comité */}
              <div>
                <h3 
                  className="font-semibold text-[#212529] mb-4"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  Membres du comité disponibles
                </h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {comiteMembers?.map((member) => (
                    <div
                      key={member.id}
                      className="p-3 rounded-lg border border-[#E9ECEF]"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-[#212529]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                            {member.nom_prenom}
                          </p>
                          <p className="text-sm text-[#6C757D]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                            {member.email}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            if (selectedDossiers.length > 0) {
                              assignDossiersMutation.mutate({
                                comiteId: member.id,
                                equipeIds: selectedDossiers,
                              });
                            }
                          }}
                          disabled={selectedDossiers.length === 0}
                          className="px-3 py-1 rounded-lg bg-[#40B2A4] text-white text-sm hover:bg-[#40B2A4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{ fontFamily: 'DM Sans, sans-serif' }}
                        >
                          Assigner ({selectedDossiers.length})
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Modal Ajouter membre */}
        {showAddMember && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md mx-4"
            >
              <h3 
                className="font-display text-xl font-bold text-[#212529] mb-4"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                Ajouter un membre au comité
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#212529] mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                    Nom & Prénom
                  </label>
                  <input
                    type="text"
                    value={newMember.nom_prenom}
                    onChange={(e) => setNewMember({ ...newMember, nom_prenom: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-[#E9ECEF] text-[#212529] focus:outline-none focus:ring-2 focus:ring-[#40B2A4]/20 focus:border-[#40B2A4]/50"
                    style={{ fontFamily: 'DM Sans, sans-serif' }}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#212529] mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={newMember.email}
                    onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-[#E9ECEF] text-[#212529] focus:outline-none focus:ring-2 focus:ring-[#40B2A4]/20 focus:border-[#40B2A4]/50"
                    style={{ fontFamily: 'DM Sans, sans-serif' }}
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowAddMember(false);
                    setNewMember({ nom_prenom: '', email: '' });
                  }}
                  className="px-4 py-2 rounded-xl border border-[#E9ECEF] text-[#6C757D] hover:bg-[#E9ECEF] transition-colors"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  Annuler
                </button>
                <button
                  onClick={() => addMemberMutation.mutate()}
                  disabled={!newMember.nom_prenom.trim() || !newMember.email.trim()}
                  className="px-4 py-2 rounded-xl bg-[#40B2A4] text-white hover:bg-[#40B2A4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  Ajouter
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default GestionComite;
