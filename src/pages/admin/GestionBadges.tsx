import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/layout/AdminLayout";
import { BadgeCheck, Award } from "lucide-react";

const GestionBadges = () => {
  const { data: equipes } = useQuery({
    queryKey: ["admin-equipes-badges"],
    queryFn: async () => {
      const { data, error } = await supabase.from("equipes").select("*, membres(*)").eq("selectionnee", true);
      if (error) throw error;
      return data;
    },
  });

  return (
    <AdminLayout>
      <h1 className="font-display text-2xl font-bold mb-6">Badges & Certificats</h1>

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-center gap-3 mb-4">
            <BadgeCheck className="h-8 w-8 text-primary" />
            <div>
              <h2 className="font-display font-semibold">Badges participants</h2>
              <p className="text-xs text-muted-foreground">Générer les badges pour les équipes sélectionnées</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            {equipes?.length || 0} équipe(s) sélectionnée(s) •{" "}
            {equipes?.reduce((acc, e) => acc + ((e.membres as any[])?.length || 0), 0) || 0} participant(s)
          </p>
          <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground opacity-70 cursor-not-allowed" disabled>
            Générer les badges (bientôt disponible)
          </button>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-center gap-3 mb-4">
            <Award className="h-8 w-8 text-accent" />
            <div>
              <h2 className="font-display font-semibold">Certificats</h2>
              <p className="text-xs text-muted-foreground">Générer les certificats post-hackathon</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Certificats de participation et de lauréat
          </p>
          <button className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground opacity-70 cursor-not-allowed" disabled>
            Générer les certificats (bientôt disponible)
          </button>
        </div>
      </div>

      {equipes && equipes.length > 0 && (
        <div className="mt-8">
          <h2 className="font-display font-semibold mb-4">Équipes sélectionnées</h2>
          <div className="space-y-2">
            {equipes.map((eq) => (
              <div key={eq.id} className="rounded-lg border border-border bg-card p-3 text-sm">
                <span className="font-medium">{eq.nom_equipe || "Individuel"}</span>
                <span className="text-muted-foreground ml-2">
                  ({(eq.membres as any[])?.length || 0} membres)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default GestionBadges;
