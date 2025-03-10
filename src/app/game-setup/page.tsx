"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import GameSetupPlaylist from "@/components/GameSetupPlaylist"
import GameSetupPlayers from "@/components/GameSetupPlayers"
import styles from "@/app/game-setup/page.module.css"
import Loading from "@/components/Loading";

const GameSetupPage = () => {
  const [playlist, setPlaylist] = useState<any>();
  const router = useRouter();

  useEffect(() => {
    const fetchPlaylist = async () => {
      const token = localStorage.getItem("spotify_access_token");
      if (!token) {
        router.push("/");
        return;
      }

      try {
        const playlistId = localStorage.getItem("playlist_choosen_id");
        if (!playlistId) {
            router.push("/playlist");
            return;
          }

        const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}?fields=collaborative%2Cdescription%2Cexternal_urls%2Chref%2Cid%2Cimages%2Cname%2Cowner%28display_name`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error("Échec de récupération de la playlist");
        }

        const data = await response.json();
        setPlaylist(data || null);
      } catch (error) {
        console.error(error);
        router.push("/");
      }
    };

    fetchPlaylist();
  }, [router]);

  if (!playlist) {
    return <Loading text="test"/>;
  }
  console.log(playlist);

  return (
    <div className="">
      <h1>Mes Playlists Spotify</h1>
      <button
        onClick={() => {
          localStorage.removeItem("spotify_access_token");
          router.push("/");
        }}
      >
        Déconnexion
      </button>
      <div>
          <h1></h1>
          <div className={`${styles.container}`}>
            <GameSetupPlaylist playlist={playlist} />
            <div className="separator"></div>
            <GameSetupPlayers />
          </div>

          <button 
            className={`${styles.play__button} button`}
          >Jouer</button>
          
      </div>
    </div>
  );
};

export default GameSetupPage;
