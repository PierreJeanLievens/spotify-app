import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  // Supprime le cookie en le mettant vide et en fixant une date passée
  (await cookies()).set("spotify_access_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0, // Expire immédiatement
  });

  return NextResponse.json({ success: true });
}
