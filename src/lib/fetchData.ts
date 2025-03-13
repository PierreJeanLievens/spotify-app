import { checkToken } from "@/lib/checkToken";


/**
 * Cette fonction permet de récupérer la playlist choisie,
 * @param router permet de rediriger le path si besoin
 * @returns 
 */
export const fetchPlaylist = async (router: any) => {
  const token = await checkToken(router);

  try {
    const playlistId = localStorage.getItem("playlist_choosen_id");
    if (!playlistId) {
      router.push("/playlist");
      return;
    }

    const response = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}?fields=collaborative%2Cdescription%2Cexternal_urls%2Chref%2Cid%2Cimages%2Cname%2Cowner%28display_name`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) {
      throw new Error("Échec de récupération de la playlist");
    }

    const data = await response.json();
    if(data){
      return data;
    }else{
      return null;
    }
  } catch (error) {
    console.error(error);
    router.push("/");
  }
};


/**
 * Cette fonction permet de récupérer les titres de la playlist choisie,
 * @param router permet de rediriger le path si besoin
 * @returns 
 */
export const fetchTracksPlaylist = async (router: any) => {
    const token = await checkToken(router);
  
    try {
      const playlistId = localStorage.getItem("playlist_choosen_id");
      if (!playlistId) {
        router.push("/playlist");
        return;
      }
  
      const response = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks?fields=items(track(album(name,release_date,release_date_precision,images),artists(name),name,uri,id,href,popularity))total`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      if (!response.ok) {
        throw new Error("Échec de récupération des titres de la playlist");
      }
  
      const data = await response.json();
      if(data){
        return data;
      }else{
        return null;
      }
    } catch (error) {
      console.error(error);
      router.push("/");
    }
  };


/**
 * Cette fonction permet de récupérer le nombre de titres de la playlist choisie,
 * @param router permet de rediriger le path si besoin
 * @returns le nombre de tracks dans la playlist choisie
 */
export const fetchNumberTracksPlaylist = async (router: any) => {
    const token = await checkToken(router);
  
    try {
      const playlistId = localStorage.getItem("playlist_choosen_id");
      if (!playlistId) {
        router.push("/playlist");
        return;
      }
  
      const response = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}?fields=tracks%28total%29`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      if (!response.ok) {
        throw new Error("Échec de récupération du nombre de titre dans la playlist");
      }
  
      const data = await response.json();
      if(data.tracks.total){
        return data.tracks.total;
      }else{
        return null;
      }
    } catch (error) {
      console.error(error);
      router.push("/");
    }
  };


/**
 * Récupère un nouvel index de track qui n'est pas dans `tracksPast`
 * @param total Nombre total de tracks dans la playlist
 * @param tracksPast Liste des indices déjà utilisés
 * @returns Un index de track non utilisé
 */
const getNewTrackIndex = (total: number): number => {
  const tracksPast: number[] = JSON.parse(localStorage.getItem("list_track_past") || "[]");

  // Si tous les indices ont été utilisés, on réinitialise la liste
  if (tracksPast.length >= total) {
    localStorage.setItem("list_track_past", JSON.stringify([]));
    return Math.floor(Math.random() * total);
  }

  let newIndex: number;
  do {
    newIndex = Math.floor(Math.random() * total);
  } while (tracksPast.includes(newIndex)); // On évite les doublons

  return newIndex;
};



/**
 * Récupère un nouveau morceau de la playlist choisie.
 * @param tracksPast Tableau des indices déjà utilisés
 * @param router Pour la redirection en cas d'erreur
 * @returns Données du morceau ou `null`
 */
export const fetchNewTrack = async (router: any) => {
  const token = await checkToken(router);

  try {
    const playlistId = localStorage.getItem("playlist_choosen_id");
    if (!playlistId) {
      router.push("/playlist");
      return null;
    }

    const total = await fetchNumberTracksPlaylist(router);
    if (!total) return null;

    // Obtenir un nouvel index qui n'est pas dans `tracksPast`
    const offset = getNewTrackIndex(total);

    const response = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks?fields=items(track(album(name,release_date,release_date_precision,images),artists(name),name,uri,id,href,popularity))&limit=1&offset=${offset}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) {
      throw new Error("Échec de récupération du morceau de la playlist");
    }

    const data = await response.json();
    return data.items?.[0]?.track || null; // Retourne le morceau ou `null`
  } catch (error) {
    console.error("Erreur dans fetchNewTrack:", error);
    router.push("/");
    return null;
  }
};
  /**
 * Récupère un nouveau morceau de la playlist choisie.
 * @param tracksPast Tableau des indices déjà utilisés
 * @param router Pour la redirection en cas d'erreur
 * @returns List des devices ou []
 */
export const fetchDevices = async (router: any) => {
  const token = await checkToken(router);

  try {
    const playlistId = localStorage.getItem("playlist_choosen_id");
    if (!playlistId) {
      router.push("/playlist");
      return null;
    }

    const response = await fetch(
      `https://api.spotify.com/v1/me/player/devices`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) {
      throw new Error("Échec de récupération du device");
    }

    const data = await response.json();
    return data.devices || []; // Retourne la list ou `null`
  } catch (error) {
    console.error("Erreur dans fetchDevices:", error);
    router.push("/");
    return null;
  }
};
/**
 * Récupère un nouveau morceau de la playlist choisie.
 * @param tracksPast Tableau des indices déjà utilisés
 * @param router Pour la redirection en cas d'erreur
 * @returns Données du morceau ou `null`
 */
export const fetchFirstDeviceId = async (router: any) => {
  const token = await checkToken(router);

  try {
    const playlistId = localStorage.getItem("playlist_choosen_id");
    if (!playlistId) {
      router.push("/playlist");
      return null;
    }

    const response = await fetch(
      `https://api.spotify.com/v1/me/player/devices`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) {
      throw new Error("Échec de récupération du device");
    }

    const data = await response.json();
    return data.devices?.[0]?.id || null; // Retourne l'id ou `null`
  } catch (error) {
    console.error("Erreur dans fetchDeviceId:", error);
    router.push("/");
    return null;
  }
};
