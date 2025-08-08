import { useQuery } from "@tanstack/react-query"
import { baseUrl } from "../lib/api";

interface IAlbumReponse {
    limit: number,
    offset: number,
    previous: string | null,
    total: number,
    items: {
        album_type: string,
        id: string,
        images: {
            url: string,
            height: number,
            width: number
        }[],
        name: string,
        release_date: string,
        total_tracks: number,
        type: string,
        uri: string
    }[]

}

const fetchAlbum = async ({ queryKey }: { queryKey: [string, string, number] }): Promise<IAlbumReponse> => {
    const [, artistId, offset] = queryKey;
    console.log({ queryKey })
    const res = await baseUrl.get(`/artists/${artistId}/albums?include_groups=album&limit=10&offset=${offset}`);

    return res.data
}

export const useGetArtistAlbum = (artistId: string, offset: number) => {
    return useQuery({
        queryKey: ["get-artist-album", artistId, offset],
        queryFn: fetchAlbum,
    })
}
