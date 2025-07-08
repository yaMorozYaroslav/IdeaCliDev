// app/page.js (Server Component)
import HomeClient from "/comps/HomeClient";
import { getUserFromCookiesServer } from "../lib/getUserFromCookiesServer"; // ✅ server-safe cookie reader

export default async function Home() {
  const user = getUserFromCookiesServer(); // ✅ reads user_data from cookies safely

  return <HomeClient user={user} />;
}
