import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/layout/AdminLayout";
import { toast } from "sonner";
import { Plus, Trash2, Save } from "lucide-react";

const GestionMentors = () => {
  const queryClient = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ nom: '', titre: '', entreprise: '', photo_url: '', type: 'mentor' as string });

  const { data: mentors } = useQuery({
    queryKey: ["admin-mentors"],
    queryFn: async () => {
      const { data, error } = await supabase.from("mentors").select("*").order("nom");
      if (error) throw error;
      return data;
    },
  });

  const addMentor = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("mentors").insert({ ...form });
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-mentors"] }); setShowAdd(false); setForm({ nom: '', titre: '', entreprise: '', photo_url: '', type: 'mentor' }); toast.success("Ajouté"); },
  });

  const deleteMentor = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("mentors").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-mentors"] }); toast.success("Supprimé"); },
  });

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold">Gestion Mentors & Jury</h1>
        <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          <Plus size={16} /> Ajouter
        </button>
      </div>

      {showAdd && (
        <div className="rounded-xl border border-border bg-card p-4 mb-6 space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <input placeholder="Nom" value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })}
              className="rounded-lg border border-input bg-background px-3 py-2 text-sm" />
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="rounded-lg border border-input bg-background px-3 py-2 text-sm">
              <option value="mentor">Mentor</option>
              <option value="jury">Jury</option>
            </select>
            <input placeholder="Titre/Poste" value={form.titre} onChange={(e) => setForm({ ...form, titre: e.target.value })}
              className="rounded-lg border border-input bg-background px-3 py-2 text-sm" />
            <input placeholder="Entreprise" value={form.entreprise} onChange={(e) => setForm({ ...form, entreprise: e.target.value })}
              className="rounded-lg border border-input bg-background px-3 py-2 text-sm" />
          </div>
          <input placeholder="URL Photo" value={form.photo_url} onChange={(e) => setForm({ ...form, photo_url: e.target.value })}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
          <button onClick={() => addMentor.mutate()} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
            <Save size={14} className="inline mr-1" /> Enregistrer
          </button>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        {mentors?.map((m) => (
          <div key={m.id} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
            <div className="flex-1">
              <p className="font-medium">{m.nom}</p>
              <p className="text-xs text-muted-foreground">{m.titre} — {m.entreprise}</p>
              <span className={`inline-block mt-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${m.type === 'mentor' ? 'bg-secondary/10 text-secondary' : 'bg-accent/10 text-accent'}`}>
                {m.type}
              </span>
            </div>
            <button onClick={() => deleteMentor.mutate(m.id)} className="text-destructive hover:bg-destructive/10 rounded p-1.5">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
};

export default GestionMentors;
