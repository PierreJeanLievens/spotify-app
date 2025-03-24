"use client";

import { useState } from "react";
import { playTrack } from "@/lib/playTrack"; // Assure-toi que le chemin est correct

export default function RoomPage() {
  const [trackUri, setTrackUri] = useState(""); // spotify:track:11dFghVXANMlKmJXsNCbNl
  const [deviceId, setDeviceId] = useState(""); // b927002cbad2ecf934547a5c27fdeffa0ba9c90c

  const handlePlay = async () => {
    if (!trackUri || !deviceId) {
      console.error("Track URI et Device ID sont requis");
      return;
    }

    await playTrack(trackUri, deviceId);
  };

  return (
    <div>
      <h1>Test Lecture Spotify</h1>
      <input
        type="text"
        placeholder="Track URI"
        value={trackUri}
        onChange={(e) => setTrackUri(e.target.value)}
        className="border p-2 rounded-md m-2"
      />
      <input
        type="text"
        placeholder="Device ID"
        value={deviceId}
        onChange={(e) => setDeviceId(e.target.value)}
        className="border p-2 rounded-md m-2"
      />
      <button
        onClick={handlePlay}
        className="bg-green-500 text-white p-2 rounded-md"
      >
        Lancer le morceau
      </button>
    </div>
  );
}
