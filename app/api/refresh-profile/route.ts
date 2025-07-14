import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { refreshUserProfile } from "../../../lib/refreshUserProfile";

export async function POST(req: Request) {
  const { userId } = await req.json();

  if (!userId) {
    return NextResponse.json({ message: "Missing userId" }, { status: 400 });
  }

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value || null;

  try {
    const updated = await refreshUserProfile(userId, accessToken);

    if (!updated) {
      return NextResponse.json({ message: "User not found or failed to fetch" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (err) {
    console.error("❌ Failed to refresh user:", err);
    return NextResponse.json({ message: "Failed to refresh user" }, { status: 500 });
  }
}
