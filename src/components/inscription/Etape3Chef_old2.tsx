import { motion } from "framer-motion";
import { InscriptionData } from "@/types/inscription";
import { User, AlertTriangle, Mail, Phone, GraduationCap, Briefcase, Code, CheckCircle } from "lucide-react";

interface Props {
  data: InscriptionData;
  onChange: (d: Partial<InscriptionData>) => void;
}

const competencesList = [
  { value: 'Dev Web', icon: Code, color: 'text-[#FBBF24]' },
  { value: 'Dev Mobile', icon: Phone, color: 'text-[#00873E]' },
  { value: 'Design UI-UX', icon: User, color: 'text-[#FBBF24]' },
  { value: 'Data', icon: Code, color: 'text-[#00873E]' },
  { value: 'IA', icon: Code, color: 'text-[#FBBF24]' },
  { value: 'Business', icon: Briefcase, color: 'text-[#00873E]' },
  { value: 'Communication', icon: User, color: 'text-[#FBBF24]' },
  { value: 'Autre', icon: Code, color: 'text-[#9CA3AF]' }
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
          <div className="w-12 h-12 rounded-full bg-[#00873E] flex items-center justify-center">
            <User size={24} className="text-[#F9FAFB]" />
          </div>
          <h3 
            className="font-display text-2xl font-bold text-[#F9FAFB]"
            style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700 }}
          >
            Chef de projet
          </h3>
        </div>
        <p 
          className="text-[#9CA3AF] text-lg"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          Informations du responsable de l'équipe
        </p>
        <div className="w-16 h-1 bg-gradient-to-r from-[#00873E] to-[#FBBF24] mx-auto rounded-full mt-4"></div>
      </motion.div>

      {/* Form Grid */}
      <div className="grid sm:grid-cols-2 gap-6">
        {/* Nom & Prénom */}
        <motion.div 
          className="sm:col-span-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <label 
            className="block text-sm font-semibold text-[#F9FAFB] mb-3"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            Nom & Prénom <span className="text-[#DC2626]">*</span>
          </label>
          <input 
            type="text" 
            value={data.chef_nom_prenom} 
            onChange={(e) => onChange({ chef_nom_prenom: e.target.value })}
            placeholder="Ex: Marie Diouf"
            className="w-full rounded-xl border-[#2D3748] bg-[#1F2937] px-4 py-3 text-[#F9FAFB] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#00873E] focus:border-transparent transition-all duration-300"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          />
        </motion.div>

        {/* Genre */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <label 
            className="block text-sm font-semibold text-[#F9FAFB] mb-3"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            Genre
          </label>
          <select 
            value={data.chef_genre} 
            onChange={(e) => onChange({ chef_genre: e.target.value })}
            className="w-full rounded-xl border-[#2D3748] bg-[#1F2937] px-4 py-3 text-[#F9FAFB] focus:outline-none focus:ring-2 focus:ring-[#00873E] focus:border-transparent transition-all duration-300"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            <option value="">Sélectionner</option>
            <option value="homme">Homme</option>
            <option value="femme">Femme</option>
            <option value="non_precise">Préfère ne pas préciser</option>
          </select>
        </motion.div>

        {/* Filière */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <label 
            className="block text-sm font-semibold text-[#F9FAFB] mb-3"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            Filière / Classe <span className="text-[#DC2626]">*</span>
          </label>
          <input 
            type="text" 
            value={data.chef_filiere} 
            onChange={(e) => onChange({ chef_filiere: e.target.value })}
            placeholder="Ex: Génie Logiciel"
            className="w-full rounded-xl border-[#2D3748] bg-[#1F2937] px-4 py-3 text-[#F9FAFB] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#00873E] focus:border-transparent transition-all duration-300"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          />
        </motion.div>

        {/* Niveau d'études */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <label 
            className="block text-sm font-semibold text-[#F9FAFB] mb-3"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            Niveau d'études
          </label>
          <select 
            value={data.chef_niveau_etudes} 
            onChange={(e) => onChange({ chef_niveau_etudes: e.target.value })}
            className="w-full rounded-xl border-[#2D3748] bg-[#1F2937] px-4 py-3 text-[#F9FAFB] focus:outline-none focus:ring-2 focus:ring-[#00873E] focus:border-transparent transition-all duration-300"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            <option value="">Sélectionner</option>
            {niveauxEtudes.map((n) => (
              <option key={n.value} value={n.value}>{n.label}</option>
            ))}
          </select>
        </motion.div>

        {/* Téléphone */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <label 
            className="block text-sm font-semibold text-[#F9FAFB] mb-3"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            Téléphone <span className="text-[#DC2626]">*</span>
          </label>
          <input 
            type="tel" 
            value={data.chef_telephone} 
            onChange={(e) => onChange({ chef_telephone: e.target.value })}
            placeholder="Ex: +221 77 123 45 67"
            className="w-full rounded-xl border-[#2D3748] bg-[#1F2937] px-4 py-3 text-[#F9FAFB] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#00873E] focus:border-transparent transition-all duration-300"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          />
        </motion.div>

        {/* Email */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <label 
            className="block text-sm font-semibold text-[#F9FAFB] mb-3"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            Email <span className="text-[#DC2626]">*</span>
          </label>
          <input 
            type="email" 
            value={data.chef_email} 
            onChange={(e) => onChange({ chef_email: e.target.value })}
            placeholder="Ex: marie.diouf@esmt.sn"
            className="w-full rounded-xl border-[#2D3748] bg-[#1F2937] px-4 py-3 text-[#F9FAFB] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#00873E] focus:border-transparent transition-all duration-300"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          />
        </motion.div>

        {/* Établissement */}
        <motion.div 
          className="sm:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <label 
            className="block text-sm font-semibold text-[#F9FAFB] mb-3"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            Établissement <span className="text-[#DC2626]">*</span>
          </label>
          <input 
            type="text" 
            value={data.chef_etablissement} 
            onChange={(e) => onChange({ chef_etablissement: e.target.value })}
            placeholder="Ex: ESMT"
            className="w-full rounded-xl border-[#2D3748] bg-[#1F2937] px-4 py-3 text-[#F9FAFB] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#00873E] focus:border-transparent transition-all duration-300"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          />
        </motion.div>
      </div>

      {/* Compétences */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
      >
        <label 
          className="block text-sm font-semibold text-[#F9FAFB] mb-4"
          style={{ fontFamily: 'Sora, sans-serif' }}
        >
          Compétences techniques
        </label>
        <div className="flex flex-wrap gap-3">
          {competencesList.map((comp) => (
            <button 
              key={comp.value} 
              type="button" 
              onClick={() => toggleCompetence(comp.value)}
              className={`relative overflow-hidden rounded-xl border-2 px-4 py-2 text-sm font-medium transition-all duration-300 group ${
                data.chef_competences.includes(comp.value)
                  ? 'border-[#00873E] bg-[#00873E]/10 text-[#00873E] shadow-lg shadow-[#00873E]/25' 
                  : 'border-[#2D3748] bg-[#111827] text-[#9CA3AF] hover:border-[#00873E]/50 hover:text-[#F9FAFB]'
              }`}
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              <div className="flex items-center gap-2">
                <comp.icon size={16} className={data.chef_competences.includes(comp.value) ? 'text-[#00873E]' : comp.color} />
                <span>{comp.value}</span>
              </div>
              {data.chef_competences.includes(comp.value) && (
                <div className="absolute top-1 right-1">
                  <CheckCircle size={12} className="text-[#00873E]" />
                </div>
              )}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Disponibilité */}
      <motion.div 
        className="card-premium p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.9 }}
      >
        <label 
          className="block text-sm font-semibold text-[#F9FAFB] mb-4"
          style={{ fontFamily: 'Sora, sans-serif' }}
        >
          Disponible les 2 jours (3 & 4 Avril) ? <span className="text-[#DC2626]">*</span>
        </label>
        <div className="flex gap-4">
          {[
            { v: true, l: 'Oui, je serai présent', icon: CheckCircle, color: 'text-[#00873E]' },
            { v: false, l: 'Non, je ne peux pas', icon: AlertTriangle, color: 'text-[#DC2626]' }
          ].map((opt) => (
            <button
              key={String(opt.v)} 
              type="button" 
              onClick={() => onChange({ chef_disponible: opt.v })}
              className={`flex-1 rounded-xl border-2 px-6 py-4 text-sm font-semibold transition-all duration-300 group ${
                data.chef_disponible === opt.v 
                  ? 'border-[#00873E] bg-[#00873E]/10 text-[#00873E] shadow-lg shadow-[#00873E]/25' 
                  : 'border-[#2D3748] bg-[#111827] text-[#9CA3AF] hover:border-[#00873E]/50 hover:text-[#F9FAFB]'
              }`}
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              <div className="flex items-center justify-center gap-2">
                <opt.icon size={20} className={data.chef_disponible === opt.v ? opt.color : 'text-[#9CA3AF]'} />
                <span>{opt.l}</span>
              </div>
            </button>
          ))}
        </div>
        
        {data.chef_disponible === false && (
          <motion.div 
            className="mt-4 flex items-start gap-3 rounded-xl bg-[#DC2626]/10 border border-[#DC2626]/30 p-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <AlertTriangle size={20} className="text-[#DC2626] mt-0.5 shrink-0" />
            <div>
              <p 
                className="text-sm text-[#DC2626] font-semibold mb-1"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                Disponibilité obligatoire
              </p>
              <p 
                className="text-xs text-[#DC2626]"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                La présence les 2 jours complets est obligatoire pour participer au hackathon.
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Etape3Chef;
