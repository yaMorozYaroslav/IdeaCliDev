import ClientUserProfile from "./ClientUserProfile";
import getBaseUrl from "../../../lib/getBaseUrl";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";

export default async function Page({ params }) {
  const profileUserId = params.userId;

  if (!profileUserId || profileUserId === "questions") {
    console.warn("🛑 Invalid userId route accessed:", profileUserId);
    notFound();
  }

  const baseUrl = getBaseUrl();
  console.log("🌐 Base URL:", baseUrl);
  console.log("🔎 Requested profile userId (googleId):", profileUserId);

  let profileUser = null;

  try {
    const cookieStore = await cookies(); // ✅ Await required
    const accessToken = cookieStore.get("access_token")?.value;

    const res = await fetch(`${baseUrl}/google/public/${profileUserId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: accessToken || null, // ✅ Pass token for ownership check
      }),
      cache: "no-store",
    });

    const text = await res.text();
    console.log("📬 Status:", res.status);
    console.log("📦 Raw response:", text);

    if (res.ok) {
      profileUser = JSON.parse(text);
    } else {
      console.warn("⚠️ Failed to fetch profile user, status:", res.status);
    }
  } catch (err) {
    console.error("❌ Profile fetch failed:", err);
  }

  const initialUnanswered = profileUser?.unanswered || [];

  return (
    <ClientUserProfile
      userId={profileUserId}
      user={profileUser}
      initialUnanswered={initialUnanswered}
    />
  );
}
