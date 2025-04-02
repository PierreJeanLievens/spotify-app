"use client";

import { useState, useEffect } from "react";
import { useAbly } from "@/lib/ablyContext";
import { useParams, useRouter } from "next/navigation";
import { useWebPlayer } from "@/hooks/useWebPlayer";

/**
 * Ce hook gère le rôle de manager du salon et intègre également la gestion du lecteur Spotify.
 * @returns { isManager, webPlayer, ably }
 */
export const useRoomManager = () => {
  const router = useRouter();
  const ably = useAbly();
  const { roomId } = useParams();
  const [isManager, setIsManager] = useState(false);
  const [isManagerDetermined, setIsManagerDetermined] = useState(false);
  
  // Initialize player data with checkToken=false until we know if user is manager
  const playerData = useWebPlayer(isManagerDetermined && isManager);

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
                const userIsManager = message.clientId === ably.auth.clientId;
                setIsManager(userIsManager);
                setIsManagerDetermined(true);
                console.log(`User role determined: ${userIsManager ? 'Manager' : 'Player'}`);
              }
            });
            
            // If we couldn't determine the role from history, default to non-manager
            if (!isManagerDetermined) {
              setIsManagerDetermined(true);
              setIsManager(false);
              console.log("No manager info found, defaulting to player role");
            }
          } catch (err) {
            console.error("❌ Erreur lors de la récupération de l'historique :", err);
            router.push("/login");
          }
        };

        fetchHistory();
      }
    }, 100);

    return () => clearInterval(checkClientId);
  }, [ably, roomId, router, isManagerDetermined]);

  // Filtrage des données du lecteur selon le rôle du joueur
  const webPlayer = isManager
    ? playerData
    : { player: null, deviceId: "" };

  return { isManager, webPlayer, ably };
};