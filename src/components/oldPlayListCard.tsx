// "use client";

// import React, { useEffect, useState } from "react";
// import playTrack from "@/lib/playTrack";
// import { PlaylistCardProps } from "@/types/spotify";



// export default function PlaylistCard({ playlist }: PlaylistCardProps) {
//   const [playlistChoosenId, setPlaylistsChoosenId] = useState<string | null>(null);

//   // Initialisation avec localStorage après le premier rendu
//   useEffect(() => {
//     const storedId = localStorage.getItem("playlist_choosen_id");
//     if (storedId) {
//       setPlaylistsChoosenId(storedId);
//     }
//   }, []);

//   // Fonction pour changer de playlist
//   const handlePlaylistClick = () => {
//     // Si on clique sur la même playlist, la désélectionner
//     setPlaylistsChoosenId((prevId) => (prevId === playlist.id ? null : playlist.id));
//     if (playlistChoosenId !== null) {
//         localStorage.setItem("playlist_choosen_id", playlistChoosenId);
//         console.log("Playlist choisie :", playlistChoosenId);
//       }
//   };

//   return (
//     <li 
//       className={playlist.id === playlistChoosenId ? "selected" : ""}
//       onClick={handlePlaylistClick}
//     >
//       <h3>{playlist.name}</h3>
//       <a href={playlist.external_urls.spotify} target="_blank" rel="noopener noreferrer">
//         {playlist.images?.length > 0 ? (
//           <img src={playlist.images[0].url} alt={playlist.name} width="100" />
//         ) : (
//           <div style={{ width: "100px", height: "100px", background: "#ddd", display: "flex", alignItems: "center", justifyContent: "center" }}>
//             <p>Pas d'image</p>
//           </div>
//         )}
//       </a>

//       {/* Bouton pour jouer le premier morceau */}
//       <button
//         onClick={() => {
//           const token = localStorage.getItem("spotify_access_token");
//           if (!token) {
//             alert("Veuillez vous reconnecter à Spotify.");
//             return;
//           }

//           if (playlist.tracks?.href) {
//             fetch(playlist.tracks.href, {
//               headers: { Authorization: `Bearer ${token}` },
//             })
//               .then((res) => res.json())
//               .then((data) => {
//                 if (data.items?.length > 0) {
//                   setPlaylistsChoosenId(playlist.id);
//                   // playTrack(data.items[0].track.uri);
//                 } else {
//                   alert("Aucun morceau trouvé dans la playlist");
//                 }
//               })
//               .catch((error) => console.error("Erreur récupération morceaux", error));
//           }
//         }}
//       >
//         ▶ Jouer le premier morceau
//       </button>
//     </li>
//   );
// }
