"use client";

import { useState, useEffect } from "react";
import { useAbly } from "@/lib/ablyContext";
import { useParams } from "next/navigation";

/**
 * Ce hook permet de vérifier le room-manager du salon actuel et de comparer son id avec le client actuel
 * @returns 
 */
export const useRoomManager = () => {
  const ably = useAbly();
  const { roomId } = useParams();
  const [isManager, setIsManager] = useState(false);

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
          }
        };

        fetchHistory();
      }
    }, 100);

    return () => clearInterval(checkClientId);
  }, [ably, roomId]);

  return { isManager };
};
