import { useRouter } from "next/navigation";
import styles from './LogoutButton.module.css'

export default function LogoutButton({ onLogout }: { onLogout?: () => void }) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/logout");
    if (onLogout) onLogout(); // 👈 Notifie le parent
    router.push("/"); // tu peux garder ou supprimer selon ton besoin
  };

  return (
    <button className={`button ${styles.logout_button}`} onClick={handleLogout}>
      Déconnexion
    </button>
  );
}
