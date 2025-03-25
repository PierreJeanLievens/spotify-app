// app/api/get-spotify-token/route.ts (ou un fichier similaire selon ton projet)
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = cookies();
  const spotifyAccessToken = (await cookieStore).get("spotify_access_token");

  if (!spotifyAccessToken) {
    return new Response(JSON.stringify({ error: "Token Spotify non trouvé" }), { status: 404 });
  }

  return new Response(JSON.stringify({ token: spotifyAccessToken }), { status: 200 });
}
