export default function getBaseUrl(): string {
  // ✅ Client-side in browser
  if (typeof window !== "undefined") {
    return ""; // use relative URLs on client
  }

  // ✅ Check .env setting
  const isLocal = process.env.LOCALHOST === "true";

  if (isLocal) {
    return "http://localhost:5000"; // ✅ local dev backend
  }

  // ✅ fallback to production
  return "https://idea-sphere-50bb3c5bc07b.herokuapp.com"; // ✅ deployed backend
}
