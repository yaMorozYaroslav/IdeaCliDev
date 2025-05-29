import ClientUserProfile from "./ClientUserProfile";
import getBaseUrl from "../../lib/getBaseUrl";
import { getUser } from "../../lib/getUser";

export default async function Page({ params }: { params: { userId: string } }) {
  const usernameParam = params.userId; // ✅ no await

  const requester = await getUser(); // ✅ SSR user (merged from access_token + user_data)
  const requesterId = requester?.userId;
  const initialUnanswered = Array.isArray(requester?.unanswered) && requesterId === userId
    ? requester.unanswered.filter((q) => q?.title)
    : [];

  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/google/public/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ requesterId }),
    cache: "no-store",
  });

  const user = res.ok ? await res.json() : null;

  return <ClientUserProfile userId={userId} user={user} initialUnanswered={initialUnanswered} />;
}
