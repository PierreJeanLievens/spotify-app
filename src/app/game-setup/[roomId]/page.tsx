"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import GameSetupPlaylist from "@/components/game/GameSetupPlaylist";
import styles from "@/app/game-setup/page.module.css";
import Loading from "@/components/ui/Loading";
import { fetchPlaylist } from "@/lib/fetchData";
import BackButton from "@/components/buttons/BackButton";
import { useAbly } from "@/lib/ablyContext";
import GamePlayers from "@/components/game/GamePlayers";
import CopyJoinRoomButton from "@/components/buttons/CopyJoinRoomButton";

const GameSetupPage = () => {
  const [playlist, setPlaylist] = useState<any>(null);
  const [channel, setChannel] = useState<any>(null); // État pour stocker le channel
  const router = useRouter();
  const { roomId } = useParams();
  const ably = useAbly(); // Récupère Ably depuis le contexte

  // Initialisation du channel une fois qu'Ably est disponible
  useEffect(() => {
    if (ably && roomId) {
      setChannel(ably.channels.get(`blindtest:${roomId}`));
    }
  }, [ably, roomId]);

  // Vérification des joueurs avant de lancer la partie
  const startGame = () => {
    const playlistId = localStorage.getItem("playlist_choosen_id");
    if (!playlistId) {
      console.error("❌ Pas de playlist sélectionnée !");
      return;
    }
    if (!channel) {
      console.error("❌ Channel non disponible !");
      return;
    }
    try {
      channel.publish("game-start", {gameStart : true});
      sessionStorage.removeItem("playerScore");
      sessionStorage.removeItem("processedRounds");
      router.push(`/game/${roomId}`); // Navigation immédiate
    } catch (error) {
      console.error("❌ Erreur lors du lancement du jeu :", error);
    }
  };

  // Récupérer la playlist choisie
  useEffect(() => {
    const fetchData = async () => {
      const playlistId = localStorage.getItem("playlist_choosen_id");
      if (!playlistId) {
        router.push("/playlists");
        return;
      }
      if(playlistId === "saved-tracks") {
        console.log("SAVE TRACKS");
        // Object simulé dans le cas SaveTracks
        const playlist = {
          id: "saved-tracks",
          name: "Titres Likés",
          description: "Tes titres enregistrés sur Spotify",
          images: [
            {
              url: "/liked-songs-cover.png", // Remplace par une image custom ou une icône de cœur
              height: 300,
              width: 300
            }
          ],
          owner: {
            display_name: "Moi",
          },
          tracks: {
            href: "https://api.spotify.com/v1/me/tracks",
            total: 0, // tu peux mettre à jour après le fetch réel
            items: [] // à remplir si tu veux charger les titres likés
          },
          type: "playlist",
          isSavedTracks: true, // pour t'aider à différencier plus tard si besoin
        };
    
        setPlaylist(playlist);
      } else {
        const data = await fetchPlaylist(playlistId);
        setPlaylist(data);
      }
    };
    fetchData();
  }, []);

  if (!playlist) {
    return <Loading title="Recherche de ta playlist" text="Attends que ta playlist charge" redirection="/playlists" />;
  }

  return (
    <div>
      <h1 className="title">Game Setup : {roomId}</h1>
      <div>  
        <BackButton text="Retour" path="/game-setup"/>
        <CopyJoinRoomButton roomId={roomId} page='join-room'/> 
        
      </div>
      <div>
        <div className={styles.container}>
          <GameSetupPlaylist playlist={playlist} />
          <div className={styles.separator}></div>
          <div className={styles.container__room__players}>
            <div className={styles.container__room}>
              <h2>Salon n°</h2>
              <h2 className={styles.room__id}>{roomId}</h2>
            </div>
            <GamePlayers />
          </div>
        </div>
        <button 
          className={`${styles.play__button} button`}
          onClick={startGame}
          disabled={!channel} // Désactive le bouton si le channel n'est pas encore dispo
        >
          Jouer
        </button>
      </div>
    </div>
  );
};

export default GameSetupPage;
