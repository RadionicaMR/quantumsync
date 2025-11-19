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
      affiliate_clicks: {
        Row: {
          affiliate_id: string
          conversion_date: string | null
          converted: boolean | null
          created_at: string | null
          id: string
          ip_address: string | null
          page: string | null
          referrer: string | null
          user_agent: string | null
        }
        Insert: {
          affiliate_id: string
          conversion_date?: string | null
          converted?: boolean | null
          created_at?: string | null
          id?: string
          ip_address?: string | null
          page?: string | null
          referrer?: string | null
          user_agent?: string | null
        }
        Update: {
          affiliate_id?: string
          conversion_date?: string | null
          converted?: boolean | null
          created_at?: string | null
          id?: string
          ip_address?: string | null
          page?: string | null
          referrer?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_clicks_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_payments: {
        Row: {
          admin_notes: string | null
          affiliate_id: string
          amount: number
          id: string
          paid_at: string | null
          payment_method: Database["public"]["Enums"]["payment_method"]
          status: string | null
        }
        Insert: {
          admin_notes?: string | null
          affiliate_id: string
          amount: number
          id?: string
          paid_at?: string | null
          payment_method: Database["public"]["Enums"]["payment_method"]
          status?: string | null
        }
        Update: {
          admin_notes?: string | null
          affiliate_id?: string
          amount?: number
          id?: string
          paid_at?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"]
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_payments_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_sales: {
        Row: {
          affiliate_id: string
          commission_amount: number
          commission_status:
            | Database["public"]["Enums"]["commission_status"]
            | null
          created_at: string | null
          currency: string
          customer_email: string
          customer_name: string | null
          id: string
          notes: string | null
          payment_date: string | null
          payment_method: Database["public"]["Enums"]["payment_method"]
          product_id: string | null
          sale_amount: number
          transaction_id: string | null
        }
        Insert: {
          affiliate_id: string
          commission_amount: number
          commission_status?:
            | Database["public"]["Enums"]["commission_status"]
            | null
          created_at?: string | null
          currency: string
          customer_email: string
          customer_name?: string | null
          id?: string
          notes?: string | null
          payment_date?: string | null
          payment_method: Database["public"]["Enums"]["payment_method"]
          product_id?: string | null
          sale_amount: number
          transaction_id?: string | null
        }
        Update: {
          affiliate_id?: string
          commission_amount?: number
          commission_status?:
            | Database["public"]["Enums"]["commission_status"]
            | null
          created_at?: string | null
          currency?: string
          customer_email?: string
          customer_name?: string | null
          id?: string
          notes?: string | null
          payment_date?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"]
          product_id?: string | null
          sale_amount?: number
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_sales_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "affiliate_sales_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_settings: {
        Row: {
          id: string
          setting_key: string
          setting_value: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          setting_key: string
          setting_value: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          setting_key?: string
          setting_value?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      affiliates: {
        Row: {
          affiliate_code: string
          commission_rate: number | null
          country: string
          created_at: string | null
          email: string
          id: string
          mercadopago_alias: string | null
          mercadopago_cvu: string | null
          name: string
          paid_commissions: number | null
          payment_method: Database["public"]["Enums"]["payment_method"]
          paypal_email: string | null
          pending_commissions: number | null
          status: string | null
          total_clicks: number | null
          total_commissions: number | null
          total_sales: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          affiliate_code: string
          commission_rate?: number | null
          country: string
          created_at?: string | null
          email: string
          id?: string
          mercadopago_alias?: string | null
          mercadopago_cvu?: string | null
          name: string
          paid_commissions?: number | null
          payment_method: Database["public"]["Enums"]["payment_method"]
          paypal_email?: string | null
          pending_commissions?: number | null
          status?: string | null
          total_clicks?: number | null
          total_commissions?: number | null
          total_sales?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          affiliate_code?: string
          commission_rate?: number | null
          country?: string
          created_at?: string | null
          email?: string
          id?: string
          mercadopago_alias?: string | null
          mercadopago_cvu?: string | null
          name?: string
          paid_commissions?: number | null
          payment_method?: Database["public"]["Enums"]["payment_method"]
          paypal_email?: string | null
          pending_commissions?: number | null
          status?: string | null
          total_clicks?: number | null
          total_commissions?: number | null
          total_sales?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      image_gallery: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          file_path: string
          folder_name: string | null
          id: string
          is_active: boolean | null
          name: string
          tags: string[] | null
          thumbnail_url: string | null
          uploaded_by: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          file_path: string
          folder_name?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          tags?: string[] | null
          thumbnail_url?: string | null
          uploaded_by?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          file_path?: string
          folder_name?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          tags?: string[] | null
          thumbnail_url?: string | null
          uploaded_by?: string | null
        }
        Relationships: []
      }
      patients: {
        Row: {
          created_at: string | null
          id: string
          name: string
          notes: string | null
          therapist_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          notes?: string | null
          therapist_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          notes?: string | null
          therapist_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          active: boolean | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          price_ars: number | null
          price_usd: number | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          price_ars?: number | null
          price_usd?: number | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          price_ars?: number | null
          price_usd?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      sessions: {
        Row: {
          created_at: string | null
          id: string
          notes: string | null
          patient_id: string
          session_data: Json
          session_type: Database["public"]["Enums"]["session_type"]
          therapist_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          notes?: string | null
          patient_id: string
          session_data?: Json
          session_type: Database["public"]["Enums"]["session_type"]
          therapist_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          notes?: string | null
          patient_id?: string
          session_data?: Json
          session_type?: Database["public"]["Enums"]["session_type"]
          therapist_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sessions_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      auth_email: { Args: never; Returns: string }
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      commission_status: "pending" | "approved" | "paid"
      payment_method: "paypal" | "mercadopago"
      session_type:
        | "diagnosis"
        | "treatment"
        | "manifestation"
        | "balance_chakras"
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
      app_role: ["admin", "user"],
      commission_status: ["pending", "approved", "paid"],
      payment_method: ["paypal", "mercadopago"],
      session_type: [
        "diagnosis",
        "treatment",
        "manifestation",
        "balance_chakras",
      ],
    },
  },
} as const
