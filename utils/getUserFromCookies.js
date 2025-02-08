// utils/getUserFromCookies.js
"use server";

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export const getUserFromCookies = async() => {
  const cookieStore = await cookies(); // Correct way to get cookies on the server
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) return null;

  try {
    const user = jwt.verify(accessToken, "test"); // Replace 'test' with your secret
    return user;
  } catch (err) {
    console.error("Invalid token:", err);
    return null;
  }
};
