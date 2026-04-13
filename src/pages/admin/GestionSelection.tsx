import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Trophy, 
  Users, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw, 
  Eye,
  Download,
  Globe,
  Star,
  Clock,
  FileText,
  ChevronDown,
  ChevronUp,
  Filter,
  Search,
  CheckSquare,
  Square,
  Medal,
  Award,
  User,
  Users2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import AdminLayout from "@/components/layout/AdminLayout";

interface ClassementItem {
  id: string;
  nom_equipe: string;
  type_candidature: string;
  statut: string;
  nb_evaluateurs: number;
  score_moyen: number;
  score_final: number;
  selectionne_manuel?: boolean;
  position?: number;
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

const GestionSelection = () => {
  const queryClient = useQueryClient();
  const [selectedEquipes, setSelectedEquipes] = useState<Set<string>>(new Set());
  const [selectedAttente, setSelectedAttente] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<'tous' | 'equipe' | 'individuel'>('tous');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showPdfPreview, setShowPdfPreview] = useState(false);

  // Récupérer le classement
  const { data: classement, isLoading, refetch } = useQuery({
    queryKey: ["classement-gestion-selection"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("vue_classement_selection")
        .select("*")
        .order("score_final", { ascending: false });
      
      if (error) throw error;
      
      // Ajouter la position
      return (data as ClassementItem[]).map((item, index) => ({
        ...item,
        position: index + 1
      }));
    },
  });

  // Récupérer les équipes déjà sélectionnées
  const { data: equipesSelectionnees } = useQuery({
    queryKey: ["equipes-selectionnees-actuelles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("equipes")
        .select("id, statut")
        .in("statut", ["selectionne", "en_attente"]);
      
      if (error) throw error;
      return data || [];
    },
  });

  // Synchroniser les sélections avec les données de la BD
  useEffect(() => {
    if (equipesSelectionnees) {
      const selectionnes = new Set<string>();
      const attente = new Set<string>();
      
      equipesSelectionnees.forEach((eq: any) => {
        if (eq.statut === 'selectionne') selectionnes.add(eq.id);
        if (eq.statut === 'en_attente') attente.add(eq.id);
      });
      
      setSelectedEquipes(selectionnes);
      setSelectedAttente(attente);
    }
  }, [equipesSelectionnees]);

  // Mutation pour mettre à jour le statut
  const updateStatutMutation = useMutation({
    mutationFn: async ({ equipeId, statut }: { equipeId: string; statut: string }) => {
      const { error } = await supabase
        .from("equipes")
        .update({ statut })
        .eq("id", equipeId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["equipes-selectionnees-actuelles"] });
      queryClient.invalidateQueries({ queryKey: ["classement-gestion-selection"] });
    },
  });

  // Mutation pour publier les équipes
  const publierMutation = useMutation({
    mutationFn: async () => {
      // Publier toutes les équipes sélectionnées
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

  // Récupérer les détails d'une équipe pour le PDF
  const fetchEquipeDetail = async (equipeId: string): Promise<EquipeDetail | null> => {
    const { data, error } = await supabase
      .from("equipes")
      .select(`
        *,
        membres (*)
      `)
      .eq("id", equipeId)
      .single();
    
    if (error || !data) return null;
    return data as EquipeDetail;
  };

  // Filtrer le classement
  const filteredClassement = classement?.filter(item => {
    const matchesSearch = item.nom_equipe?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false;
    const matchesType = filterType === 'tous' || item.type_candidature === filterType;
    return matchesSearch && matchesType;
  });

  // Toggle sélection
  const toggleSelection = (equipeId: string, currentPosition: number) => {
    const newSelection = new Set(selectedEquipes);
    const newAttente = new Set(selectedAttente);
    
    if (newSelection.has(equipeId)) {
      // Déjà sélectionné -> retirer
      newSelection.delete(equipeId);
      updateStatutMutation.mutate({ equipeId, statut: 'non_selectionne' });
    } else if (newAttente.has(equipeId)) {
      // En attente -> passer à sélectionné
      newAttente.delete(equipeId);
      newSelection.add(equipeId);
      updateStatutMutation.mutate({ equipeId, statut: 'selectionne' });
    } else {
      // Non sélectionné
      if (newSelection.size < 40) {
        newSelection.add(equipeId);
        updateStatutMutation.mutate({ equipeId, statut: 'selectionne' });
      } else if (newAttente.size < 10) {
        newAttente.add(equipeId);
        updateStatutMutation.mutate({ equipeId, statut: 'en_attente' });
      } else {
        toast.error("Limite atteinte : 40 sélectionnés + 10 en attente maximum");
        return;
      }
    }
    
    setSelectedEquipes(newSelection);
    setSelectedAttente(newAttente);
  };

  // Sélection automatique des 40 premiers + 10 en attente
  const autoSelect = () => {
    if (!classement) return;
    
    const newSelection = new Set<string>();
    const newAttente = new Set<string>();
    
    classement.forEach((item, index) => {
      if (index < 40) {
        newSelection.add(item.id);
        updateStatutMutation.mutate({ equipeId: item.id, statut: 'selectionne' });
      } else if (index < 50) {
        newAttente.add(item.id);
        updateStatutMutation.mutate({ equipeId: item.id, statut: 'en_attente' });
      } else {
        updateStatutMutation.mutate({ equipeId: item.id, statut: 'non_selectionne' });
      }
    });
    
    setSelectedEquipes(newSelection);
    setSelectedAttente(newAttente);
    toast.success("Sélection automatique effectuée : Top 40 + 10 en attente");
  };

  // Générer le PDF
  const generatePDF = async () => {
    const doc = new jsPDF();
    const selectedItems = classement?.filter(item => 
      selectedEquipes.has(item.id) || selectedAttente.has(item.id)
    ) || [];

    // En-tête
    doc.setFillColor(36, 54, 110);
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("HACKATHON ISOC-ESMT 2025", 105, 20, { align: "center" });
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text("Liste des équipes et individus sélectionnés", 105, 30, { align: "center" });
    
    // Date
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(10);
    doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, 105, 38, { align: "center" });

    let currentY = 50;

    // Section SÉLECTIONNÉS (Top 40)
    if (selectedEquipes.size > 0) {
      doc.setFillColor(64, 178, 164);
      doc.rect(14, currentY - 5, 182, 10, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(`✓ SÉLECTIONNÉS (${selectedEquipes.size}/40)`, 20, currentY + 1);
      currentY += 15;

      const selectionnes = selectedItems.filter(item => selectedEquipes.has(item.id));
      
      for (const item of selectionnes) {
        if (currentY > 250) {
          doc.addPage();
          currentY = 20;
        }

        // Récupérer les détails
        const details = await fetchEquipeDetail(item.id);
        
        doc.setTextColor(36, 54, 110);
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text(`${item.position}. ${item.nom_equipe}`, 20, currentY);
        
        doc.setTextColor(100, 100, 100);
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.text(`Type: ${item.type_candidature === 'equipe' ? 'Équipe' : 'Individuel'} | Score: ${item.score_moyen}/100 | Évaluateurs: ${item.nb_evaluateurs}`, 20, currentY + 5);
        
        if (details?.membres && details.membres.length > 0) {
          doc.setFontSize(8);
          const membresText = details.membres.map(m => 
            `${m.nom_prenom} (${m.filiere}, ${m.niveau_etudes}${m.est_chef ? ' - Chef' : ''})`
          ).join(', ');
          doc.text(`Membres: ${membresText}`, 20, currentY + 10, { maxWidth: 170 });
          currentY += 20;
        } else {
          currentY += 12;
        }
      }
    }

    // Section LISTE D'ATTENTE
    if (selectedAttente.size > 0) {
      currentY += 10;
      if (currentY > 220) {
        doc.addPage();
        currentY = 20;
      }

      doc.setFillColor(255, 193, 7);
      doc.rect(14, currentY - 5, 182, 10, 'F');
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(`⏳ LISTE D'ATTENTE (${selectedAttente.size}/10)`, 20, currentY + 1);
      currentY += 15;

      const attente = selectedItems.filter(item => selectedAttente.has(item.id));
      
      for (const item of attente) {
        if (currentY > 250) {
          doc.addPage();
          currentY = 20;
        }

        const details = await fetchEquipeDetail(item.id);
        
        doc.setTextColor(36, 54, 110);
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text(`${item.position}. ${item.nom_equipe}`, 20, currentY);
        
        doc.setTextColor(100, 100, 100);
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.text(`Type: ${item.type_candidature === 'equipe' ? 'Équipe' : 'Individuel'} | Score: ${item.score_moyen}/100`, 20, currentY + 5);
        
        if (details?.membres && details.membres.length > 0) {
          doc.setFontSize(8);
          const membresText = details.membres.map(m => 
            `${m.nom_prenom} (${m.filiere}, ${m.niveau_etudes})`
          ).join(', ');
          doc.text(`Membres: ${membresText}`, 20, currentY + 10, { maxWidth: 170 });
          currentY += 20;
        } else {
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
      doc.setFontSize(8);
      doc.text("Hackathon ISOC-ESMT 2025 - Incubation et Innovation", 105, 288, { align: "center" });
      doc.text(`Page ${i}/${pageCount}`, 190, 288, { align: "right" });
    }

    doc.save(`selection-hackathon-isoc-esmt-${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success("PDF généré avec succès !");
  };

  const getStatusInfo = (item: ClassementItem) => {
    if (selectedEquipes.has(item.id)) {
      return { 
        label: "Sélectionné", 
        color: "bg-green-500/20 text-green-400 border-green-500/30",
        icon: CheckCircle,
        badge: <Medal className="w-4 h-4 text-yellow-400" />
      };
    }
    if (selectedAttente.has(item.id)) {
      return { 
        label: "En attente", 
        color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
        icon: Clock,
        badge: <Clock className="w-4 h-4 text-yellow-400" />
      };
    }
    if (item.position && item.position <= 40) {
      return { 
        label: "Top 40", 
        color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
        icon: Star,
        badge: null
      };
    }
    return { 
      label: "Non sélectionné", 
      color: "bg-gray-500/20 text-gray-400 border-gray-500/30",
      icon: Square,
      badge: null
    };
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-4">
            <div className="w-8 h-8 border-2 border-[#40B2A4] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-[#6C757D]">Chargement du classement...</p>
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
          <div>
            <h1 className="text-2xl font-bold text-[#24366E] flex items-center gap-2">
              <Trophy className="w-6 h-6 text-[#40B2A4]" />
              Gestion de la Sélection Finale
            </h1>
            <p className="text-[#6C757D]">
              Sélectionnez les 40 équipes/individus + 10 en liste d'attente
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => refetch()}
              className="border-[#E9ECEF] text-[#6C757D] hover:bg-[#F8F9FA]"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualiser
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-[#E9ECEF]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#24366E]">{selectedEquipes.size}/40</p>
                  <p className="text-sm text-[#6C757D]">Sélectionnés</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#E9ECEF]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#24366E]">{selectedAttente.size}/10</p>
                  <p className="text-sm text-[#6C757D]">En attente</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#E9ECEF]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#24366E]">{classement?.length || 0}</p>
                  <p className="text-sm text-[#6C757D]">Total candidats</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#E9ECEF]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#24366E]">
                    {equipesSelectionnees?.filter((e: any) => e.publiee).length || 0}
                  </p>
                  <p className="text-sm text-[#6C757D]">Publiés</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={autoSelect}
            className="bg-gradient-to-r from-[#24366E] to-[#40B2A4] text-white"
          >
            <Star className="w-4 h-4 mr-2" />
            Auto-sélection (Top 40 + 10)
          </Button>

          <Button
            onClick={generatePDF}
            variant="outline"
            className="border-[#D25238] text-[#D25238] hover:bg-[#D25238]/10"
            disabled={selectedEquipes.size === 0 && selectedAttente.size === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Exporter PDF
          </Button>

          <Button
            onClick={() => publierMutation.mutate()}
            className="bg-green-600 hover:bg-green-700 text-white"
            disabled={selectedEquipes.size === 0 || publierMutation.isPending}
          >
            <Globe className="w-4 h-4 mr-2" />
            {publierMutation.isPending ? "Publication..." : "Publier sur le site"}
          </Button>
        </div>

        {/* Filtres */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6C757D]" />
            <Input
              placeholder="Rechercher une équipe..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-[#E9ECEF]"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#6C757D]" />
            <Tabs value={filterType} onValueChange={(v) => setFilterType(v as any)}>
              <TabsList className="border-[#E9ECEF]">
                <TabsTrigger value="tous">Tous</TabsTrigger>
                <TabsTrigger value="equipe">Équipes</TabsTrigger>
                <TabsTrigger value="individuel">Individuels</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Tableau de classement */}
        <Card className="border-[#E9ECEF]">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-[#24366E]">Classement général</CardTitle>
            <CardDescription>
              Cliquez sur une ligne pour sélectionner/désélectionner
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#E9ECEF]">
                    <th className="text-left py-3 px-2 text-sm font-medium text-[#6C757D]">Rang</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-[#6C757D]">Équipe/Candidat</th>
                    <th className="text-center py-3 px-2 text-sm font-medium text-[#6C757D]">Type</th>
                    <th className="text-center py-3 px-2 text-sm font-medium text-[#6C757D]">Score</th>
                    <th className="text-center py-3 px-2 text-sm font-medium text-[#6C757D]">Éval.</th>
                    <th className="text-center py-3 px-2 text-sm font-medium text-[#6C757D]">Statut</th>
                    <th className="text-center py-3 px-2 text-sm font-medium text-[#6C757D]">Sélection</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClassement?.map((item) => {
                    const statusInfo = getStatusInfo(item);
                    const isSelected = selectedEquipes.has(item.id) || selectedAttente.has(item.id);
                    
                    return (
                      <tr 
                        key={item.id} 
                        className={`border-b border-[#E9ECEF] hover:bg-[#F8F9FA] transition-colors cursor-pointer ${
                          isSelected ? 'bg-green-50/50' : ''
                        }`}
                        onClick={() => toggleSelection(item.id, item.position || 0)}
                      >
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2">
                            <span className={`font-bold ${
                              item.position && item.position <= 3 ? "text-[#40B2A4]" : "text-[#24366E]"
                            }`}>
                              {item.position}
                            </span>
                            {item.position && item.position <= 3 && (
                              <Medal className={`w-4 h-4 ${
                                item.position === 1 ? "text-yellow-400" :
                                item.position === 2 ? "text-gray-400" :
                                "text-orange-400"
                              }`} />
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <p className="font-medium text-[#212529]">{item.nom_equipe}</p>
                        </td>
                        <td className="py-3 px-2 text-center">
                          <Badge variant="outline" className={`${
                            item.type_candidature === 'equipe' 
                              ? "bg-blue-500/20 text-blue-600 border-blue-500/30" 
                              : "bg-purple-500/20 text-purple-600 border-purple-500/30"
                          }`}>
                            {item.type_candidature === 'equipe' ? (
                              <><Users2 className="w-3 h-3 mr-1" /> Équipe</>
                            ) : (
                              <><User className="w-3 h-3 mr-1" /> Individuel</>
                            )}
                          </Badge>
                        </td>
                        <td className="py-3 px-2 text-center">
                          <span className="font-bold text-[#24366E]">{item.score_moyen}/100</span>
                        </td>
                        <td className="py-3 px-2 text-center">
                          <Badge variant="outline" className="bg-gray-100 text-gray-600">
                            {item.nb_evaluateurs}
                          </Badge>
                        </td>
                        <td className="py-3 px-2 text-center">
                          <Badge variant="outline" className={statusInfo.color}>
                            <statusInfo.icon className="w-3 h-3 mr-1" />
                            {statusInfo.label}
                          </Badge>
                        </td>
                        <td className="py-3 px-2 text-center">
                          <button 
                            className="w-6 h-6 rounded border-2 flex items-center justify-center transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSelection(item.id, item.position || 0);
                            }}
                          >
                            {selectedEquipes.has(item.id) ? (
                              <CheckSquare className="w-5 h-5 text-green-500" />
                            ) : selectedAttente.has(item.id) ? (
                              <CheckSquare className="w-5 h-5 text-yellow-500" />
                            ) : (
                              <Square className="w-5 h-5 text-gray-300" />
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Résumé visuel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Sélectionnés */}
          <Card className="border-green-200 bg-green-50/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-green-700 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Sélectionnés ({selectedEquipes.size}/40)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {classement
                  ?.filter(item => selectedEquipes.has(item.id))
                  .map(item => (
                    <div key={item.id} className="flex items-center justify-between p-2 bg-white rounded border border-green-200">
                      <div>
                        <p className="font-medium text-sm">#{item.position} {item.nom_equipe}</p>
                        <p className="text-xs text-[#6C757D]">Score: {item.score_moyen}/100</p>
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => toggleSelection(item.id, item.position || 0)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Retirer
                      </Button>
                    </div>
                  ))}
                {selectedEquipes.size === 0 && (
                  <p className="text-sm text-[#6C757D] italic">Aucune équipe sélectionnée</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Liste d'attente */}
          <Card className="border-yellow-200 bg-yellow-50/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-yellow-700 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Liste d'attente ({selectedAttente.size}/10)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {classement
                  ?.filter(item => selectedAttente.has(item.id))
                  .map(item => (
                    <div key={item.id} className="flex items-center justify-between p-2 bg-white rounded border border-yellow-200">
                      <div>
                        <p className="font-medium text-sm">#{item.position} {item.nom_equipe}</p>
                        <p className="text-xs text-[#6C757D]">Score: {item.score_moyen}/100</p>
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => toggleSelection(item.id, item.position || 0)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Retirer
                      </Button>
                    </div>
                  ))}
                {selectedAttente.size === 0 && (
                  <p className="text-sm text-[#6C757D] italic">Aucune équipe en attente</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default GestionSelection;
