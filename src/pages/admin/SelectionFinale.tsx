import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/layout/AdminLayout";
import { toast } from "sonner";
import { Trophy, Users, CheckCircle, AlertCircle, ArrowRight, RefreshCw, Eye, Globe, UserPlus } from "lucide-react";
import { motion } from "framer-motion";

interface ClassementItem {
  id: string;
  nom_equipe: string;
  type_candidature: string;
  statut: string;
  nb_evaluateurs: number;
  score_moyen: number;
  bonus_equipe: number;
  score_final: number;
}

interface EquipeIndividuelle {
  id: string;
  nom_equipe: string;
  type_candidature: string;
  statut: string;
  score_final: number;
  chef?: {
    nom_prenom: string;
    filiere: string;
    niveau_etudes: string;
  };
}

const SelectionFinale = () => {
  const queryClient = useQueryClient();
  const [selectedIndividus, setSelectedIndividus] = useState<string[]>([]);
  const [nomEquipe, setNomEquipe] = useState('');

  // Récupérer le classement depuis la vue
  const { data: classement, isLoading, refetch } = useQuery({
    queryKey: ["classement-selection"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vue_classement_selection")
        .select("*")
        .order("score_final", { ascending: false });
      
      if (error) throw error;
      return data as ClassementItem[];
    },
  });

  // Récupérer les individuels sélectionnés
  const { data: individuelsSelectionnes } = useQuery({
    queryKey: ["individuels-selectionnes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("equipes")
        .select(`
          *,
          chef: membres!inner(membres(id, nom_prenom, filiere, niveau_etudes))
        `)
        .eq("type_candidature", "individuel")
        .eq("statut", "selectionne")
        .order("score_final", { ascending: false });
      
      if (error) throw error;
      return data as EquipeIndividuelle[];
    },
  });

  // Mettre à jour les statuts automatiquement
  const updateStatutsMutation = useMutation({
    mutationFn: async (classementData: ClassementItem[]) => {
      for (let i = 0; i < classementData.length; i++) {
        const item = classementData[i];
        const statut = i < 40 ? 'selectionne'
          : i < 50 ? 'en_attente'
          : 'non_selectionne';

        await supabase
          .from("equipes")
          .update({ statut })
          .eq("id", item.id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classement-selection"] });
      toast.success("Statuts mis à jour avec succès");
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  // Regrouper les individuels
  const regrouperMutation = useMutation({
    mutationFn: async () => {
      if (selectedIndividus.length !== 4) {
        throw new Error("Veuillez sélectionner exactement 4 candidats individuels");
      }
      if (!nomEquipe.trim()) {
        throw new Error("Veuillez donner un nom à l'équipe");
      }

      // 1. Créer la nouvelle équipe
      const { data: nouvelleEquipe } = await supabase
        .from("equipes")
        .insert({
          type_candidature: 'equipe',
          nom_equipe: nomEquipe.trim(),
          nombre_membres: 4,
          statut: 'selectionne',
          niveau_technique: individuelsSelectionnes[0]?.niveau_technique || '',
        })
        .select()
        .single();

      if (!nouvelleEquipe) throw new Error("Erreur lors de la création de l'équipe");

      // 2. Rattacher les 4 membres à la nouvelle équipe
      for (let i = 0; i < selectedIndividus.length; i++) {
        const individuId = selectedIndividus[i];
        
        // Récupérer le membre (chef) de l'équipe individuelle
        const { data: membre } = await supabase
          .from("membres")
          .select("*")
          .eq("equipe_id", individuId)
          .single();

        if (!membre) continue;

        // Mettre à jour equipe_id du membre
        await supabase
          .from("membres")
          .update({
            equipe_id: nouvelleEquipe.id,
            est_chef: i === 0, // premier = chef
            role_equipe: membre.competences?.[0] || 'Participant'
          })
          .eq("id", membre.id);

        // Supprimer l'ancienne équipe individuelle
        await supabase
          .from("equipes")
          .delete()
          .eq("id", individuId);
      }

      return nouvelleEquipe;
    },
    onSuccess: (nouvelleEquipe) => {
      queryClient.invalidateQueries({ queryKey: ["classement-selection"] });
      queryClient.invalidateQueries({ queryKey: ["individuels-selectionnes"] });
      setSelectedIndividus([]);
      setNomEquipe('');
      toast.success(`Équipe "${nouvelleEquipe.nom_equipe}" créée avec succès !`);
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  // Publier les équipes
  const publierMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("equipes")
        .update({ publiee: true })
        .eq("statut", "selectionne");

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classement-selection"] });
      toast.success("Équipes publiées sur la page publique !");
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  // Dépublier les équipes
  const depublierMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("equipes")
        .update({ publiee: false })
        .eq("statut", "selectionne");

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classement-selection"] });
      toast.success("Équipes retirées de la page publique");
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  // Mettre à jour les statuts au chargement
  useEffect(() => {
    if (classement && classement.length > 0) {
      updateStatutsMutation.mutate(classement);
    }
  }, [classement]);

  // Obtenir le statut d'une équipe
  const getStatutInfo = (rang: number) => {
    if (rang < 40) return { status: 'selectionne', color: 'text-green-600', bgColor: 'bg-green-100', label: 'Sélectionné' };
    if (rang < 50) return { status: 'en_attente', color: 'text-orange-600', bgColor: 'bg-orange-100', label: 'Liste d\'attente' };
    return { status: 'non_selectionne', color: 'text-red-600', bgColor: 'bg-red-100', label: 'Non sélectionné' };
  };

  // Vérifier si une équipe est publiée
  const equipesPubliees = classement?.filter(e => e.statut === 'selectionne').length || 0;

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] to-white">
        <div className="container py-6">
          {/* Header */}
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
                  Classement & Sélection Finale
                </h1>
                <p 
                  className="text-[#6C757D]"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  Gérez le classement final et le regroupement des candidats
                </p>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => refetch()}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1E3A5F] text-white hover:bg-[#2C5282] transition-colors"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  <RefreshCw size={16} />
                  Actualiser
                </button>
              </div>
            </div>
          </motion.div>

          {/* Section 1 - Tableau de classement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-2xl border border-[#E9ECEF] p-6 shadow-lg mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 
                className="font-display text-xl font-bold text-[#212529]"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                Classement Général
              </h2>
              <div className="flex items-center gap-4 text-sm text-[#6C757D]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>Top 40 → Sélectionné</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  <span>41-50 → Liste d'attente</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span>Reste → Non sélectionné</span>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#E9ECEF]">
                    <th className="text-left py-3 px-4 font-semibold text-[#212529]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                      Rang
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-[#212529]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                      Nom équipe/candidat
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-[#212529]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                      Type
                    </th>
                    <th className="text-center py-3 px-4 font-semibold text-[#212529]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                      Nb évaluateurs
                    </th>
                    <th className="text-center py-3 px-4 font-semibold text-[#212529]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                      Score moyen/100
                    </th>
                    <th className="text-center py-3 px-4 font-semibold text-[#212529]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                      Bonus
                    </th>
                    <th className="text-center py-3 px-4 font-semibold text-[#212529]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                      Score final
                    </th>
                    <th className="text-center py-3 px-4 font-semibold text-[#212529]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                      Statut
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {classement?.map((item, index) => {
                    const statutInfo = getStatutInfo(index);
                    const hasEnoughEvaluators = item.nb_evaluateurs >= 2;
                    
                    return (
                      <tr 
                        key={item.id} 
                        className={`border-b border-[#E9ECEF] hover:bg-[#F8F9FA] ${
                          index < 40 ? 'bg-green-50' : 
                          index < 50 ? 'bg-orange-50' : ''
                        }`}
                      >
                        <td className="py-3 px-4">
                          <span className={`font-bold text-lg ${
                            index < 40 ? 'text-green-600' : 
                            index < 50 ? 'text-orange-600' : 'text-[#6C757D]'
                          }`} style={{ fontFamily: 'Sora, sans-serif' }}>
                            #{index + 1}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-[#212529]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                              {item.nom_equipe}
                            </p>
                            <p className="text-sm text-[#6C757D]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                              {item.type_candidature}
                            </p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${
                            hasEnoughEvaluators ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`} style={{ fontFamily: 'DM Sans, sans-serif' }}>
                            {item.nb_evaluateurs}
                            {!hasEnoughEvaluators && (
                              <AlertCircle size={12} className="ml-1" />
                            )}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="font-medium text-[#212529]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                            {item.score_moyen}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="font-medium text-[#10B981]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                            +{item.bonus_equipe}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="font-bold text-lg text-[#1E3A5F]" style={{ fontFamily: 'Sora, sans-serif' }}>
                            {item.score_final}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${statutInfo.bgColor} ${statutInfo.color}`} style={{ fontFamily: 'DM Sans, sans-serif' }}>
                            {statutInfo.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Section 2 - Regrouper des individuels */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl border border-[#E9ECEF] p-6 shadow-lg mb-8"
          >
            <h2 
              className="font-display text-xl font-bold text-[#212529] mb-4"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              Regrouper des Candidats Individuels
            </h2>
            <p 
              className="text-[#6C757D] mb-6"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              Sélectionnez 4 candidats individuels sélectionnés pour former une nouvelle équipe
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Liste des individuels */}
              <div>
                <h3 
                  className="font-semibold text-[#212529] mb-4"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  Candidats individuels sélectionnés
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {individuelsSelectionnes?.map((individu) => (
                    <div
                      key={individu.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedIndividus.includes(individu.id)
                          ? 'border-[#FF6B35] bg-[#FF6B35]/10'
                          : 'border-[#E9ECEF] hover:border-[#FF6B35]/30'
                      }`}
                      onClick={() => {
                        if (selectedIndividus.includes(individu.id)) {
                          setSelectedIndividus(prev => prev.filter(id => id !== individu.id));
                        } else {
                          setSelectedIndividus(prev => [...prev, individu.id]);
                        }
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-[#212529]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                            {individu.chef?.nom_prenom}
                          </p>
                          <p className="text-sm text-[#6C757D]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                            {individu.chef?.filiere} • {individu.chef?.niveau_etudes}
                          </p>
                          <p className="text-xs text-[#10B981] font-medium">
                            Score: {individu.score_final}
                          </p>
                        </div>
                        {selectedIndividus.includes(individu.id) && (
                          <CheckCircle size={16} className="text-[#FF6B35]" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Formulaire de regroupement */}
              <div>
                <h3 
                  className="font-semibold text-[#212529] mb-4"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  Nouvelle équipe
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#212529] mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                      Nom de la nouvelle équipe
                    </label>
                    <input
                      type="text"
                      value={nomEquipe}
                      onChange={(e) => setNomEquipe(e.target.value)}
                      placeholder="Nom de l'équipe"
                      className="w-full px-4 py-3 rounded-xl border border-[#E9ECEF] bg-white text-[#212529] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35]/50"
                      style={{ fontFamily: 'DM Sans, sans-serif' }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-[#6C757D]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                      {selectedIndividus.length}/4 sélectionnés
                    </span>
                    <span className={`text-sm font-medium ${
                      selectedIndividus.length === 4 ? 'text-green-600' : 'text-orange-600'
                    }`} style={{ fontFamily: 'DM Sans, sans-serif' }}>
                      {selectedIndividus.length === 4 ? '✅ Prêt à créer' : '⚠️ Sélectionnez 4 candidats'}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => regrouperMutation.mutate()}
                    disabled={selectedIndividus.length !== 4 || !nomEquipe.trim()}
                    className="w-full px-4 py-3 rounded-xl bg-[#FF6B35] text-white hover:bg-[#FF8C42] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    style={{ fontFamily: 'DM Sans, sans-serif' }}
                  >
                    <UserPlus size={16} />
                    {regrouperMutation.isPending ? 'Création en cours...' : 'Créer l\'équipe'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Section 3 - Publication des équipes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-2xl border border-[#E9ECEF] p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 
                className="font-display text-xl font-bold text-[#212529]"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                Publication des Équipes Sélectionnées
              </h2>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  equipesPubliees > 0 ? 'bg-green-500' : 'bg-gray-400'
                }`}></div>
                <span className="text-sm text-[#6C757D]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                  {equipesPubliees > 0 ? `${equipesPubliees} équipes en ligne` : 'Aucune équipe en ligne'}
                </span>
              </div>
            </div>

            <p 
              className="text-[#6C757D] mb-6"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              Vérifiez la liste avant de publier sur la page publique
            </p>

            {/* Aperçu des équipes sélectionnées */}
            <div className="space-y-3 max-h-64 overflow-y-auto mb-6">
              {classement?.filter(e => e.statut === 'selectionne').map((equipe) => (
                <div
                  key={equipe.id}
                  className="p-4 rounded-lg border border-[#E9ECEF] bg-[#F8F9FA]"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-[#212529]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                        {equipe.nom_equipe}
                      </p>
                      <p className="text-sm text-[#6C757D]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                        Score final: {equipe.score_final}
                      </p>
                    </div>
                    <Eye size={16} className="text-[#6C757D]" />
                  </div>
                </div>
              ))}
            </div>

            {/* Bouton de publication */}
            <div className="flex justify-center">
              {equipesPubliees > 0 ? (
                <button
                  onClick={() => depublierMutation.mutate()}
                  disabled={depublierMutation.isPending}
                  className="px-6 py-3 rounded-xl border-2 border-[#DC2626] text-[#DC2626] hover:bg-[#B91C1C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  <AlertCircle size={16} />
                  {depublierMutation.isPending ? 'Dépublication...' : 'Retirer de la page publique'}
                </button>
              ) : (
                <button
                  onClick={() => publierMutation.mutate()}
                  disabled={publierMutation.isPending}
                  className="px-6 py-3 rounded-xl bg-[#10B981] text-white hover:bg-[#059669] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  <Globe size={16} />
                  {publierMutation.isPending ? 'Publication...' : 'Publier les équipes sélectionnées'}
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SelectionFinale;
