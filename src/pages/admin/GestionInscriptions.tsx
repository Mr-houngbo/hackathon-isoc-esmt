import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/layout/AdminLayout";
import { motion } from "framer-motion";
import { useState } from "react";
import { Search, Users, User, Mail, Phone, MapPin, GraduationCap, Briefcase, Calendar, Eye, FileText, Globe, Github, Linkedin, Twitter, Download, FileSpreadsheet, Instagram, CheckCircle, XCircle, Heart, Flag, Target, Lightbulb, Layers, TrendingUp, Award, BookOpen, Info, Crown, Tag } from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

interface Membre {
  id: string;
  nom_prenom: string;
  email: string;
  telephone?: string;
  filiere: string;
  niveau_etudes: string;
  role_equipe: string;
  ecole?: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
  est_chef?: boolean;
  genre?: 'homme' | 'femme' | 'non_precise';
  etablissement?: string;
  competences?: string[];
  disponible_2_jours?: boolean;
  accepte_conditions?: boolean;
  autorise_photos?: boolean;
}

interface Equipe {
  id: string;
  nom_equipe: string;
  type_candidature: 'individuel' | 'equipe';
  nom_projet?: string;
  description_projet?: string;
  technos?: string[];
  statut: string;
  created_at: string;
  membres?: Membre[];
  // Champs projet
  a_projet?: 'oui' | 'non' | 'en_reflexion';
  domaine_projet?: string;
  problematique?: string;
  solution?: string;
  technologies?: string;
  niveau_avancement?: 'concept' | 'esquisse' | 'prototype';
  contraintes_techniques?: string;
  niveau_technique?: 'debutant' | 'intermediaire' | 'avance';
  competences_equipe?: string[];
  handle_instagram?: string;
  handle_linkedin?: string;
  motivation?: string;
  esperances?: string;
  source_info?: string;
}

const GestionInscriptions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEquipe, setSelectedEquipe] = useState<Equipe | null>(null);
  const [filterType, setFilterType] = useState<'toutes' | 'individuelles' | 'equipes'>('toutes');

  const { data: equipes, isLoading, error } = useQuery({
    queryKey: ["admin-inscriptions-full"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("equipes")
        .select(`
          *,
          membres (*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Equipe[];
    },
  });

  const filteredEquipes = equipes?.filter((eq) => {
    const matchesSearch = 
      eq.nom_equipe?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.description_projet?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.membres?.some(membre => 
        membre.nom_prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        membre.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    switch (filterType) {
      case 'individuelles':
        return matchesSearch && eq.type_candidature === 'individuel';
      case 'equipes':
        return matchesSearch && eq.type_candidature === 'equipe';
      default:
        return matchesSearch;
    }
  }) || [];

  const stats = {
    total: equipes?.length || 0,
    individuelles: equipes?.filter(e => e.type_candidature === 'individuel').length || 0,
    equipes: equipes?.filter(e => e.type_candidature === 'equipe').length || 0,
  };

  const getTypeIcon = (type: string) => {
    return type === 'individuel' ? <User className="w-4 h-4" /> : <Users className="w-4 h-4" />;
  };

  const getTypeLabel = (type: string) => {
    return type === 'individuel' ? 'Candidat Individuel' : 'Équipe';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Export functions
  const exportToCSV = () => {
    if (!filteredEquipes || filteredEquipes.length === 0) return;

    const headers = [
      'Type', 'Nom Équipe', 'Projet', 'Description', 'Technologies', 'Date',
      'Membre', 'Email', 'Téléphone', 'Rôle', 'Filière', 'Niveau', 'École',
      'LinkedIn', 'GitHub', 'Twitter'
    ];

    const rows: string[][] = [];
    filteredEquipes.forEach((equipe) => {
      const baseInfo = [
        equipe.type_candidature,
        equipe.nom_equipe,
        equipe.nom_projet || '',
        equipe.description_projet || '',
        (equipe.technos || []).join(', '),
        formatDate(equipe.created_at)
      ];

      if (equipe.membres && equipe.membres.length > 0) {
        equipe.membres.forEach((membre) => {
          rows.push([
            ...baseInfo,
            membre.nom_prenom,
            membre.email,
            membre.telephone || '',
            membre.role_equipe,
            membre.filiere,
            membre.niveau_etudes,
            membre.ecole || '',
            membre.linkedin || '',
            membre.github || '',
            membre.twitter || ''
          ]);
        });
      } else {
        rows.push([...baseInfo, '', '', '', '', '', '', '', '', '', '', '']);
      }
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${(cell || '').replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `inscriptions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    if (!filteredEquipes || filteredEquipes.length === 0) return;

    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(18);
    doc.setTextColor(30, 58, 95);
    doc.text('Liste des Inscriptions - Hackathon ISOC-ESMT', 14, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Exporté le ${new Date().toLocaleDateString('fr-FR')}`, 14, 28);
    doc.text(`Total: ${filteredEquipes.length} candidatures`, 14, 33);

    const tableData: (string | number)[][] = [];
    filteredEquipes.forEach((equipe, idx) => {
      const typeLabel = equipe.type_candidature === 'individuel' ? 'Individuel' : 'Équipe';
      
      if (equipe.membres && equipe.membres.length > 0) {
        equipe.membres.forEach((membre, mIdx) => {
          tableData.push([
            idx + 1,
            typeLabel,
            equipe.nom_equipe,
            membre.nom_prenom,
            membre.email,
            membre.telephone || '-',
            membre.role_equipe,
            membre.filiere,
            membre.niveau_etudes,
            equipe.nom_projet?.substring(0, 30) || '-'
          ]);
        });
      } else {
        tableData.push([
          idx + 1,
          typeLabel,
          equipe.nom_equipe,
          '-',
          '-',
          '-',
          '-',
          '-',
          '-',
          equipe.nom_projet?.substring(0, 30) || '-'
        ]);
      }
    });

    autoTable(doc, {
      head: [['#', 'Type', 'Équipe', 'Membre', 'Email', 'Tél', 'Rôle', 'Filière', 'Niveau', 'Projet']],
      body: tableData,
      startY: 40,
      theme: 'grid',
      headStyles: {
        fillColor: [30, 58, 95],
        textColor: 255,
        fontSize: 9
      },
      bodyStyles: {
        fontSize: 8,
        textColor: 50
      },
      alternateRowStyles: {
        fillColor: [248, 249, 250]
      },
      columnStyles: {
        0: { cellWidth: 8 },
        1: { cellWidth: 20 },
        2: { cellWidth: 30 },
        3: { cellWidth: 25 },
        4: { cellWidth: 35 },
        5: { cellWidth: 22 },
        6: { cellWidth: 20 },
        7: { cellWidth: 25 },
        8: { cellWidth: 18 },
        9: { cellWidth: 35 }
      },
      margin: { top: 40 }
    });

    doc.save(`inscriptions_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#24366E]"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-red-600 mb-4">Erreur lors du chargement des inscriptions</p>
            <p className="text-gray-600">{(error as Error).message}</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] to-white p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 
                className="font-display text-3xl font-bold text-[#212529] mb-2"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                Inscriptions
              </h1>
              <p 
                className="text-[#6C757D]"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                Consultation des candidatures complètes
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6">
              <div className="flex gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#24366E]">{stats.total}</div>
                  <div className="text-sm text-[#6C757D]">Total</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#40B2A4]">{stats.individuelles}</div>
                  <div className="text-sm text-[#6C757D]">Individus</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#40B2A4]">{stats.equipes}</div>
                  <div className="text-sm text-[#6C757D]">Équipes</div>
                </div>
              </div>
              
              {/* Export Buttons */}
              <div className="flex items-center gap-2 pl-6 border-l border-[#E9ECEF]">
                <button
                  onClick={exportToCSV}
                  disabled={!filteredEquipes || filteredEquipes.length === 0}
                  className="group flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 disabled:cursor-not-allowed"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                  title="Exporter en CSV"
                >
                  <FileSpreadsheet className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">CSV</span>
                </button>
                <button
                  onClick={exportToPDF}
                  disabled={!filteredEquipes || filteredEquipes.length === 0}
                  className="group flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 disabled:cursor-not-allowed"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                  title="Exporter en PDF"
                >
                  <Download className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">PDF</span>
                </button>
              </div>
            </div>
          </div>

          {/* Filtres et recherche */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6C757D] w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher par nom, projet ou membre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-[#E9ECEF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#24366E]/20 focus:border-[#24366E]"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterType('toutes')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterType === 'toutes' 
                    ? 'bg-[#24366E] text-white' 
                    : 'bg-white text-[#6C757D] border border-[#E9ECEF] hover:bg-[#F8F9FA]'
                }`}
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                Toutes
              </button>
              <button
                onClick={() => setFilterType('individuelles')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterType === 'individuelles' 
                    ? 'bg-[#40B2A4] text-white' 
                    : 'bg-white text-[#6C757D] border border-[#E9ECEF] hover:bg-[#F8F9FA]'
                }`}
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                Individus
              </button>
              <button
                onClick={() => setFilterType('equipes')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterType === 'equipes' 
                    ? 'bg-[#40B2A4] text-white' 
                    : 'bg-white text-[#6C757D] border border-[#E9ECEF] hover:bg-[#F8F9FA]'
                }`}
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                Équipes
              </button>
            </div>
          </div>
        </motion.div>

        {/* Liste des inscriptions */}
        <div className="grid gap-6">
          {filteredEquipes.map((equipe, index) => (
            <motion.div
              key={equipe.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white rounded-2xl border border-[#E9ECEF] shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              {/* Header de la carte */}
              <div className="bg-gradient-to-r from-[#24366E] to-[#2E4A8C] p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getTypeIcon(equipe.type_candidature)}
                      <h2 
                        className="font-display text-xl font-bold text-white"
                        style={{ fontFamily: 'Sora, sans-serif' }}
                      >
                        {equipe.nom_equipe}
                      </h2>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-white/20 rounded-full text-xs text-white font-medium">
                        {getTypeLabel(equipe.type_candidature)}
                      </span>
                      <span className="px-2 py-1 bg-white/20 rounded-full text-xs text-white font-medium">
                        {formatDate(equipe.created_at)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedEquipe(selectedEquipe?.id === equipe.id ? null : equipe)}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Contenu de la carte */}
              <div className="p-6">
                {/* Informations sur le projet */}
                {equipe.nom_projet && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-[#212529] mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#24366E]" />
                      Nom du projet
                    </h3>
                    <p className="text-[#6C757D] leading-relaxed">{equipe.nom_projet}</p>
                  </div>
                )}

                {equipe.description_projet && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-[#212529] mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#24366E]" />
                      Description du projet
                    </h3>
                    <p className="text-[#6C757D] leading-relaxed">{equipe.description_projet}</p>
                  </div>
                )}

                {equipe.technos && equipe.technos.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-[#212529] mb-2 flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-[#24366E]" />
                      Technologies
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {equipe.technos.map((techno, idx) => (
                        <span 
                          key={idx}
                          className="px-3 py-1 bg-[#24366E]/10 text-[#24366E] rounded-full text-sm font-medium"
                        >
                          {techno}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Informations sur les membres */}
                {equipe.membres && equipe.membres.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-semibold text-[#212529] mb-4 flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#24366E]" />
                      Membres ({equipe.membres.length})
                    </h3>
                    <div className="space-y-4">
                      {equipe.membres.map((membre) => (
                        <div 
                          key={membre.id}
                          className="bg-[#F8F9FA] rounded-lg p-4 border border-[#E9ECEF]"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {/* Nom et rôle */}
                            <div className="space-y-1">
                              <div className="font-medium text-[#212529]">{membre.nom_prenom}</div>
                              <div className="text-sm text-[#6C757D]">{membre.role_equipe}</div>
                            </div>
                            
                            {/* Contact */}
                            <div className="space-y-1">
                              {membre.email && (
                                <div className="flex items-center gap-2 text-sm text-[#6C757D]">
                                  <Mail className="w-3 h-3" />
                                  {membre.email}
                                </div>
                              )}
                              {membre.telephone && (
                                <div className="flex items-center gap-2 text-sm text-[#6C757D]">
                                  <Phone className="w-3 h-3" />
                                  {membre.telephone}
                                </div>
                              )}
                            </div>
                            
                            {/* Études */}
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm text-[#6C757D]">
                                <GraduationCap className="w-3 h-3" />
                                {membre.filiere}
                              </div>
                              <div className="text-sm text-[#6C757D]">{membre.niveau_etudes}</div>
                              {membre.ecole && (
                                <div className="text-sm text-[#6C757D]">{membre.ecole}</div>
                              )}
                            </div>
                            
                            {/* Réseaux sociaux */}
                            <div className="space-y-1">
                              {membre.linkedin && (
                                <a 
                                  href={membre.linkedin} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-sm text-[#0A66C2] hover:text-[#0077B5] transition-colors"
                                >
                                  <Linkedin className="w-3 h-3" />
                                  LinkedIn
                                </a>
                              )}
                              {membre.github && (
                                <a 
                                  href={membre.github} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-sm text-[#333] hover:text-[#000] transition-colors"
                                >
                                  <Github className="w-3 h-3" />
                                  GitHub
                                </a>
                              )}
                              {membre.twitter && (
                                <a 
                                  href={membre.twitter} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-sm text-[#1DA1F2] hover:text-[#0F1419] transition-colors"
                                >
                                  <Twitter className="w-3 h-3" />
                                  Twitter
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Modal pour les détails */}
        {selectedEquipe && (
          <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedEquipe(null)}
          >
            <div 
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-[#24366E] to-[#2E4A8C] p-6 sticky top-0 z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getTypeIcon(selectedEquipe.type_candidature)}
                    <h2 className="font-display text-2xl font-bold text-white" style={{ fontFamily: 'Sora, sans-serif' }}>
                      {selectedEquipe.nom_equipe}
                    </h2>
                  </div>
                  <button
                    onClick={() => setSelectedEquipe(null)}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    <Eye className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                {/* Section Équipe / Candidature */}
                <div className="mb-8">
                  <h3 className="font-semibold text-[#212529] mb-4 flex items-center gap-2 text-lg border-b pb-2">
                    <Info className="w-5 h-5 text-[#24366E]" />
                    Informations de la candidature
                  </h3>
                  
                  {/* Type de candidature et projet */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <span className="text-sm text-[#6C757D]">Type de candidature:</span>
                      <p className="font-medium text-[#212529]">
                        {selectedEquipe.type_candidature === 'individuel' ? 'Individuel' : 'Équipe'}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-[#6C757D]">A un projet:</span>
                      <p className="font-medium text-[#212529]">
                        {selectedEquipe.a_projet === 'oui' ? 'Oui' : selectedEquipe.a_projet === 'non' ? 'Non' : 'En réflexion'}
                      </p>
                    </div>
                  </div>

                  {/* Réseaux sociaux de l'équipe */}
                  {(selectedEquipe.handle_instagram || selectedEquipe.handle_linkedin) && (
                    <div className="mb-4">
                      <span className="text-sm text-[#6C757D]">Réseaux sociaux de l'équipe:</span>
                      <div className="flex gap-4 mt-1">
                        {selectedEquipe.handle_instagram && (
                          <a 
                            href={`https://instagram.com/${selectedEquipe.handle_instagram.replace('@', '')}`}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-sm text-[#E4405F] hover:text-[#C13584]"
                          >
                            <Instagram className="w-4 h-4" />
                            @{selectedEquipe.handle_instagram.replace('@', '')}
                          </a>
                        )}
                        {selectedEquipe.handle_linkedin && (
                          <a 
                            href={selectedEquipe.handle_linkedin}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-sm text-[#0A66C2] hover:text-[#0077B5]"
                          >
                            <Linkedin className="w-4 h-4" />
                            LinkedIn
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Source d'information */}
                  {selectedEquipe.source_info && (
                    <div className="mb-4">
                      <span className="text-sm text-[#6C757D]">Comment avez-vous connu le hackathon?</span>
                      <p className="font-medium text-[#212529]">{selectedEquipe.source_info}</p>
                    </div>
                  )}
                </div>

                {/* Section Projet (si applicable) */}
                {(selectedEquipe.a_projet === 'oui' || selectedEquipe.a_projet === 'en_reflexion') && (
                  <div className="mb-8">
                    <h3 className="font-semibold text-[#212529] mb-4 flex items-center gap-2 text-lg border-b pb-2">
                      <Lightbulb className="w-5 h-5 text-[#40B2A4]" />
                      Détails du projet
                    </h3>
                    
                    {selectedEquipe.nom_projet && (
                      <div className="mb-4">
                        <span className="text-sm text-[#6C757D]">Nom du projet:</span>
                        <p className="font-medium text-[#212529]">{selectedEquipe.nom_projet}</p>
                      </div>
                    )}

                    {selectedEquipe.domaine_projet && (
                      <div className="mb-4">
                        <span className="text-sm text-[#6C757D]">Domaine du projet:</span>
                        <p className="font-medium text-[#212529]">{selectedEquipe.domaine_projet}</p>
                      </div>
                    )}

                    {selectedEquipe.problematique && (
                      <div className="mb-4">
                        <span className="text-sm text-[#6C757D]">Problématique:</span>
                        <p className="text-[#6C757D] leading-relaxed bg-[#F8F9FA] p-3 rounded-lg mt-1">{selectedEquipe.problematique}</p>
                      </div>
                    )}

                    {selectedEquipe.solution && (
                      <div className="mb-4">
                        <span className="text-sm text-[#6C757D]">Solution proposée:</span>
                        <p className="text-[#6C757D] leading-relaxed bg-[#F8F9FA] p-3 rounded-lg mt-1">{selectedEquipe.solution}</p>
                      </div>
                    )}

                    {/* Technologies */}
                    {(selectedEquipe.technos?.length || selectedEquipe.technologies) && (
                      <div className="mb-4">
                        <span className="text-sm text-[#6C757D]">Technologies:</span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedEquipe.technos?.map((techno, idx) => (
                            <span key={idx} className="px-3 py-1 bg-[#24366E]/10 text-[#24366E] rounded-full text-sm font-medium">
                              {techno}
                            </span>
                          ))}
                          {selectedEquipe.technologies && (
                            <span className="px-3 py-1 bg-[#40B2A4]/10 text-[#40B2A4] rounded-full text-sm font-medium">
                              {selectedEquipe.technologies}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Niveau d'avancement */}
                    {selectedEquipe.niveau_avancement && (
                      <div className="mb-4">
                        <span className="text-sm text-[#6C757D]">Niveau d'avancement:</span>
                        <p className="font-medium text-[#212529] capitalize">
                          {selectedEquipe.niveau_avancement === 'concept' ? 'Concept' : 
                           selectedEquipe.niveau_avancement === 'esquisse' ? 'Esquisse' : 'Prototype'}
                        </p>
                      </div>
                    )}

                    {selectedEquipe.contraintes_techniques && (
                      <div className="mb-4">
                        <span className="text-sm text-[#6C757D]">Contraintes techniques:</span>
                        <p className="text-[#6C757D] leading-relaxed bg-[#F8F9FA] p-3 rounded-lg mt-1">{selectedEquipe.contraintes_techniques}</p>
                      </div>
                    )}

                    {/* Niveau technique et compétences */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {selectedEquipe.niveau_technique && (
                        <div>
                          <span className="text-sm text-[#6C757D]">Niveau technique:</span>
                          <p className="font-medium text-[#212529] capitalize">
                            {selectedEquipe.niveau_technique === 'debutant' ? 'Débutant' : 
                             selectedEquipe.niveau_technique === 'intermediaire' ? 'Intermédiaire' : 'Avancé'}
                          </p>
                        </div>
                      )}
                    </div>

                    {selectedEquipe.competences_equipe?.length > 0 && (
                      <div className="mb-4">
                        <span className="text-sm text-[#6C757D]">Compétences de l'équipe:</span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedEquipe.competences_equipe.map((comp, idx) => (
                            <span key={idx} className="px-3 py-1 bg-[#FFA07A]/10 text-[#D25238] rounded-full text-sm font-medium">
                              {comp}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Motivation et Espérances */}
                {(selectedEquipe.motivation || selectedEquipe.esperances) && (
                  <div className="mb-8">
                    <h3 className="font-semibold text-[#212529] mb-4 flex items-center gap-2 text-lg border-b pb-2">
                      <Heart className="w-5 h-5 text-[#D25238]" />
                      Motivations et espérances
                    </h3>
                    
                    {selectedEquipe.motivation && (
                      <div className="mb-4">
                        <span className="text-sm text-[#6C757D]">Motivation:</span>
                        <p className="text-[#6C757D] leading-relaxed bg-[#F8F9FA] p-3 rounded-lg mt-1">{selectedEquipe.motivation}</p>
                      </div>
                    )}

                    {selectedEquipe.esperances && (
                      <div className="mb-4">
                        <span className="text-sm text-[#6C757D]">Espérances:</span>
                        <p className="text-[#6C757D] leading-relaxed bg-[#F8F9FA] p-3 rounded-lg mt-1">{selectedEquipe.esperances}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Section Membres */}
                {selectedEquipe.membres && selectedEquipe.membres.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-[#212529] mb-4 flex items-center gap-2 text-lg border-b pb-2">
                      <Users className="w-5 h-5 text-[#24366E]" />
                      Membres ({selectedEquipe.membres.length})
                    </h3>
                    <div className="space-y-6">
                      {selectedEquipe.membres.map((membre) => (
                        <div key={membre.id} className="bg-[#F8F9FA] rounded-xl p-5 border border-[#E9ECEF]">
                          {/* Header membre avec badge chef */}
                          <div className="flex items-center gap-2 mb-4">
                            {membre.est_chef && (
                              <span className="flex items-center gap-1 px-3 py-1 bg-[#24366E] text-white rounded-full text-xs font-medium">
                                <Crown className="w-3 h-3" />
                                Chef d'équipe
                              </span>
                            )}
                            {membre.genre && (
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                membre.genre === 'homme' ? 'bg-blue-100 text-blue-700' : 
                                membre.genre === 'femme' ? 'bg-pink-100 text-pink-700' : 
                                'bg-gray-100 text-gray-700'
                              }`}>
                              {membre.genre === 'homme' ? 'Homme' : membre.genre === 'femme' ? 'Femme' : 'Non précisé'}
                            </span>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {/* Nom et rôle */}
                            <div className="space-y-2">
                              <div>
                                <span className="text-xs text-[#6C757D]">Nom complet</span>
                                <p className="font-semibold text-[#212529]">{membre.nom_prenom}</p>
                              </div>
                              <div>
                                <span className="text-xs text-[#6C757D]">Rôle</span>
                                <p className="text-sm text-[#6C757D]">{membre.role_equipe}</p>
                              </div>
                            </div>
                            
                            {/* Contact */}
                            <div className="space-y-2">
                              <div>
                                <span className="text-xs text-[#6C757D]">Email</span>
                                <p className="text-sm text-[#212529]">{membre.email}</p>
                              </div>
                              {membre.telephone && (
                                <div>
                                  <span className="text-xs text-[#6C757D]">Téléphone</span>
                                  <p className="text-sm text-[#6C757D]">{membre.telephone}</p>
                                </div>
                              )}
                            </div>
                            
                            {/* Études */}
                            <div className="space-y-2">
                              <div>
                                <span className="text-xs text-[#6C757D]">Filière</span>
                                <p className="text-sm text-[#212529]">{membre.filiere}</p>
                              </div>
                              <div>
                                <span className="text-xs text-[#6C757D]">Niveau</span>
                                <p className="text-sm text-[#6C757D]">{membre.niveau_etudes}</p>
                              </div>
                            </div>

                            {/* Établissement */}
                            <div className="space-y-2">
                              <div>
                                <span className="text-xs text-[#6C757D]">Établissement</span>
                                <p className="text-sm text-[#212529]">{membre.etablissement || membre.ecole || 'Non renseigné'}</p>
                              </div>
                            </div>

                            {/* Compétences */}
                            {membre.competences && membre.competences.length > 0 && (
                              <div className="space-y-2 md:col-span-2">
                                <span className="text-xs text-[#6C757D]">Compétences</span>
                                <div className="flex flex-wrap gap-2">
                                  {membre.competences.map((comp, idx) => (
                                    <span key={idx} className="px-2 py-1 bg-[#40B2A4]/10 text-[#40B2A4] rounded text-xs font-medium">
                                      {comp}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {/* Réseaux sociaux */}
                            <div className="space-y-2">
                              {membre.linkedin && (
                                <a 
                                  href={membre.linkedin} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-sm text-[#0A66C2] hover:text-[#0077B5]"
                                >
                                  <Linkedin className="w-4 h-4" />
                                  LinkedIn
                                </a>
                              )}
                              {membre.github && (
                                <a 
                                  href={membre.github} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-sm text-[#333] hover:text-[#000]"
                                >
                                  <Github className="w-4 h-4" />
                                  GitHub
                                </a>
                              )}
                              {membre.twitter && (
                                <a 
                                  href={membre.twitter} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-sm text-[#1DA1F2] hover:text-[#0F1419]"
                                >
                                  <Twitter className="w-4 h-4" />
                                  Twitter
                                </a>
                              )}
                            </div>

                            {/* Disponibilité et conditions */}
                            <div className="space-y-2 md:col-span-3">
                              <div className="flex flex-wrap gap-4 mt-2">
                                <span className={`flex items-center gap-1 text-xs ${
                                  membre.disponible_2_jours ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {membre.disponible_2_jours ? (
                                    <><CheckCircle className="w-3 h-3" /> Disponible les 2 jours</>
                                  ) : (
                                    <><XCircle className="w-3 h-3" /> Non disponible les 2 jours</>
                                  )}
                                </span>
                                {membre.accepte_conditions && (
                                  <span className="flex items-center gap-1 text-xs text-green-600">
                                    <CheckCircle className="w-3 h-3" /> Conditions acceptées
                                  </span>
                                )}
                                {membre.autorise_photos && (
                                  <span className="flex items-center gap-1 text-xs text-green-600">
                                    <CheckCircle className="w-3 h-3" /> Photos autorisées
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default GestionInscriptions;
