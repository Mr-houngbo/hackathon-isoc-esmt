import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import { CheckCircle, User, BookOpen, Mail } from "lucide-react";

const ProfilParticipant = () => {
  const { id } = useParams<{ id: string }>();

  const { data: membre, isLoading } = useQuery({
    queryKey: ["participant", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("membres")
        .select("*, equipes(*)")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) return (
    <Layout>
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    </Layout>
  );

  if (!membre) return (
    <Layout>
      <div className="text-center py-20 text-muted-foreground">Participant non trouvé.</div>
    </Layout>
  );

  const equipe = membre.equipes as any;

  return (
    <Layout>
      <div className="container max-w-lg py-12">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-card text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="font-display text-2xl font-bold">{membre.nom_prenom}</h1>
          <p className="text-sm text-muted-foreground mt-1">Participant sélectionné — 2ème Hackathon ISOC-ESMT 2026</p>

          <div className="mt-6 space-y-3 text-left text-sm">
            {equipe?.nom_equipe && (
              <div className="flex items-center gap-2 rounded-lg bg-muted p-3">
                <User size={14} className="text-primary" /> Équipe : <span className="font-medium">{equipe.nom_equipe}</span>
              </div>
            )}
            <div className="flex items-center gap-2 rounded-lg bg-muted p-3">
              <BookOpen size={14} className="text-primary" /> Filière : <span className="font-medium">{membre.filiere}</span>
            </div>
            {membre.etablissement && (
              <div className="flex items-center gap-2 rounded-lg bg-muted p-3">
                <Mail size={14} className="text-primary" /> Établissement : <span className="font-medium">{membre.etablissement}</span>
              </div>
            )}
            {membre.est_chef && (
              <div className="rounded-lg bg-primary/10 p-3 text-center text-primary font-medium">
                Chef de projet
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilParticipant;
