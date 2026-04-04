import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { GlobeISoc } from "@/components/ui/GlobeISoc";
import {
  Lightbulb,
  Cpu,
  Users,
  Leaf,
  Globe,
  CalendarCheck,
  Utensils,
  QrCode,
  Monitor,
  FileCheck,
  Code,
  Shield,
  Sparkles,
  Target,
  Rocket,
  Trophy
} from "lucide-react";

interface Thematique {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  gradient: string;
}

const thematiques: Thematique[] = [
  {
    id: "innovation-sociale",
    title: "Innovation Sociale & Inclusion Numérique",
    description: "Développez des solutions qui réduisent la fracture numérique et rendent la technologie accessible à tous. Créez des outils pour les personnes en situation de handicap, les seniors, ou les populations marginalisées.",
    icon: Users,
    color: "#40B2A4",
    gradient: "from-[#40B2A4] to-[#24366E]"
  },
  {
    id: "smart-city",
    title: "Smart City & Développement Durable",
    description: "Concevez des solutions intelligentes pour des villes plus durables, éco-responsables et agréables à vivre. Optimisez la gestion des ressources et améliorez la qualité de vie urbaine.",
    icon: Leaf,
    color: "#40B2A4",
    gradient: "from-[#40B2A4] to-[#7E245C]"
  },
  {
    id: "services-publics-ia",
    title: "Services Publics & Intelligence Artificielle",
    description: "Révolutionnez l'administration publique avec l'IA. Automatisez les processus, améliorez l'accès aux services et créez des assistants intelligents pour les citoyens.",
    icon: Cpu,
    color: "#24366E",
    gradient: "from-[#24366E] to-[#40B2A4]"
  },
  {
    id: "pointage-esmt",
    title: "Système de Pointage Digital ESMT",
    description: "Créez un dispositif moderne et efficace pour le pointage des étudiants et du personnel à l'ESMT. Remplacez les méthodes papier par une solution digitale rapide et fiable.",
    icon: QrCode,
    color: "#7E245C",
    gradient: "from-[#7E245C] to-[#D25238]"
  },
  {
    id: "reservation-resto",
    title: "Réservation & Restauration Intelligente",
    description: "Éliminez les files d'attente au restaurant de l'ESMT ! Concevez un système de réservation de repas qui optimise le flux et améliore l'expérience utilisateur.",
    icon: Utensils,
    color: "#D25238",
    gradient: "from-[#D25238] to-[#7E245C]"
  },
  {
    id: "plateformes-numeriques",
    title: "Plateformes Numériques Communautaires",
    description: "Bâtissez des espaces numériques qui connectent la communauté ESMT. Facilitez les échanges, la collaboration et le partage de ressources entre étudiants.",
    icon: Globe,
    color: "#40B2A4",
    gradient: "from-[#40B2A4] to-[#D25238]"
  },
  {
    id: "site-web-esmt",
    title: "Redynamisation du Site Web ESMT",
    description: "Proposez une refonte complète et moderne du site web de l'ESMT. Améliorez l'expérience utilisateur, l'esthétique et les fonctionnalités pour valoriser l'image de l'école.",
    icon: Monitor,
    color: "#24366E",
    gradient: "from-[#24366E] to-[#7E245C]"
  },
  {
    id: "presence-numerique",
    title: "Liste de Présence Numérique",
    description: "Digitalisez le suivi de présence aux cours et événements. Créez une solution qui simplifie le travail des enseignants et donne des insights sur l'assiduité.",
    icon: FileCheck,
    color: "#7E245C",
    gradient: "from-[#7E245C] to-[#40B2A4]"
  },
  {
    id: "cybersecurite",
    title: "Cybersécurité & Protection des Données",
    description: "Développez des solutions pour protéger les données sensibles et sensibiliser à la cybersécurité. Créez des outils éducatifs ou des systèmes de protection innovants.",
    icon: Shield,
    color: "#24366E",
    gradient: "from-[#24366E] to-[#40B2A4]"
  },
  {
    id: "fintech",
    title: "FinTech & Inclusion Financière",
    description: "Imaginez des solutions financières innovantes pour les étudiants. Gestion de budget, micro-transactions, ou outils d'épargne collaborative.",
    icon: Target,
    color: "#40B2A4",
    gradient: "from-[#40B2A4] to-[#24366E]"
  },
  {
    id: "edtech",
    title: "EdTech & Apprentissage Innovant",
    description: "Transformez l'expérience d'apprentissage avec des outils pédagogiques innovants. Gamification, réalité augmentée, ou parcours personnalisés.",
    icon: Lightbulb,
    color: "#D25238",
    gradient: "from-[#D25238] to-[#24366E]"
  },
  {
    id: "sante-bien-etre",
    title: "Santé & Bien-être Digital",
    description: "Créez des applications qui promeuvent la santé mentale et physique des étudiants. Suivi du bien-être, méditation guidée, ou accompagnement santé.",
    icon: Sparkles,
    color: "#7E245C",
    gradient: "from-[#7E245C] to-[#40B2A4]"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

const Thematiques = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] to-white">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#40B2A4]/10 via-[#24366E]/5 to-transparent"></div>
          
          {/* Globe decorations */}
          <motion.div 
            className="absolute top-20 right-20"
            animate={{ y: [0, -15, 0], rotate: [0, 8, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <GlobeISoc size={80} opacity={0.15} />
          </motion.div>
          <motion.div 
            className="absolute bottom-20 left-20"
            animate={{ y: [0, -12, 0], rotate: [0, -6, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >
            <GlobeISoc size={60} opacity={0.12} />
          </motion.div>
          <motion.div 
            className="absolute top-1/2 right-1/4"
            animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          >
            <GlobeISoc size={40} opacity={0.1} />
          </motion.div>

          <div className="container relative z-10 py-20">
            <motion.div 
              className="text-center max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#40B2A4] to-[#24366E] flex items-center justify-center shadow-lg shadow-[#40B2A4]/30">
                  <Rocket size={32} className="text-white" />
                </div>
              </div>
              
              <h1 
                className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-[#212529] mb-6"
                style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800 }}
              >
                Thématiques du Hackathon
              </h1>
              
              <p 
                className="text-xl text-[#6C757D] mb-4 leading-relaxed"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                Choisissez votre terrain d'innovation parmi nos 12 thématiques soigneusement sélectionnées
              </p>
              
              <div className="flex items-center justify-center gap-2 text-[#40B2A4] font-medium">
                <Code size={20} />
                <span style={{ fontFamily: 'DM Sans, sans-serif' }}>
                  Innovation • Technologie • Impact
                </span>
              </div>

              <motion.div 
                className="mt-8 flex flex-wrap justify-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-[#E9ECEF]">
                  <Users size={18} className="text-[#40B2A4]" />
                  <span className="text-sm text-[#6C757D]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                    Par équipes de 3-5 personnes
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-[#E9ECEF]">
                  <CalendarCheck size={18} className="text-[#24366E]" />
                  <span className="text-sm text-[#6C757D]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                    48h pour innover
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-[#E9ECEF]">
                  <Trophy size={18} className="text-[#D25238]" />
                  <span className="text-sm text-[#6C757D]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                    Prix à gagner
                  </span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Thematiques Grid */}
        <div className="container py-16 relative">
          {/* Decorative elements */}
          <motion.div 
            className="absolute top-40 right-0 z-0"
            animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          >
            <GlobeISoc size={50} opacity={0.08} />
          </motion.div>
          <motion.div 
            className="absolute bottom-40 left-0 z-0"
            animate={{ y: [0, -6, 0], rotate: [0, -4, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          >
            <GlobeISoc size={45} opacity={0.06} />
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 xl:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {thematiques.map((thematique, index) => {
              const Icon = thematique.icon;
              return (
                <motion.div
                  key={thematique.id}
                  variants={itemVariants}
                  className="group"
                >
                  <div className="h-full bg-white rounded-3xl border border-[#E9ECEF] shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden hover:-translate-y-2">
                    {/* Header with gradient */}
                    <div className={`h-2 bg-gradient-to-r ${thematique.gradient}`}></div>
                    
                    <div className="p-8">
                      {/* Icon and title */}
                      <div className="flex items-start gap-4 mb-6">
                        <div 
                          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${thematique.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                        >
                          <Icon size={28} className="text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 
                            className="font-display text-xl font-bold text-[#212529] group-hover:text-[#40B2A4] transition-colors leading-tight"
                            style={{ fontFamily: 'Sora, sans-serif' }}
                          >
                            {thematique.title}
                          </h3>
                        </div>
                      </div>

                      {/* Description */}
                      <p 
                        className="text-[#6C757D] leading-relaxed"
                        style={{ fontFamily: 'DM Sans, sans-serif' }}
                      >
                        {thematique.description}
                      </p>
                    </div>

                    {/* Bottom accent */}
                    <div className={`h-1 bg-gradient-to-r ${thematique.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* CTA Section */}
          <motion.div 
            className="mt-20 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-gradient-to-r from-[#40B2A4]/10 via-[#24366E]/10 to-[#7E245C]/10 rounded-3xl p-12 border border-[#E9ECEF]">
              <h2 
                className="font-display text-3xl font-bold text-[#212529] mb-4"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                Prêt à relever le défi ?
              </h2>
              <p 
                className="text-[#6C757D] mb-8 max-w-2xl mx-auto"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                Constituez votre équipe, choisissez une thématique et inscrivez-vous dès maintenant pour participer au Hackathon ISOC-ESMT 2026
              </p>
              <a
                href="/inscription"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#40B2A4] to-[#24366E] text-white font-semibold px-8 py-4 rounded-xl hover:shadow-lg hover:shadow-[#40B2A4]/25 transition-all duration-300 hover:scale-105"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                <Rocket size={20} />
                S'inscrire maintenant
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Thematiques;
