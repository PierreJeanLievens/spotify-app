"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ably } from "@/lib/ably";
import GameRoom from "@/components/GameRoom";

export default function RoomPage() {
  const { roomId } = useParams();
  const [track, setTrack] = useState<any>(null);
  const [isAnswerPhase, setIsAnswerPhase] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);

  const channel = ably.channels.get(`blindtest:${roomId}`);

  useEffect(() => {
    channel.subscribe("new-track", (message) => {
      setTrack(message.data);
      setIsAnswerPhase(true);
    });

    channel.subscribe("answer", (message) => {
      setMessages((prev) => [...prev, message.data]);
    });

    return () => {
      channel.unsubscribe();
    };
  }, [channel]);

  const startTrack = async () => {
    const newTrack = { uri: "spotify:track:xxxxxx" }; // Récupère un vrai morceau
    setTrack(newTrack);
    channel.publish("new-track", newTrack);
    console.log(track)
  };

  const sendAnswer = (answer: string) => {
    channel.publish("answer", answer);
  };

  return (
    <div>
      <GameRoom />
    </div>
  );
}
