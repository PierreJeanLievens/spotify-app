import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { code } = await req.json();

  if (!code) {
    return NextResponse.json({ error: "Code manquant" }, { status: 400 });
  }

  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI;

  const params = new URLSearchParams();
  params.append("client_id", clientId as string);
  params.append("client_secret", clientSecret as string);
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", redirectUri as string);

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });

  if (!response.ok) {
    return NextResponse.json({ error: "Erreur d'authentification" }, { status: 400 });
  }

  const data = await response.json();
  return NextResponse.json(data);
}
