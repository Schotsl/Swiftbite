

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgsodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."entry_type" AS ENUM (
    'meal',
    'ingredient'
);


ALTER TYPE "public"."entry_type" OWNER TO "postgres";


CREATE TYPE "public"."generative_type" AS ENUM (
    'image',
    'image_description',
    'description'
);


ALTER TYPE "public"."generative_type" OWNER TO "postgres";


CREATE TYPE "public"."ingredient_type" AS ENUM (
    'label',
    'openfood',
    'estimation',
    'description',
    'manual'
);


ALTER TYPE "public"."ingredient_type" OWNER TO "postgres";


CREATE TYPE "public"."measurement" AS ENUM (
    'imperial',
    'metric'
);


ALTER TYPE "public"."measurement" OWNER TO "postgres";


CREATE TYPE "public"."task" AS ENUM (
    'icon_generation',
    'icon_normalization',
    'title_generation',
    'title_normalization',
    'nutrition_estimation',
    'search_normalization',
    'size_estimation',
    'description_nutrition_generation'
);


ALTER TYPE "public"."task" OWNER TO "postgres";


CREATE TYPE "public"."unit" AS ENUM (
    'teaspoon',
    'tablespoon',
    'cup',
    'milliliter',
    'liter',
    'fluid_ounce',
    'pint',
    'quart',
    'gallon',
    'gram',
    'kilogram',
    'ounce',
    'pound',
    'piece'
);


ALTER TYPE "public"."unit" OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."entry" (
    "uuid" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "type" "public"."entry_type" NOT NULL,
    "title" character varying,
    "user_id" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "meal_id" "uuid",
    "ingredient_id" "uuid",
    "consumed_unit" "public"."unit" DEFAULT 'gram'::"public"."unit",
    "consumed_quantity" double precision,
    "updated_at" timestamp without time zone,
    "created_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "chk_entry_type" CHECK (((("type" = 'meal'::"public"."entry_type") AND ("meal_id" IS NOT NULL) AND ("ingredient_id" IS NULL)) OR (("type" = 'ingredient'::"public"."entry_type") AND ("ingredient_id" IS NOT NULL) AND ("meal_id" IS NULL))))
);


ALTER TABLE "public"."entry" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."generative" (
    "uuid" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "ingredient_id" "uuid" NOT NULL,
    "user_id" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "type" "public"."generative_type",
    "content" character varying,
    "created_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."generative" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."icon" (
    "uuid" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" character varying NOT NULL,
    "updated_at" timestamp without time zone,
    "created_at" timestamp without time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."icon" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."ingredient" (
    "uuid" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "type" "public"."ingredient_type" NOT NULL,
    "user_id" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "icon_id" "uuid",
    "openfood_id" character varying,
    "title" character varying,
    "portion" double precision,
    "calorie_100g" double precision,
    "protein_100g" double precision,
    "fat_100g" double precision,
    "fat_saturated_100g" double precision,
    "fat_unsaturated_100g" double precision,
    "fat_trans_100g" double precision,
    "cholesterol_100g" double precision,
    "carbohydrate_100g" double precision,
    "carbohydrate_sugar_100g" double precision,
    "fiber_100g" double precision,
    "sodium_100g" double precision,
    "potassium_100g" double precision,
    "calcium_100g" double precision,
    "iron_100g" double precision,
    "micros_100g" "jsonb",
    "updated_at" timestamp without time zone,
    "created_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "image" character varying,
    "brand" character varying
);


ALTER TABLE "public"."ingredient" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."meal" (
    "uuid" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" character varying NOT NULL,
    "user_id" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "icon_id" "uuid" NOT NULL,
    "updated_at" timestamp without time zone,
    "created_at" timestamp without time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."meal" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."meal_ingredient" (
    "meal_id" "uuid" NOT NULL,
    "ingredient_id" "uuid" NOT NULL,
    "user_id" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "quantity" double precision,
    "updated_at" timestamp without time zone,
    "created_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."meal_ingredient" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."usage" (
    "uuid" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "task" "public"."task" NOT NULL,
    "model" character varying NOT NULL,
    "input_tokens" integer NOT NULL,
    "output_tokens" integer NOT NULL,
    "created_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "user_id" "uuid" DEFAULT "auth"."uid"() NOT NULL
);


ALTER TABLE "public"."usage" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user" (
    "uuid" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "username" character varying NOT NULL,
    "measurement" "public"."measurement" DEFAULT 'metric'::"public"."measurement" NOT NULL,
    "updated_at" timestamp without time zone,
    "created_at" timestamp without time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."user" OWNER TO "postgres";


ALTER TABLE ONLY "public"."entry"
    ADD CONSTRAINT "entry_pkey" PRIMARY KEY ("uuid");



ALTER TABLE ONLY "public"."generative"
    ADD CONSTRAINT "generative_ingredient_id_key" UNIQUE ("ingredient_id");



ALTER TABLE ONLY "public"."generative"
    ADD CONSTRAINT "generative_pkey" PRIMARY KEY ("uuid");



ALTER TABLE ONLY "public"."icon"
    ADD CONSTRAINT "icon_pkey" PRIMARY KEY ("uuid");



ALTER TABLE ONLY "public"."icon"
    ADD CONSTRAINT "icon_title_key" UNIQUE ("title");



ALTER TABLE ONLY "public"."ingredient"
    ADD CONSTRAINT "ingredient_pkey" PRIMARY KEY ("uuid");



ALTER TABLE ONLY "public"."meal_ingredient"
    ADD CONSTRAINT "meal_ingredient_pkey" PRIMARY KEY ("meal_id", "ingredient_id");



ALTER TABLE ONLY "public"."meal"
    ADD CONSTRAINT "meal_pkey" PRIMARY KEY ("uuid");



ALTER TABLE ONLY "public"."usage"
    ADD CONSTRAINT "usage_pkey" PRIMARY KEY ("uuid");



ALTER TABLE ONLY "public"."user"
    ADD CONSTRAINT "user_pkey" PRIMARY KEY ("uuid");



CREATE INDEX "idx_entry_ingredient_id" ON "public"."entry" USING "btree" ("ingredient_id");



CREATE INDEX "idx_entry_meal_id" ON "public"."entry" USING "btree" ("meal_id");



CREATE INDEX "idx_entry_user_id" ON "public"."entry" USING "btree" ("user_id");



CREATE INDEX "idx_icon_title" ON "public"."icon" USING "btree" ("title");



CREATE INDEX "idx_ingredient_icon_id" ON "public"."ingredient" USING "btree" ("icon_id");



CREATE INDEX "idx_ingredient_user_id" ON "public"."ingredient" USING "btree" ("user_id");



CREATE INDEX "idx_meal_icon_id" ON "public"."meal" USING "btree" ("icon_id");



CREATE INDEX "idx_meal_ingredient_user_id" ON "public"."meal_ingredient" USING "btree" ("user_id");



CREATE INDEX "idx_meal_user_id" ON "public"."meal" USING "btree" ("user_id");



CREATE OR REPLACE TRIGGER "handle_generative_database" AFTER INSERT ON "public"."generative" FOR EACH ROW EXECUTE FUNCTION "supabase_functions"."http_request"('https://swiftbite.app/api/ai-server/handle-generative-database', 'POST', '{"Content-Type":"application/json","X-Supabase-Secret":"Eup1iBCABuPVqUXQTfP8299PD5S6HEPJijwt2SKKMM59HdJu07BTMWkAbF2GgpqA"}', '{}', '10000');



CREATE OR REPLACE TRIGGER "handle_ingredient_database" AFTER INSERT OR UPDATE ON "public"."ingredient" FOR EACH ROW EXECUTE FUNCTION "supabase_functions"."http_request"('https://swiftbite.app/api/ai-server/handle-ingredient-database', 'POST', '{"Content-Type":"application/json","X-Supabase-Secret":"Eup1iBCABuPVqUXQTfP8299PD5S6HEPJijwt2SKKMM59HdJu07BTMWkAbF2GgpqA"}', '{}', '10000');



ALTER TABLE ONLY "public"."entry"
    ADD CONSTRAINT "entry_ingredient_id_fkey" FOREIGN KEY ("ingredient_id") REFERENCES "public"."ingredient"("uuid");



ALTER TABLE ONLY "public"."entry"
    ADD CONSTRAINT "entry_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("uuid");



ALTER TABLE ONLY "public"."entry"
    ADD CONSTRAINT "fk_entry_meal" FOREIGN KEY ("meal_id") REFERENCES "public"."meal"("uuid");



ALTER TABLE ONLY "public"."generative"
    ADD CONSTRAINT "fk_generative_user" FOREIGN KEY ("user_id") REFERENCES "public"."user"("uuid");



ALTER TABLE ONLY "public"."ingredient"
    ADD CONSTRAINT "fk_ingredient_icon" FOREIGN KEY ("icon_id") REFERENCES "public"."icon"("uuid");



ALTER TABLE ONLY "public"."ingredient"
    ADD CONSTRAINT "fk_ingredient_user" FOREIGN KEY ("user_id") REFERENCES "public"."user"("uuid");



ALTER TABLE ONLY "public"."meal"
    ADD CONSTRAINT "fk_meal_icon" FOREIGN KEY ("icon_id") REFERENCES "public"."icon"("uuid");



ALTER TABLE ONLY "public"."meal_ingredient"
    ADD CONSTRAINT "fk_meal_ingredient_ingredient" FOREIGN KEY ("ingredient_id") REFERENCES "public"."ingredient"("uuid");



ALTER TABLE ONLY "public"."meal_ingredient"
    ADD CONSTRAINT "fk_meal_ingredient_meal" FOREIGN KEY ("meal_id") REFERENCES "public"."meal"("uuid");



ALTER TABLE ONLY "public"."meal_ingredient"
    ADD CONSTRAINT "fk_meal_ingredient_user" FOREIGN KEY ("user_id") REFERENCES "public"."user"("uuid");



ALTER TABLE ONLY "public"."meal"
    ADD CONSTRAINT "fk_meal_user" FOREIGN KEY ("user_id") REFERENCES "public"."user"("uuid");



ALTER TABLE ONLY "public"."generative"
    ADD CONSTRAINT "generative_ingredient_id_fkey" FOREIGN KEY ("ingredient_id") REFERENCES "public"."ingredient"("uuid") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."usage"
    ADD CONSTRAINT "usage_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("uuid") ON DELETE CASCADE;



CREATE POLICY "Allow all operations on their own ingredient" ON "public"."ingredient" USING (("user_id" = "auth"."uid"())) WITH CHECK (("user_id" = "auth"."uid"()));



CREATE POLICY "Allow all operations on their own meal" ON "public"."meal" USING (("user_id" = "auth"."uid"())) WITH CHECK (("user_id" = "auth"."uid"()));



CREATE POLICY "Allow all operations on their own meal_ingredient" ON "public"."meal_ingredient" FOR SELECT USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Allow everyone to select icon" ON "public"."icon" FOR SELECT USING (true);



CREATE POLICY "Allow insert on their own generative" ON "public"."generative" FOR INSERT WITH CHECK (("user_id" = "auth"."uid"()));



CREATE POLICY "Allow select on their own generative" ON "public"."generative" FOR SELECT USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Allow users all operations on their own entry" ON "public"."entry" USING (("user_id" = "auth"."uid"())) WITH CHECK (("user_id" = "auth"."uid"()));



CREATE POLICY "Allow users to insert their own user" ON "public"."user" FOR INSERT WITH CHECK (("uuid" = "auth"."uid"()));



CREATE POLICY "Allow users to select their own user" ON "public"."user" FOR SELECT USING (("uuid" = "auth"."uid"()));



CREATE POLICY "Allow users to update their own user" ON "public"."user" FOR UPDATE USING (("uuid" = "auth"."uid"())) WITH CHECK (("uuid" = "auth"."uid"()));



ALTER TABLE "public"."entry" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."generative" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."icon" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."ingredient" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."meal" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."meal_ingredient" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."usage" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";





GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



































































































































































































GRANT ALL ON TABLE "public"."entry" TO "anon";
GRANT ALL ON TABLE "public"."entry" TO "authenticated";
GRANT ALL ON TABLE "public"."entry" TO "service_role";



GRANT ALL ON TABLE "public"."generative" TO "anon";
GRANT ALL ON TABLE "public"."generative" TO "authenticated";
GRANT ALL ON TABLE "public"."generative" TO "service_role";



GRANT ALL ON TABLE "public"."icon" TO "anon";
GRANT ALL ON TABLE "public"."icon" TO "authenticated";
GRANT ALL ON TABLE "public"."icon" TO "service_role";



GRANT ALL ON TABLE "public"."ingredient" TO "anon";
GRANT ALL ON TABLE "public"."ingredient" TO "authenticated";
GRANT ALL ON TABLE "public"."ingredient" TO "service_role";



GRANT ALL ON TABLE "public"."meal" TO "anon";
GRANT ALL ON TABLE "public"."meal" TO "authenticated";
GRANT ALL ON TABLE "public"."meal" TO "service_role";



GRANT ALL ON TABLE "public"."meal_ingredient" TO "anon";
GRANT ALL ON TABLE "public"."meal_ingredient" TO "authenticated";
GRANT ALL ON TABLE "public"."meal_ingredient" TO "service_role";



GRANT ALL ON TABLE "public"."usage" TO "anon";
GRANT ALL ON TABLE "public"."usage" TO "authenticated";
GRANT ALL ON TABLE "public"."usage" TO "service_role";



GRANT ALL ON TABLE "public"."user" TO "anon";
GRANT ALL ON TABLE "public"."user" TO "authenticated";
GRANT ALL ON TABLE "public"."user" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
