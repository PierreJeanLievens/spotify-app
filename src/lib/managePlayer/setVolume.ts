/**
 * Fonction appeler l'api qui modifie le volume lecteur Spotify.
 * @param volumePercent Le volume à mettre.
 * @param deviceId L'identifiant du device Spotify où lire le morceau.
 */
export const setVolumeWithDevice = async (volumePercent: number, deviceId: string) => {
    try {
      const response = await fetch(`/api/spotify-fetcher/set-volume/${volumePercent}/${deviceId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
  
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Erreur Spotify: ${errorMessage}`);
      }
  
      console.log("Volume modifié");
    } catch (error) {
      console.error("Erreur dans setvolume:", error);
    }
  };


/**
 * Fonction appeler l'api qui modifie le volume lecteur Spotify.
 * @param volumePercent Le volume à mettre.
 */
export const setVolume = async (volumePercent: number) => {
    try {
      const response = await fetch(`/api/spotify-fetcher/set-volume/${volumePercent}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
  
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Erreur Spotify: ${errorMessage}`);
      }
  
      console.log("Volume modifié");
    } catch (error) {
      console.error("Erreur dans setvolume:", error);
    }
  };
  