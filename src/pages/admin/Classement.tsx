import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/layout/AdminLayout";
import { Trophy, Users, Clock, Award, Medal, Star, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const Classement = () => {
  const { data: equipes, isLoading, error } = useQuery({
    queryKey: ["admin-classement"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("equipes")
        .select("*, membres(*)")
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Organiser les équipes par statut de sélection
  const organiseByStatus = (equipes: any[]) => {
    const selectionnees = equipes?.filter(eq => (eq as any).statut === 'selectionne') || [];
    const listeAttente = equipes?.filter(eq => (eq as any).statut === 'en_attente') || [];
    const nonSelectionnees = equipes?.filter(eq => (eq as any).statut === 'non_selectionne') || [];

    return {
      selectionnees,
      listeAttente,
      nonSelectionnees,
      total: equipes?.length || 0
    };
  };

  const stats = organiseByStatus(equipes || []);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full border-4 border-[#1E3A5F] border-t-transparent animate-spin"></div>
            <p className="text-[#6C757D]">Chargement du classement...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-[#DC2626] text-lg font-bold mb-4">Erreur de chargement</p>
            <p className="text-[#6C757D]">{error.message}</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

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
                  Classement Final
                </h1>
                <p 
                  className="text-[#6C757D] mt-2"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  Résultats de la sélection du Hackathon ISOC-ESMT 2026
                </p>
              </motion.div>
              
              <div className="flex items-center gap-2">
                <Trophy className="text-[#FF6B35]" size={24} />
                <span className="text-sm text-[#6C757D]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                  {stats.total} candidatures
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="container py-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                        <Trophy className="text-[#1E3A5F]" size={24} />
                      </div>
                      <div>
                        <p 
                          className="text-2xl font-bold text-[#212529]"
                          style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700 }}
                        >
                          {stats.selectionnees.length}
                        </p>
                        <p 
                          className="text-xs text-[#6C757D] mt-1"
                          style={{ fontFamily: 'DM Sans, sans-serif' }}
                        >
                          Sélectionnées
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

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
                        <Clock className="text-[#FF6B35]" size={24} />
                      </div>
                      <div>
                        <p 
                          className="text-2xl font-bold text-[#212529]"
                          style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700 }}
                        >
                          {stats.listeAttente.length}
                        </p>
                        <p 
                          className="text-xs text-[#6C757D] mt-1"
                          style={{ fontFamily: 'DM Sans, sans-serif' }}
                        >
                          Liste d'attente
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="relative overflow-hidden rounded-2xl border border-[#E9ECEF] bg-white p-6 hover:border-[#6C757D]/50 hover:shadow-xl hover:shadow-[#6C757D]/10 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#6C757D]/5 opacity-0"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#6C757D]/10 to-[#6C757D]/10 flex items-center justify-center">
                        <Users className="text-[#6C757D]" size={24} />
                      </div>
                      <div>
                        <p 
                          className="text-2xl font-bold text-[#212529]"
                          style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700 }}
                        >
                          {stats.nonSelectionnees.length}
                        </p>
                        <p 
                          className="text-xs text-[#6C757D] mt-1"
                          style={{ fontFamily: 'DM Sans, sans-serif' }}
                        >
                          Non sélectionnées
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Classement Details */}
        <div className="container pb-8">
          <div className="space-y-8">
            {/* Sélectionnées */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="rounded-2xl border border-[#E9ECEF] bg-white p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#1E3A5F]/10 to-[#1E3A5F]/10 flex items-center justify-center">
                  <Trophy className="text-[#1E3A5F]" size={20} />
                </div>
                <h2 
                  className="font-display text-xl font-bold text-[#212529]"
                  style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700 }}
                >
                  Équipes Sélectionnées
                </h2>
              </div>
              
              <div className="space-y-3">
                {stats.selectionnees.length === 0 ? (
                  <p className="text-[#6C757D] text-center py-8" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                    Aucune équipe sélectionnée pour le moment
                  </p>
                ) : (
                  stats.selectionnees.map((eq, index) => (
                    <motion.div
                      key={eq.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-center gap-4 p-3 rounded-xl bg-[#1E3A5F]/5 border border-[#1E3A5F]/10"
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1E3A5F] text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-[#212529]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                          {eq.nom_equipe || 'Individuel'}
                        </p>
                        <p className="text-xs text-[#6C757D]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                          {(eq.membres as any[])?.length || 0} membre{(eq.membres as any[])?.length > 1 ? 's' : ''}
                        </p>
                      </div>
                      <Medal className="text-[#FFD700]" size={20} />
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>

            {/* Liste d'attente */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="rounded-2xl border border-[#E9ECEF] bg-white p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#FF6B35]/10 to-[#FF6B35]/10 flex items-center justify-center">
                  <Clock className="text-[#FF6B35]" size={20} />
                </div>
                <h2 
                  className="font-display text-xl font-bold text-[#212529]"
                  style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700 }}
                >
                  Liste d'Attente
                </h2>
              </div>
              
              <div className="space-y-3">
                {stats.listeAttente.length === 0 ? (
                  <p className="text-[#6C757D] text-center py-8" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                    Aucune équipe en liste d'attente
                  </p>
                ) : (
                  stats.listeAttente.map((eq, index) => (
                    <motion.div
                      key={eq.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-center gap-4 p-3 rounded-xl bg-[#FF6B35]/5 border border-[#FF6B35]/10"
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#FF6B35] text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-[#212529]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                          {eq.nom_equipe || 'Individuel'}
                        </p>
                        <p className="text-xs text-[#6C757D]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                          {(eq.membres as any[])?.length || 0} membre{(eq.membres as any[])?.length > 1 ? 's' : ''}
                        </p>
                      </div>
                      <Star className="text-[#FF6B35]" size={20} />
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>

            {/* Non sélectionnées */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="rounded-2xl border border-[#E9ECEF] bg-white p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#6C757D]/10 to-[#6C757D]/10 flex items-center justify-center">
                  <Users className="text-[#6C757D]" size={20} />
                </div>
                <h2 
                  className="font-display text-xl font-bold text-[#212529]"
                  style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700 }}
                >
                  Équipes Non Sélectionnées
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stats.nonSelectionnees.length === 0 ? (
                  <p className="text-[#6C757D] text-center py-8 md:col-span-2 lg:col-span-3" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                    Aucune équipe non sélectionnée
                  </p>
                ) : (
                  stats.nonSelectionnees.map((eq) => (
                    <motion.div
                      key={eq.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="p-4 rounded-xl bg-[#F8F9FA] border border-[#E9ECEF]"
                    >
                      <p className="font-medium text-[#212529]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                        {eq.nom_equipe || 'Individuel'}
                      </p>
                      <p className="text-xs text-[#6C757D] mt-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                        {(eq.membres as any[])?.length || 0} membre{(eq.membres as any[])?.length > 1 ? 's' : ''}
                      </p>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Classement;
