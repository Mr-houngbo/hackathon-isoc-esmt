import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import { Clock, MapPin, Calendar, Coffee, Code, Trophy, Users } from "lucide-react";
import { motion } from "framer-motion";

const Agenda = () => {
  const { data: items, isLoading, error } = useQuery({
    queryKey: ["agenda"],
    queryFn: async () => {
      console.log("🔍 Récupération de l'agenda...");
      
      const { data, error } = await supabase.from("agenda").select("*").order("heure_debut");
      
      console.log("📊 Résultat query agenda:", { data, error });
      console.log("🔍 Champs agenda:", data?.[0] ? Object.keys(data[0]) : "Aucun événement");
      
      if (error) {
        console.error("❌ Erreur query agenda:", error);
        throw error;
      }
      
      console.log(`✅ ${data?.length || 0} événements trouvés`);
      return data;
    },
  });

  const getEventTypeIcon = (type?: string) => {
    switch (type) {
      case 'keynote': return Trophy;
      case 'workshop': return Code;
      case 'networking': return Users;
      default: return Coffee;
    }
  };

  const getEventTypeColor = (type?: string) => {
    switch (type) {
      case 'keynote': return 'text-[#FF6B35]';
      case 'workshop': return 'text-[#1E3A5F]';
      case 'networking': return 'text-[#FF8C42]';
      default: return 'text-[#6C757D]';
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] to-white">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B35]/5 via-[#1E3A5F]/5 to-transparent"></div>
          <div className="container relative z-10 py-16">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#FF6B35] to-[#1E3A5F] flex items-center justify-center">
                  <Calendar size={32} className="text-white" />
                </div>
                <h1 
                  className="font-display text-4xl sm:text-5xl font-bold text-[#212529]"
                  style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800 }}
                >
                  Agenda
                </h1>
              </div>
              <p 
                className="text-xl text-[#6C757D] mb-8"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                Programme complet du hackathon — 17 & 18 Avril 2026
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-[#FF6B35] to-[#1E3A5F] mx-auto rounded-full"></div>
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="container py-8">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full border-4 border-[#FF6B35] border-t-transparent animate-spin"></div>
                <p 
                  className="text-[#6C757D]"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  Chargement de l'agenda...
                </p>
              </div>
            </div>
          ) : !items || items.length === 0 ? (
            <motion.div 
              className="text-center py-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-24 h-24 rounded-full bg-[#F8F9FA] border border-[#E9ECEF] flex items-center justify-center mx-auto mb-6">
                <Calendar size={40} className="text-[#6C757D]" />
              </div>
              <h3 
                className="font-display text-xl font-bold text-[#212529] mb-2"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                Agenda en préparation
              </h3>
              <p 
                className="text-[#6C757D] max-w-md mx-auto"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                Le programme détaillé sera publié prochainement.
              </p>
            </motion.div>
          ) : (
            <motion.div 
              className="max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Timeline */}
              <div className="space-y-8">
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="relative group"
                  >
                    {/* Timeline line */}
                    <div className="absolute left-8 top-8 bottom-0 w-0.5 bg-gradient-to-b from-[#FF6B35] to-transparent"></div>
                    
                    <div className="flex gap-6">
                      {/* Time indicator */}
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#FF6B35]/10 to-[#1E3A5F]/10 border-2 border-[#FF6B35]/20 flex items-center justify-center group-hover:border-[#FF6B35]/40 transition-colors">
                          <Clock size={20} className={getEventTypeColor(item.type)} />
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 bg-white rounded-2xl border border-[#E9ECEF] p-6 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:border-[#FF6B35]/30">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-10 h-10 rounded-full bg-[#FF6B35]/10 flex items-center justify-center">
                                {(() => {
                                  const Icon = getEventTypeIcon(item.type);
                                  return <Icon size={20} className={getEventTypeColor(item.type)} />;
                                })()}
                              </div>
                              <h3 
                                className="font-display text-xl font-bold text-[#212529]"
                                style={{ fontFamily: 'Sora, sans-serif' }}
                              >
                                {item.titre}
                              </h3>
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-[#6C757D]">
                              <div className="flex items-center gap-1">
                                <Clock size={14} className="text-[#FF6B35]" />
                                <span style={{ fontFamily: 'Space Mono, monospace' }}>
                                  {item.heure_debut} - {item.heure_fin}
                                </span>
                              </div>
                              
                              {item.lieu && (
                                <div className="flex items-center gap-1">
                                  <MapPin size={14} className="text-[#FF6B35]" />
                                  <span>{item.lieu}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="px-3 py-1 rounded-full bg-[#1E3A5F]/10 text-[#1E3A5F] text-xs font-medium">
                            {item.type || 'session'}
                          </div>
                        </div>
                        
                        {item.description && (
                          <p 
                            className="text-[#6C757D] leading-relaxed"
                            style={{ fontFamily: 'DM Sans, sans-serif' }}
                          >
                            {item.description}
                          </p>
                        )}
                        
                        {item.intervenant && (
                          <div className="mt-4 pt-4 border-t border-[#E9ECEF]">
                            <div className="flex items-center gap-2">
                              <Users size={16} className="text-[#FF6B35]" />
                              <span className="text-sm font-medium text-[#212529]">
                                {item.intervenant}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Agenda;
