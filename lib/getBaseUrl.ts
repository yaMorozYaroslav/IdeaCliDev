import type { NextRequest } from "next/server";
import type { IncomingMessage } from "http";

type RequestLike = NextRequest | IncomingMessage | undefined;

export const getBaseUrl = (request?: RequestLike): string => {
  // ✅ Client-side (browser)
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;

    if (hostname.includes("localhost")) {
      return "http://localhost:5000";
    }
    if (hostname.includes("idea-sphere-dev.vercel.app")) {
      return "https://idea-sphere-dev-30492dbf5e99.herokuapp.com";
    }

    return "https://idea-sphere-50bb3c5bc07b.herokuapp.com";
  }

  // ✅ Server-side (middleware, API routes)
  if (request) {
    let hostname = "";

    if ("headers" in request && typeof request.headers.get === "function") {
      // Middleware (NextRequest)
      hostname = request.headers.get("host") ?? "";
    } else if ("headers" in request && typeof request.headers === "object") {
      // API route or SSR (IncomingMessage)
      hostname = (request.headers as Record<string, string>)["host"] ?? "";
    }

    if (hostname.includes("localhost")) {
      return "http://localhost:5000";
    }
    if (hostname.includes("idea-sphere-dev.vercel.app")) {
      return "https://idea-sphere-dev-30492dbf5e99.herokuapp.com";
    }

    return "https://idea-sphere-50bb3c5bc07b.herokuapp.com";
  }

  // ✅ SSR without request (e.g., page.tsx)
  return "https://idea-sphere-50bb3c5bc07b.herokuapp.com";
};

export default getBaseUrl;
