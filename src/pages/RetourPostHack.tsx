import { useState } from "react";
import { toast } from "sonner";
import Layout from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { Star, Send } from "lucide-react";

const RetourPostHack = () => {
  const [note, setNote] = useState(0);
  const [commentaire, setCommentaire] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (note === 0) { toast.error("Veuillez donner une note."); return; }
    setLoading(true);
    const { error } = await supabase.from("retours").insert({ note_globale: note, commentaire: commentaire || null });
    if (error) { toast.error("Erreur : " + error.message); }
    else { setSubmitted(true); toast.success("Merci pour votre retour !"); }
    setLoading(false);
  };

  if (submitted) return (
    <Layout>
      <div className="container max-w-lg py-20 text-center">
        <h1 className="font-display text-2xl font-bold">Merci ! 🙏</h1>
        <p className="text-muted-foreground mt-2">Votre retour nous aide à nous améliorer.</p>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="container max-w-lg py-12">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold">Votre <span className="text-gradient">retour</span></h1>
          <p className="text-muted-foreground mt-2">Comment avez-vous trouvé le hackathon ?</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-6">
          <div>
            <label className="text-sm font-medium mb-2 block">Note globale</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button" onClick={() => setNote(n)}
                  className="transition-transform hover:scale-110">
                  <Star size={32} className={n <= note ? 'fill-accent text-accent' : 'text-border'} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Commentaire</label>
            <textarea value={commentaire} onChange={(e) => setCommentaire(e.target.value)}
              rows={4} placeholder="Vos remarques et suggestions..."
              className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
          </div>

          <button onClick={handleSubmit} disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105 disabled:opacity-50">
            <Send size={16} /> Envoyer mon retour
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default RetourPostHack;
