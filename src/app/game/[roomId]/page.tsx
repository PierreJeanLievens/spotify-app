"use client";
import { useRoomManager } from "@/hooks/useRoomManager";
import { fetchNewTrack, fetchNumberTracksPlaylist } from "@/lib/fetchData";
import { Player, Track } from "@/types/spotify";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { setVolume, setVolumeWithDevice } from "@/lib/setVolume";
import { playTrack } from "@/lib/playTrack";
import { verifiyInputs } from "@/lib/verifiyResponses/verifyInputs";
import DisplayScore from "@/components/DisplayScore";
import VolumeControl from "@/components/VolumeControl";


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
  const [volume, setVolume] = useState<number>(0); // Permet de savoir le round en cours
  const [secondsLeft, setSecondsLeft] = useState<number>(15); // Stocke les secondes restantes
  const [inputTrack, setInputTrack] = useState<string>(''); // Stocke l'input du titre
  const [inputArtist, setInputArtist] = useState<string>(''); // Stocke l'input de l'artiste
  const [clientId, setClientId] = useState<string>(''); // Stocke l'id du client
  const [clientName, setClientName] = useState<string>(''); // Stocke le nom du client
  const [displayScore, setDisplayScore] = useState<boolean>(false); // Stocke l'etat de l'affichage des points
  const router = useRouter();


  const trackRef = useRef(track);
  const inputArtistRef = useRef(inputArtist);
  const inputTrackRef = useRef(inputTrack);
  const roundRef = useRef(round);
  const channelRef = useRef(channel);
  const clientIdRef = useRef(clientId);
  const clientNameRef = useRef(clientName);

  // Maintenir les références à jour
  useEffect(() => { trackRef.current = track; }, [track]);
  useEffect(() => { inputArtistRef.current = inputArtist; }, [inputArtist]);
  useEffect(() => { inputTrackRef.current = inputTrack; }, [inputTrack]);
  useEffect(() => { roundRef.current = round; }, [round]);
  useEffect(() => { channelRef.current = channel; }, [channel]);
  useEffect(() => { clientIdRef.current = clientId; }, [clientId]);
  useEffect(() => { clientNameRef.current = clientName; }, [clientName]);


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
const handleStateResponses = useCallback(async (message: any) => {
  if (message.data.acceptResponse) {
    setAcceptResponse(true);
    setPaused(false);
  } else {
    setAcceptResponse(false);
    setPaused(true);

    if (message.data.endRound) {
      // Use a ref to track if we've already processed this round
      const currentRound = roundRef.current;
      
      let processedRounds = JSON.parse(sessionStorage.getItem("processedRounds") || "[]") || [];

      // Vérifier si le round actuel a déjà été traité
      if (processedRounds.includes(currentRound)) {
        console.log(`Round ${currentRound} déjà traité dans cette session. Ignorer.`);
        return;
      }

      // Ajouter le round actuel au tableau des rounds traités
      processedRounds.push(currentRound);

      // Enregistrer le tableau mis à jour dans sessionStorage
      sessionStorage.setItem("processedRounds", JSON.stringify(processedRounds));
      
      // Get current track using ref for up-to-date value
      const currentTrack = trackRef.current;
      if (!currentTrack) return null;

      const resultsRound = verifiyInputs(
        currentTrack.artists,
        inputArtistRef.current,
        currentTrack.name, 
        inputTrackRef.current
      );
      console.log("SCORE", resultsRound);

      let playerScore: Player | null = JSON.parse(sessionStorage.getItem("playerScore") || "null");

      if (!playerScore) {
        playerScore = {
          clientId : clientIdRef.current,
          name: clientNameRef.current,
          rounds: [],
        };
      }
      
      // Check if this round already exists in player score
      const roundExists = playerScore.rounds.some((r) => r.number === currentRound);
      if (roundExists) {
        console.log(`Round ${currentRound} already exists in player score. No addition.`);
        return;
      }

      const newRound = {
        number: currentRound,
        artistPoints: resultsRound.artistPoints,
        trackPoints: resultsRound.trackPoints,
        bonus: resultsRound.bonus,
      };

      playerScore.rounds.push(newRound);

      sessionStorage.setItem("playerScore", JSON.stringify(playerScore));
      
      // Check if channel exists before publishing
      if (channelRef.current) {
        await channelRef.current.publish("player-score", { playerScore: playerScore });
        console.log("SCORE SENT");
      } else {
        console.error("Cannot publish score: channel is null");
      }
    }
  }
}, []);



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
    if (!ably || !roomId) return;

    const roomChannel = ably.channels.get(`blindtest:${roomId}`);
    setChannel(roomChannel);

    const checkChannelValidity = async () => {
      try {
        const history = await roomChannel.history();

        if (history.items.length === 0) {
          console.log("Le channel est invalide ou vide, redirection vers le menu...");
          router.push("/login");
          return;
        }
        // Puis on s'abonne une seule fois
        roomChannel.subscribe("accept-response", handleStateResponses);
        roomChannel.subscribe("seconds-left", handleSecondsLeft);
        roomChannel.subscribe("new-round", receiptNewRound);

      } catch (error) {
        console.error("Erreur lors de la récupération de l'historique :", error);
        router.push("/login");
      }
    };

    checkChannelValidity();

    // Cleanup pour éviter les abonnements en double
    return () => {
      roomChannel.unsubscribe("accept-response", handleStateResponses);
      roomChannel.unsubscribe("seconds-left", handleSecondsLeft);
      roomChannel.unsubscribe("new-round", receiptNewRound);
    };
  }, [ably, roomId, router, handleStateResponses, handleSecondsLeft, receiptNewRound]);

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
        // // Récupération d'un nouveau morceau
        // const newTrack: Track = await fetchNewTrack(playlistIdStored);
        // // console.log(newTrack)
        // if (newTrack) {
        //   setTrack(newTrack);
        // }

        webPlayer.player.getVolume().then((volume: number)  => {
          let volume_percentage = volume * 100;
          setVolume(volume_percentage);
          console.log(`The volume of the player is ${volume_percentage}%`);
        });
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


  // Permet de retourner à l'accueil si le client n'a ni nom ni id
  useEffect(() => {
    const newClientId = sessionStorage.getItem("clientId");
    const newClientName = sessionStorage.getItem("clientName");
    if (!newClientId || !newClientName) {
      router.push("/login"); // Redirection vers la page d'accueil
      return;
    }
    // Ne met à jour le state que si la valeur change réellement
    setClientId(prev => (prev !== newClientId ? newClientId : prev));
    setClientName(prev => (prev !== newClientName ? newClientName : prev));
  }, [router]);

  // Fonction pour lancer ou mettre en pause le player
  const handlePlayTrack = async () => {
    
    if(webPlayer.player && track){
      if(firstStart){
        // playTrack(track.uri, webPlayer.deviceId);
        // console.log('First Start!');
        // setFirstStart(false);
        // // Reset le timer
        // startTimer();
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
      setFirstStart(false);
      const newRound: number = round + 1;
      channel.publish("game-start", {gameStart : true});
      channel.publish("new-round", {currentRound: newRound, currentTrack : newTrack})
      // Reset le timer
      startTimer();
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
        <><button className="button" onClick={()=> {router.push("/login");}}>Retour</button></>
      )}
      
      {(webPlayer.player && isManager) ? (
        <>
          {(firstStart) ? (
            <></>) : (
            <button className='button' onClick={handlePlayTrack}>{is_paused || firstStart ? "PLAY" : "PAUSE"}</button>
          )}
          <button className='button' onClick={handleNextTrack}>{firstStart ? "Play" : "NextTrack"}</button>
          {/* <button className='button' onClick={handleVolume}>Volume</button> */}
          <VolumeControl player={webPlayer.player} />
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
            <>Attends le prochain morceau</>
          )}
       </div>

       <div>
        <button className='button' onClick={()=> {setDisplayScore(!displayScore)}}>{displayScore ? "Cacher les scores" : "Afficher les scores"}</button>
        {(displayScore) ? (<DisplayScore/>) : (<></>)}
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
