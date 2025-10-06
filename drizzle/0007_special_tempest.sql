CREATE TABLE "product_variant_option_values" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"option_id" uuid NOT NULL,
	"value" text NOT NULL,
	"image_url" text,
	"color_code" text,
	"position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_variant_options" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"name" text NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_variant_selections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"variant_id" uuid NOT NULL,
	"option_id" uuid NOT NULL,
	"option_value_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "product_variants" ADD COLUMN "image_url" text;--> statement-breakpoint
ALTER TABLE "product_variants" ADD COLUMN "barcode" text;--> statement-breakpoint
ALTER TABLE "product_variants" ADD COLUMN "package_weight_grams" integer;--> statement-breakpoint
ALTER TABLE "product_variants" ADD COLUMN "weight_unit" text DEFAULT 'g' NOT NULL;--> statement-breakpoint
ALTER TABLE "product_variants" ADD COLUMN "package_length_cm" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "product_variants" ADD COLUMN "package_width_cm" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "product_variants" ADD COLUMN "package_height_cm" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "product_variants" ADD COLUMN "pre_order_enabled" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "shipping_mode" text DEFAULT 'default' NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "cod_enabled" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "shipping_insurance_enabled" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "shipping_insurance_required" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "sku_mapping_enabled" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "pre_order_enabled" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "pre_order_lead_time_days" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "product_variant_option_values" ADD CONSTRAINT "product_variant_option_values_option_id_product_variant_options_id_fk" FOREIGN KEY ("option_id") REFERENCES "public"."product_variant_options"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_variant_options" ADD CONSTRAINT "product_variant_options_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_variant_selections" ADD CONSTRAINT "product_variant_selections_variant_id_product_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_variant_selections" ADD CONSTRAINT "product_variant_selections_option_id_product_variant_options_id_fk" FOREIGN KEY ("option_id") REFERENCES "public"."product_variant_options"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_variant_selections" ADD CONSTRAINT "product_variant_selections_option_value_id_product_variant_option_values_id_fk" FOREIGN KEY ("option_value_id") REFERENCES "public"."product_variant_option_values"("id") ON DELETE no action ON UPDATE no action;