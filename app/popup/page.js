"use client";

import { useEffect } from "react";

export default function Popup() {
  useEffect(() => {
    // Notify the parent window (your app) that login is done
    if (window.opener) {
      window.opener.postMessage({ success: true }, "*");
    }

    // Close the popup
    window.close();
  }, []);

  return <p>Logging you in... You can close this window if it doesn't close automatically.</p>;
}
