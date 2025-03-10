import React from "react";
import styles from "@/components/GameSetupPlaylist.module.css"
import { Playlist } from "@/types/spotify";

export default function GameSetupPlaylist({ playlist }: { playlist: Playlist }) {
  return (
    <div>
      <h2>Ma playlist</h2>
      <p>{playlist.name}</p>
      {playlist.images?.length > 0 ? (
          <img className={styles.image} src={playlist.images[0].url} alt={playlist.name} />
        ) : (
          <div className={`${styles.no_image}`}>
            <p>Pas d'image</p>
          </div>
        )}
    </div>
  );
}
