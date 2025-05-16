import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

interface Question {
  _id: string;
  title: string;
  answers?: string[];
  answeredAt?: string;
}

interface UserProfile {
  name: string;
  picture?: string;
  answered?: Question[];
}

async function getUserData(username: string): Promise<UserProfile | null> {
  try {
    const res = await fetch(`http://localhost:5000/google/public/${username}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("❌ Failed to fetch user data:", err);
    return null;
  }
}

export default async function UserProfilePage({
  params,
}: {
  params: { username: string };
}) {
  const cookieStore = cookies(); // ✅ do not await this
  const cookie = cookieStore.get("user_data");
  const usernameParam = params.username.toLowerCase();

  let isOwner = false;
  let unanswered: Question[] = [];

  if (cookie) {
    try {
      const decoded = decodeURIComponent(cookie.value);
      const parsed = JSON.parse(decoded);
      const cookieSlug = parsed.slug?.toLowerCase();
      if (cookieSlug === usernameParam) {
        isOwner = true;
        unanswered = parsed.unanswered || [];
      }
    } catch (err) {
      console.error("❌ Failed to parse user_data cookie:", err);
    }
  }

  const user = await getUserData(usernameParam);

  if (!user) {
    return (
      <main style={{ padding: "2rem" }}>
        <h1>User not found</h1>
      </main>
    );
  }

  return (
    <main
      style={{
        padding: "2rem",
        maxWidth: "600px",
        margin: "0 auto",
        marginTop: "100px",
      }}
    >
      <h1 style={{ background: "yellow" }}>{user.name ?? "Unnamed"}'s Profile</h1>

      {user.picture && (
        <img
          src={user.picture}
          alt={`${user.name ?? "User"}'s avatar`}
          style={{ width: "100px", height: "100px", borderRadius: "50%" }}
        />
      )}

      {isOwner && (
        <section style={{ marginTop: "2rem" }}>
          <h2>Unanswered Questions (Private)</h2>
          {unanswered.length > 0 ? (
            <ul>
              {unanswered.map((q) => (
                <li key={q._id} style={{ marginBottom: "1rem" }}>
                  <strong>Q:</strong> {q.title}
                </li>
              ))}
            </ul>
          ) : (
            <p>No unanswered questions.</p>
          )}
        </section>
      )}

      <section style={{ marginTop: "2rem" }}>
        <h2>Answered Questions</h2>
        {user.answered && user.answered.length > 0 ? (
          <ul>
            {user.answered.map((q) => (
              <li key={q._id} style={{ marginBottom: "1.5rem" }}>
                <strong>Q:</strong> {q.title}
                <br />
                <strong>A:</strong> {q.answers?.join(", ") || "No answer"}
              </li>
            ))}
          </ul>
        ) : (
          <p>This user has not answered any questions yet.</p>
        )}
      </section>
    </main>
  );
}
