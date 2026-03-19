import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/layout/AdminLayout";
import { toast } from "sonner";
import { Plus, Trash2, Save } from "lucide-react";

const GestionPartenaires = () => {
  const queryClient = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ nom: '', logo_url: '', niveau: 'bronze' as string, site_url: '' });

  const { data: items } = useQuery({
    queryKey: ["admin-partenaires"],
    queryFn: async () => {
      const { data, error } = await supabase.from("partenaires").select("*").order("created_at");
      if (error) throw error;
      return data;
    },
  });

  const add = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("partenaires").insert({ ...form });
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-partenaires"] }); setShowAdd(false); setForm({ nom: '', logo_url: '', niveau: 'bronze', site_url: '' }); toast.success("Ajouté"); },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("partenaires").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-partenaires"] }); toast.success("Supprimé"); },
  });

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold">Gestion Partenaires</h1>
        <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          <Plus size={16} /> Ajouter
        </button>
      </div>

      {showAdd && (
        <div className="rounded-xl border border-border bg-card p-4 mb-6 space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <input placeholder="Nom" value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })}
              className="rounded-lg border border-input bg-background px-3 py-2 text-sm" />
            <select value={form.niveau} onChange={(e) => setForm({ ...form, niveau: e.target.value })}
              className="rounded-lg border border-input bg-background px-3 py-2 text-sm">
              <option value="or">Or</option>
              <option value="argent">Argent</option>
              <option value="bronze">Bronze</option>
            </select>
          </div>
          <input placeholder="URL Logo" value={form.logo_url} onChange={(e) => setForm({ ...form, logo_url: e.target.value })}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
          <input placeholder="Site web" value={form.site_url} onChange={(e) => setForm({ ...form, site_url: e.target.value })}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
          <button onClick={() => add.mutate()} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
            <Save size={14} className="inline mr-1" /> Enregistrer
          </button>
        </div>
      )}

      <div className="space-y-3">
        {items?.map((p) => (
          <div key={p.id} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
            <div className="flex-1">
              <p className="font-medium">{p.nom}</p>
              <span className="text-xs text-muted-foreground capitalize">{p.niveau}</span>
            </div>
            <button onClick={() => remove.mutate(p.id)} className="text-destructive hover:bg-destructive/10 rounded p-1.5">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
};

export default GestionPartenaires;
