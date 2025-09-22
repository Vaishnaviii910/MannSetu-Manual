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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          new_values: Json | null
          old_values: Json | null
          record_id: string | null
          table_name: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      availability_slots: {
        Row: {
          counselor_id: string
          created_at: string
          day_of_week: number
          end_time: string
          id: string
          is_active: boolean | null
          start_time: string
          updated_at: string
        }
        Insert: {
          counselor_id: string
          created_at?: string
          day_of_week: number
          end_time: string
          id?: string
          is_active?: boolean | null
          start_time: string
          updated_at?: string
        }
        Update: {
          counselor_id?: string
          created_at?: string
          day_of_week?: number
          end_time?: string
          id?: string
          is_active?: boolean | null
          start_time?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "availability_slots_counselor_id_fkey1"
            columns: ["counselor_id"]
            isOneToOne: false
            referencedRelation: "counselors"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          booking_date: string
          cancellation_reason: string | null
          counselor_id: string
          counselor_notes: string | null
          created_at: string
          end_time: string
          id: string
          rejection_reason: string | null
          start_time: string
          status: Database["public"]["Enums"]["booking_status"] | null
          student_id: string
          student_notes: string | null
          time_slot_id: string
          updated_at: string
        }
        Insert: {
          booking_date: string
          cancellation_reason?: string | null
          counselor_id: string
          counselor_notes?: string | null
          created_at?: string
          end_time: string
          id?: string
          rejection_reason?: string | null
          start_time: string
          status?: Database["public"]["Enums"]["booking_status"] | null
          student_id: string
          student_notes?: string | null
          time_slot_id: string
          updated_at?: string
        }
        Update: {
          booking_date?: string
          cancellation_reason?: string | null
          counselor_id?: string
          counselor_notes?: string | null
          created_at?: string
          end_time?: string
          id?: string
          rejection_reason?: string | null
          start_time?: string
          status?: Database["public"]["Enums"]["booking_status"] | null
          student_id?: string
          student_notes?: string | null
          time_slot_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_counselor_id_fkey"
            columns: ["counselor_id"]
            isOneToOne: false
            referencedRelation: "counselors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_time_slot_id_fkey"
            columns: ["time_slot_id"]
            isOneToOne: false
            referencedRelation: "time_slots"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_history: {
        Row: {
          created_at: string
          id: string
          message: string
          sender: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          sender: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          sender?: string
          user_id?: string
        }
        Relationships: []
      }
      counselor_availability: {
        Row: {
          counselor_id: string
          created_at: string
          day_of_week: number
          end_time: string
          id: string
          is_active: boolean | null
          start_time: string
          updated_at: string
        }
        Insert: {
          counselor_id: string
          created_at?: string
          day_of_week: number
          end_time: string
          id?: string
          is_active?: boolean | null
          start_time: string
          updated_at?: string
        }
        Update: {
          counselor_id?: string
          created_at?: string
          day_of_week?: number
          end_time?: string
          id?: string
          is_active?: boolean | null
          start_time?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "availability_slots_counselor_id_fkey"
            columns: ["counselor_id"]
            isOneToOne: false
            referencedRelation: "counselors"
            referencedColumns: ["id"]
          },
        ]
      }
      counselors: {
        Row: {
          bio: string | null
          counselor_id: string
          created_at: string
          experience_years: number | null
          full_name: string
          id: string
          institute_id: string
          is_active: boolean | null
          phone: string
          qualifications: string
          speciality: string
          updated_at: string
          user_id: string
        }
        Insert: {
          bio?: string | null
          counselor_id?: string
          created_at?: string
          experience_years?: number | null
          full_name: string
          id?: string
          institute_id: string
          is_active?: boolean | null
          phone: string
          qualifications: string
          speciality: string
          updated_at?: string
          user_id: string
        }
        Update: {
          bio?: string | null
          counselor_id?: string
          created_at?: string
          experience_years?: number | null
          full_name?: string
          id?: string
          institute_id?: string
          is_active?: boolean | null
          phone?: string
          qualifications?: string
          speciality?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "counselors_institute_id_fkey"
            columns: ["institute_id"]
            isOneToOne: false
            referencedRelation: "institutes"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_likes: {
        Row: {
          created_at: string | null
          id: string
          post_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "forum_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "forum_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_post_reactions: {
        Row: {
          created_at: string | null
          id: string
          post_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "forum_post_reactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "forum_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_posts: {
        Row: {
          content: string
          created_at: string
          forum_id: string
          id: string
          is_anonymous: boolean | null
          student_id: string
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          forum_id: string
          id?: string
          is_anonymous?: boolean | null
          student_id: string
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          forum_id?: string
          id?: string
          is_anonymous?: boolean | null
          student_id?: string
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      forum_replies: {
        Row: {
          content: string
          created_at: string
          id: string
          is_anonymous: boolean | null
          post_id: string
          student_id: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_anonymous?: boolean | null
          post_id: string
          student_id: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_anonymous?: boolean | null
          post_id?: string
          student_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      forums: {
        Row: {
          created_at: string
          description: string | null
          id: string
          institute_id: string
          is_active: boolean | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          institute_id: string
          is_active?: boolean | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          institute_id?: string
          is_active?: boolean | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      gad_7_tests: {
        Row: {
          answers: Json | null
          id: string
          recommendations: string | null
          score: number | null
          severity_level: string | null
          student_id: string
          test_date: string | null
          version: number | null
        }
        Insert: {
          answers?: Json | null
          id?: string
          recommendations?: string | null
          score?: number | null
          severity_level?: string | null
          student_id?: string
          test_date?: string | null
          version?: number | null
        }
        Update: {
          answers?: Json | null
          id?: string
          recommendations?: string | null
          score?: number | null
          severity_level?: string | null
          student_id?: string
          test_date?: string | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "gad_7_tests_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      institutes: {
        Row: {
          address: string | null
          created_at: string
          description: string | null
          id: string
          institute_name: string
          phone: string | null
          updated_at: string
          user_id: string
          verification_document_url: string | null
          verification_status: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          description?: string | null
          id?: string
          institute_name: string
          phone?: string | null
          updated_at?: string
          user_id: string
          verification_document_url?: string | null
          verification_status?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          description?: string | null
          id?: string
          institute_name?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
          verification_document_url?: string | null
          verification_status?: string | null
          website?: string | null
        }
        Relationships: []
      }
      mood_entries: {
        Row: {
          created_at: string
          entry_date: string
          id: string
          mood: Database["public"]["Enums"]["mood_type"]
          notes: string | null
          student_id: string
        }
        Insert: {
          created_at?: string
          entry_date?: string
          id?: string
          mood: Database["public"]["Enums"]["mood_type"]
          notes?: string | null
          student_id: string
        }
        Update: {
          created_at?: string
          entry_date?: string
          id?: string
          mood?: Database["public"]["Enums"]["mood_type"]
          notes?: string | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mood_entries_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      phq_tests: {
        Row: {
          answers: Json
          id: string
          recommendations: string | null
          score: number
          severity_level: string
          student_id: string
          test_date: string
          version: number | null
        }
        Insert: {
          answers: Json
          id?: string
          recommendations?: string | null
          score: number
          severity_level: string
          student_id: string
          test_date?: string
          version?: number | null
        }
        Update: {
          answers?: Json
          id?: string
          recommendations?: string | null
          score?: number
          severity_level?: string
          student_id?: string
          test_date?: string
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "phq_tests_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reminders: {
        Row: {
          created_at: string
          due_date: string | null
          id: string
          is_completed: boolean | null
          student_id: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          due_date?: string | null
          id?: string
          is_completed?: boolean | null
          student_id: string
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          due_date?: string | null
          id?: string
          is_completed?: boolean | null
          student_id?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reminders_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      resources: {
        Row: {
          category: string | null
          content: Json
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          metadata: Json | null
          title: string
          type: Database["public"]["Enums"]["resource_type"]
          updated_at: string
        }
        Insert: {
          category?: string | null
          content: Json
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          title: string
          type: Database["public"]["Enums"]["resource_type"]
          updated_at?: string
        }
        Update: {
          category?: string | null
          content?: Json
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          title?: string
          type?: Database["public"]["Enums"]["resource_type"]
          updated_at?: string
        }
        Relationships: []
      }
      session_records: {
        Row: {
          booking_id: string
          completed_at: string | null
          created_at: string
          id: string
          next_steps: string | null
          session_notes: string | null
          session_rating: number | null
          session_summary: string | null
          updated_at: string
        }
        Insert: {
          booking_id: string
          completed_at?: string | null
          created_at?: string
          id?: string
          next_steps?: string | null
          session_notes?: string | null
          session_rating?: number | null
          session_summary?: string | null
          updated_at?: string
        }
        Update: {
          booking_id?: string
          completed_at?: string | null
          created_at?: string
          id?: string
          next_steps?: string | null
          session_notes?: string | null
          session_rating?: number | null
          session_summary?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_records_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: true
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          created_at: string
          date_of_birth: string | null
          emergency_contact: string | null
          emergency_phone: string | null
          full_name: string
          id: string
          institute_id: string
          phone: string | null
          student_id: string
          todays_focus: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date_of_birth?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          full_name: string
          id?: string
          institute_id: string
          phone?: string | null
          student_id: string
          todays_focus?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date_of_birth?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          full_name?: string
          id?: string
          institute_id?: string
          phone?: string | null
          student_id?: string
          todays_focus?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "students_institute_id_fkey"
            columns: ["institute_id"]
            isOneToOne: false
            referencedRelation: "institutes"
            referencedColumns: ["id"]
          },
        ]
      }
      time_slots: {
        Row: {
          counselor_id: string
          created_at: string
          end_time: string
          id: string
          slot_date: string
          start_time: string
          status: Database["public"]["Enums"]["availability_status"] | null
          updated_at: string
        }
        Insert: {
          counselor_id: string
          created_at?: string
          end_time: string
          id?: string
          slot_date: string
          start_time: string
          status?: Database["public"]["Enums"]["availability_status"] | null
          updated_at?: string
        }
        Update: {
          counselor_id?: string
          created_at?: string
          end_time?: string
          id?: string
          slot_date?: string
          start_time?: string
          status?: Database["public"]["Enums"]["availability_status"] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "time_slots_counselor_id_fkey"
            columns: ["counselor_id"]
            isOneToOne: false
            referencedRelation: "counselors"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_booking_from_generated_slot: {
        Args: {
          p_counselor_id: string
          p_slot_date: string
          p_start_time: string
          p_student_id: string
          p_student_notes: string
        }
        Returns: string
      }
      create_counselor_profile: {
        Args: {
          bio: string
          experience_years: number
          full_name: string
          institute_id: string
          phone: string
          qualifications: string
          speciality: string
          user_id: string
        }
        Returns: undefined
      }
      generate_counselor_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_student_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_time_slots: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      generate_time_slots_for_date: {
        Args: { p_counselor_id: string; p_date: string }
        Returns: undefined
      }
      get_unbooked_slots_for_date: {
        Args: { p_counselor_id: string; p_date: string }
        Returns: {
          counselor_id: string
          end_time: string
          slot_date: string
          slot_key: string
          start_time: string
        }[]
      }
      get_user_institute_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["user_role"]
      }
      handle_schedule_update: {
        Args: { p_counselor_id: string }
        Returns: undefined
      }
    }
    Enums: {
      availability_status: "available" | "pending" | "booked" | "blocked"
      booking_status:
        | "pending"
        | "confirmed"
        | "rejected"
        | "completed"
        | "cancelled"
      mood_type: "very_happy" | "happy" | "neutral" | "sad" | "very_sad"
      resource_type: "article" | "video" | "audio"
      user_role: "student" | "counselor" | "institute"
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
      availability_status: ["available", "pending", "booked", "blocked"],
      booking_status: [
        "pending",
        "confirmed",
        "rejected",
        "completed",
        "cancelled",
      ],
      mood_type: ["very_happy", "happy", "neutral", "sad", "very_sad"],
      resource_type: ["article", "video", "audio"],
      user_role: ["student", "counselor", "institute"],
    },
  },
} as const
