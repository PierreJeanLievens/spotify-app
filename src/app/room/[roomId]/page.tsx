"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useAbly } from "@/lib/ablyContext";

export default function RoomPage() {
  const { roomId } = useParams();
  const ably = useAbly(); // Récupère Ably du contexte
  const [track, setTrack] = useState<any>(null);
  const [isAnswerPhase, setIsAnswerPhase] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [isManager, setIsManager] = useState(false);

  
  useEffect(() => {
    if (!ably) return; // Attendre que Ably soit chargé

    const channel = ably.channels.get(`blindtest:${roomId}`);

    // Fonction asynchrone pour récupérer l'historique des messages (notamment le room-manager)
    const fetchHistory = async () => {
      try {
        const history = await channel.history();
        // console.log(history);
        history.items.forEach((message: any) => {
          if (message.name === "room-manager") {
            // console.log("📜 Message room-manager récupéré :", message.clientId);
            setIsManager(message.clientId === ably.auth.clientId);
          }
        });
      } catch (err) {
        console.error("❌ Erreur lors de la récupération de l'historique :", err);
      }
    };

    fetchHistory(); // Appel de la fonction asynchrone

    // Écouter les nouveaux morceaux
    channel.subscribe("new-track", (message) => {
      setTrack(message.data);
      setIsAnswerPhase(true);
    });

    // Écouter les réponses des joueurs
    channel.subscribe("answer", (message) => {
      console.log(channel)
      setMessages((prev) => [...prev, message.data]);
    });

    return () => {
      channel.unsubscribe();
    };
  }, [ably, roomId]);

  const startTrack = async () => {
    if (!isManager || !ably) return;

    const newTrack = { uri: "spotify:track:xxxxxx" };
    setTrack(newTrack);
    ably.channels.get(`blindtest:${roomId}`).publish("new-track", newTrack);
  };

  const sendAnswer = (answer: string) => {
    if (!ably) return;
    ably.channels.get(`blindtest:${roomId}`).publish("answer", answer);
  };

  return (
    <div>
      <h1>Salon {roomId} {isManager ? "(Gérant)" : "(Joueur)"}</h1>
      
      {track ? (
        <div>
          <p>Un morceau est en cours...</p>
          {isManager ? (
            <button onClick={() => setIsAnswerPhase(false)}>Arrêter Phase</button>
          ) : (
            <p>Répondez maintenant !</p>
          )}
        </div>
      ) : (
        isManager && <button onClick={startTrack}>Lancer le jeu</button>
      )}

      <input 
        type="text" 
        placeholder="Votre réponse" 
        onKeyDown={(e) => {
          if (e.key === "Enter") sendAnswer(e.currentTarget.value);
        }} 
      />
      <ul>
        {messages.map((msg, index) => <li key={index}>{msg}</li>)}
      </ul>
    </div>
  );
}
