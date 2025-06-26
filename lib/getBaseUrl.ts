export const getBaseUrl = (): string => {
  const isBrowser = typeof window !== "undefined";

  const env = isBrowser
    ? process.env.NEXT_PUBLIC_HOST
    : process.env.HOST;

  if (env === "LOCAL") {
    return "http://localhost:5000";
  }

  if (env === "DEVELOPMENT") {
    return "https://idea-sphere-dev-30492dbf5e99.herokuapp.com";
  }

  // Default to PRODUCTION
  return "https://idea-sphere-50bb3c5bc07b.herokuapp.com";
};

export default getBaseUrl;
