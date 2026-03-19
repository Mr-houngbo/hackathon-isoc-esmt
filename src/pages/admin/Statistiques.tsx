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
  Minus
} from "lucide-react";
import { motion } from "framer-motion";

const Statistiques = () => {
  // Récupérer les équipes avec leurs membres
  const { data: equipes, isLoading: loadingEquipes } = useQuery({
    queryKey: ["admin-stats-equipes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("equipes")
        .select("*, membres(*)")
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Récupérer les membres pour analyser les données démographiques
  const { data: membres, isLoading: loadingMembres } = useQuery({
    queryKey: ["admin-stats-membres"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("membres")
        .select("*");
      if (error) throw error;
      return data;
    },
  });

  if (loadingEquipes || loadingMembres) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full border-4 border-[#1E3A5F] border-t-transparent animate-spin"></div>
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
    totalMembres: equipes?.reduce((acc, eq) => acc + ((eq.membres as any[])?.length || 0), 0) || 0,
    projetsIndividuels: equipes?.filter(e => e.type_candidature === 'individuel').length || 0,
    projetsEquipe: equipes?.filter(e => e.type_candidature === 'equipe').length || 0,
    projetsAvecProjet: equipes?.filter(e => e.a_projet === 'oui').length || 0,
    projetsSansProjet: equipes?.filter(e => e.a_projet === 'non').length || 0,
  };

  // Analyser les sources d'information depuis les données réelles
  const sourceInfoStats = membres?.reduce((acc, membre) => {
    const source = membre.source_info || 'Non spécifié';
    acc[source] = (acc[source] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Analyser les domaines de projets
  const domaineProjetStats = equipes?.reduce((acc, equipe) => {
    const domaine = equipe.domaine_projet || 'Non spécifié';
    acc[domaine] = (acc[domaine] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Analyser les niveaux techniques
  const niveauTechniqueStats = equipes?.reduce((acc, equipe) => {
    const niveau = equipe.niveau_technique || 'Non spécifié';
    acc[niveau] = (acc[niveau] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Analyser les niveaux d'études
  const niveauEtudesStats = membres?.reduce((acc, membre) => {
    const niveau = membre.niveau_etudes || 'Non spécifié';
    acc[niveau] = (acc[niveau] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Analyser les filières
  const filiereStats = membres?.reduce((acc, membre) => {
    const filiere = membre.filiere || 'Non spécifié';
    acc[filiere] = (acc[filiere] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Analyser les genres
  const genreStats = membres?.reduce((acc, membre) => {
    const genre = membre.genre || 'Non précisé';
    acc[genre] = (acc[genre] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Analyser les rôles dans les équipes
  const roleStats = membres?.reduce((acc, membre) => {
    if (membre.role_equipe) {
      acc[membre.role_equipe] = (acc[membre.role_equipe] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  // Analyser les compétences
  const competencesStats = membres?.reduce((acc, membre) => {
    if (membre.competences && Array.isArray(membre.competences)) {
      (membre.competences as string[]).forEach(comp => {
        acc[comp] = (acc[comp] || 0) + 1;
      });
    }
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
        <div className="bg-gradient-to-r from-[#1E3A5F]/10 to-[#FF6B35]/10 backdrop-blur-sm border-b border-[#E9ECEF]/20">
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
                <BarChart3 className="text-[#FF6B35]" size={24} />
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
                className="relative overflow-hidden rounded-2xl border border-[#E9ECEF] bg-white p-6 hover:border-[#1E3A5F]/50 hover:shadow-xl hover:shadow-[#1E3A5F]/10 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#1E3A5F]/5 opacity-0"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#1E3A5F]/10 to-[#1E3A5F]/10 flex items-center justify-center">
                        <Users className="text-[#1E3A5F]" size={24} />
                      </div>
                      <div className="flex items-center gap-1">
                        <ArrowUp className="text-[#00873E]" size={16} />
                        <span className="text-xs text-[#00873E] font-medium">+12%</span>
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
                className="relative overflow-hidden rounded-2xl border border-[#E9ECEF] bg-white p-6 hover:border-[#FF6B35]/50 hover:shadow-xl hover:shadow-[#FF6B35]/10 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#FF6B35]/5 opacity-0"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#FF6B35]/10 to-[#FF6B35]/10 flex items-center justify-center">
                        <Users className="text-[#FF6B35]" size={24} />
                      </div>
                      <div className="flex items-center gap-1">
                        <ArrowUp className="text-[#00873E]" size={16} />
                        <span className="text-xs text-[#00873E] font-medium">+8%</span>
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
                className="relative overflow-hidden rounded-2xl border border-[#E9ECEF] bg-white p-6 hover:border-[#00873E]/50 hover:shadow-xl hover:shadow-[#00873E]/10 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#00873E]/5 opacity-0"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#00873E]/10 to-[#00873E]/10 flex items-center justify-center">
                        <Target className="text-[#00873E]" size={24} />
                      </div>
                      <div className="flex items-center gap-1">
                        <ArrowUp className="text-[#00873E]" size={16} />
                        <span className="text-xs text-[#00873E] font-medium">+2%</span>
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
                className="relative overflow-hidden rounded-2xl border border-[#E9ECEF] bg-white p-6 hover:border-[#6C757D]/50 hover:shadow-xl hover:shadow-[#6C757D]/10 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#6C757D]/5 opacity-0"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#6C757D]/10 to-[#6C757D]/10 flex items-center justify-center">
                        <Award className="text-[#6C757D]" size={24} />
                      </div>
                      <div className="flex items-center gap-1">
                        <ArrowUp className="text-[#00873E]" size={16} />
                        <span className="text-xs text-[#00873E] font-medium">+5%</span>
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
              className="rounded-2xl border border-[#E9ECEF] bg-white p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#1E3A5F]/10 to-[#1E3A5F]/10 flex items-center justify-center">
                  <Share2 className="text-[#1E3A5F]" size={20} />
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
                    'Réseaux sociaux': 'bg-gradient-to-r from-[#F97316] to-[#FB923C]',
                    'Bouche à oreille': 'bg-gradient-to-r from-[#25D366] to-[#128C7E]',
                    'Affiche ESMT': 'bg-gradient-to-r from-[#3B82F6] to-[#60A5FA]',
                    'Passage en salle': 'bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA]',
                    'Autre': 'bg-gradient-to-r from-[#64748B] to-[#94A3B8]',
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
                              <div className="px-2 py-1 rounded-full bg-[#FFD700]/20 text-[#FFD700] text-xs font-bold">
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
              className="rounded-2xl border border-[#E9ECEF] bg-white p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#FF6B35]/10 to-[#FF6B35]/10 flex items-center justify-center">
                  <PieChart className="text-[#FF6B35]" size={20} />
                </div>
                <h2 
                  className="font-display text-xl font-bold text-[#212529]"
                  style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700 }}
                >
                  Répartition des Projets
                </h2>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-xl bg-[#1E3A5F]/5 border border-[#1E3A5F]/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#1E3A5F]/10 to-[#1E3A5F]/10 flex items-center justify-center">
                      <Users className="text-[#1E3A5F]" size={20} />
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
                    <p className="text-2xl font-bold text-[#1E3A5F]" style={{ fontFamily: 'Sora, sans-serif' }}>
                      {statsReelles.projetsEquipe}
                    </p>
                    <p className="text-xs text-[#6C757D]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                      {Math.round(statsReelles.projetsEquipe / statsReelles.totalEquipes * 100)}%
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-[#FF6B35]/5 border border-[#FF6B35]/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#FF6B35]/10 to-[#FF6B35]/10 flex items-center justify-center">
                      <Award className="text-[#FF6B35]" size={20} />
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
                    <p className="text-2xl font-bold text-[#FF6B35]" style={{ fontFamily: 'Sora, sans-serif' }}>
                      {statsReelles.projetsIndividuels}
                    </p>
                    <p className="text-xs text-[#6C757D]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                      {Math.round(statsReelles.projetsIndividuels / statsReelles.totalEquipes * 100)}%
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-[#00873E]/5 border border-[#00873E]/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#00873E]/10 to-[#00873E]/10 flex items-center justify-center">
                      <Target className="text-[#00873E]" size={20} />
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
                    <p className="text-2xl font-bold text-[#00873E]" style={{ fontFamily: 'Sora, sans-serif' }}>
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
              className="rounded-2xl border border-[#E9ECEF] bg-white p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#00873E]/10 to-[#00873E]/10 flex items-center justify-center">
                  <Users className="text-[#00873E]" size={20} />
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
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#00873E]/10 to-[#00873E]/10 flex items-center justify-center text-sm font-bold text-[#00873E]">
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
                        <span className="text-sm font-bold text-[#00873E]" style={{ fontFamily: 'Sora, sans-serif' }}>
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
              className="rounded-2xl border border-[#E9ECEF] bg-white p-6"
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

        {/* Domaines de Projets et Compétences */}
        <div className="container pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Domaines de Projets */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="rounded-2xl border border-[#E9ECEF] bg-white p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#FF6B35]/10 to-[#FF6B35]/10 flex items-center justify-center">
                  <Target className="text-[#FF6B35]" size={20} />
                </div>
                <h2 
                  className="font-display text-xl font-bold text-[#212529]"
                  style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700 }}
                >
                  Domaines de Projets
                </h2>
              </div>
              
              <div className="space-y-3">
                {Object.entries(domaineProjetStats).map(([domaine, nombre], index) => {
                  const totalDomaines = Object.values(domaineProjetStats).reduce((a, b) => a + b, 0);
                  const pourcentage = totalDomaines > 0 ? (nombre / totalDomaines * 100).toFixed(1) : '0';
                  
                  return (
                    <motion.div
                      key={domaine}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 rounded-xl bg-[#F8F9FA] hover:bg-[#F8F9FA]/80 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#FF6B35]/10 to-[#FF6B35]/10 flex items-center justify-center text-sm font-bold text-[#FF6B35]">
                          🎯
                        </div>
                        <div>
                          <p className="font-medium text-[#212529]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                            {domaine === 'Vie étudiante' ? '🎓 Vie étudiante' : 
                             domaine === 'Administration' ? '🏢 Administration' : 
                             domaine === 'Pédagogie' ? '📚 Pédagogie' : 
                             domaine === 'Campus' ? '🏫 Campus' : domaine}
                          </p>
                          <p className="text-xs text-[#6C757D]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                            {nombre} projets
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-[#FF6B35]" style={{ fontFamily: 'Sora, sans-serif' }}>
                          {pourcentage}%
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Compétences Principales */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="rounded-2xl border border-[#E9ECEF] bg-white p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#1E3A5F]/10 to-[#1E3A5F]/10 flex items-center justify-center">
                  <Award className="text-[#1E3A5F]" size={20} />
                </div>
                <h2 
                  className="font-display text-xl font-bold text-[#212529]"
                  style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700 }}
                >
                  Compétences Principales
                </h2>
              </div>
              
              <div className="space-y-3">
                {Object.entries(competencesStats)
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 5)
                  .map(([competence, nombre], index) => {
                  const totalCompetences = Object.values(competencesStats).reduce((a, b) => a + b, 0);
                  const pourcentage = totalCompetences > 0 ? (nombre / totalCompetences * 100).toFixed(1) : '0';
                  
                  return (
                    <motion.div
                      key={competence}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 rounded-xl bg-[#F8F9FA] hover:bg-[#F8F9FA]/80 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#1E3A5F]/10 to-[#1E3A5F]/10 flex items-center justify-center text-sm font-bold text-[#1E3A5F]">
                          🛠️
                        </div>
                        <div>
                          <p className="font-medium text-[#212529]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                            {competence}
                          </p>
                          <p className="text-xs text-[#6C757D]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                            {nombre} mentions
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-[#1E3A5F]" style={{ fontFamily: 'Sora, sans-serif' }}>
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
