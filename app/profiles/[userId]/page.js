import ClientUserProfile from "./ClientUserProfile";
import getBaseUrl from "../../../lib/getBaseUrl";
import { notFound } from "next/navigation";

export default async function Page({ params }) {
  const profileUserId = params.userId;

  if (!profileUserId || profileUserId === "questions") {
    console.warn("🛑 Invalid userId route accessed:", profileUserId);
    notFound();
  }

  const baseUrl = getBaseUrl();
  let profileUser = null;

  try {
    const res = await fetch(`${baseUrl}/google/public/${profileUserId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}), // ✅ Anonymous request
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

  const initialUnanswered = []; // 🔇 Not available anonymously

  return (
    <ClientUserProfile
      userId={profileUserId}
      user={profileUser}
      initialUnanswered={initialUnanswered}
    />
  );
}
