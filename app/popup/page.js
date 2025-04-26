"use client";

import { useEffect } from "react";

export default function Popup() {
  useEffect(() => {
    console.log("✅ Popup loaded — no action needed anymore.");
    // Nothing else to do. The popup should already be closed.
  }, []);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>Login successful!</h2>
      <p>You can close this window.</p>
    </div>
  );
}
