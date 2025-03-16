"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PlaylistCard from "@/components/PlaylistCard"; // On importe le composant
import styles from "@/components/PlaylistList.module.css"
import { Playlist } from "@/types/spotify"; // Typage de la playlist

export default function PlaylistList({ playlists }: { playlists: Playlist[] }) {
  const [playlistChoosenId, setPlaylistChoosenId] = useState<string | null>(null);
  const router = useRouter();

  // Charger la valeur depuis localStorage une seule fois après le premier rendu
  useEffect(() => {
    const storedId = localStorage.getItem("playlist_choosen_id");
    setPlaylistChoosenId(storedId ?? null);
  }, []);

  // Sauvegarder ou supprimer la valeur dans localStorage lorsqu'elle change
  useEffect(() => {
    if(playlistChoosenId){
        localStorage.setItem("playlist_choosen_id", playlistChoosenId);
    }else {
        localStorage.removeItem("playlist_choosen_id");
    }
  }, [playlistChoosenId]);

  return (
    <>
        <ul className={styles.body}>
        {playlists.map((playlist) => (
            <PlaylistCard
            key={playlist.id}
            playlist={playlist}
            isSelected={playlist.id === playlistChoosenId}
            onSelect={() => {
                // Change la sélection (désélectionne si déjà sélectionnée)
                setPlaylistChoosenId((prevId) =>
                  prevId === playlist.id ? null : playlist.id
                );
                router.push(`/game-setup`);
              }}

            />
        ))}
        </ul>
    </>
  );
}
