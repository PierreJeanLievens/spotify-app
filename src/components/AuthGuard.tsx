"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
// import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { getHashedCorrectAccessCode } from "@/lib/manageAccessCode";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  // const searchParams = useSearchParams();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const sessionAccessCode = sessionStorage.getItem("access_code"); // Récupère le code hashé stocké
    // const urlAccessCode = searchParams.get("accessCode"); // ✅ récupère depuis l'URL
    const urlAccessCode = "wy68"// ✅ récupère depuis l'URL
    const correctCode = getHashedCorrectAccessCode(); // On récupère le hash du code

    const validCode = sessionAccessCode || urlAccessCode;

    if (validCode !== correctCode) {
      router.push("/"); // 🚫 Code incorrect -> redirection
    } else {
      
      // ✅ Code valide : enregistre-le si reçu depuis l'URL
      if (!sessionAccessCode && urlAccessCode) {
        sessionStorage.setItem("access_code", urlAccessCode);
      }

      if (pathname === "/") {
        // Code correct et sur page d'accueil -> redirection vers /login
        router.push("/login");
      } else {
        // Code correct on reste sur la meme page
        setIsAuthorized(true);
      }
    }
  }, [pathname, searchParams]);

  if (!isAuthorized && pathname !== "/") {
    return null; // Évite un rendu inutile avant la redirection
  }

  return <>{children}</>;
}
