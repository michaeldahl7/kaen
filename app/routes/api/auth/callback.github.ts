import { createAPIFileRoute } from "@tanstack/start/api";
import { OAuth2RequestError } from "arctic";
import { and, eq } from "drizzle-orm";
import { parseCookies } from "vinxi/http";
import { github, lucia } from "~/server/auth";
import { db } from "~/server/db";
import { accounts, users } from "~/server/db/schema";

interface Email {
  email: string;
  primary: boolean;
  verified: boolean;
  visibility: string | null;
}

interface GitHubUser {
  id: string;
  name: string | null;
  email: string;
  avatar_url: string;
  location: string | null;
  login: string;
}

export const Route = createAPIFileRoute("/api/auth/callback/github")({
  GET: async ({ request }) => {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");

    const cookies = parseCookies();
    const storedState = cookies.github_oauth_state;

    if (!code || !state || !storedState || state !== storedState) {
      return new Response(null, { status: 400 });
    }

    try {
      const tokens = await github.validateAuthorizationCode(code);
      const githubUser = await fetchGitHubUserData(tokens.accessToken());

      const userId = await getOrCreateUser(githubUser);

      const session = await lucia.createSession(userId, {});
      const sessionCookie = lucia.createSessionCookie(session.id);

      return new Response(null, {
        status: 302,
        headers: {
          Location: "/",
          "Set-Cookie": sessionCookie.serialize(),
        },
      });
    } catch (e) {
      console.error(e);
      if (e instanceof OAuth2RequestError) {
        return new Response(null, { status: 400 });
      }
      return new Response(null, { status: 500 });
    }
  },
});

async function fetchGitHubUserData(accessToken: string): Promise<GitHubUser> {
  const githubUserResponse = await fetch("https://api.github.com/user", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const githubUser: GitHubUser = await githubUserResponse.json();

  if (!githubUser.email) {
    const githubUserEmailResponse = await fetch("https://api.github.com/user/emails", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const githubUserEmails: Email[] = await githubUserEmailResponse.json();
    githubUser.email = getPrimaryEmail(githubUserEmails);
  }

  return githubUser;
}

function getPrimaryEmail(emails: Email[]): string {
  const primaryEmail = emails.find((email) => email.primary);
  if (!primaryEmail) {
    throw new Error("No primary email found for GitHub user");
  }
  return primaryEmail.email;
}

async function getOrCreateUser(githubUser: GitHubUser): Promise<number> {
  const existingAccount = await db.query.accounts.findFirst({
    where: eq(accounts.githubId, githubUser.id),
  });

  if (existingAccount) {
    return existingAccount.userId;
  }

  const existingUser = await getUserByEmail(githubUser.email);

  if (existingUser) {
    await createAccountViaGithub(existingUser.id, githubUser.id);
    return existingUser.id;
  }

  const newUser = await createUser(
    githubUser.email,
    githubUser.name || githubUser.login,
    githubUser.avatar_url,
  );
  await createAccountViaGithub(newUser.id, githubUser.id);
  return newUser.id;
}

async function getUserByEmail(email: string) {
  return db.query.users.findFirst({
    where: eq(users.email, email),
  });
}

async function createUser(email: string, name: string, avatarUrl: string) {
  const [user] = await db.insert(users).values({ email, name, avatarUrl }).returning();
  if (!user) {
    throw new Error("Failed to create user");
  }
  return user;
}

async function createAccountViaGithub(userId: number, githubId: string) {
  await db
    .insert(accounts)
    .values({
      userId,
      accountType: "github",
      githubId,
    })
    .onConflictDoNothing();
}
