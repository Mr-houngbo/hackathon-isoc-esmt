import { motion } from "framer-motion";
import { InscriptionData } from "@/types/inscription";
import { Code, CheckCircle, AlertCircle } from "lucide-react";

interface Props {
  data: InscriptionData;
  onChange: (d: Partial<InscriptionData>) => void;
  errors?: Record<string, string>;
}

const COMPETENCES = ['Dev Web', 'Dev Mobile', 'Design UI-UX', 'Data', 'IA', 'Business', 'Communication', 'Autre'];
const NIVEAUX_ETUDES = ['L1', 'L2', 'L3', 'M1', 'M2'];
const FILIERES = ['INGC', 'PREPA', 'Informatique', 'Génie', 'Management', 'Communication', 'Autre'];

const Etape3Chef = ({ data, onChange, errors = {} }: Props) => {
  const updateChef = (field: string, value: any) => {
    onChange({
      chef: {
        ...data.chef,
        [field]: value
      }
    });
  };

  const selectCompetence = (competence: string) => {
    // Si on clique sur la compétence déjà sélectionnée, on la désélectionne
    if (data.chef.competences.includes(competence)) {
      updateChef('competences', []);
      // Si on désélectionne "Autre", vider le champ competence_autre
      if (competence === 'Autre') {
        updateChef('competence_autre', '');
      }
    } else {
      // Sinon, on sélectionne cette compétence unique
      updateChef('competences', [competence]);
    }
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
            <Code size={24} className="text-white" />
          </div>
          <h3 
            className="font-display text-2xl font-bold text-[#212529]"
            style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700 }}
          >
            {data.type_candidature === 'individuel' ? 'Vos informations' : 'Chef de projet'}
          </h3>
        </div>
          {data.type_candidature === 'individuel' ? (
            <p 
              className="text-[#6C757D] text-lg"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              Vos informations personnelles
            </p>
          ) : (
            <p 
              className="text-[#6C757D] text-lg"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              Informations du responsable de l'équipe
            </p>
          )}
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
              value={data.chef.nom_prenom || ''}
              onChange={(e) => updateChef('nom_prenom', e.target.value)}
              placeholder="Ex: Aminata Diallo"
              className="w-full px-4 py-3 rounded-xl border border-[#E9ECEF] bg-white text-[#212529] placeholder-[#6C757D] focus:outline-none focus:ring-2 focus:ring-[#FEEB09]/20 focus:border-[#FEEB09]/50 transition-all"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            />
            {errors.nom_prenom && (
              <p className="text-[#DC2626] text-xs mt-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                {errors.nom_prenom}
              </p>
            )}
          </label>
        </motion.div>

        {/* Genre */}
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
              Genre <span className="text-[#DC2626]">*</span>
            </span>
            <div className="flex gap-1 flex-wrap">
              {['homme', 'femme'].map((genre) => (
                <button
                  key={genre}
                  type="button"
                  onClick={() => updateChef('genre', genre)}
                  className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all ${
                    data.chef.genre === genre
                      ? 'bg-[#FEEB09] text-white'
                      : 'bg-[#E9ECEF] border border-[#E9ECEF] text-[#6C757D] hover:border-[#FEEB09]/30'
                  }`}
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  {genre === 'homme' ? 'Homme' : 'Femme'}
                </button>
              ))}
            </div>
            {errors.genre && (
              <p className="text-[#DC2626] text-xs mt-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                {errors.genre}
              </p>
            )}
          </label>
        </motion.div>

        {/* Filière */}
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
              Filière / Classe <span className="text-[#DC2626]">*</span>
            </span>
            <select
              value={data.chef.filiere || ''}
              onChange={(e) => updateChef('filiere', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#E9ECEF] bg-white text-[#212529] focus:outline-none focus:ring-2 focus:ring-[#FEEB09]/20 focus:border-[#FEEB09]/50 transition-all"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              <option value="">Sélectionnez votre filière</option>
              {FILIERES.map((filiere) => (
                <option key={filiere} value={filiere}>{filiere}</option>
              ))}
            </select>
            {errors.filiere && (
              <p className="text-[#DC2626] text-xs mt-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                {errors.filiere}
              </p>
            )}
          </label>
        </motion.div>

        {/* Niveau d'études */}
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
              Niveau d'études <span className="text-[#DC2626]">*</span>
            </span>
            <select
              value={data.chef.niveau_etudes || ''}
              onChange={(e) => updateChef('niveau_etudes', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#E9ECEF] bg-white text-[#212529] focus:outline-none focus:ring-2 focus:ring-[#FEEB09]/20 focus:border-[#FEEB09]/50 transition-all"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              <option value="">Sélectionnez votre niveau</option>
              {NIVEAUX_ETUDES.map((niveau) => (
                <option key={niveau} value={niveau}>{niveau}</option>
              ))}
            </select>
            {errors.niveau_etudes && (
              <p className="text-[#DC2626] text-xs mt-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                {errors.niveau_etudes}
              </p>
            )}
          </label>
        </motion.div>

        {/* Téléphone */}
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
              Téléphone <span className="text-[#DC2626]">*</span>
            </span>
            <input
              type="tel"
              value={data.chef.telephone || ''}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 9);
                updateChef('telephone', value);
              }}
              placeholder="77 000 00 00"
              maxLength={9}
              className="w-full px-4 py-3 rounded-xl border border-[#E9ECEF] bg-white text-[#212529] placeholder-[#6C757D] focus:outline-none focus:ring-2 focus:ring-[#FEEB09]/20 focus:border-[#FEEB09]/50 transition-all"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            />
            {errors.telephone && (
              <p className="text-[#DC2626] text-xs mt-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                {errors.telephone}
              </p>
            )}
          </label>
        </motion.div>

        {/* Email */}
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
              Email <span className="text-[#DC2626]">*</span>
            </span>
            <input
              type="email"
              value={data.chef.email || ''}
              onChange={(e) => updateChef('email', e.target.value)}
              placeholder="votre.email@exemple.com"
              className="w-full px-4 py-3 rounded-xl border border-[#E9ECEF] bg-white text-[#212529] placeholder-[#6C757D] focus:outline-none focus:ring-2 focus:ring-[#FEEB09]/20 focus:border-[#FEEB09]/50 transition-all"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            />
            {errors.email && (
              <p className="text-[#DC2626] text-xs mt-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                {errors.email}
              </p>
            )}
          </label>
        </motion.div>

        {/* Établissement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="bg-white rounded-2xl border border-[#E9ECEF] p-6 shadow-lg sm:col-span-2"
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
              value={data.chef.etablissement || ''}
              onChange={(e) => updateChef('etablissement', e.target.value)}
              placeholder="Nom de votre établissement"
              className="w-full px-4 py-3 rounded-xl border border-[#E9ECEF] bg-white text-[#212529] placeholder-[#6C757D] focus:outline-none focus:ring-2 focus:ring-[#FEEB09]/20 focus:border-[#FEEB09]/50 transition-all"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            />
            {errors.etablissement && (
              <p className="text-[#DC2626] text-xs mt-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                {errors.etablissement}
              </p>
            )}
          </label>
        </motion.div>
      </div>

      {/* Compétences */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="bg-white rounded-2xl border border-[#E9ECEF] p-6 shadow-lg"
      >
        <h4 
          className="font-display text-lg font-semibold text-[#212529] mb-4"
          style={{ fontFamily: 'Sora, sans-serif' }}
        >
          Compétences principales
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {COMPETENCES.map((competence) => (
            <button
              key={competence}
              type="button"
              onClick={() => selectCompetence(competence)}
              className={`p-3 rounded-xl border-2 transition-all duration-300 hover:scale-105 min-h-[3.5rem] flex items-center justify-center ${
                data.chef.competences.includes(competence)
                  ? 'border-[#FEEB09] bg-[#FEEB09]/10'
                  : 'border-[#E9ECEF] bg-white hover:border-[#FEEB09]/30'
              }`}
            >
              <span 
                className="text-sm font-medium text-center leading-tight"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                <span className={data.chef.competences.includes(competence) ? 'text-[#FEEB09]' : 'text-[#6C757D]'}>
                  {competence}
                </span>
              </span>
            </button>
          ))}
        </div>
        {errors.competences && (
          <p className="text-[#DC2626] text-xs mt-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            {errors.competences}
          </p>
        )}
        
        {/* Champ "Autre" si sélectionné */}
        {data.chef.competences.includes('Autre') && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4"
          >
            <input
              type="text"
              value={data.chef.competence_autre || ''}
              onChange={(e) => updateChef('competence_autre', e.target.value)}
              placeholder="Précisez votre compétence"
              className="w-full px-4 py-3 rounded-xl border border-[#E9ECEF] bg-white text-[#212529] placeholder-[#6C757D] focus:outline-none focus:ring-2 focus:ring-[#FEEB09]/20 focus:border-[#FEEB09]/50 transition-all"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
              required
            />
            {errors.competence_autre && (
              <p className="text-[#DC2626] text-xs mt-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                {errors.competence_autre}
              </p>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* Disponibilité */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.9 }}
        className="bg-white rounded-2xl border border-[#E9ECEF] p-6 shadow-lg"
      >
        <h4 
          className="font-display text-lg font-semibold text-[#212529] mb-4"
          style={{ fontFamily: 'Sora, sans-serif' }}
        >
          Disponibilité confirmée les 2 jours <span className="text-[#DC2626]">*</span>
        </h4>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => updateChef('disponible_2_jours', true)}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              data.chef.disponible_2_jours === true
                ? 'bg-[#FEEB09] text-white'
                : 'bg-[#E9ECEF] border border-[#E9ECEF] text-[#6C757D] hover:border-[#FEEB09]/30'
            }`}
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            Oui
          </button>
          <button
            type="button"
            onClick={() => updateChef('disponible_2_jours', false)}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              data.chef.disponible_2_jours === false
                ? 'bg-[#DC2626] text-white'
                : 'bg-[#E9ECEF] border border-[#E9ECEF] text-[#6C757D] hover:border-[#DC2626]/30'
            }`}
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            Non
          </button>
        </div>

        {/* Message bloquant si "Non" */}
        {data.chef.disponible_2_jours === false && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 p-4 rounded-xl bg-[#DC2626]/10 border border-[#DC2626]/50"
          >
            <p className="text-[#DC2626] font-semibold text-sm flex items-center gap-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              <AlertCircle size={16} />
              ⛔ La présence obligatoire les 2 jours (17 & 18 Avril 2026) est une condition sine qua non de participation. Votre candidature ne peut pas être soumise.
            </p>
          </motion.div>
        )}

        {errors.disponible_2_jours && (
          <p className="text-[#DC2626] text-xs mt-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            {errors.disponible_2_jours}
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default Etape3Chef;
