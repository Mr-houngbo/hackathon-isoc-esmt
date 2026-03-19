import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/layout/AdminLayout";
import { toast } from "sonner";
import { Eye, Check, X } from "lucide-react";
import { useState } from "react";

const GestionInscriptions = () => {
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<string | null>(null);

  const { data: equipes, isLoading } = useQuery({
    queryKey: ["admin-equipes-full"],
    queryFn: async () => {
      const { data, error } = await supabase.from("equipes").select("*, membres(*)").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const toggleSelection = useMutation({
    mutationFn: async ({ id, selectionnee }: { id: string; selectionnee: boolean }) => {
      const { error } = await supabase.from("equipes").update({ selectionnee }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-equipes-full"] });
      toast.success("Statut mis à jour");
    },
  });

  const selectedEquipe = equipes?.find((e) => e.id === selected);

  return (
    <AdminLayout>
      <h1 className="font-display text-2xl font-bold mb-6">Gestion des inscriptions</h1>

      {isLoading ? (
        <div className="flex justify-center py-10"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-2 font-medium text-muted-foreground">Sélection</th>
                  <th className="pb-2 font-medium text-muted-foreground">Équipe</th>
                  <th className="pb-2 font-medium text-muted-foreground">Type</th>
                  <th className="pb-2 font-medium text-muted-foreground">Membres</th>
                  <th className="pb-2 font-medium text-muted-foreground">Projet</th>
                  <th className="pb-2 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {equipes?.map((eq) => (
                  <tr key={eq.id} className="border-b border-border/50 hover:bg-muted/50">
                    <td className="py-2">
                      <button onClick={() => toggleSelection.mutate({ id: eq.id, selectionnee: !eq.selectionnee })}
                        className={`flex h-6 w-6 items-center justify-center rounded border-2 transition-colors ${
                          eq.selectionnee ? 'border-green-500 bg-green-500' : 'border-border'
                        }`}>
                        {eq.selectionnee && <Check size={14} className="text-primary-foreground" />}
                      </button>
                    </td>
                    <td className="py-2 font-medium">{eq.nom_equipe || "Individuel"}</td>
                    <td className="py-2 capitalize">{eq.type_candidature}</td>
                    <td className="py-2">{(eq.membres as any[])?.length || 0}</td>
                    <td className="py-2 max-w-[150px] truncate">{eq.nom_projet || "—"}</td>
                    <td className="py-2">
                      <button onClick={() => setSelected(eq.id)}
                        className="rounded p-1 text-muted-foreground hover:text-primary hover:bg-muted transition-colors">
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selectedEquipe && (
            <div className="rounded-xl border border-border bg-card p-5 shadow-card space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-semibold">{selectedEquipe.nom_equipe || "Individuel"}</h3>
                <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground"><X size={16} /></button>
              </div>
              <div className="space-y-2 text-sm">
                <p><span className="text-muted-foreground">Type :</span> {selectedEquipe.type_candidature}</p>
                <p><span className="text-muted-foreground">Projet :</span> {selectedEquipe.nom_projet || "Non défini"}</p>
                <p><span className="text-muted-foreground">Problématique :</span> {selectedEquipe.problematique || "—"}</p>
                <p><span className="text-muted-foreground">Solution :</span> {selectedEquipe.solution || "—"}</p>
                <p><span className="text-muted-foreground">Niveau :</span> {selectedEquipe.niveau_technique || "—"}</p>
                <p><span className="text-muted-foreground">Motivation :</span> {selectedEquipe.motivation || "—"}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Membres</h4>
                {(selectedEquipe.membres as any[])?.map((m: any) => (
                  <div key={m.id} className="rounded-lg bg-muted p-2 mb-1 text-sm">
                    <span className="font-medium">{m.nom_prenom}</span>
                    {m.est_chef && <span className="ml-1 text-xs text-primary">(Chef)</span>}
                    <br />
                    <span className="text-xs text-muted-foreground">{m.filiere} • {m.email}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  );
};

export default GestionInscriptions;
