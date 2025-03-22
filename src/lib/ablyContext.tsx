"use client"; // On veut exécuter ce code uniquement côté client

import { createContext, useContext, useEffect, useState } from "react";
import Ably from "ably";

// 1️⃣ Création du contexte
const AblyContext = createContext<Ably.Realtime | null>(null);

// 2️⃣ Provider qui va gérer la connexion Ably
export const AblyProvider = ({ children }: { children: React.ReactNode }) => {
  const [ably, setAbly] = useState<Ably.Realtime | null>(null);

  useEffect(() => {
    const clientId = sessionStorage.getItem("clientId");
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

// 3️⃣ Hook personnalisé pour accéder au client Ably
export const useAbly = () => {
  return useContext(AblyContext);
};
