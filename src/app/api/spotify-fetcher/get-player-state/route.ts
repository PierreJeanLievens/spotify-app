import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * API Route pour récupérer l'état du player Spotify
 * @returns {boolean} true si la lecture est en cours, sinon false
 */
export async function GET() {
  try {
    const token = (await cookies()).get("spotify_access_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Utilisateur non authentifié" }, { status: 401 });
    }

    const response = await fetch(`https://api.spotify.com/v1/me/player`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      console.error("Échec de récupération du player - Code:", response.status);
      return NextResponse.json({ isPlaying: false }, { status: 200 });
    }
   // Si le body est vide, éviter l'erreur JSON
    const text = await response.text();
    if (!text) {
      console.warn("Réponse vide reçue pour fetchPlayerState");
      return NextResponse.json({ isPlaying: false }, { status: 200 });
    }

    const data = JSON.parse(text);
    const isPlaying : boolean = data.is_playing ? data.is_playing : false;
    return NextResponse.json({ isPlaying: isPlaying || false }, { status: 200 });
  } catch (error) {
    console.error("Erreur API fetchPlayerState:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}
