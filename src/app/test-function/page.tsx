"use client"
import { fetchNewSavedTrack } from "@/lib/fetchData"

export default function Page() {
    
    const handleTest = async () => {
        const response = await fetchNewSavedTrack();
        console.log("Test reponse ", response)
    }

    return(
        <>
        <button className="button" onClick={handleTest}>Test</button>
        </>
    )
}