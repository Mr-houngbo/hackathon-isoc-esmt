import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/layout/AdminLayout";
import { toast } from "sonner";
import { Plus, Trash2, Edit2, Save, X } from "lucide-react";

const GestionAgenda = () => {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ jour: 1, heure_debut: '', heure_fin: '', titre: '', description: '', lieu: '' });
  const [showAdd, setShowAdd] = useState(false);

  const { data: items } = useQuery({
    queryKey: ["admin-agenda"],
    queryFn: async () => {
      const { data, error } = await supabase.from("agenda").select("*").order("jour").order("heure_debut");
      if (error) throw error;
      return data;
    },
  });

  const addItem = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("agenda").insert({ ...form });
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-agenda"] }); setShowAdd(false); setForm({ jour: 1, heure_debut: '', heure_fin: '', titre: '', description: '', lieu: '' }); toast.success("Ajouté"); },
  });

  const deleteItem = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("agenda").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-agenda"] }); toast.success("Supprimé"); },
  });

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold">Gestion de l'agenda</h1>
        <button onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          <Plus size={16} /> Ajouter
        </button>
      </div>

      {showAdd && (
        <div className="rounded-xl border border-border bg-card p-4 mb-6 space-y-3">
          <div className="grid sm:grid-cols-3 gap-3">
            <select value={form.jour} onChange={(e) => setForm({ ...form, jour: Number(e.target.value) })}
              className="rounded-lg border border-input bg-background px-3 py-2 text-sm">
              <option value={1}>Jour 1</option>
              <option value={2}>Jour 2</option>
            </select>
            <input placeholder="Heure début" value={form.heure_debut} onChange={(e) => setForm({ ...form, heure_debut: e.target.value })}
              className="rounded-lg border border-input bg-background px-3 py-2 text-sm" />
            <input placeholder="Heure fin" value={form.heure_fin} onChange={(e) => setForm({ ...form, heure_fin: e.target.value })}
              className="rounded-lg border border-input bg-background px-3 py-2 text-sm" />
          </div>
          <input placeholder="Titre" value={form.titre} onChange={(e) => setForm({ ...form, titre: e.target.value })}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
          <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
          <input placeholder="Lieu" value={form.lieu} onChange={(e) => setForm({ ...form, lieu: e.target.value })}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
          <button onClick={() => addItem.mutate()} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
            <Save size={14} className="inline mr-1" /> Enregistrer
          </button>
        </div>
      )}

      {[1, 2].map((jour) => (
        <div key={jour} className="mb-6">
          <h2 className="font-display font-semibold mb-3">Jour {jour}</h2>
          <div className="space-y-2">
            {items?.filter((i) => i.jour === jour).map((item) => (
              <div key={item.id} className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 text-sm">
                <span className="min-w-[60px] text-muted-foreground">{item.heure_debut}</span>
                <span className="flex-1 font-medium">{item.titre}</span>
                <button onClick={() => deleteItem.mutate(item.id)} className="text-destructive hover:bg-destructive/10 rounded p-1">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </AdminLayout>
  );
};

export default GestionAgenda;
