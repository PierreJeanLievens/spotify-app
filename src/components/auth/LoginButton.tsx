"use client";

import React from "react";

const LoginButton: React.FC = () => {
  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  const redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI;
  const scope = "user-read-private user-read-email user-library-read playlist-read-private playlist-read-collaborative user-modify-playback-state streaming app-remote-control user-read-playback-state";

  if (!clientId || !redirectUri) {
    console.error("🔴 ERREUR: CLIENT_ID ou REDIRECT_URI manquant !");
    return <p>Erreur de configuration. Vérifiez `.env.local`.</p>;
  }

  const handleLogin = () => {
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;
    window.location.href = authUrl;
  };

  return (
    <button onClick={handleLogin} className="button">
      Se connecter avec Spotify
        <span className="button__icon">
          <img src="/spotify-logo.png" alt='logo Spotify'/>
        </span>
    </button>
  );
};

export default LoginButton;
