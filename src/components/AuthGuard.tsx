"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const accessCode = sessionStorage.getItem("access_code");

    const generateCode = () => {
      const today = new Date();
      const year = today.getFullYear() - 1; // Année actuelle moins 1
      return `${year}`; // Code dynamique : année - 1
    };

  const correctCode = generateCode(); 

    if (accessCode!=correctCode && pathname !== "/") {
      router.push("/");
    } else {
      setIsAuthorized(true);
    }
  }, [pathname]);

  if (!isAuthorized && pathname !== "/") {
    return null; // Évite un rendu inutile avant la redirection
  }

  return <>{children}</>;
}
