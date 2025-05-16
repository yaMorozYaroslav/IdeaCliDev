import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

async function getUserData(username) {
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

export default async function UserProfilePage({ params }) {
  const usernameParam = params.username.toLowerCase();
  const cookieStore = cookies();
  const cookie = cookieStore.get("user_data");

  let isOwner = false;
  let unanswered = [];

  if (cookie) {
    try {
      const parsed = JSON.parse(decodeURIComponent(decodeURIComponent(cookie.value)));
      if (parsed.slug?.toLowerCase() === usernameParam) {
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
    <main style={{ padding: "2rem", maxWidth: "600px", margin: "100px auto 0" }}>
      <h1>{user.name}'s Profile</h1>

      {user.picture && (
        <img
          src={user.picture}
          alt={`${user.name}'s avatar`}
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
        {user.answered?.length ? (
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
