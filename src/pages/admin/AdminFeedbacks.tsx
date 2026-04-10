import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/layout/AdminLayout";
import { MessageSquare, Star, Bug, Lightbulb, Sparkles, FileText, Mail, Calendar, CheckCircle, Clock, Archive, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

interface Feedback {
  id: string;
  type: 'hackathon' | 'bug' | 'improvement' | 'feature' | 'other';
  rating: number;
  message: string;
  email: string | null;
  created_at: string;
  status: 'new' | 'in_progress' | 'resolved' | 'archived';
}

// Client supabase non typé pour la table feedbacks
const supabaseClient = supabase as any;

const AdminFeedbacks = () => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  const { data: feedbacks, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-feedbacks"],
    queryFn: async () => {
      const { data, error } = await supabaseClient
        .from("feedbacks")
        .select("*")
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Feedback[];
    },
  });

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabaseClient
      .from("feedbacks")
      .update({ status: newStatus })
      .eq("id", id);
    
    if (error) {
      console.error(error);
      return;
    }
    refetch();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'hackathon': return <Trophy size={16} className="text-[#40B2A4]" />;
      case 'bug': return <Bug size={16} className="text-[#DC2626]" />;
      case 'improvement': return <Lightbulb size={16} className="text-[#40B2A4]" />;
      case 'feature': return <Sparkles size={16} className="text-[#24366E]" />;
      default: return <FileText size={16} className="text-[#6C757D]" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'hackathon': return 'Hackathon';
      case 'bug': return 'Bug';
      case 'improvement': return 'Amélioration';
      case 'feature': return 'Fonctionnalité';
      case 'other': return 'Autre';
      default: return type;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-[#DC2626]/10 text-[#DC2626] border border-[#DC2626]/20">
            <Clock size={12} /> Nouveau
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20">
            <Clock size={12} /> En cours
          </span>
        );
      case 'resolved':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-[#40B2A4]/10 text-[#40B2A4] border border-[#40B2A4]/20">
            <CheckCircle size={12} /> Résolu
          </span>
        );
      case 'archived':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-[#6C757D]/10 text-[#6C757D] border border-[#6C757D]/20">
            <Archive size={12} /> Archivé
          </span>
        );
      default:
        return null;
    }
  };

  const filteredFeedbacks = feedbacks?.filter((f) => {
    const matchStatus = filterStatus === 'all' || f.status === filterStatus;
    const matchType = filterType === 'all' || f.type === filterType;
    return matchStatus && matchType;
  });

  const stats = {
    total: feedbacks?.length || 0,
    new: feedbacks?.filter(f => f.status === 'new').length || 0,
    inProgress: feedbacks?.filter(f => f.status === 'in_progress').length || 0,
    resolved: feedbacks?.filter(f => f.status === 'resolved').length || 0,
    avgRating: feedbacks?.length ? (feedbacks.reduce((acc, f) => acc + f.rating, 0) / feedbacks.length).toFixed(1) : '0',
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full border-4 border-[#24366E] border-t-transparent animate-spin"></div>
            <p className="text-[#6C757D]">Chargement des feedbacks...</p>
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
            <p className="text-[#D25238] text-lg font-bold mb-4">Erreur de chargement</p>
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
        <div className="bg-gradient-to-r from-[#24366E]/10 to-[#40B2A4]/10 backdrop-blur-sm border-b border-[#40B2A4]/20">
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
                  Feedbacks Utilisateurs
                </h1>
                <p 
                  className="text-[#6C757D] mt-2"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  Gestion des retours et suggestions
                </p>
              </motion.div>
              <div className="flex items-center gap-2">
                <MessageSquare size={32} className="text-[#40B2A4]" />
              </div>
            </div>
          </div>
        </div>

        <div className="container py-6 space-y-6">
          {/* Stats */}
          <motion.div 
            className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="bg-white rounded-xl border border-[#E9ECEF] p-4 shadow-sm">
              <p className="text-sm text-[#6C757D]" style={{ fontFamily: 'DM Sans, sans-serif' }}>Total</p>
              <p className="text-2xl font-bold text-[#24366E]" style={{ fontFamily: 'Sora, sans-serif' }}>{stats.total}</p>
            </div>
            <div className="bg-white rounded-xl border border-[#E9ECEF] p-4 shadow-sm">
              <p className="text-sm text-[#6C757D]" style={{ fontFamily: 'DM Sans, sans-serif' }}>Nouveaux</p>
              <p className="text-2xl font-bold text-[#DC2626]" style={{ fontFamily: 'Sora, sans-serif' }}>{stats.new}</p>
            </div>
            <div className="bg-white rounded-xl border border-[#E9ECEF] p-4 shadow-sm">
              <p className="text-sm text-[#6C757D]" style={{ fontFamily: 'DM Sans, sans-serif' }}>En cours</p>
              <p className="text-2xl font-bold text-[#F59E0B]" style={{ fontFamily: 'Sora, sans-serif' }}>{stats.inProgress}</p>
            </div>
            <div className="bg-white rounded-xl border border-[#E9ECEF] p-4 shadow-sm">
              <p className="text-sm text-[#6C757D]" style={{ fontFamily: 'DM Sans, sans-serif' }}>Résolus</p>
              <p className="text-2xl font-bold text-[#40B2A4]" style={{ fontFamily: 'Sora, sans-serif' }}>{stats.resolved}</p>
            </div>
            <div className="bg-white rounded-xl border border-[#E9ECEF] p-4 shadow-sm col-span-2 sm:col-span-4 lg:col-span-1">
              <p className="text-sm text-[#6C757D]" style={{ fontFamily: 'DM Sans, sans-serif' }}>Note moyenne</p>
              <div className="flex items-center gap-1">
                <p className="text-2xl font-bold text-[#F59E0B]" style={{ fontFamily: 'Sora, sans-serif' }}>{stats.avgRating}</p>
                <Star size={20} className="fill-[#F59E0B] text-[#F59E0B]" />
              </div>
            </div>
          </motion.div>

          {/* Filtres */}
          <motion.div 
            className="bg-white rounded-xl border border-[#E9ECEF] p-4 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex flex-wrap gap-4">
              <div>
                <label className="text-sm font-medium text-[#212529] mb-1 block" style={{ fontFamily: 'Sora, sans-serif' }}>Statut</label>
                <select 
                  value={filterStatus} 
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-[#E9ECEF] text-sm focus:outline-none focus:ring-2 focus:ring-[#40B2A4]/20"
                >
                  <option value="all">Tous</option>
                  <option value="new">Nouveau</option>
                  <option value="in_progress">En cours</option>
                  <option value="resolved">Résolu</option>
                  <option value="archived">Archivé</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-[#212529] mb-1 block" style={{ fontFamily: 'Sora, sans-serif' }}>Type</label>
                <select 
                  value={filterType} 
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-[#E9ECEF] text-sm focus:outline-none focus:ring-2 focus:ring-[#40B2A4]/20"
                >
                  <option value="all">Tous</option>
                  <option value="hackathon">🏆 Hackathon</option>
                  <option value="bug">Bug</option>
                  <option value="improvement">Amélioration</option>
                  <option value="feature">Fonctionnalité</option>
                  <option value="other">Autre</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Liste des feedbacks */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {filteredFeedbacks?.length === 0 ? (
              <div className="bg-white rounded-xl border border-[#E9ECEF] p-12 text-center">
                <MessageSquare size={48} className="text-[#E9ECEF] mx-auto mb-4" />
                <p className="text-[#6C757D]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                  Aucun feedback trouvé
                </p>
              </div>
            ) : (
              filteredFeedbacks?.map((feedback) => (
                <div 
                  key={feedback.id} 
                  className="bg-white rounded-xl border border-[#E9ECEF] p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-wrap items-center gap-3">
                        {getTypeIcon(feedback.type)}
                        <span className="font-medium text-[#212529]" style={{ fontFamily: 'Sora, sans-serif' }}>
                          {getTypeLabel(feedback.type)}
                        </span>
                        {getStatusBadge(feedback.status)}
                      </div>
                      
                      <p className="text-[#212529]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                        {feedback.message}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-[#6C757D]">
                        {feedback.email && (
                          <div className="flex items-center gap-1">
                            <Mail size={14} />
                            <span>{feedback.email}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>{new Date(feedback.created_at).toLocaleDateString('fr-FR')}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star size={14} className="fill-[#F59E0B] text-[#F59E0B]" />
                          <span>{feedback.rating}/5</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {feedback.status !== 'in_progress' && (
                        <button
                          onClick={() => updateStatus(feedback.id, 'in_progress')}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#F59E0B]/10 text-[#F59E0B] hover:bg-[#F59E0B]/20 transition-colors"
                        >
                          En cours
                        </button>
                      )}
                      {feedback.status !== 'resolved' && (
                        <button
                          onClick={() => updateStatus(feedback.id, 'resolved')}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#40B2A4]/10 text-[#40B2A4] hover:bg-[#40B2A4]/20 transition-colors"
                        >
                          Résolu
                        </button>
                      )}
                      {feedback.status !== 'archived' && (
                        <button
                          onClick={() => updateStatus(feedback.id, 'archived')}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#6C757D]/10 text-[#6C757D] hover:bg-[#6C757D]/20 transition-colors"
                        >
                          Archiver
                        </button>
                      )}
                      {feedback.status !== 'new' && (
                        <button
                          onClick={() => updateStatus(feedback.id, 'new')}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#DC2626]/10 text-[#DC2626] hover:bg-[#DC2626]/20 transition-colors"
                        >
                          Nouveau
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminFeedbacks;
