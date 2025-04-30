import { useRouter } from "next/navigation";
import styles from './LogoutButton.module.css'
export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/logout");
    router.push("/");
  };

  return <button className={`button ${styles.logout_button}`} onClick={handleLogout}>Déconnexion</button>;
}