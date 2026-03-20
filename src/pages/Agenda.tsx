import Layout from "@/components/layout/Layout";
import { Clock, MapPin, Calendar, Coffee, Code, Trophy, Users, Award, Target, Rocket } from "lucide-react";
import { motion } from "framer-motion";

const Agenda = () => {
  // Programme statique complet du hackathon
  const agendaData = {
    jour1: {
      titre: "Jour 1 – Vendredi",
      date: "08h–18h",
      evenements: [
        { heure: "08h–09h", titre: "Petit-déjeuner", icone: Coffee, type: "meal" },
        { heure: "09h–09h10", titre: "Présentation du Club ISOC ESMT", icone: Users, type: "presentation" },
        { heure: "09h10–09h20", titre: "Mot du Président du Club ISOC & du Président de l'AEESMT", icone: Award, type: "keynote" },
        { heure: "09h20–09h40", titre: "Présentation du hackathon (objectifs, règles) & attribution des mentors", icone: Target, type: "presentation" },
        { heure: "09h40–10h00", titre: "Présentation des outils du hackathon", icone: Code, type: "workshop" },
        { heure: "10h–12h", titre: "Début du développement", icone: Rocket, type: "development" },
        { heure: "12h–13h", titre: "Déjeuner", icone: Coffee, type: "meal" },
        { heure: "13h–15h", titre: "Phase de développement", icone: Rocket, type: "development" },
        { heure: "15h–16h", titre: "Goûter", icone: Coffee, type: "meal" },
        { heure: "16h–18h", titre: "Phase de développement", icone: Rocket, type: "development" }
      ]
    },
    jour2: {
      titre: "Jour 2 – Samedi",
      date: "08h–18h",
      evenements: [
        { heure: "08h–09h", titre: "Petit-déjeuner", icone: Coffee, type: "meal" },
        { heure: "09h–12h", titre: "Phase de développement", icone: Rocket, type: "development" },
        { heure: "12h–13h", titre: "Déjeuner", icone: Coffee, type: "meal" },
        { heure: "13h–15h", titre: "Préparation des pitch", icone: Target, type: "workshop" },
        { heure: "15h–17h", titre: "Pitch final (5 minutes par équipe)", icone: Trophy, type: "presentation" },
        { heure: "17h–17h30", titre: "Délibération du jury", icone: Users, type: "jury" },
        { heure: "17h30–18h", titre: "Remise des prix & cérémonie de clôture", icone: Award, type: "keynote" }
      ]
    },
    apresHackathon: {
      titre: "Après le hackathon",
      sousTitre: "Phase post-événement",
      evenements: [
        { titre: "Publication des résultats officiels", icone: Trophy },
        { titre: "Diffusion de la vidéo récapitulative", icone: Code },
        { titre: "Mise en place de l'équipe de suivi et d'accompagnement", icone: Users },
        { titre: "Démarrage du programme d'accompagnement", icone: Rocket },
        { titre: "Rédaction et partage du rapport final aux partenaires", icone: Target }
      ]
    }
  };

  const getEventTypeColor = (type?: string) => {
    switch (type) {
      case 'keynote': return 'from-[#FF6B35] to-[#FF8C42]';
      case 'workshop': return 'from-[#1E3A5F] to-[#2C5282]';
      case 'development': return 'from-[#FF8C42] to-[#FFA947]';
      case 'presentation': return 'from-[#FF6B35] to-[#1E3A5F]';
      case 'jury': return 'from-[#1E3A5F] to-[#FF6B35]';
      case 'meal': return 'from-[#6C757D] to-[#8B4513]';
      default: return 'from-[#FF6B35] to-[#1E3A5F]';
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
                  Agenda Complet
                </h1>
              </div>
              <p 
                className="text-xl text-[#6C757D] mb-8"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                Programme détaillé du Hackathon ISOC-ESMT 2026 — 17 & 18 Avril
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-[#FF6B35] to-[#1E3A5F] mx-auto rounded-full"></div>
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="container py-12">
          <div className="max-w-6xl mx-auto space-y-16">
            
            {/* Jour 1 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="bg-white rounded-3xl border border-[#E9ECEF] shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 
                        className="font-display text-2xl font-bold mb-2"
                        style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700 }}
                      >
                        {agendaData.jour1.titre}
                      </h2>
                      <p className="text-white/90 font-medium">{agendaData.jour1.date}</p>
                    </div>
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                      <Calendar size={32} className="text-white" />
                    </div>
                  </div>
                </div>

                {/* Events */}
                <div className="p-6 space-y-4">
                  {agendaData.jour1.evenements.map((event, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 * index }}
                      className="flex gap-4 group"
                    >
                      {/* Time */}
                      <div className="flex-shrink-0 w-24 text-sm font-semibold text-[#6C757D] pt-2">
                        {event.heure}
                      </div>
                      
                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${getEventTypeColor(event.type)} flex items-center justify-center flex-shrink-0`}>
                        <event.icone size={20} className="text-white" />
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 bg-[#F8F9FA] rounded-xl p-4 border border-[#E9ECEF] group-hover:border-[#FF6B35]/30 transition-colors">
                        <h3 
                          className="font-semibold text-[#212529]"
                          style={{ fontFamily: 'DM Sans, sans-serif' }}
                        >
                          {event.titre}
                        </h3>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Jour 2 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="bg-white rounded-3xl border border-[#E9ECEF] shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#1E3A5F] to-[#2C5282] p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 
                        className="font-display text-2xl font-bold mb-2"
                        style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700 }}
                      >
                        {agendaData.jour2.titre}
                      </h2>
                      <p className="text-white/90 font-medium">{agendaData.jour2.date}</p>
                    </div>
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                      <Trophy size={32} className="text-white" />
                    </div>
                  </div>
                </div>

                {/* Events */}
                <div className="p-6 space-y-4">
                  {agendaData.jour2.evenements.map((event, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 * index }}
                      className="flex gap-4 group"
                    >
                      {/* Time */}
                      <div className="flex-shrink-0 w-24 text-sm font-semibold text-[#6C757D] pt-2">
                        {event.heure}
                      </div>
                      
                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${getEventTypeColor(event.type)} flex items-center justify-center flex-shrink-0`}>
                        <event.icone size={20} className="text-white" />
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 bg-[#F8F9FA] rounded-xl p-4 border border-[#E9ECEF] group-hover:border-[#1E3A5F]/30 transition-colors">
                        <h3 
                          className="font-semibold text-[#212529]"
                          style={{ fontFamily: 'DM Sans, sans-serif' }}
                        >
                          {event.titre}
                        </h3>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Après le hackathon */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="bg-white rounded-3xl border border-[#E9ECEF] shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#FF8C42] to-[#FFA947] p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 
                        className="font-display text-2xl font-bold mb-2"
                        style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700 }}
                      >
                        {agendaData.apresHackathon.titre}
                      </h2>
                      <p className="text-white/90 font-medium">{agendaData.apresHackathon.sousTitre}</p>
                    </div>
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                      <Rocket size={32} className="text-white" />
                    </div>
                  </div>
                </div>

                {/* Events */}
                <div className="p-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    {agendaData.apresHackathon.evenements.map((event, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.1 * index }}
                        className="flex gap-4 bg-[#F8F9FA] rounded-xl p-4 border border-[#E9ECEF] hover:border-[#FF8C42]/30 transition-colors"
                      >
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#FF8C42] to-[#FFA947] flex items-center justify-center flex-shrink-0">
                          <event.icone size={20} className="text-white" />
                        </div>
                        <h3 
                          className="font-semibold text-[#212529]"
                          style={{ fontFamily: 'DM Sans, sans-serif' }}
                        >
                          {event.titre}
                        </h3>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Agenda;
