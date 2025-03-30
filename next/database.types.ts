export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      entry: {
        Row: {
          consumed_quantity: number | null;
          consumed_unit: Database["public"]["Enums"]["unit"] | null;
          created_at: string;
          ingredient_id: string | null;
          meal_id: string | null;
          title: string | null;
          type: Database["public"]["Enums"]["entry_type"];
          updated_at: string | null;
          user_id: string;
          uuid: string;
        };
        Insert: {
          consumed_quantity?: number | null;
          consumed_unit?: Database["public"]["Enums"]["unit"] | null;
          created_at?: string;
          ingredient_id?: string | null;
          meal_id?: string | null;
          title?: string | null;
          type: Database["public"]["Enums"]["entry_type"];
          updated_at?: string | null;
          user_id?: string;
          uuid?: string;
        };
        Update: {
          consumed_quantity?: number | null;
          consumed_unit?: Database["public"]["Enums"]["unit"] | null;
          created_at?: string;
          ingredient_id?: string | null;
          meal_id?: string | null;
          title?: string | null;
          type?: Database["public"]["Enums"]["entry_type"];
          updated_at?: string | null;
          user_id?: string;
          uuid?: string;
        };
        Relationships: [
          {
            foreignKeyName: "entry_ingredient_id_fkey";
            columns: ["ingredient_id"];
            isOneToOne: false;
            referencedRelation: "ingredient";
            referencedColumns: ["uuid"];
          },
          {
            foreignKeyName: "entry_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "user";
            referencedColumns: ["uuid"];
          },
          {
            foreignKeyName: "fk_entry_meal";
            columns: ["meal_id"];
            isOneToOne: false;
            referencedRelation: "meal";
            referencedColumns: ["uuid"];
          },
        ];
      };
      generative: {
        Row: {
          content: string | null;
          created_at: string | null;
          ingredient_id: string;
          type: Database["public"]["Enums"]["generative_type"] | null;
          user_id: string;
          uuid: string;
        };
        Insert: {
          content?: string | null;
          created_at?: string | null;
          ingredient_id: string;
          type?: Database["public"]["Enums"]["generative_type"] | null;
          user_id?: string;
          uuid?: string;
        };
        Update: {
          content?: string | null;
          created_at?: string | null;
          ingredient_id?: string;
          type?: Database["public"]["Enums"]["generative_type"] | null;
          user_id?: string;
          uuid?: string;
        };
        Relationships: [
          {
            foreignKeyName: "fk_generative_user";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "user";
            referencedColumns: ["uuid"];
          },
          {
            foreignKeyName: "generative_ingredient_id_fkey";
            columns: ["ingredient_id"];
            isOneToOne: true;
            referencedRelation: "ingredient";
            referencedColumns: ["uuid"];
          },
        ];
      };
      icon: {
        Row: {
          created_at: string;
          title: string;
          updated_at: string | null;
          uuid: string;
        };
        Insert: {
          created_at?: string;
          title: string;
          updated_at?: string | null;
          uuid?: string;
        };
        Update: {
          created_at?: string;
          title?: string;
          updated_at?: string | null;
          uuid?: string;
        };
        Relationships: [];
      };
      ingredient: {
        Row: {
          brand: string | null;
          calcium_100g: number | null;
          calorie_100g: number | null;
          carbohydrate_100g: number | null;
          carbohydrate_sugar_100g: number | null;
          cholesterol_100g: number | null;
          created_at: string;
          fat_100g: number | null;
          fat_saturated_100g: number | null;
          fat_trans_100g: number | null;
          fat_unsaturated_100g: number | null;
          fiber_100g: number | null;
          icon_id: string | null;
          image: string | null;
          iron_100g: number | null;
          micros_100g: Json | null;
          openfood_id: string | null;
          portion: number | null;
          potassium_100g: number | null;
          protein_100g: number | null;
          sodium_100g: number | null;
          title: string | null;
          type: Database["public"]["Enums"]["ingredient_type"];
          updated_at: string | null;
          user_id: string;
          uuid: string;
        };
        Insert: {
          brand?: string | null;
          calcium_100g?: number | null;
          calorie_100g?: number | null;
          carbohydrate_100g?: number | null;
          carbohydrate_sugar_100g?: number | null;
          cholesterol_100g?: number | null;
          created_at?: string;
          fat_100g?: number | null;
          fat_saturated_100g?: number | null;
          fat_trans_100g?: number | null;
          fat_unsaturated_100g?: number | null;
          fiber_100g?: number | null;
          icon_id?: string | null;
          image?: string | null;
          iron_100g?: number | null;
          micros_100g?: Json | null;
          openfood_id?: string | null;
          portion?: number | null;
          potassium_100g?: number | null;
          protein_100g?: number | null;
          sodium_100g?: number | null;
          title?: string | null;
          type: Database["public"]["Enums"]["ingredient_type"];
          updated_at?: string | null;
          user_id?: string;
          uuid?: string;
        };
        Update: {
          brand?: string | null;
          calcium_100g?: number | null;
          calorie_100g?: number | null;
          carbohydrate_100g?: number | null;
          carbohydrate_sugar_100g?: number | null;
          cholesterol_100g?: number | null;
          created_at?: string;
          fat_100g?: number | null;
          fat_saturated_100g?: number | null;
          fat_trans_100g?: number | null;
          fat_unsaturated_100g?: number | null;
          fiber_100g?: number | null;
          icon_id?: string | null;
          image?: string | null;
          iron_100g?: number | null;
          micros_100g?: Json | null;
          openfood_id?: string | null;
          portion?: number | null;
          potassium_100g?: number | null;
          protein_100g?: number | null;
          sodium_100g?: number | null;
          title?: string | null;
          type?: Database["public"]["Enums"]["ingredient_type"];
          updated_at?: string | null;
          user_id?: string;
          uuid?: string;
        };
        Relationships: [
          {
            foreignKeyName: "fk_ingredient_icon";
            columns: ["icon_id"];
            isOneToOne: false;
            referencedRelation: "icon";
            referencedColumns: ["uuid"];
          },
          {
            foreignKeyName: "fk_ingredient_user";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "user";
            referencedColumns: ["uuid"];
          },
        ];
      };
      meal: {
        Row: {
          created_at: string;
          icon_id: string;
          title: string;
          updated_at: string | null;
          user_id: string;
          uuid: string;
        };
        Insert: {
          created_at?: string;
          icon_id: string;
          title: string;
          updated_at?: string | null;
          user_id?: string;
          uuid?: string;
        };
        Update: {
          created_at?: string;
          icon_id?: string;
          title?: string;
          updated_at?: string | null;
          user_id?: string;
          uuid?: string;
        };
        Relationships: [
          {
            foreignKeyName: "fk_meal_icon";
            columns: ["icon_id"];
            isOneToOne: false;
            referencedRelation: "icon";
            referencedColumns: ["uuid"];
          },
          {
            foreignKeyName: "fk_meal_user";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "user";
            referencedColumns: ["uuid"];
          },
        ];
      };
      meal_ingredient: {
        Row: {
          created_at: string | null;
          ingredient_id: string;
          meal_id: string;
          quantity: number | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          ingredient_id: string;
          meal_id: string;
          quantity?: number | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Update: {
          created_at?: string | null;
          ingredient_id?: string;
          meal_id?: string;
          quantity?: number | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "fk_meal_ingredient_ingredient";
            columns: ["ingredient_id"];
            isOneToOne: false;
            referencedRelation: "ingredient";
            referencedColumns: ["uuid"];
          },
          {
            foreignKeyName: "fk_meal_ingredient_meal";
            columns: ["meal_id"];
            isOneToOne: false;
            referencedRelation: "meal";
            referencedColumns: ["uuid"];
          },
          {
            foreignKeyName: "fk_meal_ingredient_user";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "user";
            referencedColumns: ["uuid"];
          },
        ];
      };
      usage: {
        Row: {
          created_at: string;
          entry_id: string;
          input_tokens: number;
          model: string;
          output_tokens: number;
          task: Database["public"]["Enums"]["task"];
          uuid: string;
        };
        Insert: {
          created_at?: string;
          entry_id: string;
          input_tokens: number;
          model: string;
          output_tokens: number;
          task: Database["public"]["Enums"]["task"];
          uuid?: string;
        };
        Update: {
          created_at?: string;
          entry_id?: string;
          input_tokens?: number;
          model?: string;
          output_tokens?: number;
          task?: Database["public"]["Enums"]["task"];
          uuid?: string;
        };
        Relationships: [
          {
            foreignKeyName: "fk_usage_entry";
            columns: ["entry_id"];
            isOneToOne: false;
            referencedRelation: "entry";
            referencedColumns: ["uuid"];
          },
        ];
      };
      user: {
        Row: {
          created_at: string;
          measurement: Database["public"]["Enums"]["measurement"];
          updated_at: string | null;
          username: string;
          uuid: string;
        };
        Insert: {
          created_at?: string;
          measurement?: Database["public"]["Enums"]["measurement"];
          updated_at?: string | null;
          username: string;
          uuid?: string;
        };
        Update: {
          created_at?: string;
          measurement?: Database["public"]["Enums"]["measurement"];
          updated_at?: string | null;
          username?: string;
          uuid?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      entry_type: "meal" | "ingredient";
      generative_type: "image" | "image_description" | "description";
      ingredient_type:
        | "label"
        | "openfood"
        | "estimation"
        | "description"
        | "manual";
      measurement: "imperial" | "metric";
      task:
        | "icon_generation"
        | "icon_normalization"
        | "estimation_title_generation"
        | "estimation_nutrition_generation"
        | "label_nutrition_generation"
        | "description_title_generation"
        | "description_nutrition_generation";
      unit:
        | "teaspoon"
        | "tablespoon"
        | "cup"
        | "milliliter"
        | "liter"
        | "fluid_ounce"
        | "pint"
        | "quart"
        | "gallon"
        | "gram"
        | "kilogram"
        | "ounce"
        | "pound"
        | "piece";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;
