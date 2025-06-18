"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import GameSetupPlaylist from "@/components/game/GameSetupPlaylist"
import styles from "@/app/game-setup/page.module.css"
import Loading from "@/components/ui/Loading";
import { fetchPlaylist } from "@/lib/fetchData";
import BackButton from "@/components/buttons/BackButton";
import { useAbly } from "@/lib/ablyContext";

const GameSetupPage = () => {
  const [playlist, setPlaylist] = useState<any>(null);
  const [clientName, setClientName] = useState("");
  const router = useRouter();
  const ably = useAbly(); // Récupère Ably depuis le contexte
  
  /**
   * Création d'une room, on vérifie que :
   * La connexion soit faite
   * Le nom donné ne soit pas vide
   * @returns 
   */
  const handleCreateRoom = () => {
    if(!ably){
      alert("Pas de connection ably");
      return;
    }

    if (!clientName.trim()) {
      alert("Veuillez entrer un nom");
      return false;
    }
      const newRoomId = Math.random().toString(36).substr(2, 6); // Génère un ID unique

      const cliendId = ably.auth.clientId;
      const channel = ably.channels.get(`blindtest:${newRoomId}`);

      // Ajout pour retrouver le gérant du salon en cas de refresh
      channel.publish("room-manager", { roomId: newRoomId });
      
      // Ajout de l'user dans la liste des participant
      channel.publish("user-list", { cliendId : cliendId, clientName : clientName });
      sessionStorage.setItem("clientName", clientName);
      localStorage.removeItem("list_track_past");
      router.push(`/game-setup/${newRoomId}`);  
  };
  
  
  // Permet de récupérer la playlist choisie et de la stocker dans playlist
  useEffect(() => {
    const fetchData = async () => {
      try {
        const playlistId = localStorage.getItem("playlist_choosen_id");
  
        if (!playlistId) {
          router.push("/playlists");
          return;
        }
        if (playlistId === "saved-tracks") {
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
          console.log(data)
          if (!data) {
            console.error("Aucune donnée reçue pour la playlist.");
            router.push("/playlists"); // ou afficher une erreur à l'utilisateur
            return;
          }

          setPlaylist(data);
        }

      } catch (error) {
        console.error("Erreur lors de la récupération de la playlist :", error);
      }
    };
  
    fetchData();
  }, []);

  if (!playlist) {
    return <Loading title="Recherche de ta playlist" text="Attends que ta playlist charge" redirection="/playlists" />;
  }

  return (
    <div className="">
      <h1 className="title">Game Setup</h1>
      <BackButton text="Retour" path="/playlists"/>
      
      <div>
          <div className={styles.container}>
            <GameSetupPlaylist playlist={playlist} />
            <div className={styles.separator}></div>
            <div className={styles.section__inputs}>
                {/* Champ pour entrer le nom de l'user */}
                <div className="input-block">
                  <input
                  required
                  id="client-name"
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className={`input-text ${styles.input__name}`}
                  />
                  <label htmlFor="client-name" data-label="Nom"/>
                </div>
                
                <button 
                  className={`${styles.play__button} button`}
                  onClick={() => handleCreateRoom()}
                >Créer un salon</button>
            </div>  
          </div>
      </div>
    </div>
  );
};

export default GameSetupPage;
