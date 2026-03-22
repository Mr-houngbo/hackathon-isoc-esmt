import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import AttributionAuth from "@/components/auth/AttributionAuth";
import { toast } from "sonner";
import { Trophy, Users, CheckCircle, AlertCircle, ArrowRight, RefreshCw, Eye, Globe, UserPlus, Shield, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

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

interface NoteDetail {
  comite_nom: string;
  comite_id: string;
  score_total: number;
  notes_critere: {
    qualite_projet: number;
    motivation: number;
    clarte_problematique: number;
    faisabilite: number;
    competences_techniques: number;
    coherence_profil: number;
  };
  soumis: boolean;
  date_soumission: string;
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

const Attribution = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [selectedIndividus, setSelectedIndividus] = useState<string[]>([]);
  const [nomEquipe, setNomEquipe] = useState('');
  const [expandedNotes, setExpandedNotes] = useState<string | null>(null);
  const [selectedEquipeForNotes, setSelectedEquipeForNotes] = useState<string | null>(null);

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
      // Récupérer les équipes individuelles sélectionnées avec leurs notes
      const { data: equipesData, error: equipesError } = await supabase
        .from("equipes")
        .select(`
          id,
          nom_equipe,
          type_candidature,
          statut
        `)
        .eq("type_candidature", "individuel")
        .eq("statut", "selectionne")
        .order("created_at", { ascending: false });
      
      if (equipesError) throw equipesError;
      
      // Si pas d'équipes, retourner un tableau vide
      if (!equipesData || equipesData.length === 0) {
        return [];
      }
      
      // Récupérer les notes pour chaque équipe individuellement
      const equipesAvecNotes = await Promise.all(
        equipesData.map(async (equipe) => {
          // Récupérer les notes soumises pour cette équipe
          const { data: notesData } = await supabase
            .from("notes")
            .select("score_total")
            .eq("equipe_id", equipe.id)
            .eq("soumis", true);
          
          // Calculer le score moyen
          const scoreMoyen = notesData && notesData.length > 0 
            ? Math.round(notesData.reduce((sum, note) => sum + note.score_total, 0) / notesData.length)
            : 0;
          
          // Récupérer le chef de l'équipe
          const { data: chefData } = await supabase
            .from("membres")
            .select("nom_prenom, filiere, niveau_etudes")
            .eq("equipe_id", equipe.id)
            .eq("role_equipe", "Chef de projet")
            .limit(1)
            .maybeSingle(); // maybeSingle pour éviter l'erreur si pas de chef
          
          return {
            id: equipe.id,
            nom_equipe: equipe.nom_equipe,
            type_candidature: equipe.type_candidature,
            statut: equipe.statut,
            score_final: scoreMoyen,
            chef: chefData || undefined
          };
        })
      );
      
      return equipesAvecNotes as EquipeIndividuelle[];
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

      try {
        // 1. Créer la nouvelle équipe
        const { data: nouvelleEquipe } = await supabase
          .from("equipes")
          .insert({
            type_candidature: 'equipe',
            nom_equipe: nomEquipe.trim(),
            nombre_membres: 4,
            statut: 'selectionne'
          })
          .select()
          .single();

        if (!nouvelleEquipe) throw new Error("Erreur lors de la création de l'équipe");

        // 2. Rattacher les 4 membres à la nouvelle équipe
        for (let i = 0; i < selectedIndividus.length; i++) {
          const individuId = selectedIndividus[i];
          
          // Récupérer tous les membres de l'équipe individuelle
          const { data: membres } = await supabase
            .from("membres")
            .select("*")
            .eq("equipe_id", individuId);
          
          if (!membres || membres.length === 0) continue;

          // Mettre à jour le premier membre comme chef, les autres comme participants
          for (let j = 0; j < membres.length; j++) {
            const membre = membres[j];
            await supabase
              .from("membres")
              .update({
                equipe_id: nouvelleEquipe.id,
                est_chef: i === 0 && j === 0, // premier du premier individu = chef
                role_equipe: membre.competences && membre.competences.length > 0 
                  ? membre.competences[0] 
                  : 'Participant'
              })
              .eq("id", membre.id);
          }

          // Supprimer l'ancienne équipe individuelle
          await supabase
            .from("equipes")
            .delete()
            .eq("id", individuId);
        }

        return nouvelleEquipe;
      } catch (error) {
        console.error("Erreur détaillée lors du regroupement:", error);
        throw new Error(`Erreur lors du regroupement: ${error.message}`);
      }
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

  // Récupérer les détails des notes pour une équipe
  const { data: notesDetails, isLoading: isLoadingNotes } = useQuery({
    queryKey: ["notes-details", selectedEquipeForNotes],
    queryFn: async () => {
      if (!selectedEquipeForNotes) return [];
      
      const { data, error } = await supabase
        .from("notes")
        .select(`
          *,
          comite:comite_id (
            nom_prenom,
            email
          )
        `)
        .eq("equipe_id", selectedEquipeForNotes)
        .eq("soumis", true)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as any[];
    },
    enabled: !!selectedEquipeForNotes,
  });

  // Obtenir le statut d'une équipe
  const getStatutInfo = (rang: number) => {
    if (rang < 40) return { status: 'selectionne', color: 'text-green-600', bgColor: 'bg-green-100', label: 'Sélectionné' };
    if (rang < 50) return { status: 'en_attente', color: 'text-orange-600', bgColor: 'bg-orange-100', label: 'Liste d\'attente' };
    return { status: 'non_selectionne', color: 'text-red-600', bgColor: 'bg-red-100', label: 'Non sélectionné' };
  };

  // Vérifier si une équipe est publiée
  const equipesPubliees = classement?.filter((e: any) => {
    console.log('Équipe:', e);
    return (e as any).publiee === true;
  }).length || 0;

  return (
    <AttributionAuth>
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-orange-900 to-red-950">
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
                  onClick={() => navigate("/admin/dashboard")}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-600 text-white hover:bg-gray-700 transition-colors"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  <ArrowRight size={16} className="rotate-180" />
                  Retour à l'admin
                </button>
                <button
                  onClick={() => refetch()}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#24366E] text-white hover:bg-[#2E4A8C] transition-colors"
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
                      Équipe / Candidat
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-[#212529]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                      Type de candidature
                    </th>
                    <th className="text-center py-3 px-4 font-semibold text-[#212529]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                      Nombre d'évaluateurs
                    </th>
                    <th className="text-center py-3 px-4 font-semibold text-[#212529]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                      Score moyen /100
                    </th>
                    <th className="text-center py-3 px-4 font-semibold text-[#212529]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                      Bonus équipe
                    </th>
                    <th className="text-center py-3 px-4 font-semibold text-[#212529]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                      Score final
                    </th>
                    <th className="text-center py-3 px-4 font-semibold text-[#212529]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                      Voir les notes
                    </th>
                    <th className="text-center py-3 px-4 font-semibold text-[#212529]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                      Statut final
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
                          <p className="font-medium text-[#212529]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                            {item.nom_equipe}
                          </p>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${
                            item.type_candidature === 'equipe' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                          }`} style={{ fontFamily: 'DM Sans, sans-serif' }}>
                            {item.type_candidature === 'equipe' ? 'Équipe' : 'Individuel'}
                          </span>
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
                          <span className="font-bold text-lg text-[#24366E]" style={{ fontFamily: 'Sora, sans-serif' }}>
                            {(item as any).score_final}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Dialog>
                            <DialogTrigger asChild>
                              <button
                                onClick={() => setSelectedEquipeForNotes((item as any).id)}
                                className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                                style={{ fontFamily: 'DM Sans, sans-serif' }}
                              >
                                <Eye size={12} />
                                Voir ({(item as any).nb_evaluateurs})
                              </button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-gradient-to-br from-slate-50 to-blue-50 border-0 shadow-2xl">
                              <DialogHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 -m-6 mb-6 rounded-t-xl">
                                <DialogTitle className="text-xl font-bold text-white">
                                  📊 Détails des notes - {(item as any).nom_equipe}
                                </DialogTitle>
                                <DialogDescription className="text-blue-100">
                                  Notes détaillées attribuées par les membres du comité de sélection
                                </DialogDescription>
                              </DialogHeader>
                              
                              <div className="mt-6 space-y-4 px-2">
                                {isLoadingNotes ? (
                                  <div className="text-center py-12">
                                    <div className="inline-block w-8 h-8 border-3 border-blue-600 border-t-transparent animate-spin rounded-full"></div>
                                    <p className="mt-4 text-gray-600 font-medium">Chargement des notes...</p>
                                  </div>
                                ) : notesDetails && notesDetails.length > 0 ? (
                                  notesDetails.map((note: any, index: number) => (
                                    <div key={note.id} className="bg-white/80 backdrop-blur-sm border border-blue-100 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                                      <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center space-x-3">
                                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                                            {note.comite?.nom_prenom?.charAt(0) || 'M'}
                                          </div>
                                          <div>
                                            <h4 className="font-bold text-gray-800 text-lg">
                                              {note.comite?.nom_prenom || 'Membre du comité'}
                                            </h4>
                                            <p className="text-sm text-gray-600">{note.comite?.email}</p>
                                          </div>
                                        </div>
                                        <div className="text-right">
                                          <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                            {note.score_total}/100
                                          </div>
                                          <div className="text-xs text-gray-500 mt-1">
                                            {new Date(note.created_at).toLocaleDateString('fr-FR', { 
                                              day: 'numeric', 
                                              month: 'long', 
                                              year: 'numeric' 
                                            })}
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-200">
                                          <div className="text-xs text-blue-600 font-medium mb-1">🎯 Qualité du projet</div>
                                          <div className="font-bold text-blue-800 text-lg">{note.qualite_projet || 0}/25</div>
                                        </div>
                                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-3 rounded-lg border border-green-200">
                                          <div className="text-xs text-green-600 font-medium mb-1">💪 Motivation</div>
                                          <div className="font-bold text-green-800 text-lg">{note.motivation || 0}/20</div>
                                        </div>
                                        <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-3 rounded-lg border border-purple-200">
                                          <div className="text-xs text-purple-600 font-medium mb-1">🔍 Clarté problématique</div>
                                          <div className="font-bold text-purple-800 text-lg">{note.clarte_problematique || 0}/20</div>
                                        </div>
                                        <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-3 rounded-lg border border-orange-200">
                                          <div className="text-xs text-orange-600 font-medium mb-1">⚙️ Faisabilité technique</div>
                                          <div className="font-bold text-orange-800 text-lg">{note.faisabilite || 0}/15</div>
                                        </div>
                                        <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-3 rounded-lg border border-pink-200">
                                          <div className="text-xs text-pink-600 font-medium mb-1">🛠️ Compétences techniques</div>
                                          <div className="font-bold text-pink-800 text-lg">{note.competences_techniques || 0}/10</div>
                                        </div>
                                        <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-3 rounded-lg border border-teal-200">
                                          <div className="text-xs text-teal-600 font-medium mb-1">🎨 Cohérence du profil</div>
                                          <div className="font-bold text-teal-800 text-lg">{note.coherence_profil || 0}/10</div>
                                        </div>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                      <AlertCircle size={32} className="text-gray-400" />
                                    </div>
                                    <p className="text-gray-500 text-lg font-medium">Aucune note trouvée pour cette équipe</p>
                                    <p className="text-gray-400 text-sm mt-2">Les membres du comité n'ont pas encore évalué cette équipe</p>
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
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
                          ? 'border-[#FEEB09] bg-[#FEEB09]/10'
                          : 'border-[#E9ECEF] hover:border-[#FEEB09]/30'
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
                          <CheckCircle size={16} className="text-[#FEEB09]" />
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
                      className="w-full px-4 py-3 rounded-xl border border-[#E9ECEF] bg-white text-[#212529] focus:outline-none focus:ring-2 focus:ring-[#FEEB09]/20 focus:border-[#FEEB09]/50"
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
                    className="w-full px-4 py-3 rounded-xl bg-[#FEEB09] text-white hover:bg-[#FEEB09] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
            className="bg-red-800/50 backdrop-blur-xl rounded-2xl border border-red-700/30 p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 
                className="font-display text-xl font-bold text-white"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                Publication des Équipes Sélectionnées
              </h2>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  equipesPubliees > 0 ? 'bg-green-400' : 'bg-red-400'
                }`}></div>
                <span className="text-sm text-red-300" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                  {equipesPubliees > 0 ? `${equipesPubliees} équipes en ligne` : 'Aucune équipe en ligne'}
                </span>
              </div>
            </div>

            <p 
              className="text-red-300/70 mb-6"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              Vérifiez la liste avant de publier sur la page publique
            </p>

            {/* Aperçu des équipes sélectionnées */}
            <div className="space-y-3 max-h-64 overflow-y-auto mb-6">
              {classement?.filter(e => e.statut === 'selectionne').map((equipe) => (
                <div
                  key={equipe.id}
                  className="p-4 rounded-lg border border-red-700/30 bg-red-900/30"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                        {equipe.nom_equipe}
                      </p>
                      <p className="text-sm text-red-300/70" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                        Score final: {equipe.score_final}
                      </p>
                    </div>
                    <Eye size={16} className="text-red-400" />
                  </div>
                </div>
              ))}
            </div>

            {/* Bouton de publication */}
            <div className="flex justify-center gap-4">
              {/* Bouton de test pour dépublication */}
              <button
                onClick={() => depublierMutation.mutate()}
                disabled={depublierMutation.isPending}
                className="px-6 py-3 rounded-xl border-2 border-red-500 text-red-300 hover:bg-red-800/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                <AlertCircle size={16} />
                {depublierMutation.isPending ? 'Dépublication...' : 'Retirer de la page publique (TEST)'}
              </button>
              
              {/* Logique originale */}
              {equipesPubliees > 0 ? (
                <button
                  onClick={() => depublierMutation.mutate()}
                  disabled={depublierMutation.isPending}
                  className="px-6 py-3 rounded-xl border-2 border-red-500 text-red-300 hover:bg-red-800/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  <AlertCircle size={16} />
                  {depublierMutation.isPending ? 'Dépublication...' : 'Retirer de la page publique'}
                </button>
              ) : (
                <button
                  onClick={() => publierMutation.mutate()}
                  disabled={publierMutation.isPending}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-600 to-green-500 text-white hover:from-green-500 hover:to-green-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-green-500/25"
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
    </AttributionAuth>
  );
};

export default Attribution;
