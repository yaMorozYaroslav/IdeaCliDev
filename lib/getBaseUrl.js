const getBaseUrl = () => {
  let hostname = "";

  if (typeof window !== "undefined") {
    // Client side
    hostname = window.location.hostname;
  } else {
    // Server side fallback
    hostname = "localhost";
  }

  // 🔁 Localhost dev mapping
  if (hostname === "localhost" || hostname.includes("localhost")) {
    return "http://localhost:5000"; // <-- ⬅️ updated!
  }

  // 🔁 Dev deployment
  if (hostname.includes("idea-sphere-dev")) {
    return "https://idea-sphere-dev-30492dbf5e99.herokuapp.com";
  }

  // 🔁 Default to prod
  return "https://idea-sphere-50bb3c5bc07b.herokuapp.com";
};

export default getBaseUrl;
