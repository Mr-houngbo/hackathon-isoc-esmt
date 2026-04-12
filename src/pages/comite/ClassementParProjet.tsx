import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Lightbulb, 
  RefreshCw,
  ArrowLeft,
  Users,
  TrendingUp,
  CheckCircle2,
  XCircle,
  HelpCircle,
  School,
  ChevronDown,
  ChevronUp,
  Edit3,
  Eye
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CandidatDetail {
  id: string;
  nom_prenom: string;
  filiere: string;
  niveau_etudes: string;
  etablissement: string;
  genre: string;
  score_moyen: number;
  equipe_id: string;
  nom_equipe: string;
  type_candidature: string;
  nom_projet?: string;
  domaine_projet?: string;
  problematique?: string;
  niveau_avancement?: string;
}

interface CategorieProjet {
  type: 'avec_projet' | 'sans_projet' | 'en_reflexion';
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  total_candidats: number;
  candidats: CandidatDetail[];
  expanded?: boolean;
}

const ClassementParProjet = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<CategorieProjet[]>([]);
  const [loading, setLoading] = useState(true);
  const [statsGlobales, setStatsGlobales] = useState({
    total_candidats: 0,
    avec_projet: 0,
    sans_projet: 0,
    en_reflexion: 0,
    ratio_sans_projet: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Récupérer les scores en temps réel depuis la vue de classement
      const { data: classementData, error: classementError } = await (supabase as any)
        .from("vue_classement_selection")
        .select("*")
        .order("score_final", { ascending: false });

      if (classementError) throw classementError;

      // Récupérer les détails des équipes avec membres
      const { data: equipesData, error: equipesError } = await supabase
        .from("equipes")
        .select(`
          *,
          membres (*)
        `)
        .order("created_at", { ascending: false });

      if (equipesError) throw equipesError;

      // Créer un map des scores par equipe_id depuis la vue de classement
      const scoresMap = new Map<string, { score_moyen: number; score_final: number }>();
      classementData?.forEach((item: any) => {
        scoresMap.set(item.id, {
          score_moyen: item.score_moyen || 0,
          score_final: item.score_final || 0
        });
      });

      // Initialiser les catégories
      const categoriesMap: Record<string, CategorieProjet> = {
        'oui': {
          type: 'avec_projet',
          label: 'Avec projet',
          description: 'Candidats ayant déjà un projet d\'entreprise',
          icon: <Lightbulb className="w-5 h-5" />,
          color: 'text-green-400',
          bgColor: 'bg-green-500/20',
          total_candidats: 0,
          candidats: [],
          expanded: true
        },
        'non': {
          type: 'sans_projet',
          label: 'Sans projet',
          description: 'Candidats sans projet - À prioriser pour la sélection',
          icon: <XCircle className="w-5 h-5" />,
          color: 'text-orange-400',
          bgColor: 'bg-orange-500/20',
          total_candidats: 0,
          candidats: [],
          expanded: true
        },
        'en_reflexion': {
          type: 'en_reflexion',
          label: 'En réflexion',
          description: 'Candidats réfléchissant à un projet',
          icon: <HelpCircle className="w-5 h-5" />,
          color: 'text-yellow-400',
          bgColor: 'bg-yellow-500/20',
          total_candidats: 0,
          candidats: [],
          expanded: false
        }
      };

      let totalCandidats = 0;

      equipesData?.forEach((equipe: any) => {
        const membres = equipe.membres || [];
        const aProjet = equipe.a_projet || 'non';
        
        // Utiliser le score depuis la vue de classement (synchronisé avec le classement final)
        const scores = scoresMap.get(equipe.id);
        const scoreMoyen = scores?.score_moyen || 0;

        membres.forEach((membre: any) => {
          totalCandidats++;
          
          const candidat: CandidatDetail = {
            id: membre.id,
            nom_prenom: membre.nom_prenom,
            filiere: membre.filiere,
            niveau_etudes: membre.niveau_etudes,
            etablissement: membre.etablissement || "Non renseigné",
            genre: membre.genre,
            score_moyen: scoreMoyen,
            equipe_id: equipe.id,
            nom_equipe: equipe.nom_equipe,
            type_candidature: equipe.type_candidature,
            nom_projet: equipe.nom_projet,
            domaine_projet: equipe.domaine_projet,
            problematique: equipe.problematique,
            niveau_avancement: equipe.niveau_avancement
          };

          if (categoriesMap[aProjet]) {
            categoriesMap[aProjet].total_candidats++;
            categoriesMap[aProjet].candidats.push(candidat);
          } else {
            // Par défaut, mettre dans "sans projet"
            categoriesMap['non'].total_candidats++;
            categoriesMap['non'].candidats.push(candidat);
          }
        });
      });

      // Trier les candidats par score dans chaque catégorie
      Object.values(categoriesMap).forEach(cat => {
        cat.candidats.sort((a, b) => b.score_moyen - a.score_moyen);
      });

      const categoriesArray = Object.values(categoriesMap)
        .filter(cat => cat.total_candidats > 0)
        .sort((a, b) => b.total_candidats - a.total_candidats);

      setCategories(categoriesArray);

      // Stats globales
      const avecProjet = categoriesMap['oui'].total_candidats;
      const sansProjet = categoriesMap['non'].total_candidats;
      const enReflexion = categoriesMap['en_reflexion'].total_candidats;
      
      setStatsGlobales({
        total_candidats: totalCandidats,
        avec_projet: avecProjet,
        sans_projet: sansProjet,
        en_reflexion: enReflexion,
        ratio_sans_projet: totalCandidats > 0 ? Math.round((sansProjet / totalCandidats) * 100) : 0
      });

    } catch (error) {
      console.error("Erreur lors du chargement:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (type: string) => {
    setCategories(prev => 
      prev.map(c => 
        c.type === type ? { ...c, expanded: !c.expanded } : c
      )
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-blue-300">Chargement du classement par projet...</p>
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
              <Lightbulb className="w-6 h-6 text-yellow-400" />
              Classement par Projet
            </h1>
            <p className="text-blue-300/70">
              Vue des candidats selon qu'ils ont un projet ou non
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={() => {
            setLoading(true);
            fetchData();
          }}
          className="bg-blue-800/50 border-blue-600/30 text-blue-300 hover:bg-blue-700/50 hover:text-white"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Actualiser
        </Button>
      </div>

      {/* Stats globales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-900/50 border-blue-700/30 backdrop-blur-xl">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{statsGlobales.total_candidats}</p>
                <p className="text-sm text-blue-300/70">Total candidats</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-900/30 border-green-700/30 backdrop-blur-xl">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{statsGlobales.avec_projet}</p>
                <p className="text-sm text-green-300/70">Avec projet</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-orange-900/30 border-orange-700/30 backdrop-blur-xl">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                <XCircle className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{statsGlobales.sans_projet}</p>
                <p className="text-sm text-orange-300/70">Sans projet ⭐</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-yellow-900/30 border-yellow-700/30 backdrop-blur-xl">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{statsGlobales.en_reflexion}</p>
                <p className="text-sm text-yellow-300/70">En réflexion</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des catégories */}
      <div className="space-y-4">
        {categories.map((categorie) => (
          <motion.div
            key={categorie.type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`backdrop-blur-xl rounded-xl overflow-hidden border ${
              categorie.type === 'sans_projet' 
                ? 'bg-orange-900/20 border-orange-700/30' 
                : categorie.type === 'avec_projet'
                ? 'bg-green-900/20 border-green-700/30'
                : 'bg-yellow-900/20 border-yellow-700/30'
            }`}
          >
            {/* Header de la catégorie */}
            <div 
              className={`p-4 cursor-pointer hover:bg-opacity-30 transition-colors ${
                categorie.type === 'sans_projet' 
                  ? 'hover:bg-orange-800/30' 
                  : categorie.type === 'avec_projet'
                  ? 'hover:bg-green-800/30'
                  : 'hover:bg-yellow-800/30'
              }`}
              onClick={() => toggleExpand(categorie.type)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${categorie.bgColor}`}>
                    <div className={categorie.color}>
                      {categorie.icon}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-white">{categorie.label}</h3>
                      {categorie.type === 'sans_projet' && (
                        <Badge className="bg-orange-500 text-white">Prioritaire</Badge>
                      )}
                    </div>
                    <p className="text-sm text-blue-300/70">{categorie.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">{categorie.total_candidats}</p>
                    <p className="text-xs text-blue-300/50">
                      {Math.round((categorie.total_candidats / (statsGlobales.total_candidats || 1)) * 100)}% des candidats
                    </p>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-blue-800/50 flex items-center justify-center">
                    {categorie.expanded ? 
                      <ChevronUp className="w-5 h-5 text-blue-300" /> : 
                      <ChevronDown className="w-5 h-5 text-blue-300" />
                    }
                  </div>
                </div>
              </div>
            </div>

            {/* Détails des candidats */}
            <AnimatePresence>
              {categorie.expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`border-t ${
                    categorie.type === 'sans_projet' 
                      ? 'border-orange-700/30' 
                      : categorie.type === 'avec_projet'
                      ? 'border-green-700/30'
                      : 'border-yellow-700/30'
                  }`}
                >
                  <div className="p-4">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-blue-700/30">
                            <th className="text-left py-2 px-3 text-sm font-medium text-blue-300/70">Candidat</th>
                            <th className="text-left py-2 px-3 text-sm font-medium text-blue-300/70">Établissement</th>
                            <th className="text-left py-2 px-3 text-sm font-medium text-blue-300/70">Filière</th>
                            <th className="text-center py-2 px-3 text-sm font-medium text-blue-300/70">Type</th>
                            {categorie.type === 'avec_projet' && (
                              <>
                                <th className="text-left py-2 px-3 text-sm font-medium text-blue-300/70">Nom du projet</th>
                                <th className="text-left py-2 px-3 text-sm font-medium text-blue-300/70">Domaine</th>
                              </>
                            )}
                            <th className="text-center py-2 px-3 text-sm font-medium text-blue-300/70">Score</th>
                            <th className="text-center py-2 px-3 text-sm font-medium text-blue-300/70">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {categorie.candidats.map((candidat, idx) => (
                            <tr key={candidat.id} className="border-b border-blue-700/20 hover:bg-blue-800/20">
                              <td className="py-3 px-3">
                                <div className="flex items-center gap-2">
                                  <span className="text-blue-300/50 w-6">{idx + 1}</span>
                                  <div className={`w-2 h-2 rounded-full ${candidat.genre === 'femme' ? 'bg-pink-400' : 'bg-blue-400'}`}></div>
                                  <span className="text-white font-medium">{candidat.nom_prenom}</span>
                                </div>
                                <p className="text-xs text-blue-300/50 ml-8">{candidat.nom_equipe}</p>
                              </td>
                              <td className="py-3 px-3">
                                <div className="flex items-center gap-1 text-blue-300">
                                  <School className="w-3 h-3" />
                                  {candidat.etablissement}
                                </div>
                              </td>
                              <td className="py-3 px-3 text-blue-300">{candidat.filiere}</td>
                              <td className="py-3 px-3 text-center">
                                <Badge variant="outline" className={`${
                                  candidat.type_candidature === 'equipe' 
                                    ? "bg-blue-500/20 text-blue-300 border-blue-500/30" 
                                    : "bg-purple-500/20 text-purple-300 border-purple-500/30"
                                }`}>
                                  {candidat.type_candidature === 'equipe' ? 'Équipe' : 'Individuel'}
                                </Badge>
                              </td>
                              {categorie.type === 'avec_projet' && (
                                <>
                                  <td className="py-3 px-3">
                                    <span className="text-white font-medium">{candidat.nom_projet || '-'}</span>
                                  </td>
                                  <td className="py-3 px-3">
                                    <Badge variant="outline" className="bg-blue-800/30 text-blue-300 border-blue-600/30">
                                      {candidat.domaine_projet || '-'}
                                    </Badge>
                                  </td>
                                </>
                              )}
                              <td className="py-3 px-3 text-center">
                                <span className={`font-bold ${
                                  candidat.score_moyen >= 70 ? 'text-green-400' :
                                  candidat.score_moyen >= 50 ? 'text-yellow-400' :
                                  'text-white'
                                }`}>
                                  {candidat.score_moyen > 0 ? `${candidat.score_moyen}/100` : '-'}
                                </span>
                              </td>
                              <td className="py-3 px-3 text-center">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => navigate(`/comite/evaluation/${candidat.equipe_id}`)}
                                  className="bg-green-600/50 border-green-500/30 text-green-100 hover:bg-green-500/50 hover:text-white h-8 px-2"
                                >
                                  <Edit3 className="w-3 h-3 mr-1" />
                                  Noter
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {categories.length === 0 && (
        <Card className="bg-blue-900/50 border-blue-700/30 backdrop-blur-xl">
          <CardContent className="p-8 text-center">
            <Lightbulb className="w-12 h-12 text-blue-400/50 mx-auto mb-4" />
            <p className="text-white font-medium mb-2">Aucune donnée disponible</p>
            <p className="text-blue-300/70 text-sm">
              Les données apparaîtront lorsque les candidatures seront soumises
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ClassementParProjet;
