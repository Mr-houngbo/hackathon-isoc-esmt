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
  
  console.log('Etape4Membres loaded, UserIcon:', UserIcon);

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
          <div className="w-12 h-12 rounded-full bg-[#FBBF24] flex items-center justify-center">
            <UserPlus size={24} className="text-[#0A0A0A]" />
          </div>
          <h3 
            className="font-display text-2xl font-bold text-[#F9FAFB]"
            style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700 }}
          >
            Membres de l'équipe
          </h3>
        </div>
        <p 
          className="text-[#9CA3AF] text-lg"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          Informations des {count} autre{count > 1 ? 's' : ''} membre{count > 1 ? 's' : ''}
        </p>
        <div className="w-16 h-1 bg-gradient-to-r from-[#FBBF24] to-[#00873E] mx-auto rounded-full mt-4"></div>
      </motion.div>

      {/* Members Cards */}
      <div className="space-y-6">
        {data.membres.map((m, idx) => (
          <motion.div 
            key={idx} 
            className="card-premium p-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
          >
            {/* Member Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#FBBF24]/20 flex items-center justify-center">
                <UserPlus size={20} className="text-[#FBBF24]" />
              </div>
              <div>
                <h4 
                  className="font-display text-lg font-bold text-[#F9FAFB]"
                  style={{ fontFamily: 'Sora, sans-serif' }}
                >
                  Membre {idx + 2}
                </h4>
                <p 
                  className="text-sm text-[#9CA3AF]"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  Complément d'équipe
                </p>
              </div>
            </div>

            {/* Form Grid */}
            <div className="grid sm:grid-cols-2 gap-6">
              {/* Nom & Prénom */}
              <div className="sm:col-span-2">
                <label 
                  className="block text-sm font-semibold text-[#F9FAFB] mb-3"
                  style={{ fontFamily: 'Sora, sans-serif' }}
                >
                  Nom & Prénom <span className="text-[#DC2626]">*</span>
                </label>
                <input 
                  type="text" 
                  value={m.nom_prenom} 
                  onChange={(e) => updateMembre(idx, 'nom_prenom', e.target.value)}
                  placeholder="Ex: Ahmed Ba"
                  className="w-full rounded-xl border-[#2D3748] bg-[#1F2937] px-4 py-3 text-[#F9FAFB] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#FBBF24] focus:border-transparent transition-all duration-300"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                />
              </div>

              {/* Genre */}
              <div>
                <label 
                  className="block text-sm font-semibold text-[#F9FAFB] mb-3"
                  style={{ fontFamily: 'Sora, sans-serif' }}
                >
                  Genre
                </label>
                <select 
                  value={m.genre} 
                  onChange={(e) => updateMembre(idx, 'genre', e.target.value)}
                  className="w-full rounded-xl border-[#2D3748] bg-[#1F2937] px-4 py-3 text-[#F9FAFB] focus:outline-none focus:ring-2 focus:ring-[#FBBF24] focus:border-transparent transition-all duration-300"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  <option value="">Sélectionner</option>
                  <option value="homme">Homme</option>
                  <option value="femme">Femme</option>
                  <option value="non_precise">Préfère ne pas préciser</option>
                </select>
              </div>

              {/* Filière */}
              <div>
                <label 
                  className="block text-sm font-semibold text-[#F9FAFB] mb-3"
                  style={{ fontFamily: 'Sora, sans-serif' }}
                >
                  Filière <span className="text-[#DC2626]">*</span>
                </label>
                <input 
                  type="text" 
                  value={m.filiere} 
                  onChange={(e) => updateMembre(idx, 'filiere', e.target.value)}
                  placeholder="Ex: Génie Civil"
                  className="w-full rounded-xl border-[#2D3748] bg-[#1F2937] px-4 py-3 text-[#F9FAFB] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#FBBF24] focus:border-transparent transition-all duration-300"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                />
              </div>

              {/* Niveau d'études */}
              <div>
                <label 
                  className="block text-sm font-semibold text-[#F9FAFB] mb-3"
                  style={{ fontFamily: 'Sora, sans-serif' }}
                >
                  Niveau d'études
                </label>
                <select 
                  value={m.niveau_etudes} 
                  onChange={(e) => updateMembre(idx, 'niveau_etudes', e.target.value)}
                  className="w-full rounded-xl border-[#2D3748] bg-[#1F2937] px-4 py-3 text-[#F9FAFB] focus:outline-none focus:ring-2 focus:ring-[#FBBF24] focus:border-transparent transition-all duration-300"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  <option value="">Sélectionner</option>
                  {niveauxEtudes.map((n) => (
                    <option key={n.value} value={n.value}>{n.label}</option>
                  ))}
                </select>
              </div>

              {/* Rôle dans l'équipe */}
              <div>
                <label 
                  className="block text-sm font-semibold text-[#F9FAFB] mb-3"
                  style={{ fontFamily: 'Sora, sans-serif' }}
                >
                  Rôle dans l'équipe
                </label>
                <select 
                  value={m.role_equipe} 
                  onChange={(e) => updateMembre(idx, 'role_equipe', e.target.value)}
                  className="w-full rounded-xl border-[#2D3748] bg-[#1F2937] px-4 py-3 text-[#F9FAFB] focus:outline-none focus:ring-2 focus:ring-[#FBBF24] focus:border-transparent transition-all duration-300"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  <option value="">Sélectionner</option>
                  {roles.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>

              {/* Téléphone */}
              <div>
                <label 
                  className="block text-sm font-semibold text-[#F9FAFB] mb-3"
                  style={{ fontFamily: 'Sora, sans-serif' }}
                >
                  Téléphone <span className="text-[#DC2626]">*</span>
                </label>
                <input 
                  type="tel" 
                  value={m.telephone} 
                  onChange={(e) => updateMembre(idx, 'telephone', e.target.value)}
                  placeholder="Ex: +221 76 123 45 67"
                  className="w-full rounded-xl border-[#2D3748] bg-[#1F2937] px-4 py-3 text-[#F9FAFB] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#FBBF24] focus:border-transparent transition-all duration-300"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                />
              </div>

              {/* Email */}
              <div>
                <label 
                  className="block text-sm font-semibold text-[#F9FAFB] mb-3"
                  style={{ fontFamily: 'Sora, sans-serif' }}
                >
                  Email <span className="text-[#DC2626]">*</span>
                </label>
                <input 
                  type="email" 
                  value={m.email} 
                  onChange={(e) => updateMembre(idx, 'email', e.target.value)}
                  placeholder="Ex: ahmed.ba@esmt.sn"
                  className="w-full rounded-xl border-[#2D3748] bg-[#1F2937] px-4 py-3 text-[#F9FAFB] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#FBBF24] focus:border-transparent transition-all duration-300"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                />
              </div>

              {/* Établissement */}
              <div>
                <label 
                  className="block text-sm font-semibold text-[#F9FAFB] mb-3"
                  style={{ fontFamily: 'Sora, sans-serif' }}
                >
                  Établissement
                </label>
                <input 
                  type="text" 
                  value={m.etablissement} 
                  onChange={(e) => updateMembre(idx, 'etablissement', e.target.value)}
                  placeholder="Ex: UCAD"
                  className="w-full rounded-xl border-[#2D3748] bg-[#1F2937] px-4 py-3 text-[#F9FAFB] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#FBBF24] focus:border-transparent transition-all duration-300"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                />
              </div>
            </div>

            {/* Disponibilité */}
            <div className="mt-6">
              <label 
                className="block text-sm font-semibold text-[#F9FAFB] mb-4"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                Disponible les 2 jours ? <span className="text-[#DC2626]">*</span>
              </label>
              <div className="flex gap-4">
                {[
                  { v: true, l: 'Oui, disponible', icon: CheckCircle, color: 'text-[#00873E]' },
                  { v: false, l: 'Non disponible', icon: AlertTriangle, color: 'text-[#DC2626]' }
                ].map((opt) => (
                  <button
                    key={String(opt.v)} 
                    type="button" 
                    onClick={() => updateMembre(idx, 'disponible', opt.v)}
                    className={`flex-1 rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-all duration-300 group ${
                      m.disponible === opt.v 
                        ? 'border-[#00873E] bg-[#00873E]/10 text-[#00873E] shadow-lg shadow-[#00873E]/25' 
                        : 'border-[#2D3748] bg-[#111827] text-[#9CA3AF] hover:border-[#00873E]/50 hover:text-[#F9FAFB]'
                    }`}
                    style={{ fontFamily: 'Sora, sans-serif' }}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <opt.icon size={18} className={m.disponible === opt.v ? opt.color : 'text-[#9CA3AF]'} />
                      <span>{opt.l}</span>
                    </div>
                  </button>
                ))}
              </div>
              
              {m.disponible === false && (
                <motion.div 
                  className="mt-4 flex items-start gap-3 rounded-xl bg-[#DC2626]/10 border border-[#DC2626]/30 p-4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <AlertTriangle size={18} className="text-[#DC2626] mt-0.5 shrink-0" />
                  <div>
                    <p 
                      className="text-sm text-[#DC2626] font-semibold mb-1"
                      style={{ fontFamily: 'Sora, sans-serif' }}
                    >
                      Disponibilité requise
                    </p>
                    <p 
                      className="text-xs text-[#DC2626]"
                      style={{ fontFamily: 'DM Sans, sans-serif' }}
                    >
                      Tous les membres doivent être présents les 2 jours.
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Etape4Membres;
