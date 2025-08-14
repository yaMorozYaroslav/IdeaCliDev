// app/layout.js (server component — JS)
import { getUserFromCookiesServer } from "@/lib/cookies/getUserFromCookiesServer";
import LayoutClient from "./layout-client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Layout({ children }) {
  const user = await getUserFromCookiesServer(); // returns a user object or null

  return (
    <html lang="en">
      <head>
        <link rel="preload" as="image" href="/IconIdea.png" />
      </head>
      <body>
        <LayoutClient user={user}>{children}</LayoutClient>
      </body>
    </html>
  );
}
