"use client";
import { useRoomManager } from "@/hooks/useRoomManager";
import { fetchNewTrack, fetchNumberTracksPlaylist } from "@/lib/fetchData";
import { Track } from "@/types/spotify";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function GameSetupPage() {
  const { isManager } = useRoomManager();
  const [track, setTrack] = useState<Track | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (isManager === undefined) return; // Attendre que isManager soit évalué

    const initGame = async () => {
      try {
        const playlistId = localStorage.getItem("playlist_choosen_id");
        if (!playlistId) {
          router.push("/playlist");
          return;
        }
        // Récupération d'un nouveau morceau
        const newTrack = await fetchNewTrack(playlistId);
        console.log(newTrack)
        if (newTrack) {
          setTrack(newTrack);
        }
      } catch (error) {
        console.error("Erreur lors de l'initialisation :", error);
      }
    };

    if (isManager) {
      initGame();
    }
  }, [isManager]);

  return (
    <div>
      <h1>Configuration du jeu</h1>
      {isManager ? <button>Lancer le jeu</button> : <p>En attente que l'hôte lance la partie...</p>}
    </div>
  );
}
