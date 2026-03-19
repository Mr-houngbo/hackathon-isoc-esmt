// Clés de query pour React Query - Synchronisation Admin/Public

export const ADMIN_QUERY_KEYS = {
  // Pages Admin
  equipes: ["admin-equipes"],
  partenaires: ["admin-partenaires"], 
  mentors: ["admin-mentors"],
  galerie: ["admin-galerie"],
  agenda: ["admin-agenda"],
  annonces: ["admin-annonces"],
  badges: ["admin-badges"],
  statistiques: ["admin-statistiques"],
  classement: ["admin-classement"],
  dashboard: ["admin-dashboard"],
} as const;

export const PUBLIC_QUERY_KEYS = {
  // Pages Publiques
  equipesSelectionnees: ["equipes-selectionnees"],
  partenaires: ["partenaires"],
  mentors: ["mentors"], 
  galerie: ["galerie"],
  agenda: ["agenda"],
  // Autres pages publiques si besoin
} as const;

export const SYNC_MAP: Record<string, string> = {
  "admin-equipes": "equipes-selectionnees",
  "admin-partenaires": "partenaires",
  "admin-mentors": "mentors",
  "admin-galerie": "galerie",
  "admin-agenda": "agenda",
};

// Fonction utilitaire pour synchroniser automatiquement
export const invalidatePublicQueries = (queryClient: any, adminQueryKey: string[]) => {
  const adminKey = adminQueryKey[0]; // Prendre le premier élément
  const publicQueryKey = SYNC_MAP[adminKey];
  if (publicQueryKey) {
    queryClient.invalidateQueries({ queryKey: [publicQueryKey] });
  }
};
