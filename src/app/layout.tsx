import { AblyProvider } from "@/lib/ablyContext";
import AuthGuard from "@/components/AuthGuard";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="container">
        <AblyProvider>
          <AuthGuard>{children}</AuthGuard> {/* Vérifie l'authentification */}
        </AblyProvider>
      </body>
    </html>
  );
}
