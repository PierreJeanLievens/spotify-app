import React from "react";
import { Playlist, PlaylistCardProps } from "@/types/spotify";
import styles from "@/components/PlaylistCard.module.css"

export default function PlaylistCard({ playlist, isSelected, onSelect }: PlaylistCardProps) {
  return (
    <li className={`${styles.container} ${isSelected ? styles.selected : ""}`} onClick={onSelect}>
      <h3 className={styles.title}>{playlist.name}</h3>
      <a className={styles.link} href={playlist.external_urls.spotify} target="_blank" rel="noopener noreferrer">
        {playlist.images?.length > 0 ? (
          <img className={styles.image} src={playlist.images[0].url} alt={playlist.name} />
        ) : (
          <div className={`${styles.no_image}`}>
            <p>Pas d'image</p>
          </div>
        )}
      </a>
    </li>
  );
}
