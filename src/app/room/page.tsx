"use client";

import GameRoom from "@/components/GameRoom";
import DisplayPlaylists from "@/components/DisplayPlaylists";

export default function RoomPage() {
  return (
    <div>
      <DisplayPlaylists />
      <GameRoom />
    </div>
  );
}
