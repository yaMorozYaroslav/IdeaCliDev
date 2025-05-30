import type { NextRequest } from "next/server";
import type { IncomingMessage } from "http";

type RequestLike = NextRequest | IncomingMessage | undefined;

export const getBaseUrl = (request?: RequestLike): string => {
  let host = "";

  if (typeof window !== "undefined") {
    // ✅ Client-side
    host = window.location.hostname;
  } else if (request) {
    // ✅ Server-side
    if ("headers" in request) {
      if (typeof request.headers.get === "function") {
        // Middleware (NextRequest)
        host = request.headers.get("host") ?? "localhost";
      } else if (typeof request.headers === "object") {
        // SSR / API routes
        host = (request.headers as Record<string, string>)["host"] ?? "localhost";
      }
    }
  }

  host = host.toLowerCase();

  // ✅ Local development
  if (host.includes("localhost")) {
    return "http://localhost:5000";
  }

  // ✅ Vercel preview deployment
  if (host.includes("idea-sphere-dev.vercel.app")) {
    return "https://idea-sphere-dev-30492dbf5e99.herokuapp.com";
  }

  // ✅ Default production backend
  return "https://idea-sphere-50bb3c5bc07b.herokuapp.com";
};

export default getBaseUrl;
