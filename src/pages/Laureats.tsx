import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import { 
  Trophy, 
  Crown, 
  Medal, 
  Star, 
  Sparkles,
  Users,
  Lightbulb,
  Target,
  Rocket,
  Quote,
  Calendar,
  TrendingUp,
  Award,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface Laureat {
  id: string;
  annee: number;
  rank: number;
  team_name: string;
  project_name: string;
  project_description: string;
  prize?: string;
  testimonial?: string;
  photos: string[];
  members: Array<{
    name: string;
    role?: string;
    photo?: string;
  }>;
  stats?: {
    innovation_score?: number;
    technical_score?: number;
    impact_score?: number;
  };
}

const Laureats = () => {
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [hoveredLaureat, setHoveredLaureat] = useState<string | null>(null);

  const { data: laureats, isLoading, error } = useQuery({
    queryKey: ["laureats", selectedYear],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("laureats")
        .select("*")
        .eq("annee", selectedYear)
        .order("rank", { ascending: true });
      
      if (error) throw error;
      return data as Laureat[];
    },
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 20 }
    }
  };

  const getRankConfig = (rank: number) => {
    switch(rank) {
      case 1: return { 
        color: 'from-yellow-400 via-yellow-500 to-amber-600', 
        bgGlow: 'bg-yellow-500/20',
        borderColor: 'border-yellow-400/50',
        shadowColor: 'shadow-yellow-500/30',
        icon: Crown, 
        label: '1ère Place',
        emoji: '🥇',
        size: 'lg'
      };
      case 2: return { 
        color: 'from-slate-300 via-slate-400 to-slate-500', 
        bgGlow: 'bg-slate-400/20',
        borderColor: 'border-slate-300/50',
        shadowColor: 'shadow-slate-400/30',
        icon: Medal, 
        label: '2ème Place',
        emoji: '🥈',
        size: 'md'
      };
      case 3: return { 
        color: 'from-orange-400 via-orange-500 to-amber-600', 
        bgGlow: 'bg-orange-500/20',
        borderColor: 'border-orange-400/50',
        shadowColor: 'shadow-orange-500/30',
        icon: Award, 
        label: '3ème Place',
        emoji: '🥉',
        size: 'md'
      };
      default: return { 
        color: 'from-[#40B2A4] via-[#3AA99F] to-[#2E968C]', 
        bgGlow: 'bg-[#40B2A4]/20',
        borderColor: 'border-[#40B2A4]/50',
        shadowColor: 'shadow-[#40B2A4]/30',
        icon: Star, 
        label: 'Lauréat',
        emoji: '⭐',
        size: 'sm'
      };
    }
  };

  const years = [2026, 2025, 2024];

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-[#24366E] via-[#1A264A] to-[#0F1535] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full border-4 border-[#40B2A4] border-t-transparent animate-spin"></div>
            <p className="text-white/70" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              Chargement des lauréats...
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-[#24366E] via-[#1A264A] to-[#0F1535] flex items-center justify-center">
          <div classText="text-center">
            <p className="text-red-400 text-lg font-bold mb-4">Erreur de chargement</p>
            <p className="text-white/70">{error.message}</p>
          </div>
        </div>
      </Layout>
    );
  }

  const sortedLaureats = [...(laureats || [])].sort((a, b) => a.rank - b.rank);
  const firstPlace = sortedLaureats.find(l => l.rank === 1);
  const secondPlace = sortedLaureats.find(l => l.rank === 2);
  const thirdPlace = sortedLaureats.find(l => l.rank === 3);
  const otherLaureats = sortedLaureats.filter(l => l.rank > 3);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-[#24366E] via-[#1A264A] to-[#0F1535] overflow-hidden">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#40B2A4]/10 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#FEEB09]/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#24366E]/30 rounded-full blur-[150px]"></div>
          
          {/* Grid Pattern */}
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2340B2A4' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}
          ></div>
        </div>

        {/* Hero Section */}
        <div className="relative z-10 pt-20 pb-12">
          <div className="container">
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
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#40B2A4]/20 to-[#FEEB09]/10 border border-[#40B2A4]/30 mb-8 backdrop-blur-sm"
              >
                <Sparkles className="w-5 h-5 text-[#FEEB09]" />
                <span className="text-sm font-semibold text-white tracking-wide">Édition {selectedYear}</span>
                <Sparkles className="w-5 h-5 text-[#FEEB09]" />
              </motion.div>

              <motion.div 
                className="flex items-center justify-center gap-6 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#FEEB09] via-[#FFD700] to-[#FFA500] flex items-center justify-center shadow-2xl shadow-[#FEEB09]/30 animate-glow-yellow">
                  <Trophy size={48} className="text-[#24366E]" />
                </div>
                <div className="text-left">
                  <h1 
                    className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-white via-[#FEEB09] to-[#40B2A4] bg-clip-text text-transparent"
                    style={{ fontFamily: 'Sora, sans-serif' }}
                  >
                    Les Lauréats
                  </h1>
                  <p className="text-xl text-white/60 mt-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                    Hackathon ISOC-ESMT {selectedYear}
                  </p>
                </div>
              </motion.div>

              <motion.p 
                className="text-lg text-white/50 max-w-2xl mx-auto mb-12"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                Découvrez les projets innovants qui ont marqué cette édition et les talents exceptionnels qui les ont portés
              </motion.p>

              {/* Year Selector */}
              <motion.div 
                className="flex flex-wrap justify-center gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                {years.map((year) => (
                  <button
                    key={year}
                    onClick={() => setSelectedYear(year)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      selectedYear === year
                        ? 'bg-gradient-to-r from-[#40B2A4] to-[#24366E] text-white shadow-lg shadow-[#40B2A4]/30 scale-105 border border-[#40B2A4]/50'
                        : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10 hover:border-[#40B2A4]/30'
                    }`}
                  >
                    <Calendar className="w-4 h-4" />
                    <span>{year}</span>
                  </button>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Podium Section - Top 3 */}
        {sortedLaureats.length > 0 && (
          <div className="relative z-10 container pb-20">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: 'Sora, sans-serif' }}>
                Le Podium
              </h2>
              <div className="w-32 h-1 bg-gradient-to-r from-[#40B2A4] via-[#FEEB09] to-[#40B2A4] mx-auto rounded-full"></div>
            </motion.div>

            {/* Podium Cards */}
            <div className="grid lg:grid-cols-3 gap-8 items-end max-w-6xl mx-auto">
              {/* 2nd Place */}
              {secondPlace && (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.6 }}
                  className="order-2 lg:order-1"
                >
                  <LaureatCard laureat={secondPlace} rankConfig={getRankConfig(2)} />
                </motion.div>
              )}

              {/* 1st Place - Center & Taller */}
              {firstPlace && (
                <motion.div
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 1.2, duration: 0.6 }}
                  className="order-1 lg:order-2 lg:-mt-12"
                >
                  <LaureatCard laureat={firstPlace} rankConfig={getRankConfig(1)} featured />
                </motion.div>
              )}

              {/* 3rd Place */}
              {thirdPlace && (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4, duration: 0.6 }}
                  className="order-3"
                >
                  <LaureatCard laureat={thirdPlace} rankConfig={getRankConfig(3)} />
                </motion.div>
              )}
            </div>
          </div>
        )}

        {/* Empty State */}
        {(!laureats || laureats.length === 0) && (
          <motion.div 
            className="relative z-10 container py-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="max-w-2xl mx-auto text-center">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#40B2A4]/20 to-[#24366E]/20 border border-[#40B2A4]/30 flex items-center justify-center mx-auto mb-8">
                <Trophy size={64} className="text-[#40B2A4]" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'Sora, sans-serif' }}>
                Lauréats à venir
              </h3>
              <p className="text-white/50 max-w-md mx-auto" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                Les lauréats de l'édition {selectedYear} seront annoncés prochainement. Restez connectés !
              </p>
            </div>
          </motion.div>
        )}

        {/* Other Laureats */}
        {otherLaureats.length > 0 && (
          <div className="relative z-10 container pb-20">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6 }}
            >
              <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'Sora, sans-serif' }}>
                Autres Réalisations Remarquables
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-[#40B2A4] to-[#24366E] mx-auto rounded-full"></div>
            </motion.div>

            <motion.div 
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {otherLaureats.map((laureat) => (
                <motion.div key={laureat.id} variants={cardVariants}>
                  <LaureatCard laureat={laureat} rankConfig={getRankConfig(laureat.rank)} compact />
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}

        {/* CTA Section */}
        <motion.div 
          className="relative z-10 container pb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 }}
        >
          <div className="max-w-4xl mx-auto">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#40B2A4]/20 to-[#24366E]/20 border border-[#40B2A4]/30 p-8 md:p-12 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-r from-[#40B2A4]/10 to-transparent"></div>
              
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Sora, sans-serif' }}>
                    Vous avez été inspiré ?
                  </h3>
                  <p className="text-white/60" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                    Rejoignez la prochaine édition du Hackathon ISOC-ESMT
                  </p>
                </div>
                
                <button className="group flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-[#40B2A4] to-[#24366E] text-white font-semibold hover:shadow-xl hover:shadow-[#40B2A4]/30 transition-all duration-300 hover:scale-105">
                  <Rocket className="w-5 h-5" />
                  <span>Devenir Lauréat</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

// Laureat Card Component
interface LaureatCardProps {
  laureat: Laureat;
  rankConfig: ReturnType<typeof getRankConfig>;
  featured?: boolean;
  compact?: boolean;
}

const LaureatCard = ({ laureat, rankConfig, featured = false, compact = false }: LaureatCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const RankIcon = rankConfig.icon;

  return (
    <div 
      className={`relative group ${featured ? 'transform hover:scale-[1.02]' : 'transform hover:scale-[1.02]'} transition-all duration-500`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glow Effect */}
      <div className={`absolute -inset-1 bg-gradient-to-r ${rankConfig.color} rounded-3xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500`}></div>
      
      {/* Card */}
      <div className={`relative bg-white/5 backdrop-blur-xl border ${rankConfig.borderColor} rounded-3xl overflow-hidden ${featured ? 'p-8' : compact ? 'p-6' : 'p-6'}`}>
        
        {/* Rank Badge */}
        <div className={`absolute -top-4 ${featured ? 'left-1/2 -translate-x-1/2' : 'left-6'} z-20`}>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${rankConfig.color} shadow-lg ${rankConfig.shadowColor}`}>
            <RankIcon size={featured ? 24 : 18} className="text-white" />
            <span className={`font-bold text-white ${featured ? 'text-lg' : 'text-sm'}`}>
              {rankConfig.emoji} {rankConfig.label}
            </span>
          </div>
        </div>

        {/* Team Photo / Project Image */}
        <div className={`relative ${featured ? 'h-64 mb-8' : compact ? 'h-40 mb-6' : 'h-48 mb-6'} rounded-2xl overflow-hidden bg-gradient-to-br from-[#24366E]/50 to-[#1A264A]/50 border border-white/10`}>
          {laureat.photos && laureat.photos.length > 0 ? (
            <img 
              src={laureat.photos[0]} 
              alt={laureat.team_name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className={`${featured ? 'w-24 h-24' : 'w-16 h-16'} rounded-2xl bg-gradient-to-br from-[#40B2A4]/30 to-[#24366E]/30 flex items-center justify-center`}>
                <Lightbulb size={featured ? 48 : 32} className="text-[#40B2A4]" />
              </div>
            </div>
          )}
          
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#24366E]/90 via-transparent to-transparent opacity-60"></div>
          
          {/* Prize Tag */}
          {laureat.prize && (
            <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FEEB09]/20 border border-[#FEEB09]/30 backdrop-blur-sm">
              <Trophy size={14} className="text-[#FEEB09]" />
              <span className="text-xs font-semibold text-[#FEEB09]">{laureat.prize}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="space-y-4">
          {/* Team Name */}
          <h3 className={`font-bold text-white ${featured ? 'text-3xl' : 'text-xl'} leading-tight`} style={{ fontFamily: 'Sora, sans-serif' }}>
            {laureat.team_name}
          </h3>

          {/* Project Name */}
          <div className="flex items-center gap-2">
            <Target size={18} className="text-[#40B2A4]" />
            <span className="text-[#40B2A4] font-semibold">{laureat.project_name}</span>
          </div>

          {/* Project Description */}
          <p className={`text-white/60 ${compact ? 'text-sm line-clamp-2' : 'line-clamp-3'}`} style={{ fontFamily: 'DM Sans, sans-serif' }}>
            {laureat.project_description}
          </p>

          {/* Stats */}
          {laureat.stats && !compact && (
            <div className="flex flex-wrap gap-3 pt-4">
              {laureat.stats.innovation_score && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#40B2A4]/10 border border-[#40B2A4]/30">
                  <Star size={14} className="text-[#40B2A4]" />
                  <span className="text-xs font-medium text-[#40B2A4]">Innovation: {laureat.stats.innovation_score}/10</span>
                </div>
              )}
              {laureat.stats.technical_score && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FEEB09]/10 border border-[#FEEB09]/30">
                  <TrendingUp size={14} className="text-[#FEEB09]" />
                  <span className="text-xs font-medium text-[#FEEB09]">Technique: {laureat.stats.technical_score}/10</span>
                </div>
              )}
            </div>
          )}

          {/* Members */}
          {laureat.members && laureat.members.length > 0 && (
            <div className="pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 mb-3">
                <Users size={16} className="text-white/50" />
                <span className="text-xs font-medium text-white/50 uppercase tracking-wider">Membres de l'équipe</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {laureat.members.map((member, idx) => (
                  <div key={idx} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#40B2A4] to-[#24366E] flex items-center justify-center">
                      <span className="text-xs font-bold text-white">{member.name.charAt(0)}</span>
                    </div>
                    <span className="text-sm text-white/80">{member.name}</span>
                    {member.role && (
                      <span className="text-xs text-[#40B2A4]">({member.role})</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Testimonial */}
          {laureat.testimonial && !compact && (
            <div className="pt-4">
              <div className="relative p-4 rounded-xl bg-gradient-to-r from-[#40B2A4]/10 to-[#24366E]/10 border border-[#40B2A4]/20">
                <Quote size={20} className="absolute top-2 left-2 text-[#40B2A4]/30" />
                <p className="text-sm text-white/70 italic pl-6" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                  "{laureat.testimonial}"
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Laureats;
