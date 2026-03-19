import { useQueryClient } from "@tanstack/react-query";
import { ADMIN_QUERY_KEYS, invalidatePublicQueries } from "@/lib/queryKeys";

/**
 * Hook pour synchroniser automatiquement les données admin avec les pages publiques
 * Utiliser dans les mutations onSuccess pour mettre à jour les pages publiques
 */
export const useSyncWithPublic = () => {
  const queryClient = useQueryClient();

  const syncWithPublic = (adminQueryKey: string[]) => {
    // Invalider la query admin
    queryClient.invalidateQueries({ queryKey: adminQueryKey });
    
    // Synchroniser automatiquement avec la page publique correspondante
    invalidatePublicQueries(queryClient, adminQueryKey);
  };

  return { syncWithPublic };
};

/**
 * Hook pour synchroniser les équipes (cas spécial car a des query multiples)
 */
export const useSyncEquipes = () => {
  const queryClient = useQueryClient();

  const syncEquipes = () => {
    // Invalider les queries admin
    queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.equipes });
    
    // Invalider la page publique des équipes sélectionnées
    queryClient.invalidateQueries({ queryKey: ["equipes-selectionnees"] });
  };

  return { syncEquipes };
};
