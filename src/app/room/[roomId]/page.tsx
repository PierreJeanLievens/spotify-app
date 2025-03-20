"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ably } from "@/lib/ably";
import playTrack from "@/lib/playTrack";

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
      <h1>Salon {roomId}</h1>
      {track ? (
        <div>
          <p>Un morceau est en cours...</p>
          {isAnswerPhase ? (
            <button onClick={() => setIsAnswerPhase(false)}>Arrêter Phase</button>
          ) : (
            <button onClick={startTrack}>Suivant</button>
          )}
        </div>
      ) : (
        <button onClick={startTrack}>Lancer le jeu</button>
      )}
      <input type="text" placeholder="Votre réponse" onKeyDown={(e) => {
        if (e.key === "Enter") sendAnswer(e.currentTarget.value);
      }} />
      <ul>
        {messages.map((msg, index) => <li key={index}>{msg}</li>)}
      </ul>
    </div>
  );
}
