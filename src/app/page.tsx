"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [canSubmit, setCanSubmit] = useState(true);
  const router = useRouter();

  // Fonction pour générer un code basé sur l'année actuelle - 1
  const generateCode = () => {
    const today = new Date();
    const year = today.getFullYear() - 1; // Année actuelle moins 1
    return `${year}`; // Code dynamique : année - 1
  };

  const correctCode = generateCode(); // Génère le code basé sur l'année

  useEffect(() => {
    if (attempts >= 3) {
      setCanSubmit(false);
      setTimeout(() => {
        setAttempts(0);
        setCanSubmit(true); // Réactive après 30 secondes
      }, 30000); // Temps de blocage de 30 secondes
    }
  }, [attempts]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!canSubmit) {
      setError("Trop de tentatives, réessayez plus tard.");
      return;
    }

    if (code === correctCode) {
      sessionStorage.setItem("access_code", code); // Stocke le code dans le sessionStorage
      router.push("/login"); // Redirige vers la page de jeu
    } else {
      setAttempts(attempts + 1); // Incrémente le compteur de tentatives
      setError("Code incorrect, essaye encore !");
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-80 text-center">
        <h1 className="text-2xl font-bold mb-4">🔑 Accès au Blind Test</h1>
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="px-4 py-2 border border-gray-600 rounded-md text-black w-full"
            placeholder="Entrez le code"
            disabled={!canSubmit} // Désactive le champ si trop de tentatives
          />
          <button
            type="submit"
            className="mt-4 px-6 py-2 bg-green-500 rounded-md hover:bg-green-700 transition"
            disabled={!canSubmit} // Désactive le bouton si trop de tentatives
          >
            Valider
          </button>
        </form>
        {error && <p className="text-red-500 mt-3">{error}</p>}
      </div>
    </main>
  );
}
