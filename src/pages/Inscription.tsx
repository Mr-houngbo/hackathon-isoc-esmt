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

const stepLabels = ["Conditions", "Candidature", "Chef", "Membres", "Projet", "Profil", "Motivation", "Confirmation"];

const Inscription = () => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<InscriptionData>(defaultInscriptionData);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const onChange = (partial: Partial<InscriptionData>) => setData((prev) => ({ ...prev, ...partial }));

  const effectiveStep = () => {
    if (step === 3 && data.type_candidature === 'individuel') return -1; // skip
    return step;
  };

  const canNext = (): boolean => {
    switch (step) {
      case 0: return data.accepte_conditions && data.autorise_photos;
      case 1: return data.type_candidature === 'individuel' || (!!data.nom_equipe && data.nombre_membres >= 2);
      case 2: return !!data.chef_nom_prenom && !!data.chef_filiere && !!data.chef_telephone && !!data.chef_email && !!data.chef_etablissement && data.chef_disponible === true;
      case 3: return data.type_candidature === 'individuel' || data.membres.every(m => !!m.nom_prenom && !!m.filiere && !!m.telephone && !!m.email && m.disponible === true);
      case 4: return !!data.a_projet && !!data.problematique;
      case 5: return !!data.niveau_technique;
      case 6: return !!data.motivation && !!data.esperances;
      default: return true;
    }
  };

  const nextStep = () => {
    let next = step + 1;
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
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data: equipe, error: eqErr } = await supabase.from('equipes').insert({
        type_candidature: data.type_candidature,
        nom_equipe: data.type_candidature === 'equipe' ? data.nom_equipe : null,
        nombre_membres: data.type_candidature === 'equipe' ? data.nombre_membres : 1,
        a_projet: data.a_projet || null,
        nom_projet: data.nom_projet || null,
        domaine_projet: data.domaine_projet || null,
        problematique: data.problematique || null,
        solution: data.solution || null,
        technologies: data.technologies || null,
        niveau_avancement: data.niveau_avancement || null,
        contraintes_techniques: data.contraintes_techniques || null,
        niveau_technique: data.niveau_technique || null,
        competences_equipe: data.competences_equipe.length > 0 ? data.competences_equipe : null,
        handle_instagram: data.handle_instagram || null,
        handle_linkedin: data.handle_linkedin || null,
        motivation: data.motivation || null,
        esperances: data.esperances || null,
        source_info: data.source_info || null,
      }).select().single();

      if (eqErr) throw eqErr;

      // Insert chef
      const { error: chefErr } = await supabase.from('membres').insert({
        equipe_id: equipe.id,
        est_chef: true,
        nom_prenom: data.chef_nom_prenom,
        genre: data.chef_genre || null,
        filiere: data.chef_filiere,
        niveau_etudes: data.chef_niveau_etudes || null,
        telephone: data.chef_telephone,
        email: data.chef_email,
        etablissement: data.chef_etablissement,
        competences: data.chef_competences.length > 0 ? data.chef_competences : null,
        role_equipe: 'Chef de projet',
        disponible_2_jours: true,
        accepte_conditions: data.accepte_conditions,
        autorise_photos: data.autorise_photos,
      });

      if (chefErr) throw chefErr;

      // Insert team members
      if (data.type_candidature === 'equipe' && data.membres.length > 0) {
        const membresData = data.membres.map((m) => ({
          equipe_id: equipe.id,
          est_chef: false,
          nom_prenom: m.nom_prenom,
          genre: m.genre || null,
          filiere: m.filiere,
          niveau_etudes: m.niveau_etudes || null,
          telephone: m.telephone,
          email: m.email,
          etablissement: m.etablissement || 'ESMT',
          role_equipe: m.role_equipe || null,
          disponible_2_jours: true,
          accepte_conditions: data.accepte_conditions,
          autorise_photos: data.autorise_photos,
        }));

        const { error: memErr } = await supabase.from('membres').insert(membresData);
        if (memErr) throw memErr;
      }

      setSubmitted(true);
      setStep(7);
      toast.success("Candidature envoyée avec succès !");
    } catch (err: any) {
      toast.error("Erreur lors de l'envoi : " + (err.message || "Veuillez réessayer."));
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0: return <Etape1Couverture data={data} onChange={onChange} />;
      case 1: return <Etape2TypeCandidature data={data} onChange={onChange} />;
      case 2: return <Etape3Chef data={data} onChange={onChange} />;
      case 3: return <Etape4Membres data={data} onChange={onChange} />;
      case 4: return <Etape5Projet data={data} onChange={onChange} />;
      case 5: return <Etape6Profil data={data} onChange={onChange} />;
      case 6: return <Etape7Motivation data={data} onChange={onChange} />;
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

        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-card">
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
                  className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted">
                  <ArrowLeft size={16} /> Précédent
                </button>
              ) : <div />}

              <button
                onClick={nextStep}
                disabled={!canNext() || loading}
                className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
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
