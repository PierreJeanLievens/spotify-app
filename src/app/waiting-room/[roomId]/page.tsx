"use client";

import ButtonLink from "@/components/ButtonLink";
import GamePlayers from "@/components/GamePlayers";
import { useAbly } from "@/lib/ablyContext";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function WaitingRoomPage() {
  const ably = useAbly();
  const router = useRouter();
  const { roomId } = useParams() as { roomId: string };

  useEffect(() => {
    if (!ably) return; // Vérifie qu'Ably est bien initialisé

    const channel = ably.channels.get(`blindtest:${roomId}`);
    if (!channel) return; // Vérifie que le channel est bien défini

    // Fonction gestion lors de réception de message dans 'game-start'
    const handleGameStart = (message: any) => {
      console.log(message)
      if (message.data.gameStart === true) {
        router.push(`/game/${roomId}`);
      }
    };

    channel.subscribe("game-start", handleGameStart);

    return () => {
      channel.unsubscribe("game-start", handleGameStart);
    };
  }, [ably, roomId, router]);

  return (
    <>
      <h1>Salle d'attente</h1>
      <ButtonLink text="Retour" path="/join-room" />
      <h2>Salon</h2>
      <h4>{roomId}</h4>
      <GamePlayers />
    </>
  );
}
