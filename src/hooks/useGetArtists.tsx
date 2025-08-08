import { useQuery } from "@tanstack/react-query";
import { baseUrl } from "../lib/api";


export interface IArtist {
    name: string;
    id: string;
    popularity: number;
    images:
    {
        url: string;
        height: number;
        width: number;
    }[]
    followers: {
        total: number
    }

}

const fetchArtists = async ({ queryKey }: { queryKey: [string, string[]] }): Promise<IArtist[]> => {
    const [, artistiId] = queryKey;
    const res = await baseUrl.get(`/artists?ids=${artistiId.join(",").replaceAll(' ', '')}`);
    return res.data.artists
}

export const useGetArtists = (artistiId: string[]) => {
    return useQuery({
        queryKey: ["get-artists", artistiId],
        queryFn: fetchArtists,
        staleTime: 1000 * 60 * 20
    });
}