"use client";
import { useRoomManager } from "@/hooks/useRoomManager";
import { fetchNewTrack, fetchNumberTracksPlaylist } from "@/lib/fetchData";
import { Track } from "@/types/spotify";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePlayer } from "@/hooks/useWebPlayer";
import { playTrack } from "@/lib/playTrack";
import { setVolume, setVolumeWithDevice } from "@/lib/setVolume";

export default function GameSetupPage() {
  const { isManager } = useRoomManager();
  const [track, setTrack] = useState<Track | null>(null);
  const [playlistId, setPlaylistId] = useState<string>('');
  const router = useRouter();
  const playerData = usePlayer(); // Toujours appeler le hook
  console.log(playerData)
  const filteredPlayerData = isManager ? playerData : { player: null, deviceId: "", isReady: false };

  useEffect(() => {
    console.log("1")
    if (isManager === undefined) return; // Attendre que isManager soit évalué

    const initGame = async () => {
      try {
        const playlistIdStored: string | null = localStorage.getItem("playlist_choosen_id");
        if (!playlistIdStored) {
          router.push("/playlists");
          return;
        }else{
          
        }
        setPlaylistId(playlistIdStored);
        console.log(playlistId)
        // Récupération d'un nouveau morceau
        const newTrack: Track = await fetchNewTrack(playlistId);
        // console.log(newTrack)
        if (newTrack) {
          setTrack(newTrack);
        }
      } catch (error) {
        console.error("Erreur lors de l'initialisation :", error);
      }
    };

    if (isManager) {
      initGame();
    }
  }, [isManager]);

  const handlePlayTrack = async () => {
    filteredPlayerData.player.togglePlay().then(() => {
      console.log('Toggled playback!');
    });
  };
  
  const handleNextTrack = async () => {
    if (!playlistId) {
      console.error("❌ Aucune playlist sélectionnée");
      return;
    }
  
    const newTrack: Track = await fetchNewTrack(playlistId);
    if (newTrack && filteredPlayerData.deviceId) {
      setTrack(newTrack);
      await playTrack(newTrack.uri, filteredPlayerData.deviceId);
    } else {
      console.error("❌ Impossible de jouer la nouvelle piste");
    }
  };
  const handleVolume = async () => {
  
    if (filteredPlayerData.deviceId) {
      await setVolumeWithDevice(10, filteredPlayerData.deviceId);
    } else {
      console.error("❌ Impossible de jouer la nouvelle piste");
    }
  };
  

  return (
    <div>
      <h1>Configuration du jeu</h1>
      {isManager ? (
        <>
          <button onClick={handlePlayTrack}>Lancer le jeu</button>
          <button onClick={handleNextTrack}>NextTrack</button>
          <button onClick={handleVolume}>Volume</button>
          {filteredPlayerData.deviceId && <p>Device ID: {filteredPlayerData.deviceId}</p>}
        </>
       ) : (
        <>
          <p>En attente que l'hôte lance la partie...</p>
        </>
       )}
    </div>
  );
}

// OLD PAGE /game/page.tsx
// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import styles from "@/app/game/page.module.css";
// import stylesResponse from "@/components/ResponseSection.module.css";
// import Loading from "@/components/Loading";
// import { Track } from "@/types/spotify";
// import { fetchNewTrack, fetchPlayerState } from "@/lib/fetchData";
// import pauseTrack from "@/lib/pauseTrack";
// import resumeTrack from "@/lib/resumeTrack";
// import playTrack from "@/lib/playTrack";
// import DevicesChoice from "@/components/DevicesChoice";
// import ButtonLink from "@/components/ButtonLink";
// import ResponseSection from "@/components/ResponseSection";

// const GamePage = () => {
//   const [track, setTrack] = useState<Track | null>(null);
//   const [isPlaying, setIsPlaying] = useState<boolean>(false);
//   const [hasStarted, setHasStarted] = useState<boolean>(false); // Ajout pour gérer "Start"
//   const [isResponseVisible, setIsResponseVisible] = useState<boolean>(false);
//   const router = useRouter();

//   // Récupération de la première musique et arrêt automatique
//   useEffect(() => {
//     const initGame = async () => {
//       try {
//         const newTrack = await fetchNewTrack(router);
//         setTrack(newTrack);
//         const isPlayingFetched = await fetchPlayerState(router);
//         if(isPlayingFetched){
//           await pauseTrack(router);
//         }
//       } catch (error) {
//         console.error("Erreur lors de l'initialisation :", error);
//       }
//     };
//     initGame();
//   }, []);

//   // Mise à jour de `isPlaying`
//   useEffect(() => {
//     const updatePlayerState = async () => {
//       try {
//         const isPlayingFetched = await fetchPlayerState(router);
//         setIsPlaying(isPlayingFetched);
//       } catch (error) {
//         console.error("Erreur lors de la mise à jour de l'état du lecteur :", error);
//       }
//     };
//     updatePlayerState();
//   }, [isPlaying]);

//   // Passer à la chanson suivante
//   const nextTrack = async () => {
//     try {
//       const newTrack = await fetchNewTrack(router);
//       setTrack(newTrack);
//       setHasStarted(false);
//       setIsPlaying(false);
//       setIsResponseVisible(false);
//       const isPlayingFetched = await fetchPlayerState(router);
//         if(isPlayingFetched){
//           await pauseTrack(router);
//         }
//     } catch (error) {
//       console.error("Erreur lors du passage au titre suivant :", error);
//     }
//   };

//   // Gestion du bouton Start/Pause/Reprise
//   const handleStartPauseResume = async () => {
//     const isPlayingFetched = await fetchPlayerState(router);
//     if (!hasStarted && !isPlayingFetched) {
//       await playTrack(track?.uri || "", router);
//       setHasStarted(true);
//       setIsPlaying(true);
//     } else {
//       if (isPlayingFetched) {
//         await pauseTrack(router);
//         setIsResponseVisible(true); // Affiche le modal
//       } else {
//         await resumeTrack(router);
//       }
//       setIsPlaying(!isPlayingFetched);
//     }
//   };

//    // Lancer la musique
//    const handlePlay = async () => {
//     try {
//       if (track) {
//         const isPlayingFetched = await fetchPlayerState(router);
//         await playTrack(track.uri, router); // Met en pause pour éviter de jouer immédiatement
//         setIsPlaying(!isPlayingFetched);
//       }
//     } catch (error) {
//       console.error("Erreur lors du lancement de la lecture :", error);
//     }
//   };

//   const closeModal = () => {
//     setIsResponseVisible(false);
//   };

//   if (!track) {
//     return <Loading title="Recherche du titre" text="En attente du titre" />;
//   }

//   return (
//     <div className={styles.gameContainer}>
//       <h1>Ma playlist</h1>
//       <ButtonLink text="Retour" path="/game-setup" />
//       <button
//         onClick={() => {
//           document.cookie = "spotify_access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
//           router.push("/");
//         }}
//       >
//         Déconnexion
//       </button>

//       <DevicesChoice />

//       <h2>{track.name}</h2>
//       <ResponseSection track={track} isVisible={isResponseVisible} onClose={closeModal} nextTrack={nextTrack}/>

//       {/* Boîte contenant le bouton Start/Pause/Reprise */}
//       <div className={`${styles.full__screen_box} test`}>
//         <button className={`${styles.button__full} button`} onClick={handleStartPauseResume}>
//           {!hasStarted ? "Start" : isPlaying ? "Pause" : "Reprise"}
//         </button>
//       </div>
//       <div
//         className={`${styles.second__part_box}`}
//       >
//         {/* Bouton Relancer placé en dehors de la box */}
//         <button className={`${styles.button__play} ${hasStarted ? "" : styles.hide} button`} onClick={handlePlay}>
//           Relancer
//         </button>

//         {/* Bouton Suivant placé en dehors de la box */}
//         <button className="button" onClick={nextTrack}>
//           Suivant
//         </button>
//       </div>
      
//     </div>
//   );
// };

// export default GamePage;
