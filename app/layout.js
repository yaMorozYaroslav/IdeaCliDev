import { cookies } from "next/headers";
import StyledComponentsRegistry from "../lib/StyledComponentsRegistry";
import Header from "../comps/Header";

export default async function RootLayout({ children }) {
  let user = null;

  try {
    const cookieStore = cookies(); // Get cookies from the request
    const cookieHeader = cookieStore.toString(); // Convert cookies to a string

    const response = await fetch("http://localhost:5000/google/me", {
      method: "GET",
      headers: {
        Cookie: cookieHeader, // Pass user cookies to API
      },
      cache: "no-store", // Ensure fresh data on every request
    });

    if (response.ok) {
      user = await response.json();
    }
  } catch (error) {
    console.log("User not authenticated on SSR", error);
  }

  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>
          <Header user={user} />
          {children}
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
