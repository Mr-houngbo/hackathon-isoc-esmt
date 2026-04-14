import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Trophy, 
  TrendingUp,
  Users,
  Award,
  RefreshCw,
  Eye,
  AlertCircle,
  ArrowLeft,
  Target,
  Lightbulb,
  Star,
  Building,
  Layers,
  User,
  Edit3
} from "lucide-react";
import { motion } from "framer-motion";

interface Membre {
  nom_prenom: string;
  filiere: string;
  niveau_etudes: string;
  role_equipe: string;
}

interface ClassementItem {
  id: string;
  nom_equipe: string;
  type_candidature: string;
  statut: string;
  nb_evaluateurs: number;
  score_moyen: number;
  score_final: number;
  membres?: Membre[];
}

interface NoteDetail {
  id: string;
  comite_nom: string;
  score_total: number;
  qualite_projet: number;
  motivation: number;
  clarte_problematique: number;
  competences_techniques: number;
  competence_manageriale: number;
  appartenance_esmt: number;
  presence_feminine: number;
  pluridisciplinarite: number;
  created_at: string;
}

const ClassementIndividuels = () => {
  const navigate = useNavigate();
  const [classement, setClassement] = useState<ClassementItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEquipeForNotes, setSelectedEquipeForNotes] = useState<string | null>(null);
  const [notesDetails, setNotesDetails] = useState<NoteDetail[]>([]);
  const [loadingNotes, setLoadingNotes] = useState(false);

  useEffect(() => {
    fetchClassement();
  }, []);

  const fetchClassement = async () => {
    try {
      // Récupérer le classement des individuels
      const { data: classementData, error: classementError } = await (supabase as any)
        .from("vue_classement_selection")
        .select("*")
        .eq("type_candidature", "individuel")
        .order("score_final", { ascending: false });

      if (classementError) throw classementError;

      // Pour chaque individuel, récupérer ses membres
      const classementAvecMembres = await Promise.all(
        (classementData || []).map(async (item: any) => {
          const { data: membresData } = await supabase
            .from("membres")
            .select("nom_prenom, filiere, niveau_etudes, role_equipe")
            .eq("equipe_id", item.id);

          return {
            ...item,
            membres: membresData || []
          };
        })
      );

      setClassement(classementAvecMembres);
    } catch (error) {
      console.error("Erreur lors du chargement du classement:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotesDetails = async (equipeId: string) => {
    setLoadingNotes(true);
    try {
      const { data, error } = await supabase
        .from("notes")
        .select(`
          *,
          comite:comite_id (
            nom_prenom
          )
        `)
        .eq("equipe_id", equipeId)
        .eq("soumis", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      const formattedNotes: NoteDetail[] = data?.map((note: any) => ({
        id: note.id,
        comite_nom: note.comite?.nom_prenom || "Membre du comité",
        score_total: note.score_total || 0,
        qualite_projet: note.qualite_projet || 0,
        motivation: note.motivation || 0,
        clarte_problematique: note.clarte_problematique || 0,
        competences_techniques: note.competences_techniques || 0,
        competence_manageriale: note.competence_manageriale || 0,
        appartenance_esmt: note.appartenance_esmt || 0,
        presence_feminine: note.presence_feminine || 0,
        pluridisciplinarite: note.pluridisciplinarite || 0,
        created_at: note.created_at
      })) || [];

      setNotesDetails(formattedNotes);
    } catch (error) {
      console.error("Erreur lors du chargement des notes:", error);
    } finally {
      setLoadingNotes(false);
    }
  };

  const getStatutInfo = (rang: number) => {
    if (rang < 40) return { color: "text-green-600", bgColor: "bg-green-100", label: "Sélectionné" };
    if (rang < 50) return { color: "text-orange-600", bgColor: "bg-orange-100", label: "Liste d'attente" };
    return { color: "text-red-600", bgColor: "bg-red-100", label: "Non sélectionné" };
  };

  const criteres = [
    { key: "qualite_projet", label: "🎯 Qualité du projet", max: 25, color: "blue" },
    { key: "motivation", label: "💪 Motivation", max: 20, color: "green" },
    { key: "clarte_problematique", label: "🔍 Clarté problématique", max: 15, color: "purple" },
    { key: "competences_techniques", label: "🛠️ Compétences techniques", max: 10, color: "pink" },
    { key: "competence_manageriale", label: "💼 Compétence managériale", max: 10, color: "amber" },
    { key: "appartenance_esmt", label: "🏢 Appartenance ESMT", max: 5, color: "slate" },
    { key: "presence_feminine", label: "👩 Présence féminine", max: 5, color: "orange" },
    { key: "pluridisciplinarite", label: "🌈 Pluridisciplinarité", max: 10, color: "teal" }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-blue-300">Chargement du classement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/comite/dashboard")}
            className="text-blue-300 hover:text-white hover:bg-blue-800/50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Trophy className="w-6 h-6 text-purple-400" />
              Classement des Individuels
            </h1>
            <p className="text-blue-300/70">
              Vue du classement final des candidats individuels uniquement
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={() => {
            setLoading(true);
            fetchClassement();
          }}
          className="bg-blue-800/50 border-blue-600/30 text-blue-300 hover:bg-blue-700/50 hover:text-white"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Actualiser
        </Button>
      </div>

      {/* Légende */}
      <Card className="bg-blue-900/50 border-blue-700/30 backdrop-blur-xl">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-6 text-sm text-blue-300/70">
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
        </CardContent>
      </Card>

      {/* Tableau de classement */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-blue-900/50 border border-blue-700/30 backdrop-blur-xl rounded-2xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-blue-700/30 bg-blue-800/30">
                <th className="text-left py-4 px-4 font-semibold text-white">
                  Rang
                </th>
                <th className="text-left py-4 px-4 font-semibold text-white">
                  Candidat
                </th>
                <th className="text-left py-4 px-4 font-semibold text-white">
                  Type
                </th>
                <th className="text-center py-4 px-4 font-semibold text-white">
                  Évaluateurs
                </th>
                <th className="text-center py-4 px-4 font-semibold text-white">
                  Notes
                </th>
                <th className="text-center py-4 px-4 font-semibold text-white">
                  Statut
                </th>
                <th className="text-center py-4 px-4 font-semibold text-white">
                  Réévaluer
                </th>
              </tr>
            </thead>
            <tbody>
              {classement.map((item, index) => {
                const statutInfo = getStatutInfo(index);
                const hasEnoughEvaluators = item.nb_evaluateurs >= 2;

                return (
                  <tr
                    key={item.id}
                    className={`border-b border-blue-700/30 hover:bg-blue-800/20 transition-colors ${
                      index < 40 ? "bg-green-500/5" : 
                      index < 50 ? "bg-orange-500/5" : ""
                    }`}
                  >
                    <td className="py-4 px-4">
                      <span className={`font-bold text-lg ${
                        index < 3 ? "text-yellow-400" :
                        index < 40 ? "text-green-400" : 
                        index < 50 ? "text-orange-400" : "text-blue-300/70"
                      }`}>
                        {index === 0 && "🥇"}
                        {index === 1 && "🥈"}
                        {index === 2 && "🥉"}
                        {index > 2 && `#${index + 1}`}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-white">
                            {item.membres && item.membres.length > 0 
                              ? item.membres[0].nom_prenom 
                              : item.nom_equipe}
                          </p>
                          {item.membres && item.membres[0] && (
                            <p className="text-xs text-blue-300/70">
                              {item.membres[0].filiere} • {item.membres[0].niveau_etudes}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge 
                        variant="outline" 
                        className="bg-purple-500/20 text-purple-300 border-purple-500/30 capitalize"
                      >
                        Individuel
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <Badge 
                        variant="outline" 
                        className={`${
                          hasEnoughEvaluators 
                            ? "bg-green-500/20 text-green-300 border-green-500/30" 
                            : "bg-red-500/20 text-red-300 border-red-500/30"
                        }`}
                      >
                        {item.nb_evaluateurs}
                        {!hasEnoughEvaluators && (
                          <AlertCircle className="w-3 h-3 ml-1 inline" />
                        )}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedEquipeForNotes(item.id);
                              fetchNotesDetails(item.id);
                            }}
                            className="bg-blue-800/50 border-blue-600/30 text-blue-300 hover:bg-blue-700/50 hover:text-white"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Voir ({item.nb_evaluateurs})
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-gradient-to-br from-blue-900 to-blue-950 border-blue-700/30">
                          <DialogHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 -m-6 mb-6 rounded-t-xl">
                            <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
                              <TrendingUp className="w-5 h-5" />
                              📊 Détails des notes - {item.nom_equipe}
                            </DialogTitle>
                            <DialogDescription className="text-purple-100">
                              Notes détaillées attribuées par les membres du comité
                            </DialogDescription>
                          </DialogHeader>

                          <div className="mt-6 space-y-4">
                            {loadingNotes ? (
                              <div className="text-center py-12">
                                <div className="inline-block w-8 h-8 border-3 border-purple-400 border-t-transparent animate-spin rounded-full"></div>
                                <p className="mt-4 text-blue-300">Chargement des notes...</p>
                              </div>
                            ) : notesDetails.length > 0 ? (
                              notesDetails.map((note) => (
                                <div 
                                  key={note.id} 
                                  className="bg-blue-800/30 backdrop-blur-sm border border-blue-700/30 rounded-xl p-6"
                                >
                                  <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                                        {note.comite_nom.charAt(0).toUpperCase()}
                                      </div>
                                      <div>
                                        <h4 className="font-bold text-white text-lg">
                                          {note.comite_nom}
                                        </h4>
                                        <p className="text-sm text-blue-300/70">
                                          {new Date(note.created_at).toLocaleDateString('fr-FR', { 
                                            day: 'numeric', 
                                            month: 'long', 
                                            year: 'numeric' 
                                          })}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <div className="text-3xl font-bold text-white">
                                        {note.score_total}
                                        <span className="text-lg text-blue-300/70">/100</span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {criteres.map((critere) => {
                                      const value = note[critere.key as keyof NoteDetail] as number || 0;
                                      return (
                                        <div 
                                          key={critere.key} 
                                          className={`bg-blue-900/50 p-3 rounded-lg border border-blue-700/30`}
                                        >
                                          <div className="text-xs text-blue-300/70 font-medium mb-1">
                                            {critere.label}
                                          </div>
                                          <div className="font-bold text-white text-lg">
                                            {value}/{critere.max}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="text-center py-12">
                                <AlertCircle className="w-16 h-16 text-purple-400/50 mx-auto mb-4" />
                                <p className="text-blue-300 text-lg font-medium">Aucune note trouvée</p>
                                <p className="text-blue-300/50 text-sm mt-2">
                                  Les membres du comité n'ont pas encore évalué ce candidat
                                </p>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <Badge 
                        variant="outline" 
                        className={`${statutInfo.bgColor} ${statutInfo.color} border-transparent`}
                      >
                        {statutInfo.label}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/comite/evaluation/${item.id}`)}
                        className="bg-green-600/50 border-green-500/30 text-green-100 hover:bg-green-500/50 hover:text-white"
                      >
                        <Edit3 className="w-4 h-4 mr-1" />
                        Re-noter
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {classement.length === 0 && (
        <Card className="bg-blue-900/50 border-blue-700/30 backdrop-blur-xl">
          <CardContent className="p-8 text-center">
            <User className="w-12 h-12 text-purple-400/50 mx-auto mb-4" />
            <p className="text-white font-medium mb-2">Aucun individuel dans le classement</p>
            <p className="text-blue-300/70 text-sm">
              Le classement des individuels sera disponible une fois que les évaluations auront commencé
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ClassementIndividuels;
