import { useState } from "react";
import { motion } from "framer-motion";
import { InscriptionData } from "@/types/inscription";
import { Users, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";

interface Props {
  data: InscriptionData;
  onChange: (d: Partial<InscriptionData>) => void;
  errors?: Record<string, string>;
}

const NIVEAUX_ETUDES = ['L1', 'L2', 'L3', 'M1', 'M2'];
const ROLES = ['Dev', 'Design', 'Business', 'Communication', 'Autre'];
const FILIERES = ['INGC', 'PREPA', 'Informatique', 'Génie', 'Management', 'Communication', 'Autre'];

const Etape4Membres = ({ data, onChange, errors = {} }: Props) => {
  const [expandedBlocks, setExpandedBlocks] = useState([0]); // Membre 2 ouvert par défaut

  const updateMembre = (index: number, field: string, value: any) => {
    const membres = [...data.membres];
    membres[index] = { ...membres[index], [field]: value };
    onChange({ membres });
  };

  const toggleBlock = (index: number) => {
    setExpandedBlocks(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const isBlockValid = (membre: any) => {
    return membre.nom_prenom && 
           membre.genre && 
           membre.filiere && 
           membre.niveau_etudes && 
           membre.role_equipe && 
           membre.telephone && 
           membre.email && 
           membre.etablissement && 
           membre.disponible_2_jours === true;
  };

  const getBlockBorderColor = (membre: any, index: number) => {
    const hasBlockingError = membre.disponible_2_jours === false;
    if (hasBlockingError) return 'border-[#DC2626]';
    if (isBlockValid(membre)) return 'border-[#FF6B35]';
    return 'border-[#E9ECEF]';
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
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#FF6B35] to-[#1E3A5F] flex items-center justify-center">
            <Users size={24} className="text-white" />
          </div>
          <h3 
            className="font-display text-2xl font-bold text-[#212529]"
            style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700 }}
          >
            Membres de l'équipe
          </h3>
        </div>
        <p 
          className="text-[#6C757D] text-lg"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          Informations des autres membres (3 membres obligatoires)
        </p>
        <div className="w-16 h-1 bg-gradient-to-r from-[#FF6B35] to-[#1E3A5F] mx-auto rounded-full mt-4"></div>
      </motion.div>

      {/* Membres Blocks */}
      <div className="space-y-6">
        {data.membres.map((membre, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`bg-white rounded-2xl border-2 ${getBlockBorderColor(membre, index)} shadow-lg overflow-hidden`}
          >
            {/* Header du bloc */}
            <button
              type="button"
              onClick={() => toggleBlock(index)}
              className="w-full p-4 flex items-center justify-between hover:bg-[#F8F9FA] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isBlockValid(membre) ? 'bg-[#FF6B35]' : 'bg-[#E9ECEF]'
                }`}>
                  <Users size={16} className={isBlockValid(membre) ? 'text-white' : 'text-[#6C757D]'} />
                </div>
                <div className="text-left">
                  <h4 
                    className="font-display text-lg font-semibold text-[#212529]"
                    style={{ fontFamily: 'Sora, sans-serif' }}
                  >
                    Membre {index + 2}
                    {membre.nom_prenom && ` — ${membre.nom_prenom}`}
                  </h4>
                  <p 
                    className="text-sm text-[#6C757D]"
                    style={{ fontFamily: 'DM Sans, sans-serif' }}
                  >
                    {isBlockValid(membre) ? '✅ Informations complètes' : '⚠️ Informations incomplètes'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {expandedBlocks.includes(index) ? (
                  <ChevronUp size={20} className="text-[#6C757D]" />
                ) : (
                  <ChevronDown size={20} className="text-[#6C757D]" />
                )}
              </div>
            </button>

            {/* Contenu du bloc */}
            {expandedBlocks.includes(index) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="border-t border-[#E9ECEF]"
              >
                <div className="p-6 space-y-6">
                  {/* Grid 2 colonnes */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    {/* Nom & Prénom */}
                    <div>
                      <label className="block">
                        <span 
                          className="font-display text-sm font-semibold text-[#212529] mb-2 block"
                          style={{ fontFamily: 'Sora, sans-serif' }}
                        >
                          Nom & Prénom <span className="text-[#DC2626]">*</span>
                        </span>
                        <input
                          type="text"
                          value={membre.nom_prenom || ''}
                          onChange={(e) => updateMembre(index, 'nom_prenom', e.target.value)}
                          placeholder="Nom complet"
                          className="w-full px-4 py-3 rounded-xl border border-[#E9ECEF] bg-white text-[#212529] placeholder-[#6C757D] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35]/50 transition-all"
                          style={{ fontFamily: 'DM Sans, sans-serif' }}
                        />
                        {errors[`m${index}_nom`] && (
                          <p className="text-[#DC2626] text-xs mt-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                            {errors[`m${index}_nom`]}
                          </p>
                        )}
                      </label>
                    </div>

                    {/* Genre */}
                    <div>
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
                              onClick={() => updateMembre(index, 'genre', genre)}
                              className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all ${
                                membre.genre === genre
                                  ? 'bg-[#FF6B35] text-white'
                                  : 'bg-[#E9ECEF] border border-[#E9ECEF] text-[#6C757D] hover:border-[#FF6B35]/30'
                              }`}
                              style={{ fontFamily: 'DM Sans, sans-serif' }}
                            >
                              {genre === 'homme' ? 'Homme' : 'Femme'}
                            </button>
                          ))}
                        </div>
                        {errors[`m${index}_genre`] && (
                          <p className="text-[#DC2626] text-xs mt-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                            {errors[`m${index}_genre`]}
                          </p>
                        )}
                      </label>
                    </div>

                    {/* Filière */}
                    <div>
                      <label className="block">
                        <span 
                          className="font-display text-sm font-semibold text-[#212529] mb-2 block"
                          style={{ fontFamily: 'Sora, sans-serif' }}
                        >
                          Filière <span className="text-[#DC2626]">*</span>
                        </span>
                        <select
                          value={membre.filiere || ''}
                          onChange={(e) => updateMembre(index, 'filiere', e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-[#E9ECEF] bg-white text-[#212529] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35]/50 transition-all"
                          style={{ fontFamily: 'DM Sans, sans-serif' }}
                        >
                          <option value="">Sélectionnez votre filière</option>
                          {FILIERES.map((filiere) => (
                            <option key={filiere} value={filiere}>{filiere}</option>
                          ))}
                        </select>
                        {errors[`m${index}_filiere`] && (
                          <p className="text-[#DC2626] text-xs mt-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                            {errors[`m${index}_filiere`]}
                          </p>
                        )}
                      </label>
                    </div>

                    {/* Niveau d'études */}
                    <div>
                      <label className="block">
                        <span 
                          className="font-display text-sm font-semibold text-[#212529] mb-2 block"
                          style={{ fontFamily: 'Sora, sans-serif' }}
                        >
                          Niveau <span className="text-[#DC2626]">*</span>
                        </span>
                        <select
                          value={membre.niveau_etudes || ''}
                          onChange={(e) => updateMembre(index, 'niveau_etudes', e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-[#E9ECEF] bg-white text-[#212529] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35]/50 transition-all"
                          style={{ fontFamily: 'DM Sans, sans-serif' }}
                        >
                          <option value="">Niveau</option>
                          {NIVEAUX_ETUDES.map((niveau) => (
                            <option key={niveau} value={niveau}>{niveau}</option>
                          ))}
                        </select>
                        {errors[`m${index}_niveau`] && (
                          <p className="text-[#DC2626] text-xs mt-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                            {errors[`m${index}_niveau`]}
                          </p>
                        )}
                      </label>
                    </div>

                    {/* Rôle */}
                    <div>
                      <label className="block">
                        <span 
                          className="font-display text-sm font-semibold text-[#212529] mb-2 block"
                          style={{ fontFamily: 'Sora, sans-serif' }}
                        >
                          Rôle <span className="text-[#DC2626]">*</span>
                        </span>
                        <select
                          value={membre.role_equipe || ''}
                          onChange={(e) => updateMembre(index, 'role_equipe', e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-[#E9ECEF] bg-white text-[#212529] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35]/50 transition-all"
                          style={{ fontFamily: 'DM Sans, sans-serif' }}
                        >
                          <option value="">Rôle</option>
                          {ROLES.map((role) => (
                            <option key={role} value={role}>{role}</option>
                          ))}
                        </select>
                        {errors[`m${index}_role`] && (
                          <p className="text-[#DC2626] text-xs mt-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                            {errors[`m${index}_role`]}
                          </p>
                        )}
                      </label>
                    </div>

                    {/* Champ "Autre" pour le rôle si sélectionné */}
                    {membre.role_equipe === 'Autre' && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-3"
                      >
                        <label className="block">
                          <span 
                            className="font-display text-sm font-semibold text-[#212529] mb-2 block"
                            style={{ fontFamily: 'Sora, sans-serif' }}
                          >
                            Précisez votre rôle <span className="text-[#DC2626]">*</span>
                          </span>
                          <input
                            type="text"
                            value={(membre as any).role_autre || ''}
                            onChange={(e) => updateMembre(index, 'role_autre', e.target.value)}
                            placeholder="Décrivez votre rôle dans l'équipe"
                            className="w-full px-4 py-3 rounded-xl border border-[#E9ECEF] bg-white text-[#212529] placeholder-[#6C757D] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35]/50 transition-all"
                            style={{ fontFamily: 'DM Sans, sans-serif' }}
                            required
                          />
                          {errors[`m${index}_role_autre`] && (
                            <p className="text-[#DC2626] text-xs mt-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                              {errors[`m${index}_role_autre`]}
                            </p>
                          )}
                        </label>
                      </motion.div>
                    )}

                    {/* Téléphone */}
                    <div>
                      <label className="block">
                        <span 
                          className="font-display text-sm font-semibold text-[#212529] mb-2 block"
                          style={{ fontFamily: 'Sora, sans-serif' }}
                        >
                          Téléphone <span className="text-[#DC2626]">*</span>
                        </span>
                        <input
                          type="tel"
                          value={membre.telephone || ''}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '').slice(0, 9);
                            updateMembre(index, 'telephone', value);
                          }}
                          placeholder="77 000 00 00"
                          maxLength={9}
                          className="w-full px-4 py-3 rounded-xl border border-[#E9ECEF] bg-white text-[#212529] placeholder-[#6C757D] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35]/50 transition-all"
                          style={{ fontFamily: 'DM Sans, sans-serif' }}
                        />
                        {errors[`m${index}_tel`] && (
                          <p className="text-[#DC2626] text-xs mt-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                            {errors[`m${index}_tel`]}
                          </p>
                        )}
                      </label>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block">
                        <span 
                          className="font-display text-sm font-semibold text-[#212529] mb-2 block"
                          style={{ fontFamily: 'Sora, sans-serif' }}
                        >
                          Email <span className="text-[#DC2626]">*</span>
                        </span>
                        <input
                          type="email"
                          value={membre.email || ''}
                          onChange={(e) => updateMembre(index, 'email', e.target.value)}
                          placeholder="email@exemple.com"
                          className="w-full px-4 py-3 rounded-xl border border-[#E9ECEF] bg-white text-[#212529] placeholder-[#6C757D] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35]/50 transition-all"
                          style={{ fontFamily: 'DM Sans, sans-serif' }}
                        />
                        {errors[`m${index}_email`] && (
                          <p className="text-[#DC2626] text-xs mt-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                            {errors[`m${index}_email`]}
                          </p>
                        )}
                      </label>
                    </div>

                    {/* Établissement */}
                    <div className="sm:col-span-2">
                      <label className="block">
                        <span 
                          className="font-display text-sm font-semibold text-[#212529] mb-2 block"
                          style={{ fontFamily: 'Sora, sans-serif' }}
                        >
                          Établissement <span className="text-[#DC2626]">*</span>
                        </span>
                        <input
                          type="text"
                          value={membre.etablissement || ''}
                          onChange={(e) => updateMembre(index, 'etablissement', e.target.value)}
                          placeholder="Établissement"
                          className="w-full px-4 py-3 rounded-xl border border-[#E9ECEF] bg-white text-[#212529] placeholder-[#6C757D] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35]/50 transition-all"
                          style={{ fontFamily: 'DM Sans, sans-serif' }}
                        />
                        {errors[`m${index}_etablissement`] && (
                          <p className="text-[#DC2626] text-xs mt-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                            {errors[`m${index}_etablissement`]}
                          </p>
                        )}
                      </label>
                    </div>
                  </div>

                  {/* Disponibilité */}
                  <div>
                    <h4 
                      className="font-display text-sm font-semibold text-[#212529] mb-3"
                      style={{ fontFamily: 'Sora, sans-serif' }}
                    >
                      Disponibilité 2 jours <span className="text-[#DC2626]">*</span>
                    </h4>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => updateMembre(index, 'disponible_2_jours', true)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                          membre.disponible_2_jours === true
                            ? 'bg-[#FF6B35] text-white'
                            : 'bg-[#E9ECEF] border border-[#E9ECEF] text-[#6C757D] hover:border-[#FF6B35]/30'
                        }`}
                        style={{ fontFamily: 'DM Sans, sans-serif' }}
                      >
                        Oui
                      </button>
                      <button
                        type="button"
                        onClick={() => updateMembre(index, 'disponible_2_jours', false)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                          membre.disponible_2_jours === false
                            ? 'bg-[#DC2626] text-white'
                            : 'bg-[#E9ECEF] border border-[#E9ECEF] text-[#6C757D] hover:border-[#DC2626]/30'
                        }`}
                        style={{ fontFamily: 'DM Sans, sans-serif' }}
                      >
                        Non
                      </button>
                    </div>

                    {/* Message bloquant si "Non" */}
                    {membre.disponible_2_jours === false && (
                      <div className="mt-3 p-3 rounded-xl bg-[#DC2626]/10 border border-[#DC2626]/50">
                        <p className="text-[#DC2626] font-semibold text-xs flex items-center gap-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                          <AlertCircle size={14} />
                          ⛔ La présence obligatoire les 2 jours (17 & 18 Avril 2026) est une condition sine qua non de participation.
                        </p>
                      </div>
                    )}

                    {errors[`m${index}_dispo`] && (
                      <p className="text-[#DC2626] text-xs mt-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                        {errors[`m${index}_dispo`]}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Info sur les membres */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-gradient-to-r from-[#FF6B35]/10 to-[#1E3A5F]/10 rounded-2xl border border-[#E9ECEF] p-4"
      >
        <p 
          className="text-center text-sm"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          <span className="text-[#212529]">
            📋 Équipe obligatoirement composée de 4 membres (chef + 3 membres)
          </span>
        </p>
      </motion.div>
    </div>
  );
};

export default Etape4Membres;
