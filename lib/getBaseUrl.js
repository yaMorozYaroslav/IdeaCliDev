const getBaseUrl = (request) => {
  let hostname = "";

  if (typeof window !== "undefined") {
    // Client side
    hostname = window.location.hostname;
  } else if (request) {
    // Server side, get from request
    hostname = request.headers.get("host");
  } else {
    hostname = "localhost";
  }

  // 🔁 Localhost dev mapping
  if (hostname.includes("localhost")) {
    return "http://localhost:5000"; 
  }

  // 🔁 Dev deployment
  if (hostname.includes("idea-sphere-dev.vercel.app")) {
    return "https://idea-sphere-dev-30492dbf5e99.herokuapp.com";
  }

  // 🔁 Default to prod
  return "https://idea-sphere-50bb3c5bc07b.herokuapp.com";
};

export default getBaseUrl;
