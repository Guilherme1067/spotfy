import { AlertTriangle, Home } from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { useNavigate } from "react-router-dom"

interface ErrorFeedBackProps {
    title?: string
    message?: string
    onRetry?: () => void
    showHomeButton?: boolean
}

export const ErrorFeedBack = ({
    title = "Ops! Algo deu errado",
    message = "Não foi possível carregar o conteúdo. Tente novamente mais tarde.",
}: ErrorFeedBackProps) => {

    const navigate = useNavigate()

    const handleGoHome = () => {
        navigate('/')
    }

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="max-w-2xl mx-auto">
                <Card className="group bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 ease-in-out hover:scale-105 shadow-lg hover:shadow-2xl">
                    <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                        <div className="relative mb-8">
                            <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                                <AlertTriangle className="w-12 h-12 text-red-400" />
                            </div>
                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-bold">!</span>
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold text-white mb-4">{title}</h2>
                        <p className="text-gray-400 text-lg mb-8 max-w-md leading-relaxed">
                            {message}
                        </p>

                        <Button
                            onClick={handleGoHome}
                            variant="outline"
                            className="flex items-center gap-2 border-white/20 text-white hover:bg-white/10 font-semibold py-3 px-6 rounded-lg transition-all duration-300"
                        >
                            <Home className="w-4 h-4" />
                            Voltar ao Início
                        </Button>

                        <div className="mt-8 p-4 bg-white/5 rounded-lg border border-white/10">
                            <p className="text-sm text-gray-400">
                                Se o problema persistir, verifique sua conexão com a internet ou tente novamente em alguns minutos.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div >
    )
}