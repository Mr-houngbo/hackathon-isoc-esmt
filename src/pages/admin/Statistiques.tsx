import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/layout/AdminLayout";
import { 
  TrendingUp, 
  Users, 
  Eye, 
  Calendar, 
  Globe, 
  MessageSquare, 
  Share2, 
  Clock,
  Target,
  Award,
  Activity,
  BarChart3,
  PieChart,
  ArrowUp,
  ArrowDown,
  Minus,
  Trophy
} from "lucide-react";
import { motion } from "framer-motion";

const Statistiques = () => {
  // Récupérer les équipes avec leurs membres (jointure correcte)
  const { data: equipes, isLoading: loadingEquipes } = useQuery({
    queryKey: ["admin-stats-equipes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("equipes")
        .select(`
          *,
          membres (
            id,
            nom_prenom,
            genre,
            filiere,
            niveau_etudes,
            telephone,
            email,
            etablissement,
            competences,
            role_equipe,
            disponible_2_jours,
            accepte_conditions,
            autorise_photos,
            competence_autre,
            created_at
          )
        `)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Récupérer tous les membres pour analyses démographiques
  const { data: membres, isLoading: loadingMembres } = useQuery({
    queryKey: ["admin-stats-membres"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("membres")
        .select(`
          *,
          equipes (
            id,
            type_candidature,
            statut,
            a_projet,
            domaine_projet,
            niveau_technique
          )
        `);
      if (error) throw error;
      return data;
    },
  });

  // Récupérer les badges pour statistiques de distribution
  const { data: badges } = useQuery({
    queryKey: ["admin-stats-badges"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("badges")
        .select("*, equipe_id, membre_id, envoye, date_envoi");
      if (error) throw error;
      return data;
    },
  });

  // Récupérer les certificats pour statistiques de réussite
  const { data: certificats } = useQuery({
    queryKey: ["admin-stats-certificats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("certificats")
        .select("*, type, rang, envoye, date_envoi");
      if (error) throw error;
      return data;
    },
  });

  if (loadingEquipes || loadingMembres) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full border-4 border-[#24366E] border-t-transparent animate-spin"></div>
            <p className="text-[#6C757D]">Chargement des statistiques...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Calculer les statistiques réelles depuis les données
  const statsReelles = {
    totalEquipes: equipes?.length || 0,
    equipesSelectionnees: equipes?.filter(e => (e as any).statut === 'selectionne').length || 0,
    equipesEnAttente: equipes?.filter(e => (e as any).statut === 'en_attente').length || 0,
    equipesNonSelectionnees: equipes?.filter(e => (e as any).statut === 'non_selectionne').length || 0,
    totalMembres: equipes?.reduce((acc, eq) => acc + (eq.membres?.length || 0), 0) || 0,
    projetsIndividuels: equipes?.filter(e => e.type_candidature === 'individuel').length || 0,
    projetsEquipe: equipes?.filter(e => e.type_candidature === 'equipe').length || 0,
    projetsAvecProjet: equipes?.filter(e => e.a_projet === 'oui').length || 0,
    projetsSansProjet: equipes?.filter(e => e.a_projet === 'non').length || 0,
    badgesEnvoyes: badges?.filter(b => b.envoye === true).length || 0,
    badgesTotal: badges?.length || 0,
    certificatsParticipation: certificats?.filter(c => c.type === 'participation').length || 0,
    certificatsLaureats: certificats?.filter(c => c.type === 'laureat').length || 0,
  };

  // Analyser les sources d'information depuis les données réelles (table equipes)
  const sourceInfoStats = equipes?.reduce((acc, equipe) => {
    const source = equipe.source_info || 'Non spécifié';
    acc[source] = (acc[source] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Analyser les domaines de projets depuis equipes
  const domaineProjetStats = equipes?.reduce((acc, equipe) => {
    const domaine = equipe.domaine_projet || 'Non spécifié';
    acc[domaine] = (acc[domaine] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Analyser les niveaux techniques depuis equipes
  const niveauTechniqueStats = equipes?.reduce((acc, equipe) => {
    const niveau = equipe.niveau_technique || 'Non spécifié';
    acc[niveau] = (acc[niveau] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Analyser les niveaux d'études depuis membres
  const niveauEtudesStats = membres?.reduce((acc, membre) => {
    const niveau = membre.niveau_etudes || 'Non spécifié';
    acc[niveau] = (acc[niveau] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Analyser les filières depuis membres
  const filiereStats = membres?.reduce((acc, membre) => {
    const filiere = membre.filiere || 'Non spécifié';
    acc[filiere] = (acc[filiere] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Analyser les genres depuis membres
  const genreStats = membres?.reduce((acc, membre) => {
    const genre = membre.genre || 'Non précisé';
    acc[genre] = (acc[genre] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Analyser les rôles dans les équipes depuis membres
  const roleStats = membres?.reduce((acc, membre) => {
    if (membre.role_equipe) {
      acc[membre.role_equipe] = (acc[membre.role_equipe] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  // Analyser les compétences depuis membres (array)
  const competencesStats = membres?.reduce((acc, membre) => {
    if (membre.competences && Array.isArray(membre.competences)) {
      membre.competences.forEach(comp => {
        acc[comp] = (acc[comp] || 0) + 1;
      });
    }
    return acc;
  }, {} as Record<string, number>);

  // Analyser les établissements depuis membres
  const etablissementStats = membres?.reduce((acc, membre) => {
    const etablissement = membre.etablissement || 'Non spécifié';
    acc[etablissement] = (acc[etablissement] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Analyser la disponibilité des membres
  const disponibiliteStats = membres?.reduce((acc, membre) => {
    const disponible = membre.disponible_2_jours ? 'Disponible' : 'Non disponible';
    acc[disponible] = (acc[disponible] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Calculer les pourcentages
  const totalCanaux = Object.values(sourceInfoStats).reduce((a, b) => a + b, 0);
  const meilleurCanal = Object.entries(sourceInfoStats).reduce((a, b) => b[1] > a[1] ? b : a, ['', 0]);

  // Calculer le taux de conversion simulé (basé sur le nombre total de visiteurs estimé)
  const totalVisitesEstime = 15420; // Ce pourrait venir d'Google Analytics ou autre
  const tauxConversion = ((statsReelles.totalEquipes / totalVisitesEstime) * 100).toFixed(2);

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] to-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#24366E]/10 to-[#FFC107]/10 backdrop-blur-sm border-b border-[#FFC107]/20">
          <div className="container py-6">
            <div className="flex items-center justify-between">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 
                  className="font-display text-3xl font-bold text-[#212529]"
                  style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800 }}
                >
                  Statistiques Globales
                </h1>
                <p 
                  className="text-[#6C757D] mt-2"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  Vue d'ensemble des performances du Hackathon ISOC-ESMT 2026
                </p>
              </motion.div>
              
              <div className="flex items-center gap-2">
                <BarChart3 className="text-[#FFC107]" size={24} />
                <span className="text-sm text-[#6C757D]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                  {new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="container py-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Total Inscriptions */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="relative overflow-hidden rounded-2xl border border-[#FFC107] bg-white p-6 hover:border-[#24366E]/50 hover:shadow-xl hover:shadow-[#24366E]/10 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#24366E]/5 opacity-0"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#24366E]/10 to-[#24366E]/10 flex items-center justify-center">
                        <Users className="text-[#24366E]" size={24} />
                      </div>
                      <div className="flex items-center gap-1">
                        <ArrowUp className="text-[#FFC107]" size={16} />
                        <span className="text-xs text-[#FFC107] font-medium">+12%</span>
                      </div>
                    </div>
                  </div>
                  <p 
                    className="text-2xl font-bold text-[#212529]"
                    style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700 }}
                  >
                    {statsReelles.totalEquipes}
                  </p>
                  <p 
                    className="text-xs text-[#6C757D] mt-1"
                    style={{ fontFamily: 'DM Sans, sans-serif' }}
                  >
                    Inscriptions totales
                  </p>
                </div>
              </motion.div>

              {/* Total Participants */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative overflow-hidden rounded-2xl border border-[#FFC107] bg-white p-6 hover:border-[#40B2A4]/50 hover:shadow-xl hover:shadow-[#40B2A4]/10 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#40B2A4]/5 opacity-0"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#40B2A4]/10 to-[#40B2A4]/10 flex items-center justify-center">
                        <Users className="text-[#40B2A4]" size={24} />
                      </div>
                      <div className="flex items-center gap-1">
                        <ArrowUp className="text-[#FFC107]" size={16} />
                        <span className="text-xs text-[#FFC107] font-medium">+8%</span>
                      </div>
                    </div>
                  </div>
                  <p 
                    className="text-2xl font-bold text-[#212529]"
                    style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700 }}
                  >
                    {statsReelles.totalMembres}
                  </p>
                  <p 
                    className="text-xs text-[#6C757D] mt-1"
                    style={{ fontFamily: 'DM Sans, sans-serif' }}
                  >
                    Participants totaux
                  </p>
                </div>
              </motion.div>

              {/* Taux de Conversion */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="relative overflow-hidden rounded-2xl border border-[#FFC107] bg-white p-6 hover:border-[#40B2A4]/50 hover:shadow-xl hover:shadow-[#40B2A4]/10 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#40B2A4]/5 opacity-0"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#40B2A4]/10 to-[#40B2A4]/10 flex items-center justify-center">
                        <Target className="text-[#40B2A4]" size={24} />
                      </div>
                      <div className="flex items-center gap-1">
                        <ArrowUp className="text-[#FFC107]" size={16} />
                        <span className="text-xs text-[#FFC107] font-medium">+2%</span>
                      </div>
                    </div>
                  </div>
                  <p 
                    className="text-2xl font-bold text-[#212529]"
                    style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700 }}
                  >
                    {tauxConversion}%
                  </p>
                  <p 
                    className="text-xs text-[#6C757D] mt-1"
                    style={{ fontFamily: 'DM Sans, sans-serif' }}
                  >
                    Taux de conversion
                  </p>
                </div>
              </motion.div>

              {/* Projets avec idée */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="relative overflow-hidden rounded-2xl border border-[#FFC107] bg-white p-6 hover:border-[#6C757D]/50 hover:shadow-xl hover:shadow-[#6C757D]/10 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#6C757D]/5 opacity-0"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#6C757D]/10 to-[#6C757D]/10 flex items-center justify-center">
                        <Award className="text-[#6C757D]" size={24} />
                      </div>
                      <div className="flex items-center gap-1">
                        <ArrowUp className="text-[#FFC107]" size={16} />
                        <span className="text-xs text-[#FFC107] font-medium">+5%</span>
                      </div>
                    </div>
                  </div>
                  <p 
                    className="text-2xl font-bold text-[#212529]"
                    style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700 }}
                  >
                    {statsReelles.projetsAvecProjet}
                  </p>
                  <p 
                    className="text-xs text-[#6C757D] mt-1"
                    style={{ fontFamily: 'DM Sans, sans-serif' }}
                  >
                    Projets avec idée
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Sources d'Information et Projets */}
        <div className="container pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Sources d'Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="rounded-2xl border border-[#FFC107] bg-white p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#24366E]/10 to-[#24366E]/10 flex items-center justify-center">
                  <Share2 className="text-[#24366E]" size={20} />
                </div>
                <h2 
                  className="font-display text-xl font-bold text-[#212529]"
                  style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700 }}
                >
                  Sources d'Information
                </h2>
              </div>
              
              <div className="space-y-4">
                {Object.entries(sourceInfoStats).map(([source, nombre], index) => {
                  const pourcentage = totalCanaux > 0 ? (nombre / totalCanaux * 100).toFixed(1) : '0';
                  const isMeilleur = source === meilleurCanal[0];
                  const couleurs = {
                    'Réseaux sociaux': 'bg-gradient-to-r from-[#FFC107] to-[#FFC107]',
                    'Bouche à oreille': 'bg-gradient-to-r from-[#FFC107] to-[#24366E]',
                    'Affiche ESMT': 'bg-gradient-to-r from-[#24366E] to-[#24366E]',
                    'Passage en salle': 'bg-gradient-to-r from-[#7E245C] to-[#7E245C]',
                    'Autre': 'bg-gradient-to-r from-[#64748B] to-[#40B2A4]',
                    'Non spécifié': 'bg-gradient-to-r from-[#6C757D] to-[#9CA3AF]'
                  };
                  
                  return (
                    <motion.div
                      key={source}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-center gap-4"
                    >
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-[#212529]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                            {source === 'Réseaux sociaux' ? '📱 Réseaux sociaux' : 
                             source === 'Bouche à oreille' ? '🗣️ Bouche-à-oreille' : 
                             source === 'Affiche ESMT' ? '📋 Affiche ESMT' : 
                             source === 'Passage en salle' ? '🏫 Passage en salle' : 
                             source === 'Autre' ? '🔄 Autre' :
                             '❓ Non spécifié'}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-[#212529]" style={{ fontFamily: 'Sora, sans-serif' }}>
                              {nombre}
                            </span>
                            {isMeilleur && (
                              <div className="px-2 py-1 rounded-full bg-[#FFC107]/20 text-[#FFC107] text-xs font-bold">
                                🏆 Top
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="w-full bg-[#F8F9FA] rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${couleurs[source as keyof typeof couleurs] || 'bg-[#6C757D]'}`}
                            style={{ width: `${pourcentage}%` }}
                          />
                        </div>
                        <span className="text-xs text-[#6C757D]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                          {pourcentage}% des inscriptions
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Répartition des Types de Projets */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="rounded-2xl border border-[#FFC107] bg-white p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#40B2A4]/10 to-[#40B2A4]/10 flex items-center justify-center">
                  <PieChart className="text-[#40B2A4]" size={20} />
                </div>
                <h2 
                  className="font-display text-xl font-bold text-[#212529]"
                  style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700 }}
                >
                  Répartition des Projets
                </h2>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-xl bg-[#24366E]/5 border border-[#24366E]/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#24366E]/10 to-[#24366E]/10 flex items-center justify-center">
                      <Users className="text-[#24366E]" size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-[#212529]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                        Projets Équipe
                      </p>
                      <p className="text-xs text-[#6C757D]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                        4 personnes par équipe
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-[#24366E]" style={{ fontFamily: 'Sora, sans-serif' }}>
                      {statsReelles.projetsEquipe}
                    </p>
                    <p className="text-xs text-[#6C757D]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                      {Math.round(statsReelles.projetsEquipe / statsReelles.totalEquipes * 100)}%
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-[#40B2A4]/5 border border-[#40B2A4]/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#40B2A4]/10 to-[#40B2A4]/10 flex items-center justify-center">
                      <Award className="text-[#40B2A4]" size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-[#212529]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                        Projets Individuels
                      </p>
                      <p className="text-xs text-[#6C757D]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                        1 personne par projet
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-[#40B2A4]" style={{ fontFamily: 'Sora, sans-serif' }}>
                      {statsReelles.projetsIndividuels}
                    </p>
                    <p className="text-xs text-[#6C757D]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                      {Math.round(statsReelles.projetsIndividuels / statsReelles.totalEquipes * 100)}%
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-[#40B2A4]/5 border border-[#40B2A4]/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#40B2A4]/10 to-[#40B2A4]/10 flex items-center justify-center">
                      <Target className="text-[#40B2A4]" size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-[#212529]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                        Avec projet défini
                      </p>
                      <p className="text-xs text-[#6C757D]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                        Idée déjà préparée
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-[#40B2A4]" style={{ fontFamily: 'Sora, sans-serif' }}>
                      {statsReelles.projetsAvecProjet}
                    </p>
                    <p className="text-xs text-[#6C757D]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                      {Math.round(statsReelles.projetsAvecProjet / statsReelles.totalEquipes * 100)}%
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Démographie et Compétences */}
        <div className="container pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Répartition par Genre */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="rounded-2xl border border-[#FFC107] bg-white p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#40B2A4]/10 to-[#40B2A4]/10 flex items-center justify-center">
                  <Users className="text-[#40B2A4]" size={20} />
                </div>
                <h2 
                  className="font-display text-xl font-bold text-[#212529]"
                  style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700 }}
                >
                  Répartition par Genre
                </h2>
              </div>
              
              <div className="space-y-3">
                {Object.entries(genreStats).map(([genre, nombre], index) => {
                  const totalGenre = Object.values(genreStats).reduce((a, b) => a + b, 0);
                  const pourcentage = totalGenre > 0 ? (nombre / totalGenre * 100).toFixed(1) : '0';
                  
                  return (
                    <motion.div
                      key={genre}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 rounded-xl bg-[#F8F9FA] hover:bg-[#F8F9FA]/80 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#40B2A4]/10 to-[#40B2A4]/10 flex items-center justify-center text-sm font-bold text-[#40B2A4]">
                          {genre === 'homme' ? '👨' : genre === 'femme' ? '👩' : '👤'}
                        </div>
                        <div>
                          <p className="font-medium text-[#212529]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                            {genre === 'homme' ? 'Hommes' : genre === 'femme' ? 'Femmes' : 'Non précisé'}
                          </p>
                          <p className="text-xs text-[#6C757D]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                            {nombre} participants
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-[#40B2A4]" style={{ fontFamily: 'Sora, sans-serif' }}>
                          {pourcentage}%
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Niveaux d'Études */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="rounded-2xl border border-[#FFC107] bg-white p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#6C757D]/10 to-[#6C757D]/10 flex items-center justify-center">
                  <Activity className="text-[#6C757D]" size={20} />
                </div>
                <h2 
                  className="font-display text-xl font-bold text-[#212529]"
                  style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700 }}
                >
                  Niveaux d'Études
                </h2>
              </div>
              
              <div className="space-y-3">
                {Object.entries(niveauEtudesStats).map(([niveau, nombre], index) => {
                  const totalNiveaux = Object.values(niveauEtudesStats).reduce((a, b) => a + b, 0);
                  const pourcentage = totalNiveaux > 0 ? (nombre / totalNiveaux * 100).toFixed(1) : '0';
                  
                  return (
                    <motion.div
                      key={niveau}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 rounded-xl bg-[#F8F9FA] hover:bg-[#F8F9FA]/80 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#6C757D]/10 to-[#6C757D]/10 flex items-center justify-center text-sm font-bold text-[#6C757D]">
                          {niveau.replace('L', '').replace('M', 'M')}
                        </div>
                        <div>
                          <p className="font-medium text-[#212529]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                            {niveau === 'L1' ? 'Licence 1' : 
                             niveau === 'L2' ? 'Licence 2' : 
                             niveau === 'L3' ? 'Licence 3' : 
                             niveau === 'M1' ? 'Master 1' : 
                             niveau === 'M2' ? 'Master 2' : niveau}
                          </p>
                          <p className="text-xs text-[#6C757D]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                            {nombre} participants
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-[#6C757D]" style={{ fontFamily: 'Sora, sans-serif' }}>
                          {pourcentage}%
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Badges et Certificats */}
        <div className="container pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Distribution des Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.1 }}
              className="rounded-2xl border border-[#FFC107] bg-white p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#40B2A4]/10 to-[#40B2A4]/10 flex items-center justify-center">
                  <Award className="text-[#40B2A4]" size={20} />
                </div>
                <h2 
                  className="font-display text-xl font-bold text-[#212529]"
                  style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700 }}
                >
                  Distribution des Badges
                </h2>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-xl bg-[#40B2A4]/5 border border-[#40B2A4]/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#40B2A4]/10 to-[#40B2A4]/10 flex items-center justify-center">
                      <Award className="text-[#40B2A4]" size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-[#212529]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                        Badges Envoyés
                      </p>
                      <p className="text-xs text-[#6C757D]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                        Participants ayant reçu leur badge
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-[#40B2A4]" style={{ fontFamily: 'Sora, sans-serif' }}>
                      {statsReelles.badgesEnvoyes}
                    </p>
                    <p className="text-xs text-[#6C757D]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                      {statsReelles.badgesTotal > 0 ? Math.round(statsReelles.badgesEnvoyes / statsReelles.badgesTotal * 100) : 0}%
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#F8F9FA] border border-[#FFC107]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[#6C757D]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                      Total Badges à Distribuer
                    </span>
                    <span className="text-2xl font-bold text-[#212529]" style={{ fontFamily: 'Sora, sans-serif' }}>
                      {statsReelles.badgesTotal}
                    </span>
                  </div>
                  <div className="text-xs text-[#6C757D]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                    Reste à envoyer : {statsReelles.badgesTotal - statsReelles.badgesEnvoyes} badges
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Certificats de Réussite */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="rounded-2xl border border-[#FFC107] bg-white p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#40B2A4]/10 to-[#40B2A4]/10 flex items-center justify-center">
                  <Target className="text-[#40B2A4]" size={20} />
                </div>
                <h2 
                  className="font-display text-xl font-bold text-[#212529]"
                  style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700 }}
                >
                  Certificats de Réussite
                </h2>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-xl bg-[#40B2A4]/5 border border-[#40B2A4]/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#40B2A4]/10 to-[#40B2A4]/10 flex items-center justify-center">
                      <Target className="text-[#40B2A4]" size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-[#212529]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                        Certificats de Participation
                      </p>
                      <p className="text-xs text-[#6C757D]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                        Tous les participants
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-[#40B2A4]" style={{ fontFamily: 'Sora, sans-serif' }}>
                      {statsReelles.certificatsParticipation}
                    </p>
                    <p className="text-xs text-[#6C757D]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                      {statsReelles.totalMembres > 0 ? Math.round(statsReelles.certificatsParticipation / statsReelles.totalMembres * 100) : 0}%
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-[#40B2A4]/5 border border-[#40B2A4]/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#40B2A4]/10 to-[#40B2A4]/10 flex items-center justify-center">
                      <Trophy className="text-[#40B2A4]" size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-[#212529]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                        Certificats de Lauréats
                      </p>
                      <p className="text-xs text-[#6C757D]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                        Équipes gagnantes
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-[#40B2A4]" style={{ fontFamily: 'Sora, sans-serif' }}>
                      {statsReelles.certificatsLaureats}
                    </p>
                    <p className="text-xs text-[#6C757D]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                      {statsReelles.totalMembres > 0 ? Math.round(statsReelles.certificatsLaureats / statsReelles.totalMembres * 100) : 0}%
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Établissements et Disponibilité */}
        <div className="container pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Établissements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.3 }}
              className="rounded-2xl border border-[#FFC107] bg-white p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#24366E]/10 to-[#24366E]/10 flex items-center justify-center">
                  <Globe className="text-[#24366E]" size={20} />
                </div>
                <h2 
                  className="font-display text-xl font-bold text-[#212529]"
                  style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700 }}
                >
                  Établissements Représentés
                </h2>
              </div>
              
              <div className="space-y-3">
                {Object.entries(etablissementStats).map(([etablissement, nombre], index) => {
                  const totalEtablissements = Object.values(etablissementStats).reduce((a, b) => a + b, 0);
                  const pourcentage = totalEtablissements > 0 ? (nombre / totalEtablissements * 100).toFixed(1) : '0';
                  
                  return (
                    <motion.div
                      key={etablissement}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 rounded-xl bg-[#F8F9FA] hover:bg-[#F8F9FA]/80 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#24366E]/10 to-[#24366E]/10 flex items-center justify-center text-sm font-bold text-[#24366E]">
                          🏫
                        </div>
                        <div>
                          <p className="font-medium text-[#212529]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                            {etablissement}
                          </p>
                          <p className="text-xs text-[#6C757D]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                            {nombre} participants
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-[#24366E]" style={{ fontFamily: 'Sora, sans-serif' }}>
                          {pourcentage}%
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Disponibilité des Participants */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4 }}
              className="rounded-2xl border border-[#FFC107] bg-white p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#6C757D]/10 to-[#6C757D]/10 flex items-center justify-center">
                  <Calendar className="text-[#6C757D]" size={20} />
                </div>
                <h2 
                  className="font-display text-xl font-bold text-[#212529]"
                  style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700 }}
                >
                  Disponibilité des Participants
                </h2>
              </div>
              
              <div className="space-y-3">
                {Object.entries(disponibiliteStats).map(([dispo, nombre], index) => {
                  const totalDispo = Object.values(disponibiliteStats).reduce((a, b) => a + b, 0);
                  const pourcentage = totalDispo > 0 ? (nombre / totalDispo * 100).toFixed(1) : '0';
                  const isDisponible = dispo === 'Disponible';
                  
                  return (
                    <motion.div
                      key={dispo}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 rounded-xl bg-[#F8F9FA] hover:bg-[#F8F9FA]/80 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          isDisponible 
                            ? 'bg-gradient-to-r from-[#40B2A4]/10 to-[#40B2A4]/10 text-[#40B2A4]' 
                            : 'bg-gradient-to-r from-[#D25238]/10 to-[#D25238]/10 text-[#D25238]'
                        }`}>
                          {isDisponible ? '✓' : '✗'}
                        </div>
                        <div>
                          <p className="font-medium text-[#212529]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                            {dispo}
                          </p>
                          <p className="text-xs text-[#6C757D]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                            {nombre} participants
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`text-sm font-bold ${isDisponible ? 'text-[#40B2A4]' : 'text-[#D25238]'}`} style={{ fontFamily: 'Sora, sans-serif' }}>
                          {pourcentage}%
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Statistiques;
