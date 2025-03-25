import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * API Route pour modifier le volume d'un device sur Spotify.
 * @param req Requête HTTP
 * @param context Contient les paramètres de la requête (volume et id du device)
 * @returns {object} Résultat de la requête
 */
export async function PUT(req: Request, { params }: { params: Promise<{ volumePercent: number}> }) {
  try {
    const { volumePercent } = await params;
    // const volumePercentInt: number = parseInt(volumePercent, 10);

    const token = (await cookies()).get("spotify_access_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Utilisateur non authentifié" }, { status: 401 });
    }

    if (!volumePercent) {
      return NextResponse.json({ error: "Données manquantes (volumePercent ou deviceId)" }, { status: 400 });
    }

    // console.log(`🎵 Modification du volume : ${volumePercent} sur le device en cours: `);

    // Envoi de la requête PUT à l'API Spotify
    const response = await fetch(`https://api.spotify.com/v1/me/player/volume?volume_percent=${volumePercent}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erreur Spotify:", errorText);
      return NextResponse.json({ error: "Échec de modification du volume Spotify" }, { status: response.status });
    }

    return NextResponse.json({ message: "Modification réussie !" }, { status: 200 });
  } catch (error) {
    console.error("Erreur API set-volume:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}
