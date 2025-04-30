"use client";

import ButtonLink from "@/components/buttons/ButtonLink";
import GamePlayers from "@/components/game/GamePlayers";
import { useAbly } from "@/lib/ablyContext";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import styles from "./page.module.css"

export default function WaitingRoomPage() {
  const ably = useAbly();
  const router = useRouter();
  const { roomId } = useParams() as { roomId: string };

  useEffect(() => {
    if (!ably || !roomId) return; // Vérifie qu'Ably est bien initialisé

    const channel = ably.channels.get(`blindtest:${roomId}`);
    if (!channel) return; // Vérifie que le channel est bien défini

     // Fonction pour faire rejoindre le joueur dans la partie
     const handleGameStart = (message: any) => {
      if (message.data.gameStart === true) {
        sessionStorage.removeItem("playerScore");
        sessionStorage.removeItem("processedRounds");
        router.push(`/game/${roomId}`);
      }
    };

    // Lecture de l'historique pour voir si la partie est déjà lancée
    const checkGameAlreadyStarted = async () => {
      try {
        const history = await channel.history();

        const alreadyStarted = history.items.some(
          (item) =>
            item.name === "game-start" &&
            item.data &&
            item.data.gameStart === true
        );

        if (alreadyStarted) {
          handleGameStart({ data: { gameStart: true } }); // Appel manuel de la fonction
        }
      
      } catch (err) {
        console.error("Erreur lors de la récupération de l'historique Ably :", err);
        router.push("/login");
      }
    };

    checkGameAlreadyStarted();

    channel.subscribe("game-start", handleGameStart);

    return () => {
      channel.unsubscribe("game-start", handleGameStart);
    };
  }, [ably, roomId, router]);

  return (
    <>
      <h1 className="title">Salle d'attente</h1>
      <ButtonLink text="Retour" path="/join-room" />
      <div className={styles.container}>
        <div className={styles.container__room}>
          <h2>Salon n°</h2>
          <h2 className={styles.room__id}>{roomId}</h2>
        </div>
        <GamePlayers />
      </div>
    </>
  );
}