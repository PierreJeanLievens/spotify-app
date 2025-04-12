"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import GameSetupPlaylist from "@/components/GameSetupPlaylist"
import styles from "@/app/game-setup/page.module.css"
import Loading from "@/components/Loading";
import { fetchPlaylist } from "@/lib/fetchData";
import ButtonLink from "@/components/ButtonLink";
import { useAbly } from "@/lib/ablyContext";
import LogoutButton from "@/components/LogoutButton";

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
      const playlistId = localStorage.getItem("playlist_choosen_id");
      if (!playlistId) {
        router.push("/playlists");
        return;
      }
      
      const data = await fetchPlaylist(playlistId);
      setPlaylist(data);
    };
    fetchData();
  }, []);

  if (!playlist) {
    return <Loading title="Recherche de ta playlist" text="Attends que ta playlist charge"/>;
  }

  return (
    <div className="">
      <h1>Game Setup</h1>
      <ButtonLink text="Retour" path="/playlists"/>
      <LogoutButton />
      <div>
          <h1></h1>
          <div className={styles.container}>
            <GameSetupPlaylist playlist={playlist} />
            <div className={styles.separator}></div>
            <div>
                {/* Champ pour entrer le nom de l'user */}
                <input
                  type="text"
                  placeholder="Nom"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                />
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
