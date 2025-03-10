// Fonction pour lancer un morceau
const playTrack = async (trackUri: string) => {
    const token = localStorage.getItem("spotify_access_token");

    if (!token) {
      alert("Pas de token d'authentification !");
      return;
    }

    try {
      const response = await fetch("https://api.spotify.com/v1/me/player/play", {
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