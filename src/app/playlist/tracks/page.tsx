// PAGE DE TEST
'use client';  // Assure-toi que ce fichier est côté client

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchTracksPlaylist } from "@/lib/fetchData";  // Assure-toi que le chemin est correct

const PlaylistTracksPage = () => {
  const [tracks, setTracks] = useState<any[]>([]);  // Type approprié pour les tracks
  const router = useRouter();
  
  useEffect(() => {
    const playlistId = localStorage.getItem("playlist_choosen_id");
    
    if (playlistId) {
      const fetchData = async () => {
        const tracksData = await fetchTracksPlaylist(playlistId);  // Appel de la fonction pour récupérer les tracks
        if (tracksData) {
          setTracks(tracksData.items || []);  // Stocke les résultats dans l'état
          console.log("Tracks reçus : ", tracksData.items);  // Affiche les tracks dans la console
        } else {
          console.error("Aucun track récupéré");
        }
      };

      fetchData();
    } else {
      router.push("/playlist");  // Redirection si aucun playlistId n'est trouvé
    }
  }, [router]);

  return (
    <div>
      <h1>Liste des Tracks de la Playlist</h1>
      <ul>
        {tracks.length === 0 ? (
          <p>Chargement des tracks...</p>
        ) : (
          tracks.map((track, index) => (
            <li key={index}>
              {track.track.name} - {track.track.artists[0].name} {/* Affichage du titre et de l'artiste */}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default PlaylistTracksPage;
