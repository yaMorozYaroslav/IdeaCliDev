// ✅ app/[userId]/page.tsx
import ClientUserProfile from "./ClientUserProfile";
import { cookies } from "next/headers";
import getUser from "/lib/getUser";
import getBaseUrl from "/lib/getBaseUrl";

export default async function Page(props: { params: { userId: string } }) {
  const { userId } = props.params;

  const cookieStore = cookies();
  const cookie = cookieStore.get("user_data");
  let initialUnanswered = [];

  // ✅ SSR fetch of logged-in user (if available)
  const viewer = await getUser();

  const isOwner = viewer?.userId === userId;

  // If viewing own profile, try to fetch unanswered from backend
  if (isOwner) {
    try {
      const baseUrl = getBaseUrl();
      const res = await fetch(`${baseUrl}/personal/unanswered/${userId}`, {
        headers: {
          Cookie: `user_data=${cookie?.value ?? ""}`,
        },
        cache: "no-store",
      });

      if (res.ok) {
        const data = await res.json();
        initialUnanswered = data || [];
      }
    } catch (err) {
      console.error("⚠️ Failed to fetch SSR unanswered:", err);
    }
  }

  return (
    <ClientUserProfile
      userId={userId}
      user={viewer}
      initialUnanswered={initialUnanswered}
    />
  );
}
