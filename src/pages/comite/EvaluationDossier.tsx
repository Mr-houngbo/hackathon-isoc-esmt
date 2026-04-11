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
  Layers,
  Info,
  Crown,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  BookOpen,
  CheckCircle2,
  XCircle,
  Heart,
  Megaphone,
  Sparkles,
  Smartphone,
  Instagram,
  Linkedin,
  Tag,
  Crown as CrownIcon
} from "lucide-react";

interface Membre {
  nom_prenom: string;
  genre: string;
  filiere: string;
  niveau_etudes: string;
  role_equipe: string;
  telephone: string;
  email: string;
  etablissement: string;
  competences: string[];
  competence_autre: string;
  disponible_2_jours: boolean;
  accepte_conditions: boolean;
  autorise_photos: boolean;
  est_chef: boolean;
}

interface Equipe {
  id: string;
  nom_equipe: string;
  nom_projet: string;
  type_candidature: string;
  nombre_membres: number;
  a_projet: string;
  problematique: string;
  solution: string;
  motivation: string;
  esperances: string;
  domaine_projet: string;
  technologies: string;
  niveau_avancement: string;
  niveau_technique: string;
  contraintes_techniques: string;
  competences_equipe: string[];
  source_info: string;
  handle_instagram: string;
  handle_linkedin: string;
  created_at: string;
  membres?: Membre[];
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
        .eq('id', equipeId)
        .single();

      if (error) throw error;
      setEquipe(equipe as Equipe);
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
        {/* Informations du dossier - COLONNE GAUCHE */}
        <div className="lg:col-span-1 space-y-6">
          {/* Section 1: Infos Générales */}
          <Card className="bg-blue-900/50 border-blue-700/30 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Info className="w-5 h-5 mr-2 text-blue-400" />
                Informations générales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-800/30 rounded-lg p-3">
                <Label className="text-blue-300/70 text-xs uppercase tracking-wider">Nom de l'équipe</Label>
                <p className="text-white font-medium mt-1">{equipe.nom_equipe || "Non spécifié"}</p>
              </div>
              <div className="bg-blue-800/30 rounded-lg p-3">
                <Label className="text-blue-300/70 text-xs uppercase tracking-wider">Type de candidature</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="bg-blue-800/50 text-blue-200 border-blue-600/30 capitalize">
                    {equipe.type_candidature}
                  </Badge>
                  <span className="text-white text-sm">
                    ({equipe.nombre_membres || 1} membre{(equipe.nombre_membres || 1) > 1 ? 's' : ''})
                  </span>
                </div>
              </div>
              <div className="bg-blue-800/30 rounded-lg p-3">
                <Label className="text-blue-300/70 text-xs uppercase tracking-wider">A un projet ?</Label>
                <p className="text-white font-medium mt-1 capitalize">{equipe.a_projet || "Non spécifié"}</p>
              </div>
              <div className="bg-blue-800/30 rounded-lg p-3">
                <Label className="text-blue-300/70 text-xs uppercase tracking-wider">Date de soumission</Label>
                <p className="text-white font-medium mt-1 flex items-center">
                  <Calendar className="w-3 h-3 mr-1 text-blue-400" />
                  {new Date(equipe.created_at).toLocaleDateString('fr-FR')}
                </p>
              </div>
              {equipe.source_info && (
                <div className="bg-blue-800/30 rounded-lg p-3">
                  <Label className="text-blue-300/70 text-xs uppercase tracking-wider flex items-center gap-1">
                    <Megaphone className="w-3 h-3" />
                    Source d'information
                  </Label>
                  <p className="text-white font-medium mt-1">{equipe.source_info}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Section 2: Détails du Projet */}
          {equipe.nom_projet && (
            <Card className="bg-blue-900/50 border-blue-700/30 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2 text-yellow-400" />
                  Détails du projet
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-800/30 rounded-lg p-3">
                  <Label className="text-blue-300/70 text-xs uppercase tracking-wider">Nom du projet</Label>
                  <p className="text-white font-medium mt-1">{equipe.nom_projet}</p>
                </div>
                <div className="bg-blue-800/30 rounded-lg p-3">
                  <Label className="text-blue-300/70 text-xs uppercase tracking-wider flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    Domaine
                  </Label>
                  <p className="text-white font-medium mt-1">{equipe.domaine_projet || "Non spécifié"}</p>
                </div>
                {equipe.niveau_avancement && (
                  <div className="bg-blue-800/30 rounded-lg p-3">
                    <Label className="text-blue-300/70 text-xs uppercase tracking-wider">Niveau d'avancement</Label>
                    <p className="text-white font-medium mt-1 capitalize">{equipe.niveau_avancement}</p>
                  </div>
                )}
                {equipe.niveau_technique && (
                  <div className="bg-blue-800/30 rounded-lg p-3">
                    <Label className="text-blue-300/70 text-xs uppercase tracking-wider">Niveau technique</Label>
                    <p className="text-white font-medium mt-1 capitalize">{equipe.niveau_technique}</p>
                  </div>
                )}
                {equipe.competences_equipe && equipe.competences_equipe.length > 0 && (
                  <div className="bg-blue-800/30 rounded-lg p-3">
                    <Label className="text-blue-300/70 text-xs uppercase tracking-wider flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      Compétences de l'équipe
                    </Label>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {equipe.competences_equipe.map((comp, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-blue-700/50 text-blue-200 rounded text-xs">
                          {comp}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Section 3: Réseaux Sociaux */}
          {(equipe.handle_instagram || equipe.handle_linkedin) && (
            <Card className="bg-blue-900/50 border-blue-700/30 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Smartphone className="w-5 h-5 mr-2 text-purple-400" />
                  Réseaux sociaux
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {equipe.handle_instagram && (
                  <a 
                    href={`https://instagram.com/${equipe.handle_instagram.replace('@', '')}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg text-pink-300 hover:from-purple-600/30 hover:to-pink-600/30 transition-all text-sm"
                  >
                    <Instagram className="w-4 h-4" />
                    @{equipe.handle_instagram.replace('@', '')}
                  </a>
                )}
                {equipe.handle_linkedin && (
                  <a 
                    href={equipe.handle_linkedin}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 bg-blue-700/30 rounded-lg text-blue-300 hover:bg-blue-700/40 transition-all text-sm"
                  >
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </a>
                )}
              </CardContent>
            </Card>
          )}

          {/* Section 4: Membres Détaillés */}
          {equipe.membres && equipe.membres.length > 0 && (
            <Card className="bg-blue-900/50 border-blue-700/30 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Users className="w-5 h-5 mr-2 text-green-400" />
                  Membres ({equipe.membres.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {equipe.membres.map((membre, index) => (
                  <div key={index} className="bg-blue-800/30 rounded-xl p-4 border border-blue-700/30">
                    {/* Header */}
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
                                <CrownIcon className="w-3 h-3 mr-1" />
                                Chef
                              </Badge>
                            )}
                          </p>
                          <p className="text-blue-300/70 text-sm">{membre.role_equipe || 'Membre'}</p>
                        </div>
                      </div>
                      {membre.genre && (
                        <Badge variant="outline" className="bg-blue-800/30 text-blue-300 border-blue-600/30 text-xs capitalize">
                          {membre.genre}
                        </Badge>
                      )}
                    </div>

                    {/* Contact */}
                    <div className="space-y-1 mb-3">
                      <p className="text-white text-sm flex items-center gap-2">
                        <Mail className="w-3 h-3 text-blue-400" />
                        {membre.email}
                      </p>
                      {membre.telephone && (
                        <p className="text-white text-sm flex items-center gap-2">
                          <Phone className="w-3 h-3 text-blue-400" />
                          {membre.telephone}
                        </p>
                      )}
                    </div>

                    {/* Formation */}
                    <div className="space-y-1 mb-3">
                      <p className="text-blue-300/50 text-xs uppercase tracking-wider flex items-center gap-1">
                        <GraduationCap className="w-3 h-3" />
                        Formation
                      </p>
                      <p className="text-white text-sm flex items-center gap-2">
                        <BookOpen className="w-3 h-3 text-blue-400" />
                        {membre.filiere}
                      </p>
                      <p className="text-white text-sm flex items-center gap-2">
                        <Award className="w-3 h-3 text-blue-400" />
                        {membre.niveau_etudes}
                      </p>
                      {membre.etablissement && (
                        <p className="text-white text-sm flex items-center gap-2">
                          <MapPin className="w-3 h-3 text-blue-400" />
                          {membre.etablissement}
                        </p>
                      )}
                    </div>

                    {/* Compétences */}
                    {membre.competences && membre.competences.length > 0 && (
                      <div className="mb-3">
                        <p className="text-blue-300/50 text-xs uppercase tracking-wider mb-1 flex items-center gap-1">
                          <Briefcase className="w-3 h-3" />
                          Compétences
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {membre.competences.map((comp, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-blue-700/30 text-blue-200 rounded text-xs">
                              {comp}
                            </span>
                          ))}
                        </div>
                        {membre.competence_autre && (
                          <p className="text-blue-300 text-xs italic mt-1">Autre: {membre.competence_autre}</p>
                        )}
                      </div>
                    )}

                    {/* Engagements */}
                    <div className="pt-3 border-t border-blue-700/30 flex flex-wrap gap-2">
                      <div className="flex items-center gap-1 text-xs">
                        {membre.disponible_2_jours ? (
                          <><CheckCircle2 className="w-3 h-3 text-green-400" /><span className="text-green-300">Dispo 2j</span></>
                        ) : (
                          <><XCircle className="w-3 h-3 text-red-400" /><span className="text-red-300">Non dispo</span></>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        {membre.accepte_conditions ? (
                          <><CheckCircle2 className="w-3 h-3 text-green-400" /><span className="text-green-300">Conditions OK</span></>
                        ) : (
                          <><XCircle className="w-3 h-3 text-red-400" /><span className="text-red-300">Conditions NOK</span></>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        {membre.autorise_photos ? (
                          <><CheckCircle2 className="w-3 h-3 text-green-400" /><span className="text-green-300">Photos OK</span></>
                        ) : (
                          <><XCircle className="w-3 h-3 text-red-400" /><span className="text-red-300">Photos NOK</span></>
                        )}
                      </div>
                    </div>
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

          {/* Description complète du projet */}
          <Card className="bg-blue-900/50 border-blue-700/30 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                Description complète du projet
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {equipe.problematique && (
                <div>
                  <Label className="text-blue-300 text-sm flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    Problématique
                  </Label>
                  <p className="text-white bg-blue-800/30 rounded-lg p-3 border border-blue-700/30 text-sm leading-relaxed">
                    {equipe.problematique}
                  </p>
                </div>
              )}
              {equipe.solution && (
                <div>
                  <Label className="text-blue-300 text-sm flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Solution proposée
                  </Label>
                  <p className="text-white bg-blue-800/30 rounded-lg p-3 border border-blue-700/30 text-sm leading-relaxed">
                    {equipe.solution}
                  </p>
                </div>
              )}
              {equipe.technologies && (
                <div>
                  <Label className="text-blue-300 text-sm flex items-center gap-1">
                    <Layers className="w-3 h-3" />
                    Technologies envisagées
                  </Label>
                  <p className="text-white bg-blue-800/30 rounded-lg p-3 border border-blue-700/30 text-sm">
                    {equipe.technologies}
                  </p>
                </div>
              )}
              {equipe.contraintes_techniques && (
                <div>
                  <Label className="text-blue-300 text-sm">Contraintes techniques</Label>
                  <p className="text-white bg-blue-800/30 rounded-lg p-3 border border-blue-700/30 text-sm">
                    {equipe.contraintes_techniques}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Motivation & Attentes */}
          <Card className="bg-blue-900/50 border-blue-700/30 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-400" />
                Motivation & Attentes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {equipe.motivation && (
                <div>
                  <Label className="text-blue-300 text-sm">Motivation</Label>
                  <p className="text-white bg-blue-800/30 rounded-lg p-3 border border-blue-700/30 text-sm leading-relaxed">
                    {equipe.motivation}
                  </p>
                </div>
              )}
              {equipe.esperances && (
                <div>
                  <Label className="text-blue-300 text-sm">Espérances</Label>
                  <p className="text-white bg-blue-800/30 rounded-lg p-3 border border-blue-700/30 text-sm leading-relaxed">
                    {equipe.esperances}
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
