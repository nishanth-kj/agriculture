CREATE TABLE "user" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "user_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"username" text NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"password" text NOT NULL,
	"phone" text,
	"avatar" "bytea",
	"parent_user_id" integer,
	"status" integer DEFAULT 1 NOT NULL,
	"created_by" integer,
	"created_at" bigint DEFAULT extract(epoch from now())::bigint NOT NULL,
	"updated_by" integer,
	"updated_at" bigint DEFAULT extract(epoch from now())::bigint NOT NULL,
	CONSTRAINT "user_username_unique" UNIQUE("username"),
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "role" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "role_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"status" integer DEFAULT 1 NOT NULL,
	"created_by" integer,
	"created_at" bigint DEFAULT extract(epoch from now())::bigint NOT NULL,
	"updated_by" integer,
	"updated_at" bigint DEFAULT extract(epoch from now())::bigint NOT NULL,
	CONSTRAINT "role_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "user_role" (
	"user_id" integer NOT NULL,
	"role_id" integer NOT NULL,
	"status" integer DEFAULT 1 NOT NULL,
	"created_by" integer,
	"created_at" bigint DEFAULT extract(epoch from now())::bigint NOT NULL,
	"updated_by" integer,
	"updated_at" bigint DEFAULT extract(epoch from now())::bigint NOT NULL,
	CONSTRAINT "user_role_user_id_role_id_pk" PRIMARY KEY("user_id","role_id")
);
--> statement-breakpoint
CREATE TABLE "stock" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "stock_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"quantity" integer NOT NULL,
	"location" text NOT NULL,
	"cost" numeric(12, 2) NOT NULL,
	"selling_price" numeric(12, 2) NOT NULL,
	"user_id" integer NOT NULL,
	"status" integer DEFAULT 1 NOT NULL,
	"created_by" integer,
	"created_at" bigint DEFAULT extract(epoch from now())::bigint NOT NULL,
	"updated_by" integer,
	"updated_at" bigint DEFAULT extract(epoch from now())::bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "soil_data" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "soil_data_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" integer NOT NULL,
	"b" double precision NOT NULL,
	"cu" double precision NOT NULL,
	"ec" double precision NOT NULL,
	"fe" double precision NOT NULL,
	"k" double precision NOT NULL,
	"mn" double precision NOT NULL,
	"n" double precision NOT NULL,
	"oc" double precision NOT NULL,
	"p" double precision NOT NULL,
	"s" double precision NOT NULL,
	"zn" double precision NOT NULL,
	"confidence" double precision NOT NULL,
	"fertility_class" text NOT NULL,
	"ph" double precision NOT NULL,
	"status" integer DEFAULT 1 NOT NULL,
	"created_by" integer,
	"created_at" bigint DEFAULT extract(epoch from now())::bigint NOT NULL,
	"updated_by" integer,
	"updated_at" bigint DEFAULT extract(epoch from now())::bigint NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_parent_user_id_user_id_fk" FOREIGN KEY ("parent_user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_updated_by_user_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role" ADD CONSTRAINT "role_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role" ADD CONSTRAINT "role_updated_by_user_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_role" ADD CONSTRAINT "user_role_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_role" ADD CONSTRAINT "user_role_role_id_role_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."role"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_role" ADD CONSTRAINT "user_role_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_role" ADD CONSTRAINT "user_role_updated_by_user_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock" ADD CONSTRAINT "stock_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock" ADD CONSTRAINT "stock_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock" ADD CONSTRAINT "stock_updated_by_user_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "soil_data" ADD CONSTRAINT "soil_data_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "soil_data" ADD CONSTRAINT "soil_data_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "soil_data" ADD CONSTRAINT "soil_data_updated_by_user_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "user_id_idx" ON "soil_data" USING btree ("user_id");