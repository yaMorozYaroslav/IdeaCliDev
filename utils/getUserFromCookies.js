const loadUserFromCookie = () => {
  const cookies = document.cookie.split("; ");
  const userCookie = cookies.find((row) => row.startsWith("user_data="));
  if (userCookie) {
    try {
      const encodedValue = userCookie.split("=")[1];
      const decodedValue = decodeURIComponent(encodedValue); // ✅ this decodes %7B%22user...
      const userData = JSON.parse(decodedValue);             // ✅ now safe to parse
      setCurrentUser(userData);
    } catch (e) {
      console.error("❌ Failed to parse user_data cookie:", e);
      setCurrentUser(null);
    }
  } else {
    setCurrentUser(null);
  }
};
