"use client";
import { useRoomManager } from "@/hooks/useRoomManager";
import { fetchNewTrack, fetchNumberTracksPlaylist } from "@/lib/fetchData";
import { Track } from "@/types/spotify";
import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { setVolume, setVolumeWithDevice } from "@/lib/setVolume";
import { playTrack } from "@/lib/playTrack";
import { verifiyInputs } from "@/lib/verifiyResponses/verifyInputs";


export default function GameSetupPage() {
  const { roomId } = useParams();
  const [playlistId, setPlaylistId] = useState<string>(''); // Id de la playlist selectionnée
  const { isManager,  webPlayer, ably} = useRoomManager(); // Pemret de savoir si le client est manager de la room, de recuperer le webPlayer (vide si non manager), et le client alby
  const [channel, setChannel] = useState<any | null >(null); // Stocke le channel de la room 
  const [track, setTrack] = useState<Track | null>(null); // Stocke le track en cours
  const [is_paused, setPaused] = useState<boolean>(true); // Stocke l'etat du player (si true, le morceau est sur pause)
  const [firstStart, setFirstStart] = useState<boolean>(true);// Si premier start alors on lance avec API, sinon on effectue le toogle avec la fonction du WebPlayer
  const [acceptResponse, setAcceptResponse] = useState<boolean>(false); // Permet de savoir s'il faut afficher les inputs pour répondre
  const [round, setRound] = useState<number>(0); // Permet de savoir le round en cours
  const [secondsLeft, setSecondsLeft] = useState<number>(15); // Stocke les secondes restantes
  const [inputTrack, setInputTrack] = useState<string>(''); // Stocke l'input du titre
  const [inputArtist, setInputArtist] = useState<string>(''); // Stocke l'input de l'artiste
  const router = useRouter();

  // Permet d'arreter les reponses si le timer est a 0
  // useEffect(() => {
  //   if(!channel) return;
  //   // Atendre une seconde puis mettre secondsLeft - 1
  //   if(secondsLeft === 0 && isManager) {
  //     channel.publish("accept-response", {acceptResponse : false});
  //   }
  // }, [secondsLeft])


  const startTimer = () => {
    setSecondsLeft(15); // Réinitialise à 15 secondes
    channel.publish("seconds-left", { secondsLeft: 15 }); // Envoie la valeur initiale immédiatement
    channel.publish("accept-response", { acceptResponse: true }); // Réactive les réponses
  
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        const newSecondsLeft = prev - 1;
        channel.publish("seconds-left", { secondsLeft: newSecondsLeft }); // Publie chaque mise à jour
  
        if (newSecondsLeft <= 0) {
          clearInterval(timer); // Arrête le timer
          channel.publish("accept-response", { acceptResponse: false, endRound : true}); // Bloque les réponses et termine le round (endRound sert a enclenché la foncton de calcul de points)
          return 0;
        }
  
        return newSecondsLeft;
      });
    }, 1000);
  };
  

/**
 * Function qui ecoute le channel 'accept-response'
 * Utilisation du callback pour réactualiser la fonction lorsque les données change
 * Sans callback, lorsque la fonction est utlisée dans channel.subscribe, les données utilisées sont figées, lors de la première execution track est null
 * Avec le callback, on met à jour la fonction avec les nouvelles données lorsque (track et les inputs changent) 
 */
const handleStateResponses = useCallback((message: any) => {
  // Si on accepte les réponses (cela veut dire nouveau round)
  console.log("HANDLE RESPONSE")
  if (message.data.acceptResponse) {
    setAcceptResponse(true);
    setPaused(false);
    // Reset timer
  }else {
    console.log("FALSE AFFICHAGE")
    setAcceptResponse(false);
    setPaused(true);
    if(message.data.endRound && track){
      console.log("TRACK", track)  
      const points = verifiyInputs(track?.artists, inputArtist, track?.name, inputTrack);
      console.log("SCORE", points)
    }
  }
}, [track, inputArtist, inputTrack]);


/**
 * Fonction qui ecoute le channel 'seconds-left'
 * Utilisation du callback pour réactualiser la fonction lorsque les données change
 * Sans callback, lorsque la fonction est utlisée dans channel.subscribe, les données utilisées sont figées, lors de la première execution track est null
 * Avec le callback, on met à jour la fonction avec les nouvelles données lorsque (track et les inputs changent) 
 */
const handleSecondsLeft = useCallback((message: any) => {
  if(!isManager){
    setSecondsLeft(message.data.secondsLeft);
  }
}, [isManager]);


/**
 * Fonction qui gère la gestion d'un nouveau round, recupère le nouveau track et le numéro de round
 * Utilisation du callback pour réactualiser la fonction lorsque les données change
 * Sans callback, lorsque la fonction est utlisée dans channel.subscribe, les données utilisées sont figées,
 * Avec le callback, on met à jour la fonction avec les nouvelles données
 */
const receiptNewRound = useCallback((message: any) => {
  console.log("Reception new track : " , message.data)
  const data = message.data;
  // On stocke le nouveau track et le nouveau round
  console.log(data.currentTrack)
  setTrack(data.currentTrack);
  setRound(data.currentRound);

  // On reset les inputs
  setInputArtist("");
  setInputTrack("");
}, []);


useEffect(() => {
  if(!ably || !roomId) return;
  
  try {
    const roomChannel = ably.channels.get(`blindtest:${roomId}`);
    setChannel(roomChannel);
    
    // Subscribe to channels
    roomChannel.subscribe("accept-response", handleStateResponses);
    roomChannel.subscribe("seconds-left", handleSecondsLeft);
    roomChannel.subscribe("new-round", receiptNewRound);
    
    // Clean up subscriptions
    return () => {
      roomChannel.unsubscribe("accept-response", handleStateResponses);
      roomChannel.unsubscribe("seconds-left", handleSecondsLeft);
      roomChannel.unsubscribe("new-round", receiptNewRound);
    };
  } catch (error) {
    console.error("Erreur lors de l'initialisation de ably :", error);
  }
  }, [ably, roomId, handleStateResponses, handleSecondsLeft, receiptNewRound])

  // Cela permet de récupérer le webPlayer
  useEffect(() => {
    console.log("isManager:", isManager, "webPlayer:", webPlayer);
    if (!isManager || !webPlayer.player || !channel) return;// Attendre que isManager et le webPlayer soientt bien récupérés

    const initGame = async () => {
      try {
        const playlistIdStored: string | null = localStorage.getItem("playlist_choosen_id");
        if (!playlistIdStored) {
          router.push("/playlists");
          return;
        }
        // On récupère la playlistChoisie
        setPlaylistId(playlistIdStored);
        // Récupération d'un nouveau morceau
        const newTrack: Track = await fetchNewTrack(playlistIdStored);
        // console.log(newTrack)
        if (newTrack) {
          setTrack(newTrack);
        }

        // On se met en ecoute sur le webPlayer (lorsque son état change (play/pause))
        webPlayer.player.addListener('player_state_changed', ( (state: { paused: any; }) => {
          if (!state) {
              return;
          }
          // On récupère l'état actuel du player
          setPaused(state.paused);
          // Si le player est pause, on envoie cela a tous les clients, cela permet d'actualiser cet état a tous les clients
          if(state.paused){
            channel.publish("accept-response", {acceptResponse : false});
          }else{
            channel.publish("accept-response", {acceptResponse : true});
          }
      }));

      } catch (error) {
        console.error("Erreur lors de l'initialisation :", error);
      }
    };

    if (isManager) {
      initGame();
    }
  }, [isManager, webPlayer.player, channel]);  


  // Fonction pour lancer ou mettre en pause le player
  const handlePlayTrack = async () => {
    
    if(webPlayer.player && track){
      if(firstStart){
        playTrack(track.uri, webPlayer.deviceId);
        console.log('First Start!');
        setFirstStart(false);
        // Reset le timer
        console.log("TIMER START PLAY", track)
        startTimer();
      }else{
        webPlayer.player.togglePlay().then(() => {
        console.log('Toggled playback!');
        // setPaused(!is_paused)
        });
      }
    }
  };
  
  // Fonction pour gérer le changement de track
  const handleNextTrack = async () => {
    if (!playlistId) {
      console.error("❌ Aucune playlist sélectionnée");
      return;
    }
    if(!isManager) return;
  
    const newTrack: Track = await fetchNewTrack(playlistId);
    if (newTrack && webPlayer.deviceId) {
      setTrack(newTrack);
      await playTrack(newTrack.uri, webPlayer.deviceId);
      const newRound: number = round + 1;
      channel.publish("new-round", {currentRound: newRound, currentTrack : newTrack})
      // Reset le timer
      startTimer();
    } else {
      console.error("❌ Impossible de jouer la nouvelle piste");
    }
  };

  // Fonction pour géger le volume du device
  const handleVolume = async () => {
  
    if (webPlayer.deviceId) {
      await setVolumeWithDevice(10, webPlayer.deviceId);
    } else {
      console.error("❌ Impossible de jouer la nouvelle piste");
    }
  };
  

  return (
    <div>
      <h1>Configuration du jeu</h1>
      <div> Secondes restantes : {secondsLeft}</div>
      {(isManager) ? (
        <><button className="button" onClick={()=> {router.push("/game-setup");}}>Retour</button></>
      ) : (
        <><button className="button" onClick={()=> {router.push("/join-room");}}>Retour</button></>
      )}
      
      {(webPlayer.player && isManager) ? (
        <>
          <button className='button' onClick={handlePlayTrack}>Lancer le jeu{is_paused || firstStart ? "PLAY" : "PAUSE"}</button>
          <button className='button' onClick={handleNextTrack}>NextTrack</button>
          <button className='button' onClick={handleVolume}>Volume</button>
          <button className='button' onClick={() => {channel.publish("accept-response", {acceptResponse : true});}}>Test publish</button>
          {webPlayer.deviceId && <p>Device ID: {webPlayer.deviceId}</p>}
          
        </>
       ) : (
        <>
          <p>En attente que l'hôte lance la partie...</p>
          <button disabled={true}>{is_paused ? "Titre en pause" : "Titre en cours"}</button>
        </>
       )}

       <div>
          {(acceptResponse) ? (
            <>Entrez les reponses
              <input id="track" type="text" placeholder="Titre" onChange={(e) => {setInputTrack(e.target.value)}}/>
              <input id="artist" type="text" placeholder="Artiste" onChange={(e) => {setInputArtist(e.target.value)}}/>
            </>
          ) : (
            <>Reponses terminées</>
          )}
       </div>
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
