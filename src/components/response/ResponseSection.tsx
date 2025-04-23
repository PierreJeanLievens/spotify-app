import styles from "@/components/ResponseSection.module.css";
import { PlayerOld, Track } from "@/types/spotify";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function ResponseSection({ track, isVisible, onClose, nextTrack }: { track: Track, isVisible: boolean, onClose: () => void, nextTrack: () => void }) {
    const [inputTrack, setInputTrack] = useState<string | null>(null);
    const [inputArtist, setInputArtist] = useState<string | null>(null);
    const [playerChoose, setPlayerChoose] = useState<PlayerOld | null>(null);
    const [parsedPlayers, setParsedPlayers] = useState<PlayerOld[]>([]);
    const router = useRouter();
    const inputTrackRef = useRef<HTMLInputElement | null>(null);
    const inputArtistRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        const storedPlayers = localStorage.getItem("players");
        console.log(track);
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

    // Lorsque le track change (nextTrack)
    useEffect(() => {
        console.log("nouveau titre")
        setInputTrack(null);
        setInputArtist(null);
        setPlayerChoose(null);

        // Supprimer les classes et réactiver les inputs
        if (inputTrackRef.current) {
            inputTrackRef.current.classList.remove(styles.correct, styles.incorrect, styles.disabled);
            inputTrackRef.current.disabled = false;
        }
        if (inputArtistRef.current) {
            inputArtistRef.current.classList.remove(styles.correct, styles.incorrect, styles.disabled);
            inputArtistRef.current.disabled = false;
        }
    }, [track]);

    const handlePlayer = (player: PlayerOld) => {
        setPlayerChoose(player);
    };

    const handleInputTrackChange = (e: any) => {
        setInputTrack(e.target.value);
    };

    const handleInputArtistChange = (e: any) => {
        setInputArtist(e.target.value);
    };


    const confirmInput = () => {
        if (playerChoose) {
            if (track) {
                console.log(inputTrack) 
                console.log(track?.name)
                if (inputTrackRef.current) {
                    if (inputTrack === track?.name) {
                        console.log("Bonne réponse pour le titre !");
                        inputTrackRef.current.classList.add(styles.correct);
                        inputTrackRef.current.classList.remove(styles.incorrect);
                        inputTrackRef.current.disabled = true;
                    } else {
                        console.log("Mauvaise réponse pour le titre !");
                        inputTrackRef.current.classList.add(styles.incorrect);
                    }
                }

                if (inputArtistRef.current) {
                    if (inputArtist === track?.artists[0]?.name) {
                        console.log("Bonne réponse pour l'artiste !");
                        inputArtistRef.current.classList.add(styles.correct);
                        inputArtistRef.current.classList.remove(styles.incorrect);
                        inputArtistRef.current.disabled = true;
                    } else {
                        console.log("Mauvaise réponse pour l'artiste !");
                        inputArtistRef.current.classList.add(styles.incorrect);
                    }
                }
            }
        } else {
            console.log("Aucun joueur sélectionné");
        }
    };

    const handleNextTrack = () => {
        nextTrack(); // Exécute la fonction nexTrack de `page.tsx`
    };

    return (
        <div className={`${styles.modal} ${isVisible ? styles.display : ""}`}>
            <div className={styles.container}>
                <h2 className={styles.title}>Title</h2>

                <button className={styles.closeButton} onClick={onClose}>
                    Fermer
                </button>

                <div className={styles.container__players}>
                    {parsedPlayers.map((player, index) => (
                        <button
                            key={index}
                            className={`${styles.button__player} button ${playerChoose?.name === player.name ? "selected" : ""}`}
                            onClick={() => handlePlayer(player)}
                        >
                            {player.name}
                        </button>
                    ))}
                </div>

                <div className={styles.container__inputs}>
                    <div className={styles.row}>
                        <label className={styles.label} htmlFor="track_name_input">Titre : </label>
                        <input ref={inputTrackRef} className={styles.input} id="track_name_input" value={inputTrack ?? ""} placeholder="Titre" type="text" onChange={(e) => handleInputTrackChange(e)}/>
                    </div>
                    <div className={styles.row}>
                        <label className={styles.label} htmlFor="artist_name_input">Artiste(s) : </label>
                        <input ref={inputArtistRef} className={styles.input} id="artist_name_input" value={inputArtist ?? ""} placeholder="Artiste" type="text" onChange={(e) => handleInputArtistChange(e)}/>
                    </div>
                </div>

                <button 
                    className={`${styles.confirm__button} button`}
                    onClick={() => confirmInput()}
                >Valider</button>

                <button 
                    className={`${styles.confirm__button} button`}
                    onClick={handleNextTrack} // Appelle nextTrack au clic
                >Suivant</button>

                
            </div>
        </div>
    );
}
