import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * API Route pour récupérer le nombre de titres d'une playlist Spotify
 * @param req Requête HTTP
 * @param context Contient les paramètres de la requête (id de la playlist)
 * @returns Le nombre de titres de la playlist
 */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const token = (await cookies()).get("spotify_access_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Utilisateur non authentifié" }, { status: 401 });
    }

    if (!id) {
      return NextResponse.json({ error: "ID de playlist manquant" }, { status: 400 });
    }

    const response = await fetch(
      `https://api.spotify.com/v1/playlists/${id}/tracks?fields=total`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) {
      throw new Error("Échec de récupération des titres de la playlist");
    }

    const data = await response.json();
    return NextResponse.json(data.total);
  } catch (error) {
    console.error("Erreur API Spotify :", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}
