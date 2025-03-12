import { checkToken } from "@/lib/checkToken";

// Cette fonction permet de récupérer les titres de la playlist choisie,
/**
 * 
 * @param router permet de rediriger le path si besoin
 * @param setPlaylist permet de stocker les titres dans la variable playlist déclarée avec useState
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
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks?fields=items%28track%28album%28name%2Crelease_date%2Crelease_date_precision%2C+images%29%2Cartists%28name%29%2Cname%2Curi%2Cid%2Chref%2Cpopularity%29total%29`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      if (!response.ok) {
        throw new Error("Échec de récupération des titres de la playlist");
      }
  
      const data = await response.json();
      if(data){
        console.log(data)
        return data;
      }else{
        return null;
      }
    } catch (error) {
      console.error(error);
      router.push("/");
    }
  };
  