import { ably } from "@/lib/ably"; 

export const createRoom = (roomId: string) => {
    return ably.channels.get(`blindtest:${roomId}`);
  };
  
  export const joinRoom = (roomId: string) => {
    return ably.channels.get(`blindtest:${roomId}`);
  };
  