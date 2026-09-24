CREATE TYPE "public"."diet_mode" AS ENUM('vegetarian', 'vegan');--> statement-breakpoint
CREATE TYPE "public"."difficulty" AS ENUM('easy', 'medium', 'involved');--> statement-breakpoint
CREATE TYPE "public"."meal_diet" AS ENUM('vegan', 'vegetarian', 'meat');--> statement-breakpoint
CREATE TYPE "public"."meal_slot" AS ENUM('breakfast', 'lunch', 'dinner', 'snack');--> statement-breakpoint
CREATE TYPE "public"."meal_source" AS ENUM('cooked', 'ate_out', 'other');--> statement-breakpoint
CREATE TYPE "public"."protein_band" AS ENUM('high', 'medium', 'low');--> statement-breakpoint
CREATE TYPE "public"."spice_level" AS ENUM('mild', 'medium', 'fiery');--> statement-breakpoint
CREATE TYPE "public"."transition_goal" AS ENUM('reduce_meat', 'stop_red_meat', 'become_vegetarian', 'become_vegan', 'more_veg_meals');--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token_hash" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "meal_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"eaten_on" date NOT NULL,
	"slot" "meal_slot" NOT NULL,
	"source" "meal_source" NOT NULL,
	"diet" "meal_diet" NOT NULL,
	"recipe_id" text,
	"name" text NOT NULL,
	"liked" boolean,
	"fullness" smallint,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"goal" "transition_goal" DEFAULT 'reduce_meat' NOT NULL,
	"diet_mode" "diet_mode" DEFAULT 'vegetarian' NOT NULL,
	"baseline_meat_meals" smallint DEFAULT 7 NOT NULL,
	"weekly_plant_target" smallint DEFAULT 10 NOT NULL,
	"cuisines" text[] DEFAULT '{}'::text[] NOT NULL,
	"spice" "spice_level" DEFAULT 'medium' NOT NULL,
	"max_cook_minutes" smallint DEFAULT 45 NOT NULL,
	"city" text,
	"area" text,
	"onboarding_step" smallint DEFAULT 0 NOT NULL,
	"onboarded_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recipes" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"cuisine" text NOT NULL,
	"diet_mode" "diet_mode" NOT NULL,
	"description" text NOT NULL,
	"servings" smallint NOT NULL,
	"prep_minutes" smallint NOT NULL,
	"cook_minutes" smallint NOT NULL,
	"difficulty" "difficulty" NOT NULL,
	"spice" "spice_level" NOT NULL,
	"protein" "protein_band" NOT NULL,
	"cost_band" text NOT NULL,
	"tags" text[] DEFAULT '{}'::text[] NOT NULL,
	"ingredients" jsonb NOT NULL,
	"steps" jsonb NOT NULL,
	"nutrition" jsonb NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "saved_recipes" (
	"user_id" uuid NOT NULL,
	"recipe_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "saved_recipes_user_id_recipe_id_pk" PRIMARY KEY("user_id","recipe_id")
);
--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meal_logs" ADD CONSTRAINT "meal_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meal_logs" ADD CONSTRAINT "meal_logs_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_recipes" ADD CONSTRAINT "saved_recipes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_recipes" ADD CONSTRAINT "saved_recipes_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "sessions_token_hash_key" ON "sessions" USING btree ("token_hash");--> statement-breakpoint
CREATE INDEX "sessions_user_idx" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "meal_logs_user_date_idx" ON "meal_logs" USING btree ("user_id","eaten_on");--> statement-breakpoint
CREATE INDEX "meal_logs_recipe_idx" ON "meal_logs" USING btree ("recipe_id");--> statement-breakpoint
CREATE INDEX "recipes_diet_cuisine_idx" ON "recipes" USING btree ("diet_mode","cuisine");