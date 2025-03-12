"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PlaylistList from "@/components/PlaylistList";
import styles from "@/app/playlist/page.module.css"
import { checkToken } from "@/lib/checkToken";

const PlaylistPage = () => {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchPlaylists = async () => {
    const token = await checkToken(router);

      try {
        const response = await fetch("https://api.spotify.com/v1/me/playlists", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error("Échec de récupération des playlists");
        }

        const data = await response.json();
        setPlaylists(data.items || []);
      } catch (error) {
        console.error(error);
        router.push("/");
      }
    };

    fetchPlaylists();
  }, [router]);

  console.log(playlists)
  if (!playlists.length) {
    return <p>Chargement des playlists...</p>;
  }

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
      <div className={`${styles.container} playlists`} >
        <div>
          <h1>Mes playlists</h1>
         <PlaylistList playlists={playlists} />
        </div>
          <div>
            <div className="separator">
          </div>
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
