"use client";

import { useEffect, useState } from "react";
import { useAbly } from "@/lib/ablyContext";
import { useParams } from "next/navigation";
import Loading from "./Loading";

export default function GamePlayers() {
    const { roomId } = useParams() as { roomId: string };
    const [players, setPlayers] = useState<any[]>([]);
    const ably = useAbly();
    
    // On récupère les joueurs dans ce salon
    useEffect(() => {
        if (!ably) return;

        const channel = ably.channels.get(`blindtest:${roomId}`);

        const fetchHistory = async () => {
            try {
                const history = await channel.history();
        
                const latestPlayersMap = new Map<string, any>();
        
                history.items
                    .filter((message: any) => message.name === "user-list") // Filtrer les messages pertinents
                    .sort((a, b) => b.timestamp - a.timestamp) // Tri décroissant par timestamp
                    .forEach((message: any) => {
                        if (!latestPlayersMap.has(message.clientId)) {
                            latestPlayersMap.set(message.clientId, message.data);
                        }
                    });
        
                const updatedPlayers = Array.from(latestPlayersMap.values());
                setPlayers(updatedPlayers);
            } catch (err) {
                console.error("Erreur lors de la récupération de l'historique :", err);
            }
        };
        

        fetchHistory();

        // 📌 À chaque nouvel arrivant, on refait toute la liste des joueurs
        const onJoin = async () => {
            await fetchHistory();
        };

        channel.subscribe("user-list", onJoin);

        return () => {
            channel.unsubscribe("user-list", onJoin);
        };
    }, [ably, roomId]);


    return (
        <div>
            <h2>Joueurs</h2>
            {players.length === 0 ? (
                <Loading title="Pas de joueurs dans ce salon" text="Attends que les joueurs chargent... ou retourne au menu"/>
            ) : (
                players.map((player, index) => (
                    <p key={index}>{player.clientName}</p>
                ))
            )}
        </div>
    );
}
