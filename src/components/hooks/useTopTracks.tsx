import { useState, useMemo } from "react";
import { useGetTopTracks } from "../../hooks/useGetTopTracks";

export const useTopTracks = (artistId: string) => {
    const { data: topTracks, isLoading: isTopTracksLoading } = useGetTopTracks(artistId)
    const [trackFilter, setTrackFilter] = useState('');


    const filteredTracks = useMemo(() => 
        topTracks?.tracks.filter(track => 
            track.name.toLowerCase().includes(trackFilter.toLowerCase())
        ), 
        [topTracks?.tracks, trackFilter]
    )

    return {
        filteredTracks,
        setTrackFilter,
        trackFilter,
        isTopTracksLoading
    }
}