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
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FEEB09]/10 rounded-full mb-4">
            <Lightbulb className="text-[#FEEB09]" size={20} />
            <span 
              className="text-[#FEEB09] font-semibold text-sm"
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
        <div className="grid grid-cols-2 gap-2 sm:gap-4 md:grid-cols-2 lg:gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white rounded-lg sm:rounded-xl border border-[#E9ECEF] p-2 sm:p-3 lg:p-6 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center gap-1 sm:gap-3 mb-2 sm:mb-4">
              <div className="w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 rounded-lg sm:rounded-xl lg:rounded-2xl bg-gradient-to-r from-[#FEEB09] to-[#24366E] flex items-center justify-center">
                <Code className="text-white" size={16} />
              </div>
              <div>
                <h3 
                  className="font-display text-sm sm:text-lg lg:text-2xl font-bold text-[#212529]"
                  style={{ fontFamily: 'Sora, sans-serif' }}
                >
                  Définition
                </h3>
                <p 
                  className="text-[#FEEB09] font-semibold text-xs sm:text-sm"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  Innovation en temps limité
                </p>
              </div>
            </div>
            <p 
              className="text-[#6C757D] text-xs sm:text-sm lg:text-base leading-relaxed text-justify"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              Un hackathon est un événement intensif où des équipes développent des solutions innovantes en peu de temps. "Hack" (solution créative) + "marathon" (endurance) = course contre la montre pour transformer des idées en prototypes !
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="bg-white rounded-lg sm:rounded-xl border border-[#E9ECEF] p-2 sm:p-3 lg:p-6 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center gap-1 sm:gap-3 mb-2 sm:mb-4">
              <div className="w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 rounded-lg sm:rounded-xl lg:rounded-2xl bg-gradient-to-r from-[#FEEB09] to-[#24366E] flex items-center justify-center">
                <Target className="text-white" size={16} />
              </div>
              <div>
                <h3 
                  className="font-display text-sm sm:text-lg lg:text-2xl font-bold text-[#212529]"
                  style={{ fontFamily: 'Sora, sans-serif' }}
                >
                  Objectif
                </h3>
                <p 
                  className="text-[#FEEB09] font-semibold text-xs sm:text-sm"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
              Résoudre des problèmes réels
                </p>
              </div>
            </div>
            <p 
              className="text-[#6C757D] text-xs sm:text-sm lg:text-base leading-relaxed text-justify"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              L'objectif n'est pas juste de coder, mais de créer de la valeur. Les équipes reçoivent des défis concrets des partenaires et doivent imaginer, concevoir et développer des solutions qui répondent à de vrais besoins du marché.
            </p>
          </motion.div>
        </div>

        {/* Our Hackathon Section - Desktop only */}
        <div className="hidden md:block">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-[#FEEB09]/10 to-[#24366E]/10 rounded-2xl p-4 sm:p-6 lg:p-8 border border-[#E9ECEF]"
        >
          <div className="text-center mb-6 sm:mb-8">
            <h3 
              className="font-display text-3xl font-bold text-[#212529] mb-4"
              style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800 }}
            >
              Et notre hackathon ISOC-ESMT ?
            </h3>
            <p 
              className="text-[#6C757D] text-sm sm:text-base max-w-3xl mx-auto text-justify"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              Une expérience unique organisée par l'ISOC-ESMT, ouverte à tous les étudiants avec priorité pour ceux de l'ESMT.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-xl bg-white mx-auto mb-2 sm:mb-4 flex items-center justify-center shadow-lg">
                <Users className="text-[#FEEB09]" size={24} />
              </div>
              <h4 
                className="font-display text-sm sm:text-base lg:text-xl font-bold text-[#212529] mb-2"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                Équipes pluridisciplinaires
              </h4>
              <p 
                className="text-[#6C757D] text-xs sm:text-sm leading-relaxed text-justify"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                Rassemblons les talents de toutes les filières : tech, design, business, communication. La diversité des profils est notre force pour créer des solutions innovantes.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-xl bg-white mx-auto mb-2 sm:mb-4 flex items-center justify-center shadow-lg">
                <Zap className="text-[#24366E]" size={24} />
              </div>
              <h4 
                className="font-display text-sm sm:text-base lg:text-xl font-bold text-[#212529] mb-2"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                Thématiques partenaires
              </h4>
              <p 
                className="text-[#6C757D] text-xs sm:text-sm leading-relaxed text-justify"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                Travaillez sur des défis réels proposés par nos partenaires : innovation sociale, smart city, IA, et digitalisation des processus.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-xl bg-white mx-auto mb-2 sm:mb-4 flex items-center justify-center shadow-lg">
                <Clock className="text-[#FEEB09]" size={24} />
              </div>
              <h4 
                className="font-display text-sm sm:text-base lg:text-xl font-bold text-[#212529] mb-2"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                48h d'intensité
              </h4>
              <p 
                className="text-[#6C757D] text-xs sm:text-sm leading-relaxed text-justify"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                Deux jours non-stop pour transformer une idée en prototype. Brainstorming, développement, et pitch final : chaque minute compte !
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            viewport={{ once: true }}
            className="mt-6 sm:mt-8 text-center bg-white rounded-xl p-3 sm:p-4 lg:p-6 shadow-lg"
          >
            <p 
              className="text-[#212529] font-semibold text-sm sm:text-base mb-2 text-justify"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              🚀 Le but ? Créer, innover, et peut-être lancer le prochain projet qui va transformer l'avenir !
            </p>
            <p 
              className="text-[#6C757D] text-xs sm:text-sm text-justify"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              Que vous soyez débutant ou expert, développeur ou créatif, il y a une place pour vous dans cette aventure.
            </p>
          </motion.div>
        </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HackathonExplained;
