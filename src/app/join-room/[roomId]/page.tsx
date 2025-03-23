"use client";

import { useState } from "react";
import Ably from "ably";
import { useRouter, useParams } from "next/navigation";
import { useAbly } from "@/lib/ablyContext"; // Importation du contexte Ably

export default function GameRoom() {
  const { roomId } = useParams() as { roomId: string };
  const [clientName, setClientName] = useState("");
  const router = useRouter();
  const ably = useAbly(); // Récupère Ably depuis le contexte

  /**
   * Permet de vérifier si le nom donné existe déjà dans ce salon 
   * @param ably Objet de connection Ably
   * @param roomId Id du salon
   * @param name Nom voulu
   * @returns boolean (true si le nom n'existe pas, false si le nom existe déjà)
   */
  const checkNameClient = async (ably: Ably.Realtime, roomId: string, name: string): Promise<boolean> => {
    if (!ably) {
      alert("Pas de connexion à Ably");
      return false;
    }
  
    const channel = ably.channels.get(`blindtest:${roomId}`);
  
    try {
      const history = await channel.history();
      
      // Vérifie si le nom existe déjà dans l'historique
      const nameExists = history.items.some((message: any) => {
        return message.name === "user-list" && message.data?.clientName?.toLowerCase() === name.toLowerCase();
      });
  
      if (nameExists) {
        alert("Nom déjà utilisé");
        return false;
      }
    } catch (err) {
      console.error("❌ Erreur lors de la récupération de l'historique :", err);
      return false;
    }
  
    return true;
  };
  
  /**
   * Lorsque l'on veut rejoindre le salon, on verifie que :
   * La connexion ably soit faite
   * L'id du salon choisi n'est pas vide
   * Le nom n'est pas vide et qu'il n'existe pas déjà
   * @returns 
   */
  const handleJoinRoom = async () => {
    if (!ably) {
      alert("Pas de connexion à Ably");
      return;
    }
    if (!clientName.trim()) {
      alert("Veuillez entrer un nom");
      return;
    }
    if (!roomId || !roomId.trim()) {
        alert("Veuillez entrer un ID de salon valide !");
        return;
    }

    const clientId = ably.auth.clientId;
    const channel = ably.channels.get(`blindtest:${roomId}`);

    // Attendre le résultat de checkNameClient avant de continuer
    const isNameValid = await checkNameClient(ably, roomId, clientName);
    
    // Si le nom n'existe pas, on l'ajoute dans le salon et on attend
    if (isNameValid) {
      channel.publish("user-list", { clientId, clientName });
      sessionStorage.setItem("clientName", clientName);
      router.push(`/waiting-room/${roomId}`);
    }
  };

  return (
    <div >
      <h1>Blind Test</h1>

      {/* Champ pour entrer l'ID du salon */}
      <input
        disabled={true}
        type="text"
        placeholder="ID du salon"
        value={roomId}
      />

      {/* Champ pour entrer le nom de l'user */}
      <input
        type="text"
        placeholder="Nom"
        value={clientName}
        onChange={(e) => setClientName(e.target.value)}
      />

      {/* Bouton pour rejoindre un salon */}
      <button
        onClick={handleJoinRoom}
        className="button"
      >
        Rejoindre
      </button>
    </div>
  );
}
