import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import { Clock, MapPin, Calendar, Coffee, Code, Trophy, Users } from "lucide-react";
import { motion } from "framer-motion";

const Agenda = () => {
  const { data: items, isLoading } = useQuery({
    queryKey: ["agenda"],
    queryFn: async () => {
      const { data, error } = await supabase.from("agenda").select("*").order("heure_debut");
      if (error) throw error;
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
      case 'keynote': return 'text-[#FBBF24]';
      case 'workshop': return 'text-[#00873E]';
      case 'networking': return 'text-[#F59E0B]';
      default: return 'text-[#9CA3AF]';
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-[#0A0A0A]">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00873E]/20 via-[#FBBF24]/10 to-[#0A0A0A]"></div>
          <div className="container relative z-10 py-16">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#FBBF24] to-[#00873E] flex items-center justify-center">
                  <Calendar size={32} className="text-[#F9FAFB]" />
                </div>
                <h1 
                  className="font-display text-4xl sm:text-5xl font-bold text-[#F9FAFB]"
                  style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800 }}
                >
                  Programme
                </h1>
              </div>
              <p 
                className="text-xl text-[#9CA3AF] mb-8"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                Hackathon ISOC-ESMT 2026 — 3 & 4 Avril
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-[#FBBF24] to-[#00873E] mx-auto rounded-full"></div>
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="container py-8">
          {/* Loading State */}
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full border-4 border-[#FBBF24] border-t-transparent animate-spin"></div>
                <p 
                  className="text-[#9CA3AF]"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  Chargement du programme...
                </p>
              </div>
            </div>
          ) : (
            <motion.div 
              className="space-y-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {[1, 2].map((jour, jourIndex) => {
                const dayItems = items?.filter((i) => i.jour === jour) || [];
                const jourTitle = jour === 1 ? "3 Avril — Idéation" : "4 Avril — Pitch";
                const jourDate = jour === 1 ? "Premier jour" : "Second jour";
                
                return (
                  <motion.div
                    key={jour}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 + jourIndex * 0.2 }}
                  >
                    {/* Day Header */}
                    <div className="mb-8">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#FBBF24] to-[#00873E] flex items-center justify-center">
                          <span 
                            className="font-bold text-[#F9FAFB] text-lg"
                            style={{ fontFamily: 'Sora, sans-serif' }}
                          >
                            J{jour}
                          </span>
                        </div>
                        <div>
                          <h2 
                            className="font-display text-2xl font-bold text-[#F9FAFB]"
                            style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700 }}
                          >
                            {jourTitle}
                          </h2>
                          <p 
                            className="text-sm text-[#9CA3AF]"
                            style={{ fontFamily: 'DM Sans, sans-serif' }}
                          >
                            {jourDate}
                          </p>
                        </div>
                      </div>
                      <div className="w-full h-px bg-gradient-to-r from-transparent via-[#2D3748] to-transparent"></div>
                    </div>

                    {/* Day Events */}
                    {dayItems.length === 0 ? (
                      <motion.div 
                        className="text-center py-12"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        <div className="w-16 h-16 rounded-full bg-[#1F2937] flex items-center justify-center mx-auto mb-4">
                          <Calendar size={32} className="text-[#9CA3AF]" />
                        </div>
                        <p 
                          className="text-[#9CA3AF]"
                          style={{ fontFamily: 'DM Sans, sans-serif' }}
                        >
                          Programme du jour {jour} à venir
                        </p>
                      </motion.div>
                    ) : (
                      <div className="space-y-4">
                        {dayItems.map((item, index) => {
                          const Icon = getEventTypeIcon(item.type);
                          const iconColor = getEventTypeColor(item.type);
                          
                          return (
                            <motion.div
                              key={item.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.5, delay: 0.1 * index }}
                              className="group"
                            >
                              <div className="relative overflow-hidden rounded-2xl border border-[#2D3748] bg-[#111827] transition-all duration-300 hover:border-[#FBBF24]/50 hover:shadow-xl hover:shadow-[#FBBF24]/10">
                                {/* Timeline */}
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#2D3748]">
                                  <div className="absolute top-8 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#00873E] border-2 border-[#0A0A0A]"></div>
                                </div>
                                
                                {/* Content */}
                                <div className="pl-8">
                                  <div className="flex gap-6 p-6">
                                    {/* Time */}
                                    <div className="min-w-[100px]">
                                      <div className="flex items-center gap-2 text-sm font-medium text-[#FBBF24]">
                                        <Clock size={16} />
                                        <span 
                                          style={{ fontFamily: 'DM Sans, sans-serif' }}
                                        >
                                          {item.heure_debut}
                                        </span>
                                      </div>
                                      {item.heure_fin && (
                                        <div className="text-xs text-[#9CA3AF] ml-6">
                                          → {item.heure_fin}
                                        </div>
                                      )}
                                    </div>
                                    
                                    {/* Event Details */}
                                    <div className="flex-1">
                                      <div className="flex items-center gap-3 mb-2">
                                        <div className="w-8 h-8 rounded-lg bg-[#1F2937] flex items-center justify-center">
                                          <Icon size={16} className={iconColor} />
                                        </div>
                                        <h3 
                                          className="font-display text-lg font-bold text-[#F9FAFB] group-hover:text-[#FBBF24] transition-colors"
                                          style={{ fontFamily: 'Sora, sans-serif' }}
                                        >
                                          {item.titre}
                                        </h3>
                                      </div>
                                      
                                      {item.description && (
                                        <p 
                                          className="text-sm text-[#9CA3AF] leading-relaxed mb-3"
                                          style={{ fontFamily: 'DM Sans, sans-serif' }}
                                        >
                                          {item.description}
                                        </p>
                                      )}
                                      
                                      {/* Location */}
                                      {item.lieu && (
                                        <div className="flex items-center gap-2">
                                          <MapPin size={14} className="text-[#9CA3AF]" />
                                          <span 
                                            className="text-sm text-[#9CA3AF]"
                                            style={{ fontFamily: 'DM Sans, sans-serif' }}
                                          >
                                            {item.lieu}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Hover Effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-[#00873E]/5 via-transparent to-[#FBBF24]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Agenda;
