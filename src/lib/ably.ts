import Ably from "ably";

// Fonction pour récupérer ou générer le userId
const getUserId = () => {
  let storedUserId = localStorage.getItem("userId");

  if (!storedUserId) {
    // Générer un nouvel ID unique
    storedUserId = Math.random().toString(36).substr(2, 9);
    localStorage.setItem("userId", storedUserId);
  }

  return storedUserId;
};

// Fonction pour obtenir l'URL de l'API
export const getApiSocketUrl = () => {
  const userId = getUserId();
  return userId ? `/api/socket/${userId}` : '/api/socket';
};

// Exemple d'utilisation avec Ably
export const ably = new Ably.Realtime({
  authUrl: getApiSocketUrl(),
});
