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
  return /^\+?[0-9]{9,15}$/.test(cleaned);
};
const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
const wordCount = (text: string) => text.trim() === '' ? 0 : text.trim().split(/\s+/).length;

const validateStep = (step: number, formData: InscriptionData) => {
  const errors: Record<string, string> = {};

  switch (step) {
    case 0:
      if (!formData.accepte_conditions) errors.accepte_conditions = 'Obligatoire';
      if (!formData.autorise_photos) errors.autorise_photos = 'Obligatoire';
      break;

    case 1:
      if (!formData.type_candidature) errors.type_candidature = 'Veuillez choisir un type de candidature';
      if (formData.type_candidature === 'equipe' && !formData.nom_equipe.trim())
        errors.nom_equipe = 'Le nom de l\'équipe est obligatoire';
      break;

    case 2:
      if (!formData.chef.nom_prenom.trim()) errors.nom_prenom = 'Obligatoire';
      if (!formData.chef.genre) errors.genre = 'Veuillez sélectionner votre genre';
      if (!formData.chef.filiere.trim()) errors.filiere = 'Obligatoire';
      if (!formData.chef.niveau_etudes) errors.niveau_etudes = 'Obligatoire';
      if (!validatePhone(formData.chef.telephone)) errors.telephone = 'Numéro invalide. Format attendu : +221 77 000 00 00';
      if (!validateEmail(formData.chef.email)) errors.email = 'Adresse email invalide';
      if (!formData.chef.etablissement.trim()) errors.etablissement = 'Obligatoire';
      if (formData.chef.competences.includes('Autre') && !formData.chef.competence_autre.trim())
        errors.competence_autre = 'Veuillez préciser votre compétence';
      if (formData.chef.disponible_2_jours === null) errors.disponible_2_jours = 'Obligatoire';
      if (formData.chef.disponible_2_jours === false) errors.disponible_2_jours = 'Bloquant';
      break;

    case 3:
      formData.membres.forEach((m, i) => {
        if (!m.nom_prenom.trim()) errors[`m${i}_nom`] = 'Obligatoire';
        if (!m.genre) errors[`m${i}_genre`] = 'Obligatoire';
        if (!m.filiere.trim()) errors[`m${i}_filiere`] = 'Obligatoire';
        if (!m.niveau_etudes) errors[`m${i}_niveau`] = 'Obligatoire';
        if (!m.role_equipe) errors[`m${i}_role`] = 'Obligatoire';
        if (!validatePhone(m.telephone)) errors[`m${i}_tel`] = 'Numéro invalide';
        if (!validateEmail(m.email)) errors[`m${i}_email`] = 'Email invalide';
        if (!m.etablissement.trim()) errors[`m${i}_etablissement`] = 'Obligatoire';
        if (m.competences.includes('Autre') && !m.competence_autre.trim())
          errors[`m${i}_competence_autre`] = 'Obligatoire';
        if (m.disponible_2_jours === null) errors[`m${i}_dispo`] = 'Obligatoire';
        if (m.disponible_2_jours === false) errors[`m${i}_dispo`] = 'Bloquant';
      });
      break;

    case 4:
      if (!formData.a_projet) errors.a_projet = 'Obligatoire';
      if (formData.a_projet === 'oui') {
        if (!formData.nom_projet.trim()) errors.nom_projet = 'Obligatoire';
        if (!formData.domaine_projet) errors.domaine_projet = 'Obligatoire';
        if (formData.domaine_projet === 'Autre' && !formData.domaine_projet_autre.trim())
          errors.domaine_projet_autre = 'Veuillez préciser le domaine';
        if (!formData.problematique.trim()) errors.problematique = 'Obligatoire';
        if (!formData.solution.trim()) errors.solution = 'Obligatoire';
        if (wordCount(formData.solution) > 150) errors.solution = 'Maximum 150 mots';
      }
      break;

    case 5:
      if (!formData.niveau_technique) errors.niveau_technique = 'Veuillez sélectionner un niveau technique';
      break;

    case 6:
      if (!formData.motivation.trim()) errors.motivation = 'Obligatoire';
      if (wordCount(formData.motivation) > 250) errors.motivation = 'Maximum 250 mots';
      if (!formData.esperances.trim()) errors.esperances = 'Obligatoire';
      if (!formData.source_info) errors.source_info = 'Ce champ est obligatoire';
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
