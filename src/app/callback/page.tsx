"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const CallbackPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const code = searchParams.get("code");

  useEffect(() => {
    if (!code) return;

    const fetchAccessToken = async () => {
      try {
        const response = await fetch("/api/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
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
  }, [code, router]);

  return <p>Connexion en cours...</p>;
};

export default CallbackPage;
