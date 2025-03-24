// app/page.js (Server Component)
import HomeClient from "/comps/HomeClient"; // ✅ Import client component

export default async function Home() {

  return <HomeClient />;
}
