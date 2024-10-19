DO $$ BEGIN
 CREATE TYPE "public"."type" AS ENUM('email', 'google', 'github', 'facebook');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kaen_accounts" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "kaen_accounts_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" integer NOT NULL,
	"accountType" "type" NOT NULL,
	"githubId" text,
	"googleId" text,
	"facebookId" text,
	CONSTRAINT "kaen_accounts_githubId_unique" UNIQUE("githubId"),
	CONSTRAINT "kaen_accounts_googleId_unique" UNIQUE("googleId"),
	CONSTRAINT "kaen_accounts_facebookId_unique" UNIQUE("facebookId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kaen_sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kaen_users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "kaen_users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text,
	"first_name" text,
	"last_name" text,
	"avatar_url" text,
	"email" text NOT NULL,
	"displayName" text,
	"imageId" text,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"setup_at" timestamp,
	"terms_accepted_at" timestamp,
	CONSTRAINT "kaen_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "kaen_accounts" ADD CONSTRAINT "kaen_accounts_userId_kaen_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."kaen_users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "kaen_sessions" ADD CONSTRAINT "kaen_sessions_userId_kaen_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."kaen_users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
