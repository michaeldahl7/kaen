import { createAPIFileRoute } from "@tanstack/start/api";
import { parseCookies, setCookie, setHeader } from "vinxi/http";
import { validateSessionToken } from "~/server/session";

export const Route = createAPIFileRoute("/api/auth/logout")({
  POST: async () => {
    setHeader("Location", "/");

    const token = parseCookies().session; 
    if (!token) {
      return new Response(null, {
        status: 401,
      });
    }

    const { session } = await validateSessionToken(token);

    if (!session) {
      return new Response(null, {
        status: 401,
      });
    }

    setCookie("session", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/"
    })

    return new Response(null, {
      status: 302,
    });
  },
});
