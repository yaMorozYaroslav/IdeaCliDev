// app/layout.js (Server Component)
import { getUser } from "/lib/getUser";
import LayoutClient from "./layout-client"; // Import client component

export default async function Layout({ children }) {
  const user = await getUser(); // Fetch user data on the server

  return (
    <html lang="en">
      <head>
        {/* 🚀 Preload your logo immediately */}
        <link rel="preload" as="image" href="/IconIdea.png" />
      </head>
      <body>
        <LayoutClient user={user}>{children}</LayoutClient>
      </body>
    </html>
  );
}
