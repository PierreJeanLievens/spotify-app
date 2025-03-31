/**
 * Cette fonction suit la logique de la "distance de levenshtein"
 * Cette distance permet de determiner le nombre de changement à faire pour passer d'une chaine de charactère à une autre
 * ( +1 pour chaque suppression, modification et ajout)
 * (maison -> main = 2 suppresion de 's' et 'o')
 * @param a premier string
 * @param b deuxième string
 * @returns la distance entre les 2 string, plus le nombre est grand plus les chaines sont éloignées
 */
export default function levenshteinDistance(a: string, b: string): number {
    const matrix: number[][] = [];
  
    // Initialisation de la première ligne de la matrice de levenshtein
    for (let i = 0; i <= a.length; i++) {
      matrix[i] = [i];
    }
    // Initialisation de la première colonne de la matrice de levenshtein
    for (let j = 0; j <= b.length; j++) {
      matrix[0][j] = j;
    }
  
    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        if (a[i - 1] === b[j - 1]) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j - 1] + 1
          );
        }   
      }
    }
  
    return matrix[a.length][b.length];
  }