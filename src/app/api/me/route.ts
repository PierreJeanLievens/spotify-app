// app/api/me/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
try {
    const token = (await cookies()).get("spotify_access_token")?.value;
    return NextResponse.json({ isAuthenticated: !!token });
    
} catch (error) {
    console.error("Erreur API Me :", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
}
}
