// app/layout.js (Server Component)
import { getUser } from "/lib/getUser";
import LayoutClient from "./layout-client"; // Import client component

export default async function Layout({ children }) {
  const user = await getUser(); // Fetch user data on the server
 console.log('some')
  return (
    <html lang="en">
      <body>
        <LayoutClient user={user}>{children}</LayoutClient>
      </body>
    </html>
  );
}
