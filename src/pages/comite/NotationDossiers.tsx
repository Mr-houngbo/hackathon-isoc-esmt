import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ComiteLayout from "@/components/layout/ComiteLayout";
import CritereNote from "@/components/ui/CritereNote";
import { toast } from "sonner";
import { Save, FileText, Users, AlertCircle, CheckCircle, Clock, Edit } from "lucide-react";
import { motion } from "framer-motion";
import { NoteData, Equipe, Assignment } from "@/types/selection";

const NotationDossiers = () => {
  const queryClient = useQueryClient();
  const [selectedEquipe, setSelectedEquipe] = useState<string | null>(null);
  const [notes, setNotes] = useState<NoteData>({
    qualite_projet: null,
    motivation: null,
    clarte_problematique: null,
    faisabilite: null,
    competences_techniques: null,
    coherence_profil: null,
  });

  // Récupérer l'utilisateur connecté
  const { data: user } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;
      
      // Récupérer les infos du comité
      const { data: comiteMember } = await supabase
        .from('comite')
        .select('*')
        .eq('email', session.user.email)
        .single();
      
      return {
        ...session.user,
        ...comiteMember,
        role: 'comite'
      };
    },
  });

  // Récupérer les dossiers assignés au membre du comité
  const { data: assignments, isLoading: loadingAssignments } = useQuery({
    queryKey: ["comite-assignments", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from("assignments")
        .select(`
          *,
          equipe:equipes(*, membres(*))
        `)
        .eq("comite_id", user.id)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Assignment[];
    },
    enabled: !!user?.id,
  });

  // Récupérer les notes existantes pour l'équipe sélectionnée
  const { data: existingNotes, isLoading: loadingNotes } = useQuery({
    queryKey: ["notes", user?.id, selectedEquipe],
    queryFn: async () => {
      if (!user?.id || !selectedEquipe) return null;
      
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("comite_id", user.id)
        .eq("equipe_id", selectedEquipe)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!user?.id && !!selectedEquipe,
  });

  // Initialiser les notes quand on charge une équipe
  useEffect(() => {
    if (existingNotes) {
      setNotes({
        qualite_projet: existingNotes.qualite_projet,
        motivation: existingNotes.motivation,
        clarte_problematique: existingNotes.clarte_problematique,
        faisabilite: existingNotes.faisabilite,
        competences_techniques: existingNotes.competences_techniques,
        coherence_profil: existingNotes.coherence_profil,
      });
    } else {
      setNotes({
        qualite_projet: null,
        motivation: null,
        clarte_problematique: null,
        faisabilite: null,
        competences_techniques: null,
        coherence_profil: null,
      });
    }
  }, [existingNotes]);

  // Calculer le score total
  const scoreTotal = Object.values(notes).reduce((sum, note) => sum + (note || 0), 0);

  // Calculer le bonus équipe
  const calculateBonusEquipe = (equipe: Equipe) => {
    if (equipe.type_candidature !== 'equipe' || !equipe.membres) return 0;
    
    let bonus = 0;
    
    // Diversité des profils : +10 si >= 3 rôles différents
    const rolesDifferents = new Set(
      equipe.membres
        .filter(m => m.role_equipe && m.role_equipe !== 'Autre')
        .map(m => m.role_equipe)
    ).size;
    if (rolesDifferents >= 3) bonus += 10;
    
    // Complémentarité : +5 si >= 3 compétences différentes
    const competencesDifferentes = new Set(
      equipe.membres.flatMap(m => m.competences || [])
    ).size;
    if (competencesDifferentes >= 3) bonus += 5;
    
    // Parité : +5 si au moins 1 femme
    const hasFemme = equipe.membres.some(m => m.genre === 'femme');
    if (hasFemme) bonus += 5;
    
    return bonus;
  };

  const bonusEquipe = selectedEquipe ? 
    calculateBonusEquipe(assignments?.find(a => a.equipe_id === selectedEquipe)?.equipe) : 0;

  const scoreFinal = scoreTotal + bonusEquipe;

  // Sauvegarder le brouillon
  const saveDraftMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id || !selectedEquipe) return;
      
      const { error } = await supabase.from("notes").upsert({
        comite_id: user.id,
        equipe_id: selectedEquipe,
        ...notes,
        soumis: false,
        updated_at: new Date().toISOString(),
      });
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Brouillon sauvegardé avec succès");
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  // Soumettre la note
  const submitMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id || !selectedEquipe) return;
      
      // Vérifier que tous les critères sont remplis
      const allFilled = Object.values(notes).every(v => v !== null && v !== undefined);
      if (!allFilled) {
        throw new Error("Veuillez noter tous les critères avant de soumettre");
      }
      
      const { error } = await supabase.from("notes").upsert({
        comite_id: user.id,
        equipe_id: selectedEquipe,
        ...notes,
        soumis: true,
        updated_at: new Date().toISOString(),
      });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comite-assignments"] });
      toast.success("Note soumise avec succès !");
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  // Obtenir le statut d'une équipe
  const getEquipeStatus = (equipeId: string) => {
    const assignment = assignments?.find(a => a.equipe_id === equipeId);
    if (!assignment) return 'non_assigne';
    
    const note = assignment.equipe.id === selectedEquipe ? existingNotes : null;
    if (!note) return 'a_noter';
    if (note.soumis) return 'note';
    return 'modifiable';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'non_assigne': return 'bg-gray-100 text-gray-700';
      case 'a_noter': return 'bg-red-100 text-red-700';
      case 'note': return 'bg-green-100 text-green-700';
      case 'modifiable': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'non_assigne': return AlertCircle;
      case 'a_noter': return Clock;
      case 'note': return CheckCircle;
      case 'modifiable': return Edit;
      default: return AlertCircle;
    }
  };

  return (
    <ComiteLayout>
      <div className="p-6">
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
                Notation des Dossiers
              </h1>
              <p 
                className="text-[#6C757D]"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                Bonjour {user?.nom_prenom} • {assignments?.length || 0} dossier{assignments?.length > 1 ? 's' : ''} à évaluer
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Liste des dossiers */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <h2 
              className="font-display text-xl font-bold text-[#212529] mb-4"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              Mes Dossiers
            </h2>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {assignments?.map((assignment) => {
                const status = getEquipeStatus(assignment.equipe.id);
                const StatusIcon = getStatusIcon(status);
                
                return (
                  <div
                    key={assignment.equipe.id}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedEquipe === assignment.equipe.id
                        ? 'border-[#FF6B35] bg-[#FF6B35]/5'
                        : 'border-[#E9ECEF] hover:border-[#FF6B35]/30'
                    }`}
                    onClick={() => setSelectedEquipe(assignment.equipe.id)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 
                        className="font-semibold text-[#212529]"
                        style={{ fontFamily: 'DM Sans, sans-serif' }}
                      >
                        {assignment.equipe.nom_equipe || `Équipe ${assignment.equipe.id}`}
                      </h3>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(status)}`}>
                        <StatusIcon size={12} />
                        {status === 'non_assigne' && 'Non assigné'}
                        {status === 'a_noter' && 'À noter'}
                        {status === 'note' && 'Noté'}
                        {status === 'modifiable' && 'Modifiable'}
                      </span>
                    </div>
                    
                    <div className="space-y-1 text-sm text-[#6C757D]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                      <p>Type : {assignment.equipe.type_candidature}</p>
                      <p>Projet : {assignment.equipe.nom_projet || 'Non défini'}</p>
                      <p>Membres : {assignment.equipe.membres?.length || 0}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Détails et notation */}
          {selectedEquipe && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-2 space-y-6"
            >
              {(() => {
                const assignment = assignments?.find(a => a.equipe_id === selectedEquipe);
                const equipe = assignment?.equipe;
                
                if (!equipe) return null;
                
                return (
                  <>
                    {/* Résumé du dossier */}
                    <div className="bg-white rounded-2xl border border-[#E9ECEF] p-6 shadow-lg">
                      <h2 
                        className="font-display text-lg font-bold text-[#212529] mb-4 flex items-center gap-2"
                        style={{ fontFamily: 'Sora, sans-serif' }}
                      >
                        <FileText size={20} className="text-[#FF6B35]" />
                        Résumé du Dossier
                      </h2>
                      
                      <div className="space-y-3 text-sm">
                        <div>
                          <span className="font-semibold text-[#212529]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                            Type :
                          </span>
                          <span className="text-[#6C757D]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                            {equipe.type_candidature}
                          </span>
                        </div>
                        
                        <div>
                          <span className="font-semibold text-[#212529]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                            Projet :
                          </span>
                          <span className="text-[#6C757D]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                            {equipe.nom_projet || 'Non défini'}
                          </span>
                        </div>
                        
                        <div>
                          <span className="font-semibold text-[#212529]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                            Problématique :
                          </span>
                        </div>
                        <p className="text-[#6C757D] leading-relaxed bg-[#F8F9FA] p-3 rounded-lg" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                          {equipe.problematique}
                        </p>
                        
                        <div>
                          <span className="font-semibold text-[#212529]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                            Solution :
                          </span>
                        </div>
                        <p className="text-[#6C757D] leading-relaxed bg-[#F8F9FA] p-3 rounded-lg" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                          {equipe.solution}
                        </p>
                        
                        <div>
                          <span className="font-semibold text-[#212529]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                            Motivation :
                          </span>
                        </div>
                        <p className="text-[#6C757D] leading-relaxed bg-[#F8F9FA] p-3 rounded-lg" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                          {equipe.motivation}
                        </p>
                        
                        <div>
                          <span className="font-semibold text-[#212529]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                            Niveau technique :
                          </span>
                          <span className="text-[#6C757D]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                            {equipe.niveau_technique}
                          </span>
                        </div>
                        
                        {equipe.type_candidature === 'equipe' && equipe.membres && (
                          <div>
                            <span className="font-semibold text-[#212529]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                              Membres :
                            </span>
                            <div className="space-y-2 mt-2">
                              {equipe.membres.map((membre, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm bg-[#F8F9FA] p-2 rounded-lg">
                                  <Users size={14} className="text-[#1E3A5F]" />
                                  <div>
                                    <span className="font-medium text-[#212529]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                                      {membre.nom_prenom}
                                    </span>
                                    <span className="text-[#6C757D]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                                      • {membre.filiere} • {membre.niveau_etudes}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Grille de notation */}
                    <div className="bg-white rounded-2xl border border-[#E9ECEF] p-6 shadow-lg">
                      <h2 
                        className="font-display text-lg font-bold text-[#212529] mb-6"
                        style={{ fontFamily: 'Sora, sans-serif' }}
                      >
                        Grille de Notation
                      </h2>
                      
                      <div className="space-y-6">
                        <CritereNote
                          label="Qualité du projet / idée"
                          max={25}
                          description="Originalité, pertinence et impact potentiel de l'idée"
                          value={notes.qualite_projet}
                          onChange={(value) => setNotes({ ...notes, qualite_projet: value })}
                        />

                        <CritereNote
                          label="Motivation"
                          max={20}
                          description="Clarté et sincérité de la motivation exprimée"
                          value={notes.motivation}
                          onChange={(value) => setNotes({ ...notes, motivation: value })}
                        />

                        <CritereNote
                          label="Clarté de la problématique"
                          max={20}
                          description="La problématique est-elle bien identifiée et documentée ?"
                          value={notes.clarte_problematique}
                          onChange={(value) => setNotes({ ...notes, clarte_problematique: value })}
                        />

                        <CritereNote
                          label="Faisabilité en 48h"
                          max={15}
                          description="La solution est-elle réalisable dans le cadre du hackathon ?"
                          value={notes.faisabilite}
                          onChange={(value) => setNotes({ ...notes, faisabilite: value })}
                        />

                        <CritereNote
                          label="Compétences techniques"
                          max={10}
                          description="Le profil technique est-il adapté au projet ?"
                          value={notes.competences_techniques}
                          onChange={(value) => setNotes({ ...notes, competences_techniques: value })}
                        />

                        <CritereNote
                          label="Cohérence du profil"
                          max={10}
                          description="Le profil du candidat est-il cohérent avec les objectifs du hackathon ?"
                          value={notes.coherence_profil}
                          onChange={(value) => setNotes({ ...notes, coherence_profil: value })}
                        />
                      </div>

                      {/* Score en temps réel */}
                      <div className="mt-6 p-4 bg-gradient-to-r from-[#FF6B35]/10 to-[#1E3A5F]/10 rounded-xl border border-[#E9ECEF]">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-semibold text-[#212529]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                              Score actuel :
                            </span>
                            <span className="text-2xl font-bold text-[#FF6B35]" style={{ fontFamily: 'Sora, sans-serif' }}>
                              {scoreTotal}/100
                            </span>
                          </div>
                          
                          {equipe.type_candidature === 'equipe' && (
                            <div className="text-right">
                              <div className="text-sm text-[#6C757D]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                                Bonus équipe :
                              </div>
                              <div className="text-lg font-bold text-[#10B981]" style={{ fontFamily: 'Sora, sans-serif' }}>
                                +{bonusEquipe} pts
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-2 pt-2 border-t border-[#E9ECEF]">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-[#212529]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                              Score final :
                            </span>
                            <span className="text-2xl font-bold text-[#1E3A5F]" style={{ fontFamily: 'Sora, sans-serif' }}>
                              {scoreFinal}/100
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Boutons d'action */}
                      <div className="flex justify-end gap-3 mt-6">
                        <button
                          onClick={() => saveDraftMutation.mutate()}
                          disabled={saveDraftMutation.isPending}
                          className="px-4 py-2 rounded-xl border border-[#E9ECEF] text-[#6C757D] hover:bg-[#F8F9FA] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{ fontFamily: 'DM Sans, sans-serif' }}
                        >
                          {saveDraftMutation.isPending ? 'Sauvegarde...' : 'Sauvegarder brouillon'}
                        </button>
                        
                        <button
                          onClick={() => submitMutation.mutate()}
                          disabled={submitMutation.isPending}
                          className="px-6 py-2 rounded-xl bg-[#FF6B35] text-white hover:bg-[#FF8C42] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                          style={{ fontFamily: 'DM Sans, sans-serif' }}
                        >
                          {submitMutation.isPending ? 'Soumission...' : (
                            <>
                              <Save size={16} />
                              Soumettre la note
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          )}
        </div>
      </div>
    </ComiteLayout>
  );
};

export default NotationDossiers;
