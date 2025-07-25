export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      blocks: {
        Row: {
          chapter_id: string | null
          content: string
          created_at: string | null
          id: string
          styles: Json
          updated_at: string | null
          user_id: string
        }
        Insert: {
          chapter_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          styles?: Json
          updated_at?: string | null
          user_id: string
        }
        Update: {
          chapter_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          styles?: Json
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blocks_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
        ]
      }
      chapters: {
        Row: {
          created_at: string | null
          id: string
          story_id: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          story_id?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          story_id?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chapters_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      characters: {
        Row: {
          art_links: string[] | null
          character_avatar: string | null
          character_desc: string | null
          character_name: string
          character_type: Database["public"]["Enums"]["CharacterType"]
          created_at: string
          creator: string | null
          date_of_birth: string
          gender: Database["public"]["Enums"]["GENDER"]
          id: number
          pronouns: string
          relations: Json | null
          tags: string[] | null
        }
        Insert: {
          art_links?: string[] | null
          character_avatar?: string | null
          character_desc?: string | null
          character_name: string
          character_type?: Database["public"]["Enums"]["CharacterType"]
          created_at?: string
          creator?: string | null
          date_of_birth: string
          gender?: Database["public"]["Enums"]["GENDER"]
          id?: number
          pronouns?: string
          relations?: Json | null
          tags?: string[] | null
        }
        Update: {
          art_links?: string[] | null
          character_avatar?: string | null
          character_desc?: string | null
          character_name?: string
          character_type?: Database["public"]["Enums"]["CharacterType"]
          created_at?: string
          creator?: string | null
          date_of_birth?: string
          gender?: Database["public"]["Enums"]["GENDER"]
          id?: number
          pronouns?: string
          relations?: Json | null
          tags?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "characters_creator_fkey"
            columns: ["creator"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["account_id"]
          },
        ]
      }
      characters_reactions: {
        Row: {
          id: number
          react_to: number | null
          reaction: Database["public"]["Enums"]["Reactions"] | null
          user_id: string | null
        }
        Insert: {
          id?: number
          react_to?: number | null
          reaction?: Database["public"]["Enums"]["Reactions"] | null
          user_id?: string | null
        }
        Update: {
          id?: number
          react_to?: number | null
          reaction?: Database["public"]["Enums"]["Reactions"] | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "characters_reactions_react_to_fkey"
            columns: ["react_to"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "characters_reactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["account_id"]
          },
        ]
      }
      microblogs: {
        Row: {
          age_rating: Database["public"]["Enums"]["AgeRating"]
          content: string
          created_at: string
          edited_at: string | null
          post_id: number
          styles: Json | null
          tags: string[] | null
          writer: string
        }
        Insert: {
          age_rating: Database["public"]["Enums"]["AgeRating"]
          content: string
          created_at?: string
          edited_at?: string | null
          post_id?: number
          styles?: Json | null
          tags?: string[] | null
          writer: string
        }
        Update: {
          age_rating?: Database["public"]["Enums"]["AgeRating"]
          content?: string
          created_at?: string
          edited_at?: string | null
          post_id?: number
          styles?: Json | null
          tags?: string[] | null
          writer?: string
        }
        Relationships: [
          {
            foreignKeyName: "microblogs_writer_fkey"
            columns: ["writer"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["account_id"]
          },
        ]
      }
      microblogs_reactions: {
        Row: {
          id: number
          react_to: number | null
          reaction: Database["public"]["Enums"]["Reactions"]
          user_id: string
        }
        Insert: {
          id?: number
          react_to?: number | null
          reaction: Database["public"]["Enums"]["Reactions"]
          user_id: string
        }
        Update: {
          id?: number
          react_to?: number | null
          reaction?: Database["public"]["Enums"]["Reactions"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "microblogs_reactions_react_to_fkey"
            columns: ["react_to"]
            isOneToOne: false
            referencedRelation: "microblogs"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "microblogs_reactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["account_id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: number
          message: string
          read: boolean
          sent_by: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          message: string
          read?: boolean
          sent_by: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          message?: string
          read?: boolean
          sent_by?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_sent_by_fkey"
            columns: ["sent_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["account_id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["account_id"]
          },
        ]
      }
      profiles: {
        Row: {
          account_id: string | null
          avatar_url: string | null
          bd: string | null
          bio: string | null
          created_at: string
          email: string
          id: number
          interests: string[] | null
          is_active: boolean
          username: string
          works: string[] | null
        }
        Insert: {
          account_id?: string | null
          avatar_url?: string | null
          bd?: string | null
          bio?: string | null
          created_at?: string
          email?: string
          id?: number
          interests?: string[] | null
          is_active?: boolean
          username?: string
          works?: string[] | null
        }
        Update: {
          account_id?: string | null
          avatar_url?: string | null
          bd?: string | null
          bio?: string | null
          created_at?: string
          email?: string
          id?: number
          interests?: string[] | null
          is_active?: boolean
          username?: string
          works?: string[] | null
        }
        Relationships: []
      }
      stories: {
        Row: {
          age_rating: Database["public"]["Enums"]["AgeRating"]
          created_at: string | null
          description: string | null
          id: string
          is_published: boolean
          short_description: string
          tags: string[] | null
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          age_rating?: Database["public"]["Enums"]["AgeRating"]
          created_at?: string | null
          description?: string | null
          id?: string
          is_published?: boolean
          short_description?: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          age_rating?: Database["public"]["Enums"]["AgeRating"]
          created_at?: string | null
          description?: string | null
          id?: string
          is_published?: boolean
          short_description?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      stories_reactions: {
        Row: {
          id: number
          react_to: string
          reaction: Database["public"]["Enums"]["Reactions"]
          user_id: string
        }
        Insert: {
          id?: number
          react_to: string
          reaction: Database["public"]["Enums"]["Reactions"]
          user_id: string
        }
        Update: {
          id?: number
          react_to?: string
          reaction?: Database["public"]["Enums"]["Reactions"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "stories_reactions_react_to_fkey"
            columns: ["react_to"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stories_reactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["account_id"]
          },
        ]
      }
      story_block_comments: {
        Row: {
          comment: string
          comment_id: number
          commenter_id: string
          created_at: string
          id: string
        }
        Insert: {
          comment: string
          comment_id?: number
          commenter_id: string
          created_at?: string
          id: string
        }
        Update: {
          comment?: string
          comment_id?: number
          commenter_id?: string
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "story_block_comments_commenter_id_fkey"
            columns: ["commenter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["account_id"]
          },
          {
            foreignKeyName: "story_block_comments_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "blocks"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      citext: {
        Args: { "": boolean } | { "": string } | { "": unknown }
        Returns: string
      }
      citext_hash: {
        Args: { "": string }
        Returns: number
      }
      citextin: {
        Args: { "": unknown }
        Returns: string
      }
      citextout: {
        Args: { "": string }
        Returns: unknown
      }
      citextrecv: {
        Args: { "": unknown }
        Returns: string
      }
      citextsend: {
        Args: { "": string }
        Returns: string
      }
    }
    Enums: {
      AgeRating: "Everyone" | "Teens" | "Mature" | "Adult"
      CharacterType: "OC" | "SONA" | "FROM-MEDIA"
      GENDER: "M" | "F" | "NB" | "I"
      notification_type: "like" | "comment" | "watch_inform"
      Reactions: "0" | "1" | "2" | "3"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      AgeRating: ["Everyone", "Teens", "Mature", "Adult"],
      CharacterType: ["OC", "SONA", "FROM-MEDIA"],
      GENDER: ["M", "F", "NB", "I"],
      notification_type: ["like", "comment", "watch_inform"],
      Reactions: ["0", "1", "2", "3"],
    },
  },
} as const
