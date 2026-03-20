import { motion } from "framer-motion";
import { InscriptionData } from "@/types/inscription";
import { User, Users } from "lucide-react";

interface Props {
  data: InscriptionData;
  onChange: (d: Partial<InscriptionData>) => void;
}

const Etape2TypeCandidature = ({ data, onChange }: Props) => {
  const handleTypeSelection = (type: 'individuel' | 'equipe') => {
    if (type === 'individuel') {
      onChange({
        type_candidature: 'individuel',
        nombre_membres: 1,
        nom_equipe: '',
        membres: [] // vider les membres
      });
    } else {
      // Initialiser 3 blocs membres vides pour équipe
      const membresVides = Array(3).fill(null).map(() => ({
        nom_prenom: '',
        genre: '',
        filiere: '',
        niveau_etudes: '',
        role_equipe: '',
        telephone: '',
        email: '',
        etablissement: 'ESMT',
        competences: [],
        competence_autre: '',
        disponible_2_jours: null,
      }));
      
      onChange({
        type_candidature: 'equipe',
        nombre_membres: 4, // FIXE, non modifiable
        membres: membresVides
      });
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
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#FF6B35] to-[#1E3A5F] flex items-center justify-center">
            <Users size={24} className="text-white" />
          </div>
          <h3 
            className="font-display text-2xl font-bold text-[#212529]"
            style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700 }}
          >
            Type de candidature
          </h3>
        </div>
        <p 
          className="text-[#6C757D] text-lg"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          Comment souhaitez-vous participer ?
        </p>
        <div className="w-16 h-1 bg-gradient-to-r from-[#FF6B35] to-[#1E3A5F] mx-auto rounded-full mt-4"></div>
      </motion.div>

      {/* Type Selection Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Individuel Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <button
            type="button"
            onClick={() => handleTypeSelection('individuel')}
            className={`w-full p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
              data.type_candidature === 'individuel'
                ? 'border-[#FF6B35] bg-[#FF6B35]/10'
                : 'border-[#E9ECEF] bg-white hover:border-[#FF6B35]/30'
            }`}
          >
            <div className="flex flex-col items-center gap-4 text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                data.type_candidature === 'individuel' ? 'bg-[#FF6B35]' : 'bg-[#E9ECEF]'
              }`}>
                <User size={32} className={data.type_candidature === 'individuel' ? 'text-white' : 'text-[#6C757D]'} />
              </div>
              <div>
                <h4 
                  className="font-display text-lg font-bold mb-2"
                  style={{ fontFamily: 'Sora, sans-serif' }}
                >
                  <span className={data.type_candidature === 'individuel' ? 'text-[#FF6B35]' : 'text-[#212529]'}>
                    Individuel
                  </span>
                </h4>
                <p 
                  className="text-sm"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  <span className={data.type_candidature === 'individuel' ? 'text-[#FF6B35]' : 'text-[#6C757D]'}>
                    Vous participez seul
                  </span>
                </p>
              </div>
            </div>
          </button>
        </motion.div>

        {/* Équipe Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <button
            type="button"
            onClick={() => handleTypeSelection('equipe')}
            className={`w-full p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
              data.type_candidature === 'equipe'
                ? 'border-[#FF6B35] bg-[#FF6B35]/10'
                : 'border-[#E9ECEF] bg-white hover:border-[#FF6B35]/30'
            }`}
          >
            <div className="flex flex-col items-center gap-4 text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                data.type_candidature === 'equipe' ? 'bg-[#FF6B35]' : 'bg-[#E9ECEF]'
              }`}>
                <Users size={32} className={data.type_candidature === 'equipe' ? 'text-white' : 'text-[#6C757D]'} />
              </div>
              <div>
                <h4 
                  className="font-display text-lg font-bold mb-2"
                  style={{ fontFamily: 'Sora, sans-serif' }}
                >
                  <span className={data.type_candidature === 'equipe' ? 'text-[#FF6B35]' : 'text-[#212529]'}>
                    En équipe
                  </span>
                </h4>
                <p 
                  className="text-sm"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  <span className={data.type_candidature === 'equipe' ? 'text-[#FF6B35]' : 'text-[#6C757D]'}>
                    4 membres obligatoirement
                  </span>
                </p>
              </div>
            </div>
          </button>
        </motion.div>
      </div>

      {/* Nom de l'équipe - uniquement si équipe */}
      {data.type_candidature === 'equipe' && (
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
              Nom de l'équipe <span className="text-[#DC2626]">*</span>
            </span>
            <input
              type="text"
              value={data.nom_equipe || ''}
              onChange={(e) => onChange({ nom_equipe: e.target.value })}
              placeholder="Nom de votre équipe"
              className="w-full px-4 py-3 rounded-xl border border-[#E9ECEF] bg-white text-[#212529] placeholder-[#6C757D] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35]/50 transition-all"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            />
          </label>
        </motion.div>
      )}
    </div>
  );
};

export default Etape2TypeCandidature;
