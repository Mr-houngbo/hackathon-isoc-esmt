import { motion } from "framer-motion";
import { InscriptionData } from "@/types/inscription";
import { User, AlertTriangle, Mail, Phone, GraduationCap, Briefcase, Code, CheckCircle } from "lucide-react";

interface Props {
  data: InscriptionData;
  onChange: (d: Partial<InscriptionData>) => void;
}

const competencesList = [
  { value: 'Dev Web', icon: Code, color: 'text-[#FEEB09]' },
  { value: 'Dev Mobile', icon: Phone, color: 'text-[#24366E]' },
  { value: 'Design UI-UX', icon: User, color: 'text-[#FEEB09]' },
  { value: 'Data', icon: Code, color: 'text-[#24366E]' },
  { value: 'IA', icon: Code, color: 'text-[#FEEB09]' },
  { value: 'Business', icon: Briefcase, color: 'text-[#24366E]' },
  { value: 'Communication', icon: User, color: 'text-[#FEEB09]' },
  { value: 'Autre', icon: Code, color: 'text-[#6C757D]' }
];

const niveauxEtudes = [
  { value: 'L1', label: 'Licence 1' },
  { value: 'L2', label: 'Licence 2' },
  { value: 'L3', label: 'Licence 3' },
  { value: 'M1', label: 'Master 1' },
  { value: 'M2', label: 'Master 2' }
];

const Etape3Chef = ({ data, onChange }: Props) => {
  const toggleCompetence = (c: string) => {
    const list = data.chef_competences.includes(c)
      ? data.chef_competences.filter((x) => x !== c)
      : [...data.chef_competences, c];
    onChange({ chef_competences: list });
  };

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
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#FEEB09] to-[#24366E] flex items-center justify-center">
            <User size={24} className="text-white" />
          </div>
          <h3 
            className="font-display text-2xl font-bold text-[#212529]"
            style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700 }}
          >
            Chef d'équipe
          </h3>
        </div>
        <p 
          className="text-[#6C757D] text-lg"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          Informations du responsable de l'équipe
        </p>
        <div className="w-16 h-1 bg-gradient-to-r from-[#FEEB09] to-[#24366E] mx-auto rounded-full mt-4"></div>
      </motion.div>

      {/* Form Grid */}
      <div className="grid sm:grid-cols-2 gap-6">
        {/* Nom & Prénom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-2xl border border-[#E9ECEF] p-6 shadow-lg"
        >
          <label className="block">
            <span 
              className="font-display text-sm font-semibold text-[#212529] mb-2 block"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              Nom & Prénom <span className="text-[#DC2626]">*</span>
            </span>
            <input
              type="text"
              value={data.chef_nom_prenom || ''}
              onChange={(e) => onChange({ chef_nom_prenom: e.target.value })}
              placeholder="Votre nom complet"
              className="w-full px-4 py-3 rounded-xl border border-[#E9ECEF] bg-white text-[#212529] placeholder-[#6C757D] focus:outline-none focus:ring-2 focus:ring-[#FEEB09]/20 focus:border-[#FEEB09]/50 transition-all"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            />
          </label>
        </motion.div>

        {/* Filière */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl border border-[#E9ECEF] p-6 shadow-lg"
        >
          <label className="block">
            <span 
              className="font-display text-sm font-semibold text-[#212529] mb-2 block"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              Filière <span className="text-[#DC2626]">*</span>
            </span>
            <select
              value={data.chef_filiere || ''}
              onChange={(e) => onChange({ chef_filiere: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-[#E9ECEF] bg-white text-[#212529] focus:outline-none focus:ring-2 focus:ring-[#FEEB09]/20 focus:border-[#FEEB09]/50 transition-all"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              <option value="">Sélectionnez votre genre</option>
              <option value="homme">Homme</option>
              <option value="femme">Femme</option>
              <option value="non_precise">Préfère ne pas préciser</option>
            </select>
          </label>
        </motion.div>

        {/* Téléphone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-2xl border border-[#E9ECEF] p-6 shadow-lg"
        >
          <label className="block">
            <span 
              className="font-display text-sm font-semibold text-[#212529] mb-2 block"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              Téléphone <span className="text-[#DC2626]">*</span>
            </span>
            <input
              type="tel"
              value={data.chef_telephone || ''}
              onChange={(e) => onChange({ chef_telephone: e.target.value })}
              placeholder="+221 XX XX XX XX"
              className="w-full px-4 py-3 rounded-xl border border-[#E9ECEF] bg-white text-[#212529] placeholder-[#6C757D] focus:outline-none focus:ring-2 focus:ring-[#FEEB09]/20 focus:border-[#FEEB09]/50 transition-all"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            />
          </label>
        </motion.div>

        {/* Email */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-2xl border border-[#E9ECEF] p-6 shadow-lg"
        >
          <label className="block">
            <span 
              className="font-display text-sm font-semibold text-[#212529] mb-2 block"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              Email <span className="text-[#DC2626]">*</span>
            </span>
            <input
              type="email"
              value={data.chef_email || ''}
              onChange={(e) => onChange({ chef_email: e.target.value })}
              placeholder="votre.email@exemple.com"
              className="w-full px-4 py-3 rounded-xl border border-[#E9ECEF] bg-white text-[#212529] placeholder-[#6C757D] focus:outline-none focus:ring-2 focus:ring-[#FEEB09]/20 focus:border-[#FEEB09]/50 transition-all"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            />
          </label>
        </motion.div>

        {/* Établissement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white rounded-2xl border border-[#E9ECEF] p-6 shadow-lg"
        >
          <label className="block">
            <span 
              className="font-display text-sm font-semibold text-[#212529] mb-2 block"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              Établissement <span className="text-[#DC2626]">*</span>
            </span>
            <input
              type="text"
              value={data.chef_etablissement || ''}
              onChange={(e) => onChange({ chef_etablissement: e.target.value })}
              placeholder="Nom de votre établissement"
              className="w-full px-4 py-3 rounded-xl border border-[#E9ECEF] bg-white text-[#212529] placeholder-[#6C757D] focus:outline-none focus:ring-2 focus:ring-[#FEEB09]/20 focus:border-[#FEEB09]/50 transition-all"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            />
          </label>
        </motion.div>

        {/* Niveau d'études */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white rounded-2xl border border-[#E9ECEF] p-6 shadow-lg"
        >
          <label className="block">
            <span 
              className="font-display text-sm font-semibold text-[#212529] mb-2 block"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              Niveau d'études <span className="text-[#DC2626]">*</span>
            </span>
            <select
              value={data.chef_niveau_etudes || ''}
              onChange={(e) => onChange({ chef_niveau_etudes: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-[#E9ECEF] bg-white text-[#212529] focus:outline-none focus:ring-2 focus:ring-[#FEEB09]/20 focus:border-[#FEEB09]/50 transition-all"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              <option value="">Sélectionnez votre niveau</option>
              {niveauxEtudes.map((niveau) => (
                <option key={niveau.value} value={niveau.value}>
                  {niveau.label}
                </option>
              ))}
            </select>
          </label>
        </motion.div>
      </div>

      {/* Compétences */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="bg-white rounded-2xl border border-[#E9ECEF] p-6 shadow-lg"
      >
        <h4 
          className="font-display text-lg font-semibold text-[#212529] mb-4"
          style={{ fontFamily: 'Sora, sans-serif' }}
        >
          Compétences techniques
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {competencesList.map((competence) => (
            <button
              key={competence.value}
              type="button"
              onClick={() => toggleCompetence(competence.value)}
              className={`p-3 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                data.chef_competences.includes(competence.value)
                  ? 'border-[#FEEB09] bg-[#FEEB09]/10'
                  : 'border-[#E9ECEF] bg-white hover:border-[#FEEB09]/30'
              }`}
            >
              <competence.icon 
                size={20} 
                className={data.chef_competences.includes(competence.value) ? competence.color : 'text-[#6C757D]'}
              />
              <span 
                className="text-xs mt-1 block"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                <span className={data.chef_competences.includes(competence.value) ? competence.color : 'text-[#6C757D]'}>
                  {competence.value}
                </span>
              </span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Disponibilité */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="bg-white rounded-2xl border border-[#E9ECEF] p-6 shadow-lg"
      >
        <label className="flex items-center gap-4 cursor-pointer">
          <input
            type="checkbox"
            checked={data.chef_disponible}
            onChange={(e) => onChange({ chef_disponible: e.target.checked })}
            className="h-5 w-5 rounded border border-[#E9ECEF] bg-white text-[#FEEB09] focus:ring-2 focus:ring-[#FEEB09]/20 focus:ring-offset-0"
          />
          <div>
            <span 
              className="font-display text-sm font-semibold text-[#212529]"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              Disponible les 17-18 avril 2026 <span className="text-[#DC2626]">*</span>
            </span>
            <p 
              className="text-xs text-[#6C757D] mt-1"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              Je confirme ma disponibilité pour toute la durée du hackathon
            </p>
          </div>
        </label>
      </motion.div>
    </div>
  );
};

export default Etape3Chef;
