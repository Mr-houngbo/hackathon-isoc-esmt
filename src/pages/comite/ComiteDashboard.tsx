import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useComiteAuth } from "@/context/ComiteAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  Users, 
  TrendingUp,
  Calendar,
  Download,
  Eye,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  Target,
  Lightbulb,
  Layers,
  Award,
  BookOpen,
  Info,
  Crown,
  Tag,
  Smartphone,
  CheckCircle2,
  XCircle,
  Instagram,
  Linkedin,
  Sparkles,
  Heart,
  Megaphone
} from "lucide-react";

interface Assignment {
  id: string;
  equipe_id: string;
  equipe: {
    id: string;
    nom_equipe: string;
    nom_projet: string;
    type_candidature: string;
    created_at: string;
  };
  notes?: {
    id: string;
    soumis: boolean;
    score_total: number;
  } | null; // Mis à jour pour le nouveau format
}

const ComiteDashboard = () => {
  const { comiteMember } = useComiteAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [stats, setStats] = useState({
    totalAssignments: 0,
    completedEvaluations: 0,
    pendingEvaluations: 0,
    averageScore: 0
  });

  useEffect(() => {
    if (comiteMember) {
      fetchAssignments();
    }
  }, [comiteMember]);

  const fetchAssignments = async () => {
    try {
      // Récupérer les assignments d'abord
      const { data: assignments, error: assignmentsError } = await supabase
        .from('assignments')
        .select(`
          *,
          equipe:equipes(
            id,
            nom_equipe,
            nom_projet,
            type_candidature,
            created_at
          )
        `)
        .eq('comite_id', comiteMember?.id);

      if (assignmentsError) throw assignmentsError;
      
      // Récupérer les notes séparément pour chaque assignment
      const assignmentsWithNotes = await Promise.all(
        (assignments || []).map(async (assignment) => {
          const { data: notes, error: notesError } = await supabase
            .from('notes')
            .select('id, soumis, score_total')
            .eq('comite_id', comiteMember?.id)
            .eq('equipe_id', assignment.equipe_id)
            .maybeSingle();

          return {
            ...assignment,
            notes: notesError ? null : notes
          };
        })
      );
      
      setAssignments(assignmentsWithNotes || []);
      
      // Calculer les statistiques
      const total = assignmentsWithNotes?.length || 0;
      const completed = assignmentsWithNotes?.filter(a => a.notes && a.notes.soumis).length || 0;
      const pending = total - completed;
      const avgScore = 0; // Simplifié pour l'instant

      setStats({
        totalAssignments: total,
        completedEvaluations: completed,
        pendingEvaluations: pending,
        averageScore: avgScore
      });
    } catch (error) {
      console.error('Erreur lors du chargement des dossiers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignmentDetails = async (assignment: Assignment) => {
    try {
      const { data: equipeDetails, error } = await supabase
        .from('equipes')
        .select(`
          *,
          membres(
            nom_prenom,
            genre,
            filiere,
            niveau_etudes,
            role_equipe,
            telephone,
            email,
            etablissement,
            competences,
            competence_autre,
            disponible_2_jours,
            accepte_conditions,
            autorise_photos,
            est_chef
          )
        `)
        .eq('id', assignment.equipe.id)
        .single();

      if (error) throw error;
      
      setSelectedAssignment({
        ...assignment,
        equipe: equipeDetails
      });
    } catch (error) {
      console.error('Erreur lors du chargement des détails:', error);
    }
  };

  const getStatusBadge = (assignment: Assignment) => {
    if (!assignment.notes) {
      return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">Non commencé</Badge>;
    }
    
    if (assignment.notes.soumis) {
      return <Badge variant="default" className="bg-green-600 text-white border-green-600">Soumis</Badge>;
    }
    
    return <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500/30">En cours</Badge>;
  };

  const getProgressValue = (assignment: Assignment) => {
    if (!assignment.notes) return 0;
    if (assignment.notes.soumis) return 100;
    
    return 50; // Simplifié pour l'instant
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-blue-300">Chargement de vos dossiers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Tableau de bord</h1>
            <p className="text-blue-300/70 mt-2">
              Gérez l'évaluation des dossiers qui vous ont été assignés
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-blue-300/70">Dernière synchronisation</p>
            <p className="text-xs text-blue-400/50">{new Date().toLocaleString('fr-FR')}</p>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-blue-900/50 border-blue-700/30 backdrop-blur-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-blue-200 text-sm font-medium flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              Dossiers assignés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalAssignments}</div>
            <p className="text-xs text-blue-300/70 mt-1">Total à évaluer</p>
          </CardContent>
        </Card>

        <Card className="bg-blue-900/50 border-blue-700/30 backdrop-blur-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-green-400 text-sm font-medium flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Évaluations terminées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.completedEvaluations}</div>
            <p className="text-xs text-blue-300/70 mt-1">Dossiers soumis</p>
          </CardContent>
        </Card>

        <Card className="bg-blue-900/50 border-blue-700/30 backdrop-blur-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-yellow-400 text-sm font-medium flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              En attente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.pendingEvaluations}</div>
            <p className="text-xs text-blue-300/70 mt-1">Dossiers restants</p>
          </CardContent>
        </Card>

        <Card className="bg-blue-900/50 border-blue-700/30 backdrop-blur-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-purple-400 text-sm font-medium flex items-center">
              <TrendingUp className="w-4 h-4 mr-2" />
              Score moyen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.averageScore}</div>
            <p className="text-xs text-blue-300/70 mt-1">Sur 100 points</p>
          </CardContent>
        </Card>
      </div>

      {/* Progression globale */}
      <Card className="bg-blue-900/50 border-blue-700/30 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Progression globale
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-blue-300">Avancement général</span>
              <span className="text-white font-medium">
                {stats.totalAssignments > 0 ? Math.round((stats.completedEvaluations / stats.totalAssignments) * 100) : 0}%
              </span>
            </div>
            <Progress 
              value={stats.totalAssignments > 0 ? (stats.completedEvaluations / stats.totalAssignments) * 100 : 0}
              className="h-2 bg-blue-800/50"
            />
          </div>
          <p className="text-xs text-blue-300/70">
            {stats.completedEvaluations} sur {stats.totalAssignments} dossiers évalués
          </p>
        </CardContent>
      </Card>

      {/* Liste des dossiers */}
      <Card className="bg-blue-900/50 border-blue-700/30 backdrop-blur-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Mes dossiers à évaluer
            </CardTitle>
            <Badge variant="outline" className="bg-blue-800/50 text-blue-300 border-blue-600/30">
              {assignments.length} dossier{assignments.length > 1 ? 's' : ''}
            </Badge>
          </div>
          <CardDescription className="text-blue-300/70">
            Cliquez sur un dossier pour commencer ou continuer l'évaluation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {assignments.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-blue-400/50 mx-auto mb-4" />
              <p className="text-blue-300/70">Aucun dossier assigné pour le moment</p>
              <p className="text-xs text-blue-400/50 mt-2">
                Les dossiers vous seront assignés par l'administrateur
              </p>
            </div>
          ) : (
            assignments.map((assignment) => (
              <div
                key={assignment.id}
                className="bg-blue-800/30 rounded-lg p-4 border border-blue-700/30 hover:bg-blue-800/40 transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-white font-medium mb-1">
                      {assignment.equipe.nom_equipe || 'Équipe sans nom'}
                    </h3>
                    <p className="text-blue-300/70 text-sm">
                      {assignment.equipe.nom_projet || 'Projet sans titre'}
                    </p>
                    <div className="flex items-center space-x-4 mt-2">
                      <Badge variant="outline" className="bg-blue-700/30 text-blue-300 border-blue-600/30 text-xs">
                        {assignment.equipe.type_candidature}
                      </Badge>
                      <span className="text-xs text-blue-400/50 flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(assignment.equipe.created_at).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getStatusBadge(assignment)}
                  </div>
                </div>

                {/* Progression */}
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-blue-300/70">Progression</span>
                    <span className="text-blue-300">{Math.round(getProgressValue(assignment))}%</span>
                  </div>
                  <Progress 
                    value={getProgressValue(assignment)}
                    className="h-1 bg-blue-800/50"
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {assignment.notes && (
                      <span className="text-xs text-blue-400/50">
                        Score actuel: {assignment.notes.score_total || 0}/100
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-blue-800/50 border-blue-600/30 text-blue-300 hover:bg-blue-700/50 hover:text-white"
                          onClick={() => fetchAssignmentDetails(assignment)}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Aperçu
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-blue-900/95 border-blue-700/30 backdrop-blur-xl max-w-5xl max-h-[85vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="text-white flex items-center gap-2">
                            <FileText className="w-5 h-5 text-blue-400" />
                            Dossier complet - {selectedAssignment?.equipe?.nom_equipe || 'Équipe sans nom'}
                          </DialogTitle>
                          <DialogDescription className="text-blue-300/70">
                            Consultation complète de la candidature avec toutes les informations soumises
                          </DialogDescription>
                        </DialogHeader>
                        {selectedAssignment && (
                          <div className="space-y-6">
                            {/* === SECTION 1: INFOS GÉNÉRALES === */}
                            <div className="bg-blue-800/20 rounded-xl p-5 border border-blue-700/30">
                              <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                                <Info className="w-4 h-4 text-blue-400" />
                                Informations générales
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="bg-blue-900/40 rounded-lg p-3">
                                  <span className="text-blue-300/70 text-xs uppercase tracking-wider">Nom de l'équipe</span>
                                  <p className="text-white font-medium mt-1">{selectedAssignment.equipe?.nom_equipe || 'Non spécifié'}</p>
                                </div>
                                <div className="bg-blue-900/40 rounded-lg p-3">
                                  <span className="text-blue-300/70 text-xs uppercase tracking-wider">Type</span>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="outline" className="bg-blue-800/50 text-blue-200 border-blue-600/30 capitalize">
                                      {(selectedAssignment.equipe as any)?.type_candidature}
                                    </Badge>
                                    <span className="text-white text-sm">
                                      ({(selectedAssignment.equipe as any)?.nombre_membres || 1} membre{(selectedAssignment.equipe as any)?.nombre_membres > 1 ? 's' : ''})
                                    </span>
                                  </div>
                                </div>
                                <div className="bg-blue-900/40 rounded-lg p-3">
                                  <span className="text-blue-300/70 text-xs uppercase tracking-wider">Date de soumission</span>
                                  <p className="text-white font-medium mt-1 flex items-center">
                                    <Calendar className="w-3 h-3 mr-1 text-blue-400" />
                                    {new Date(selectedAssignment.equipe?.created_at).toLocaleDateString('fr-FR')}
                                  </p>
                                </div>
                                <div className="bg-blue-900/40 rounded-lg p-3">
                                  <span className="text-blue-300/70 text-xs uppercase tracking-wider">A un projet ?</span>
                                  <p className="text-white font-medium mt-1 capitalize">{(selectedAssignment.equipe as any)?.a_projet || 'Non spécifié'}</p>
                                </div>
                                <div className="bg-blue-900/40 rounded-lg p-3">
                                  <span className="text-blue-300/70 text-xs uppercase tracking-wider">Source d'information</span>
                                  <p className="text-white font-medium mt-1 flex items-center">
                                    <Megaphone className="w-3 h-3 mr-1 text-blue-400" />
                                    {(selectedAssignment.equipe as any)?.source_info || 'Non spécifiée'}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* === SECTION 2: PROJET === */}
                            {(selectedAssignment.equipe as any)?.nom_projet && (
                              <div className="bg-blue-800/20 rounded-xl p-5 border border-blue-700/30">
                                <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                                  <Lightbulb className="w-4 h-4 text-yellow-400" />
                                  Détails du projet
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                  <div className="bg-blue-900/40 rounded-lg p-3">
                                    <span className="text-blue-300/70 text-xs uppercase tracking-wider">Nom du projet</span>
                                    <p className="text-white font-medium mt-1">{(selectedAssignment.equipe as any).nom_projet}</p>
                                  </div>
                                  <div className="bg-blue-900/40 rounded-lg p-3">
                                    <span className="text-blue-300/70 text-xs uppercase tracking-wider">Domaine</span>
                                    <p className="text-white font-medium mt-1 flex items-center">
                                      <Target className="w-3 h-3 mr-1 text-blue-400" />
                                      {(selectedAssignment.equipe as any).domaine_projet || 'Non spécifié'}
                                    </p>
                                  </div>
                                  {(selectedAssignment.equipe as any).niveau_avancement && (
                                    <div className="bg-blue-900/40 rounded-lg p-3">
                                      <span className="text-blue-300/70 text-xs uppercase tracking-wider">Niveau d'avancement</span>
                                      <p className="text-white font-medium mt-1 capitalize">
                                        {(selectedAssignment.equipe as any).niveau_avancement}
                                      </p>
                                    </div>
                                  )}
                                  {(selectedAssignment.equipe as any).niveau_technique && (
                                    <div className="bg-blue-900/40 rounded-lg p-3">
                                      <span className="text-blue-300/70 text-xs uppercase tracking-wider">Niveau technique</span>
                                      <p className="text-white font-medium mt-1 capitalize">
                                        {(selectedAssignment.equipe as any).niveau_technique}
                                      </p>
                                    </div>
                                  )}
                                </div>

                                {(selectedAssignment.equipe as any).problematique && (
                                  <div className="mb-4">
                                    <h5 className="text-blue-300 text-sm mb-2 flex items-center gap-1">
                                      <Target className="w-3 h-3" />
                                      Problématique
                                    </h5>
                                    <p className="text-white bg-blue-900/40 rounded-lg p-3 text-sm leading-relaxed">
                                      {(selectedAssignment.equipe as any).problematique}
                                    </p>
                                  </div>
                                )}

                                {(selectedAssignment.equipe as any).solution && (
                                  <div className="mb-4">
                                    <h5 className="text-blue-300 text-sm mb-2 flex items-center gap-1">
                                      <Sparkles className="w-3 h-3" />
                                      Solution proposée
                                    </h5>
                                    <p className="text-white bg-blue-900/40 rounded-lg p-3 text-sm leading-relaxed">
                                      {(selectedAssignment.equipe as any).solution}
                                    </p>
                                  </div>
                                )}

                                {/* Technologies */}
                                {(selectedAssignment.equipe as any).technologies && (
                                  <div className="mb-4">
                                    <h5 className="text-blue-300 text-sm mb-2 flex items-center gap-1">
                                      <Layers className="w-3 h-3" />
                                      Technologies envisagées
                                    </h5>
                                    <p className="text-white bg-blue-900/40 rounded-lg p-3 text-sm">
                                      {(selectedAssignment.equipe as any).technologies}
                                    </p>
                                  </div>
                                )}

                                {(selectedAssignment.equipe as any).contraintes_techniques && (
                                  <div>
                                    <h5 className="text-blue-300 text-sm mb-2">Contraintes techniques</h5>
                                    <p className="text-white bg-blue-900/40 rounded-lg p-3 text-sm">
                                      {(selectedAssignment.equipe as any).contraintes_techniques}
                                    </p>
                                  </div>
                                )}

                                {/* Compétences équipe */}
                                {(selectedAssignment.equipe as any).competences_equipe?.length > 0 && (
                                  <div className="mt-4 pt-4 border-t border-blue-700/30">
                                    <h5 className="text-blue-300 text-sm mb-2 flex items-center gap-1">
                                      <Award className="w-3 h-3" />
                                      Compétences de l'équipe
                                    </h5>
                                    <div className="flex flex-wrap gap-2">
                                      {(selectedAssignment.equipe as any).competences_equipe.map((comp: string, idx: number) => (
                                        <span key={idx} className="px-3 py-1 bg-blue-700/50 text-blue-200 rounded-full text-xs">
                                          {comp}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* === SECTION 3: MOTIVATION & ESPÉRANCES === */}
                            <div className="bg-blue-800/20 rounded-xl p-5 border border-blue-700/30">
                              <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                                <Heart className="w-4 h-4 text-rose-400" />
                                Motivation & Attentes
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {(selectedAssignment.equipe as any).motivation && (
                                  <div>
                                    <h5 className="text-blue-300 text-sm mb-2">Motivation</h5>
                                    <p className="text-white bg-blue-900/40 rounded-lg p-3 text-sm leading-relaxed">
                                      {(selectedAssignment.equipe as any).motivation}
                                    </p>
                                  </div>
                                )}
                                {(selectedAssignment.equipe as any).esperances && (
                                  <div>
                                    <h5 className="text-blue-300 text-sm mb-2">Espérances</h5>
                                    <p className="text-white bg-blue-900/40 rounded-lg p-3 text-sm leading-relaxed">
                                      {(selectedAssignment.equipe as any).esperances}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* === SECTION 4: RÉSEAUX SOCIAUX === */}
                            {((selectedAssignment.equipe as any)?.handle_instagram || (selectedAssignment.equipe as any)?.handle_linkedin) && (
                              <div className="bg-blue-800/20 rounded-xl p-5 border border-blue-700/30">
                                <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                                  <Smartphone className="w-4 h-4 text-purple-400" />
                                  Réseaux sociaux
                                </h4>
                                <div className="flex flex-wrap gap-4">
                                  {(selectedAssignment.equipe as any).handle_instagram && (
                                    <a 
                                      href={`https://instagram.com/${(selectedAssignment.equipe as any).handle_instagram.replace('@', '')}`}
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg text-pink-300 hover:from-purple-600/30 hover:to-pink-600/30 transition-all"
                                    >
                                      <Instagram className="w-4 h-4" />
                                      @{(selectedAssignment.equipe as any).handle_instagram.replace('@', '')}
                                    </a>
                                  )}
                                  {(selectedAssignment.equipe as any).handle_linkedin && (
                                    <a 
                                      href={(selectedAssignment.equipe as any).handle_linkedin}
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-2 px-4 py-2 bg-blue-700/30 rounded-lg text-blue-300 hover:bg-blue-700/40 transition-all"
                                    >
                                      <Linkedin className="w-4 h-4" />
                                      LinkedIn
                                    </a>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* === SECTION 5: MEMBRES DÉTAILLÉS === */}
                            {selectedAssignment.equipe && 'membres' in selectedAssignment.equipe && 
                             (selectedAssignment.equipe as any).membres?.length > 0 && (
                              <div className="bg-blue-800/20 rounded-xl p-5 border border-blue-700/30">
                                <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                                  <Users className="w-4 h-4 text-green-400" />
                                  Membres de l'équipe ({(selectedAssignment.equipe as any).membres.length})
                                </h4>
                                <div className="space-y-4">
                                  {(selectedAssignment.equipe as any).membres.map((membre: any, index: number) => (
                                    <div key={index} className="bg-blue-900/40 rounded-xl p-4 border border-blue-700/30">
                                      {/* Header membre */}
                                      <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                                            <span className="text-white font-semibold text-sm">
                                              {membre.nom_prenom?.charAt(0).toUpperCase()}
                                            </span>
                                          </div>
                                          <div>
                                            <p className="text-white font-semibold flex items-center gap-2">
                                              {membre.nom_prenom}
                                              {membre.est_chef && (
                                                <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-xs">
                                                  <Crown className="w-3 h-3 mr-1" />
                                                  Chef
                                                </Badge>
                                              )}
                                            </p>
                                            <p className="text-blue-300/70 text-sm">{membre.role_equipe || 'Membre'}</p>
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          {membre.genre && (
                                            <Badge variant="outline" className="bg-blue-800/30 text-blue-300 border-blue-600/30 text-xs capitalize">
                                              {membre.genre}
                                            </Badge>
                                          )}
                                        </div>
                                      </div>

                                      {/* Informations détaillées */}
                                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {/* Contact */}
                                        <div className="space-y-2">
                                          <h6 className="text-blue-300/50 text-xs uppercase tracking-wider flex items-center gap-1">
                                            <Mail className="w-3 h-3" />
                                            Contact
                                          </h6>
                                          <p className="text-white text-sm flex items-center gap-1">
                                            <Mail className="w-3 h-3 text-blue-400" />
                                            {membre.email}
                                          </p>
                                          {membre.telephone && (
                                            <p className="text-white text-sm flex items-center gap-1">
                                              <Phone className="w-3 h-3 text-blue-400" />
                                              {membre.telephone}
                                            </p>
                                          )}
                                        </div>

                                        {/* Études */}
                                        <div className="space-y-2">
                                          <h6 className="text-blue-300/50 text-xs uppercase tracking-wider flex items-center gap-1">
                                            <GraduationCap className="w-3 h-3" />
                                            Formation
                                          </h6>
                                          <p className="text-white text-sm flex items-center gap-1">
                                            <BookOpen className="w-3 h-3 text-blue-400" />
                                            {membre.filiere}
                                          </p>
                                          <p className="text-white text-sm flex items-center gap-1">
                                            <Award className="w-3 h-3 text-blue-400" />
                                            {membre.niveau_etudes}
                                          </p>
                                          {membre.etablissement && (
                                            <p className="text-white text-sm flex items-center gap-1">
                                              <MapPin className="w-3 h-3 text-blue-400" />
                                              {membre.etablissement}
                                            </p>
                                          )}
                                        </div>

                                        {/* Compétences */}
                                        <div className="space-y-2">
                                          <h6 className="text-blue-300/50 text-xs uppercase tracking-wider flex items-center gap-1">
                                            <Briefcase className="w-3 h-3" />
                                            Compétences
                                          </h6>
                                          {membre.competences?.length > 0 && (
                                            <div className="flex flex-wrap gap-1">
                                              {membre.competences.map((comp: string, idx: number) => (
                                                <span key={idx} className="px-2 py-0.5 bg-blue-700/30 text-blue-200 rounded text-xs">
                                                  {comp}
                                                </span>
                                              ))}
                                            </div>
                                          )}
                                          {membre.competence_autre && (
                                            <p className="text-blue-300 text-xs italic">
                                              Autre: {membre.competence_autre}
                                            </p>
                                          )}
                                        </div>
                                      </div>

                                      {/* Engagements */}
                                      <div className="mt-3 pt-3 border-t border-blue-700/30 flex flex-wrap gap-3">
                                        <div className="flex items-center gap-1 text-xs">
                                          {membre.disponible_2_jours ? (
                                            <>
                                              <CheckCircle2 className="w-3 h-3 text-green-400" />
                                              <span className="text-green-300">Disponible 2 jours</span>
                                            </>
                                          ) : (
                                            <>
                                              <XCircle className="w-3 h-3 text-red-400" />
                                              <span className="text-red-300">Non disponible</span>
                                            </>
                                          )}
                                        </div>
                                        <div className="flex items-center gap-1 text-xs">
                                          {membre.accepte_conditions ? (
                                            <>
                                              <CheckCircle2 className="w-3 h-3 text-green-400" />
                                              <span className="text-green-300">Conditions acceptées</span>
                                            </>
                                          ) : (
                                            <>
                                              <XCircle className="w-3 h-3 text-red-400" />
                                              <span className="text-red-300">Conditions non acceptées</span>
                                            </>
                                          )}
                                        </div>
                                        <div className="flex items-center gap-1 text-xs">
                                          {membre.autorise_photos ? (
                                            <>
                                              <CheckCircle2 className="w-3 h-3 text-green-400" />
                                              <span className="text-green-300">Photos autorisées</span>
                                            </>
                                          ) : (
                                            <>
                                              <XCircle className="w-3 h-3 text-red-400" />
                                              <span className="text-red-300">Photos non autorisées</span>
                                            </>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    <Link to={`/comite/evaluation/${assignment.equipe_id}`}>
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-500 text-white"
                      >
                        {assignment.notes ? 'Continuer' : 'Commencer'}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ComiteDashboard;
