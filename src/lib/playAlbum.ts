/**
 * Fonction pour lancer un album ou une playlist sur le lecteur Spotify.
 * @param contextUri URI de l'album ou de la playlist (ex: "spotify:album:6JWc4iAiJ9FjyK0B59ABb4").
 * @param deviceId L'identifiant du device Spotify où lire l'album.
 */
export const playAlbum = async (contextUri: string, deviceId: string) => {
  try {
    const response = await fetch("/api/spotify-fetcher/play-album", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contextUri, deviceId }),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Erreur Spotify: ${errorMessage}`);
    }

    console.log("Lecture de l'album/playlist lancée !");
  } catch (error) {
    console.error("Erreur dans playAlbum:", error);
  }
};
