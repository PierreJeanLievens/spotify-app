"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import GameSetupPlaylist from "@/components/GameSetupPlaylist"
import GameSetupPlayers from "@/components/GameSetupPlayers"
import styles from "@/app/game-setup/page.module.css"
import Loading from "@/components/Loading";
import { Player } from "@/types/spotify";
import { fetchPlaylist } from "@/lib/fetchPlaylist";
import { fetchTracksPlaylist } from "@/lib/fetchTracksPlaylist";

const GamePage = () => {
  const [playlist, setPlaylist] = useState<any>();
  const [players, setPlayers] = useState<Player[]>([]);
  const router = useRouter();

  const startGame = () => {
    const storedPlayers = localStorage.getItem("players");
    if (storedPlayers) {
      try {
        const parsedPlayers = JSON.parse(storedPlayers); // On récupère les joueurs directement
        if (parsedPlayers.length > 0) {
          setPlayers(parsedPlayers); // Mise à jour de l'état
          router.push("/game"); // Navigation immédiate
        } else {
          console.warn("Aucun joueur trouvé.");
        }
      } catch (error) {
        console.error("Erreur lors du parsing des joueurs :", error);
      }
    }else {
      console.error("Il faut ajouter des joueurs");
    }
  };
  
  // Permet de récupérer la playlist choisie et de la stocker dans playlist
  useEffect(() => {
    const fetchPlaylistData = async () => {
      const playlist = await fetchPlaylist(router);
      setPlaylist(playlist);
    };
    
    const fetchTracksPlaylistData = async () => {
      const tracks = await fetchTracksPlaylist(router);
      console.log(tracks)
    };
    
    fetchPlaylistData();
    fetchTracksPlaylistData();


  }, [router]);

  if (!playlist) {
    return <Loading text="test"/>;
  }

  return (
    <div className="">
      <h1>Mes Playlists Spotify</h1>
      <button
        onClick={() => {
          localStorage.removeItem("spotify_access_token");
          router.push("/");
        }}
      >
        Déconnexion
      </button>
      <div>
          <h1></h1>
          <div className={`${styles.container}`}>
            <GameSetupPlaylist playlist={playlist} />
            <div className="separator"></div>
            <GameSetupPlayers />
          </div>
          
      </div>
    </div>
  );
};

export default GamePage;
