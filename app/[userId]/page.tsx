import ClientUserProfile from "./ClientUserProfile";
import { cookies } from "next/headers";
import { getUser } from "../../lib/getUser";
import getBaseUrl from "../../lib/getBaseUrl";

export default async function Page({ params }: { params: { userId: string } }) {
  const { userId } = params;

  const cookieStore = cookies();
  const cookie = cookieStore.get("user_data");
  let initialUnanswered = [];

  const viewer = await getUser();
  const isOwner = viewer?.userId === userId;

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
