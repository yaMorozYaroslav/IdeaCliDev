// utils/getUserFromCookies.js
export function getUserFromCookies() {
  try {
    const cookies = document.cookie;
    const match = cookies.match(/(?:^|;\s*)user_data=([^;]*)/);
    if (!match) return null;

    const decoded = decodeURIComponent(match[1]);
    const user = JSON.parse(decoded);
    return user;
  } catch (err) {
    console.error("❌ Failed to parse user_data cookie:", err);
    return null;
  }
}
