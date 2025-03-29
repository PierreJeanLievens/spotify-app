"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAbly } from "@/lib/ablyContext";

export default function RoomPage() {
  const { roomId } = useParams();
  const router = useRouter();
  const ably = useAbly(); // Récupère Ably du contexte
  const [track, setTrack] = useState<any>(null);
  const [isAnswerPhase, setIsAnswerPhase] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [isManager, setIsManager] = useState(false);

  
  useEffect(() => {
    if (!ably) return;
    // Execution tant que ably.auth.clientId n'est pas disponible
    const checkClientId = setInterval(() => {
      if (ably.auth.clientId) {
        // console.log("📢 clientId détecté :", ably.auth.clientId);
        clearInterval(checkClientId); // Arrêter l'intervalle une fois clientId défini
  
        // Exécution du code principal après récupération du clientId
        const channel = ably.channels.get(`blindtest:${roomId}`);
  
        const fetchHistory = async () => {
          try {
            const history = await channel.history();
            
            history.items.forEach((message: any) => {
              if (message.name === "room-manager") {
                // console.log("📜 Message room-manager récupéré :", message.clientId);
                // console.log("📜 Comparaison client :", ably.auth.clientId);
  
                setIsManager(message.clientId === ably.auth.clientId);
              }
            });
          } catch (err) {
            console.error("❌ Erreur lors de la récupération de l'historique :", err);
            router.push("/login");
          }
        };
  
        fetchHistory();
  
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
      }
    }, 100); // Vérifie toutes les 100ms
  
    return () => clearInterval(checkClientId); // Nettoyer l'intervalle au démontage
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
