import { NextResponse } from "next/server";
import { cookies } from "next/headers";
/**
 * Fonction GET permettant de faire une requete API vers Spotify pour récupérer les playlists
 * @param req 
 * @param context 
 * @returns 
 */
export async function GET(
    req: Request,
    context: { params: { id: string } }
  ) {
    try {
    //   const url = new URL(req.url);
      // Attente asynchrone de params
      const { id: playlistId } = await context.params;
  
      const token = (await cookies()).get("spotify_access_token")?.value;
      if (!token) {
        return NextResponse.json({ error: "Utilisateur non authentifié" }, { status: 401 });
      }
  
      if (!playlistId) {
        return NextResponse.json({ error: "ID de playlist manquant" }, { status: 400 });
      }
  
      const response = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}?fields=collaborative,description,external_urls,href,id,images,name,owner(display_name)`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      if (!response.ok) {
        throw new Error("Échec de récupération de la playlist");
      }
  
      const data = await response.json();
      return NextResponse.json(data);
    } catch (error) {
      console.error("Erreur API Spotify :", error);
      return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
    }
  }
  