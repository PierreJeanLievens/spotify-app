// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { checkToken } from "@/lib/checkToken";

// const ProfilePage = () => {
//   const [profile, setProfile] = useState<any>(null);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchProfile = async () => {
//       const token = await checkToken(router);

//       try {
//         const response = await fetch("https://api.spotify.com/v1/me", {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (!response.ok) {
//           throw new Error("Échec de récupération du profil");
//         }

//         const data = await response.json();
//         setProfile(data);
//         console.log(data);
//       } catch (error) {
//         console.error(error);
//         router.push("/");
//       }
//     };

//     fetchProfile();
//   }, [router]);

//   if (!profile) {
//     return <p>Chargement du profil...</p>;
//   }

//   return (
//     <div>
//       <h1>Bienvenue, {profile.display_name}</h1>
//       {profile.images?.length > 0 && (
//         <img src={profile.images[0].url} alt="Avatar" width={100} />
//       )}
//       <p>Email: {profile.email}</p>
//       <p>ID: {profile.id}</p>
//       <p>Spotify: <a href={profile.external_urls.spotify} target="_blank">Voir sur Spotify</a></p>
//       <button onClick={() => {
//         document.cookie = "spotify_access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
//         router.push("/");
//       }}>Déconnexion</button>
//     </div>
//   );
// };

// export default ProfilePage;
export default function Page () {
  return(
    <h1>Profile</h1>
  )
}