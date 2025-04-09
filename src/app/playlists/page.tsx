"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PlaylistList from "@/components/PlaylistList";
import styles from "@/app/playlist/page.module.css";
import LogoutButton from "@/components/LogoutButton";
import { fetchPlaylists } from "@/lib/fetchData";
import Loading from "@/components/Loading";

const PlaylistPage = () => {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const getPlaylistsFetched = async () => {
      try {
        const playlistFetched = await fetchPlaylists();
        setPlaylists(playlistFetched);
      } catch (error) {
        console.error(error);
        // router.push("/");
      }
    };

    getPlaylistsFetched();
  }, [router]);

  if (!playlists) {
    <Loading title="Playlists en cours de chargement" text="Veuillez attendre..."/>
  }

  return (
    <div>
      <h1>Mes Playlists Spotify</h1>
      <LogoutButton />
      <div className={`${styles.container} playlists`}>
        <div>
          <h1>Mes playlists</h1>
          <PlaylistList playlists={playlists} />
        </div>
        <div>
          <div className="separator"></div>
        </div>
        <div>
          <h1>Playlist publiques</h1>
          <PlaylistList playlists={playlists} />
        </div>
      </div>
    </div>
  );
};

export default PlaylistPage;
