import { checkToken } from "./checkToken";
import { fetchFirstDeviceId } from "./fetchData";

// Fonction pour lancer un morceau
const playTrack = async (trackUri: string, router: any) => {
    const token = await checkToken(router);
    console.log(JSON.stringify({ uris: [trackUri] }))
    console.log(JSON.stringify({ uris: trackUri }))
  
    const deviceId = await fetchFirstDeviceId(router);
    try {
      const response = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uris: [trackUri] }),
      });

      if (!response.ok) {
        throw new Error("Impossible de lancer la lecture");
      }

      console.log("Lecture lancée !");
    } catch (error) {
      console.error("Erreur :", error);
    }
  };

export default playTrack;