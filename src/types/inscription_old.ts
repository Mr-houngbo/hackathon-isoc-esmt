export interface InscriptionData {
  // Step 1
  accepte_conditions: boolean;
  autorise_photos: boolean;
  // Step 2
  type_candidature: 'individuel' | 'equipe';
  nom_equipe: string;
  nombre_membres: number;
  // Step 3 - Chef
  chef_nom_prenom: string;
  chef_genre: string;
  chef_filiere: string;
  chef_niveau_etudes: string;
  chef_telephone: string;
  chef_email: string;
  chef_etablissement: string;
  chef_competences: string[];
  chef_disponible: boolean | null;
  // Step 4 - Membres
  membres: {
    nom_prenom: string;
    genre: string;
    filiere: string;
    niveau_etudes: string;
    role_equipe: string;
    telephone: string;
    email: string;
    etablissement: string;
    disponible: boolean | null;
  }[];
  // Step 5 - Projet
  a_projet: string;
  nom_projet: string;
  domaine_projet: string;
  problematique: string;
  solution: string;
  technologies: string;
  niveau_avancement: string;
  contraintes_techniques: string;
  // Step 6 - Profil
  niveau_technique: string;
  competences_equipe: string[];
  handle_instagram: string;
  handle_linkedin: string;
  // Step 7 - Motivation
  motivation: string;
  esperances: string;
  source_info: string;
  // Additional fields for selected teams
  position?: number;
  selectionnee?: boolean;
}

export const defaultInscriptionData: InscriptionData = {
  accepte_conditions: false,
  autorise_photos: false,
  type_candidature: 'individuel',
  nom_equipe: '',
  nombre_membres: 2,
  chef_nom_prenom: '',
  chef_genre: '',
  chef_filiere: '',
  chef_niveau_etudes: '',
  chef_telephone: '',
  chef_email: '',
  chef_etablissement: 'ESMT',
  chef_competences: [],
  chef_disponible: null,
  membres: [],
  a_projet: '',
  nom_projet: '',
  domaine_projet: '',
  problematique: '',
  solution: '',
  technologies: '',
  niveau_avancement: '',
  contraintes_techniques: '',
  niveau_technique: '',
  competences_equipe: [],
  handle_instagram: '',
  handle_linkedin: '',
  motivation: '',
  esperances: '',
  source_info: '',
  selectionnee: false,
};
