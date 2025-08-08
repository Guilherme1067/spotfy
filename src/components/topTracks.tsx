
import { Loading } from "./loading"
import { Card, CardContent } from "./ui/card"

import { SearchInput } from "./searchInput"
import { useTopTracks } from "./hooks/useTopTracks";

export const TopTracks = ({ artistId }: { artistId: string; }) => {
    const { filteredTracks,
        setTrackFilter,
        trackFilter,
        isTopTracksLoading } = useTopTracks(artistId)

    if (isTopTracksLoading) {
        return <Loading />
    }

    return (
        <div className="mb-8">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Top Tracks</h2>
                <p className="text-gray-400">As músicas mais populares do artista</p>
            </div>

            <div className="mb-6 flex justify-center">
                <SearchInput handleFilter={setTrackFilter} value={trackFilter} />
            </div>

            {trackFilter && (
                <div className="text-center mb-4">
                    <p className="text-gray-400">
                        {!filteredTracks || filteredTracks.length === 0
                            ? 'Nenhuma música encontrada'
                            : `${filteredTracks.length} música${filteredTracks.length !== 1 ? 's' : ''} encontrada${filteredTracks.length !== 1 ? 's' : ''}`
                        }
                    </p>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredTracks?.map((track, index) => (
                    <Card key={track.id} className="group bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 ease-in-out hover:scale-105 shadow-lg hover:shadow-2xl">
                        <CardContent className="flex flex-col items-center p-6">
                            <div className="relative w-full aspect-square mb-4">
                                <img
                                    src={track.album.images[0]?.url}
                                    alt={track.name}
                                    className="w-full h-full object-cover rounded-lg group-hover:brightness-110 transition-all duration-300"
                                />
                                <div className="absolute top-2 right-2 bg-black/80 text-white px-2 py-1 rounded-full text-xs font-bold">
                                    #{index + 1}
                                </div>
                            </div>

                            <div className="text-center w-full">
                                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-300 transition-colors line-clamp-2">
                                    {track.name}
                                </h3>
                                <p className="text-sm text-gray-400 mb-2">Álbum: {track.album.name}</p>
                                <p className="text-sm text-gray-400 mb-3">
                                    {Math.floor(track.duration_ms / 60000)}:{(track.duration_ms % 60000 / 1000).toFixed(0).padStart(2, '0')}
                                </p>

                                <div className="flex items-center justify-center gap-2">
                                    <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full">
                                        {track.popularity}% popularidade
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

        </div>
    )
}