"use client";
import { useRoomManager } from "@/hooks/useRoomManager";
import { fetchNewTrack, fetchPlayerState } from "@/lib/fetchData";
import pauseTrack from "@/lib/pauseTrack";
import { Track } from "@/types/spotify";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function GameSetupPage() {
  const { isManager } = useRoomManager();
  const [track, setTrack] = useState<Track | null>(null);
  const router = useRouter();

  // Attendre que `isManager` soit bien défini avant d'exécuter le useEffect
  useEffect(() => {
    if (isManager === undefined) return; // Attendre que isManager soit évalué

    console.log("Use Effect déclenché !");
    console.log("isManager:", isManager);

    const initGame = async () => {
      try {
        const newTrack = await fetchNewTrack(router);
        setTrack(newTrack);
        console.log(newTrack);
        const isPlayingFetched = await fetchPlayerState(router);
        if (isPlayingFetched) {
          await pauseTrack(router);
        }
      } catch (error) {
        console.error("Erreur lors de l'initialisation :", error);
      }
    };

    if (isManager) {
      initGame();
    }
  }, [isManager]); // ⚠ `isManager` ne change pas de taille entre les renders

  return (
    <div>
      <h1>Configuration du jeu</h1>

      {isManager ? (
        <button>Lancer le jeu</button>
      ) : (
        <p>En attente que l'hôte lance la partie...</p>
      )}
    </div>
  );
}
