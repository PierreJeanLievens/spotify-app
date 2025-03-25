/**
 * Cette fonction permet d'appeler la requete API pour récupérer la playlist choisie,
 * @param playlistId permet de recuperer l'id
 * @returns 
 */
export const fetchPlaylist = async (playlistId: string) => {
  try {
    const response = await fetch(`/api/spotify-fetcher/get-playlist/${playlistId}`);
    if (!response.ok) {
      throw new Error("Échec de récupération de la playlist");
    }
    return await response.json();
  } catch (error) {
    console.error("Erreur lors de la récupération de la playlist :", error);
    return null;
  }
};


/**
 * Cette fonction permet de récupérer les titres de la playlist choisie,
 * @param playlistId l'id de la playlist
 * @returns une liste de tracks
 */
export const fetchTracksPlaylist = async (playlistId: string) => {
  try {
    const response = await fetch(`/api/spotify-fetcher/get-tracks-playlist/${playlistId}`);
    if (!response.ok) {
      throw new Error("Échec de récupération des titres de la playlist");
    }
    return await response.json();
  } catch (error) {
    console.error("Erreur lors de la récupération des titres de la playlist :", error);
    return null;
  }
};


/**
 * Cette fonction permet de récupérer le nombre de titres de la playlist choisie,
 * @param playlistId l'id de la playlist
 * @returns le nombre de tracks dans la playlist choisie
 */
export const fetchNumberTracksPlaylist = async (playlistId: string): Promise<number | null> => {
  try {
    const response = await fetch(`/api/spotify-fetcher/get-number-tracks-playlist/${playlistId}`);
    if (!response.ok) {
      throw new Error("Échec de récupération des titres de la playlist");
    }
    return await response.json();
  } catch (error) {
    console.error("Erreur lors de la récupération des titres de la playlist :", error);
    return null;
  }
};


/**
 * Récupère un nouvel index de track qui n'est pas dans `tracksPast`
 * et met à jour `localStorage`.
 * @param playlistId ID de la playlist pour récupérer le nombre total de tracks
 * @returns Un index de track non utilisé, ou `null` en cas d'erreur
 */
const getNewTrackIndex = async (playlistId: string): Promise<number | null> => {
  try {
    const total: number | null = await fetchNumberTracksPlaylist(playlistId);

    if (!total) return null;
    let tracksPast: number[] = JSON.parse(localStorage.getItem("list_track_past") || "[]");

    // Si `tracksPast` n'existe pas ou est un tableau vide, ou s'il a déjà utilisé tous les titres
    if (!Array.isArray(tracksPast) || tracksPast.length >= total) {
      tracksPast = []; // Réinitialisation
    }

    // Obtenir un nouvel index unique
    let newIndex: number;
    do {
      newIndex = Math.floor(Math.random() * total);
    } while (tracksPast.includes(newIndex));

    // Mettre à jour `localStorage`
    tracksPast.push(newIndex);
    localStorage.setItem("list_track_past", JSON.stringify(tracksPast));

    return newIndex;
  } catch (error) {
    console.error("Erreur dans getNewTrackIndex :", error);
    return null;
  }
};



/**
 * Récupère un nouveau morceau de la playlist choisie.
 * @param playlistId L'ID de la playlist
 * @param tracksPast Liste des indices déjà utilisés
 * @returns Données du morceau avec l'index utilisé ou `null`
 */
export const fetchNewTrack = async (playlistId: string) => {
  try {
    // ⚠️ Correction : Ajout de `await` pour attendre l'index
    const offset : number | null = await getNewTrackIndex(playlistId);
    if (offset === null) {
      return null;
    }

    const response = await fetch(`/api/spotify-fetcher/get-new-track/${playlistId}/${offset}`);

    if (!response.ok) {
      throw new Error("Échec de récupération du morceau de la playlist");
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur dans fetchNewTrack:", error);
    return null;
  }
};


  /**
 * Récupère les devices disponibles
 * @returns List des devices ou []
 */
export const fetchDevices = async () => {
  try {
    const response = await fetch(`/api/spotify-fetcher/get-devices`);
    if (!response.ok) {
      throw new Error("Échec de récupération du device");
    }
    return await response.json();
  } catch (error) {
    console.error("Erreur dans fetchDevices:", error);
    return null;
  }
};


/**
 * Récupère l'id du premier device disponible.
 * @returns Id du device ou null
 */
export const fetchFirstDeviceId = async () => {
  try {
    const response = await fetch(`/api/spotify-fetcher/get-first-device-id`);
    if (!response.ok) {
      throw new Error("Échec de récupération du device");
    }
    return await response.json();
  } catch (error) {
    console.error("Erreur dans fetchFirstDeviceId:", error);
    return null;
  }
};


  /**
 * Récupère l'état du player
 * @return true ou false
 */
  export const fetchPlayerState = async () => { 
    try{
      const response = await fetch(`/api/spotify-fetcher/get-player-state`);
      if (!response.ok) {
        console.error("Échec de récupération du device - Code:", response.status);
        return false;
      }
      return await response.json();
    } catch (error) {
      console.error("Erreur dans fetchPlayerState:", error);
      return null;
    }
  };

