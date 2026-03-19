import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import { User, Briefcase, Award, Twitter, Linkedin, Globe, Mail } from "lucide-react";
import { motion } from "framer-motion";

const Mentors = () => {
  const { data: mentors, isLoading } = useQuery({
    queryKey: ["mentors"],
    queryFn: async () => {
      const { data, error } = await supabase.from("mentors").select("*").order("nom");
      if (error) throw error;
      return data;
    },
  });

  const mentorsList = mentors?.filter((m) => m.type === 'mentor') || [];
  const juryList = mentors?.filter((m) => m.type === 'jury') || [];

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
                  <Award size={32} className="text-[#F9FAFB]" />
                </div>
                <h1 
                  className="font-display text-4xl sm:text-5xl font-bold text-[#F9FAFB]"
                  style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800 }}
                >
                  Mentors & Jury
                </h1>
              </div>
              <p 
                className="text-xl text-[#9CA3AF] mb-8"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                Les experts qui vous accompagneront
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
                  Chargement des mentors...
                </p>
              </div>
            </div>
          ) : (
            <motion.div 
              className="space-y-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {/* Mentors Section */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <div className="mb-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#00873E] to-[#FBBF24] flex items-center justify-center">
                      <User size={24} className="text-[#F9FAFB]" />
                    </div>
                    <h2 
                      className="font-display text-3xl font-bold text-[#F9FAFB]"
                      style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700 }}
                    >
                      Mentors
                    </h2>
                  </div>
                  <p 
                    className="text-lg text-[#9CA3AF] mb-8"
                    style={{ fontFamily: 'DM Sans, sans-serif' }}
                  >
                    Experts qui guideront votre projet
                  </p>
                  <div className="w-16 h-1 bg-gradient-to-r from-[#00873E] to-[#FBBF24] rounded-full"></div>
                </div>
                
                {mentorsList.length === 0 ? (
                  <motion.div 
                    className="text-center py-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="w-20 h-20 rounded-full bg-[#1F2937] flex items-center justify-center mx-auto mb-6">
                      <User size={40} className="text-[#9CA3AF]" />
                    </div>
                    <p 
                      className="text-[#9CA3AF]"
                      style={{ fontFamily: 'DM Sans, sans-serif' }}
                    >
                      Mentors bientôt disponibles
                    </p>
                  </motion.div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {mentorsList.map((mentor, index) => (
                      <motion.div
                        key={mentor.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 * index }}
                        className="group"
                      >
                        <div className="relative overflow-hidden rounded-2xl border border-[#2D3748] bg-[#111827] transition-all duration-300 hover:border-[#FBBF24]/50 hover:shadow-xl hover:shadow-[#FBBF24]/10">
                          {/* Photo */}
                          <div className="relative h-48 overflow-hidden">
                            {mentor.photo_url ? (
                              <img 
                                src={mentor.photo_url} 
                                alt={mentor.nom} 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-[#00873E]/20 to-[#FBBF24]/20 flex items-center justify-center">
                                <User size={48} className="text-[#9CA3AF]" />
                              </div>
                            )}
                            
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            
                            {/* Expertise Badge */}
                            {mentor.expertise && (
                              <div className="absolute top-4 right-4">
                                <span className="px-3 py-1 rounded-full bg-[#00873E]/90 text-[#F9FAFB] text-xs font-bold backdrop-blur-sm">
                                  {mentor.expertise}
                                </span>
                              </div>
                            )}
                          </div>
                          
                          {/* Info */}
                          <div className="p-6">
                            <h3 
                              className="font-display text-lg font-bold text-[#F9FAFB] mb-2 group-hover:text-[#FBBF24] transition-colors"
                              style={{ fontFamily: 'Sora, sans-serif' }}
                            >
                              {mentor.nom}
                            </h3>
                            
                            {mentor.titre && (
                              <p 
                                className="text-sm font-medium text-[#FBBF24] mb-3"
                                style={{ fontFamily: 'DM Sans, sans-serif' }}
                              >
                                {mentor.titre}
                              </p>
                            )}
                            
                            {mentor.entreprise && (
                              <div className="flex items-center gap-2 mb-4">
                                <Briefcase size={14} className="text-[#9CA3AF]" />
                                <span 
                                  className="text-sm text-[#9CA3AF]"
                                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                                >
                                  {mentor.entreprise}
                                </span>
                              </div>
                            )}
                            
                            {/* Social Links */}
                            <div className="flex gap-3">
                              {mentor.email && (
                                <a 
                                  href={`mailto:${mentor.email}`}
                                  className="w-8 h-8 rounded-full bg-[#1F2937] flex items-center justify-center hover:bg-[#00873E]/20 transition-colors"
                                >
                                  <Mail size={14} className="text-[#9CA3AF] hover:text-[#00873E] transition-colors" />
                                </a>
                              )}
                              {mentor.linkedin && (
                                <a 
                                  href={mentor.linkedin}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-8 h-8 rounded-full bg-[#1F2937] flex items-center justify-center hover:bg-[#0077B5]/20 transition-colors"
                                >
                                  <Linkedin size={14} className="text-[#9CA3AF] hover:text-[#0077B5] transition-colors" />
                                </a>
                              )}
                              {mentor.twitter && (
                                <a 
                                  href={mentor.twitter}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-8 h-8 rounded-full bg-[#1F2937] flex items-center justify-center hover:bg-[#1DA1F2]/20 transition-colors"
                                >
                                  <Twitter size={14} className="text-[#9CA3AF] hover:text-[#1DA1F2] transition-colors" />
                                </a>
                              )}
                            </div>
                          </div>
                          
                          {/* Hover Effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-[#00873E]/5 via-transparent to-[#FBBF24]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Jury Section */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <div className="mb-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#FBBF24] to-[#00873E] flex items-center justify-center">
                      <Award size={24} className="text-[#F9FAFB]" />
                    </div>
                    <h2 
                      className="font-display text-3xl font-bold text-[#F9FAFB]"
                      style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700 }}
                    >
                      Jury
                    </h2>
                  </div>
                  <p 
                    className="text-lg text-[#9CA3AF] mb-8"
                    style={{ fontFamily: 'DM Sans, sans-serif' }}
                  >
                    Experts qui évalueront vos projets
                  </p>
                  <div className="w-16 h-1 bg-gradient-to-r from-[#FBBF24] to-[#00873E] rounded-full"></div>
                </div>
                
                {juryList.length === 0 ? (
                  <motion.div 
                    className="text-center py-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="w-20 h-20 rounded-full bg-[#1F2937] flex items-center justify-center mx-auto mb-6">
                      <Award size={40} className="text-[#9CA3AF]" />
                    </div>
                    <p 
                      className="text-[#9CA3AF]"
                      style={{ fontFamily: 'DM Sans, sans-serif' }}
                    >
                      Jury bientôt disponible
                    </p>
                  </motion.div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {juryList.map((jury, index) => (
                      <motion.div
                        key={jury.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 * index }}
                        className="group"
                      >
                        <div className="relative overflow-hidden rounded-2xl border border-[#2D3748] bg-[#111827] transition-all duration-300 hover:border-[#FBBF24]/50 hover:shadow-xl hover:shadow-[#FBBF24]/10">
                          {/* Photo */}
                          <div className="relative h-48 overflow-hidden">
                            {jury.photo_url ? (
                              <img 
                                src={jury.photo_url} 
                                alt={jury.nom} 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-[#FBBF24]/20 to-[#00873E]/20 flex items-center justify-center">
                                <Award size={48} className="text-[#9CA3AF]" />
                              </div>
                            )}
                            
                            {/* Jury Badge */}
                            <div className="absolute top-4 right-4">
                              <span className="px-3 py-1 rounded-full bg-[#FBBF24]/90 text-[#0A0A0A] text-xs font-bold backdrop-blur-sm">
                                JURY
                              </span>
                            </div>
                          </div>
                          
                          {/* Info */}
                          <div className="p-6">
                            <h3 
                              className="font-display text-lg font-bold text-[#F9FAFB] mb-2 group-hover:text-[#FBBF24] transition-colors"
                              style={{ fontFamily: 'Sora, sans-serif' }}
                            >
                              {jury.nom}
                            </h3>
                            
                            {jury.titre && (
                              <p 
                                className="text-sm font-medium text-[#FBBF24] mb-3"
                                style={{ fontFamily: 'DM Sans, sans-serif' }}
                              >
                                {jury.titre}
                              </p>
                            )}
                            
                            {jury.entreprise && (
                              <div className="flex items-center gap-2 mb-4">
                                <Briefcase size={14} className="text-[#9CA3AF]" />
                                <span 
                                  className="text-sm text-[#9CA3AF]"
                                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                                >
                                  {jury.entreprise}
                                </span>
                              </div>
                            )}
                            
                            {/* Social Links */}
                            <div className="flex gap-3">
                              {jury.email && (
                                <a 
                                  href={`mailto:${jury.email}`}
                                  className="w-8 h-8 rounded-full bg-[#1F2937] flex items-center justify-center hover:bg-[#00873E]/20 transition-colors"
                                >
                                  <Mail size={14} className="text-[#9CA3AF] hover:text-[#00873E] transition-colors" />
                                </a>
                              )}
                              {jury.linkedin && (
                                <a 
                                  href={jury.linkedin}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-8 h-8 rounded-full bg-[#1F2937] flex items-center justify-center hover:bg-[#0077B5]/20 transition-colors"
                                >
                                  <Linkedin size={14} className="text-[#9CA3AF] hover:text-[#0077B5] transition-colors" />
                                </a>
                              )}
                              {jury.website && (
                                <a 
                                  href={jury.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-8 h-8 rounded-full bg-[#1F2937] flex items-center justify-center hover:bg-[#FBBF24]/20 transition-colors"
                                >
                                  <Globe size={14} className="text-[#9CA3AF] hover:text-[#FBBF24] transition-colors" />
                                </a>
                              )}
                            </div>
                          </div>
                          
                          {/* Hover Effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-[#FBBF24]/5 via-transparent to-[#00873E]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Mentors;
