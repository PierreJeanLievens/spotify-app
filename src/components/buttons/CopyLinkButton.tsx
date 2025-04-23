"use client";

import { getHashedCorrectAccessCode } from "@/lib/manageAccessCode";
import { useState } from "react";

export default function CopyLinkButton({ page }: { page: string }) {
  const [copied, setCopied] = useState(false);
  const correctCode = getHashedCorrectAccessCode(); // On récupère le code correct hashé
  const link = `${window.location.origin}/${page}?accessCode=${correctCode}`; // On crée le lien que l'on veut partager

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Réinitialise l'état après 2s
    } catch (err) {
      console.error("Erreur lors de la copie :", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="button"
    >
      {copied ? "Lien copié !" : "Copier le lien d'invitation"}
    </button>
  );
}
