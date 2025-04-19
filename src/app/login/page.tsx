import LoginButton from "@/components/LoginButton";
import ButtonLink from "@/components/ButtonLink";
import CopyLinkButton from "@/components/CopyLinkButton";

export default function Home() {
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>Bienvenue sur Spotify App 🎵</h1>
      <div>
        <LoginButton />
        <ButtonLink text="Rejoindre Salon" path="/join-room"/>
      </div>
      <CopyLinkButton page="login"/>
    </div>
  );
}
