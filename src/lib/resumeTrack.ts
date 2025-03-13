import { checkToken } from "./checkToken";
import { fetchFirstDeviceId } from "./fetchData";

// Fonction pour relancer un morceau
const resumeTrack = async (router: any) => {
    const token = await checkToken(router);
    // const deviceId = await fetchFirstDeviceId(router);
    const deviceId = localStorage.getItem("device_id");
    try {
      const response = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Impossible de relancer la lecture");
      }

      console.log("Lecture relancée !");
    } catch (error) {
      console.error("Erreur :", error);
    }
  };

export default resumeTrack;