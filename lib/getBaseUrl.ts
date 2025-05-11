// Detect if you're using in middleware or SSR
import type { NextRequest } from "next/server";
import type { IncomingMessage } from "http";

type RequestLike = NextRequest | IncomingMessage | undefined;

export const getBaseUrl = (request?: RequestLike): string => {
  let hostname = "";

  if (typeof window !== "undefined") {
    // Client-side (browser)
    hostname = window.location.hostname;
  } else if (request) {
    // Server-side: Next.js middleware or Node.js request
    if ("headers" in request && typeof request.headers.get === "function") {
      // NextRequest (middleware)
      hostname = request.headers.get("host") ?? "localhost";
    } else if ("headers" in request && typeof request.headers === "object") {
      // IncomingMessage (SSR/API Routes)
      hostname = (request.headers as Record<string, string>)["host"] ?? "localhost";
    } else {
      hostname = "localhost";
    }
  } else {
    hostname = "localhost";
  }

  // 🔁 Local dev
  if (hostname.includes("localhost")) {
    return "http://localhost:5000";
  }

  // 🔁 Vercel dev
  if (hostname.includes("idea-sphere-dev.vercel.app")) {
    return "https://idea-sphere-dev-30492dbf5e99.herokuapp.com";
  }

  // 🔁 Production fallback
  return "https://idea-sphere-50bb3c5bc07b.herokuapp.com";
};

export default getBaseUrl;
