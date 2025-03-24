import { NextResponse } from "next/server";
import { cookies } from "next/headers";
// TEST 
export async function GET() {
  try {
    // Récupération du token depuis les cookies sécurisés
    const token = (await cookies()).get("spotify_access_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Utilisateur non authentifié" }, { status: 401 });
    }

    // Requête vers l’API Spotify l'id du premier device
    const response = await fetch("https://api.spotify.com/v1/me/player/devices", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error("Échec de récupération des playlists");
    }

    const data = await response.json();
    const id: string = data.devices?.[0]?.id || null; // Retourne l'id ou `null`
    return NextResponse.json(id);
  } catch (error) {
    console.error("Erreur API Playlists :", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}
