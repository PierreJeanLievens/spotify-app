"use client";
import { useRoomManager } from "@/hooks/useRoomManager";
import { fetchNewTrack, fetchNumberTracksPlaylist } from "@/lib/fetchData";
import { Player, Track } from "@/types/spotify";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { playTrack } from "@/lib/managePlayer/playTrack";
import { verifiyInputs } from "@/lib/verifiyResponses/verifyInputs";
import DisplayScore from "@/components/score/DisplayScore";
import VolumeControl from "@/components/playback/VolumeControl";
import ModalResponse from "@/components/response/ModalResponse";
import styles from "./page.module.css"
import { getScorePlayersFromHistory } from "@/lib/getScorePlayers";



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
  const [roundDuration, setRoundDuration] = useState<number | null>(15); // Nombre de secondes pour une manche, par default à 15 secondes
  const [secondsLeft, setSecondsLeft] = useState<number>(15); // Stocke les secondes restantes
  const timerRef = useRef<NodeJS.Timeout | null>(null); // Stocke les secondes restantes
  const [inputTrack, setInputTrack] = useState<string>(''); // Stocke l'input du titre
  const [inputArtist, setInputArtist] = useState<string>(''); // Stocke l'input de l'artiste
  const [clientId, setClientId] = useState<string>(''); // Stocke l'id du client
  const [clientName, setClientName] = useState<string>(''); // Stocke le nom du client
  const [displayScore, setDisplayScore] = useState<boolean>(false); // Stocke l'etat de l'affichage des points
  const [displayResponse, setDisplayResponse] = useState<boolean>(false); // Stocke l'etat de l'affichage des points

  const [scoreboard, setScoreboard] = useState<any>(); // Stocke le scoreboard reçu dans le channel 'scoreboard' 
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


  /**
   * Lorsque l'on veut demarrer un round, on envoie un message pour reset le timer et pour accepter les réponses
   */
  const startRound = () => {
    console.log("FONCTION START ROUND")
    channel.publish("start-timer", { duration: roundDuration }); // Envoie la valeur initiale immédiatement
    channel.publish("accept-response", { acceptResponse: true, test: 3}); // Réactive les réponses
  };
  

/**
 * Function qui ecoute le channel 'accept-response'
 * Utilisation du callback pour réactualiser la fonction lorsque les données change
 * Sans callback, lorsque la fonction est utlisée dans channel.subscribe, les données utilisées sont figées, lors de la première execution track est null
 * Avec le callback, on met à jour la fonction avec les nouvelles données lorsque (track et les inputs changent) 
 */
const handleStateResponses = useCallback(async (message: any) => {
  console.log("RECEPTION HANDLE STATE RESPOSNES")
  if (message.data.acceptResponse) {
    setAcceptResponse(true);
    setPaused(false);
    setDisplayResponse(false);
    setDisplayScore(false);
  } else {
    setAcceptResponse(false);
    setPaused(true);

    if (message.data.endRound) {
      setDisplayResponse(true);
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
      
      // On récupère le track actuel avec le pointer
      const currentTrack = trackRef.current;
      if (!currentTrack) return null;

      // Cela calcule les points du round
      const resultsRound = verifiyInputs(
        currentTrack.artists,
        inputArtistRef.current,
        currentTrack.name, 
        inputTrackRef.current
      );
      console.log("SCORE : ", resultsRound);

      // On récupère les scores du client enregistrés dans sessionStorage
      let playerScore: Player | null = JSON.parse(sessionStorage.getItem("playerScore") || "null");

      // Si l'objet est vide (pas encore de score), on crée l'objet nécessaire
      if (!playerScore) {
        playerScore = {
          clientId : clientIdRef.current,
          name: clientNameRef.current,
          rounds: [],
        };
      }

      // On crée le round actuel
      const newRound = {
        number: currentRound,
        artistPoints: resultsRound.artistPoints,
        trackPoints: resultsRound.trackPoints,
        bonus: resultsRound.bonus,
      };

      // On l'ajoute aux score du joueurs
      playerScore.rounds.push(newRound);

      // On enregistre les scores en local
      sessionStorage.setItem("playerScore", JSON.stringify(playerScore));
    }
  }
}, []);


/**
 * Fonction pour lancer le timer en local lors de la reception d'un message 'start-timer'
 * Utilisation du callback pour réactualiser la fonction lorsque les données change
 * Sans callback, lorsque la fonction est utlisée dans channel.subscribe, les données utilisées sont figées, lors de la première execution track est null
 * Avec le callback, on met à jour la fonction avec les nouvelles données lorsque (track et les inputs changent) 
 */
const handleStartTimer = useCallback((message:any) => {
  setSecondsLeft(message.data.duration);

  if (timerRef.current) {
    clearInterval(timerRef.current);
  }

  timerRef.current = setInterval(() => {
    setSecondsLeft((prev) => {
      const newSecondsLeft = prev - 1;

      if (newSecondsLeft <= 0) {
        clearInterval(timerRef.current!);
        timerRef.current = null;
        if(isManager){
          channelRef.current.publish("accept-response", { acceptResponse: false, endRound: true, test: 4  });
        }

        return 0;
      }

      return newSecondsLeft;
    });
  }, 1000);
}, [isManager]);

/**
 * Fonction qui gère la gestion d'un nouveau round, recupère le nouveau track et le numéro de round
 * Utilisation du callback pour réactualiser la fonction lorsque les données change
 * Sans callback, lorsque la fonction est utlisée dans channel.subscribe, les données utilisées sont figées,
 * Avec le callback, on met à jour la fonction avec les nouvelles données
 */
const receiptNewRound = useCallback((message: any) => {
  console.log("Reception new track : " , message.data.currentTrack)
  const data = message.data;
  // On stocke le nouveau track et le nouveau round
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
        roomChannel.subscribe("accept-response", handleStateResponses); // Permet de gérer l'affichage (ou non) des inputs reponses 
        roomChannel.subscribe("start-timer", handleStartTimer); // Permet de recevoir l'information pour démarrer un timer en local
        roomChannel.subscribe("new-round", receiptNewRound);
        roomChannel.subscribe("scoreboard", (message) => {
          setScoreboard(message.data.scoreboard); // Un state local pour stocker le score
        });
        
        roomChannel.subscribe("display-scoreboard", (message) => {
          // Si on affiche le score, alors tous les joueurs envoient leurs scores dans le channel
          if(message.data.display){
            let playerScore: Player | null = JSON.parse(sessionStorage.getItem("playerScore") || "null");
            if(playerScore){
              roomChannel.publish("player-score", {playerScore : playerScore});
            }
          }
          setDisplayScore(message.data.display); // Un state local pour afficher les scores
        });


      } catch (error) {
        console.error("Erreur lors de la récupération de l'historique :", error);
        router.push("/login");
      }
    };

    checkChannelValidity();

    // Cleanup pour éviter les abonnements en double
    return () => {
      roomChannel.unsubscribe("accept-response", handleStateResponses);
      roomChannel.unsubscribe("start-timer", handleStartTimer);
      roomChannel.unsubscribe("new-round", receiptNewRound);
    };
  }, [ably, roomId, router, handleStateResponses, handleStartTimer, receiptNewRound]);
  

  // Cela permet de récupérer le webPlayer
  useEffect(() => {
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
        
        // On se met en ecoute sur le webPlayer (lorsque son état change (play/pause))
        webPlayer.player.addListener('player_state_changed', ( (state: { paused: any; }) => {
          if (!state) {
              return;
          }
          // On récupère l'état actuel du player
          setPaused(state.paused);
          // Si le player est pause, on envoie cela a tous les clients, cela permet d'actualiser cet état a tous les clients
          if(state.paused){
            console.log("toogle")
            channel.publish("accept-response", {acceptResponse : false, test: 1});
          }else{
            console.log("toogle")
            channel.publish("accept-response", {acceptResponse : true, test: 2});
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
        // startRound();
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
    if(!isManager) return; // Au cas ou un client pourrait lancer la fonction
  
    const newTrack: Track = await fetchNewTrack(playlistId);
    if (newTrack && webPlayer.deviceId) {
      setTrack(newTrack);
      await playTrack(newTrack.uri, webPlayer.deviceId);
      setFirstStart(false);
      const newRound: number = round + 1;
      channel.publish("game-start", {gameStart : true}); // Permet de faire lancer les joueurs en attente dans la waiting-room
      channel.publish("new-round", {currentRound: newRound, currentTrack : newTrack})
      // launch Round
      startRound();
    } else {
      console.error("❌ Impossible de jouer la nouvelle piste");
    }
  };


  /**
   * Affichage de l'historique des messages dans Ably
   */
  const displayHistory = async () => {
    const history = await channel.history();
    console.log("HISTORY: ", history)
  }


  /**
   * Cette fonction permet d'afficher le score pour tous le monde
   * Elle envoie d'abord dans le channel display-scoreboard l'état qu'elle veut.
   * Si c'est true, donc on veut afficher
   * Les clients inscrit a display-scoreboard recoivent display :true et envoie chacun leur score stocké en local dans le channel 'player-score'
   * On fait envoyer les scores juste avant de vouloir le scoreboard car les messages envoyés dans les channel ont une durée de vie de environ 2min
   * Cela permet de ne pas perdre de score de certains joueurs
   * Ensuite on recupere l'historique de tous les messages recu dans ce channel via la fonction getScorePlayersFromHistory
   * Puis on envoie à tous les joueurs le scoreboard dans le channel 'scoreboard', tous les clients sont inscrit a ce channel
   */
  const displayScoreboard = async () => {
    const currentChannel = channelRef.current;
    channel.publish("display-scoreboard", { display : !displayScore});

    // Attendre 1 sec le temps que tous les client aient envoyé leur score dans le channel 'player-score'
    const scorePlayers = await getScorePlayersFromHistory(currentChannel);
    channelRef.current.publish('scoreboard', {scoreboard : scorePlayers});
  }

  return (
    <div>
      <h1 className="title">Configuration du jeu</h1>

      {(isManager) ? (
        <><button className="button" onClick={()=> {router.push("/game-setup");}}>Retour</button></>
      ) : (
        <><button className="button" onClick={()=> {router.push("/login");}}>Retour</button></>
      )}
      {(isManager) && (
        <>
          <div className="input-block">
          <input 
            required
            id="secondsRound"
            className="input-text" 
            type="number" 
            value={roundDuration ?? ""}
            onChange={(e) => {
              const value = e.target.value;
              setRoundDuration(value === "" ? null : parseInt(value));
            }}
            />
          <label htmlFor="track" data-label="Secondes par manche"/>
          {(roundDuration === null) && (
            <h4 className={styles.duration__message}>
              Il faut mettre une durée de manche valide
            </h4>
          )}

        </div>
      </>

      )}
      <h2 className={styles.timer}>
        Secondes restantes : {secondsLeft}
      </h2> 

      <div>
      {(webPlayer.player && isManager && (roundDuration !== null)) && (
        <>
          {(!firstStart) && (
            <button className='button' onClick={handlePlayTrack}>{is_paused || firstStart ? "PLAY" : "PAUSE"}</button>
          )}
          <button className='button' onClick={handleNextTrack}>{firstStart ? "Play" : "NextTrack"}</button>

          <button className='button' onClick={displayScoreboard}>{displayScore ? "Cacher les scores" : "Afficher les scores"}</button>
         
          <VolumeControl player={webPlayer.player} />
          
          
        </>
       )}
      </div>
      <div>
        {(acceptResponse) ? (
          <>
            <h1>
              Entrez les reponses
            </h1>
            <div className={styles.inputs__container}>
              <div className="input-block">
                <input 
                  required
                  id="track"
                  className="input-text" 
                  type="text" 
                  onChange={(e) => {setInputTrack(e.target.value)}}
                />
                <label htmlFor="track" data-label="Titre"/>
              </div>
              <div className="input-block">

                <input 
                  required
                  id="artist" 
                  className="input-text" 
                  type="text" 
                  onChange={(e) => {setInputArtist(e.target.value)}}
                />
                <label htmlFor="artist" data-label="Artiste"/>
              </div>
            </div>
          </>
        ) : (
          <>
            <h2>
              {isManager ?"Lance le prochain morceau lorsque tout le monde est prêt" : "Attends que l'hote lance le prochain morceau"}
            </h2>
          </>
        )}
      </div>
      <div>
        {displayResponse && (
          <ModalResponse
            currentTrack={track}
            currentRound={round}
            onClose={() => setDisplayResponse(false)}
          />
        )}
      </div>
      {/* <div>
        <button className="button" onClick={displayHistory}>HISTORY</button>
      </div> */}
      <div>
        { displayScore && 
          (<DisplayScore scoreboard= {scoreboard}/>)
        }
      </div>
    </div>
  );
}