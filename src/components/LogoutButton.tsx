import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/logout");
    router.push("/");
  };

  return <button className='button' onClick={handleLogout}>Déconnexion</button>;
}