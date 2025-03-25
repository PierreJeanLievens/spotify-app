import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * API Route pour mettre en pause la lecture sur Spotify.
 * @returns {object} Résultat de la requête
 */
export async function PUT() {
  try {
    const token = (await cookies()).get("spotify_access_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Utilisateur non authentifié" }, { status: 401 });
    }

    // Envoi de la requête PUT à l'API Spotify pour mettre en pause
    const response = await fetch("https://api.spotify.com/v1/me/player/pause", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erreur Spotify:", errorText);
      return NextResponse.json({ error: "Impossible de mettre en pause la lecture" }, { status: response.status });
    }

    return NextResponse.json({ message: "Pause effectuée !" }, { status: 200 });
  } catch (error) {
    console.error("Erreur API pause-track:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}
