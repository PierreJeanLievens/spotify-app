import React, { useState, useEffect } from "react";
import styles from "./GameSetupPlayers.module.css"
import { PlayerOld } from "@/types/spotify"; 

export default function GameSetupPlayers() {
  const [players, setPlayers] = useState<PlayerOld[]>(() => {
    const storedPlayers = localStorage.getItem("players");
    return storedPlayers ? JSON.parse(storedPlayers) : [];
  });
  
  const [newPlayerName, setNewPlayerName] = useState("");

 

  // Sauvegarder la liste dans le localStorage à chaque modification
  useEffect(() => {
    if(players.length > 0) {
      localStorage.setItem("players", JSON.stringify(players));
    }else {
      localStorage.removeItem("players");
    }
  }, [players]);

  // Fonction pour ajouter un joueur si son nom n'existe pas déjà
  const handleAddPlayer = () => {
    const trimmedName = newPlayerName.trim();
    if (trimmedName !== "") {
      // Vérifier si un joueur avec ce nom existe déjà (comparaison insensible à la casse)
      const exists = players.some(
        (player) => player.name.toLowerCase() === trimmedName.toLowerCase()
      );
      if (exists) {
        alert("Ce joueur existe déjà.");
        return;
      }
      const newPlayer: PlayerOld = { name: trimmedName, score: 0 };
      setPlayers([...players, newPlayer]);
      setNewPlayerName(""); // Réinitialiser l'input
    }
  };

  // Reinitialise les joueurs
  const resetPlayers = () => {
    setPlayers([]);
    localStorage.removeItem("players");
  }

  // Fonction pour supprimer un joueur en se basant sur le nom
  const handleRemovePlayer = (name: string) => {
    setPlayers(players.filter((player) => player.name !== name));
    localStorage.setItem("players", JSON.stringify(players));
  };

  return (
    <div className={styles.container}>
      <ul className={styles.player__container}>
        {players.map((player, index) => (
          <li key={index} className={styles.player__element}>
            <p 
              className={styles.player__name}
            >{player.name}</p>
            <button 
              className={`${styles.player__delete} button`}
              onClick={() => handleRemovePlayer(player.name)}>
                Supprimer
            </button>
          </li>
        ))}
        <li className={styles.player__element}>
          <input
            className={styles.player__input}
            type="text"
            placeholder="Nom du joueur"
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
          />
          <button 
            className={`${styles.button__add} button`}
            onClick={handleAddPlayer}>Ajouter</button>
        </li>

      </ul>
      
      <div>
      <button 
        className="button"
        onClick={resetPlayers}>Reset</button>  
      </div>
    </div>
  );
}
