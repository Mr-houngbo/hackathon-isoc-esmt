import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useComiteAuth } from "@/context/ComiteAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  Save, 
  Send, 
  Download, 
  FileText,
  Users,
  Calendar,
  Target,
  Lightbulb,
  Settings,
  Award,
  Star,
  Briefcase,
  Building,
  Layers
} from "lucide-react";

interface Equipe {
  id: string;
  nom_equipe: string;
  nom_projet: string;
  type_candidature: string;
  problematique: string;
  solution: string;
  motivation: string;
  domaine_projet: string;
  technologies: string;
  niveau_avancement: string;
  niveau_technique: string;
  created_at: string;
  membres?: Array<{
    nom_prenom: string;
    filiere: string;
    niveau_etudes: string;
    role_equipe: string;
    competences: string[];
  }>;
}

interface NoteData {
  qualite_projet: number;
  motivation: number;
  clarte_problematique: number;
  competences_techniques: number;
  competence_manageriale: number;
  appartenance_esmt: number;
  presence_feminine: number;
  pluridisciplinarite: number;
}

const EvaluationDossier = () => {
  const { equipeId } = useParams<{ equipeId: string }>();
  const { comiteMember } = useComiteAuth();
  const navigate = useNavigate();

  const [equipe, setEquipe] = useState<Equipe | null>(null);
  const [notes, setNotes] = useState<NoteData>({
    qualite_projet: 0,
    motivation: 0,
    clarte_problematique: 0,
    competences_techniques: 0,
    competence_manageriale: 0,
    appartenance_esmt: 0,
    presence_feminine: 0,
    pluridisciplinarite: 0
  });
  const [commentaire, setCommentaire] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [existingNote, setExistingNote] = useState<any>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const criteres = [
    {
      key: "qualite_projet",
      label: "Qualité du projet",
      description: "Pertinence, originalité et faisabilité de l'idée",
      max: 25,
      icon: Lightbulb
    },
    {
      key: "motivation",
      label: "Motivation de l'équipe",
      description: "Engagement et passion pour le projet",
      max: 20,
      icon: Star
    },
    {
      key: "clarte_problematique",
      label: "Clarté de la problématique",
      description: "Définition précise du problème à résoudre",
      max: 15,
      icon: Target
    },
    {
      key: "competences_techniques",
      label: "Compétences techniques",
      description: "Adéquation des compétences avec le projet",
      max: 10,
      icon: Award
    },
    {
      key: "competence_manageriale",
      label: "Compétence managériale",
      description: "Capacité de gestion et leadership de l'équipe",
      max: 10,
      icon: Briefcase
    },
    {
      key: "appartenance_esmt",
      label: "Appartenance ESMT",
      description: "Présence d'un membre de l'ESMT dans l'équipe",
      max: 5,
      icon: Building
    },
    {
      key: "presence_feminine",
      label: "Présence féminine",
      description: "Présence d'au moins une femme dans l'équipe",
      max: 5,
      icon: Users
    },
    {
      key: "pluridisciplinarite",
      label: "Pluridisciplinarité de l'équipe",
      description: "Diversité des profils et compétences (3+ rôles différents)",
      max: 10,
      icon: Layers
    }
  ];

  useEffect(() => {
    if (equipeId && comiteMember) {
      fetchEquipeData();
      fetchExistingNote();
    }
  }, [equipeId, comiteMember]);

  const fetchEquipeData = async () => {
    try {
      const { data: equipe, error } = await supabase
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
        .eq('id', equipeId)
        .single();

      if (error) throw error;
      setEquipe(equipe);
    } catch (error) {
      console.error('Erreur lors du chargement de l\'équipe:', error);
      setError("Impossible de charger les informations du dossier");
    } finally {
      setLoading(false);
    }
  };

  const fetchExistingNote = async () => {
    try {
      console.log('Tentative de récupération des notes pour:', {
        comite_id: comiteMember?.id,
        equipe_id: equipeId
      });

      // Utiliser maybeSingle() au lieu de single() pour éviter l'erreur si aucune note n'existe
      const { data: note, error } = await supabase
        .from('notes')
        .select('id, qualite_projet, motivation, clarte_problematique, competences_techniques, competence_manageriale, appartenance_esmt, presence_feminine, pluridisciplinarite, score_total, soumis, created_at, updated_at')
        .eq('comite_id', comiteMember?.id)
        .eq('equipe_id', equipeId)
        .maybeSingle();

      console.log('Résultat de la requête notes:', { data: note, error });

      if (error) {
        console.error('Erreur lors du chargement des notes:', error);
        // Ne pas afficher d'erreur si c'est juste "no rows" (PGRST116)
        if (error.code !== 'PGRST116') {
          setError("Erreur lors du chargement des notes existantes");
        }
        return;
      }

      if (note) {
        setExistingNote(note);
        const n = note as any;
        setNotes({
          qualite_projet: n.qualite_projet || 0,
          motivation: n.motivation || 0,
          clarte_problematique: n.clarte_problematique || 0,
          competences_techniques: n.competences_techniques || 0,
          competence_manageriale: n.competence_manageriale || 0,
          appartenance_esmt: n.appartenance_esmt || 0,
          presence_feminine: n.presence_feminine || 0,
          pluridisciplinarite: n.pluridisciplinarite || 0
        });
        console.log('Notes existantes chargées:', note);
      } else {
        console.log('Aucune note existante trouvée - nouvelle évaluation');
      }
    } catch (error) {
      console.error('Erreur inattendue dans fetchExistingNote:', error);
      setError("Erreur inattendue lors du chargement");
    }
  };

  const handleNoteChange = (key: keyof NoteData, value: number) => {
    setNotes(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const calculateTotal = () => {
    return Object.values(notes).reduce((sum, note) => sum + note, 0);
  };

  const calculateProgress = () => {
    const filledNotes = Object.values(notes).filter(note => note > 0).length;
    return (filledNotes / 8) * 100;
  };

  const saveDraft = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const noteData = {
        comite_id: comiteMember?.id,
        equipe_id: equipeId,
        ...notes,
        // commentaire supprimé car n'existe pas dans la BDD
        soumis: false,
        // score_total supprimé car généré automatiquement par la BDD
      };

      if (existingNote) {
        const { error } = await supabase
          .from('notes')
          .update(noteData)
          .eq('id', existingNote.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('notes')
          .insert(noteData);

        if (error) throw error;
      }

      setSuccess("Brouillon enregistré avec succès");
      fetchExistingNote(); // Rafraîchir les données
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setError("Erreur lors de la sauvegarde du brouillon");
    } finally {
      setSaving(false);
    }
  };

  const submitEvaluation = async () => {
    if (calculateProgress() < 100) {
      setError("Veuillez noter tous les critères avant de soumettre");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const noteData = {
        comite_id: comiteMember?.id,
        equipe_id: equipeId,
        ...notes,
        // commentaire supprimé car n'existe pas dans la BDD
        soumis: true,
        // score_total supprimé car généré automatiquement par la BDD
      };

      if (existingNote) {
        const { error } = await supabase
          .from('notes')
          .update(noteData)
          .eq('id', existingNote.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('notes')
          .insert(noteData);

        if (error) throw error;
      }

      setSuccess("Évaluation soumise avec succès");
      setTimeout(() => {
        navigate("/comite/dashboard");
      }, 2000);
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      setError("Erreur lors de la soumission de l'évaluation");
    } finally {
      setSubmitting(false);
    }
  };

  const downloadPDF = () => {
    // Implémentation future pour télécharger en PDF
    setSuccess("Fonctionnalité de téléchargement PDF bientôt disponible");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-blue-300">Chargement du dossier...</p>
        </div>
      </div>
    );
  }

  if (!equipe) {
    return (
      <div className="text-center py-8">
        <p className="text-red-400">Dossier non trouvé</p>
        <Button onClick={() => navigate("/comite/dashboard")} className="mt-4">
          Retour au dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/comite/dashboard")}
            className="text-blue-300 hover:text-white hover:bg-blue-800/50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white">Évaluation du dossier</h1>
            <p className="text-blue-300/70">
              {equipe.nom_equipe} - {equipe.nom_projet}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={downloadPDF}
            className="bg-blue-800/50 border-blue-600/30 text-blue-300 hover:bg-blue-700/50 hover:text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            PDF
          </Button>
        </div>
      </div>

      {error && (
        <Alert className="border-red-500/30 bg-red-900/50 text-red-200">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-500/30 bg-green-900/50 text-green-200">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informations du dossier */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-blue-900/50 border-blue-700/30 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Informations du dossier
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-blue-300 text-sm">Nom de l'équipe</Label>
                <p className="text-white font-medium">{equipe.nom_equipe || "Non spécifié"}</p>
              </div>
              <div>
                <Label className="text-blue-300 text-sm">Nom du projet</Label>
                <p className="text-white font-medium">{equipe.nom_projet || "Non spécifié"}</p>
              </div>
              <div>
                <Label className="text-blue-300 text-sm">Type de candidature</Label>
                <Badge variant="outline" className="bg-blue-800/50 text-blue-300 border-blue-600/30">
                  {equipe.type_candidature}
                </Badge>
              </div>
              <div>
                <Label className="text-blue-300 text-sm">Domaine du projet</Label>
                <p className="text-white">{equipe.domaine_projet || "Non spécifié"}</p>
              </div>
              <div>
                <Label className="text-blue-300 text-sm">Date de soumission</Label>
                <p className="text-white flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  {new Date(equipe.created_at).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Membres de l'équipe */}
          {equipe.membres && equipe.membres.length > 0 && (
            <Card className="bg-blue-900/50 border-blue-700/30 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Membres de l'équipe
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {equipe.membres.map((membre, index) => (
                  <div key={index} className="bg-blue-800/30 rounded-lg p-3 border border-blue-700/30">
                    <p className="text-white font-medium">{membre.nom_prenom}</p>
                    <p className="text-blue-300/70 text-sm">{membre.filiere} - {membre.niveau_etudes}</p>
                    {membre.role_equipe && (
                      <p className="text-blue-300/50 text-xs mt-1">Rôle: {membre.role_equipe}</p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Formulaire d'évaluation */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progrès */}
          <Card className="bg-blue-900/50 border-blue-700/30 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white">Progression de l'évaluation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-blue-300">Avancement</span>
                  <span className="text-white font-medium">{Math.round(calculateProgress())}%</span>
                </div>
                <Progress value={calculateProgress()} className="h-2 bg-blue-800/50" />
                <p className="text-xs text-blue-300/70">
                  Score total: {calculateTotal()}/100 points
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Description du projet */}
          <Card className="bg-blue-900/50 border-blue-700/30 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white">Description du projet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-blue-300 text-sm">Problématique</Label>
                <p className="text-white bg-blue-800/30 rounded-lg p-3 border border-blue-700/30">
                  {equipe.problematique || "Non spécifiée"}
                </p>
              </div>
              <div>
                <Label className="text-blue-300 text-sm">Solution proposée</Label>
                <p className="text-white bg-blue-800/30 rounded-lg p-3 border border-blue-700/30">
                  {equipe.solution || "Non spécifiée"}
                </p>
              </div>
              <div>
                <Label className="text-blue-300 text-sm">Motivation</Label>
                <p className="text-white bg-blue-800/30 rounded-lg p-3 border border-blue-700/30">
                  {equipe.motivation || "Non spécifiée"}
                </p>
              </div>
              {equipe.technologies && (
                <div>
                  <Label className="text-blue-300 text-sm">Technologies</Label>
                  <p className="text-white bg-blue-800/30 rounded-lg p-3 border border-blue-700/30">
                    {equipe.technologies}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Critères d'évaluation */}
          <Card className="bg-blue-900/50 border-blue-700/30 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white">Critères d'évaluation</CardTitle>
              <CardDescription className="text-blue-300/70">
                Attribuez une note pour chaque critère (maximum indiqué)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {criteres.map((critere) => (
                <div key={critere.key} className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <critere.icon className="w-5 h-5 text-blue-400" />
                    <div className="flex-1">
                      <Label className="text-white font-medium">{critere.label}</Label>
                      <p className="text-blue-300/70 text-sm">{critere.description}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-white font-bold">/{critere.max}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <input
                      type="range"
                      min="0"
                      max={critere.max}
                      value={notes[critere.key as keyof NoteData]}
                      onChange={(e) => handleNoteChange(critere.key as keyof NoteData, parseInt(e.target.value))}
                      className="flex-1 h-2 bg-blue-800/50 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="w-12 text-center">
                      <span className="text-white font-medium bg-blue-800/50 px-2 py-1 rounded border border-blue-700/30">
                        {notes[critere.key as keyof NoteData]}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-between space-x-4">
            <Button
              variant="outline"
              onClick={saveDraft}
              disabled={saving}
              className="bg-blue-800/50 border-blue-600/30 text-blue-300 hover:bg-blue-700/50 hover:text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? "Sauvegarde..." : "Sauvegarder le brouillon"}
            </Button>
            <Button
              onClick={submitEvaluation}
              disabled={submitting || calculateProgress() < 100}
              className="bg-green-600 hover:bg-green-500 text-white"
            >
              <Send className="w-4 h-4 mr-2" />
              {submitting ? "Soumission..." : "Soumettre l'évaluation"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvaluationDossier;
