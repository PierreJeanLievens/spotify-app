"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getHashedCorrectAccessCode, hashCode } from "@/lib/manageAccessCode";
import styles from "./page.module.css"

export default function HomePage() {
  const [inputCode, setInputCode] = useState("");
  const [error, setError] = useState("");
  const [displayError, setDisplayError] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [canSubmit, setCanSubmit] = useState(true);
  const router = useRouter();

  const hashedCorrectCode = getHashedCorrectAccessCode(); // Récupère le code d'accès

  useEffect(() => {
    if (attempts >= 3) {
      setCanSubmit(false);
      setError("Trop de tentatives, réessayez dans 10 secondes.");
      setDisplayError(true);
      setTimeout(() => {
        setAttempts(0);
        setCanSubmit(true); // Réactive après 10 secondes
        
      }, 10 * 1000); // Temps de blocage de 10 secondes
    }
  }, [attempts]);

  useEffect(() => {
    if(displayError){
      setTimeout(() => {
      setDisplayError(false);
      }, 3 * 1000);
    }
  }, [displayError])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!canSubmit) {
      setError("Trop de tentatives, réessayez plus tard.");
      console.log("Trop de réponse")
      setDisplayError(true);
      return;
    }
    const hashedCode = hashCode(inputCode);
    if (hashedCode === hashedCorrectCode) {
      sessionStorage.setItem("access_code", hashedCode); // Stocke le code dans le sessionStorage
      router.push("/login"); // Redirige vers la page de jeu
    } else {
      setAttempts(attempts + 1); // Incrémente le compteur de tentatives
      setError("Code incorrect, essaye encore !");
      setDisplayError(true);
    }
  };

  return (
    <main className={`${styles.access__main}`}>
      <div className={`${styles.access__container}`}>
        <h1 className={`${styles.access__title}`}>🔑 Accès au Blind Test</h1>
        <form onSubmit={handleSubmit} className={`${styles.access__form}`}>
          <input
            type="text"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            className={`${styles.access__input}`}
            placeholder="Entrez le code"
            disabled={!canSubmit}
          />
          <button
            type="submit"
            className={`${styles.access__button} button`}
            disabled={!canSubmit}
          >
            Valider
          </button>
        </form>
        <p
          className={`${styles.access__error} ${displayError || !canSubmit ? styles.visible : styles.hidden}`}
        >
          {error}
        </p>
      </div>
    </main>
  );
    
}
