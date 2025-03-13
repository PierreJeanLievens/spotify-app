import { checkToken } from "./checkToken";

// Fonction pour lancer un morceau
const playAlbum = async (trackUri: string, router: any) => {
    const token = await checkToken(router);

    try {
      const response = await fetch("https://api.spotify.com/v1/me/player/play", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ context_uri: trackUri }),
      });

      if (!response.ok) {
        throw new Error("Impossible de lancer la lecture");
      }

      console.log("Lecture lancée !");
    } catch (error) {
      console.error("Erreur :", error);
    }
  };

export default playAlbum;