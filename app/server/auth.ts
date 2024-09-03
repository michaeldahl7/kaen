import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { Lucia } from "lucia";

import { Facebook, GitHub, Google } from "arctic";

import { db } from "~/server/db";
import {
  type User as DatabaseUser,
  sessions as sessionTable,
  users as userTable,
} from "~/server/db/schema";

type UserId = number;

const adapter = new DrizzlePostgreSQLAdapter(db, sessionTable as any, userTable as any);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attr) => ({
    id: attr.id,
    name: attr.name,
    firstName: attr.firstName,
    lastName: attr.lastName,
    avatarUrl: attr.avatarUrl,
    email: attr.email,
  }),
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUser;
    UserId: number;
  }
}

// OAuth2 Providers
export const facebook = new Facebook(
  process.env.FACEBOOK_CLIENT_ID as string,
  process.env.FACEBOOK_CLIENT_SECRET as string,
  process.env.FACEBOOK_REDIRECT_URI as string,
);
export const github = new GitHub(
  process.env.GITHUB_CLIENT_ID as string,
  process.env.GITHUB_CLIENT_SECRET as string,
  process.env.GITHUB_REDIRECT_URI || null,
);
export const google = new Google(
  process.env.GOOGLE_CLIENT_ID as string,
  process.env.GOOGLE_CLIENT_SECRET as string,
  process.env.GOOGLE_REDIRECT_URI as string,
);
