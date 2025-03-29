"use client";

import { useState, useEffect } from "react";
import { useAbly } from "@/lib/ablyContext";
import { useParams, useRouter } from "next/navigation";
import { useWebPlayer } from "@/hooks/useWebPlayer";

/**
 * Ce hook gère le rôle de manager du salon et intègre également la gestion du lecteur Spotify.
 * @returns { isManager, filteredPlayerData }
 */
export const useRoomManager = () => {
  const router = useRouter();
  const ably = useAbly();
  const { roomId } = useParams();
  const [isManager, setIsManager] = useState(false);
  const playerData = useWebPlayer(); // Utilisation du lecteur Spotify

  useEffect(() => {
    if (!ably || !roomId) return;

    // Vérifie périodiquement si clientId est disponible
    const checkClientId = setInterval(() => {
      if (ably.auth.clientId) {
        clearInterval(checkClientId);
        const channel = ably.channels.get(`blindtest:${roomId}`);

        const fetchHistory = async () => {
          try {
            const history = await channel.history();
            history.items.forEach((message: any) => {
              if (message.name === "room-manager") {
                setIsManager(message.clientId === ably.auth.clientId);
              }
            });
          } catch (err) {
            console.error("❌ Erreur lors de la récupération de l'historique :", err);
            router.push("/login");
          }
        };

        fetchHistory();
      }
    }, 100);

    return () => clearInterval(checkClientId);
  }, [ably, roomId]);

  // Filtrage des données du lecteur selon le rôle du joueur
  const webPlayer = isManager
    ? playerData
    : { player: null, deviceId: "", isReady: false };

  return { isManager, webPlayer, ably };
};
