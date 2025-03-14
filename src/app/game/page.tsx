"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/app/game-setup/page.module.css";
import Loading from "@/components/Loading";
import { Track } from "@/types/spotify";
import { fetchNewTrack, fetchPlayerState } from "@/lib/fetchData";
import pauseTrack from "@/lib/pauseTrack";
import resumeTrack from "@/lib/resumeTrack";
import playTrack from "@/lib/playTrack";
import DevicesChoice from "@/components/DevicesChoice";

const GamePage = () => {
  const [track, setTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [stateUpdated, setStateUpdated] = useState<boolean>(false);
  const [newTrack, setNewTrack] = useState<boolean>(true);
  const router = useRouter();

  // Récupération de la première musique et arrêt automatique
  useEffect(() => {
    const initGame = async () => {
      try {
        const newTrack = await fetchNewTrack(router);
        setTrack(newTrack);
        const isPlayingFetched = await fetchPlayerState(router);
        if(isPlaying){
          await pauseTrack(router);
        }
        
      } catch (error) {
        console.error("Erreur lors de l'initialisation :", error);
      }
    };
    initGame();
  }, []);

  // Mise à jour de `isPlaying` à chaque `stateUpdated`
  useEffect(() => {
    const updatePlayerState = async () => {
      try {
        const isPlayingFetched = await fetchPlayerState(router);
        setIsPlaying(isPlayingFetched);
      } catch (error) {
        console.error("Erreur lors de la mise à jour de l'état du lecteur :", error);
      }
    };
    updatePlayerState();
  }, [stateUpdated]);

  // Passer à la chanson suivante
  const nextTrack = async () => {
    try {
      const newTrack = await fetchNewTrack(router);
      setTrack(newTrack);
      const isPlayingFetched = await fetchPlayerState(router);
      if(isPlayingFetched){
        await handlePause(); // Met en pause pour éviter de jouer immédiatement
        setIsPlaying(!isPlayingFetched)
      }
      setNewTrack(true);
    } catch (error) {
      console.error("Erreur lors du passage au titre suivant :", error);
    }
  };

  // Lancer la musique
  const handlePlay = async () => {
    try {
      if (track) {
        const isPlayingFetched = await fetchPlayerState(router);
        await playTrack(track.uri, router); // Met en pause pour éviter de jouer immédiatement
        setIsPlaying(!isPlayingFetched);
        setNewTrack(false);
      }
    } catch (error) {
      console.error("Erreur lors du lancement de la lecture :", error);
    }
  };

  // Mettre en pause
  const handlePause = async () => {
    try {
      const isPlayingFetched = await fetchPlayerState(router);
      if(isPlayingFetched){
        await pauseTrack(router);
        setIsPlaying(!isPlayingFetched)
      }
    } catch (error) {
      console.error("Erreur lors de la mise en pause :", error);
    }
  };

  // Reprendre la lecture
  const handleResume = async () => {
    try {
      const isPlayingFetched = await fetchPlayerState(router);
      if(!isPlayingFetched){
        await resumeTrack(router);
        setIsPlaying(!isPlayingFetched)
      }
    } catch (error) {
      console.error("Erreur lors de la reprise de la lecture :", error);
    }
  };

  if (!track) {
    return <Loading title="Recherche du titre" text="En attente du titre" />;
  }

  return (
    <div className={styles.gameContainer}>
      <h1>Ma playlist</h1>
      <button
        onClick={() => {
          localStorage.removeItem("spotify_access_token");
          router.push("/");
        }}
      >
        Déconnexion
      </button>

      <DevicesChoice />

      <h2>{track.name}</h2>

      <button className="button" onClick={nextTrack}>
        Suivant
      </button>

      {!isPlaying ? (
        <button className="button" onClick={handlePlay}>
          Lancer/Relancer
        </button>
      ) : (
        <button className="button" onClick={handlePause}>
          Pause
        </button>
      )}

      {(!isPlaying && !newTrack) && (
        <button className="button" onClick={handleResume}>
          Reprise
        </button>
      )}
    </div>
  );
};

export default GamePage;
