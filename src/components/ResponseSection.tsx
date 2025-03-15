import styles from "@/components/ResponseSection.module.css";
import { Player, Track } from "@/types/spotify";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ResponseSection({ track, isVisible, onClose }: { track: Track, isVisible: boolean; onClose: () => void }) {
    const [inputTrack, setInputTrack] = useState<string | null>(null);
    const [inputArtist, setInputArtist] = useState<string | null>(null);
    const [playerChoose, setPlayerChoose] = useState<Player | null>(null);
    const [parsedPlayers, setParsedPlayers] = useState<Player[]>([]);
    const router = useRouter();

    useEffect(() => {
        const storedPlayers = localStorage.getItem("players");
        if (storedPlayers) {
            const parsed = JSON.parse(storedPlayers);
            if (parsed.length < 1) {
                router.push(`/game-setup`);
            } else {
                setParsedPlayers(parsed);
            }
        } else {
            router.push(`/game-setup`);
        }
    }, []);

    const handlePlayer = (player: Player) => {
        setPlayerChoose(player);
    };

    const handleInputTrackChange = (e: any) => {
        setInputTrack(e.target.value);
    }
    const handleInputArtistChange = (e: any) => {
        setInputArtist(e.target.value);
    }

    const confirmInput = () => {
        if(track){
            if(inputTrack==track?.name){
                console.log("Bien");
            }
            if(inputArtist==track?.artist[0].name){
                console.log("Bien 2");
            }
        }
        console.log(inputArtist);

    }

    return (
        <div className={`${styles.modal} ${isVisible ? styles.display : ""}`}>
            <div className={styles.container}>
                <h2 className={styles.title}>Title</h2>
                {parsedPlayers.map((player, index) => (
                    <button
                        key={index}
                        className={`${styles.button__player} button ${playerChoose?.name === player.name ? "selected" : ""}`}
                        onClick={() => handlePlayer(player)}
                    >
                        {player.name}
                    </button>
                ))}
                <input placeholder="Titre" type="text" id="track_name_input" onChange={(e) => handleInputTrackChange(e)}/>
                <input placeholder="Artiste" type="text" id="artist_name_input" onChange={(e) => handleInputArtistChange(e)}/>
                <button 
                    className={`${styles.button__player} button`}
                    onClick={() => confirmInput()}
                >
                    Valider
                </button>
                <button className={styles.closeButton} onClick={onClose}>
                    Fermer
                </button>
            </div>
        </div>
    );
}
