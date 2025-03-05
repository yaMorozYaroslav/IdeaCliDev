// app/lib/getUser.js
"use server";

import { cookies } from "next/headers";

export async function getUser() {
  try {
    const cookieStore = cookies();
    const cookieHeader = cookieStore.toString();

    const response = await fetch("http://localhost:5000/google/me", {
      method: "GET",
      headers: {
        Cookie: cookieHeader, // Pass user cookies to API
      },
      cache: "no-store", // Always fetch fresh user data
    });

    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.log("User not authenticated on SSR", error);
    return null;
  }
}
