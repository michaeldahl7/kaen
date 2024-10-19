import { createServerFn, json } from "@tanstack/start";
import { parseCookies, setCookie, getRequestHeader, setHeader} from "vinxi/http";
import { validateSessionToken } from "~/server/session";

export const getSession = createServerFn("GET", async () => {

  const token = parseCookies().session;
  if (!token) {
    return json({ session: null, user: null });
  }

  const { session, user } = await validateSessionToken(token);

  if(session === null) {
      setCookie("session", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 0,
        path: "/"
      })
      return json({ session: null, user: null });
    }
    setCookie("session", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      expires: session.expiresAt,
      path: "/"
    })
    return json({ session, user });
  });


  

  // if (result.session?.fresh) {
  //   const sessionCookie = lucia.createSessionCookie(result.session.id);
  //   setCookie(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
  // }
  // if (!result.session) {
  //   const sessionCookie = lucia.createBlankSessionCookie();
  //   setCookie(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
  // }

