// app/page.js (Server Component)
import HomeClient from "./main-comps/HomeClient";
import { getUserFromCookiesServer } from "@/lib/cookies/getUserFromCookiesServer"; // ✅ server-safe cookie reader

export default async function Home() {
  const user = getUserFromCookiesServer(); // ✅ reads user_data from cookies safely

  return <HomeClient user={user} />;
}
