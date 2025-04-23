/**
 * Fonction pour mettre sur pause un morceau sur le lecteur Spotify.
 */
export const pauseTrack = async () => {
  try {
    const response = await fetch("/api/spotify-fetcher/pause-track", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Erreur Spotify: ${errorMessage}`);
    }

    console.log("Lecture lancée !");
  } catch (error) {
    console.error("Erreur dans pauseTrack:", error);
  }
};
