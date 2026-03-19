import { motion } from "framer-motion";
import { Lightbulb, Trophy, Users, Rocket } from "lucide-react";

const reasons = [
  {
    icon: Lightbulb,
    title: "Innover ensemble",
    description: "Transformez vos idées en solutions concrètes pour améliorer la vie étudiante et le campus.",
    gradient: "from-[#00873E] to-[#006B31]"
  },
  {
    icon: Trophy,
    title: "Gagner des prix",
    description: "Jusqu'à 250 000 FCFA + 6 mois d'incubation pour les meilleurs projets.",
    gradient: "from-[#FBBF24] to-[#F59E0B]"
  },
  {
    icon: Users,
    title: "Réseau & Mentoring",
    description: "Accédez à des mentors experts et développez votre réseau professionnel.",
    gradient: "from-[#00873E] to-[#006B31]"
  },
  {
    icon: Rocket,
    title: "Lancer votre projet",
    description: "Passez du concept au prototype en 48h avec un accompagnement dédié.",
    gradient: "from-[#FBBF24] to-[#F59E0B]"
  },
];

const WhyParticipate = () => (
  <section className="py-24 bg-[#111827] relative overflow-hidden">
    {/* Background decoration */}
    <div className="absolute inset-0 bg-hero-gradient opacity-3"></div>
    
    <div className="container relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 
          className="font-display text-4xl sm:text-5xl font-bold text-[#F9FAFB] mb-4"
          style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800 }}
        >
          Pourquoi <span className="text-gradient">participer</span> ?
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-[#00873E] to-[#FBBF24] mx-auto rounded-full"></div>
        <p 
          className="mt-6 text-[#9CA3AF] max-w-2xl mx-auto text-lg"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          Une expérience unique pour développer vos compétences et porter vos idées.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {reasons.map((r, i) => (
          <motion.div
            key={r.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="card-premium group relative overflow-hidden rounded-2xl p-8"
          >
            {/* Gradient background on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${r.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
            
            {/* Icon container */}
            <div className="relative z-10 mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#00873E]/10 to-[#FBBF24]/10 border border-[#2D3748] group-hover:border-[#00873E]/50 transition-all duration-300">
              <r.icon className="h-8 w-8 text-[#FBBF24]" />
            </div>
            
            {/* Content */}
            <div className="relative z-10">
              <h3 
                className="font-display font-bold text-xl mb-3 text-[#F9FAFB] group-hover:text-[#00873E] transition-colors duration-300"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                {r.title}
              </h3>
              <p 
                className="text-sm text-[#9CA3AF] leading-relaxed"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                {r.description}
              </p>
            </div>
            
            {/* Decorative dot */}
            <div className="absolute top-4 right-4 w-2 h-2 bg-[#FBBF24] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyParticipate;
