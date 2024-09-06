import { Outlet, ScrollRestoration, createRootRoute } from "@tanstack/react-router";
import { Body, Head, Html, Meta, Scripts } from "@tanstack/start";
import { seo } from "../lib/seo";
import { getSession } from "~/server/functions";
import { ThemeProvider } from "~/components/theme-provider";
// @ts-expect-error
import appCss from "~/styles/app.css?url";

export const Route = createRootRoute({
  meta: () => [
    {
      charSet: "utf-8",
    },
    {
      name: "viewport",
      content: "width=device-width, initial-scale=1",
    },
    {
      title: "TanStarter",
    },
    ...seo({
      title: "kaen",
      description: "Gotta figure out what kaen is",
    }),
  ],
  component: RootComponent,
  links: () => [
    { rel: "stylesheet", href: appCss },    
  {
    rel: 'apple-touch-icon',
    sizes: '180x180',
    href: '/apple-touch-icon.png',
  },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '32x32',
    href: '/favicon-32x32.png',
  },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '16x16',
    href: '/favicon-16x16.png',
  },
  { rel: 'manifest', href: '/site.webmanifest', color: '#fffff' },
  { rel: 'icon', href: '/favicon.ico' },],
  beforeLoad: async () => {
    const data = await getSession();
    return data;
  },
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <Html>
      <Head>
        <Meta />
      </Head>
      <Body>
      <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
          {children}
        </ThemeProvider>
        <ScrollRestoration />
        <Scripts />
      </Body>
    </Html>
  );
}
