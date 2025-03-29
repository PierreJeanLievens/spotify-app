"use client"
import { fetchNumberSavedTracks } from "@/lib/fetchData"

export default function Page() {
    
    const handleTest = async () => {
        const response = await fetchNumberSavedTracks();
        console.log("Test reponse ", response)
    }

    return(
        <>
        <button className="button" onClick={handleTest}>Test</button>
        </>
    )
}