"use client";

import { useEffect, useState } from "react";
import { useAbly } from "@/lib/ablyContext";
import { useParams } from "next/navigation";
import Loading from "./Loading";
import { Player } from "@/types/spotify";

export default function DisplayScore() {
    const { roomId } = useParams() as { roomId: string };
    const [players, setPlayers] = useState<Player[]>([]);
    const ably = useAbly();
    
    // Récupérer les scores des joueurs
    useEffect(() => {
        if (!ably) return;

        const channel = ably.channels.get(`blindtest:${roomId}`);

        const fetchHistory = async () => {
            try {
                const history = await channel.history();
        
                const latestPlayersMap = new Map<string, Player>();
                console.log("HISTORY: ", history)
                history.items
                    .filter((message: any) => message.name === "player-score")
                    .forEach((message: any) => {
                        const playerData = message.data?.playerScore; // ✅ Accès correct
                    
                        if (
                            playerData &&
                            playerData.clientId &&
                            playerData.rounds &&
                            Array.isArray(playerData.rounds) // ✅ Vérifie que rounds est bien un tableau
                        ) {
                            latestPlayersMap.set(playerData.clientId, playerData);
                        }
                    });

                // Transformer la Map en tableau et trier les joueurs par score total
                const sortedPlayers = Array.from(latestPlayersMap.values()).map((player) => ({
                    ...player,
                    totalPoints: player.rounds
                        ? player.rounds.reduce(
                            (acc, round) => acc + (round.artistPoints || 0) + (round.trackPoints || 0) + (round.bonus || 0),
                            0
                          )
                        : 0, // ✅ Si `rounds` est vide ou `undefined`, totalPoints = 0
                })).sort((a, b) => b.totalPoints - a.totalPoints);

                setPlayers(sortedPlayers);
            } catch (err) {
                console.error("Erreur lors de la récupération de l'historique :", err);
            }
        };

        fetchHistory();

        // 📌 Mise à jour des scores en temps réel
        const onNewScore = async () => {
            await fetchHistory();
        };

        channel.subscribe("player-score", onNewScore);

        return () => {
            channel.unsubscribe("player-score", onNewScore);
        };
    }, [ably, roomId]);

    return (
        <div>
            <h2>Classement des joueurs</h2>
            {players.length === 0 ? (
                // <Loading title="Pas de joueurs dans ce salon" text="Attends que les joueurs chargent... ou retourne au menu" redirection="/login"/>
                <p>Pas de joueurs dans ce salon</p>
            ) : (
                <ul>
                    {players.map((player, index) => (
                        <li key={player.clientId}>
                            <strong>{index + 1}. {player.name}</strong> - {player.totalPoints} points
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
