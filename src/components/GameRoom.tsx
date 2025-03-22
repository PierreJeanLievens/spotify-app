"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAbly } from "@/lib/ablyContext"; // Importation du contexte Ably

export default function GameRoom() {
  const [roomId, setRoomId] = useState("");
  const router = useRouter();
  const ably = useAbly(); // Récupère Ably depuis le contexte

  const handleCreateRoom = () => {
    if(!ably){
      alert("Pas de connection ably");
      return;
    }
      const newRoomId = Math.random().toString(36).substr(2, 6); // Génère un ID unique
    
      const channel = ably.channels.get(`blindtest:${newRoomId}`);
      channel.publish("room-manager", { roomId: newRoomId });

      router.push(`/room/${newRoomId}`);
    
    
  };

  const handleJoinRoom = () => {
    if (!roomId.trim()) {
      alert("Veuillez entrer un ID de salon valide !");
      return;
    }
    if(!ably){
      alert("Pas de connection ably");
      return;
    }

    // const channel = ably.channels.get(`blindtest:${roomId}`);
    // channel.publish("room-joined", { roomId });

    router.push(`/room/${roomId}`);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Blind Test</h1>

      {/* Bouton de création de salon */}
      <button
        onClick={handleCreateRoom}
        className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4 hover:bg-blue-600"
      >
        Créer un salon
      </button>

      {/* Champ pour entrer l'ID du salon */}
      <input
        type="text"
        placeholder="ID du salon"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        className="border border-gray-300 px-4 py-2 rounded-md mb-2"
      />

      {/* Bouton pour rejoindre un salon */}
      <button
        onClick={handleJoinRoom}
        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
      >
        Rejoindre
      </button>
    </div>
  );
}
