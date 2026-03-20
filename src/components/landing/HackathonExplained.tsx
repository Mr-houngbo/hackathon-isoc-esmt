import { motion } from "framer-motion";
import { Code, Clock, Users, Lightbulb, Target, Zap } from "lucide-react";

const HackathonExplained = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-[#F8F9FA] to-white">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF6B35]/10 rounded-full mb-4">
            <Lightbulb className="text-[#FF6B35]" size={20} />
            <span 
              className="text-[#FF6B35] font-semibold text-sm"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              Comprendre le concept
            </span>
          </div>
          <h2 
            className="font-display text-4xl font-bold text-[#212529] mb-4"
            style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800 }}
          >
            C'est quoi, un hackathon ?
          </h2>
          <p 
            className="text-[#6C757D] text-lg max-w-3xl mx-auto text-justify"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            Plongez dans l'univers de l'innovation accélérée où la créativité rencontre la technologie
          </p>
        </motion.div>

        {/* Definition Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl border border-[#E9ECEF] p-8 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-[#FF6B35] to-[#1E3A5F] flex items-center justify-center">
                <Code className="text-white" size={32} />
              </div>
              <div>
                <h3 
                  className="font-display text-2xl font-bold text-[#212529]"
                  style={{ fontFamily: 'Sora, sans-serif' }}
                >
                  Définition
                </h3>
                <p 
                  className="text-[#FF6B35] font-semibold text-sm"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  Innovation en temps limité
                </p>
              </div>
            </div>
            <p 
              className="text-[#6C757D] leading-relaxed text-justify"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              Un hackathon est un événement intensif où des équipes développent des solutions innovantes 
              en un temps très court. Le mot "hackathon" vient de "hack" (solution créative) et "marathon" 
              (endurance). C'est une course contre la montre pour transformer des idées en prototypes fonctionnels !
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl border border-[#E9ECEF] p-8 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-[#FF6B35] to-[#1E3A5F] flex items-center justify-center">
                <Target className="text-white" size={32} />
              </div>
              <div>
                <h3 
                  className="font-display text-2xl font-bold text-[#212529]"
                  style={{ fontFamily: 'Sora, sans-serif' }}
                >
                  Objectif
                </h3>
                <p 
                  className="text-[#FF6B35] font-semibold text-sm"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
              Résoudre des problèmes réels
                </p>
              </div>
            </div>
            <p 
              className="text-[#6C757D] leading-relaxed text-justify"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              L'objectif n'est pas juste de coder, mais de créer de la valeur. Les équipes reçoivent 
              des défis concrets proposés par des partenaires et doivent imaginer, concevoir et développer 
              des solutions qui répondent à de vrais besoins du marché ou de la société.
            </p>
          </motion.div>
        </div>

        {/* Our Hackathon Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-[#FF6B35]/10 to-[#1E3A5F]/10 rounded-3xl p-8 md:p-12 border border-[#E9ECEF]"
        >
          <div className="text-center mb-12">
            <h3 
              className="font-display text-3xl font-bold text-[#212529] mb-4"
              style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800 }}
            >
              Et notre hackathon ISOC-ESMT ?
            </h3>
            <p 
              className="text-[#6C757D] text-lg max-w-3xl mx-auto text-justify"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              Une expérience unique organisée par l'ISOC-ESMT, ouverte à tous les étudiants avec une priorité pour ceux de l'École Supérieure Multinationale des Télécommunications
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-20 h-20 rounded-2xl bg-white mx-auto mb-4 flex items-center justify-center shadow-lg">
                <Users className="text-[#FF6B35]" size={40} />
              </div>
              <h4 
                className="font-display text-xl font-bold text-[#212529] mb-3"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                Équipes pluridisciplinaires
              </h4>
              <p 
                className="text-[#6C757D] leading-relaxed text-justify"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                Rassemblons les talents de toutes les filières et de tous établissements : tech, design, business, communication. 
                La diversité des profils et des origines est notre force pour créer des solutions complètes et innovantes.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-20 h-20 rounded-2xl bg-white mx-auto mb-4 flex items-center justify-center shadow-lg">
                <Zap className="text-[#1E3A5F]" size={40} />
              </div>
              <h4 
                className="font-display text-xl font-bold text-[#212529] mb-3"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                Thématiques partenaires
              </h4>
              <p 
                className="text-[#6C757D] leading-relaxed text-justify"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                Travaillez sur des défis réels proposés par nos partenaires. De l'innovation sociale 
                à la smart city, en passant par l'IA et la digitalisation des processus.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-20 h-20 rounded-2xl bg-white mx-auto mb-4 flex items-center justify-center shadow-lg">
                <Clock className="text-[#FF6B35]" size={40} />
              </div>
              <h4 
                className="font-display text-xl font-bold text-[#212529] mb-3"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                48h d'intensité
              </h4>
              <p 
                className="text-[#6C757D] leading-relaxed text-justify"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                Deux jours non-stop pour transformer une idée en prototype. Entre brainstorming, 
                développement, et pitch final, chaque minute compte !
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            viewport={{ once: true }}
            className="mt-12 text-center bg-white rounded-2xl p-6 shadow-lg"
          >
            <p 
              className="text-[#212529] font-semibold text-lg mb-2 text-justify"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              🚀 Le but ? Créer, innover, et peut-être... lancer le prochain projet qui va transformer l'avenir !
            </p>
            <p 
              className="text-[#6C757D] text-justify"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              Que vous soyez débutant ou expert, développeur ou créatif, il y a une place pour vous dans cette aventure.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HackathonExplained;
