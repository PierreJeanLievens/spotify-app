"use client";

import { useState } from "react";
import { playTrack } from "@/lib/playTrack"; // Assure-toi que le chemin est correct
import { playAlbum } from "@/lib/playAlbum"; 

export default function RoomPage() {
  const [trackUri, setTrackUri] = useState(""); // spotify:track:11dFghVXANMlKmJXsNCbNl //spotify:album:2up3OPMp9Tb4dAKM2erWXQ
  const [deviceId, setDeviceId] = useState(""); // b927002cbad2ecf934547a5c27fdeffa0ba9c90c PC 9becdddadeae1ee3f57f82a8637b80016a1f5384 Tel

  const handlePlay = async () => {
    if (!trackUri || !deviceId) {
      console.error("Track URI et Device ID sont requis");
      return;
    }

    // await playTrack(trackUri, deviceId);
    await playAlbum(trackUri, deviceId);
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
