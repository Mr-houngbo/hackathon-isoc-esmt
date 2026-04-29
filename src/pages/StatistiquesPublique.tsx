import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import { Users, Trophy, GraduationCap, Lightbulb, Building2, School, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

// Palette premium
const COLORS = {
  primary: "#0D1B2A",
  card: "#152233",
  accent: "#00C49A",
  neutral: "#F0F4F8",
  border: "rgba(0, 196, 154, 0.15)",
  textMuted: "rgba(240, 244, 248, 0.45)",
  textSubtle: "rgba(240, 244, 248, 0.5)",
  barBg: "rgba(255, 255, 255, 0.06)",
};

const StatistiquesPublique = () => {
  const { data: equipes, isLoading: loadingEquipes } = useQuery({
    queryKey: ["public-stats-equipes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("equipes")
        .select(`*, membres (id, genre, niveau_etudes, filiere, etablissement)`)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  if (loadingEquipes) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: COLORS.primary }}>
          <div className="w-10 h-10 rounded-full border-2 border-[#00C49A] border-t-transparent animate-spin" />
        </div>
      </Layout>
    );
  }

  const stats = {
    inscriptions: 168,
    totalParticipants: 40,
    equipes: 10,
    individuels: 12,
    mentors: 8,
  };

  const allMembres = equipes?.flatMap(eq => eq.membres || []) || [];

  const genreStats = allMembres.reduce((acc, m) => {
    acc[m.genre || 'autre'] = (acc[m.genre || 'autre'] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalGenre = Object.values(genreStats).reduce((a, b) => a + b, 0) || 1;
  const pctHomme = Math.round((genreStats['homme'] || 0) / totalGenre * 100);
  const pctFemme = Math.round((genreStats['femme'] || 0) / totalGenre * 100);

  const niveauStats = allMembres.reduce((acc, m) => {
    acc[m.niveau_etudes || 'Autre'] = (acc[m.niveau_etudes || 'Autre'] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const ecolesStats = allMembres.reduce((acc, m) => {
    if (m.etablissement) acc[m.etablissement] = (acc[m.etablissement] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topEcoles = Object.entries(ecolesStats).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const projetsTotal = equipes?.filter(e => e.a_projet === 'oui').length || 0;
  const projetsSelected = 19;
  const tauxSelection = projetsTotal > 0 ? Math.round((projetsSelected / projetsTotal) * 100) : 0;

  // Données KPI
  const kpiData = [
    { icon: Users, value: stats.inscriptions, label: "Inscriptions", sublabel: "candidatures reçues" },
    { icon: Trophy, value: stats.totalParticipants, label: "Sélectionnés", sublabel: `${stats.equipes} équipes` },
    { icon: Users, value: stats.individuels, label: "Individuels", sublabel: "en 3 équipes" },
    { icon: GraduationCap, value: stats.mentors, label: "Mentors", sublabel: "experts métiers" },
  ];

  return (
    <Layout>
      <div className="min-h-screen" style={{ backgroundColor: COLORS.primary, fontFamily: 'Inter, DM Sans, system-ui, sans-serif' }}>
        <div className="container py-12 px-4 sm:px-6 lg:px-8">
          {/* Header Premium */}
          <motion.div 
            className="mb-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-bold mb-2">
              <span style={{ color: COLORS.neutral }}>Bilan</span>
              <span style={{ color: COLORS.accent }}> 2026</span>
            </h1>
            <p 
              className="text-sm uppercase tracking-widest mb-6"
              style={{ color: 'rgba(240, 244, 248, 0.4)', letterSpacing: '0.08em' }}
            >
              Hackathon ISOC-ESMT en chiffres
            </p>
            <div className="w-full h-px" style={{ backgroundColor: COLORS.border }} />
          </motion.div>

          {/* KPI Grid - 4 cartes identiques */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {kpiData.map((kpi, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                className="group relative overflow-hidden rounded-lg p-5 transition-all duration-300 hover:border-l-2"
                style={{ 
                  backgroundColor: COLORS.card,
                  border: `1px solid ${COLORS.border}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderLeft = `2px solid ${COLORS.accent}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderLeft = `1px solid ${COLORS.border}`;
                }}
              >
                <div className="flex flex-col h-full">
                  <kpi.icon size={18} style={{ color: COLORS.accent }} className="mb-4" />
                  <p 
                    className="text-5xl font-bold mb-1"
                    style={{ color: COLORS.neutral, fontSize: '56px', fontWeight: 700 }}
                  >
                    {kpi.value}
                  </p>
                  <p 
                    className="text-sm mb-3"
                    style={{ color: COLORS.textMuted, fontSize: '13px', fontWeight: 400 }}
                  >
                    {kpi.label}
                  </p>
                  <span 
                    className="self-start px-2 py-0.5 rounded text-xs font-medium"
                    style={{ 
                      backgroundColor: 'rgba(0, 196, 154, 0.1)', 
                      color: COLORS.accent,
                      borderRadius: '4px',
                      fontSize: '11px'
                    }}
                  >
                    {kpi.sublabel}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Main Grid - 2 colonnes */}
          <div className="grid lg:grid-cols-2 gap-4">
            {/* Répartition Genre - Half Donut */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="rounded-lg p-6"
              style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }}
            >
              <h3 className="text-sm font-medium mb-6" style={{ color: COLORS.textSubtle }}>
                Répartition Genre
              </h3>
              <div className="flex items-center gap-8">
                {/* Half Donut SVG */}
                <div className="relative w-40 h-20">
                  <svg className="w-full h-full" viewBox="0 0 100 50">
                    {/* Background arc */}
                    <path
                      d="M 10 50 A 40 40 0 0 1 90 50"
                      fill="none"
                      stroke="rgba(0, 196, 154, 0.25)"
                      strokeWidth="12"
                      strokeLinecap="round"
                    />
                    {/* Hommes arc */}
                    <path
                      d="M 10 50 A 40 40 0 0 1 90 50"
                      fill="none"
                      stroke={COLORS.accent}
                      strokeWidth="12"
                      strokeLinecap="round"
                      strokeDasharray={`${pctHomme * 1.26} 251`}
                      transform="rotate(180 50 50)"
                    />
                  </svg>
                </div>
                {/* Légendes */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2" style={{ backgroundColor: COLORS.accent }} />
                      <span className="text-sm" style={{ color: COLORS.textSubtle }}>Hommes</span>
                    </div>
                    <span 
                      className="text-xl font-semibold"
                      style={{ color: COLORS.neutral, fontSize: '22px', fontWeight: 600 }}
                    >
                      {pctHomme}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2" style={{ backgroundColor: 'rgba(0, 196, 154, 0.25)' }} />
                      <span className="text-sm" style={{ color: COLORS.textSubtle }}>Femmes</span>
                    </div>
                    <span 
                      className="text-xl font-semibold"
                      style={{ color: COLORS.neutral, fontSize: '22px', fontWeight: 600 }}
                    >
                      {pctFemme}%
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Projets - Avec barres de progression */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="rounded-lg p-6"
              style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }}
            >
              <h3 className="text-sm font-medium mb-6" style={{ color: COLORS.textSubtle }}>
                Projets
              </h3>
              <div className="space-y-4">
                {/* Ligne Projets Présentés */}
                <div className="relative">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm" style={{ color: COLORS.textSubtle }}>Présentés</span>
                    <span className="text-sm font-medium" style={{ color: COLORS.neutral }}>{projetsTotal}</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: COLORS.barBg }}>
                    <div 
                      className="h-full rounded-full"
                      style={{ 
                        backgroundColor: COLORS.accent, 
                        width: `${Math.min((projetsTotal / 50) * 100, 100)}%` 
                      }} 
                    />
                  </div>
                </div>
                {/* Ligne Projets Sélectionnés */}
                <div className="relative">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm" style={{ color: COLORS.textSubtle }}>Sélectionnés</span>
                    <span className="text-sm font-medium" style={{ color: COLORS.accent }}>{projetsSelected}</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: COLORS.barBg }}>
                    <div 
                      className="h-full rounded-full"
                      style={{ 
                        backgroundColor: COLORS.accent, 
                        width: `${Math.min((projetsSelected / 50) * 100, 100)}%` 
                      }} 
                    />
                  </div>
                </div>
              </div>
              {/* Badge Taux centré */}
              <div className="mt-6 flex justify-center">
                <div 
                  className="px-6 py-3 rounded-lg"
                  style={{ backgroundColor: 'rgba(0, 196, 154, 0.1)' }}
                >
                  <span 
                    className="font-bold"
                    style={{ color: COLORS.accent, fontSize: '28px', fontWeight: 700 }}
                  >
                    {tauxSelection}%
                  </span>
                  <span className="block text-center text-xs mt-1" style={{ color: COLORS.textMuted }}>
                    taux de sélection
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Top Écoles */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="rounded-lg p-6"
              style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }}
            >
              <h3 className="text-sm font-medium mb-6" style={{ color: COLORS.textSubtle }}>
                Top Écoles
              </h3>
              <div className="space-y-3.5">
                {topEcoles.length > 0 ? topEcoles.map(([ecole, count], i) => {
                  const opacity = 1 - (i * 0.2); // 100% → 20%
                  const maxCount = topEcoles[0][1];
                  return (
                    <div key={ecole} className="flex items-center gap-3">
                      {/* Rank badge carré */}
                      <div 
                        className="w-6 h-6 flex items-center justify-center text-xs font-medium rounded"
                        style={{ 
                          backgroundColor: 'rgba(0, 196, 154, 0.12)', 
                          color: COLORS.accent,
                          width: '24px',
                          height: '24px'
                        }}
                      >
                        {i + 1}
                      </div>
                      {/* Barre horizontale */}
                      <div className="flex-1 relative h-2 rounded overflow-hidden" style={{ backgroundColor: COLORS.barBg }}>
                        <div 
                          className="absolute top-0 left-0 h-full rounded"
                          style={{ 
                            backgroundColor: COLORS.accent, 
                            opacity: opacity,
                            width: `${(count / maxCount) * 100}%` 
                          }} 
                        />
                      </div>
                      {/* Label école */}
                      <span 
                        className="text-sm w-32 truncate text-right"
                        style={{ color: COLORS.neutral, fontSize: '13px' }}
                      >
                        {ecole}
                      </span>
                      {/* Compte */}
                      <span 
                        className="text-xs w-6 text-right"
                        style={{ color: COLORS.textMuted }}
                      >
                        {count}
                      </span>
                    </div>
                  );
                }) : (
                  <p style={{ color: COLORS.textMuted }}>Aucune donnée</p>
                )}
              </div>
            </motion.div>

            {/* Niveaux d'Études */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="rounded-lg p-6"
              style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }}
            >
              <h3 className="text-sm font-medium mb-6" style={{ color: COLORS.textSubtle }}>
                Niveaux d'Études
              </h3>
              <div className="space-y-3">
                {Object.entries(niveauStats)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 5)
                  .map(([niveau, count]) => {
                    const pct = Math.round((count / totalGenre) * 100);
                    return (
                      <div key={niveau} className="flex items-center gap-3">
                        <span 
                          className="text-xs w-24 truncate"
                          style={{ color: COLORS.textSubtle, fontSize: '12px' }}
                        >
                          {niveau}
                        </span>
                        <div 
                          className="flex-1 h-2 rounded-full overflow-hidden"
                          style={{ backgroundColor: COLORS.barBg }}
                        >
                          <div 
                            className="h-full rounded-full"
                            style={{ 
                              backgroundColor: COLORS.accent, 
                              width: `${pct}%`,
                              borderRadius: '100px'
                            }} 
                          />
                        </div>
                        <span 
                          className="text-xs w-8 text-right font-medium"
                          style={{ color: COLORS.neutral, fontSize: '12px', fontWeight: 500 }}
                        >
                          {pct}%
                        </span>
                      </div>
                    );
                  })}
              </div>
            </motion.div>
          </div>

          {/* CTA Minimaliste */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-10 flex justify-center gap-4"
          >
            <a 
              href="/laureats" 
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all hover:opacity-80"
              style={{ 
                backgroundColor: COLORS.accent, 
                color: COLORS.primary 
              }}
            >
              <Trophy size={16} />
              Lauréats
            </a>
            <a 
              href="/galerie" 
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all hover:opacity-80"
              style={{ 
                backgroundColor: 'transparent', 
                color: COLORS.neutral,
                border: `1px solid ${COLORS.border}`
              }}
            >
              <Sparkles size={16} />
              Galerie
            </a>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default StatistiquesPublique;
