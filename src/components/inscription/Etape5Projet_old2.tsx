import { motion } from "framer-motion";
import { InscriptionData } from "@/types/inscription";
import { Lightbulb, HelpCircle, Brain, Code, Zap, Rocket, CheckCircle } from "lucide-react";

interface Props {
  data: InscriptionData;
  onChange: (d: Partial<InscriptionData>) => void;
}

const domaines = [
  { value: 'Vie étudiante', label: 'Vie étudiante', icon: Code, color: 'text-[#00873E]' },
  { value: 'Administration', label: 'Administration', icon: Code, color: 'text-[#FBBF24]' },
  { value: 'Pédagogie', label: 'Pédagogie', icon: Code, color: 'text-[#00873E]' },
  { value: 'Campus', label: 'Campus', icon: Code, color: 'text-[#FBBF24]' },
  { value: 'Autre', label: 'Autre', icon: Code, color: 'text-[#9CA3AF]' }
];

const niveauxAvancement = [
  { value: 'concept', label: 'Concept', desc: 'Idée sur papier', icon: Lightbulb },
  { value: 'esquisse', label: 'Esquisse', desc: 'Maquettes/Wireframes', icon: Code },
  { value: 'prototype', label: 'Prototype', desc: 'Version fonctionnelle', icon: Zap }
];

const Etape5Projet = ({ data, onChange }: Props) => {
  const wordCount = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#00873E] to-[#FBBF24] flex items-center justify-center">
            <Lightbulb size={24} className="text-[#F9FAFB]" />
          </div>
          <h3 
            className="font-display text-2xl font-bold text-[#F9FAFB]"
            style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700 }}
          >
            Votre projet
          </h3>
        </div>
        <p 
          className="text-[#9CA3AF] text-lg"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          Décrivez votre idée de projet
        </p>
        <div className="w-16 h-1 bg-gradient-to-r from-[#00873E] to-[#FBBF24] mx-auto rounded-full mt-4"></div>
      </motion.div>

      {/* Project Status */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <label 
          className="block text-sm font-semibold text-[#F9FAFB] mb-4"
          style={{ fontFamily: 'Sora, sans-serif' }}
        >
          Avez-vous un projet ? <span className="text-[#DC2626]">*</span>
        </label>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { value: 'oui', icon: Lightbulb, label: 'Oui', desc: 'J\'ai une idée précise', color: 'text-[#00873E]' },
            { value: 'non', icon: HelpCircle, label: 'Non', desc: 'Pas encore d\'idée', color: 'text-[#9CA3AF]' },
            { value: 'en_reflexion', icon: Brain, label: 'En réflexion', desc: 'J\'y réfléchis encore', color: 'text-[#FBBF24]' },
          ].map((opt, index) => (
            <motion.button 
              key={opt.value} 
              type="button" 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }} 
              whileTap={{ scale: 0.98 }}
              onClick={() => onChange({ a_projet: opt.value })}
              className={`relative overflow-hidden rounded-xl border-2 p-6 transition-all duration-300 group ${
                data.a_projet === opt.value 
                  ? 'border-[#00873E] bg-[#00873E]/10 shadow-lg shadow-[#00873E]/25' 
                  : 'border-[#2D3748] bg-[#111827] hover:border-[#00873E]/50'
              }`}
            >
              {/* Background decoration */}
              <div className={`absolute inset-0 bg-gradient-to-br ${
                data.a_projet === opt.value ? 'from-[#00873E]/5 to-[#FBBF24]/5' : 'from-transparent to-transparent'
              } group-hover:from-[#00873E]/3 group-hover:to-[#FBBF24]/3 transition-all duration-300`}></div>
              
              {/* Content */}
              <div className="relative z-10 flex flex-col items-center gap-3">
                <opt.icon size={32} className={data.a_projet === opt.value ? 'text-[#00873E]' : opt.color} />
                <span 
                  className={`font-display font-bold text-lg ${
                    data.a_projet === opt.value ? 'text-[#F9FAFB]' : 'text-[#9CA3AF] group-hover:text-[#F9FAFB]'
                  }`}
                  style={{ fontFamily: 'Sora, sans-serif' }}
                >
                  {opt.label}
                </span>
                <span 
                  className="text-xs text-center"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  {opt.desc}
                </span>
              </div>
              
              {/* Selection indicator */}
              {data.a_projet === opt.value && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="absolute top-3 right-3 w-6 h-6 bg-[#FBBF24] rounded-full flex items-center justify-center"
                >
                  <CheckCircle size={16} className="text-[#0A0A0A]" />
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Project Details - Conditional */}
      {data.a_projet === 'oui' && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.5 }}
          className="space-y-6 card-premium p-8"
        >
          <div className="grid sm:grid-cols-2 gap-6">
            {/* Nom du projet */}
            <div className="sm:col-span-2">
              <label 
                className="block text-sm font-semibold text-[#F9FAFB] mb-3"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                Nom du projet
              </label>
              <input 
                type="text" 
                value={data.nom_projet} 
                onChange={(e) => onChange({ nom_projet: e.target.value })}
                placeholder="Ex: SmartCampus"
                className="w-full rounded-xl border-[#2D3748] bg-[#1F2937] px-4 py-3 text-[#F9FAFB] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#FBBF24] focus:border-transparent transition-all duration-300"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              />
            </div>
            
            {/* Domaine */}
            <div>
              <label 
                className="block text-sm font-semibold text-[#F9FAFB] mb-3"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                Domaine
              </label>
              <select 
                value={data.domaine_projet} 
                onChange={(e) => onChange({ domaine_projet: e.target.value })}
                className="w-full rounded-xl border-[#2D3748] bg-[#1F2937] px-4 py-3 text-[#F9FAFB] focus:outline-none focus:ring-2 focus:ring-[#FBBF24] focus:border-transparent transition-all duration-300"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                <option value="">Sélectionner</option>
                {domaines.map((d) => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>
      )}

      {/* Problématique - Always visible */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <label 
          className="block text-sm font-semibold text-[#F9FAFB] mb-3"
          style={{ fontFamily: 'Sora, sans-serif' }}
        >
          Problématique <span className="text-[#DC2626]">*</span>
        </label>
        <textarea 
          value={data.problematique} 
          onChange={(e) => onChange({ problematique: e.target.value })}
          rows={4} 
          placeholder="Quel problème souhaitez-vous résoudre ? Soyez précis..."
          className="w-full rounded-xl border-[#2D3748] bg-[#1F2937] px-4 py-3 text-[#F9FAFB] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#FBBF24] focus:border-transparent transition-all duration-300 resize-none"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        />
      </motion.div>

      {/* Solution proposée */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <label 
          className="block text-sm font-semibold text-[#F9FAFB] mb-3"
          style={{ fontFamily: 'Sora, sans-serif' }}
        >
          Solution proposée
        </label>
        <textarea 
          value={data.solution} 
          onChange={(e) => {
            if (wordCount(e.target.value) <= 150) onChange({ solution: e.target.value });
          }}
          rows={4} 
          placeholder="Décrivez votre solution en quelques mots..."
          className="w-full rounded-xl border-[#2D3748] bg-[#1F2937] px-4 py-3 text-[#F9FAFB] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#FBBF24] focus:border-transparent transition-all duration-300 resize-none"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        />
        <div className="flex items-center justify-between mt-2">
          <p 
            className="text-xs text-[#9CA3AF]"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            {wordCount(data.solution)}/150 mots
          </p>
          {wordCount(data.solution) >= 140 && (
            <p 
              className="text-xs text-[#FBBF24]"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              Limite approchée
            </p>
          )}
        </div>
      </motion.div>

      {/* Advanced Project Details - Conditional */}
      {data.a_projet === 'oui' && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Technologies */}
          <div>
            <label 
              className="block text-sm font-semibold text-[#F9FAFB] mb-3"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              Technologies envisagées
            </label>
            <input 
              type="text" 
              value={data.technologies} 
              onChange={(e) => onChange({ technologies: e.target.value })}
              placeholder="Ex: React, Python, Arduino, Firebase..."
              className="w-full rounded-xl border-[#2D3748] bg-[#1F2937] px-4 py-3 text-[#F9FAFB] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#FBBF24] focus:border-transparent transition-all duration-300"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            />
          </div>

          {/* Niveau d'avancement */}
          <div>
            <label 
              className="block text-sm font-semibold text-[#F9FAFB] mb-4"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              Niveau d'avancement
            </label>
            <div className="grid sm:grid-cols-3 gap-4">
              {niveauxAvancement.map((niv, index) => (
                <motion.button
                  key={niv.value}
                  type="button"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onChange({ niveau_avancement: niv.value })}
                  className={`relative overflow-hidden rounded-xl border-2 p-4 transition-all duration-300 group ${
                    data.niveau_avancement === niv.value
                      ? 'border-[#FBBF24] bg-[#FBBF24]/10 shadow-lg shadow-[#FBBF24]/25'
                      : 'border-[#2D3748] bg-[#111827] hover:border-[#FBBF24]/50'
                  }`}
                >
                  {/* Background decoration */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${
                    data.niveau_avancement === niv.value ? 'from-[#FBBF24]/5 to-[#00873E]/5' : 'from-transparent to-transparent'
                  } group-hover:from-[#FBBF24]/3 group-hover:to-[#00873E]/3 transition-all duration-300`}></div>
                  
                  {/* Content */}
                  <div className="relative z-10 flex flex-col items-center gap-2">
                    <niv.icon size={24} className={data.niveau_avancement === niv.value ? 'text-[#FBBF24]' : 'text-[#9CA3AF] group-hover:text-[#F9FAFB]'} />
                    <span 
                      className={`font-display font-bold ${
                        data.niveau_avancement === niv.value ? 'text-[#F9FAFB]' : 'text-[#9CA3AF] group-hover:text-[#F9FAFB]'
                      }`}
                      style={{ fontFamily: 'Sora, sans-serif' }}
                    >
                      {niv.label}
                    </span>
                    <span 
                      className="text-xs text-center"
                      style={{ fontFamily: 'DM Sans, sans-serif' }}
                    >
                      {niv.desc}
                    </span>
                  </div>
                  
                  {/* Selection indicator */}
                  {data.niveau_avancement === niv.value && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                      className="absolute top-2 right-2 w-5 h-5 bg-[#00873E] rounded-full flex items-center justify-center"
                    >
                      <CheckCircle size={14} className="text-[#F9FAFB]" />
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Contraintes techniques */}
          <div>
            <label 
              className="block text-sm font-semibold text-[#F9FAFB] mb-3"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              Contraintes techniques
            </label>
            <input 
              type="text" 
              value={data.contraintes_techniques} 
              onChange={(e) => onChange({ contraintes_techniques: e.target.value })}
              placeholder="Ex: Besoin d'un serveur, matériel spécifique, API externes..."
              className="w-full rounded-xl border-[#2D3748] bg-[#1F2937] px-4 py-3 text-[#F9FAFB] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#FBBF24] focus:border-transparent transition-all duration-300"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            />
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Etape5Projet;
