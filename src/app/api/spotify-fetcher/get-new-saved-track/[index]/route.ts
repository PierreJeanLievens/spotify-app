import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * API Route pour récupérer un morceau spécifique dans les titres sauvegardés.
 * @param req Requête HTTP
 * @param context Contient les paramètres de la requête (index du morceau)
 * @returns Le morceau correspondant au format JSON
 */
export async function GET(req: Request, { params }: { params: Promise<{index: string }> }) {
  try {
    const { index } = await params;
    const offset = parseInt(index, 10);

    const token = (await cookies()).get("spotify_access_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Utilisateur non authentifié" }, { status: 401 });
    }

    // Requête pour récupérer un morceau précis via l'offset
    const response = await fetch(
      `https://api.spotify.com/v1/me/tracks?fields=items(track(album(name,release_date,release_date_precision,images),artists(name),name,uri,id,href,popularity))&limit=1&offset=${offset}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) {
      throw new Error("Échec de récupération du morceau");
    }

    const data = await response.json();
    return NextResponse.json(data.items?.[0]?.track || { error: "Morceau introuvable" });
  } catch (error) {
    console.error("Erreur API Spotify :", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}
