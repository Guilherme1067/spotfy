
import { Card, CardContent, CardDescription } from "./ui/card"
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "./ui/pagination"
import { TopTracks } from "./topTracks"
import { SearchInput } from "./searchInput"
import { useArtistDetails } from "./hooks/useArtistDetailsHook"
import { Loading } from "./loading"
import { ErrorFeedBack } from "./errorFeedBack"


export const ArtistDetails = () => {
    const { activeTab,
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
        albumsError } = useArtistDetails();

    if (isDetailsPagesLoading) {
        return <Loading />
    }

    if (artistsError || albumsError) {
        return (
            <ErrorFeedBack
                title="Erro ao carregar detalhes do artista"
                message="Não foi possível carregar as informações do artista. Verifique sua conexão e tente novamente."
                showHomeButton={true}
            />
        )
    }

    return (
        <div>
            <div className="flex justify-center mb-8">
                <Card className="group bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 ease-in-out hover:scale-105 shadow-lg hover:shadow-2xl max-w-md">
                    <CardContent className="flex flex-col aspect-square items-center justify-center p-6">
                        <div className="relative w-full h-full flex items-center justify-center">
                            <img
                                src={currentArtist?.images[0].url}
                                alt={`Foto de ${currentArtist?.name}`}
                                className="w-full h-full object-cover rounded-lg group-hover:brightness-110 transition-all duration-300"
                            />
                        </div>
                    </CardContent>

                    <CardDescription className="text-center p-6 bg-white/5">
                        <p className="text-2xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors">
                            {currentArtist?.name}
                        </p>
                        <div className="flex gap-2 items-center justify-center">
                            <span className="text-sm font-medium text-gray-300">Popularidade:</span>
                            <div className="flex items-center gap-2">
                                <div className="w-20 bg-gray-700 rounded-full h-3">
                                    <div
                                        className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-500"
                                        style={{ width: `${currentArtist?.popularity}%` }}
                                    ></div>
                                </div>
                                <span className="text-lg font-bold text-white">{currentArtist?.popularity}</span>
                            </div>
                        </div>
                    </CardDescription>
                </Card>
            </div>

            <div className="flex justify-center mb-8">
                <div className="flex bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-1">
                    <button
                        onClick={() => setActiveTab('albums')}
                        className={`px-6 py-3 rounded-md font-medium transition-all duration-300 ${activeTab === 'albums'
                            ? ' text-white  animate-pulse'
                            : 'text-gray-300 hover:red hover:bg-white/10'
                            }`}
                    >
                        🎵 Álbuns
                    </button>
                    <button
                        onClick={() => setActiveTab('tracks')}
                        className={`px-6 py-3 rounded-md font-medium transition-all duration-300 ${activeTab === 'tracks'
                            ? 'text-white animate-pulse'
                            : 'text-gray-300 hover:text-white hover:bg-white/10'
                            }`}
                    >
                        🎧 Top Tracks
                    </button>
                </div>
            </div>

            {activeTab === 'albums' ? (
                <div className="mb-8">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-white mb-2">Álbuns</h2>
                        <p className="text-gray-400">Discografia completa do artista</p>
                    </div>

                    <div className="mb-6 flex justify-center">
                        <SearchInput handleFilter={setAlbumFilter} value={albumFilter} isAlbum />

                    </div>

                    {albumFilter && (
                        <div className="text-center mb-4">
                            <p className="text-gray-400">
                                {filteredAlbums?.length === 0
                                    ? 'Nenhum álbum encontrado'
                                    : `${filteredAlbums?.length} álbum${filteredAlbums?.length !== 1 ? 's' : ''} encontrado${filteredAlbums?.length !== 1 ? 's' : ''}`
                                }
                            </p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredAlbums?.map(album => (
                            <Card key={album.id} className="group bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 ease-in-out hover:scale-105 shadow-lg hover:shadow-2xl">
                                <CardContent className="flex flex-col items-center p-6">
                                    <div className="relative w-full aspect-square mb-4">
                                        <img
                                            src={album.images[0]?.url}
                                            alt={album.name}
                                            className="w-full h-full object-cover rounded-lg group-hover:brightness-110 transition-all duration-300"
                                        />
                                    </div>

                                    <div className="text-center w-full">
                                        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-300 transition-colors line-clamp-2">
                                            {album.name}
                                        </h3>
                                        <p className="text-sm text-gray-400 mb-2">Lançamento: {album.release_date}</p>
                                        <p className="text-sm text-gray-400 mb-3">
                                            {album.total_tracks} faixas
                                        </p>

                                        <div className="flex items-center justify-center gap-2">
                                            <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full capitalize">
                                                {album.album_type}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {albumFilter && filteredAlbums?.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-gray-400 text-6xl mb-4">🎵</div>
                            <h3 className="text-xl font-semibold text-white mb-2">Nenhum álbum encontrado</h3>
                            <p className="text-gray-400">Tente buscar por outro termo</p>
                        </div>
                    )}

                    {!albumFilter && (
                        <div className="mt-6 flex justify-center">
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            size="default"
                                            className="cursor-pointer bg-white/10 hover:bg-white/20 text-white border-white/20"
                                            onClick={() => {
                                                if (page <= 0) return
                                                setPage(page - 1)
                                            }}
                                        />
                                    </PaginationItem>
                                    <div className="flex items-center gap-2 mx-4">
                                        <span className="text-white text-sm">
                                            Página {page + 1} de {totalPages}
                                        </span>
                                    </div>
                                    <PaginationItem>
                                        <PaginationNext
                                            size="default"
                                            className="cursor-pointer bg-white/10 hover:bg-white/20 text-white border-white/20"
                                            onClick={() => {
                                                if (totalPages && page + 1 >= totalPages) return
                                                setPage(page + 1)
                                            }}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    )}
                </div>
            ) : (
                <div>
                    {params.artistId && <TopTracks artistId={params.artistId} />}
                </div>
            )}
        </div>
    )
}