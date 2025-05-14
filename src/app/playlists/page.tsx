"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PlaylistList from "@/components/playlist/PlaylistList";
import styles from "./page.module.css";
import { fetchPlaylists } from "@/lib/fetchData";
import Loading from "@/components/ui/Loading";

const PlaylistPage = () => {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [filteredPlaylists, setFilteredPlaylists] = useState<any[]>([]);
  const [inputQuery, setInputQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const getPlaylistsFetched = async () => {
      try {
        setLoading(true);
        const playlistsFetched = await fetchPlaylists();
        if (!playlistsFetched) {
          console.error("Aucune playlist récupérée pour ce client");
          router.push("/login");
          return;
        }
        setPlaylists(playlistsFetched);
        setFilteredPlaylists(playlistsFetched);
      } catch (error) {
        console.error(error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    getPlaylistsFetched();
  }, [router]);

  // 🎯 Filtrage automatique à chaque changement de inputQuery
  useEffect(() => {
    const query = inputQuery.trim().toLowerCase();
    if (!query) {
      setFilteredPlaylists(playlists);
      return;
    }

    const filtered = playlists.filter((p) =>
      p.name?.toLowerCase().includes(query)
    );
    setFilteredPlaylists(filtered);
  }, [inputQuery, playlists]);

  if (loading) {
    return (
      <Loading
        title="Playlists en cours de chargement"
        text="Veuillez attendre..."
        redirection="/login"
      />
    );
  }

  return (
    <div>
      <h1 className="title">Mes Playlists Spotify</h1>
      
      <div className={styles.search_block}>
        <div className="input-block">
          <input
            required
            id="query"
            className="input-text"
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
          />
          <label htmlFor="query" data-label="Recherche" />
          <button 
            className={styles.delete_icon}
            onClick={() => (setInputQuery(''))}>
              <span></span>
              <span></span>
          </button>
        </div>
      </div>
      <PlaylistList playlists={filteredPlaylists} />
    </div>
  );
};

export default PlaylistPage;
