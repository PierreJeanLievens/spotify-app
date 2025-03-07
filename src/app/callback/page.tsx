"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const CallbackPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [code, setCode] = useState<string | null>(null); // Empêche le SSR d'évaluer `useSearchParams()`

  useEffect(() => {
    const urlCode = searchParams.get("code");
    if (!urlCode) return;

    setCode(urlCode); // Définit le code après le premier rendu client

    const fetchAccessToken = async () => {
      try {
        const response = await fetch("/api/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: urlCode }),
        });

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération du token");
        }

        const data = await response.json();
        console.log("🔑 Token récupéré :", data.access_token);

        // Sauvegarde le token et redirige vers le profil
        localStorage.setItem("spotify_access_token", data.access_token);
        router.push("/profile");
      } catch (error) {
        console.error(error);
      }
    };

    fetchAccessToken();
  }, [searchParams, router]);

  return <p>Connexion en cours...</p>;
};

export default CallbackPage;
