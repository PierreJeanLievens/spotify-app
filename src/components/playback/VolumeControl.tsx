"use client"

import { useState, useEffect } from 'react';
import styles from "@/components/VolumeControl.module.css"

const VolumeControl = ({ player }: { player: any }) => {
  const [volume, setVolume] = useState(30); // Valeur entre 0 et 100 (initialement 30)

  useEffect(() => {
    player.getVolume().then((volumeFetched: number) => {
      setVolume(Math.round(volumeFetched * 100)); // Convertir en 0–100
    });
  }, [player]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
    player.setVolume(newVolume / 100); // Convertir en 0–1
  };

  return (
    <div className={styles.volume__control}>
        <input
          type="range"
          min={0}
          max={100}
          value={volume}
          onChange={handleVolumeChange}
          className={styles.volume__slider}
        />
    </div>
  );
};

export default VolumeControl;
