import { useGetArtists } from "../hooks/useGetArtists"
import { Card, CardContent, CardDescription } from "./ui/card"
import { useNavigate } from "react-router-dom";
import { ARTISTIS_ID } from "../consts/artistIds";

import { ErrorFeedBack } from "./errorFeedBack";
import { Loading } from "./loading";
import { Play } from "lucide-react";

export const Artists = () => {
    const navigate = useNavigate();

    function handleAlbumClick(artistId: string) {
        console.log('artistId', artistId)
        navigate(`/artist/${artistId}`)
    }

    const { data: artists, error, isLoading } = useGetArtists(ARTISTIS_ID)

    if (isLoading) {
        return <Loading />
    }

    if (error) {
        return (
            <ErrorFeedBack
                title="Erro ao carregar artistas"
                message="Não foi possível carregar a lista de artistas. Verifique sua conexão e tente novamente."
                showHomeButton={true}
            />
        )
    }

    return (
        <div>
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-white mb-2">Artistas em Destaque</h1>
                <p className="text-gray-400 text-lg">Descubra os melhores artistas da música</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {artists?.map(artist => (
                    <Card
                        onClick={() => handleAlbumClick(artist.id)}
                        key={artist.id}
                        className="group bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:animate-pulse cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 shadow-lg hover:shadow-2xl"
                    >
                        <CardContent className="flex flex-col aspect-square items-center justify-center p-4">
                            <div className="relative w-full h-full flex items-center justify-center">
                                <img
                                    src={artist.images[0].url}
                                    alt={`Foto de ${artist.name}`}
                                    className="w-full h-full object-cover rounded-lg group-hover:brightness-110 transition-all duration-300"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 rounded-lg flex items-center justify-center">
                                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-300">
                                        <div className="bg-white/90 rounded-full p-3">
                                            <Play className="w-6 h-6 text-black" fill="currentColor" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>

                        <CardDescription className="text-center p-4 bg-white/5">
                            <p className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                                {artist.name}
                            </p>
                            <div className="flex gap-2 items-center justify-center">
                                <span className="text-sm font-medium text-gray-300">Popularidade:</span>
                                <div className="flex items-center gap-1">
                                    <div className="w-16 bg-gray-700 rounded-full h-2">
                                        <div
                                            className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${artist.popularity}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-sm font-bold text-white">{artist.popularity}</span>
                                </div>
                            </div>
                            <p className="text-xs text-gray-400 mt-2">
                                Clique para ver detalhes
                            </p>
                        </CardDescription>
                    </Card>
                ))}
            </div>

        </div>
    )
}