import { getUserFromCookiesServer } from "../lib/getUserFromCookiesServer.js"; // updated name & path
import LayoutClient from "./layout-client";

export default async function Layout({ children }) {
  const user = await getUserFromCookiesServer(); // ⬅️ now async

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
