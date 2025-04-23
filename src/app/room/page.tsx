"use client";

import GameRoom from "@/components/game/GameRoom";
import DisplayPlaylists from "@/components/playlist/DisplayPlaylists";

export default function RoomPage() {
  return (
    <div>
      <DisplayPlaylists />
      <GameRoom />
    </div>
  );
}
