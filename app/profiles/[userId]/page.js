import ClientUserProfile from "./ClientUserProfile";
import { cookies } from "next/headers";
import getBaseUrl from "@/lib/getBaseUrl";
import { decodeUserForCookies } from "@/lib/cookies/decodeUserForCookies";
import { notFound } from "next/navigation";

export default async function Page(props) {
  const params = await props.params; // ✅ This must be awaited in the app directory
  const profileUserId = params.userId;

  // OR better:
  // const { userId: profileUserId } = await props.params;
  if (!profileUserId || profileUserId === "questions") {
    console.warn("🛑 Invalid userId route accessed:", profileUserId);
    notFound();
  }

  const baseUrl = getBaseUrl();
  const cookieStore = await cookies(); // ✅ This needs await
  const accessToken = cookieStore.get("access_token")?.value || null;
  const loggedInUser = accessToken ? decodeUserForCookies(accessToken) : null;

  try {
    const res = await fetch(`${baseUrl}/google/public/${profileUserId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: accessToken }),
      cache: "no-store",
    });

    if (!res.ok) {
      console.warn("❌ Failed to fetch public user:", res.status);
      notFound();
    }

    const user = await res.json();
    return (
      <ClientUserProfile
        userId={profileUserId}
        user={user}
        initialUnanswered={user.unanswered || []}
        loggedInUser={loggedInUser}
      />
    );
  } catch (err) {
    console.error("❌ Error fetching user profile:", err);
    notFound();
  }
}
