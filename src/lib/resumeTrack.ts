/**
 * Fonction pour relancer la lecture d'un morceau sur le lecteur Spotify.
 * @param deviceId L'identifiant du device Spotify où reprendre la lecture.
 */
export const resumeTrack = async (deviceId: string) => {
  try {
    const response = await fetch("/api/spotify-fetcher/resume-track", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deviceId }),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Erreur Spotify: ${errorMessage}`);
    }

    console.log("Lecture relancée !");
  } catch (error) {
    console.error("Erreur dans resumeTrack:", error);
  }
};
