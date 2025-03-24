import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * API Route pour lancer un morceau sur Spotify.
 * @param req Requête HTTP contenant le body avec `trackUri` et `deviceId`
 * @returns {object} Résultat de la requête
 */
export async function PUT(req: Request) {
  try {
    
    const token = (await cookies()).get("spotify_access_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Utilisateur non authentifié" }, { status: 401 });
    }

    // Récupération du corps de la requête
    const { trackUri, deviceId } = await req.json();
    if (!trackUri || !deviceId) {
      return NextResponse.json({ error: "Données manquantes (trackUri ou deviceId)" }, { status: 400 });
    }

    console.log(`🎵 Lecture en cours: ${trackUri} sur device: ${deviceId}`);

    // Envoi de la requête PUT à l'API Spotify
    const response = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uris: [trackUri] }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erreur Spotify:", errorText);
      return NextResponse.json({ error: "Échec de la lecture Spotify" }, { status: response.status });
    }

    return NextResponse.json({ message: "Lecture lancée avec succès !" }, { status: 200 });
  } catch (error) {
    console.error("Erreur API play-track:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}
