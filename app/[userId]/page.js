import ClientUserProfile from "./ClientUserProfile";
import { cookies } from "next/headers";
import getBaseUrl from "../../lib/getBaseUrl";

export default async function Page({ params }) {
  const some = await {params}
  const profileUserId = await params.userId;
  console.log('od',profileUserId)
   
  const baseUrl = getBaseUrl();
  console.log(baseUrl)
  console.log(`${baseUrl}/google/public/${profileUserId}`)
  // 🍪 Read token from cookie
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  // 📡 Make POST request with token only in body
  let profileUser = null;

  try {
  const res = await fetch(`${baseUrl}/google/public/${profileUserId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}), // No token
    cache: "no-store",
  });

  console.log("📬 Status:", res.status);

  const text = await res.text(); // <- Read raw body to debug
  console.log("📦 Raw response:", text);

  if (res.ok) {
    profileUser = JSON.parse(text); // Parse manually
  } else {
    console.warn("⚠️ Failed to fetch profile user, status:", res.status);
  }
} catch (err) {
  console.error("❌ Profile fetch failed:", err);
}


  // ✂️ Only show unanswered if returned
  const initialUnanswered = profileUser?.unanswered || [];

  console.log("🌐 Profile being viewed:", profileUserId);
  console.log("📦 Fetched profile user:", profileUser);

  return (
    <ClientUserProfile
      userId={profileUserId}
      user={profileUser}
      initialUnanswered={initialUnanswered}
    />
  );
}
