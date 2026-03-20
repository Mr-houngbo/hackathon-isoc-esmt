export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      agenda: {
        Row: {
          created_at: string | null
          description: string | null
          heure_debut: string
          heure_fin: string | null
          id: string
          jour: number | null
          lieu: string | null
          titre: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          heure_debut: string
          heure_fin?: string | null
          id?: string
          jour?: number | null
          lieu?: string | null
          titre: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          heure_debut?: string
          heure_fin?: string | null
          id?: string
          jour?: number | null
          lieu?: string | null
          titre?: string
        }
        Relationships: []
      }
      annonces: {
        Row: {
          contenu: string | null
          created_at: string | null
          id: string
          titre: string
        }
        Insert: {
          contenu?: string | null
          created_at?: string | null
          id?: string
          titre: string
        }
        Update: {
          contenu?: string | null
          created_at?: string | null
          id?: string
          titre?: string
        }
        Relationships: []
      }
      badges: {
        Row: {
          created_at: string | null
          date_envoi: string | null
          envoye: boolean | null
          equipe_id: string | null
          id: string
          membre_id: string | null
          qr_code_url: string | null
        }
        Insert: {
          created_at?: string | null
          date_envoi?: string | null
          envoye?: boolean | null
          equipe_id?: string | null
          id?: string
          membre_id?: string | null
          qr_code_url?: string | null
        }
        Update: {
          created_at?: string | null
          date_envoi?: string | null
          envoye?: boolean | null
          equipe_id?: string | null
          id?: string
          membre_id?: string | null
          qr_code_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "badges_equipe_id_fkey"
            columns: ["equipe_id"]
            isOneToOne: false
            referencedRelation: "equipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "badges_membre_id_fkey"
            columns: ["membre_id"]
            isOneToOne: false
            referencedRelation: "membres"
            referencedColumns: ["id"]
          },
        ]
      }
      certificats: {
        Row: {
          created_at: string | null
          date_envoi: string | null
          envoye: boolean | null
          equipe_id: string | null
          id: string
          membre_id: string | null
          qr_code_url: string | null
          rang: number | null
          type: string | null
        }
        Insert: {
          created_at?: string | null
          date_envoi?: string | null
          envoye?: boolean | null
          equipe_id?: string | null
          id?: string
          membre_id?: string | null
          qr_code_url?: string | null
          rang?: number | null
          type?: string | null
        }
        Update: {
          created_at?: string | null
          date_envoi?: string | null
          envoye?: boolean | null
          equipe_id?: string | null
          id?: string
          membre_id?: string | null
          qr_code_url?: string | null
          rang?: number | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "certificats_equipe_id_fkey"
            columns: ["equipe_id"]
            isOneToOne: false
            referencedRelation: "equipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certificats_membre_id_fkey"
            columns: ["membre_id"]
            isOneToOne: false
            referencedRelation: "membres"
            referencedColumns: ["id"]
          },
        ]
      }
      equipes: {
        Row: {
          a_projet: string | null
          competences_equipe: string[] | null
          contraintes_techniques: string | null
          created_at: string | null
          domaine_projet: string | null
          esperances: string | null
          handle_instagram: string | null
          handle_linkedin: string | null
          id: string
          motivation: string | null
          niveau_avancement: string | null
          niveau_technique: string | null
          nom_equipe: string | null
          nom_projet: string | null
          nombre_membres: number | null
          problematique: string | null
          selectionnee: boolean | null
          solution: string | null
          source_info: string | null
          technologies: string | null
          type_candidature: string
        }
        Insert: {
          a_projet?: string | null
          competences_equipe?: string[] | null
          contraintes_techniques?: string | null
          created_at?: string | null
          domaine_projet?: string | null
          esperances?: string | null
          handle_instagram?: string | null
          handle_linkedin?: string | null
          id?: string
          motivation?: string | null
          niveau_avancement?: string | null
          niveau_technique?: string | null
          nom_equipe?: string | null
          nom_projet?: string | null
          nombre_membres?: number | null
          problematique?: string | null
          selectionnee?: boolean | null
          solution?: string | null
          source_info?: string | null
          technologies?: string | null
          type_candidature: string
        }
        Update: {
          a_projet?: string | null
          competences_equipe?: string[] | null
          contraintes_techniques?: string | null
          created_at?: string | null
          domaine_projet?: string | null
          esperances?: string | null
          handle_instagram?: string | null
          handle_linkedin?: string | null
          id?: string
          motivation?: string | null
          niveau_avancement?: string | null
          niveau_technique?: string | null
          nom_equipe?: string | null
          nom_projet?: string | null
          nombre_membres?: number | null
          problematique?: string | null
          selectionnee?: boolean | null
          solution?: string | null
          source_info?: string | null
          technologies?: string | null
          type_candidature?: string
        }
        Relationships: []
      }
      galerie: {
        Row: {
          created_at: string | null
          description: string | null
          equipe_id: string | null
          id: string
          photo_url: string | null
          titre_projet: string
          categorie: string | null // Ancien champ (à supprimer après migration)
          annee: number | null
          type_categorie: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          equipe_id?: string | null
          id?: string
          photo_url?: string | null
          titre_projet: string
          categorie?: string | null // Ancien champ (à supprimer après migration)
          annee?: number | null
          type_categorie?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          equipe_id?: string | null
          id?: string
          photo_url?: string | null
          titre_projet?: string
          categorie?: string | null // Ancien champ (à supprimer après migration)
          annee?: number | null
          type_categorie?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "galerie_equipe_id_fkey"
            columns: ["equipe_id"]
            isOneToOne: false
            referencedRelation: "equipes"
            referencedColumns: ["id"]
          },
        ]
      }
      membres: {
        Row: {
          accepte_conditions: boolean | null
          autorise_photos: boolean | null
          competences: string[] | null
          created_at: string | null
          disponible_2_jours: boolean
          email: string
          equipe_id: string | null
          est_chef: boolean | null
          etablissement: string | null
          filiere: string
          genre: string | null
          id: string
          niveau_etudes: string | null
          nom_prenom: string
          role_equipe: string | null
          telephone: string | null
        }
        Insert: {
          accepte_conditions?: boolean | null
          autorise_photos?: boolean | null
          competences?: string[] | null
          created_at?: string | null
          disponible_2_jours?: boolean
          email: string
          equipe_id?: string | null
          est_chef?: boolean | null
          etablissement?: string | null
          filiere: string
          genre?: string | null
          id?: string
          niveau_etudes?: string | null
          nom_prenom: string
          role_equipe?: string | null
          telephone?: string | null
        }
        Update: {
          accepte_conditions?: boolean | null
          autorise_photos?: boolean | null
          competences?: string[] | null
          created_at?: string | null
          disponible_2_jours?: boolean
          email?: string
          equipe_id?: string | null
          est_chef?: boolean | null
          etablissement?: string | null
          filiere?: string
          genre?: string | null
          id?: string
          niveau_etudes?: string | null
          nom_prenom?: string
          role_equipe?: string | null
          telephone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "membres_equipe_id_fkey"
            columns: ["equipe_id"]
            isOneToOne: false
            referencedRelation: "equipes"
            referencedColumns: ["id"]
          },
        ]
      }
      mentors: {
        Row: {
          created_at: string | null
          entreprise: string | null
          id: string
          nom: string
          photo_url: string | null
          titre: string | null
          type: string | null
        }
        Insert: {
          created_at?: string | null
          entreprise?: string | null
          id?: string
          nom: string
          photo_url?: string | null
          titre?: string | null
          type?: string | null
        }
        Update: {
          created_at?: string | null
          entreprise?: string | null
          id?: string
          nom?: string
          photo_url?: string | null
          titre?: string | null
          type?: string | null
        }
        Relationships: []
      }
      partenaires: {
        Row: {
          created_at: string | null
          id: string
          logo_url: string | null
          niveau: string | null
          nom: string
          site_url: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          logo_url?: string | null
          niveau?: string | null
          nom: string
          site_url?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          logo_url?: string | null
          niveau?: string | null
          nom?: string
          site_url?: string | null
        }
        Relationships: []
      }
      retours: {
        Row: {
          commentaire: string | null
          created_at: string | null
          id: string
          membre_id: string | null
          note_globale: number | null
        }
        Insert: {
          commentaire?: string | null
          created_at?: string | null
          id?: string
          membre_id?: string | null
          note_globale?: number | null
        }
        Update: {
          commentaire?: string | null
          created_at?: string | null
          id?: string
          membre_id?: string | null
          note_globale?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "retours_membre_id_fkey"
            columns: ["membre_id"]
            isOneToOne: false
            referencedRelation: "membres"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      type_avancement: "concept" | "esquisse" | "prototype"
      type_candidature: "individuel" | "equipe"
      type_certificat: "participation" | "laureat"
      type_genre: "homme" | "femme" | "non_precise"
      type_mentor: "mentor" | "jury"
      type_niveau: "debutant" | "intermediaire" | "avance"
      type_niveau_etudes: "L1" | "L2" | "L3" | "M1" | "M2"
      type_partenaire: "or" | "argent" | "bronze"
      type_projet: "oui" | "non" | "en_reflexion"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      type_avancement: ["concept", "esquisse", "prototype"],
      type_candidature: ["individuel", "equipe"],
      type_certificat: ["participation", "laureat"],
      type_genre: ["homme", "femme", "non_precise"],
      type_mentor: ["mentor", "jury"],
      type_niveau: ["debutant", "intermediaire", "avance"],
      type_niveau_etudes: ["L1", "L2", "L3", "M1", "M2"],
      type_partenaire: ["or", "argent", "bronze"],
      type_projet: ["oui", "non", "en_reflexion"],
    },
  },
} as const
