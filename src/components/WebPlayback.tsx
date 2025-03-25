"use client" 
import React, { useEffect, useState } from 'react';

// const WebPlayback = () => {
//   const [token, setToken] = useState<string | null>(null);

//   useEffect(() => {
//     // Récupérer le token depuis l'API
//     const fetchToken = async () => {
//       const response = await fetch('/api/spotify-fetcher/get-spotify-token');
//       if (response.ok) {
//         const data = await response.json();
//         setToken(data.token);
//       } else {
//         console.error("Erreur lors de la récupération du token");
//       }
//     };

//     fetchToken();
//   }, []);

//   useEffect(() => {
//     if (token) {
//       // Initialiser le Web Playback SDK avec le token
//       const script = document.createElement('script');
//       script.src = 'https://sdk.scdn.co/spotify-player.js';
//       script.async = true;
//       document.body.appendChild(script);

//       window.onSpotifyWebPlaybackSDKReady = () => {
//         const player = new window.Spotify.Player({
//           name: 'Web Playback SDK',
//           getOAuthToken: (cb: (token: string) => void) => { cb(token); },
//           volume: 0.5,
//         });

//         player.addListener('ready', ({ device_id }: { device_id: string }) => {
//           console.log('Ready with Device ID', device_id);
//         });

//         player.addListener('not_ready', ({ device_id }: { device_id: string }) => {
//           console.log('Device ID has gone offline', device_id);
//         });

//         player.connect();
//       };
//     }
//   }, [token]);

//   return (
//     <div>
//       {/* Ton UI ici */}
//       <h1>Web Playback</h1>
//     </div>
//   );
// };

// export default WebPlayback;



const WebPlayback = () => {
  const [token, setToken] = useState<string | null>(null);
  const [player, setPlayer] = useState<any | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      const response = await fetch("/api/spotify-fetcher/get-spotify-token");
      if (response.ok) {
        const data = await response.json();
        setToken(data.token.value);
      } else {
        console.error("Erreur lors de la récupération du token");
      }
    };

    fetchToken();
  }, []);

  useEffect(() => {
    if (token) {
        console.log(token)
      const script = document.createElement("script");
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.async = true;
      document.body.appendChild(script);

      window.onSpotifyWebPlaybackSDKReady = () => {
        const player = new window.Spotify.Player({
          name: "Web Playback SDK",
          getOAuthToken: (cb: (token: string) => void) => { cb(token); },
          volume: 0.5,
        });
        console.log(player)
        setPlayer(player);

        player.addListener("ready", ({ device_id }: { device_id: string }) => {
          console.log("Ready with Device ID", device_id);
        });

        player.addListener("player_state_changed", (state: any) => {
          if (!state) return;
          setIsPlaying(!state.paused);
          setCurrentTrack(state.track_window.current_track.name);
        });

        player.connect();
      };
    }
  }, [token]);

  const togglePlay = async () => {
    if (player) {
      const state = await player.getCurrentState();
      if (state) {
        player.togglePlay();
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white p-4">
      <h1 className="text-3xl font-bold mb-4">Web Playback</h1>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center w-full max-w-md">
        {currentTrack ? (
          <h2 className="text-lg mb-2">Lecture en cours : {currentTrack}</h2>
        ) : (
          <h2 className="text-lg mb-2">Aucune lecture en cours</h2>
        )}
        <button
          onClick={togglePlay}
          className="mt-4 bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 rounded"
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
      </div>
    </div>
  );
};

export default WebPlayback;
