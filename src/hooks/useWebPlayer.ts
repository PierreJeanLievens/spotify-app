"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export function useWebPlayer() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [player, setPlayer] = useState<any | null>(null);
  const [deviceId, setDeviceId] = useState<string>("");

  // Récupérer le token Spotify
  useEffect(() => {
    const fetchToken = async () => {
      const response = await fetch("/api/spotify-fetcher/get-spotify-token");
      if (response.ok) {
        const data = await response.json();
        setToken(data.token.value);
      } else {
        console.error("Erreur lors de la récupération du token");
        router.push("/login");
      }
    };

    fetchToken();
  }, []);

  // Initialiser le lecteur Spotify
  useEffect(() => {
    if (token) {
      const script = document.createElement("script");
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.async = true;
      document.body.appendChild(script);

      window.onSpotifyWebPlaybackSDKReady = () => {
        const newPlayer = new window.Spotify.Player({
          name: "Web Playback SDK",
          getOAuthToken: (cb: (token: string) => void) => cb(token),
        });

        newPlayer.addListener("ready", ({ device_id }: { device_id: string }) => {
          console.log("Spotify Player Ready - Device ID:", device_id);
          setDeviceId(device_id);
        });

        newPlayer.connect();
        setPlayer(newPlayer);
      };
    }
  }, [token]);

  // Déconnexion du lecteur lors de la fermeture de l'onglet
  useEffect(() => {
    const handleUnload = () => {
      if (player) {
        console.log("Déconnexion du Spotify Player...");
        player.disconnect();
      }
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [player]);

  return { player, deviceId };
}
