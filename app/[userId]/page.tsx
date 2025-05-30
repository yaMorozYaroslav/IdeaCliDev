import ClientUserProfile from "./ClientUserProfile";
import { cookies } from "next/headers";
import getBaseUrl from "../../lib/getBaseUrl";
import jwt from "jsonwebtoken";

export default async function Page({ params }) {
  const profileUserId = params.userId;
  const baseUrl = getBaseUrl();

  const cookieStore = await cookies(); // ✅ await here
  const rawCookie = cookieStore.get("user_data");
  let viewerUserId = null;
  let viewer = null;

  if (rawCookie) {
    try {
      const decoded = jwt.decode(rawCookie.value);
      viewerUserId = decoded?.userId;
      viewer = decoded;
    } catch {}
  }

  // 📥 Fetch public user profile (name, picture, answered)
  let profileUser = null;
  try {
    const res = await fetch(`${baseUrl}/google/public/${profileUserId}`, {
      method: "POST",
      headers: { Cookie: rawCookie?.value ? `user_data=${rawCookie.value}` : "" },
      cache: "no-store",
    });
    if (res.ok) {
      profileUser = await res.json();
    }
  } catch (err) {
    console.error("❌ Failed to fetch public profile:", err);
  }

  const isOwner = viewerUserId === profileUserId;
  const initialUnanswered = isOwner ? profileUser?.unanswered || [] : [];

  return (
    <ClientUserProfile
      userId={profileUserId}
      user={profileUser}
      initialUnanswered={initialUnanswered}
    />
  );
}
