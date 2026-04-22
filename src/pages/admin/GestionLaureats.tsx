import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/layout/AdminLayout";
import ImageUpload from "@/components/ui/ImageUpload";
import { toast } from "sonner";
import { 
  Plus, 
  Trash2, 
  Save, 
  Search, 
  Trophy,
  Crown,
  Medal,
  Award,
  Calendar,
  Users,
  Star,
  Edit3,
  X,
  ChevronDown,
  Image,
  TrendingUp,
  Quote,
  RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const YEARS = [
  { value: 2026, label: '2026' },
  { value: 2025, label: '2025' },
  { value: 2024, label: '2024' },
  { value: 2023, label: '2023' },
];

const RANKS = [
  { value: 1, label: '1ère Place', icon: Crown, color: '#FEEB09' },
  { value: 2, label: '2ème Place', icon: Medal, color: '#C0C0C0' },
  { value: 3, label: '3ème Place', icon: Award, color: '#CD7F32' },
];

interface MemberInput {
  name: string;
  role: string;
}

interface LaureatForm {
  annee: number;
  rank: number;
  team_name: string;
  project_name: string;
  project_description: string;
  prize: string;
  testimonial: string;
  photos: string[];
  members: MemberInput[];
  stats: {
    innovation_score: number;
    technical_score: number;
    impact_score: number;
  };
}

const GestionLaureats = () => {
  const queryClient = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [openRankDropdown, setOpenRankDropdown] = useState<string | null>(null);
  
  const [form, setForm] = useState<LaureatForm>({
    annee: 2026,
    rank: 1,
    team_name: '',
    project_name: '',
    project_description: '',
    prize: '',
    testimonial: '',
    photos: [],
    members: [{ name: '', role: '' }],
    stats: {
      innovation_score: 8,
      technical_score: 8,
      impact_score: 8,
    }
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-dropdown]')) {
        setOpenRankDropdown(null);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const { data: laureats, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-laureats", selectedYear],
    queryFn: async () => {
      let query = supabase.from("laureats").select("*");
      
      if (selectedYear) {
        query = query.eq('annee', selectedYear);
      }
      
      query = query.order("rank", { ascending: true });
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const filteredLaureats = laureats?.filter((item) => {
    const matchesSearch = 
      item.team_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.project_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.project_description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  }) || [];

  const stats = {
    total: laureats?.length || 0,
    firstPlace: laureats?.filter(item => item.rank === 1).length || 0,
    secondPlace: laureats?.filter(item => item.rank === 2).length || 0,
    thirdPlace: laureats?.filter(item => item.rank === 3).length || 0,
  };

  const addLaureat = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("laureats").insert({
        ...form,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
    },
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: ["admin-laureats", selectedYear] }); 
      queryClient.invalidateQueries({ queryKey: ["laureats", selectedYear] });
      setShowAdd(false); 
      setEditingItem(null);
      resetForm();
      toast.success("Lauréat ajouté avec succès"); 
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  const updateLaureat = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<LaureatForm> }) => {
      const { error } = await supabase.from("laureats").update({
        ...updates,
        updated_at: new Date().toISOString(),
      }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: ["admin-laureats", selectedYear] }); 
      queryClient.invalidateQueries({ queryKey: ["laureats", selectedYear] });
      setEditingItem(null);
      toast.success("Lauréat modifié avec succès"); 
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  const updateRank = useMutation({
    mutationFn: async ({ id, rank }: { id: string; rank: number }) => {
      const { error } = await supabase.from("laureats").update({ 
        rank,
        updated_at: new Date().toISOString(),
      }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: ["admin-laureats", selectedYear] }); 
      queryClient.invalidateQueries({ queryKey: ["laureats", selectedYear] });
      toast.success("Classement mis à jour avec succès"); 
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  const deleteLaureat = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("laureats").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: ["admin-laureats", selectedYear] }); 
      queryClient.invalidateQueries({ queryKey: ["laureats", selectedYear] });
      toast.success("Lauréat supprimé avec succès"); 
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  const resetForm = () => {
    setForm({
      annee: 2026,
      rank: 1,
      team_name: '',
      project_name: '',
      project_description: '',
      prize: '',
      testimonial: '',
      photos: [],
      members: [{ name: '', role: '' }],
      stats: {
        innovation_score: 8,
        technical_score: 8,
        impact_score: 8,
      }
    });
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setForm({
      annee: item.annee,
      rank: item.rank,
      team_name: item.team_name,
      project_name: item.project_name,
      project_description: item.project_description,
      prize: item.prize || '',
      testimonial: item.testimonial || '',
      photos: item.photos || [],
      members: item.members?.length > 0 ? item.members : [{ name: '', role: '' }],
      stats: item.stats || { innovation_score: 8, technical_score: 8, impact_score: 8 },
    });
    setShowAdd(true);
  };

  const addMemberField = () => {
    setForm({
      ...form,
      members: [...form.members, { name: '', role: '' }]
    });
  };

  const removeMemberField = (index: number) => {
    const newMembers = form.members.filter((_, i) => i !== index);
    setForm({ ...form, members: newMembers });
  };

  const updateMember = (index: number, field: keyof MemberInput, value: string) => {
    const newMembers = form.members.map((m, i) => 
      i === index ? { ...m, [field]: value } : m
    );
    setForm({ ...form, members: newMembers });
  };

  const addPhoto = (url: string) => {
    if (url && !form.photos.includes(url)) {
      setForm({ ...form, photos: [...form.photos, url] });
    }
  };

  const removePhoto = (index: number) => {
    setForm({ ...form, photos: form.photos.filter((_, i) => i !== index) });
  };

  const getRankConfig = (rank: number) => {
    return RANKS.find(r => r.value === rank) || { 
      value: rank, 
      label: `Place ${rank}`, 
      icon: Star, 
      color: '#40B2A4' 
    };
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full border-4 border-[#24366E] border-t-transparent animate-spin"></div>
            <p className="text-[#6C757D]">Chargement des lauréats...</p>
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
        <div className="bg-gradient-to-r from-[#24366E]/10 to-[#40B2A4]/10 backdrop-blur-sm border-b border-[#E9ECEF]/20">
          <div className="container py-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 
                  className="font-display text-3xl font-bold text-[#212529]"
                  style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800 }}
                >
                  Gestion des Lauréats
                </h1>
                <p 
                  className="text-[#6C757D] mt-2"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  Administration des lauréats du Hackathon ISOC-ESMT
                </p>
              </motion.div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    resetForm();
                    setEditingItem(null);
                    setShowAdd(!showAdd);
                  }}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#24366E] to-[#40B2A4] text-white hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <Plus size={16} />
                  {showAdd ? 'Fermer' : 'Ajouter un lauréat'}
                </button>
                <button
                  onClick={() => refetch()}
                  className="p-2 rounded-lg bg-white text-[#6C757D] hover:bg-[#E9ECEF] transition-colors border border-[#E9ECEF]"
                >
                  <RefreshCw size={16} />
                </button>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="relative overflow-hidden rounded-2xl border border-[#E9ECEF] bg-white p-6 hover:border-[#40B2A4]/50 hover:shadow-xl hover:shadow-[#40B2A4]/10 transition-all duration-300"
              >
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#24366E]/20 to-[#40B2A4]/20 flex items-center justify-center">
                        <Trophy size={24} className="text-[#24366E]" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-[#212529]" style={{ fontFamily: 'Sora, sans-serif' }}>
                          {stats.total}
                        </p>
                        <p className="text-xs text-[#6C757D] mt-1">Total lauréats</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative overflow-hidden rounded-2xl border border-[#FEEB09]/50 bg-white p-6 hover:shadow-xl hover:shadow-[#FEEB09]/10 transition-all duration-300"
              >
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#FEEB09]/30 to-[#FFD700]/30 flex items-center justify-center">
                        <Crown size={24} className="text-[#B8860B]" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-[#212529]" style={{ fontFamily: 'Sora, sans-serif' }}>
                          {stats.firstPlace}
                        </p>
                        <p className="text-xs text-[#6C757D] mt-1">1ères places</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="relative overflow-hidden rounded-2xl border border-slate-300 bg-white p-6 hover:shadow-xl hover:shadow-slate-300/30 transition-all duration-300"
              >
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-slate-300/50 to-slate-400/50 flex items-center justify-center">
                        <Medal size={24} className="text-slate-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-[#212529]" style={{ fontFamily: 'Sora, sans-serif' }}>
                          {stats.secondPlace}
                        </p>
                        <p className="text-xs text-[#6C757D] mt-1">2èmes places</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="relative overflow-hidden rounded-2xl border border-orange-300 bg-white p-6 hover:shadow-xl hover:shadow-orange-300/30 transition-all duration-300"
              >
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-orange-300/50 to-amber-400/50 flex items-center justify-center">
                        <Award size={24} className="text-amber-700" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-[#212529]" style={{ fontFamily: 'Sora, sans-serif' }}>
                          {stats.thirdPlace}
                        </p>
                        <p className="text-xs text-[#6C757D] mt-1">3èmes places</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Add/Edit Form */}
        <AnimatePresence>
          {showAdd && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="container py-6"
            >
              <div className="rounded-2xl border border-[#E9ECEF] bg-white p-6 shadow-lg">
                <h2 className="font-display text-xl font-bold text-[#212529] mb-6" style={{ fontFamily: 'Sora, sans-serif' }}>
                  {editingItem ? 'Modifier le Lauréat' : 'Ajouter un Lauréat'}
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column - Basic Info */}
                  <div className="space-y-4">
                    {/* Year & Rank */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#6C757D] mb-2">Année</label>
                        <select
                          value={form.annee}
                          onChange={(e) => setForm({ ...form, annee: parseInt(e.target.value) })}
                          className="w-full px-4 py-2 rounded-xl border border-[#E9ECEF] bg-white text-[#212529] focus:outline-none focus:ring-2 focus:ring-[#40B2A4] focus:border-transparent"
                        >
                          {YEARS.map((year) => (
                            <option key={year.value} value={year.value}>{year.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#6C757D] mb-2">Classement</label>
                        <select
                          value={form.rank}
                          onChange={(e) => setForm({ ...form, rank: parseInt(e.target.value) })}
                          className="w-full px-4 py-2 rounded-xl border border-[#E9ECEF] bg-white text-[#212529] focus:outline-none focus:ring-2 focus:ring-[#40B2A4] focus:border-transparent"
                        >
                          {RANKS.map((rank) => (
                            <option key={rank.value} value={rank.value}>{rank.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Team Name */}
                    <div>
                      <label className="block text-sm font-medium text-[#6C757D] mb-2">Nom de l'équipe</label>
                      <input
                        type="text"
                        placeholder="Nom de l'équipe"
                        value={form.team_name}
                        onChange={(e) => setForm({ ...form, team_name: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl border border-[#E9ECEF] bg-white text-[#212529] focus:outline-none focus:ring-2 focus:ring-[#40B2A4] focus:border-transparent"
                      />
                    </div>

                    {/* Project Name */}
                    <div>
                      <label className="block text-sm font-medium text-[#6C757D] mb-2">Nom du projet</label>
                      <input
                        type="text"
                        placeholder="Nom du projet"
                        value={form.project_name}
                        onChange={(e) => setForm({ ...form, project_name: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl border border-[#E9ECEF] bg-white text-[#212529] focus:outline-none focus:ring-2 focus:ring-[#40B2A4] focus:border-transparent"
                      />
                    </div>

                    {/* Prize */}
                    <div>
                      <label className="block text-sm font-medium text-[#6C757D] mb-2">Prix (optionnel)</label>
                      <input
                        type="text"
                        placeholder="Ex: 500 000 FCFA + Incubation"
                        value={form.prize}
                        onChange={(e) => setForm({ ...form, prize: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl border border-[#E9ECEF] bg-white text-[#212529] focus:outline-none focus:ring-2 focus:ring-[#40B2A4] focus:border-transparent"
                      />
                    </div>

                    {/* Project Description */}
                    <div>
                      <label className="block text-sm font-medium text-[#6C757D] mb-2">Description du projet</label>
                      <textarea
                        placeholder="Description détaillée du projet..."
                        value={form.project_description}
                        onChange={(e) => setForm({ ...form, project_description: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-2 rounded-xl border border-[#E9ECEF] bg-white text-[#212529] focus:outline-none focus:ring-2 focus:ring-[#40B2A4] focus:border-transparent resize-none"
                      />
                    </div>
                  </div>

                  {/* Right Column - Photos, Members, Stats */}
                  <div className="space-y-4">
                    {/* Photos */}
                    <div>
                      <label className="block text-sm font-medium text-[#6C757D] mb-2">Photos du projet</label>
                      <div className="space-y-3">
                        {form.photos.map((photo, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="flex-1 relative">
                              <img src={photo} alt="" className="w-full h-20 object-cover rounded-lg" />
                            </div>
                            <button
                              onClick={() => removePhoto(index)}
                              className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                        <ImageUpload
                          value=""
                          onChange={addPhoto}
                          placeholder="Ajouter une photo"
                          bucket="laureats"
                          folder={`${form.annee}`}
                        />
                      </div>
                    </div>

                    {/* Members */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-[#6C757D]">Membres de l'équipe</label>
                        <button
                          onClick={addMemberField}
                          className="text-xs text-[#40B2A4] hover:text-[#24366E] font-medium"
                        >
                          + Ajouter un membre
                        </button>
                      </div>
                      <div className="space-y-2">
                        {form.members.map((member, index) => (
                          <div key={index} className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Nom"
                              value={member.name}
                              onChange={(e) => updateMember(index, 'name', e.target.value)}
                              className="flex-1 px-3 py-2 rounded-lg border border-[#E9ECEF] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#40B2A4]"
                            />
                            <input
                              type="text"
                              placeholder="Rôle"
                              value={member.role}
                              onChange={(e) => updateMember(index, 'role', e.target.value)}
                              className="w-32 px-3 py-2 rounded-lg border border-[#E9ECEF] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#40B2A4]"
                            />
                            {form.members.length > 1 && (
                              <button
                                onClick={() => removeMemberField(index)}
                                className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                              >
                                <X size={14} />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Stats */}
                    <div>
                      <label className="block text-sm font-medium text-[#6C757D] mb-2">Scores (0-10)</label>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="text-xs text-[#6C757D]">Innovation</label>
                          <input
                            type="number"
                            min="0"
                            max="10"
                            value={form.stats.innovation_score}
                            onChange={(e) => setForm({ 
                              ...form, 
                              stats: { ...form.stats, innovation_score: parseInt(e.target.value) || 0 }
                            })}
                            className="w-full px-3 py-2 rounded-lg border border-[#E9ECEF] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#40B2A4]"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-[#6C757D]">Technique</label>
                          <input
                            type="number"
                            min="0"
                            max="10"
                            value={form.stats.technical_score}
                            onChange={(e) => setForm({ 
                              ...form, 
                              stats: { ...form.stats, technical_score: parseInt(e.target.value) || 0 }
                            })}
                            className="w-full px-3 py-2 rounded-lg border border-[#E9ECEF] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#40B2A4]"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-[#6C757D]">Impact</label>
                          <input
                            type="number"
                            min="0"
                            max="10"
                            value={form.stats.impact_score}
                            onChange={(e) => setForm({ 
                              ...form, 
                              stats: { ...form.stats, impact_score: parseInt(e.target.value) || 0 }
                            })}
                            className="w-full px-3 py-2 rounded-lg border border-[#E9ECEF] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#40B2A4]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Testimonial */}
                    <div>
                      <label className="block text-sm font-medium text-[#6C757D] mb-2">Témoignage (optionnel)</label>
                      <textarea
                        placeholder="Témoignage de l'équipe..."
                        value={form.testimonial}
                        onChange={(e) => setForm({ ...form, testimonial: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-2 rounded-xl border border-[#E9ECEF] bg-white text-[#212529] focus:outline-none focus:ring-2 focus:ring-[#40B2A4] focus:border-transparent resize-none"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-[#E9ECEF]">
                  <button
                    onClick={() => {
                      setShowAdd(false);
                      setEditingItem(null);
                      resetForm();
                    }}
                    className="px-6 py-2 rounded-xl border border-[#E9ECEF] text-[#6C757D] hover:bg-[#E9ECEF] transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => {
                      if (editingItem) {
                        updateLaureat.mutate({ id: editingItem.id, updates: form });
                      } else {
                        addLaureat.mutate();
                      }
                    }}
                    disabled={addLaureat.isPending || updateLaureat.isPending}
                    className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#24366E] to-[#40B2A4] text-white hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    <Save size={16} />
                    {editingItem ? 'Mettre à jour' : 'Enregistrer'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filters and Search */}
        <div className="container py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="flex items-center gap-3 flex-1 max-w-md">
                <Search size={20} className="text-[#6C757D]" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Rechercher un lauréat..."
                  className="flex-1 px-4 py-2 rounded-xl border border-[#E9ECEF] bg-white text-[#212529] placeholder-[#6C757D] focus:outline-none focus:ring-2 focus:ring-[#40B2A4] focus:border-transparent"
                />
              </div>

              {/* Year Filters */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedYear(0)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    selectedYear === 0
                      ? 'bg-gradient-to-r from-[#40B2A4] to-[#24366E] text-white shadow-lg'
                      : 'bg-white text-[#6C757D] border border-[#E9ECEF] hover:border-[#40B2A4]/30'
                  }`}
                >
                  <Calendar size={16} />
                  Toutes
                </button>
                {YEARS.map((year) => (
                  <button
                    key={year.value}
                    onClick={() => setSelectedYear(year.value)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      selectedYear === year.value
                        ? 'bg-gradient-to-r from-[#40B2A4] to-[#24366E] text-white shadow-lg'
                        : 'bg-white text-[#6C757D] border border-[#E9ECEF] hover:border-[#40B2A4]/30'
                    }`}
                  >
                    <Calendar size={16} />
                    {year.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Laureats Grid */}
        <div className="container pb-8">
          {filteredLaureats.length === 0 ? (
            <motion.div 
              className="text-center py-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#40B2A4]/10 to-[#24366E]/10 border border-[#40B2A4]/20 flex items-center justify-center mx-auto mb-6">
                <Trophy size={40} className="text-[#40B2A4]" />
              </div>
              <p className="text-[#6C757D] max-w-md mx-auto">
                Aucun lauréat trouvé. Ajoutez des lauréats pour les afficher ici.
              </p>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLaureats.map((laureat, index) => {
                const rankConfig = getRankConfig(laureat.rank);
                const RankIcon = rankConfig.icon;
                
                return (
                  <motion.div
                    key={laureat.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="relative overflow-hidden rounded-2xl border border-[#E9ECEF] bg-white hover:border-[#40B2A4]/50 hover:shadow-xl hover:shadow-[#40B2A4]/10 transition-all duration-300"
                  >
                    {/* Rank Badge */}
                    <div className="absolute top-4 right-4 z-10">
                      <div 
                        className="flex items-center gap-1 px-3 py-1 rounded-full text-white text-xs font-bold shadow-lg"
                        style={{ backgroundColor: rankConfig.color }}
                      >
                        <RankIcon size={14} />
                        {rankConfig.label}
                      </div>
                    </div>
                    
                    {/* Photo */}
                    <div className="aspect-video bg-gradient-to-br from-[#F8F9FA] to-[#E9ECEF] relative overflow-hidden">
                      {laureat.photos && laureat.photos.length > 0 ? (
                        <img 
                          src={laureat.photos[0]} 
                          alt={laureat.team_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Image size={48} className="text-[#6C757D]" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="font-bold text-white text-lg" style={{ fontFamily: 'Sora, sans-serif' }}>
                          {laureat.team_name}
                        </h3>
                        <p className="text-white/80 text-sm">{laureat.project_name}</p>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      {/* Description */}
                      <p className="text-sm text-[#6C757D] line-clamp-2 mb-4" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                        {laureat.project_description}
                      </p>

                      {/* Prize */}
                      {laureat.prize && (
                        <div className="flex items-center gap-2 mb-3 p-2 rounded-lg bg-[#FEEB09]/10 border border-[#FEEB09]/30">
                          <Trophy size={16} className="text-[#B8860B]" />
                          <span className="text-sm font-medium text-[#B8860B]">{laureat.prize}</span>
                        </div>
                      )}

                      {/* Stats */}
                      {laureat.stats && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {laureat.stats.innovation_score && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#40B2A4]/10 text-[#40B2A4] text-xs">
                              <Star size={12} />
                              Innovation: {laureat.stats.innovation_score}/10
                            </span>
                          )}
                          {laureat.stats.technical_score && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#24366E]/10 text-[#24366E] text-xs">
                              <TrendingUp size={12} />
                              Tech: {laureat.stats.technical_score}/10
                            </span>
                          )}
                        </div>
                      )}

                      {/* Members */}
                      {laureat.members && laureat.members.length > 0 && (
                        <div className="flex items-center gap-2 mb-4">
                          <Users size={14} className="text-[#6C757D]" />
                          <div className="flex flex-wrap gap-1">
                            {laureat.members.map((m: any, i: number) => (
                              <span key={i} className="text-xs text-[#6C757D] bg-[#F8F9FA] px-2 py-1 rounded-full">
                                {m.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 pt-4 border-t border-[#E9ECEF]">
                        <button
                          onClick={() => handleEdit(laureat)}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#24366E]/10 text-[#24366E] hover:bg-[#24366E]/20 transition-colors text-sm font-medium"
                        >
                          <Edit3 size={14} />
                          Modifier
                        </button>
                        <button
                          onClick={() => deleteLaureat.mutate(laureat.id)}
                          className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default GestionLaureats;
