import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/layout/AdminLayout";
import { toast } from "sonner";
import { Plus, Trash2, Save } from "lucide-react";

const GestionAnnonces = () => {
  const queryClient = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ titre: '', contenu: '' });

  const { data: items } = useQuery({
    queryKey: ["admin-annonces"],
    queryFn: async () => {
      const { data, error } = await supabase.from("annonces").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const add = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("annonces").insert({ ...form });
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-annonces"] }); setShowAdd(false); setForm({ titre: '', contenu: '' }); toast.success("Annonce publiée"); },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("annonces").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-annonces"] }); toast.success("Supprimée"); },
  });

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold">Gestion Annonces</h1>
        <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          <Plus size={16} /> Publier
        </button>
      </div>

      {showAdd && (
        <div className="rounded-xl border border-border bg-card p-4 mb-6 space-y-3">
          <input placeholder="Titre" value={form.titre} onChange={(e) => setForm({ ...form, titre: e.target.value })}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
          <textarea placeholder="Contenu" value={form.contenu} onChange={(e) => setForm({ ...form, contenu: e.target.value })}
            rows={4} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm resize-none" />
          <button onClick={() => add.mutate()} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
            <Save size={14} className="inline mr-1" /> Publier
          </button>
        </div>
      )}

      <div className="space-y-3">
        {items?.map((item) => (
          <div key={item.id} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium">{item.titre}</h3>
                <p className="text-sm text-muted-foreground mt-1">{item.contenu}</p>
                <p className="text-xs text-muted-foreground mt-2">{new Date(item.created_at!).toLocaleDateString('fr-FR')}</p>
              </div>
              <button onClick={() => remove.mutate(item.id)} className="text-destructive hover:bg-destructive/10 rounded p-1.5 shrink-0">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
};

export default GestionAnnonces;
