// Cette fonction permet de vérifier la présence du token
/**
 * 
 * @param router permet de rediriger le path si besoin
 * @returns 
 */
export const checkToken = async (router: any) => {
    try {
        const token = localStorage.getItem("spotify_access_token");
        if (!token) {
            throw new Error("Erreur lors de la récupération du token");
        }
        return token;
    } catch (error) {
        console.error(error);
        router.push("/");
    }
};
