"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/app/game-setup/page.module.css"
import Loading from "@/components/Loading";
import { Track } from "@/types/spotify";
// import { fetchPlaylist } from "@/lib/fetchPlaylist";
import { fetchDevices, fetchNewTrack, fetchNumberTracksPlaylist } from "@/lib/fetchData";
import pauseTrack from "@/lib/pauseTrack";
import resumeTrack from "@/lib/resumeTrack";
import playTrack from "@/lib/playTrack";
import DevicesChoice from "@/components/DevicesChoice";

const GamePage = () => {
  const [track, setTrack] = useState<Track>();
  const router = useRouter();
  const [devices, setDevices] = useState<any>([]);

  
  // Permet de récupérer la playlist choisie et de la stocker dans playlist
  useEffect(() => {
    const fetchPlaylistData = async () => {
      const newTrack = await fetchNewTrack(router);
      setTrack(newTrack)
      console.log(newTrack)
    };

    fetchPlaylistData();
    
  }, [router]);


  const nextTrack = async () => {
    const newTrack = await fetchNewTrack(router);
    setTrack(newTrack)
    console.log(newTrack)
  } 

  if (!track) {
    return <Loading title="Recherche du titre" text="En attente du titre"/>;
  }

  return (
    <div className="">
      <h1>Ma playlist</h1>
      <button
        onClick={() => {
          localStorage.removeItem("spotify_access_token");
          router.push("/");
        }}
      >
        Déconnexion
      </button>
      <div>
      <DevicesChoice/>
          <h1></h1>
          <button 
          className="button" 
           onClick={() => nextTrack()}
          >
            Suivant
          </button>
          <button 
          className="button" 
           onClick={() => playTrack(track.uri ,router)}
          >
            Lancer
          </button>
          <button 
          className="button" 
           onClick={() => pauseTrack(router)}
          >
            Pause
          </button>
          <button
          className="button" 
           onClick={() => resumeTrack(router)}
          >
            Reprise
          </button>
      </div>
    </div>
  );
};

export default GamePage;
