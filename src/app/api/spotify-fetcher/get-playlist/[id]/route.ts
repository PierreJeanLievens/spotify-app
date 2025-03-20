import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const token = (await cookies()).get("spotify_access_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Utilisateur non authentifié" }, { status: 401 });
    }

    const playlistId = await params.id;

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
    console.error("Erreur API Playlist :", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}
