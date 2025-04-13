"use client";
import { Track } from "@/types/spotify";
import styles from "./ModalResponse.module.css";

export default function ModalResponse({
  currentTrack,
  currentRound,
  onClose,
}: {
  currentTrack: Track | null;
  currentRound: number | 0;
  onClose: () => void; // <--- Ajout de la fonction de fermeture
}) {
  if (!currentTrack) return null;

  const { name, album, artists, popularity } = currentTrack;

  return (
    <div className={styles.modal}>
      <div className={styles.box}>
        <h1 className={styles.title}>Réponse du Round {currentRound}</h1>
        <div className={styles.section_1}>
            <div className={styles.content_1}>
                <img
                        src={album.images[0]?.url}
                        alt={`Pochette de l'album ${album.name}`}
                        className={styles.albumImage}
                />
                <div>
                    <h2>{name}</h2>
                    <p>-- {artists.map((a) => a.name).join(", ")} --</p>
                </div> 
            </div>
            
        </div>
        <div className={styles.section_2}>
            <p><strong>Album :</strong> {album.name}</p>
            <p><strong>Date de sortie :</strong> {album.release_date}</p>
        </div>
        <div className={styles.section_3}>
            <p><strong>Popularité :</strong> {popularity}/100</p>
        </div>
        <button className={`button ${styles.close_button}`} onClick={onClose}>Fermer</button>
      </div>
    </div>
  );
}
