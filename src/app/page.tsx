import LoginButton from "@/components/LoginButton";
import Link from "next/link";

export default function Home() {
  return (
    <main style={{ textAlign: "center", padding: "50px" }}>
      <h1>Bienvenue sur Spotify App 🎵</h1>
      <LoginButton />
      <Link href="/room">
        <button>Room</button>
      </Link>
    </main>
  );
}
