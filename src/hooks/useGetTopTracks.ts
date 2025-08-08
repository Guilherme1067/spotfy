import { useQuery } from "@tanstack/react-query"
import { baseUrl } from "../lib/api";

interface ITrack {
    id: string;
    name: string;
    duration_ms: number;
    popularity: number;
    album: {
        name: string;
        images: {
            url: string;
            height: number;
            width: number;
        }[];
    };
    artists: {
        id: string;
        name: string;
    }[];
    external_urls: {
        spotify: string;
    };
}

interface ITopTracksResponse {
    tracks: ITrack[];
}

const fetchTopTracks = async ({ queryKey }: { queryKey: [string, string] }): Promise<ITopTracksResponse> => {
    const [, artistId] = queryKey;
    const res = await baseUrl.get(`/artists/${artistId}/top-tracks?market=BR`);
    return res.data;
}

export const useGetTopTracks = (artistId: string) => {
    return useQuery({
        queryKey: ["get-top-tracks", artistId],
        queryFn: fetchTopTracks,
        staleTime: 1000 * 60 * 20 // 20 minutos
    });
} 