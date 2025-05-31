import ClientUserProfile from "./ClientUserProfile";
import { cookies } from "next/headers";
import getBaseUrl from "../../lib/getBaseUrl";

export default async function Page({ params }) {
  const profileUserId = params.userId;

  if (!profileUserId || profileUserId === "questions") {
    console.warn("🛑 Invalid userId route accessed:", profileUserId);
    return null;
  }

  const baseUrl = getBaseUrl();
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

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
