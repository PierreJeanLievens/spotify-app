"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PlaylistList from "@/components/playlist/PlaylistList";
import styles from "./page.module.css";
import { fetchPlaylists, fetchSearchPlaylists } from "@/lib/fetchData";
import Loading from "@/components/ui/Loading";

const SearchPlaylistPage = () => {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [inputQuery, setInputQuery] =useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/me")
      .then(res => res.json())
      .then(data => setIsAuthenticated(data.isAuthenticated));
  }, []);

  useEffect(() =>  {
    if(isAuthenticated===false){
      router.push("/");
    }
  }, [isAuthenticated])



  const searchPlaylist = async () => {
    if (!inputQuery) return;
    setLoading(true);
    try {
      const playlistsSearchedFetched = await fetchSearchPlaylists(inputQuery);
      if (!playlistsSearchedFetched) {
        console.error("Aucune playlist récupérée pour cette recherche");
        router.push("/login");
        return;
      }
      setPlaylists(playlistsSearchedFetched);
      console.log(playlistsSearchedFetched);
    } catch (error) {
      console.error(error);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  if (inputQuery && !playlists) {
    <Loading title="Récupération des playlists en cours" text="Veuillez attendre..." redirection="/login"/>
  }

  return (
    <div>
      <h1 className="title">Rechercher Playlist Publiques</h1>
      
      <div className={styles.search_block}>
        <div className="input-block">
        <input 
              required
              id="query"
              className="input-text" 
              type="text" 
              value={inputQuery ?? ""}
              onChange={(e) => {
                const value = e.target.value;
                setInputQuery(value === "" ? null : value);
              }}
              />
            <label htmlFor="track" data-label="Recherche"/>
        </div>
        <button 
          className={`button ${styles.search_button}`}
          onClick={searchPlaylist}>
          Rechercher
        </button>
      </div>
      <PlaylistList playlists={playlists} />
    </div>
  );
};

export default SearchPlaylistPage;
