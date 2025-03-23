"use client"; // On veut exécuter ce code uniquement côté client

import { createContext, useContext, useEffect, useState } from "react";
import Ably from "ably";

// Création du contexte
const AblyContext = createContext<Ably.Realtime | null>(null);

// Provider qui va gérer la connexion Ably
export const AblyProvider = ({ children }: { children: React.ReactNode }) => {
  const [ably, setAbly] = useState<Ably.Realtime | null>(null);

  useEffect(() => {
    // sessionStorage plutot que localStorage pour différencier 2 client sur meme pc avec 2 navigateurs différents
    const clientId = sessionStorage.getItem("clientId");
    // Futur client Ably
    let client
    if(clientId != null){
        // Initialisation de Ably
        console.log("Connection Ably avec Id : ", clientId)
        client = new Ably.Realtime({ authUrl: `/api/socket/${clientId}` });
    }else{
        // Initialisation de Ably
        console.log("Connection Ably sans Id")
        client = new Ably.Realtime({ authUrl: "/api/socket" });
    }
  
    setAbly(client);

    // Écouter les événements de connexion
    client.connection.on("connected", () => {
      sessionStorage.setItem("clientId", client.auth.clientId);
      console.log("✅ Ably connecté avec Client ID :", client.auth.clientId);
    });

    client.connection.on("disconnected", () => {
      console.log("⚠️ Ably déconnecté !");
    });

    return () => {
      client.close(); // Fermeture propre de la connexion à la fin
    };
  }, []);

  return <AblyContext.Provider value={ably}>{children}</AblyContext.Provider>;
};

// Hook personnalisé pour accéder au client Ably depuis n'importe quelle page
export const useAbly = () => {
  return useContext(AblyContext);
};
