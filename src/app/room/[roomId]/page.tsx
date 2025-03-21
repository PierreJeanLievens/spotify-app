"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ably } from "@/lib/ably";
import { joinRoom } from "@/lib/gameRoom";

export default function RoomPage() {
  const { roomId } = useParams();
  const [clientId, setClientId] = useState<string | null>(null);
  const [channel, setChannel] = useState<any>(null);
  const [track, setTrack] = useState<any>(null);
  const [isAnswerPhase, setIsAnswerPhase] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [isManager, setIsManager] = useState(false);

  // Obtenir le clientId dès que Ably est connecté
  useEffect(() => {
    const safeRoomId = Array.isArray(roomId) ? roomId[0] : roomId; // Prendre le premier élément si roomId est un tableau
    if (safeRoomId) {
      const newChannel = joinRoom(safeRoomId);
      console.log("Client ID reçu :", ably.auth.clientId);
      setClientId(ably.auth.clientId);
      setChannel(newChannel);
    }
  }, []);

  // Initialiser le channel une fois que clientId est défini
  useEffect(() => {
    if (!clientId){
      console.log("Return car pas de clientID")
      return;
    } 

    console.log("Initialisation du channel pour", roomId);
    const newChannel = ably.channels.get(`blindtest:${roomId}`);
    setChannel(newChannel);
  }, [clientId, roomId]);

  // Écouter les événements WebSocket une fois que le channel est prêt
  useEffect(() => {
    if (!clientId || !channel) return;

    console.log("🔗 Inscription aux événements pour", roomId);

    // Fonction asynchrone pour récupérer l'historique des messages (notamment le room-manager)
    const fetchHistory = async () => {
      try {
        const history = await channel.history();
        console.warn(history);
        history.items.forEach((message: any) => {
          if (message.name === "room-manager") {
            console.log("📜 Message room-manager récupéré :", message.data);
            setIsManager(message.data === clientId);
          }
        });
      } catch (err) {
        console.error("❌ Erreur lors de la récupération de l'historique :", err);
      }
    };

    fetchHistory(); // Appel de la fonction asynchrone

    // Inscription aux événements en temps réel
    channel.subscribe("new-track", (message: any) => {
      setTrack(message.data);
      setIsAnswerPhase(true);
    });

    channel.subscribe("answer", (message: any) => {
      console.log("📩 Réponse reçue :", message.data);
      setMessages((prev) => [...prev, message.data]);
    });

    return () => {
      console.log("❌ Désinscription des événements pour", roomId);
      channel.unsubscribe();
    };
  }, [clientId, channel]);


  const startTrack = async () => {
    if (!isManager || !channel) return;
    const newTrack = { uri: "spotify:track:xxxxxx" };
    setTrack(newTrack);
    channel.publish("new-track", newTrack);
  };

  const sendAnswer = (answer: string) => {
    if (!channel) return;
    channel.publish("answer", answer);
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
