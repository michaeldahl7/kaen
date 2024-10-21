import { createAPIFileRoute } from "@tanstack/start/api";
import { OAuth2RequestError, type OAuth2Tokens } from "arctic";
import { and, eq } from "drizzle-orm";
import { parseCookies } from "vinxi/http";
import {
  createSession,
  generateSessionToken,
  setSessionTokenCookie,
} from "~/server/auth";
import { github } from "~/server/auth";
import { db } from "~/server/db";
import { accountTable, userTable } from "~/server/db/schema";

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
    //  const userId = await getOrCreateUser(githubUser);
    let tokens: OAuth2Tokens;
    try {
      tokens = await github.validateAuthorizationCode(code);
    } catch (e) {
      // Invalid code or client credentials
      return new Response(null, {
        status: 400,
      });
    }
    const githubUserResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken()}`,
      },
    });
    const githubUser = await githubUserResponse.json();
    // const githubUserId = githubUser.id;
    // const githubUsername = githubUser.login;

    // TODO: Replace this with your own DB query.
    const userId = await getOrCreateUser(githubUser);

    const sessionToken = generateSessionToken();
    const session = await createSession(sessionToken, userId);
    setSessionTokenCookie(sessionToken, session.expiresAt);
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
      },
    });
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
  const existingAccount = await db.query.accountTable.findFirst({
    where: eq(accountTable.githubId, githubUser.id),
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
  return db.query.userTable.findFirst({
    where: eq(userTable.email, email),
  });
}

async function createUser(email: string, name: string, avatarUrl: string) {
  const [user] = await db
    .insert(userTable)
    .values({ email, name, avatarUrl })
    .returning();
  if (!user) {
    throw new Error("Failed to create user");
  }
  return user;
}

async function createAccountViaGithub(userId: number, githubId: string) {
  await db
    .insert(accountTable)
    .values({
      userId,
      accountType: "github",
      githubId,
    })
    .onConflictDoNothing();
}
