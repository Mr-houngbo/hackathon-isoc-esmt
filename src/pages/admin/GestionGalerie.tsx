import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/layout/AdminLayout";
import { toast } from "sonner";
import { Plus, Trash2, Save } from "lucide-react";

const GestionGalerie = () => {
  const queryClient = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ titre_projet: '', description: '', photo_url: '' });

  const { data: items } = useQuery({
    queryKey: ["admin-galerie"],
    queryFn: async () => {
      const { data, error } = await supabase.from("galerie").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const add = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("galerie").insert({ ...form });
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-galerie"] }); setShowAdd(false); setForm({ titre_projet: '', description: '', photo_url: '' }); toast.success("Ajouté"); },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("galerie").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-galerie"] }); toast.success("Supprimé"); },
  });

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold">Gestion Galerie</h1>
        <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          <Plus size={16} /> Ajouter
        </button>
      </div>

      {showAdd && (
        <div className="rounded-xl border border-border bg-card p-4 mb-6 space-y-3">
          <input placeholder="Titre du projet" value={form.titre_projet} onChange={(e) => setForm({ ...form, titre_projet: e.target.value })}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={2} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm resize-none" />
          <input placeholder="URL Photo" value={form.photo_url} onChange={(e) => setForm({ ...form, photo_url: e.target.value })}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
          <button onClick={() => add.mutate()} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
            <Save size={14} className="inline mr-1" /> Enregistrer
          </button>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items?.map((item) => (
          <div key={item.id} className="rounded-xl border border-border bg-card overflow-hidden">
            {item.photo_url && <img src={item.photo_url} alt={item.titre_projet} className="w-full h-40 object-cover" />}
            <div className="p-3 flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">{item.titre_projet}</p>
                {item.description && <p className="text-xs text-muted-foreground truncate">{item.description}</p>}
              </div>
              <button onClick={() => remove.mutate(item.id)} className="text-destructive hover:bg-destructive/10 rounded p-1">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
};

export default GestionGalerie;
