/**
 * Cette fonction permet d'enlever les espaces et les tirets et de mettre en minuscule
 * @param str 
 * @returns 
 */
export default function normalizeString(str: string): string {
    return str.toLowerCase().replace(/[-\s]/g, "");
}