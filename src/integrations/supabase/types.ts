export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      activation_keys: {
        Row: {
          created_at: string
          id: string
          key: string
          user_id: string
          valid_until: string
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          user_id: string
          valid_until: string
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          user_id?: string
          valid_until?: string
        }
        Relationships: [
          {
            foreignKeyName: "activation_keys_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "sub_user_view"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_users: {
        Row: {
          created_at: string
          id: string
          is_super_admin: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_super_admin?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_super_admin?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      backup_settings: {
        Row: {
          auto_backup_enabled: boolean | null
          backup_interval_minutes: number | null
          cleanup_days: number | null
          cleanup_enabled: boolean | null
          compression_enabled: boolean | null
          created_at: string | null
          encryption_enabled: boolean | null
          id: string
          max_backup_versions: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          auto_backup_enabled?: boolean | null
          backup_interval_minutes?: number | null
          cleanup_days?: number | null
          cleanup_enabled?: boolean | null
          compression_enabled?: boolean | null
          created_at?: string | null
          encryption_enabled?: boolean | null
          id?: string
          max_backup_versions?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          auto_backup_enabled?: boolean | null
          backup_interval_minutes?: number | null
          cleanup_days?: number | null
          cleanup_enabled?: boolean | null
          compression_enabled?: boolean | null
          created_at?: string | null
          encryption_enabled?: boolean | null
          id?: string
          max_backup_versions?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      backups: {
        Row: {
          created_at: string
          id: string
          json_data: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          json_data: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          json_data?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      clients: {
        Row: {
          address: string
          company: string | null
          created_at: string
          email: string
          id: string
          name: string
          phone: string | null
          updated_at: string
          user_id: string
          vat_code: string | null
        }
        Insert: {
          address: string
          company?: string | null
          created_at?: string
          email: string
          id?: string
          name: string
          phone?: string | null
          updated_at?: string
          user_id: string
          vat_code?: string | null
        }
        Update: {
          address?: string
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
          vat_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      company_settings: {
        Row: {
          address: string
          created_at: string
          decoration_options: Json
          delivery_note_settings: Json
          email: string
          id: string
          invoice_settings: Json
          logo: string | null
          name: string
          phone: string
          quotation_settings: Json
          tax_configurations: Json | null
          tax_settings: Json
          title_settings: Json | null
          updated_at: string
          user_id: string
          vat_code: string
        }
        Insert: {
          address: string
          created_at?: string
          decoration_options?: Json
          delivery_note_settings?: Json
          email: string
          id?: string
          invoice_settings?: Json
          logo?: string | null
          name: string
          phone: string
          quotation_settings?: Json
          tax_configurations?: Json | null
          tax_settings?: Json
          title_settings?: Json | null
          updated_at?: string
          user_id: string
          vat_code: string
        }
        Update: {
          address?: string
          created_at?: string
          decoration_options?: Json
          delivery_note_settings?: Json
          email?: string
          id?: string
          invoice_settings?: Json
          logo?: string | null
          name?: string
          phone?: string
          quotation_settings?: Json
          tax_configurations?: Json | null
          tax_settings?: Json
          title_settings?: Json | null
          updated_at?: string
          user_id?: string
          vat_code?: string
        }
        Relationships: []
      }
      credit_note_items: {
        Row: {
          credit_note_id: string
          description: string
          discount: number | null
          id: string
          product_id: string | null
          quantity: number
          reference: string
          tax_rate: number
          total: number
          unit_price: number
        }
        Insert: {
          credit_note_id: string
          description: string
          discount?: number | null
          id?: string
          product_id?: string | null
          quantity: number
          reference: string
          tax_rate?: number
          total: number
          unit_price: number
        }
        Update: {
          credit_note_id?: string
          description?: string
          discount?: number | null
          id?: string
          product_id?: string | null
          quantity?: number
          reference?: string
          tax_rate?: number
          total?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_credit_note_items_credit_note"
            columns: ["credit_note_id"]
            isOneToOne: false
            referencedRelation: "credit_notes"
            referencedColumns: ["id"]
          },
        ]
      }
      credit_notes: {
        Row: {
          client_id: string
          created_at: string
          date: string
          id: string
          number: string
          original_invoice_id: string | null
          reason: string | null
          status: string
          subtotal: number
          tax_amount: number
          total: number
          updated_at: string
          user_id: string
        }
        Insert: {
          client_id: string
          created_at?: string
          date: string
          id?: string
          number: string
          original_invoice_id?: string | null
          reason?: string | null
          status?: string
          subtotal?: number
          tax_amount?: number
          total?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          client_id?: string
          created_at?: string
          date?: string
          id?: string
          number?: string
          original_invoice_id?: string | null
          reason?: string | null
          status?: string
          subtotal?: number
          tax_amount?: number
          total?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_credit_notes_client"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_credit_notes_invoice"
            columns: ["original_invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_note_items: {
        Row: {
          delivery_note_id: string
          description: string
          discount: number | null
          id: string
          product_id: string | null
          quantity: number
          reference: string
          tax_rate: number
          total: number
          unit_price: number
        }
        Insert: {
          delivery_note_id: string
          description: string
          discount?: number | null
          id?: string
          product_id?: string | null
          quantity: number
          reference: string
          tax_rate?: number
          total: number
          unit_price: number
        }
        Update: {
          delivery_note_id?: string
          description?: string
          discount?: number | null
          id?: string
          product_id?: string | null
          quantity?: number
          reference?: string
          tax_rate?: number
          total?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_delivery_note_items_delivery_note"
            columns: ["delivery_note_id"]
            isOneToOne: false
            referencedRelation: "delivery_notes"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_notes: {
        Row: {
          client_id: string
          created_at: string
          date: string
          delivery_date: string
          id: string
          notes: string | null
          number: string
          status: string
          subtotal: number
          tax_amount: number
          total: number
          updated_at: string
          user_id: string
        }
        Insert: {
          client_id: string
          created_at?: string
          date: string
          delivery_date: string
          id?: string
          notes?: string | null
          number: string
          status?: string
          subtotal?: number
          tax_amount?: number
          total?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          client_id?: string
          created_at?: string
          date?: string
          delivery_date?: string
          id?: string
          notes?: string | null
          number?: string
          status?: string
          subtotal?: number
          tax_amount?: number
          total?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_delivery_notes_client"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      depots: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      invoice_items: {
        Row: {
          description: string
          discount: number | null
          id: string
          invoice_id: string
          product_id: string | null
          quantity: number
          reference: string
          tax_rate: number
          total: number
          unit_price: number
        }
        Insert: {
          description: string
          discount?: number | null
          id?: string
          invoice_id: string
          product_id?: string | null
          quantity: number
          reference: string
          tax_rate: number
          total: number
          unit_price: number
        }
        Update: {
          description?: string
          discount?: number | null
          id?: string
          invoice_id?: string
          product_id?: string | null
          quantity?: number
          reference?: string
          tax_rate?: number
          total?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          client_id: string
          created_at: string
          date: string
          due_date: string
          id: string
          notes: string | null
          number: string
          stamp_tax: number | null
          status: string
          subtotal: number
          tax_amount: number
          total: number
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          client_id: string
          created_at?: string
          date: string
          due_date: string
          id?: string
          notes?: string | null
          number: string
          stamp_tax?: number | null
          status: string
          subtotal: number
          tax_amount: number
          total: number
          type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          client_id?: string
          created_at?: string
          date?: string
          due_date?: string
          id?: string
          notes?: string | null
          number?: string
          stamp_tax?: number | null
          status?: string
          subtotal?: number
          tax_amount?: number
          total?: number
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      kammoun_orders: {
        Row: {
          address: string
          created_at: string | null
          customer_name: string
          delivery_fee: number
          id: string
          phone: string
          product_id: string | null
          region: string
          status: string
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          address: string
          created_at?: string | null
          customer_name: string
          delivery_fee?: number
          id?: string
          phone: string
          product_id?: string | null
          region: string
          status?: string
          total_amount: number
          updated_at?: string | null
        }
        Update: {
          address?: string
          created_at?: string | null
          customer_name?: string
          delivery_fee?: number
          id?: string
          phone?: string
          product_id?: string | null
          region?: string
          status?: string
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kammoun_orders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "kammoun_products"
            referencedColumns: ["id"]
          },
        ]
      }
      kammoun_products: {
        Row: {
          created_at: string | null
          description: string
          id: string
          image_url: string | null
          is_featured: boolean | null
          price: number
          reference: string
          tax_rate: number
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          price: number
          reference: string
          tax_rate?: number
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          price?: number
          reference?: string
          tax_rate?: number
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      payment_logs: {
        Row: {
          additional_data: Json | null
          email: string
          error_message: string | null
          id: string
          payment_reference_id: string | null
          payment_status: string
          plan_selected: string
          processed_by: string | null
          subscription_updated: boolean
          timestamp: string
          user_id: string
        }
        Insert: {
          additional_data?: Json | null
          email: string
          error_message?: string | null
          id?: string
          payment_reference_id?: string | null
          payment_status: string
          plan_selected: string
          processed_by?: string | null
          subscription_updated?: boolean
          timestamp?: string
          user_id: string
        }
        Update: {
          additional_data?: Json | null
          email?: string
          error_message?: string | null
          id?: string
          payment_reference_id?: string | null
          payment_status?: string
          plan_selected?: string
          processed_by?: string | null
          subscription_updated?: boolean
          timestamp?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "sub_user_view"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          echeance_date: string | null
          id: string
          invoice_id: string
          notes: string | null
          payment_date: string
          payment_method: string
          payment_type: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          echeance_date?: string | null
          id?: string
          invoice_id: string
          notes?: string | null
          payment_date: string
          payment_method: string
          payment_type: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          echeance_date?: string | null
          id?: string
          invoice_id?: string
          notes?: string | null
          payment_date?: string
          payment_method?: string
          payment_type?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      product_stock: {
        Row: {
          allow_negative: boolean
          created_at: string
          depot_id: string
          id: string
          product_id: string
          quantity: number
          updated_at: string
          user_id: string
        }
        Insert: {
          allow_negative?: boolean
          created_at?: string
          depot_id: string
          id?: string
          product_id: string
          quantity?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          allow_negative?: boolean
          created_at?: string
          depot_id?: string
          id?: string
          product_id?: string
          quantity?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_stock_depot_id_fkey"
            columns: ["depot_id"]
            isOneToOne: false
            referencedRelation: "depots"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          name?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      purchase_order_items: {
        Row: {
          description: string
          discount: number | null
          id: string
          product_id: string | null
          purchase_order_id: string
          quantity: number
          reference: string
          tax_rate: number
          total: number
          unit_price: number
        }
        Insert: {
          description: string
          discount?: number | null
          id?: string
          product_id?: string | null
          purchase_order_id: string
          quantity: number
          reference: string
          tax_rate?: number
          total: number
          unit_price: number
        }
        Update: {
          description?: string
          discount?: number | null
          id?: string
          product_id?: string | null
          purchase_order_id?: string
          quantity?: number
          reference?: string
          tax_rate?: number
          total?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_purchase_order_items_purchase_order_id"
            columns: ["purchase_order_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_orders: {
        Row: {
          created_at: string
          date: string
          delivery_date: string
          id: string
          notes: string | null
          number: string
          status: string
          subtotal: number
          supplier_id: string
          tax_amount: number
          total: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date: string
          delivery_date: string
          id?: string
          notes?: string | null
          number: string
          status?: string
          subtotal?: number
          supplier_id: string
          tax_amount?: number
          total?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          delivery_date?: string
          id?: string
          notes?: string | null
          number?: string
          status?: string
          subtotal?: number
          supplier_id?: string
          tax_amount?: number
          total?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      quotation_items: {
        Row: {
          description: string
          discount: number | null
          id: string
          product_id: string | null
          quantity: number
          quotation_id: string
          reference: string
          tax_rate: number
          total: number
          unit_price: number
        }
        Insert: {
          description: string
          discount?: number | null
          id?: string
          product_id?: string | null
          quantity: number
          quotation_id: string
          reference: string
          tax_rate?: number
          total: number
          unit_price: number
        }
        Update: {
          description?: string
          discount?: number | null
          id?: string
          product_id?: string | null
          quantity?: number
          quotation_id?: string
          reference?: string
          tax_rate?: number
          total?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_quotation_items_quotation"
            columns: ["quotation_id"]
            isOneToOne: false
            referencedRelation: "quotations"
            referencedColumns: ["id"]
          },
        ]
      }
      quotations: {
        Row: {
          client_id: string
          created_at: string
          date: string
          id: string
          notes: string | null
          number: string
          status: string
          subtotal: number
          tax_amount: number
          total: number
          updated_at: string
          user_id: string
          valid_until: string
        }
        Insert: {
          client_id: string
          created_at?: string
          date: string
          id?: string
          notes?: string | null
          number: string
          status?: string
          subtotal?: number
          tax_amount?: number
          total?: number
          updated_at?: string
          user_id: string
          valid_until: string
        }
        Update: {
          client_id?: string
          created_at?: string
          date?: string
          id?: string
          notes?: string | null
          number?: string
          status?: string
          subtotal?: number
          tax_amount?: number
          total?: number
          updated_at?: string
          user_id?: string
          valid_until?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_quotations_client"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          created_at: string
          filters: Json
          id: string
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          filters?: Json
          id?: string
          title: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          filters?: Json
          id?: string
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reusable_items: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          tax_rate: number
          unit_price: number
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          tax_rate?: number
          unit_price?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          tax_rate?: number
          unit_price?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      stock_alerts: {
        Row: {
          alert_enabled: boolean
          created_at: string
          depot_id: string
          id: string
          min_quantity: number
          product_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          alert_enabled?: boolean
          created_at?: string
          depot_id: string
          id?: string
          min_quantity?: number
          product_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          alert_enabled?: boolean
          created_at?: string
          depot_id?: string
          id?: string
          min_quantity?: number
          product_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_stock_alerts_depot"
            columns: ["depot_id"]
            isOneToOne: false
            referencedRelation: "depots"
            referencedColumns: ["id"]
          },
        ]
      }
      stock_movements: {
        Row: {
          created_at: string
          depot_id: string
          id: string
          movement_type: string
          notes: string | null
          product_id: string
          quantity: number
          user_id: string
        }
        Insert: {
          created_at?: string
          depot_id: string
          id?: string
          movement_type: string
          notes?: string | null
          product_id: string
          quantity: number
          user_id: string
        }
        Update: {
          created_at?: string
          depot_id?: string
          id?: string
          movement_type?: string
          notes?: string | null
          product_id?: string
          quantity?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "stock_movements_depot_id_fkey"
            columns: ["depot_id"]
            isOneToOne: false
            referencedRelation: "depots"
            referencedColumns: ["id"]
          },
        ]
      }
      sub_user_permissions: {
        Row: {
          created_at: string
          id: string
          permission_level: string
          resource: string
          sub_user_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          permission_level: string
          resource: string
          sub_user_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          permission_level?: string
          resource?: string
          sub_user_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sub_user_permissions_sub_user_id_fkey"
            columns: ["sub_user_id"]
            isOneToOne: false
            referencedRelation: "sub_users"
            referencedColumns: ["id"]
          },
        ]
      }
      sub_users: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          parent_user_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          parent_user_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          parent_user_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sub_users_parent_user_id_fkey"
            columns: ["parent_user_id"]
            isOneToOne: false
            referencedRelation: "sub_user_view"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          created_at: string
          end_date: string
          id: string
          plan_type: string
          start_date: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          end_date: string
          id?: string
          plan_type: string
          start_date?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          end_date?: string
          id?: string
          plan_type?: string
          start_date?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          address: string
          company: string | null
          created_at: string
          email: string
          id: string
          name: string
          phone: string | null
          updated_at: string
          user_id: string
          vat_code: string | null
        }
        Insert: {
          address: string
          company?: string | null
          created_at?: string
          email: string
          id?: string
          name: string
          phone?: string | null
          updated_at?: string
          user_id: string
          vat_code?: string | null
        }
        Update: {
          address?: string
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
          vat_code?: string | null
        }
        Relationships: []
      }
      valid_activation_keys: {
        Row: {
          created_at: string
          id: string
          is_used: boolean
          key: string
          used_at: string | null
          used_by: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_used?: boolean
          key: string
          used_at?: string | null
          used_by?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_used?: boolean
          key?: string
          used_at?: string | null
          used_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "valid_activation_keys_used_by_fkey"
            columns: ["used_by"]
            isOneToOne: false
            referencedRelation: "sub_user_view"
            referencedColumns: ["id"]
          },
        ]
      }
      versioned_backups: {
        Row: {
          backup_type: string
          backup_version: string
          compression_type: string | null
          content_hash: string
          created_at: string | null
          id: string
          is_compressed: boolean | null
          is_encrypted: boolean | null
          json_data: Json
          metadata: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          backup_type?: string
          backup_version?: string
          compression_type?: string | null
          content_hash: string
          created_at?: string | null
          id?: string
          is_compressed?: boolean | null
          is_encrypted?: boolean | null
          json_data: Json
          metadata?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          backup_type?: string
          backup_version?: string
          compression_type?: string | null
          content_hash?: string
          created_at?: string | null
          id?: string
          is_compressed?: boolean | null
          is_encrypted?: boolean | null
          json_data?: Json
          metadata?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      visitor_tracking: {
        Row: {
          created_at: string
          id: string
          page_url: string
          referrer: string | null
          session_id: string
          user_agent: string | null
          visited_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          page_url: string
          referrer?: string | null
          session_id: string
          user_agent?: string | null
          visited_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          page_url?: string
          referrer?: string | null
          session_id?: string
          user_agent?: string | null
          visited_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      sub_user_view: {
        Row: {
          created_at: string | null
          email: string | null
          id: string | null
          name: string | null
          parent_user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sub_users_parent_user_id_fkey"
            columns: ["parent_user_id"]
            isOneToOne: false
            referencedRelation: "sub_user_view"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      check_permission: {
        Args: { p_user_id: string; p_resource: string }
        Returns: string
      }
      cleanup_old_backups: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_sub_user: {
        Args: {
          p_parent_user_id: string
          p_email: string
          p_password: string
          p_name: string
          p_default_permissions?: Json
        }
        Returns: string
      }
      create_user_profile: {
        Args: { p_user_id: string; p_email: string; p_name?: string }
        Returns: undefined
      }
      generate_license_key: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_backup_settings: {
        Args: { p_user_id: string }
        Returns: {
          auto_backup_enabled: boolean
          backup_interval_minutes: number
          max_backup_versions: number
          compression_enabled: boolean
          encryption_enabled: boolean
          cleanup_enabled: boolean
          cleanup_days: number
        }[]
      }
      get_company_settings_by_user: {
        Args: { p_user_id: string }
        Returns: {
          id: string
          user_id: string
          name: string
          address: string
          phone: string
          email: string
          vat_code: string
          logo: string
          allow_negative_stock: boolean
          tax_settings: Json
          invoice_settings: Json
          quotation_settings: Json
          delivery_note_settings: Json
          decoration_options: Json
          title_settings: Json
          tax_configurations: Json
          created_at: string
          updated_at: string
        }[]
      }
      get_user_admin_status: {
        Args: { check_user_id: string }
        Returns: Json
      }
      insert_product: {
        Args: {
          p_title: string
          p_description: string
          p_reference: string
          p_price: number
          p_tax_rate: number
          p_image_url?: string
          p_is_featured?: boolean
        }
        Returns: string
      }
      is_admin: {
        Args: { check_user_id?: string }
        Returns: boolean
      }
      is_super_admin: {
        Args: { check_user_id?: string }
        Returns: boolean
      }
      upsert_company_settings: {
        Args: {
          p_user_id: string
          p_name: string
          p_address: string
          p_phone: string
          p_email: string
          p_vat_code: string
          p_logo?: string
          p_allow_negative_stock?: boolean
          p_tax_settings?: string
          p_invoice_settings?: string
          p_quotation_settings?: string
          p_delivery_note_settings?: string
          p_decoration_options?: string
          p_title_settings?: string
          p_tax_configurations?: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
