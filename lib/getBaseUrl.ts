import type { NextRequest } from "next/server";
import type { IncomingMessage } from "http";

type RequestLike = NextRequest | IncomingMessage | undefined;

export const getBaseUrl = (request?: RequestLike): string => {
  let hostname = "";

  // ✅ Client-side in browser
  if (typeof window !== "undefined") {
    hostname = window.location.hostname;
  }

  // ✅ Server-side (API, middleware, SSR)
  else if (request) {
    if ("headers" in request && typeof request.headers.get === "function") {
      // Middleware (NextRequest)
      hostname = request.headers.get("host") ?? "localhost";
    } else if ("headers" in request && typeof request.headers === "object") {
      // API route or SSR (IncomingMessage)
      hostname = (request.headers as Record<string, string>)["host"] ?? "localhost";
    }
  }

  // ✅ Default fallback
  if (!hostname) {
    hostname = "localhost";
  }

  // 🌐 Match environment
  if (hostname.includes("localhost")) {
    return "http://localhost:5000";
  }

  if (hostname.includes("idea-sphere-dev.vercel.app")) {
    return "https://idea-sphere-dev-30492dbf5e99.herokuapp.com";
  }

  return "https://idea-sphere-50bb3c5bc07b.herokuapp.com";
};

export default getBaseUrl;
