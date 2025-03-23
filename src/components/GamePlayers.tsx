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

                const newPlayers = history.items
                    .filter((message: any) => message.name === "user-list")
                    .map((message: any) => message.data);

                setPlayers(newPlayers);
            } catch (err) {
                console.error("Erreur lors de la récupération de l'historique :", err);
            }
        };

        fetchHistory();

        // Écoute les nouveaux joueurs
        const listener = (message: any) => {
            setPlayers((prev) => [...prev, message.data]);
        };
        channel.subscribe("user-list", listener);

        return () => {
            channel.unsubscribe("user-list", listener);
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
