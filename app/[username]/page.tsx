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

interface PageProps {
  params: {
    username: string;
  };
}

export default async function UserProfilePage({ params }: PageProps) {
  const username = params.username.toLowerCase();
  const cookieStore = cookies(); // do NOT await
  const cookie = cookieStore.get("user_data");

  let isOwner = false;
  let unanswered: Question[] = [];

  if (cookie) {
    try {
      const parsed = JSON.parse(decodeURIComponent(decodeURIComponent(cookie.value)));
      if (parsed.slug?.toLowerCase() === usernameParam) {
        isOwner = true;
        unanswered = parsed.unanswered || [];
      }
    } catch (err) {
      console.error("❌ Failed to parse cookie:", err);
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
          alt="User avatar"
          style={{ width: "100px", height: "100px", borderRadius: "50%" }}
        />
      )}

      {isOwner && (
        <section>
          <h2>Unanswered Questions</h2>
          {unanswered.length > 0 ? (
            <ul>
              {unanswered.map((q) => (
                <li key={q._id}>{q.title}</li>
              ))}
            </ul>
          ) : (
            <p>No unanswered questions</p>
          )}
        </section>
      )}

      <section>
        <h2>Answered Questions</h2>
        {user.answered?.length ? (
          <ul>
            {user.answered.map((q) => (
              <li key={q._id}>
                <strong>Q:</strong> {q.title}
                <br />
                <strong>A:</strong> {q.answers?.join(", ")}
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
