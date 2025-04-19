  // Fonction pour générer un code basé sur l'année actuelle - 1
export const generateAccessCode = () => {
    const today = new Date();
    const year = today.getFullYear() - 1; // Année actuelle moins 1
    return `${year}`; // Code dynamique : année - 1
  };

  export const hashCode = (code: string): string => {
    let hash = 0;
    for (let i = 0; i < code.length; i++) {
      hash = (hash << 5) - hash + code.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(36); // base36 = chiffres + lettres minuscules
  };
  

export const getHashedCorrectAccessCode = () => {
  const code = generateAccessCode();
  const hashedCode = hashCode(code);
  return hashedCode;
}

