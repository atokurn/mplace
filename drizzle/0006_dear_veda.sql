ALTER TABLE "downloads" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "downloads" CASCADE;--> statement-breakpoint
ALTER TABLE "categories" DROP CONSTRAINT "categories_parent_id_categories_id_fk";
--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "commercial_price";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "file_url";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "file_name";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "file_size";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "file_format";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "file_type";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "dimensions";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "resolution";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "color_mode";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "software";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "download_count";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "license_type";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "usage_rights";