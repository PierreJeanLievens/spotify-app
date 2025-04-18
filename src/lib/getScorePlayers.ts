import { RealtimeChannel } from "ably";
import { Player } from "@/types/spotify";

export async function getScorePlayersFromHistory(channel: RealtimeChannel): Promise<Player[]> {
  try {
    const history = await channel.history();

    const latestPlayersMap = new Map<string, Player>();

    history.items
      .filter((message: any) => message.name === "player-score")
      .forEach((message: any) => {
        const playerData = message.data?.playerScore;

        if (
          playerData &&
          playerData.clientId &&
          playerData.rounds &&
          Array.isArray(playerData.rounds)
        ) {
          latestPlayersMap.set(playerData.clientId, playerData);
        }
      });

    const sortedPlayers = Array.from(latestPlayersMap.values())
      .map((player) => ({
        ...player,
        totalPoints: player.rounds?.reduce(
          (acc, round) =>
            acc + (round.artistPoints || 0) + (round.trackPoints || 0) + (round.bonus || 0),
          0
        ) || 0,
      }))
      .sort((a, b) => b.totalPoints - a.totalPoints);

    return sortedPlayers;
  } catch (err) {
    console.error("Erreur lors de la récupération de l'historique :", err);
    return [];
  }
}
