import levenshteinDistance from "@/lib/verifiyResponses/levenshteinDistance";
import normalizeString from "@/lib/verifiyResponses/normalizeString";

/**
 * Fonction permettant de calculer le nombre de points pour l'input artiste
 * @param list tableau d'objet contenant le nom des artistes du morceau
 * @param input 
 * @returns le nombre de points en fonction de la différence
 */
function verifyArtistInput(list: { name: string }[], input: string): number {
const normalizedInput = normalizeString(input);
console.log(normalizedInput)
for (const item of list) {
    const normalizedItem = normalizeString(item.name);
    
    const distance = levenshteinDistance(normalizedItem, normalizedInput);

    if (distance === 0) return 900;
    if (distance === 1 ) return 700;
}


return 0;
}
/**
 * Fonction permettant de calculer le nombre de points pour l'input du titre du morceau
 * @param trackName le nom du morceau
 * @param input l'input du client pour le titre du morceau
 * @returns le nombre de points en fonction de la différence
 */
function verifyTrackNameInput( trackName: string , input: string): number {
    const normalizedInput = normalizeString(input);
    const normalizedTrackName = normalizeString(trackName);
    
    const distance = levenshteinDistance(normalizedTrackName, normalizedInput);
    
    if (distance === 0) return 900;
    if (distance === 1 ) return 700;

    return 0;
    }


/**
 * Fonction permettant de calculer le nombre de point de la question 
 * @param list liste des objets contenant le nom des artistes du morceau
 * @param inputArtist input du client pour artiste
 * @param trackName nom du morceau
 * @param inputTrack input du client pour nom du morceau
 * @returns un objet {artistPoints, trackPoints, bonus}
 */
export function verifiyInputs(list: { name: string }[], inputArtist: string, trackName: string , inputTrack: string){
    // let result = 0;
    // result += verifyArtistInput(list, inputArtist);
    // result += verifyTrackNameInput(trackName, inputTrack);
    // if(result >= 1400) {
    //     result += 200;
    // }
    // return result;
    
    const artistPoints: number = verifyArtistInput(list, inputArtist);
    const trackPoints: number =  verifyTrackNameInput(trackName, inputTrack);

    let bonus :number = 0;
    if(artistPoints!= 0 && trackPoints!= 0){
        bonus = 200;
    }
    const result2 = {artistPoints : artistPoints, trackPoints : trackPoints, bonus : bonus}

    return result2;
}