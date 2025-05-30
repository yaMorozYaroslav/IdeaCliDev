import ClientUserProfile from "./ClientUserProfile";
import { cookies } from "next/headers";
import getBaseUrl from "../../lib/getBaseUrl";
import jwt from "jsonwebtoken";

export default async function Page({ params }) {
  const profileUserId = params.userId;
  const baseUrl = getBaseUrl();

  let viewerUserId = null;
  let cookieValue = null;

  // 🍪 Try to extract viewer userId from cookie if it exists
  const cookieStore = await cookies();
  const rawCookie = cookieStore.get("user_data");

  if (rawCookie) {
    cookieValue = rawCookie.value;
    try {
      const decoded = jwt.decode(cookieValue);
      viewerUserId = decoded?.userId;
    } catch {
      viewerUserId = null;
    }
  }

  // 🔄 Fetch the public profile data using the userId in URL
  let profileUser = null;

  try {
    const res = await fetch(`${baseUrl}/google/public/${profileUserId}`, {
      method: "POST",
      headers: cookieValue ? { Cookie: `user_data=${cookieValue}` } : {},
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
