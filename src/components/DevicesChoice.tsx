"use client";

import { fetchDevices } from "@/lib/fetchData";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./DevicesChoice.module.css"
import Loading from "./Loading";

export default function DevicesChoice() {
    const router = useRouter();
    const [devices, setDevices] = useState<any[]>([]);
    const [deviceId, setDeviceId] = useState<string | null>(null);

    // Charger le device sauvegardé au montage
    useEffect(() => {
        const fetchDevicesList = async () => {
            const devicesFetched = await fetchDevices();
            setDevices(devicesFetched);
            const storedDeviceId = localStorage.getItem("device_id");
            setDeviceId(storedDeviceId);

        };
        fetchDevicesList();
    }, []);

    // Mettre à jour la liste des devices en continu
    useEffect(() => {
        const fetchDevicesList = async () => {
            // On récupère le deviceId enregistré
            const storedDeviceId = localStorage.getItem("device_id");
            setDeviceId(storedDeviceId);
            // On récupère la liste des devices disponibles
            const fetchedDevices = await fetchDevices();
            setDevices(fetchedDevices);
            // Si la liste existe (n'est pas vide)
            if(fetchedDevices){
                // Si le deviceId n'existe pas dans les devices dispo
                if (!fetchedDevices.some((device: any) => device.id === storedDeviceId)) {
                    // On récupère l'id du premier device disponible
                    const newDeviceId = fetchedDevices.length > 0 ? fetchedDevices[0].id : null;
                    setDeviceId(newDeviceId);
                    if (newDeviceId) {
                        localStorage.setItem("device_id", newDeviceId);
                    } 
                }
            }
            
        };

        const interval = setInterval(fetchDevicesList, 5000); // Rafraîchir toutes les 5 secondes
        return () => clearInterval(interval); // Nettoyage de l'intervalle lors du démontage
    }, [router, deviceId]);

    // Fonction pour choisir un device
    const choiceDevice = (selectedId: string) => {
        setDeviceId(selectedId);
        localStorage.setItem("device_id", selectedId);
    };

    return (
        <>
            {devices.length > 0 ? (
                devices.map((device: any) => (
                    <button 
                        onClick={() => choiceDevice(device.id)}
                        className={`${deviceId === device.id ? "selected " : ""}button`}
                        key={device.id}
                    >
                        {device.name}
                    </button>
                ))
            ) : (
                <Loading title="Aucun appareil trouvé" text="Sur téléphone ou ordinateur : Ouvre l'application Spotify" redirection="/login"/>
            )}
        </>
    );
}
