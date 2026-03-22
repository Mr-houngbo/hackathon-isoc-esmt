import { motion } from "framer-motion";
import { InscriptionData } from "@/types/inscription";
import { AlertTriangle, UserPlus, Mail, Phone, GraduationCap, Briefcase, CheckCircle, Code, User as UserIcon } from "lucide-react";
import { useEffect } from "react";

interface Props {
  data: InscriptionData;
  onChange: (d: Partial<InscriptionData>) => void;
}

const niveauxEtudes = [
  { value: 'L1', label: 'Licence 1' },
  { value: 'L2', label: 'Licence 2' },
  { value: 'L3', label: 'Licence 3' },
  { value: 'M1', label: 'Master 1' },
  { value: 'M2', label: 'Master 2' }
];

const roles = [
  { value: 'Dev', label: 'Développeur', icon: Code },
  { value: 'Design', label: 'Designer', icon: UserIcon },
  { value: 'Business', label: 'Business', icon: Briefcase },
  { value: 'Communication', label: 'Communication', icon: UserIcon },
  { value: 'Autre', label: 'Autre', icon: Briefcase }
];

const Etape4Membres = ({ data, onChange }: Props) => {
  const count = (data.nombre_membres || 2) - 1;
  
  useEffect(() => {
    if (data.membres.length !== count) {
      const membres = Array.from({ length: count }, (_, i) => data.membres[i] || {
        nom_prenom: '', genre: '', filiere: '', niveau_etudes: '', role_equipe: '',
        telephone: '', email: '', etablissement: 'ESMT', disponible: null,
      });
      onChange({ membres });
    }
  }, [count]);

  const updateMembre = (idx: number, field: string, value: any) => {
    const membres = [...data.membres];
    membres[idx] = { ...membres[idx], [field]: value };
    onChange({ membres });
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
            <UserPlus size={24} className="text-white" />
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
          Informations sur les autres membres
        </p>
        <div className="w-16 h-1 bg-gradient-to-r from-[#FEEB09] to-[#24366E] mx-auto rounded-full mt-4"></div>
      </motion.div>

      {/* Members Grid */}
      <div className="grid sm:grid-cols-2 gap-6">
        {data.membres.map((membre, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="bg-white rounded-2xl border border-[#E9ECEF] p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 
                className="font-display text-lg font-semibold text-[#212529]"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                Membre {idx + 2}
              </h4>
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#FEEB09]/10 to-[#24366E]/10 flex items-center justify-center">
                <UserIcon size={16} className="text-[#FEEB09]" />
              </div>
            </div>

            <div className="space-y-4">
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
                    onChange={(e) => updateMembre(idx, 'nom_prenom', e.target.value)}
                    placeholder="Nom complet"
                    className="w-full px-4 py-3 rounded-xl border border-[#E9ECEF] bg-white text-[#212529] placeholder-[#6C757D] focus:outline-none focus:ring-2 focus:ring-[#FEEB09]/20 focus:border-[#FEEB09]/50 transition-all"
                    style={{ fontFamily: 'DM Sans, sans-serif' }}
                  />
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
                  <select
                    value={membre.genre || ''}
                    onChange={(e) => updateMembre(idx, 'genre', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#E9ECEF] bg-white text-[#212529] focus:outline-none focus:ring-2 focus:ring-[#FEEB09]/20 focus:border-[#FEEB09]/50 transition-all"
                    style={{ fontFamily: 'DM Sans, sans-serif' }}
                  >
                    <option value="">Sélectionner</option>
                    <option value="homme">Homme</option>
                    <option value="femme">Femme</option>
                    <option value="non_precise">Préfère ne pas préciser</option>
                  </select>
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
                    onChange={(e) => updateMembre(idx, 'filiere', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#E9ECEF] bg-white text-[#212529] focus:outline-none focus:ring-2 focus:ring-[#FEEB09]/20 focus:border-[#FEEB09]/50 transition-all"
                    style={{ fontFamily: 'DM Sans, sans-serif' }}
                  >
                    <option value="">Sélectionnez votre filière</option>
                    <option value="Informatique">Informatique</option>
                    <option value="Génie">Génie</option>
                    <option value="Management">Management</option>
                    <option value="Communication">Communication</option>
                    <option value="Autre">Autre</option>
                  </select>
                </label>
              </div>

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
                    onChange={(e) => updateMembre(idx, 'telephone', e.target.value)}
                    placeholder="+221 XX XX XX XX"
                    className="w-full px-4 py-3 rounded-xl border border-[#E9ECEF] bg-white text-[#212529] placeholder-[#6C757D] focus:outline-none focus:ring-2 focus:ring-[#FEEB09]/20 focus:border-[#FEEB09]/50 transition-all"
                    style={{ fontFamily: 'DM Sans, sans-serif' }}
                  />
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
                    onChange={(e) => updateMembre(idx, 'email', e.target.value)}
                    placeholder="votre.email@exemple.com"
                    className="w-full px-4 py-3 rounded-xl border border-[#E9ECEF] bg-white text-[#212529] placeholder-[#6C757D] focus:outline-none focus:ring-2 focus:ring-[#FEEB09]/20 focus:border-[#FEEB09]/50 transition-all"
                    style={{ fontFamily: 'DM Sans, sans-serif' }}
                  />
                </label>
              </div>

              {/* Niveau d'études */}
              <div>
                <label className="block">
                  <span 
                    className="font-display text-sm font-semibold text-[#212529] mb-2 block"
                    style={{ fontFamily: 'Sora, sans-serif' }}
                  >
                    Niveau d'études <span className="text-[#DC2626]">*</span>
                  </span>
                  <select
                    value={membre.niveau_etudes || ''}
                    onChange={(e) => updateMembre(idx, 'niveau_etudes', e.target.value)}
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
              </div>

              {/* Rôle dans l'équipe */}
              <div>
                <label className="block">
                  <span 
                    className="font-display text-sm font-semibold text-[#212529] mb-2 block"
                    style={{ fontFamily: 'Sora, sans-serif' }}
                  >
                    Rôle dans l'équipe
                  </span>
                  <select
                    value={membre.role_equipe || ''}
                    onChange={(e) => updateMembre(idx, 'role_equipe', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#E9ECEF] bg-white text-[#212529] focus:outline-none focus:ring-2 focus:ring-[#FEEB09]/20 focus:border-[#FEEB09]/50 transition-all"
                    style={{ fontFamily: 'DM Sans, sans-serif' }}
                  >
                    <option value="">Sélectionnez un rôle</option>
                    {roles.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              {/* Disponibilité */}
              <div>
                <label className="flex items-center gap-4 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={membre.disponible === true}
                    onChange={(e) => updateMembre(idx, 'disponible', e.target.checked)}
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
                      Confirme la disponibilité pour le hackathon
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Etape4Membres;
