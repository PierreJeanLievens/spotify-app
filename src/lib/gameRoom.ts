import { ably } from "@/lib/ably"; 

export const createRoom = async (roomId: string) => {
  const channel = ably.channels.get(`blindtest:${roomId}`);

  // Publier le gérant au moment de la création du salon
  await channel.publish("room-manager", ably.auth.clientId);

  return channel;
  };
  
  export const joinRoom = (roomId: string) => {
    return ably.channels.get(`blindtest:${roomId}`);
  };
  