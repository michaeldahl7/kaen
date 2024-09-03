import { pgEnum, integer, text, timestamp, pgTableCreator } from "drizzle-orm/pg-core";

// const createTable = pgTableCreator((name) => `kaen_${name}`);
const pgTable = pgTableCreator((name) => `kaen_${name}`);

export const accountTypeEnum = pgEnum("type", ["email", "google", "github", "facebook"]);

export const users = pgTable("users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity({ startWith: 1 }),
  name: text("name"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  avatarUrl: text("avatar_url"),
  email: text("email").unique().notNull(),
  displayName: text("displayName"),
  imageId: text("imageId"),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  setupAt: timestamp("setup_at"),
  termsAcceptedAt: timestamp("terms_accepted_at"),
});

export const accounts = pgTable("accounts", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity({ startWith: 1 }),
  userId: integer("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accountType: accountTypeEnum("accountType").notNull(),
  githubId: text("githubId").unique(),
  googleId: text("googleId").unique(),
  facebookId: text("facebookId").unique(),
});

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: integer("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

// TODO: tables for payment gateways

export type User = typeof users.$inferSelect;
// export type Profile = typeof profiles.$inferSelect;
