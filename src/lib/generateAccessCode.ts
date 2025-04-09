  // Fonction pour générer un code basé sur l'année actuelle - 1
export const generateAccessCode = () => {
    const today = new Date();
    const year = today.getFullYear() - 1; // Année actuelle moins 1
    return `${year}`; // Code dynamique : année - 1
  };