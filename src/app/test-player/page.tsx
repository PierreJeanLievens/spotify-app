"use client";
import { usePlayer } from "@/hooks/useWebPlayer";
import { playTrack } from "@/lib/playTrack";
import { useEffect } from "react";

export default function RoomPage() {
  const { player, deviceId } = usePlayer();
    
  useEffect(() => {
    if(deviceId && player){
        playTrack("spotify:track:11dFghVXANMlKmJXsNCbNl",  deviceId )
    }
    })
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white p-4">
      <h1 className="text-3xl font-bold mb-4">Test du Player Spotify</h1>
      <p>{deviceId ? `Device ID : ${deviceId}` : "Aucun appareil détecté"}</p>
      <p>{player ? "Lecteur Spotify initialisé ✅" : "Initialisation du lecteur..."}</p>
    </div>
  );
}
