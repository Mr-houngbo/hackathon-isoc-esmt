import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ComiteMember {
  id: string;
  nom_prenom: string;
  email: string;
  created_at: string;
}

interface ComiteAuthCtx {
  comiteMember: ComiteMember | null;
  loading: boolean;
  signIn: (nomPrenom: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
}

const ComiteAuthContext = createContext<ComiteAuthCtx>({
  comiteMember: null,
  loading: true,
  signIn: async () => ({ success: false }),
  signOut: async () => {},
});

export const useComiteAuth = () => useContext(ComiteAuthContext);

export const ComiteAuthProvider = ({ children }: { children: ReactNode }) => {
  const [comiteMember, setComiteMember] = useState<ComiteMember | null>(null);
  const [loading, setLoading] = useState(true);

  // Vérifier si une session comité existe (localStorage seulement)
  useEffect(() => {
    const checkSession = () => {
      const storedMember = localStorage.getItem('comite_member');
      if (storedMember) {
        try {
          const member = JSON.parse(storedMember);
          setComiteMember(member);
        } catch (error) {
          localStorage.removeItem('comite_member');
        }
      }
      setLoading(false);
    };

    checkSession();
  }, []);

  const signIn = async (nomPrenom: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Vérifier le mot de passe depuis .env
      const comitePassword = import.meta.env.VITE_COMITE_PASSWORD;
      if (!comitePassword || password !== comitePassword) {
        return { success: false, error: "Mot de passe incorrect" };
      }

      // Vérifier si le membre existe dans la base de données
      const { data: member, error } = await supabase
        .from('comite')
        .select('*')
        .eq('nom_prenom', nomPrenom.trim())
        .single();

      if (error || !member) {
        return { success: false, error: "Membre du comité non trouvé" };
      }

      // Stocker la session dans localStorage seulement
      localStorage.setItem('comite_member', JSON.stringify(member));
      setComiteMember(member);
      
      return { success: true };
    } catch (error) {
      console.error('Erreur de connexion comité:', error);
      return { success: false, error: "Erreur lors de la connexion" };
    }
  };

  const signOut = async () => {
    localStorage.removeItem('comite_member');
    setComiteMember(null);
  };

  return (
    <ComiteAuthContext.Provider value={{ comiteMember, loading, signIn, signOut }}>
      {children}
    </ComiteAuthContext.Provider>
  );
};
