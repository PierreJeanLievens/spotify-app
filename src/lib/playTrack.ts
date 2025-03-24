/**
 * Fonction pour lancer un morceau sur le lecteur Spotify.
 * @param trackUri Le lien du titre Spotify à jouer (ex: "spotify:track:4iV5W9uYEdYUVa79Axb7Rh").
 * @param deviceId L'identifiant du device Spotify où lire le morceau.
 */
export const playTrack = async (trackUri: string, deviceId: string) => {
  try {
    const response = await fetch("/api/spotify-fetcher/play-track", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trackUri, deviceId }),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Erreur Spotify: ${errorMessage}`);
    }

    console.log("Lecture lancée !");
  } catch (error) {
    console.error("Erreur dans playTrack:", error);
  }
};
