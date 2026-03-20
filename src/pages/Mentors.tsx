import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import { User, Briefcase, Award, Globe, Building } from "lucide-react";
import { motion } from "framer-motion";

const Mentors = () => {
  const { data: mentors, isLoading, error } = useQuery({
    queryKey: ["mentors"],
    queryFn: async () => {
      console.log("🔍 Récupération des mentors...");
      
      const { data, error } = await supabase.from("mentors").select("*").order("nom");
      
      console.log("📊 Résultat query mentors:", { data, error });
      console.log("🔍 Champs mentors:", data?.[0] ? Object.keys(data[0]) : "Aucun mentor");
      
      if (error) {
        console.error("❌ Erreur query mentors:", error);
        throw error;
      }
      
      console.log(`✅ ${data?.length || 0} mentors trouvés`);
      return data;
    },
  });

  const mentorsList = mentors?.filter((m) => m.type === 'mentor') || [];
  const juryList = mentors?.filter((m) => m.type === 'jury') || [];

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
                  <Award size={32} className="text-white" />
                </div>
                <h1 
                  className="font-display text-4xl sm:text-5xl font-bold text-[#212529]"
                  style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800 }}
                >
                  Mentors & Jury
                </h1>
              </div>
              <p 
                className="text-xl text-[#6C757D] mb-8"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                Les experts qui vous accompagnent
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-[#FF6B35] to-[#1E3A5F] mx-auto rounded-full"></div>
            </motion.div>
          </div>
        </div>

        <div className="container py-16">
          {/* Mentors Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-16"
          >
            <h2 
              className="font-display text-3xl font-bold text-[#212529] mb-8 text-center"
              style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700 }}
            >
              Nos Mentors
            </h2>
            
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="w-12 h-12 rounded-full border-4 border-[#1E3A5F] border-t-transparent animate-spin"></div>
              </div>
            ) : mentorsList.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {mentorsList.map((mentor, index) => (
                  <motion.div
                    key={mentor.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="group"
                  >
                    <div className="bg-white rounded-2xl border border-[#E9ECEF] shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                      {/* Photo */}
                      <div className="relative w-full pt-[85%] bg-gradient-to-br from-[#FF6B35]/10 to-[#1E3A5F]/10">
                        <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-t-2xl">
                          {mentor.photo_url ? (
                            <img 
                              src={mentor.photo_url} 
                              alt={mentor.nom}
                              className="w-full h-full object-cover object-center"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#FF6B35] to-[#1E3A5F] flex items-center justify-center">
                              <User size={32} className="text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Info */}
                      <div className="p-5">
                        <h3 
                          className="font-display text-lg font-bold text-[#212529] mb-2 group-hover:text-[#FF6B35] transition-colors"
                          style={{ fontFamily: 'Sora, sans-serif' }}
                        >
                          {mentor.nom}
                        </h3>
                        
                        {mentor.titre && (
                          <p 
                            className="text-sm font-medium text-[#1E3A5F] mb-3"
                            style={{ fontFamily: 'DM Sans, sans-serif' }}
                          >
                            {mentor.titre}
                          </p>
                        )}
                        
                        {/* Entreprise */}
                        {mentor.entreprise && (
                          <div className="flex items-center gap-2 mb-4">
                            <Building size={14} className="text-[#6C757D]" />
                            <span 
                              className="text-sm text-[#6C757D]"
                              style={{ fontFamily: 'DM Sans, sans-serif' }}
                            >
                              {mentor.entreprise}
                            </span>
                          </div>
                        )}
                        
                        {/* Footer */}
                        <div className="px-5 py-3 border-t border-[#E9ECEF] bg-[#F8F9FA]">
                          <div className="text-center">
                            <p 
                              className="text-xs text-[#6C757D]"
                              style={{ fontFamily: 'DM Sans, sans-serif' }}
                            >
                              Mentor
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-[#6C757D]">Aucun mentor disponible pour le moment</p>
              </div>
            )}
          </motion.div>

          {/* Jury Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2 
              className="font-display text-3xl font-bold text-[#212529] mb-8 text-center"
              style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700 }}
            >
              Notre Jury
            </h2>
            
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="w-12 h-12 rounded-full border-4 border-[#1E3A5F] border-t-transparent animate-spin"></div>
              </div>
            ) : juryList.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {juryList.map((jury, index) => (
                  <motion.div
                    key={jury.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="group"
                  >
                    <div className="bg-white rounded-2xl border border-[#E9ECEF] shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                      {/* Photo */}
                      <div className="relative w-full pt-[85%] bg-gradient-to-br from-[#1E3A5F]/10 to-[#FF6B35]/10">
                        <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-t-2xl">
                          {jury.photo_url ? (
                            <img 
                              src={jury.photo_url} 
                              alt={jury.nom}
                              className="w-full h-full object-cover object-center"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#1E3A5F] to-[#FF6B35] flex items-center justify-center">
                              <User size={32} className="text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Info */}
                      <div className="p-5">
                        <h3 
                          className="font-display text-lg font-bold text-[#212529] mb-2 group-hover:text-[#1E3A5F] transition-colors"
                          style={{ fontFamily: 'Sora, sans-serif' }}
                        >
                          {jury.nom}
                        </h3>
                        
                        {jury.titre && (
                          <p 
                            className="text-sm font-medium text-[#1E3A5F] mb-3"
                            style={{ fontFamily: 'DM Sans, sans-serif' }}
                          >
                            {jury.titre}
                          </p>
                        )}
                        
                        {/* Entreprise */}
                        {jury.entreprise && (
                          <div className="flex items-center gap-2 mb-4">
                            <Building size={14} className="text-[#6C757D]" />
                            <span 
                              className="text-sm text-[#6C757D]"
                              style={{ fontFamily: 'DM Sans, sans-serif' }}
                            >
                              {jury.entreprise}
                            </span>
                          </div>
                        )}
                        
                        {/* Footer */}
                        <div className="px-5 py-3 border-t border-[#E9ECEF] bg-[#F8F9FA]">
                          <div className="text-center">
                            <p 
                              className="text-xs text-[#6C757D]"
                              style={{ fontFamily: 'DM Sans, sans-serif' }}
                            >
                              Jury
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-[#6C757D]">Aucun membre du jury disponible pour le moment</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Mentors;
