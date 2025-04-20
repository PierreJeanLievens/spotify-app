import { Suspense } from "react";
import { AblyProvider } from "@/lib/ablyContext";
import AuthGuard from "@/components/AuthGuard";
import "./globals.css";
import Loading from "@/components/Loading";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="container">
        <AblyProvider>
          <Suspense fallback={<Loading title="Erreur de chargement" text="Vous n'etes pas sur la bonne page" redirection="/"/>}>
            <AuthGuard>{children}</AuthGuard>
          </Suspense>
        </AblyProvider>
      </body>
    </html>
  );
}
