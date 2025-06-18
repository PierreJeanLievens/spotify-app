"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { fetchNumberSavedTracks } from "@/lib/fetchData";
import Loading from "@/components/ui/Loading";

const SavedTracksPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  // Fonction permettant de vérifier que l'on récupère les titres likés sinon redirection vers /login
  useEffect(() => {
    const getPlaylistsFetched = async () => {
      try {
        setLoading(true);
        const numberSavedTracks = await fetchNumberSavedTracks();
        if (!numberSavedTracks) {
          console.error("Aucun titre récupéré pour ce client");
          router.push("/login");
          return;
        }
      } catch (error) {
        console.error(error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    getPlaylistsFetched();
  }, [router]);


  
  // Lors du clic sur le bouton, on enregistre l'id save-tracks pour la playlist et on redirige vers /game-setup
  const selectSavedTracks = () => {
    localStorage.setItem("playlist_choosen_id", "saved-tracks");
    router.push("/game-setup");
  }

  if (loading) {
    return (
      <Loading
        title="Titres en cours de chargement"
        text="Veuillez attendre..."
        redirection="/login"
      />
    );
  }

  return (
    <div>
      <h1 className="title">Mes Titres Likés</h1>
      <button className="button" onClick={selectSavedTracks}>Valider</button>
    </div>
  );
};

export default SavedTracksPage;
