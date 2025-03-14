"use client";

import { fetchDevices } from "@/lib/fetchData";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./DevicesChoice.module.css"

export default function DevicesChoice() {
    const router = useRouter();
    const [devices, setDevices] = useState<any[]>([]);
    const [deviceId, setDeviceId] = useState<string | null>(null);

    // Charger le device sauvegardé au montage
    useEffect(() => {
        const fetchDevicesList = async () => {
            const devicesFetched = await fetchDevices(router);
            setDevices(devicesFetched);
            const storedDeviceId = localStorage.getItem("device_id");
            setDeviceId(storedDeviceId);

        };
        fetchDevicesList();
    }, []);

    // Mettre à jour la liste des devices en continu
    useEffect(() => {
        const fetchDevicesList = async () => {
            
            const fetchedDevices = await fetchDevices(router);
            setDevices(fetchedDevices);
            // Vérifier si le device sélectionné est encore disponible
            if (deviceId && !fetchedDevices.some((device: any) => device.id === deviceId)) {
                const newDeviceId = fetchedDevices.length > 0 ? fetchedDevices[0].id : null;
                setDeviceId(newDeviceId);
                if (newDeviceId) {
                    localStorage.setItem("device_id", newDeviceId);
                } else {
                    localStorage.removeItem("device_id");
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
                <div className={styles.modal}>
                    <div className={styles.no_devices_box}>
                        <p className={`${styles.title} ${styles.bold}`}>Aucun appareil trouvé</p>
                        <p className={`${styles.content} ${styles.bold}`}>Connecte un de tes appareils à Spotify</p>
                        <p className={styles.content}>Sur téléphone ou ordinateur : Ouvre l'application Spotify</p>
                    </div>
                    
                </div>
            )}
        </>
    );
}
