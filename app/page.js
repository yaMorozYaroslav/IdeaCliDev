// app/page.js (Server Component)
import { getUser } from "/lib/getUser";
import HomeClient from "/comps/HomeClient"; // ✅ Import client component

export default async function Home() {
  const user = await getUser(); // ✅ Fetch user on the server

  return <HomeClient user={user} />;
}
