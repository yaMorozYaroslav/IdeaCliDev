import ClientUserProfile from "./ClientUserProfile";
import { cookies } from "next/headers";
import getBaseUrl from "../../../lib/getBaseUrl";
import { notFound } from "next/navigation";

export default async function Page({ params }) {
  const profileUserId = params.userId;

  if (!profileUserId || profileUserId === "questions") {
    console.warn("🛑 Invalid userId route accessed:", profileUserId);
    notFound();
  }

  const baseUrl = getBaseUrl();
  const cookieStore = cookies(); // ✅ Correct: synchronous
  const accessToken = cookieStore.get("access_token")?.value;

  console.log("🪪 Access token:", accessToken);
  console.log("🔎 Requested profile userId (googleId):", profileUserId);

  let profileUser = null;

  try {
    const res = await fetch(`${baseUrl}/google/public/${profileUserId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: accessToken }),
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
