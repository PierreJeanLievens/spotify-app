import { checkToken } from "./checkToken";

// Fonction pour stop un morceau
const pauseTrack = async (router: any) => {
    const token = await checkToken(router);

    try {
      const response = await fetch("https://api.spotify.com/v1/me/player/pause", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Impossible de mettre en pause la lecture");
      }

      console.log("Pause effectuée !");
    } catch (error) {
      console.error("Erreur :", error);
    }
  };

export default pauseTrack;