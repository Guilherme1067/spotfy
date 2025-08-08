import { useState, useMemo } from "react"
import { useGetArtists } from "../../hooks/useGetArtists";
import { ARTISTIS_ID } from "../../consts/artistIds";
import { useGetArtistAlbum } from "../../hooks/useGetAlbums";
import { useParams } from "react-router-dom";

type TabType = 'albums' | 'tracks';

export const useArtistDetails = () => {
    const [page, setPage] = useState(0)
    const [activeTab, setActiveTab] = useState<TabType>('albums')
    const [albumFilter, setAlbumFilter] = useState('')
    const offset = page * 10
    const params = useParams<{ artistId: string }>()

    const { data: artists, isLoading, error: artistsError } = useGetArtists(ARTISTIS_ID)
    const { data: albums, isLoading: isAlbumsLoading, error: albumsError } = useGetArtistAlbum(params.artistId!, offset)

    const totalPages = albums && Math.ceil(albums.total / 10)
    const currentArtist = artists?.filter(artist => artist.id === params.artistId)[0]

    const filteredAlbums = useMemo(() =>
        albums?.items.filter(album =>
            album.name.toLowerCase().includes(albumFilter.toLowerCase())
        ),
        [albums?.items, albumFilter]
    )


    const isDetailsPagesLoading = isAlbumsLoading || isLoading

    return {
        activeTab,
        setActiveTab,
        setAlbumFilter,
        totalPages,
        currentArtist,
        filteredAlbums,
        setPage,
        albumFilter,
        isDetailsPagesLoading,
        page,
        params,
        artistsError,
        albumsError
    }
}