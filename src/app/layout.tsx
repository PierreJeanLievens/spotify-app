import { Suspense } from "react";
import { AblyProvider } from "@/lib/ablyContext";
import AuthGuard from "@/components/auth/AuthGuard";
import "./globals.css";
import Loading from "@/components/ui/Loading";
import NavBar from "@/components/ui/NavBar";
import Footer from "@/components/ui/Footer";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="container">
        <NavBar/>
        <AblyProvider>
          <Suspense fallback={<Loading title="Erreur de chargement" text="Vous n'etes pas sur la bonne page" redirection="/"/>}>
            <AuthGuard>{children}</AuthGuard>
          </Suspense>
        </AblyProvider>
        <Footer/>
      </body>
    </html>
  );
}
