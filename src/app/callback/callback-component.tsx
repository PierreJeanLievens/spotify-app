"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const CallbackComponent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const urlCode = searchParams.get("code");
    if (!urlCode) return;

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

        localStorage.setItem("spotify_access_token", data.access_token);
        router.push("/playlist");
      } catch (error) {
        console.error(error);
      }
    };

    fetchAccessToken();
  }, [searchParams, router]);

  return <p>Connexion en cours...</p>;
};

export default CallbackComponent;
