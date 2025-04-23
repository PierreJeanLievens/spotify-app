"use client";

import { Player } from "@/types/spotify";
import styles from "./DisplayScore.module.css"
type DisplayScoreProps = {
  scoreboard?: Player[];
};

export default function DisplayScore({ scoreboard = [] }: DisplayScoreProps) {
    // console.log(scoreboard)
    

    // Permet de recuperer tous les éléments, ensuite cela additionne tous les points de chaque joueurs et trie ces joueurs en fonction de totalPoints
    const sortedScoreboard: Player[] = scoreboard
    // .map((player) => {
    //   const totalPoints = (player.rounds || []).reduce((acc, round) => {
    //     return (
    //       acc +
    //       (round.artistPoints || 0) +
    //       (round.trackPoints || 0) +
    //       (round.bonus || 0)
    //     );
    //   }, 0);

    //   return {
    //     ...player,
    //     totalPoints,
    //   };
    // })
    // .sort((a, b) => b.totalPoints - a.totalPoints);


  return (
    <div className={styles.container}>
      <h2>Classement des joueurs</h2>
      {sortedScoreboard.length === 0 ? (
        <p>Pas de joueurs dans ce salon</p>
      ) : (
        <ul>
          {sortedScoreboard.map((player, index) => (
            <li key={player.clientId}>
              <strong>{index + 1}. {player.name}</strong> - {player.totalPoints ?? 0} points
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
