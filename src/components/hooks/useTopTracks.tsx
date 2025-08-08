import { useState } from "react";
import { useGetTopTracks } from "../../hooks/useGetTopTracks";

export const useTopTracks = (artistId: string) => {
    const { data: topTracks, isLoading: isTopTracksLoading } = useGetTopTracks(artistId)
    const [trackFilter, setTrackFilter] = useState('');


    const filteredTracks = topTracks?.tracks.filter(track => track.name.toLowerCase().includes(trackFilter.toLowerCase()))

    return {
        filteredTracks,
        setTrackFilter,
        trackFilter,
        isTopTracksLoading
    }
}