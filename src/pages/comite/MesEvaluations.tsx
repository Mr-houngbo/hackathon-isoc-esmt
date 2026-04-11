import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useComiteAuth } from "@/context/ComiteAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Eye, 
  Calendar,
  Award,
  Lightbulb,
  Star,
  Target,
  Users,
  Building,
  Layers,
  ArrowRight,
  CheckCircle,
  Clock
} from "lucide-react";

interface Evaluation {
  id: string;
  equipe_id: string;
  nom_equipe: string;
  nom_projet: string;
  type_candidature: string;
  score_total: number;
  soumis: boolean;
  created_at: string;
  updated_at: string;
  notes: {
    qualite_projet: number;
    motivation: number;
    clarte_problematique: number;
    competences_techniques: number;
    competence_manageriale: number;
    appartenance_esmt: number;
    presence_feminine: number;
    pluridisciplinarite: number;
  };
}

const MesEvaluations = () => {
  const { comiteMember } = useComiteAuth();
  const navigate = useNavigate();
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    soumises: 0,
    brouillons: 0,
    moyenne: 0
  });

  useEffect(() => {
    if (comiteMember) {
      fetchEvaluations();
    }
  }, [comiteMember]);

  const fetchEvaluations = async () => {
    try {
      const { data, error } = await supabase
        .from("notes")
        .select(`
          *,
          equipe:equipe_id (
            nom_equipe,
            nom_projet,
            type_candidature
          )
        `)
        .eq("comite_id", comiteMember?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formattedEvaluations: Evaluation[] = data?.map((note: any) => ({
        id: note.id,
        equipe_id: note.equipe_id,
        nom_equipe: note.equipe?.nom_equipe || "Équipe sans nom",
        nom_projet: note.equipe?.nom_projet || "",
        type_candidature: note.equipe?.type_candidature || "equipe",
        score_total: note.score_total || 0,
        soumis: note.soumis,
        created_at: note.created_at,
        updated_at: note.updated_at,
        notes: {
          qualite_projet: note.qualite_projet || 0,
          motivation: note.motivation || 0,
          clarte_problematique: note.clarte_problematique || 0,
          competences_techniques: note.competences_techniques || 0,
          competence_manageriale: note.competence_manageriale || 0,
          appartenance_esmt: note.appartenance_esmt || 0,
          presence_feminine: note.presence_feminine || 0,
          pluridisciplinarite: note.pluridisciplinarite || 0
        }
      })) || [];

      setEvaluations(formattedEvaluations);

      // Calculer les statistiques
      const soumises = formattedEvaluations.filter(e => e.soumis).length;
      const totalScore = formattedEvaluations
        .filter(e => e.soumis)
        .reduce((sum, e) => sum + e.score_total, 0);
      
      setStats({
        total: formattedEvaluations.length,
        soumises,
        brouillons: formattedEvaluations.length - soumises,
        moyenne: soumises > 0 ? Math.round(totalScore / soumises) : 0
      });
    } catch (error) {
      console.error("Erreur lors du chargement des évaluations:", error);
    } finally {
      setLoading(false);
    }
  };

  const criteres = [
    { key: "qualite_projet", label: "Qualité du projet", max: 25, icon: Lightbulb, color: "blue" },
    { key: "motivation", label: "Motivation", max: 20, icon: Star, color: "green" },
    { key: "clarte_problematique", label: "Clarté problématique", max: 15, icon: Target, color: "purple" },
    { key: "competences_techniques", label: "Compétences techniques", max: 10, icon: Award, color: "pink" },
    { key: "competence_manageriale", label: "Compétence managériale", max: 10, icon: Building, color: "amber" },
    { key: "appartenance_esmt", label: "Appartenance ESMT", max: 5, icon: Users, color: "slate" },
    { key: "presence_feminine", label: "Présence féminine", max: 5, icon: Users, color: "orange" },
    { key: "pluridisciplinarite", label: "Pluridisciplinarité", max: 10, icon: Layers, color: "teal" }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-blue-300">Chargement de vos évaluations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Mes Évaluations</h1>
          <p className="text-blue-300/70">
            Historique des dossiers que vous avez évalués
          </p>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-900/50 border-blue-700/30 backdrop-blur-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300/70 text-sm">Total évaluations</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-900/30 border-green-700/30 backdrop-blur-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-300/70 text-sm">Soumises</p>
                <p className="text-2xl font-bold text-green-400">{stats.soumises}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-orange-900/30 border-orange-700/30 backdrop-blur-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-300/70 text-sm">Brouillons</p>
                <p className="text-2xl font-bold text-orange-400">{stats.brouillons}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-900/30 border-purple-700/30 backdrop-blur-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300/70 text-sm">Score moyen</p>
                <p className="text-2xl font-bold text-purple-400">{stats.moyenne}/100</p>
              </div>
              <Award className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des évaluations */}
      {evaluations.length === 0 ? (
        <Card className="bg-blue-900/50 border-blue-700/30 backdrop-blur-xl">
          <CardContent className="p-8 text-center">
            <FileText className="w-12 h-12 text-blue-400/50 mx-auto mb-4" />
            <p className="text-white font-medium mb-2">Aucune évaluation</p>
            <p className="text-blue-300/70 text-sm mb-4">
              Vous n'avez pas encore évalué de dossier
            </p>
            <Button 
              onClick={() => navigate("/comite/dashboard")}
              className="bg-blue-600 hover:bg-blue-500"
            >
              Aller au Dashboard
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {evaluations.map((evaluation) => (
            <Card 
              key={evaluation.id} 
              className={`border backdrop-blur-xl overflow-hidden ${
                evaluation.soumis 
                  ? "bg-blue-900/50 border-blue-700/30" 
                  : "bg-orange-900/30 border-orange-700/30"
              }`}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-white text-lg">
                        {evaluation.nom_equipe}
                      </CardTitle>
                      <Badge 
                        variant="outline" 
                        className={evaluation.soumis 
                          ? "bg-green-500/20 text-green-300 border-green-500/30" 
                          : "bg-orange-500/20 text-orange-300 border-orange-500/30"
                        }
                      >
                        {evaluation.soumis ? "Soumise" : "Brouillon"}
                      </Badge>
                    </div>
                    {evaluation.nom_projet && (
                      <p className="text-blue-300/70 text-sm">
                        Projet: {evaluation.nom_projet}
                      </p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-xs text-blue-300/50">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(evaluation.created_at).toLocaleDateString('fr-FR')}
                      </span>
                      <Badge variant="outline" className="bg-blue-800/30 text-blue-300 border-blue-600/30 capitalize text-xs">
                        {evaluation.type_candidature}
                      </Badge>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-3xl font-bold text-white">
                      {evaluation.score_total}
                      <span className="text-lg text-blue-300/70">/100</span>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => navigate(`/comite/evaluation/${evaluation.equipe_id}`)}
                      className="mt-2 bg-blue-800/50 border-blue-600/30 text-blue-300 hover:bg-blue-700/50 hover:text-white"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      {evaluation.soumis ? "Voir" : "Continuer"}
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {evaluation.soumis && (
                <CardContent className="pt-0">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {criteres.map((critere) => {
                      const value = evaluation.notes[critere.key as keyof typeof evaluation.notes] || 0;
                      const Icon = critere.icon;
                      return (
                        <div 
                          key={critere.key} 
                          className="bg-blue-800/30 rounded-lg p-2 border border-blue-700/30"
                        >
                          <div className="flex items-center gap-1 mb-1">
                            <Icon className="w-3 h-3 text-blue-400" />
                            <span className="text-xs text-blue-300/70 truncate">{critere.label}</span>
                          </div>
                          <div className="text-sm font-bold text-white">
                            {value}/{critere.max}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MesEvaluations;
