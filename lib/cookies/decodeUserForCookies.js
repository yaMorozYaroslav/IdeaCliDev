// lib/decodeUserForCookies.js
// Purpose: decode (NOT verify) a JWT access token to build a lightweight UI cookie.
// Use ONLY for non-sensitive UI state like name/avatar/unansweredCount.
// Never use this to authorize actions — your backend must enforce auth.

/** Base64url -> UTF-8 string (Node, Edge, or Browser) */
function base64urlDecode(input) {
  if (typeof input !== "string") return "";
  const b64 = input.replace(/-/g, "+").replace(/_/g, "/");
  // pad to length % 4 === 0
  const padLen = (4 - (b64.length % 4)) % 4;
  const padded = b64 + "=".repeat(padLen);

  // Node
  if (typeof Buffer !== "undefined") {
    try {
      return Buffer.from(padded, "base64").toString("utf8");
    } catch {
      return "";
    }
  }

  // Edge/Browser
  if (typeof atob === "function") {
    try {
      const binary = atob(padded);
      const len = binary.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
      if (typeof TextDecoder !== "undefined") {
        return new TextDecoder().decode(bytes);
      }
      // Fallback (lossy for non-ASCII)
      return decodeURIComponent(escape(binary));
    } catch {
      return "";
    }
  }

  return "";
}

function decodePayload(token) {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length < 2) return null;
  try {
    const json = base64urlDecode(parts[1]);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function isExpired(claims, skewSec) {
  if (!claims || typeof claims !== "object") return false;
  const exp =
    claims && typeof claims.exp === "number"
      ? claims.exp
      : null;
  if (!exp) return false; // no exp -> don't block UI cookie; backend still guards real actions
  const now = Math.floor(Date.now() / 1000);
  const skew = typeof skewSec === "number" ? skewSec : 30;
  return exp + skew < now;
}

/**
 * Decode user-like fields from a JWT payload (no signature verification).
 * @param {string} token
 * @returns {{
 *   userId: string,
 *   googleId?: string|null,
 *   email?: string|null,
 *   name?: string|null,
 *   picture?: string|null,
 *   status?: string|null,
 *   unansweredCount: number
 * } | null}
 */
export function decodeUserForCookies(token) {
  const claims = decodePayload(token);
  if (!claims) return null;
  if (isExpired(claims, 30)) return null;

  // Accept multiple id shapes
  const id =
    (claims && claims.userId) ||
    (claims && claims.googleId) ||
    (claims && claims.sub) ||
    null;

  if (!id) return null;

  let unansweredCount = 0;
  if (claims && typeof claims.unansweredCount === "number") {
    unansweredCount = claims.unansweredCount;
  } else if (claims && Array.isArray(claims.unanswered)) {
    unansweredCount = claims.unanswered.length;
  }

  return {
    userId: id,
    googleId: (claims && claims.googleId) || null,
    email: (claims && claims.email) || null,
    name: (claims && (claims.name || claims.given_name)) || null,
    picture: (claims && claims.picture) || null,
    status: (claims && claims.status) || null,
    unansweredCount,
  };
}
