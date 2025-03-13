// import { checkToken } from "@/lib/checkToken";

// // Cette fonction permet de récupérer la playlist choisie,
// /**
//  * 
//  * @param router permet de rediriger le path si besoin
//  * @returns 
//  */
// export const fetchPlaylist = async (router: any) => {
//     const token = await checkToken(router);
  
//     try {
//       const playlistId = localStorage.getItem("playlist_choosen_id");
//       if (!playlistId) {
//         router.push("/playlist");
//         return;
//       }
  
//       const response = await fetch(
//         `https://api.spotify.com/v1/playlists/${playlistId}?fields=collaborative%2Cdescription%2Cexternal_urls%2Chref%2Cid%2Cimages%2Cname%2Cowner%28display_name`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
  
//       if (!response.ok) {
//         throw new Error("Échec de récupération de la playlist");
//       }
  
//       const data = await response.json();
//       if(data){
//         console.log(data)
//         return data;
//       }else{
//         return null;
//       }
//     } catch (error) {
//       console.error(error);
//       router.push("/");
//     }
//   };
  