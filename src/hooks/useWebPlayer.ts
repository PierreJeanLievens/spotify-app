"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export function useWebPlayer() {
  const router = useRouter();
  const pathname = usePathname(); // Récupère la page actuelle
  const [token, setToken] = useState<string | null>(null);
  const [player, setPlayer] = useState<any | null>(null);
  const [deviceId, setDeviceId] = useState<string>("");
  const [isTokenValid, setIsTokenValid] = useState<boolean>(true);

  // Vérification du token toutes les X minutes
  useEffect(() => {
    const checkTokenValidity = async () => {
      const response = await fetch("/api/spotify-fetcher/get-spotify-token");

      if (!response.ok) {
        console.warn("Token Spotify expiré, déconnexion...");
        setIsTokenValid(false);
        return;
      }

      const data = await response.json();
      setToken(data.token.value);
    };

    checkTokenValidity();

    // Vérification toutes les 10 minutes
    const interval = setInterval(checkTokenValidity, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // Déconnexion automatique si le token expire ou si l'utilisateur change de page
  useEffect(() => {
    const disconnectPlayer = () => {
      if (player) {
        console.log("Déconnexion du lecteur Spotify...");
        player.disconnect();
        setPlayer(null);
      }
    };

    if (!isTokenValid) {
      disconnectPlayer();
      router.push("/login"); // Redirection vers login si token expiré
    }

    // Déconnexion si la page change
    return () => {
      console.log("Changement de page détecté, déconnexion du lecteur...");
      disconnectPlayer();
    };
  }, [isTokenValid, pathname]); // 📌 `pathname` détecte le changement de page

  // Initialisation du lecteur Spotify
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
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [player]);

  return { player, deviceId };
}
