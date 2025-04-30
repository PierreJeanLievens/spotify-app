"use client";

import { useState, useEffect } from "react";
import { fetchDevices } from "@/lib/fetchData"; // Assure-toi que le chemin est correct
import { playTrack } from "@/lib/managePlayer/playTrack";
import { pauseTrack } from "@/lib/managePlayer/pauseTrack";
import { resumeTrack } from "@/lib/managePlayer/resumeTrack";

export default function RoomPage() {
  const [devices, setDevices] = useState<any[]>([]); // Pour stocker les appareils
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>(""); // Pour stocker l'ID du device sélectionné

  // Fetch les appareils toutes les secondes
  useEffect(() => {
    const getDevices = async () => {
      try {
        const devicesData = await fetchDevices();
        setDevices(devicesData);
      } catch (error) {
        console.error("Erreur lors de la récupération des appareils:", error);
      }
    };

    // Initialiser le fetch au montage
    getDevices();

    // Mettre à jour toutes les secondes
    const intervalId = setInterval(getDevices, 1000);

    // Nettoyage de l'intervalle au démontage du composant
    return () => clearInterval(intervalId);
  }, []); // Le useEffect s'exécute une seule fois au montage, puis chaque seconde

  const handleDeviceSelect = (deviceId: string) => {
    setSelectedDeviceId(deviceId); // Stocke l'ID du device sélectionné
  };
  const handleStart = async () => {
    if(selectedDeviceId){
      await playTrack("spotify:track:11dFghVXANMlKmJXsNCbNl", selectedDeviceId)
    }
  }

  const handlePause = async () => {
      await pauseTrack();
  }

  const handleResume = async () => {
    if(selectedDeviceId){
      await resumeTrack(selectedDeviceId)
    }
  }

  return (
    <div>
      <h1 className="title">Test Devices Spotify</h1>
      {devices.length === 0 ? (
        <p>Aucun appareil trouvé.</p>
      ) : (
        <div>
          <h2>Sélectionnez un appareil</h2>
          {devices.map((device) => (
            <div key={device.id}>
              <button
                onClick={() => handleDeviceSelect(device.id)}
                className="bg-blue-500 text-white p-2 rounded-md m-2"
              >
                {device.name} - {device.type}
              </button>
            </div>
          ))}
          <div>
            <button className="button" onClick={() => handleStart()}>Start</button>
          </div>
          <div>
            <button className="button" onClick={() => handlePause()}>Pause</button>
          </div>
          <div>
            <button className="button" onClick={() => handleResume()}>Resume</button>
          </div>
        </div>
      )}
      {selectedDeviceId && <p>Appareil sélectionné : {selectedDeviceId}</p>}
    </div>
  );
}
