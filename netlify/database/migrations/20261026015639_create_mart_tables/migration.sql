CREATE TYPE "payment_status" AS ENUM('unpaid', 'partial', 'paid');--> statement-breakpoint
CREATE TABLE "categories" (
	"id" bigserial PRIMARY KEY,
	"category_name" varchar(100) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "customers" (
	"id" bigserial PRIMARY KEY,
	"shop_name" varchar(150),
	"customer_name" varchar(150) NOT NULL,
	"customer_contact" varchar(30) NOT NULL,
	"alt_number" varchar(30),
	"address" text,
	"image" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "items" (
	"id" bigserial PRIMARY KEY,
	"item_name" varchar(150) NOT NULL,
	"category_id" bigint NOT NULL,
	"price" numeric(12,2) DEFAULT '0.00' NOT NULL,
	"unit" varchar(30) NOT NULL,
	"item_image" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sales_invoice_items" (
	"id" bigserial PRIMARY KEY,
	"invoice_id" bigint NOT NULL,
	"item_id" bigint,
	"item_name" varchar(150) NOT NULL,
	"unit" varchar(30) NOT NULL,
	"quantity" numeric(12,3) NOT NULL,
	"price" numeric(12,2) NOT NULL,
	"discount" numeric(12,2) DEFAULT '0.00' NOT NULL,
	"total" numeric(12,2) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sales_invoices" (
	"id" bigserial PRIMARY KEY,
	"invoice_no" varchar(50) NOT NULL CONSTRAINT "sales_invoices_invoice_no_unique" UNIQUE,
	"customer_id" bigint,
	"user_id" bigint NOT NULL,
	"invoice_date" date NOT NULL,
	"subtotal" numeric(12,2) DEFAULT '0.00' NOT NULL,
	"discount" numeric(12,2) DEFAULT '0.00' NOT NULL,
	"tax" numeric(12,2) DEFAULT '0.00' NOT NULL,
	"grand_total" numeric(12,2) DEFAULT '0.00' NOT NULL,
	"paid_amount" numeric(12,2) DEFAULT '0.00' NOT NULL,
	"due_amount" numeric(12,2) DEFAULT '0.00' NOT NULL,
	"payment_status" "payment_status" DEFAULT 'unpaid'::"payment_status" NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" bigserial PRIMARY KEY,
	"user_name" varchar(100) NOT NULL,
	"email" varchar(190) NOT NULL CONSTRAINT "users_email_unique" UNIQUE,
	"password" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "fk_items_category" ON "items" ("category_id");--> statement-breakpoint
CREATE INDEX "idx_invoice_items_invoice" ON "sales_invoice_items" ("invoice_id");--> statement-breakpoint
CREATE INDEX "idx_invoice_items_item" ON "sales_invoice_items" ("item_id");--> statement-breakpoint
CREATE INDEX "fk_invoice_customer" ON "sales_invoices" ("customer_id");--> statement-breakpoint
CREATE INDEX "fk_invoice_user" ON "sales_invoices" ("user_id");--> statement-breakpoint
ALTER TABLE "items" ADD CONSTRAINT "items_category_id_categories_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "sales_invoice_items" ADD CONSTRAINT "sales_invoice_items_invoice_id_sales_invoices_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "sales_invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "sales_invoice_items" ADD CONSTRAINT "sales_invoice_items_item_id_items_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE SET NULL ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "sales_invoices" ADD CONSTRAINT "sales_invoices_customer_id_customers_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "sales_invoices" ADD CONSTRAINT "sales_invoices_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON UPDATE CASCADE;