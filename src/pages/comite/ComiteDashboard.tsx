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
  Eye
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
            filiere,
            niveau_etudes,
            role_equipe,
            competences
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
                      <DialogContent className="bg-blue-900/95 border-blue-700/30 backdrop-blur-xl max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="text-white">
                            Aperçu du dossier - {selectedAssignment?.equipe?.nom_equipe || 'Équipe'}
                          </DialogTitle>
                          <DialogDescription className="text-blue-300/70">
                            Informations complètes du dossier de candidature
                          </DialogDescription>
                        </DialogHeader>
                        {selectedAssignment && (
                          <div className="space-y-6">
                            {/* Informations principales */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="text-white font-medium mb-2">Nom de l'équipe</h4>
                                <p className="text-blue-300">{selectedAssignment.equipe?.nom_equipe || 'Non spécifié'}</p>
                              </div>
                              <div>
                                <h4 className="text-white font-medium mb-2">Nom du projet</h4>
                                <p className="text-blue-300">{selectedAssignment.equipe?.nom_projet || 'Non spécifié'}</p>
                              </div>
                              <div>
                                <h4 className="text-white font-medium mb-2">Type de candidature</h4>
                                <Badge variant="outline" className="bg-blue-800/50 text-blue-300 border-blue-600/30">
                                  {selectedAssignment.equipe?.type_candidature}
                                </Badge>
                              </div>
                              <div>
                                <h4 className="text-white font-medium mb-2">Date de soumission</h4>
                                <p className="text-blue-300 flex items-center">
                                  <Calendar className="w-3 h-3 mr-1" />
                                  {new Date(selectedAssignment.equipe?.created_at).toLocaleDateString('fr-FR')}
                                </p>
                              </div>
                            </div>

                            {/* Description du projet */}
                            {selectedAssignment.equipe && 'problematique' in selectedAssignment.equipe && (
                              <div>
                                <h4 className="text-white font-medium mb-3">Description du projet</h4>
                                <div className="space-y-3">
                                  <div>
                                    <h5 className="text-blue-300 text-sm mb-1">Problématique</h5>
                                    <p className="text-white bg-blue-800/30 rounded-lg p-3 border border-blue-700/30">
                                      {(selectedAssignment.equipe as any).problematique || "Non spécifiée"}
                                    </p>
                                  </div>
                                  <div>
                                    <h5 className="text-blue-300 text-sm mb-1">Solution proposée</h5>
                                    <p className="text-white bg-blue-800/30 rounded-lg p-3 border border-blue-700/30">
                                      {(selectedAssignment.equipe as any).solution || "Non spécifiée"}
                                    </p>
                                  </div>
                                  <div>
                                    <h5 className="text-blue-300 text-sm mb-1">Motivation</h5>
                                    <p className="text-white bg-blue-800/30 rounded-lg p-3 border border-blue-700/30">
                                      {(selectedAssignment.equipe as any).motivation || "Non spécifiée"}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Membres de l'équipe */}
                            {selectedAssignment.equipe && 'membres' in selectedAssignment.equipe && 
                             (selectedAssignment.equipe as any).membres?.length > 0 && (
                              <div>
                                <h4 className="text-white font-medium mb-3">Membres de l'équipe</h4>
                                <div className="space-y-2">
                                  {(selectedAssignment.equipe as any).membres.map((membre: any, index: number) => (
                                    <div key={index} className="bg-blue-800/30 rounded-lg p-3 border border-blue-700/30">
                                      <p className="text-white font-medium">{membre.nom_prenom}</p>
                                      <p className="text-blue-300/70 text-sm">{membre.filiere} - {membre.niveau_etudes}</p>
                                      {membre.role_equipe && (
                                        <p className="text-blue-300/50 text-xs mt-1">Rôle: {membre.role_equipe}</p>
                                      )}
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
