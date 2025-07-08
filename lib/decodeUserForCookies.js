import jwt from "jsonwebtoken";

/**
 * Decodes user from a JWT access token (for setting cookies)
 * Matches backend's token structure including unansweredCount
 *
 * @param {string | undefined | null} token
 * @returns {object | null}
 */
export function decodeUserForCookies(token) {
  if (!token) {
    console.warn("⚠️ No token provided to decodeUserForCookies");
    return null;
  }

  try {
    const JWT_SECRET = process.env.JWT_SECRET || "test";
    const decoded = jwt.verify(token, JWT_SECRET);

    return {
      userId: decoded.userId,
      email: decoded.email,
      name: decoded.name,
      picture: decoded.picture,
      status: decoded.status,
      unansweredCount: decoded.unansweredCount || 0,
    };
  } catch (err) {
    console.error("❌ Failed to decode access token:", err.message);
    return null;
  }
}
