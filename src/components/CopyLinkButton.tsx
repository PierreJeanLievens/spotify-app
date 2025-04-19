"use client";

import { useState } from "react";

export default function CopyLinkButton({ roomId }: { roomId: any }) {
  const [copied, setCopied] = useState(false);
  const link = `${window.location.origin}/join-room/${roomId}`;

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
      {copied ? "Lien copié ! ✅" : "Copier le lien d'invitation"}
    </button>
  );
}
