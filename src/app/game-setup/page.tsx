"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import GameSetupPlaylist from "@/components/GameSetupPlaylist"
import GameSetupPlayers from "@/components/GameSetupPlayers"
import styles from "@/app/game-setup/page.module.css"
import Loading from "@/components/Loading";
import { Player } from "@/types/spotify";
// import { fetchPlaylist } from "@/lib/fetchPlaylist";
import { fetchPlaylist } from "@/lib/fetchData";

const GameSetupPage = () => {
  const [playlist, setPlaylist] = useState<any>(null);
  const router = useRouter();

  // Verification d'avoir des joueurs avant de lancer
  const startGame = () => {
    const storedPlayers = localStorage.getItem("players");
    const playlistId = localStorage.getItem("playlist_choosen_id");
    if (storedPlayers && playlist) {
      try {
        const parsedPlayers = JSON.parse(storedPlayers); // On récupère les joueurs directement
        if (parsedPlayers.length > 0) {
          router.push(`/game`); // Navigation immédiate
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
    const fetchData = async () => {
      const data = await fetchPlaylist(router);
      setPlaylist(data);
    };
    fetchData();
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

          <button 
            className={`${styles.play__button} button`}
            onClick={() => startGame()}
          >Jouer</button>
          
      </div>
    </div>
  );
};

export default GameSetupPage;
