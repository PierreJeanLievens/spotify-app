"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { generateAccessCode } from "@/lib/generateAccessCode";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const accessCode = sessionStorage.getItem("access_code");
    const correctCode = generateAccessCode(); // Récupère le code d'accès

    if (accessCode!=correctCode) {
      // Code incorrect -> redirection vers /
      router.push("/");
    } else {
      if (pathname === "/") {
        // Code correct et sur page d'accueil -> redirection vers /login
        router.push("/login");
      } else {
        // Code correct on reste sur la meme page
        setIsAuthorized(true);
      }
    }
  }, [pathname]);

  if (!isAuthorized && pathname !== "/") {
    return null; // Évite un rendu inutile avant la redirection
  }

  return <>{children}</>;
}
