import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/layout/AdminLayout";
import { Users, UserCheck, BarChart3, TrendingUp, Calendar, Trophy, Clock, Activity } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'7j' | '30j' | '24h'>('7j');
  
  const { data: equipes, isLoading, error } = useQuery({
    queryKey: ["admin-equipes"],
    queryFn: async () => {
      const { data, error } = await supabase.from("equipes").select("*, membres(*)").order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const totalEquipes = equipes?.length || 0;
  const selectionnees = equipes?.filter((e) => e.selectionnee).length || 0;
  const totalMembres = equipes?.reduce((acc, e) => acc + ((e.membres as any[])?.length || 0), 0) || 0;

  const genreStats = equipes?.reduce((acc, e) => {
    (e.membres as any[])?.forEach((m: any) => {
      if (m.genre === 'homme') acc.hommes++;
      else if (m.genre === 'femme') acc.femmes++;
      else acc.autres++;
    });
    return acc;
  }, { hommes: 0, femmes: 0, autres: 0 }) || { hommes: 0, femmes: 0, autres: 0 };

  const stats = [
    { icon: Users, label: "Équipes inscrites", value: totalEquipes, color: "text-[#00873E]", change: `${((totalEquipes / 100) * 100).toFixed(1)}%` },
    { icon: UserCheck, label: "Équipes sélectionnées", value: selectionnees, color: "text-[#FBBF24]", change: `${totalEquipes > 0 ? '+' : ''}${selectionnees}` },
    { icon: BarChart3, label: "Total participants", value: totalMembres, color: "text-[#9CA3AF]", change: `${((totalMembres / 100) * 100).toFixed(1)}%` },
    { icon: TrendingUp, label: "Ratio H/F", value: `${genreStats.hommes}/${genreStats.femmes}`, color: "text-[#F59E0B]", change: "N/A" },
    { icon: Activity, label: "Taux de sélection", value: `${totalEquipes > 0 ? ((selectionnees / totalEquipes) * 100).toFixed(1) : 0}%`, color: "text-[#10B981]", change: "N/A" },
  ];

  const recentActivity = equipes?.slice(0, 5).map(eq => ({
    id: eq.id,
    equipe: eq.nom_equipe || 'Individuel',
    type: eq.type_candidature,
    membres: (eq.membres as any[])?.length || 0,
    date: new Date(eq.created_at).toLocaleDateString('fr-FR'),
    status: eq.selectionnee ? 'Sélectionnée' : 'En attente'
  }));

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full border-4 border-[#00873E] border-t-transparent animate-spin"></div>
            <p className="text-[#9CA3AF]">Chargement du dashboard...</p>
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
            <p className="text-[#9CA3AF]">{error.message}</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-[#0A0A0A]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#00873E]/10 to-[#FBBF24]/10 backdrop-blur-sm border-b border-[#2D3748]/20">
          <div className="container py-6">
            <div className="flex items-center justify-between">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 
                  className="font-display text-3xl font-bold text-[#F9FAFB]"
                  style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800 }}
                >
                  Dashboard Admin
                </h1>
                <p 
                  className="text-[#9CA3AF] mt-2"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  Gestion du Hackathon ISOC-ESMT 2026
                </p>
              </motion.div>
              
              <div className="flex gap-2">
                {['7j', '30j', '24h'].map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period as any)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      selectedPeriod === period 
                        ? 'bg-[#00873E] text-[#F9FAFB]' 
                        : 'bg-[#1F2937] text-[#9CA3AF] hover:bg-[#2D3748]'
                    }`}
                    style={{ fontFamily: 'DM Sans, sans-serif' }}
                  >
                    {period === '7j' ? '7 jours' : period === '30j' ? '30 jours' : '24h'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="container py-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative overflow-hidden rounded-2xl border border-[#2D3748] bg-[#111827] p-6 hover:border-[#FBBF24]/50 hover:shadow-xl hover:shadow-[#FBBF24]/10 transition-all duration-300"
                >
                  {/* Background decoration */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#FBBF24]/5 opacity-0"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#00873E]/20 to-[#FBBF24]/20 flex items-center justify-center">
                          <stat.icon size={24} className="text-[#F9FAFB]" />
                        </div>
                        <div>
                          <p 
                            className="text-2xl font-bold text-[#F9FAFB]"
                            style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700 }}
                          >
                            {stat.value}
                          </p>
                          <p 
                            className="text-xs text-[#9CA3AF] mt-1"
                            style={{ fontFamily: 'DM Sans, sans-serif' }}
                          >
                            {stat.label}
                          </p>
                        </div>
                      </div>
                      {stat.change && stat.change !== 'N/A' && (
                        <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                          stat.change.startsWith('+') ? 'bg-[#00873E] text-[#F9FAFB]' : 'bg-[#F59E0B] text-[#F9FAFB]'
                        }`}>
                          {stat.change}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <div className="container py-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="rounded-2xl border border-[#2D3748] bg-[#111827] p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 
                  className="font-display text-xl font-bold text-[#F9FAFB]"
                  style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700 }}
                >
                  Activité Récente
                </h2>
                <div className="flex items-center gap-2">
                  <Activity size={20} className="text-[#9CA3AF]" />
                  <span className="text-sm text-[#9CA3AF]" style={{ fontFamily: 'DM Sans, sans-serif' }}>Dernières inscriptions</span>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#2D3748]">
                      <th className="text-left py-3 px-4 text-sm font-bold text-[#9CA3AF]" style={{ fontFamily: 'Sora, sans-serif' }}>Équipe</th>
                      <th className="text-left py-3 px-4 text-sm font-bold text-[#9CA3AF]" style={{ fontFamily: 'Sora, sans-serif' }}>Type</th>
                      <th className="text-left py-3 px-4 text-sm font-bold text-[#9CA3AF]" style={{ fontFamily: 'Sora, sans-serif' }}>Membres</th>
                      <th className="text-left py-3 px-4 text-sm font-bold text-[#9CA3AF]" style={{ fontFamily: 'Sora, sans-serif' }}>Date</th>
                      <th className="text-left py-3 px-4 text-sm font-bold text-[#9CA3AF]" style={{ fontFamily: 'Sora, sans-serif' }}>Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentActivity?.map((eq) => (
                      <tr key={eq.id} className="border-b border-[#2D3748]/50 hover:bg-[#1F2937]/30 transition-colors">
                        <td className="py-3 px-4">
                          <span 
                            className="font-medium text-[#F9FAFB]"
                            style={{ fontFamily: 'DM Sans, sans-serif' }}
                          >
                            {eq.equipe}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            eq.type_candidature === 'equipe' ? 'bg-[#FBBF24]/20 text-[#FBBF24]' : 'bg-[#00873E]/20 text-[#00873E]'
                          }`}>
                            {eq.type_candidature === 'equipe' ? 'Équipe' : 'Individuel'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span 
                            className="text-[#9CA3AF]"
                            style={{ fontFamily: 'DM Sans, sans-serif' }}
                          >
                            {eq.membres}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-xs text-[#9CA3AF]" style={{ fontFamily: 'DM Sans, sans-serif' }}>{eq.date}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            eq.status === 'Sélectionnée' ? 'bg-[#00873E]/20 text-[#00873E]' : 'bg-[#F59E0B]/20 text-[#F59E0B]'
                          }`}>
                            {eq.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
