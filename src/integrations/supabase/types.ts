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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      ab_tests: {
        Row: {
          created_at: string
          ended_at: string | null
          id: string
          name: string
          profile_id: string
          started_at: string | null
          status: string
          variant_a: Json
          variant_a_clicks: number
          variant_a_views: number
          variant_b: Json
          variant_b_clicks: number
          variant_b_views: number
          winner: string | null
        }
        Insert: {
          created_at?: string
          ended_at?: string | null
          id?: string
          name: string
          profile_id: string
          started_at?: string | null
          status?: string
          variant_a?: Json
          variant_a_clicks?: number
          variant_a_views?: number
          variant_b?: Json
          variant_b_clicks?: number
          variant_b_views?: number
          winner?: string | null
        }
        Update: {
          created_at?: string
          ended_at?: string | null
          id?: string
          name?: string
          profile_id?: string
          started_at?: string | null
          status?: string
          variant_a?: Json
          variant_a_clicks?: number
          variant_a_views?: number
          variant_b?: Json
          variant_b_clicks?: number
          variant_b_views?: number
          winner?: string | null
        }
        Relationships: []
      }
      api_keys: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          key_hash: string
          key_preview: string
          last_used_at: string | null
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          key_hash: string
          key_preview: string
          last_used_at?: string | null
          name?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          key_hash?: string
          key_preview?: string
          last_used_at?: string | null
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      click_heatmap: {
        Row: {
          clicked_at: string
          element_id: string | null
          element_type: string
          id: string
          profile_id: string
          viewport_height: number | null
          viewport_width: number | null
          x_percent: number
          y_percent: number
        }
        Insert: {
          clicked_at?: string
          element_id?: string | null
          element_type: string
          id?: string
          profile_id: string
          viewport_height?: number | null
          viewport_width?: number | null
          x_percent: number
          y_percent: number
        }
        Update: {
          clicked_at?: string
          element_id?: string | null
          element_type?: string
          id?: string
          profile_id?: string
          viewport_height?: number | null
          viewport_width?: number | null
          x_percent?: number
          y_percent?: number
        }
        Relationships: []
      }
      form_submissions: {
        Row: {
          block_id: string | null
          email: string | null
          full_name: string | null
          id: string
          message: string | null
          profile_id: string
          submitted_at: string
        }
        Insert: {
          block_id?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          message?: string | null
          profile_id: string
          submitted_at?: string
        }
        Update: {
          block_id?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          message?: string | null
          profile_id?: string
          submitted_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "form_submissions_block_id_fkey"
            columns: ["block_id"]
            isOneToOne: false
            referencedRelation: "page_blocks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "form_submissions_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      integrations: {
        Row: {
          config: Json
          created_at: string
          id: string
          integration_id: string
          is_connected: boolean
          profile_id: string
          updated_at: string
        }
        Insert: {
          config?: Json
          created_at?: string
          id?: string
          integration_id: string
          is_connected?: boolean
          profile_id: string
          updated_at?: string
        }
        Update: {
          config?: Json
          created_at?: string
          id?: string
          integration_id?: string
          is_connected?: boolean
          profile_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "integrations_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      link_clicks: {
        Row: {
          clicked_at: string
          id: string
          link_id: string
          referrer: string | null
        }
        Insert: {
          clicked_at?: string
          id?: string
          link_id: string
          referrer?: string | null
        }
        Update: {
          clicked_at?: string
          id?: string
          link_id?: string
          referrer?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "link_clicks_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "profile_links"
            referencedColumns: ["id"]
          },
        ]
      }
      page_blocks: {
        Row: {
          content: Json
          created_at: string
          id: string
          is_active: boolean
          position: number
          profile_id: string
          title: string | null
          type: string
          updated_at: string
        }
        Insert: {
          content?: Json
          created_at?: string
          id?: string
          is_active?: boolean
          position?: number
          profile_id: string
          title?: string | null
          type: string
          updated_at?: string
        }
        Update: {
          content?: Json
          created_at?: string
          id?: string
          is_active?: boolean
          position?: number
          profile_id?: string
          title?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "page_blocks_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      page_views: {
        Row: {
          country: string | null
          device: string | null
          id: string
          profile_id: string
          referrer: string | null
          viewed_at: string
        }
        Insert: {
          country?: string | null
          device?: string | null
          id?: string
          profile_id: string
          referrer?: string | null
          viewed_at?: string
        }
        Update: {
          country?: string | null
          device?: string | null
          id?: string
          profile_id?: string
          referrer?: string | null
          viewed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "page_views_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_links: {
        Row: {
          click_count: number
          created_at: string
          icon: string | null
          id: string
          is_active: boolean
          position: number
          profile_id: string
          title: string
          url: string
        }
        Insert: {
          click_count?: number
          created_at?: string
          icon?: string | null
          id?: string
          is_active?: boolean
          position?: number
          profile_id: string
          title: string
          url: string
        }
        Update: {
          click_count?: number
          created_at?: string
          icon?: string | null
          id?: string
          is_active?: boolean
          position?: number
          profile_id?: string
          title?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_links_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          background_color: string | null
          bio: string | null
          button_style: string
          cover_url: string | null
          created_at: string
          custom_domain: string | null
          display_name: string | null
          facebook_pixel_id: string | null
          favicon_url: string | null
          font_style: string
          google_analytics_id: string | null
          id: string
          is_verified: boolean
          linkedin_insight_tag: string | null
          pinterest_tag_id: string | null
          plan: string
          seo_description: string | null
          seo_title: string | null
          snapchat_pixel_id: string | null
          social_links: Json | null
          theme: string
          tiktok_pixel_id: string | null
          updated_at: string
          user_id: string
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          background_color?: string | null
          bio?: string | null
          button_style?: string
          cover_url?: string | null
          created_at?: string
          custom_domain?: string | null
          display_name?: string | null
          facebook_pixel_id?: string | null
          favicon_url?: string | null
          font_style?: string
          google_analytics_id?: string | null
          id?: string
          is_verified?: boolean
          linkedin_insight_tag?: string | null
          pinterest_tag_id?: string | null
          plan?: string
          seo_description?: string | null
          seo_title?: string | null
          snapchat_pixel_id?: string | null
          social_links?: Json | null
          theme?: string
          tiktok_pixel_id?: string | null
          updated_at?: string
          user_id: string
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          background_color?: string | null
          bio?: string | null
          button_style?: string
          cover_url?: string | null
          created_at?: string
          custom_domain?: string | null
          display_name?: string | null
          facebook_pixel_id?: string | null
          favicon_url?: string | null
          font_style?: string
          google_analytics_id?: string | null
          id?: string
          is_verified?: boolean
          linkedin_insight_tag?: string | null
          pinterest_tag_id?: string | null
          plan?: string
          seo_description?: string | null
          seo_title?: string | null
          snapchat_pixel_id?: string | null
          social_links?: Json | null
          theme?: string
          tiktok_pixel_id?: string | null
          updated_at?: string
          user_id?: string
          username?: string | null
          website?: string | null
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          created_at: string
          id: string
          message: string
          priority: string
          status: string
          subject: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          priority?: string
          status?: string
          subject: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          priority?: string
          status?: string
          subject?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          created_at: string
          email: string
          id: string
          invited_by: string
          profile_id: string
          role: string
          status: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          invited_by: string
          profile_id: string
          role?: string
          status?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          invited_by?: string
          profile_id?: string
          role?: string
          status?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      webhooks: {
        Row: {
          created_at: string
          events: string[]
          id: string
          is_active: boolean
          secret: string | null
          url: string
          user_id: string
        }
        Insert: {
          created_at?: string
          events?: string[]
          id?: string
          is_active?: boolean
          secret?: string | null
          url: string
          user_id: string
        }
        Update: {
          created_at?: string
          events?: string[]
          id?: string
          is_active?: boolean
          secret?: string | null
          url?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
