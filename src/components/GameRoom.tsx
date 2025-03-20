"use client";

import { useState } from "react";
import { createRoom, joinRoom } from "@/lib/gameRoom";
import { useRouter } from "next/navigation";

export default function GameRoom() {
  const [roomId, setRoomId] = useState("");
  const router = useRouter();

  const handleCreateRoom = () => {
    const newRoomId = Math.random().toString(36).substr(2, 6); // Génère un ID unique
    createRoom(newRoomId);
    router.push(`/room/${newRoomId}`);
  };

  const handleJoinRoom = () => {
    joinRoom(roomId);
    router.push(`/room/${roomId}`);
  };

  return (
    <div>
      <button onClick={handleCreateRoom}>Créer un salon</button>
      <input
        type="text"
        placeholder="ID du salon"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />
      <button onClick={handleJoinRoom}>Rejoindre</button>
    </div>
  );
}
