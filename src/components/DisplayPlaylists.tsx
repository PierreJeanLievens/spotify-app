"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PlaylistList from "@/components/PlaylistList";
import styles from "@/app/playlist/page.module.css";
import Loading from "@/components/Loading";
import LogoutButton from "./LogoutButton";

export default function PlaylistPage(){

  const [playlists, setPlaylists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await fetch("/api/spotify-fetcher/get-playlists");

        if (!response.ok) {
          throw new Error("Échec de récupération des playlists");
        }

        const data = await response.json();
        setPlaylists(data.items || []);
      } catch (error) {
        console.error(error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, [router]);

  if (loading) {
    return <Loading title="Récupération des playlists" text="En attente de la récupération de vos playlists" />;
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
}
