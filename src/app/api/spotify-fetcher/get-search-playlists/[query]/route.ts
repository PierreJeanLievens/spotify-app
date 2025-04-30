import { NextResponse } from "next/server";
import { cookies } from "next/headers";
/**
 * Fonction GET permettant de faire une requete API vers Spotify pour rechercher des playlists publiques avec un input 
 * @param req 
 * @param context 
 * @returns 
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ query: string }> }
) {
  try {
    const { query } = await params;

    const token = (await cookies()).get("spotify_access_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Utilisateur non authentifié" }, { status: 401 });
    }

    if (!query) {
      return NextResponse.json({ error: "Query manquante" }, { status: 400 });
    }

    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${query}&type=playlist&limit=20`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) {
      throw new Error("Échec de récupération des playlists recherchées");
    }

    const data = await response.json();
    // On recupère la liste des playlists (playlists.items) et on enlève les objets null
    const playlists = (data.playlists.items || []).filter((item: any) => item !== null); 

    return NextResponse.json(playlists);
  } catch (error) {
    console.error("Erreur API Spotify :", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}

  