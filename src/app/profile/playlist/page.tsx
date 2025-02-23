"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const PlaylistPage = () => {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchPlaylists = async () => {
      const token = localStorage.getItem("spotify_access_token");
      if (!token) {
        router.push("/");
        return;
      }

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

  // Fonction pour lancer un morceau
  const playTrack = async (trackUri: string) => {
    const token = localStorage.getItem("spotify_access_token");

    if (!token) {
      alert("Pas de token d'authentification !");
      return;
    }

    try {
      const response = await fetch("https://api.spotify.com/v1/me/player/play", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uris: [trackUri] }),
      });

      if (!response.ok) {
        throw new Error("Impossible de lancer la lecture");
      }

      console.log("Lecture lancée !");
    } catch (error) {
      console.error("Erreur :", error);
    }
  };

  if (!playlists.length) {
    return <p>Chargement des playlists...</p>;
  }

  return (
    <div>
      <h1>Mes Playlists Spotify</h1>
      <button
        onClick={() => {
          localStorage.removeItem("spotify_access_token");
          router.push("/");
        }}
      >
        Déconnexion
      </button>

      <ul>
        {playlists.map((playlist) => (
          <li key={playlist.id}>
            <h3>{playlist.name}</h3>
            <a href={playlist.external_urls.spotify} target="_blank" rel="noopener noreferrer">
              {playlist.images?.length > 0 ? (
                <img src={playlist.images[0].url} alt={playlist.name} width="100" />
              ) : (
                <div style={{ width: "100px", height: "100px", background: "#ddd", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <p>Pas d'image</p>
                </div>
              )}
            </a>

            {/* Bouton pour lire le premier morceau de la playlist */}
            <button
              onClick={() => {
                if (playlist.tracks?.href) {
                  fetch(playlist.tracks.href, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("spotify_access_token")}` },
                  })
                    .then((res) => res.json())
                    .then((data) => {
                      if (data.items?.length > 0) {
                        playTrack(data.items[0].track.uri);
                      } else {
                        alert("Aucun morceau trouvé dans la playlist");
                      }
                    })
                    .catch((error) => console.error("Erreur récupération morceaux", error));
                }
              }}
            >
              ▶ Jouer le premier morceau
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlaylistPage;
