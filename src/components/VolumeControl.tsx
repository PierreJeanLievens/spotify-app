"use client"

import { useState, useEffect } from 'react';
import styles from "@/components/VolumeControl.module.css"

const VolumeControl = ({ player }: { player: any }) => {
  const [volume, setVolume] = useState(50); // Valeur entre 0 et 100
  const [showSlider, setShowSlider] = useState(false);

  useEffect(() => {
    player.getVolume().then((v: number) => {
      setVolume(Math.round(v * 100)); // Convertir en 0–100
    });
  }, [player]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
    player.setVolume(newVolume / 100); // Convertir en 0–1
  };

  const handleVolumeButton = () => {
    setShowSlider(!showSlider);
  };

  return (
    <div className={styles.volume__control}>
      <button className="button" onClick={handleVolumeButton}>
        Volume
      </button>
      {showSlider && (
        <input
          type="range"
          min={0}
          max={100}
          value={volume}
          onChange={handleVolumeChange}
          className={styles.volume__slider}
        />
      )}
    </div>
  );
};

export default VolumeControl;
