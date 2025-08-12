// app/layout.tsx (server component)
import { getUserFromCookiesServer } from "../lib/getUserFromCookiesServer";
import LayoutClient from "./layout-client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Layout({ children }) {
  const user = getUserFromCookiesServer(); // no await

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
