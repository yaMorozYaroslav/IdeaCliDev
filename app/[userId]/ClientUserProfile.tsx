"use client";

import { useEffect, useState } from "react";
import AskPersonalButton from "./AskPersonalButton";
import getBaseUrl from "../../lib/getBaseUrl";

export default function ClientUserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<any>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [unanswered, setUnanswered] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      console.log("🔄 Loading user profile for:", userId);

      try {
        const res = await fetch(`${getBaseUrl()}/google/public/${userId}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          console.warn("⚠️ User not found:", await res.text());
          return;
        }

        const data = await res.json();
        console.log("✅ Public user data loaded:", data);
        setUser(data);
      } catch (err) {
        console.error("❌ User fetch failed:", err);
      }

      const cookie = document.cookie.split("; ").find((c) =>
        c.startsWith("user_data=")
      );

      if (cookie) {
        try {
          const raw = cookie.split("=")[1];
          const decodedValue = decodeURIComponent(raw);
          const parsed = JSON.parse(decodedValue);
          console.log("📦 Parsed user_data cookie:", parsed);

          if (parsed.userId === userId) {
            setIsOwner(true);
            setUnanswered(parsed.unanswered || []);
          }
        } catch (err) {
          console.warn("⚠️ Failed to parse user_data cookie:", err.message);
        }
      }
    }

    load();
  }, [userId]);

  if (!user) return <main><h1>Loading...</h1></main>;

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

      {!isOwner && <AskPersonalButton recipientUserId={user.googleId} />}

      {isOwner && (
        <section style={{ marginTop: "2rem" }}>
          <h2>Unanswered Questions (Private)</h2>
          {unanswered.length > 0 ? (
            <ul>
              {unanswered.map((q) => (
                <li key={q._id}>
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
              <li key={q._id}>
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
