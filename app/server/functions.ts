import { createServerFn, json } from "@tanstack/start";
import { getCookie, deleteCookie } from "vinxi/http";
import { validateSessionToken, setSessionTokenCookie } from "~/server/auth";

export const getSession = createServerFn("GET", async () => {
  const token = getCookie("session");
  if (!token) {
    return json({ session: null, user: null });
  }

  const { session, user } = await validateSessionToken(token);

  if (session === null) {
    deleteCookie("session");
    return json({ session: null, user: null });
  }
  setSessionTokenCookie(token, session.expiresAt);
  return json({ session, user });
});
