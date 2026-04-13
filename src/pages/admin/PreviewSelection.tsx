import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Trophy, 
  Users, 
  CheckCircle, 
  Clock,
  Download,
  Globe,
  Medal,
  Star,
  ArrowLeft,
  User,
  Users2,
  Mail,
  Phone,
  GraduationCap,
  Building2,
  Award,
  FileText
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { jsPDF } from "jspdf";
import AdminLayout from "@/components/layout/AdminLayout";
import { useNavigate } from "react-router-dom";

interface ClassementItem {
  id: string;
  nom_equipe: string;
  type_candidature: string;
  statut: string;
  nb_evaluateurs: number;
  score_moyen: number;
  score_final: number;
  position?: number;
}

interface MembreDetail {
  id: string;
  nom_prenom: string;
  email: string;
  telephone?: string;
  filiere: string;
  niveau_etudes: string;
  etablissement?: string;
  genre?: string;
  competences?: string[];
  role_equipe?: string;
  est_chef?: boolean;
}

interface EquipeDetail {
  id: string;
  nom_equipe: string;
  type_candidature: string;
  statut: string;
  score_moyen: number;
  score_final: number;
  a_projet?: string;
  nom_projet?: string;
  domaine_projet?: string;
  problematique?: string;
  membres?: MembreDetail[];
}

const PreviewSelection = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Récupérer le classement complet avec les membres
  const { data: classement, isLoading } = useQuery({
    queryKey: ["classement-preview"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("vue_classement_selection")
        .select("*")
        .order("score_final", { ascending: false });
      
      if (error) throw error;
      
      // Récupérer les membres pour chaque équipe
      const equipeIds = (data || []).map((item: any) => item.id);
      
      let membresMap: Record<string, string> = {};
      
      if (equipeIds.length > 0) {
        const { data: membresData } = await supabase
          .from("membres")
          .select("equipe_id, nom_prenom")
          .in("equipe_id", equipeIds);
        
        // Créer un map equipe_id -> nom du premier membre
        membresData?.forEach((m: any) => {
          if (!membresMap[m.equipe_id]) {
            membresMap[m.equipe_id] = m.nom_prenom;
          }
        });
      }
      
      return (data as ClassementItem[]).map((item, index) => ({
        ...item,
        position: index + 1,
        // Pour les individuels, utiliser le nom du membre si nom_equipe est vide
        nom_equipe: item.type_candidature === 'individuel' && membresMap[item.id] 
          ? membresMap[item.id] 
          : (item.nom_equipe || "Sans nom")
      }));
    },
  });

  // Récupérer les équipes sélectionnées et en attente
  const { data: equipesDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: ["equipes-selectionnees-details"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("equipes")
        .select(`
          *,
          membres (*)
        `)
        .in("statut", ["selectionne", "en_attente"]);
      
      if (error) throw error;
      return (data || []) as EquipeDetail[];
    },
  });

  // Publier les équipes
  const publierMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("equipes")
        .update({ publiee: true })
        .in("statut", ["selectionne", "en_attente"]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Liste publiée avec succès sur la page publique !");
      queryClient.invalidateQueries({ queryKey: ["equipes-selectionnees"] });
    },
    onError: (error: any) => {
      toast.error(`Erreur lors de la publication: ${error.message}`);
    },
  });

  // Récupérer les détails d'une équipe
  const getEquipeDetails = (equipeId: string): EquipeDetail | undefined => {
    return equipesDetails?.find(e => e.id === equipeId);
  };

  // Filtrer les sélectionnés et en attente
  const selectionnes = classement?.filter(item => item.statut === 'selectionne') || [];
  const attente = classement?.filter(item => item.statut === 'en_attente') || [];

  // Séparer par type
  const selectionnesEquipes = selectionnes.filter(item => item.type_candidature === 'equipe');
  const selectionnesIndividus = selectionnes.filter(item => item.type_candidature === 'individuel');
  const attenteEquipes = attente.filter(item => item.type_candidature === 'equipe');
  const attenteIndividus = attente.filter(item => item.type_candidature === 'individuel');

  // Générer le PDF
  const generatePDF = async () => {
    const doc = new jsPDF();

    // En-tête
    doc.setFillColor(36, 54, 110);
    doc.rect(0, 0, 210, 50, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont("helvetica", "bold");
    doc.text("HACKATHON ISOC-ESMT 2025", 105, 25, { align: "center" });
    
    doc.setFontSize(16);
    doc.setFont("helvetica", "normal");
    doc.text("Sélection Finale", 105, 35, { align: "center" });
    
    doc.setFontSize(11);
    doc.text(`${selectionnes.length} Équipes/Individus Sélectionnés + ${attente.length} en Liste d'Attente`, 105, 45, { align: "center" });

    let currentY = 60;

    // SECTION SÉLECTIONNÉS
    if (selectionnes.length > 0) {
      // Titre section
      doc.setFillColor(64, 178, 164);
      doc.roundedRect(14, currentY - 5, 182, 12, 3, 3, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.text(`✓ SÉLECTIONNÉS (${selectionnes.length})`, 20, currentY + 3);
      currentY += 20;

      // Sous-section Équipes
      if (selectionnesEquipes.length > 0) {
        doc.setTextColor(36, 54, 110);
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text(`▸ ÉQUIPES (${selectionnesEquipes.length})`, 20, currentY);
        currentY += 10;

        for (const item of selectionnesEquipes) {
          if (currentY > 260) {
            doc.addPage();
            currentY = 20;
          }

          const details = getEquipeDetails(item.id);
          
          // Fond alterné
          if (selectionnesEquipes.indexOf(item) % 2 === 0) {
            doc.setFillColor(248, 249, 250);
            doc.rect(14, currentY - 6, 182, 25, 'F');
          }

          // Position et nom
          doc.setTextColor(64, 178, 164);
          doc.setFontSize(12);
          doc.setFont("helvetica", "bold");
          doc.text(`#${item.position}`, 20, currentY);
          
          doc.setTextColor(36, 54, 110);
          doc.text(item.nom_equipe || "Sans nom", 35, currentY);
          
          // Score
          doc.setTextColor(100, 100, 100);
          doc.setFontSize(9);
          doc.text(`Score: ${item.score_moyen}/100`, 160, currentY);

          // Membres
          currentY += 6;
          doc.setFontSize(8);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(80, 80, 80);
          
          if (details?.membres && details.membres.length > 0) {
            const membresText = details.membres.map(m => {
              const role = m.est_chef ? " (Chef)" : "";
              return `${m.nom_prenom}${role} - ${m.filiere}, ${m.niveau_etudes}`;
            }).join(' | ');
            doc.text(membresText, 35, currentY, { maxWidth: 155 });
            currentY += 8;
          } else {
            currentY += 4;
          }

          // Projet si existe
          if (details?.nom_projet) {
            doc.setTextColor(64, 178, 164);
            doc.setFontSize(8);
            doc.text(`Projet: ${details.nom_projet}${details.domaine_projet ? ` (${details.domaine_projet})` : ''}`, 35, currentY);
            currentY += 6;
          }

          currentY += 8;
        }

        currentY += 5;
      }

      // Sous-section Individus
      if (selectionnesIndividus.length > 0) {
        if (currentY > 240) {
          doc.addPage();
          currentY = 20;
        }

        doc.setTextColor(36, 54, 110);
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text(`▸ INDIVIDUELS (${selectionnesIndividus.length})`, 20, currentY);
        currentY += 10;

        for (const item of selectionnesIndividus) {
          if (currentY > 260) {
            doc.addPage();
            currentY = 20;
          }

          const details = getEquipeDetails(item.id);
          const membre = details?.membres?.[0];

          // Fond alterné
          if (selectionnesIndividus.indexOf(item) % 2 === 0) {
            doc.setFillColor(248, 249, 250);
            doc.rect(14, currentY - 6, 182, 18, 'F');
          }

          doc.setTextColor(64, 178, 164);
          doc.setFontSize(11);
          doc.setFont("helvetica", "bold");
          doc.text(`#${item.position}`, 20, currentY);

          doc.setTextColor(36, 54, 110);
          doc.text(membre?.nom_prenom || item.nom_equipe, 35, currentY);

          doc.setTextColor(100, 100, 100);
          doc.setFontSize(9);
          doc.text(`${item.score_moyen}/100`, 160, currentY);

          currentY += 6;
          doc.setFontSize(8);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(80, 80, 80);
          
          if (membre) {
            doc.text(`${membre.filiere}, ${membre.niveau_etudes}${membre.etablissement ? ` - ${membre.etablissement}` : ''}`, 35, currentY);
          }

          currentY += 12;
        }
      }
    }

    // SECTION LISTE D'ATTENTE
    if (attente.length > 0) {
      doc.addPage();
      currentY = 30;

      doc.setFillColor(255, 193, 7);
      doc.roundedRect(14, currentY - 5, 182, 12, 3, 3, 'F');
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.text(`⏳ LISTE D'ATTENTE (${attente.length})`, 20, currentY + 3);
      currentY += 20;

      // Attente Équipes
      if (attenteEquipes.length > 0) {
        doc.setTextColor(36, 54, 110);
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text(`▸ ÉQUIPES (${attenteEquipes.length})`, 20, currentY);
        currentY += 10;

        for (const item of attenteEquipes) {
          if (currentY > 260) {
            doc.addPage();
            currentY = 20;
          }

          const details = getEquipeDetails(item.id);

          doc.setFillColor(255, 248, 225);
          doc.rect(14, currentY - 5, 182, 18, 'F');

          doc.setTextColor(255, 160, 0);
          doc.setFontSize(11);
          doc.setFont("helvetica", "bold");
          doc.text(`#${item.position} ${item.nom_equipe}`, 20, currentY);

          doc.setTextColor(100, 100, 100);
          doc.setFontSize(9);
          doc.text(`${item.score_moyen}/100`, 160, currentY);

          currentY += 6;
          doc.setFontSize(8);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(80, 80, 80);
          
          if (details?.membres) {
            const membresText = details.membres.map(m => m.nom_prenom).join(', ');
            doc.text(membresText, 20, currentY, { maxWidth: 170 });
          }

          currentY += 15;
        }
      }

      // Attente Individus
      if (attenteIndividus.length > 0) {
        if (currentY > 240) {
          doc.addPage();
          currentY = 20;
        }

        doc.setTextColor(36, 54, 110);
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text(`▸ INDIVIDUELS (${attenteIndividus.length})`, 20, currentY);
        currentY += 10;

        for (const item of attenteIndividus) {
          if (currentY > 260) {
            doc.addPage();
            currentY = 20;
          }

          const details = getEquipeDetails(item.id);
          const membre = details?.membres?.[0];

          doc.setFillColor(255, 248, 225);
          doc.rect(14, currentY - 5, 182, 14, 'F');

          doc.setTextColor(255, 160, 0);
          doc.setFontSize(10);
          doc.setFont("helvetica", "bold");
          doc.text(`#${item.position} ${membre?.nom_prenom || item.nom_equipe}`, 20, currentY);

          doc.setTextColor(100, 100, 100);
          doc.setFontSize(9);
          doc.text(`${item.score_moyen}/100`, 160, currentY);

          currentY += 12;
        }
      }
    }

    // Pied de page
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFillColor(36, 54, 110);
      doc.rect(0, 280, 210, 17, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text("Hackathon ISOC-ESMT 2025 - Innover, Créer, Entreprendre", 105, 290, { align: "center" });
      doc.text(`Page ${i}/${pageCount}`, 190, 290, { align: "right" });
    }

    doc.save(`selection-finale-hackathon-${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success("PDF généré avec succès !");
  };

  if (isLoading || isLoadingDetails) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-4">
            <div className="w-8 h-8 border-2 border-[#40B2A4] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-[#6C757D]">Chargement des sélections...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => navigate('/admin/selection')}
              className="border-[#E9ECEF]"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-[#24366E] flex items-center gap-2">
                <Trophy className="w-6 h-6 text-[#40B2A4]" />
                Aperçu de la Sélection
              </h1>
              <p className="text-[#6C757D]">
                Visualisation finale des équipes et individus sélectionnés
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={generatePDF}
              variant="outline"
              className="border-[#D25238] text-[#D25238] hover:bg-[#D25238]/10"
            >
              <Download className="w-4 h-4 mr-2" />
              Exporter PDF
            </Button>

            <Button
              onClick={() => publierMutation.mutate()}
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={selectionnes.length === 0 || publierMutation.isPending}
            >
              <Globe className="w-4 h-4 mr-2" />
              {publierMutation.isPending ? "Publication..." : "Publier sur le site"}
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-green-200 bg-green-50/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-700">{selectionnes.length}</p>
                  <p className="text-sm text-green-600">Sélectionnés</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-yellow-200 bg-yellow-50/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-yellow-700">{attente.length}</p>
                  <p className="text-sm text-yellow-600">En attente</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Users2 className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-700">{selectionnesEquipes.length + attenteEquipes.length}</p>
                  <p className="text-sm text-blue-600">Équipes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-700">{selectionnesIndividus.length + attenteIndividus.length}</p>
                  <p className="text-sm text-purple-600">Individus</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs pour séparer Équipes et Individus */}
        <Tabs defaultValue="selectionnes" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="selectionnes" className="gap-2">
              <CheckCircle className="w-4 h-4" />
              Sélectionnés ({selectionnes.length})
            </TabsTrigger>
            <TabsTrigger value="attente" className="gap-2">
              <Clock className="w-4 h-4" />
              Liste d'attente ({attente.length})
            </TabsTrigger>
          </TabsList>

          {/* SÉLECTIONNÉS */}
          <TabsContent value="selectionnes" className="space-y-4">
            {selectionnes.length === 0 ? (
              <Card className="border-[#E9ECEF]">
                <CardContent className="p-8 text-center">
                  <Star className="w-12 h-12 text-[#6C757D] mx-auto mb-4" />
                  <p className="text-[#6C757D]">Aucune équipe ou individu sélectionné</p>
                  <Button
                    onClick={() => navigate('/admin/selection')}
                    className="mt-4 bg-[#24366E]"
                  >
                    Aller à la sélection
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Section Équipes */}
                {selectionnesEquipes.length > 0 && (
                  <Card className="border-[#40B2A4]/30">
                    <CardHeader>
                      <CardTitle className="text-lg text-[#24366E] flex items-center gap-2">
                        <Users2 className="w-5 h-5 text-[#40B2A4]" />
                        Équipes Sélectionnées ({selectionnesEquipes.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectionnesEquipes.map((item, index) => {
                          const details = getEquipeDetails(item.id);
                          return (
                            <motion.div
                              key={item.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="p-4 bg-gradient-to-r from-[#40B2A4]/5 to-transparent rounded-lg border border-[#40B2A4]/20"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <div className="w-8 h-8 rounded-full bg-[#40B2A4] text-white flex items-center justify-center font-bold text-sm">
                                      {item.position}
                                    </div>
                                    <h3 className="font-bold text-[#24366E] text-lg">
                                      {item.nom_equipe}
                                    </h3>
                                    <Badge className="bg-[#40B2A4] text-white">
                                      {item.score_moyen}/100
                                    </Badge>
                                  </div>

                                  {/* Membres */}
                                  <div className="ml-11 space-y-2">
                                    {details?.membres?.map((membre) => (
                                      <div key={membre.id} className="flex items-center gap-2 text-sm text-[#6C757D]">
                                        <User className="w-3 h-3" />
                                        <span className="font-medium text-[#212529]">{membre.nom_prenom}</span>
                                        {membre.est_chef && (
                                          <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-700 border-yellow-300">
                                            Chef
                                          </Badge>
                                        )}
                                        <span>•</span>
                                        <GraduationCap className="w-3 h-3" />
                                        <span>{membre.filiere}, {membre.niveau_etudes}</span>
                                        {membre.etablissement && (
                                          <>
                                            <span>•</span>
                                            <Building2 className="w-3 h-3" />
                                            <span>{membre.etablissement}</span>
                                          </>
                                        )}
                                      </div>
                                    ))}

                                    {/* Projet */}
                                    {details?.nom_projet && (
                                      <div className="mt-2 p-2 bg-[#40B2A4]/10 rounded text-sm">
                                        <span className="font-medium text-[#24366E]">Projet: </span>
                                        <span className="text-[#6C757D]">{details.nom_projet}</span>
                                        {details.domaine_projet && (
                                          <Badge variant="outline" className="ml-2 text-xs">
                                            {details.domaine_projet}
                                          </Badge>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <Medal className={`w-8 h-8 ${
                                  item.position === 1 ? "text-yellow-400" :
                                  item.position === 2 ? "text-gray-400" :
                                  item.position === 3 ? "text-orange-400" :
                                  "text-[#40B2A4]"
                                }`} />
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Section Individus */}
                {selectionnesIndividus.length > 0 && (
                  <Card className="border-purple-200">
                    <CardHeader>
                      <CardTitle className="text-lg text-purple-700 flex items-center gap-2">
                        <User className="w-5 h-5 text-purple-500" />
                        Individus Sélectionnés ({selectionnesIndividus.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {selectionnesIndividus.map((item, index) => {
                          const details = getEquipeDetails(item.id);
                          const membre = details?.membres?.[0];
                          return (
                            <motion.div
                              key={item.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="p-4 bg-gradient-to-r from-purple-50 to-transparent rounded-lg border border-purple-200"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold text-sm">
                                  {item.position}
                                </div>
                                <div className="flex-1">
                                  <h3 className="font-bold text-[#24366E]">
                                    {membre?.nom_prenom || item.nom_equipe}
                                  </h3>
                                  <p className="text-sm text-[#6C757D]">
                                    {membre?.filiere}, {membre?.niveau_etudes}
                                    {membre?.etablissement && ` - ${membre.etablissement}`}
                                  </p>
                                </div>
                                <Badge className="bg-purple-500 text-white">
                                  {item.score_moyen}/100
                                </Badge>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </TabsContent>

          {/* LISTE D'ATTENTE */}
          <TabsContent value="attente" className="space-y-4">
            {attente.length === 0 ? (
              <Card className="border-[#E9ECEF]">
                <CardContent className="p-8 text-center">
                  <Clock className="w-12 h-12 text-[#6C757D] mx-auto mb-4" />
                  <p className="text-[#6C757D]">Aucune équipe ou individu en liste d'attente</p>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Attente Équipes */}
                {attenteEquipes.length > 0 && (
                  <Card className="border-yellow-200">
                    <CardHeader>
                      <CardTitle className="text-lg text-yellow-700 flex items-center gap-2">
                        <Users2 className="w-5 h-5 text-yellow-500" />
                        Équipes en Attente ({attenteEquipes.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {attenteEquipes.map((item, index) => {
                          const details = getEquipeDetails(item.id);
                          return (
                            <motion.div
                              key={item.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="p-4 bg-yellow-50 rounded-lg border border-yellow-200"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <div className="w-8 h-8 rounded-full bg-yellow-500 text-white flex items-center justify-center font-bold text-sm">
                                      {item.position}
                                    </div>
                                    <h3 className="font-bold text-[#24366E]">
                                      {item.nom_equipe}
                                    </h3>
                                    <Badge className="bg-yellow-500 text-white">
                                      {item.score_moyen}/100
                                    </Badge>
                                  </div>

                                  <div className="ml-11 space-y-1">
                                    {details?.membres?.map((membre) => (
                                      <div key={membre.id} className="text-sm text-[#6C757D]">
                                        • {membre.nom_prenom} - {membre.filiere}, {membre.niveau_etudes}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Attente Individus */}
                {attenteIndividus.length > 0 && (
                  <Card className="border-orange-200">
                    <CardHeader>
                      <CardTitle className="text-lg text-orange-700 flex items-center gap-2">
                        <User className="w-5 h-5 text-orange-500" />
                        Individus en Attente ({attenteIndividus.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {attenteIndividus.map((item, index) => {
                          const details = getEquipeDetails(item.id);
                          const membre = details?.membres?.[0];
                          return (
                            <motion.div
                              key={item.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="p-4 bg-orange-50 rounded-lg border border-orange-200"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-sm">
                                  {item.position}
                                </div>
                                <div className="flex-1">
                                  <h3 className="font-bold text-[#24366E]">
                                    {membre?.nom_prenom || item.nom_equipe}
                                  </h3>
                                  <p className="text-sm text-[#6C757D]">
                                    {membre?.filiere}, {membre?.niveau_etudes}
                                  </p>
                                </div>
                                <Badge className="bg-orange-500 text-white">
                                  {item.score_moyen}/100
                                </Badge>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default PreviewSelection;
