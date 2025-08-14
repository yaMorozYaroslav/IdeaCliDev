// app/api/refresh-profile/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { refreshUserProfile } from "@/lib/refreshUserProfile";

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ ok: false, message: "userId required" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value || null;

    const profile = await refreshUserProfile(userId, accessToken);

    if (!profile) {
      return NextResponse.json({ ok: false, message: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, profile }, { status: 200 });
  } catch (err: any) {
    console.error("❌ refresh-profile error:", err?.message || err);
    return NextResponse.json({ ok: false, message: "Failed to refresh user" }, { status: 500 });
  }
}
