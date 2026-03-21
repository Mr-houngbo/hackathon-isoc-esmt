import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/layout/AdminLayout";
import { motion } from "framer-motion";
import { useState } from "react";
import { Search, Users, User, Mail, Phone, MapPin, GraduationCap, Briefcase, Calendar, Eye, FileText, Globe, Github, Linkedin, Twitter } from "lucide-react";

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

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E3A5F]"></div>
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
            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#1E3A5F]">{stats.total}</div>
                <div className="text-sm text-[#6C757D]">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#FF6B35]">{stats.individuelles}</div>
                <div className="text-sm text-[#6C757D]">Individus</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#10B981]">{stats.equipes}</div>
                <div className="text-sm text-[#6C757D]">Équipes</div>
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
                className="w-full pl-10 pr-4 py-2 border border-[#E9ECEF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F]"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterType('toutes')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterType === 'toutes' 
                    ? 'bg-[#1E3A5F] text-white' 
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
                    ? 'bg-[#FF6B35] text-white' 
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
                    ? 'bg-[#10B981] text-white' 
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
              <div className="bg-gradient-to-r from-[#1E3A5F] to-[#2C5282] p-6">
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
                      <FileText className="w-4 h-4 text-[#1E3A5F]" />
                      Nom du projet
                    </h3>
                    <p className="text-[#6C757D] leading-relaxed">{equipe.nom_projet}</p>
                  </div>
                )}

                {equipe.description_projet && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-[#212529] mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#1E3A5F]" />
                      Description du projet
                    </h3>
                    <p className="text-[#6C757D] leading-relaxed">{equipe.description_projet}</p>
                  </div>
                )}

                {equipe.technos && equipe.technos.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-[#212529] mb-2 flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-[#1E3A5F]" />
                      Technologies
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {equipe.technos.map((techno, idx) => (
                        <span 
                          key={idx}
                          className="px-3 py-1 bg-[#1E3A5F]/10 text-[#1E3A5F] rounded-full text-sm font-medium"
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
                      <Users className="w-4 h-4 text-[#1E3A5F]" />
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
              <div className="bg-gradient-to-r from-[#1E3A5F] to-[#2C5282] p-6 sticky top-0 z-10">
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
                {/* Contenu détaillé similaire à la carte principale */}
                {selectedEquipe.nom_projet && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-[#212529] mb-2">Nom du projet</h3>
                    <p className="text-[#6C757D] leading-relaxed">{selectedEquipe.nom_projet}</p>
                  </div>
                )}

                {selectedEquipe.description_projet && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-[#212529] mb-2">Description du projet</h3>
                    <p className="text-[#6C757D] leading-relaxed">{selectedEquipe.description_projet}</p>
                  </div>
                )}

                {selectedEquipe.technos && selectedEquipe.technos.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-[#212529] mb-2">Technologies</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedEquipe.technos.map((techno, idx) => (
                        <span key={idx} className="px-3 py-1 bg-[#1E3A5F]/10 text-[#1E3A5F] rounded-full text-sm font-medium">
                          {techno}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedEquipe.membres && selectedEquipe.membres.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-[#212529] mb-4">Membres ({selectedEquipe.membres.length})</h3>
                    <div className="space-y-4">
                      {selectedEquipe.membres.map((membre) => (
                        <div key={membre.id} className="bg-[#F8F9FA] rounded-lg p-4 border border-[#E9ECEF]">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="space-y-1">
                              <div className="font-medium text-[#212529]">{membre.nom_prenom}</div>
                              <div className="text-sm text-[#6C757D]">{membre.role_equipe}</div>
                            </div>
                            <div className="text-sm text-[#6C757D]">{membre.email}</div>
                            <div className="text-sm text-[#6C757D]">{membre.telephone}</div>
                            <div className="text-sm text-[#6C757D]">{membre.filiere}</div>
                            <div className="text-sm text-[#6C757D]">{membre.niveau_etudes}</div>
                            <div className="text-sm text-[#6C757D]">{membre.ecole}</div>
                            <div className="space-y-2">
                              {membre.linkedin && (
                                <a href={membre.linkedin} target="_blank" rel="noopener noreferrer" className="text-[#0A66C2] hover:text-[#0077B5] text-sm">
                                  LinkedIn
                                </a>
                              )}
                              {membre.github && (
                                <a href={membre.github} target="_blank" rel="noopener noreferrer" className="text-[#333] hover:text-[#000] text-sm">
                                  GitHub
                                </a>
                              )}
                              {membre.twitter && (
                                <a href={membre.twitter} target="_blank" rel="noopener noreferrer" className="text-[#1DA1F2] hover:text-[#0F1419] text-sm">
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
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default GestionInscriptions;
