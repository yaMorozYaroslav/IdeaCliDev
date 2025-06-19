export default function getBaseUrl(): string {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;

    if (hostname === "localhost") {
      return "http://localhost:5000";
    }

    if (hostname.includes("idea-sphere-dev")) {
      return "https://idea-sphere-dev-30492dbf5e99.herokuapp.com";
    }

    if (hostname.includes("idea-sphere")) {
      return "https://idea-sphere-50bb3c5bc07b.herokuapp.com";
    }
  }

  // ✅ Server-side fallback (used only during SSR, not ideal but works)
  return "https://idea-sphere-50bb3c5bc07b.herokuapp.com";
}
