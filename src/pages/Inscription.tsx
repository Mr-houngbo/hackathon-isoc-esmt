import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Layout from "@/components/layout/Layout";
import StepIndicator from "@/components/inscription/StepIndicator";
import Etape1Couverture from "@/components/inscription/Etape1Couverture";
import Etape2TypeCandidature from "@/components/inscription/Etape2TypeCandidature";
import Etape3Chef from "@/components/inscription/Etape3Chef";
import Etape4Membres from "@/components/inscription/Etape4Membres";
import Etape5Projet from "@/components/inscription/Etape5Projet";
import Etape6Profil from "@/components/inscription/Etape6Profil";
import Etape7Motivation from "@/components/inscription/Etape7Motivation";
import Etape8Confirmation from "@/components/inscription/Etape8Confirmation";
import { InscriptionData, defaultInscriptionData } from "@/types/inscription";
import { supabase } from "@/integrations/supabase/client";

const stepLabels = ["Participation", "Candidature", "Chef", "Membres", "Projet", "Profil", "Motivation", "Confirmation"];

// Fonctions de validation
const validatePhone = (tel: string) => {
  const cleaned = tel.trim().replace(/\s/g, ''); // Enlever tous les espaces
  // Formats sénégalais acceptés: 77, 76, 78, 70, 75 (+9 chiffres)
  return /^(77|76|78|70|75)[0-9]{7}$/.test(cleaned);
};
const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return false;
  }
  // Vérifications supplémentaires pour être plus précis
  const emailLower = email.trim().toLowerCase();
  if (emailLower.length < 5) return false; // Trop court
  if (emailLower.includes('..')) return false; // Double point
  if (emailLower.startsWith('.') || emailLower.endsWith('.')) return false; // Point au début/fin
  return true;
};
const wordCount = (text: string) => text.trim() === '' ? 0 : text.trim().split(/\s+/).length;

const validateStep = (step: number, formData: InscriptionData) => {
  const errors: Record<string, string> = {};

  switch (step) {
    case 0:
      if (!formData.accepte_conditions) 
        errors.accepte_conditions = '❌ Vous devez accepter les termes et conditions pour continuer';
      if (!formData.autorise_photos) 
        errors.autorise_photos = '❌ Vous devez autoriser l\'utilisation de vos photos pour participer';
      break;

    case 1:
      if (!formData.type_candidature) 
        errors.type_candidature = '🎯 Veuillez choisir entre "Individuel" ou "Équipe"';
      if (formData.type_candidature === 'equipe' && !formData.nom_equipe.trim())
        errors.nom_equipe = '📝 Le nom de votre équipe est obligatoire (ex: "Les Innovateurs")';
      break;

    case 2:
      if (!formData.chef.nom_prenom.trim()) 
        errors.nom_prenom = '👤 Veuillez entrer votre nom complet (ex: "Aminata Diallo")';
      if (!formData.chef.genre) 
        errors.genre = '⚧ Veuillez sélectionner votre genre pour continuer';
      if (!formData.chef.filiere.trim()) 
        errors.filiere = '📚 Veuillez indiquer votre filière (ex: "Informatique L3")';
      if (!formData.chef.niveau_etudes) 
        errors.niveau_etudes = '🎓 Veuillez sélectionner votre niveau d\'études';
      if (!validatePhone(formData.chef.telephone)) 
        errors.telephone = '📱 Format invalide. Exemples: 771234567 ou 761234567 (9 chiffres)';
      if (!validateEmail(formData.chef.email)) 
        errors.email = '📧 Email invalide. Format: nom.prenom@domaine.extension (ex: aminata.diallo@esmt.sn)';
      if (!formData.chef.etablissement.trim()) 
        errors.etablissement = '🏫 Veuillez indiquer votre établissement (ex: "ESMT Dakar")';
      if (formData.chef.competences.includes('Autre') && !formData.chef.competence_autre.trim())
        errors.competence_autre = '💡 Veuillez décrire votre compétence spécifique';
      if (formData.chef.competences.length === 0)
        errors.competences = '🛠️ Veuillez sélectionner au moins une compétence principale';
      if (formData.chef.disponible_2_jours === null) 
        errors.disponible_2_jours = '📅 Veuillez confirmer votre disponibilité';
      if (formData.chef.disponible_2_jours === false) 
        errors.disponible_2_jours = '⛔ La présence les 2 jours est obligatoire pour participer';
      break;

    case 3:
      formData.membres.forEach((m, i) => {
        const membreNum = i + 2; // Membre 2, 3, 4...
        if (!m.nom_prenom.trim()) 
          errors[`m${i}_nom`] = `👤 Membre ${membreNum}: Veuillez entrer le nom complet`;
        if (!m.genre) 
          errors[`m${i}_genre`] = `⚧ Membre ${membreNum}: Veuillez sélectionner le genre`;
        if (!m.filiere.trim()) 
          errors[`m${i}_filiere`] = `📚 Membre ${membreNum}: Veuillez indiquer la filière`;
        if (!m.niveau_etudes) 
          errors[`m${i}_niveau`] = `🎓 Membre ${membreNum}: Veuillez sélectionner le niveau d'études`;
        if (!validatePhone(m.telephone)) 
          errors[`m${i}_tel`] = `📱 Membre ${membreNum}: Format invalide (9 chiffres requis)`;
        if (!validateEmail(m.email)) 
          errors[`m${i}_email`] = `📧 Membre ${membreNum}: Email invalide. Format: nom@domaine.extension`;
        if (!m.etablissement.trim()) 
          errors[`m${i}_etablissement`] = `🏫 Membre ${membreNum}: Veuillez indiquer l'établissement`;
        if (!m.role_equipe) 
          errors[`m${i}_role`] = `🎭 Membre ${membreNum}: Veuillez choisir un rôle dans l'équipe`;
        if (m.role_equipe === 'Autre' && !(m as any).role_autre?.trim())
          errors[`m${i}_role_autre`] = `💡 Membre ${membreNum}: Veuillez décrire ce rôle`;
        if (m.disponible_2_jours === null) 
          errors[`m${i}_dispo`] = `📅 Membre ${membreNum}: Veuillez confirmer la disponibilité`;
        if (m.disponible_2_jours === false) 
          errors[`m${i}_dispo`] = `⛔ Membre ${membreNum}: Doit être disponible les 2 jours`;
      });
      break;

    case 4:
      if (!formData.a_projet) 
        errors.a_projet = '💡 Veuillez indiquer si vous avez déjà une idée de projet';
      if (formData.a_projet === 'oui') {
        if (!formData.nom_projet.trim()) 
          errors.nom_projet = '📝 Veuillez donner un nom à votre projet (ex: "EduTech Solution")';
        if (!formData.domaine_projet) 
          errors.domaine_projet = '🎯 Veuillez choisir le domaine de votre projet';
        if (formData.domaine_projet === 'Autre' && !formData.domaine_projet_autre.trim())
          errors.domaine_projet_autre = '💡 Veuillez préciser dans quel domaine s\'inscrit votre projet';
        if (!formData.problematique.trim()) 
          errors.problematique = '❓ Veuillez décrire le problème que votre projet résout';
        if (!formData.solution.trim()) 
          errors.solution = '💡 Veuillez expliquer votre solution proposée';
        if (wordCount(formData.solution) > 250) 
          errors.solution = `📝 Trop long (${wordCount(formData.solution)}/250 mots). Soyez plus concis`;
      }
      break;

    case 5:
      if (!formData.niveau_technique) 
        errors.niveau_technique = '🛠️ Veuillez évaluer votre niveau technique global';
      break;

    case 6:
      if (!formData.motivation.trim()) 
        errors.motivation = '❤️ Veuillez expliquer pourquoi vous voulez participer au hackathon';
      if (wordCount(formData.motivation) > 250) 
        errors.motivation = `📝 Trop long (${wordCount(formData.motivation)}/250 mots). Réduisez votre texte`;
      if (!formData.esperances.trim()) 
        errors.esperances = '🌟 Veuillez partager ce que vous attendez de cette expérience';
      if (!formData.source_info) 
        errors.source_info = '📢 Veuillez indiquer comment vous avez connu le hackathon';
      break;
  }

  return { isValid: Object.keys(errors).length === 0, errors };
};

const Inscription = () => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<InscriptionData>(defaultInscriptionData);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onChange = (partial: Partial<InscriptionData>) => {
    setData((prev) => ({ ...prev, ...partial }));
    // Effacer les erreurs quand l'utilisateur modifie les champs
    setErrors({});
  };

  const nextStep = () => {
    const validation = validateStep(step, data);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      toast.error("Veuillez corriger les erreurs avant de continuer");
      return;
    }

    let next = step + 1;
    
    // Skip étape 4 si candidature individuelle
    if (next === 3 && data.type_candidature === 'individuel') next = 4;
    
    if (next === 7) {
      handleSubmit();
    } else {
      setStep(next);
    }
  };

  const prevStep = () => {
    let prev = step - 1;
    if (prev === 3 && data.type_candidature === 'individuel') prev = 2;
    setStep(prev);
    setErrors({});
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // 1. Insérer l'équipe
      const { data: equipe, error: equipeError } = await supabase
        .from('equipes')
        .insert({
          type_candidature: data.type_candidature,
          nom_equipe: data.nom_equipe || null,
          nombre_membres: data.nombre_membres,
          a_projet: data.a_projet,
          nom_projet: data.nom_projet || null,
          domaine_projet: data.domaine_projet || null,
          domaine_projet_autre: data.domaine_projet_autre || null,
          problematique: data.problematique || null,
          solution: data.solution || null,
          technologies: data.technologies || null,
          niveau_avancement: data.niveau_avancement || null,
          contraintes_techniques: data.contraintes_techniques || null,
          niveau_technique: data.niveau_technique,
          motivation: data.motivation,
          esperances: data.esperances,
          source_info: data.source_info,
          statut: 'en_attente',
        })
        .select()
        .single();

      if (equipeError) throw equipeError;

      // 2. Insérer le chef
      const { error: chefError } = await supabase
        .from('membres')
        .insert({
          equipe_id: equipe.id,
          est_chef: true,
          accepte_conditions: data.accepte_conditions,
          autorise_photos: data.autorise_photos,
          nom_prenom: data.chef.nom_prenom,
          genre: data.chef.genre,
          filiere: data.chef.filiere,
          niveau_etudes: data.chef.niveau_etudes,
          telephone: data.chef.telephone,
          email: data.chef.email,
          etablissement: data.chef.etablissement,
          competences: data.chef.competences,
          competence_autre: data.chef.competence_autre || null,
          disponible_2_jours: data.chef.disponible_2_jours,
        });

      if (chefError) throw chefError;

      // 3. Insérer les membres (si équipe)
      if (data.type_candidature === 'equipe') {
        for (const membre of data.membres) {
          const { error: membreError } = await supabase
            .from('membres')
            .insert({
              equipe_id: equipe.id,
              est_chef: false,
              nom_prenom: membre.nom_prenom,
              genre: membre.genre,
              filiere: membre.filiere,
              niveau_etudes: membre.niveau_etudes,
              role_equipe: membre.role_equipe,
              telephone: membre.telephone,
              email: membre.email,
              etablissement: membre.etablissement,
              competences: membre.competences,
              competence_autre: membre.competence_autre || null,
              disponible_2_jours: membre.disponible_2_jours,
            });
          if (membreError) throw membreError;
        }
      }

      // Succès
      setStep(7); // Aller à l'étape de confirmation
      setSubmitted(true);
      toast.success('Candidature soumise avec succès !');

    } catch (error: any) {
      console.error(error);
      toast.error('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    const stepProps = { data, onChange, errors };
    
    switch (step) {
      case 0: return <Etape1Couverture {...stepProps} />;
      case 1: return <Etape2TypeCandidature {...stepProps} />;
      case 2: return <Etape3Chef {...stepProps} />;
      case 3: return <Etape4Membres {...stepProps} />;
      case 4: return <Etape5Projet {...stepProps} />;
      case 5: return <Etape6Profil {...stepProps} />;
      case 6: return <Etape7Motivation {...stepProps} />;
      case 7: return <Etape8Confirmation data={data} />;
      default: return null;
    }
  };

  return (
    <Layout>
      <div className="container max-w-2xl py-8 sm:py-12">
        {!submitted && (
          <StepIndicator currentStep={step} totalSteps={8} labels={stepLabels} />
        )}

        <div className="rounded-2xl border border-[#E9ECEF] bg-white p-6 sm:p-8 shadow-lg">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>

          {!submitted && (
            <div className="mt-8 flex items-center justify-between">
              {step > 0 ? (
                <button onClick={prevStep}
                  className="flex items-center gap-2 rounded-lg border border-[#E9ECEF] px-4 py-2 text-sm font-medium text-[#6C757D] transition-colors hover:bg-[#F8F9FA]">
                  <ArrowLeft size={16} /> Précédent
                </button>
              ) : <div />}

              <button
                onClick={nextStep}
                disabled={loading || (step === 2 && data.chef.disponible_2_jours === false)}
                className="btn-premium flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : null}
                {step === 6 ? 'Envoyer la candidature' : 'Suivant'}
                {step < 6 && <ArrowRight size={16} />}
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Inscription;
