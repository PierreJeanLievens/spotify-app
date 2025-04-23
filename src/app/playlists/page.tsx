"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PlaylistList from "@/components/playlist/PlaylistList";
import styles from "@/app/playlist/page.module.css";
import LogoutButton from "@/components/auth/LogoutButton";
import { fetchPlaylists } from "@/lib/fetchData";
import Loading from "@/components/ui/Loading";

const PlaylistPage = () => {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const getPlaylistsFetched = async () => {
      try {
        const playlistsFetched = await fetchPlaylists();
        if(!playlistsFetched){
          console.error("Aucune playlist récupérée pour ce client");
          router.push("/login");
          return;
        }
        setPlaylists(playlistsFetched);
      } catch (error) {
        console.error(error);
        router.push("/login");
      }
    };

    getPlaylistsFetched();
  }, [router]);

  if (!playlists) {
    <Loading title="Playlists en cours de chargement" text="Veuillez attendre..." redirection="/login"/>
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
