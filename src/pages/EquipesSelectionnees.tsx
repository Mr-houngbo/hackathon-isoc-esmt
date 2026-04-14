import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import { 
  Users, 
  User, 
  BookOpen, 
  Trophy, 
  Star, 
  Award, 
  Target, 
  Crown, 
  Sparkles,
  Clock,
  CheckCircle2,
  TrendingUp,
  MapPin,
  GraduationCap,
  Lightbulb,
  Code2,
  Palette,
  Database,
  Globe2,
  Smartphone,
  Cpu,
  Layers,
  Rocket
} from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useState, useEffect } from "react";

// Types
interface Membre {
  id: string;
  nom_prenom: string;
  filiere: string;
  niveau_etudes: string;
  etablissement?: string;
  est_chef?: boolean;
  role_equipe?: string;
}

interface Equipe {
  id: string;
  nom_equipe?: string;
  type_candidature: 'equipe' | 'individuel';
  statut: 'selectionne' | 'en_attente' | 'non_selectionne';
  publiee: boolean;
  nom_projet?: string;
  domaine_projet?: string;
  problematique?: string;
  position?: number;
  score_moyen?: number;
  membres?: Membre[];
  competences_equipe?: string[];
}


const EquipesSelectionnees = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'equipes' | 'individuels' | 'attente'>('all');

  const { data: equipes, isLoading, error } = useQuery({
    queryKey: ["equipes-selectionnees"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("equipes")
        .select("*, membres(*)")
        .in("statut", ["selectionne", "en_attente"])
        .eq("publiee", true)
        .order("score_moyen", { ascending: false });
      
      if (error) throw error;
      return (data || []) as Equipe[];
    },
  });

  // Stats avec fallback pour éviter les erreurs si equipes est undefined
  const stats = {
    total: equipes?.length || 0,
    selectionnes: equipes?.filter(e => e.statut === 'selectionne').length || 0,
    attente: equipes?.filter(e => e.statut === 'en_attente').length || 0,
    equipes: equipes?.filter(e => e.type_candidature === 'equipe' && e.statut === 'selectionne').length || 0,
    individuels: equipes?.filter(e => e.type_candidature === 'individuel' && e.statut === 'selectionne').length || 0,
    totalParticipants: equipes?.reduce((acc, e) => {
      if (e.statut !== 'selectionne') return acc;
      return acc + (e.type_candidature === 'equipe' ? 4 : 1);
    }, 0) || 0
  };

  // Filtrage selon l'onglet actif
  const filteredEquipes = (equipes || []).filter(e => {
    if (activeTab === 'all') return e.statut === 'selectionne';
    if (activeTab === 'equipes') return e.type_candidature === 'equipe' && e.statut === 'selectionne';
    if (activeTab === 'individuels') return e.type_candidature === 'individuel' && e.statut === 'selectionne';
    if (activeTab === 'attente') return e.statut === 'en_attente';
    return true;
  });

  // Animations variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  const getMedalConfig = (position?: number) => {
    switch(position) {
      case 1: return { color: 'from-yellow-400 via-yellow-500 to-yellow-600', icon: Crown, label: '🥇 Champion', shadow: 'shadow-yellow-500/50' };
      case 2: return { color: 'from-gray-300 via-gray-400 to-gray-500', icon: Trophy, label: '🥈 Vice-champion', shadow: 'shadow-gray-400/50' };
      case 3: return { color: 'from-orange-400 via-orange-500 to-orange-600', icon: Award, label: '🥉 3ème Place', shadow: 'shadow-orange-500/50' };
      default: return { color: 'from-[#40B2A4] via-[#3AA99F] to-[#2E968C]', icon: Star, label: 'Sélectionné', shadow: 'shadow-[#40B2A4]/30' };
    }
  };

  const getDomainIcon = (domain?: string) => {
    const domainIcons: Record<string, any> = {
      'Développement Durable': Globe2,
      'Santé Digitale': Smartphone,
      'EdTech': BookOpen,
      'Agriculture & Data': Database,
      'Cybersécurité': Code2,
      'HealthTech': Smartphone,
      'Fintech': TrendingUp,
      'NLP & Langues': Layers,
      'Environnement': Globe2,
      'Réalité Virtuelle': Cpu,
    };
    return domainIcons[domain || ''] || Lightbulb;
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-[#40B2A4]/5">
        {/* Hero Section Ultra Premium */}
        <div className="relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-[#40B2A4]/10 via-[#24366E]/5 to-transparent"></div>
            <div className="absolute top-0 left-0 w-96 h-96 bg-[#40B2A4]/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#24366E]/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
          </div>
          
          <div className="container relative z-10 py-20">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              {/* Badge Edition */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#40B2A4]/20 to-[#24366E]/20 border border-[#40B2A4]/30 mb-8"
              >
                <Sparkles className="w-4 h-4 text-[#40B2A4]" />
                <span className="text-sm font-semibold text-[#24366E]">Édition 2026</span>
              </motion.div>

              <motion.div 
                className="flex items-center justify-center gap-6 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#40B2A4] to-[#24366E] flex items-center justify-center shadow-2xl shadow-[#40B2A4]/30">
                  <Trophy size={40} className="text-white" />
                </div>
                <div className="text-left">
                  <h1 
                    className="font-display text-5xl sm:text-6xl font-bold bg-gradient-to-r from-[#24366E] to-[#40B2A4] bg-clip-text text-transparent"
                    style={{ fontFamily: 'Sora, sans-serif' }}
                  >
                    Les Sélectionnés
                  </h1>
                  <p className="text-xl text-[#6C757D] mt-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                    Hackathon ISOC-ESMT 2026
                  </p>
                </div>
              </motion.div>

              <motion.p 
                className="text-lg text-[#6C757D] max-w-2xl mx-auto mb-10"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                Découvrez les équipes et talents individuels qui participeront à cette édition exceptionnelle du hackathon
              </motion.p>

              {/* Stats Bar */}
              <motion.div 
                className="flex flex-wrap justify-center gap-4 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <div className="flex items-center gap-3 px-6 py-3 rounded-xl bg-white/80 backdrop-blur-sm border border-[#40B2A4]/20 shadow-lg">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#40B2A4] to-[#24366E] flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-2xl font-bold text-[#24366E]">{stats.totalParticipants}</p>
                    <p className="text-xs text-[#6C757D]">Participants</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-6 py-3 rounded-xl bg-white/80 backdrop-blur-sm border border-[#40B2A4]/20 shadow-lg">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-2xl font-bold text-green-600">{stats.selectionnes}</p>
                    <p className="text-xs text-[#6C757D]">Sélectionnés</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-6 py-3 rounded-xl bg-white/80 backdrop-blur-sm border border-yellow-500/30 shadow-lg">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-2xl font-bold text-yellow-600">{stats.attente}</p>
                    <p className="text-xs text-[#6C757D]">En attente</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Content Section */}
        <div className="container pb-20">
          {/* Navigation Tabs */}
          <motion.div 
            className="flex flex-wrap justify-center gap-3 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            {[
              { id: 'all', label: 'Tous les sélectionnés', icon: Star, count: stats.selectionnes },
              { id: 'equipes', label: 'Équipes', icon: Users, count: stats.equipes },
              { id: 'individuels', label: 'Individuels', icon: User, count: stats.individuels },
              { id: 'attente', label: 'Liste d\'attente', icon: Clock, count: stats.attente },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-[#40B2A4] to-[#24366E] text-white shadow-lg shadow-[#40B2A4]/30 scale-105'
                    : 'bg-white text-[#6C757D] hover:bg-[#40B2A4]/10 border border-[#E9ECEF]'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.id ? 'bg-white/20' : 'bg-[#40B2A4]/10 text-[#40B2A4]'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </motion.div>

          {/* Section Title */}
          <motion.div 
            className="text-center mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-[#24366E] mb-2" style={{ fontFamily: 'Sora, sans-serif' }}>
              {activeTab === 'all' && 'Tous les participants sélectionnés'}
              {activeTab === 'equipes' && 'Équipes sélectionnées'}
              {activeTab === 'individuels' && 'Talents individuels'}
              {activeTab === 'attente' && 'Liste d\'attente'}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#40B2A4] to-[#24366E] mx-auto rounded-full"></div>
          </motion.div>

          {/* Loading State */}
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full border-4 border-[#40B2A4] border-t-transparent animate-spin"></div>
                <p className="text-[#6C757D]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                  Chargement des équipes...
                </p>
              </div>
            </div>
          ) : filteredEquipes.length === 0 ? (
            <motion.div 
              className="text-center py-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#40B2A4]/10 to-[#24366E]/10 border border-[#40B2A4]/20 flex items-center justify-center mx-auto mb-6">
                <Trophy size={40} className="text-[#40B2A4]" />
              </div>
              <p className="text-[#6C757D] max-w-md mx-auto">
                Aucune équipe trouvée dans cette catégorie.
              </p>
            </motion.div>
          ) : (
            <motion.div 
              className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <AnimatePresence>
                {filteredEquipes.map((eq, index) => {
                  const medalConfig = getMedalConfig(eq.position);
                  const DomainIcon = getDomainIcon(eq.domaine_projet);
                  const isWaiting = eq.statut === 'en_attente';
                  
                  return (
                    <motion.div
                      key={eq.id}
                      variants={cardVariants}
                      layout
                      className="group"
                    >
                      <div className={`relative overflow-hidden rounded-2xl border-2 transition-all duration-500 hover:scale-[1.02] ${
                        isWaiting 
                          ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300 hover:border-yellow-400 hover:shadow-xl hover:shadow-yellow-500/20' 
                          : 'bg-white border-[#E9ECEF] hover:border-[#40B2A4]/50 hover:shadow-2xl hover:shadow-[#40B2A4]/15'
                      }`}>
                        
                        {/* Top Badge */}
                        {eq.position && !isWaiting && (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
                            className={`absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br ${medalConfig.color} rounded-full flex items-center justify-center shadow-lg ${medalConfig.shadow} z-20`}
                          >
                            <medalConfig.icon size={28} className="text-white" />
                          </motion.div>
                        )}

                        {/* Waiting Badge */}
                        {isWaiting && (
                          <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-yellow-500 text-white text-xs font-bold shadow-lg z-20 flex items-center gap-1">
                            <Clock size={12} />
                            En attente
                          </div>
                        )}

                        {/* Header */}
                        <div className="p-6 pt-12">
                          <div className="flex items-start gap-4 mb-4">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${
                              eq.type_candidature === 'equipe' 
                                ? 'bg-gradient-to-br from-[#40B2A4] to-[#24366E]' 
                                : 'bg-gradient-to-br from-purple-500 to-purple-600'
                            }`}>
                              {eq.type_candidature === 'equipe' ? (
                                <Users size={24} className="text-white" />
                              ) : (
                                <User size={24} className="text-white" />
                              )}
                            </div>
                            <div className="flex-1">
                              <h3 
                                className="font-display text-xl font-bold text-[#212529] group-hover:text-[#40B2A4] transition-colors leading-tight"
                                style={{ fontFamily: 'Sora, sans-serif' }}
                              >
                                {eq.nom_equipe || eq.membres?.[0]?.nom_prenom || "Participant"}
                              </h3>
                              {eq.position && !isWaiting && (
                                <span className="text-sm text-[#40B2A4] font-semibold">
                                  {medalConfig.label}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {/* Project */}
                          {eq.nom_projet && (
                            <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-[#40B2A4]/5 to-[#24366E]/5 border border-[#40B2A4]/10">
                              <p className="text-sm font-semibold text-[#24366E]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                                {eq.nom_projet}
                              </p>
                            </div>
                          )}
                          
                          {/* Domain & Stats */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {eq.domaine_projet && (
                              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#40B2A4]/10 text-[#40B2A4] text-xs font-medium">
                                <DomainIcon size={14} />
                                <span>{eq.domaine_projet}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
                              <Users size={14} />
                              <span>{eq.membres?.length || 1} membre{eq.membres && eq.membres.length > 1 ? 's' : ''}</span>
                            </div>
                          </div>

                          {/* Skills */}
                          {eq.competences_equipe && eq.competences_equipe.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-4">
                              {eq.competences_equipe.slice(0, 3).map((skill, i) => (
                                <span key={i} className="px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">
                                  {skill}
                                </span>
                              ))}
                              {eq.competences_equipe.length > 3 && (
                                <span className="px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">
                                  +{eq.competences_equipe.length - 3}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        
                        {/* Members Section */}
                        <div className="px-6 pb-6">
                          <div className={`rounded-xl p-4 ${
                            isWaiting 
                              ? 'bg-yellow-100/50' 
                              : 'bg-gradient-to-br from-slate-50 to-white border border-slate-100'
                          }`}>
                            <p className="text-xs font-semibold text-[#6C757D] uppercase tracking-wider mb-3">
                              {eq.type_candidature === 'equipe' ? 'Membres de l\'équipe' : 'Profil'}
                            </p>
                            <div className="space-y-3">
                              {(eq.membres || [])?.map((m: any) => (
                                <div key={m.id} className="flex items-center gap-3">
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                    m.est_chef 
                                      ? 'bg-gradient-to-br from-[#40B2A4] to-[#24366E] text-white' 
                                      : 'bg-white border-2 border-slate-200 text-slate-500'
                                  }`}>
                                    <User size={16} />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm font-semibold text-[#212529]">
                                        {m.nom_prenom}
                                      </span>
                                      {m.est_chef && (
                                        <span className="px-2 py-0.5 rounded-full bg-[#40B2A4]/20 text-[#40B2A4] text-xs font-bold">
                                          Chef
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-[#6C757D]">
                                      <GraduationCap size={12} />
                                      <span>{m.filiere}</span>
                                      <span>•</span>
                                      <span>{m.etablissement}</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}

        </div>
      </div>
    </Layout>
  );
};

export default EquipesSelectionnees;
