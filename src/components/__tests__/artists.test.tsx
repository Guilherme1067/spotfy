import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Artists } from '../artists'
import { useGetArtists } from '../../hooks/useGetArtists'
import { ARTISTIS_ID } from '../../consts/artistIds'

// Mock dos hooks e dependências
vi.mock('../../hooks/useGetArtists')

const mockNavigate = vi.fn()
vi.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate
}))

vi.mock('../errorFeedBack', () => ({
    ErrorFeedBack: ({ title, message, showHomeButton }: { title: string; message: string; showHomeButton: boolean }) => (
        <div data-testid="error-feedback">
            <h2>{title}</h2>
            <p>{message}</p>
            {showHomeButton && <button>Voltar ao Início</button>}
        </div>
    )
}))

vi.mock('../loading', () => ({
    Loading: () => <div data-testid="loading">Carregando...</div>
}))

const mockUseGetArtists = vi.mocked(useGetArtists)

describe('Artists Component', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    const mockArtists = [
        {
            id: '1',
            name: 'Kendrick Lamar',
            popularity: 95,
            images: [
                {
                    url: 'https://example.com/kendrick.jpg',
                    height: 300,
                    width: 300
                }
            ],
            followers: {
                total: 1000000
            }
        },
        {
            id: '2',
            name: 'Michael Jackson',
            popularity: 100,
            images: [
                {
                    url: 'https://example.com/michael.jpg',
                    height: 300,
                    width: 300
                }
            ],
            followers: {
                total: 5000000
            }
        },
        {
            id: '3',
            name: 'Bruno Mars',
            popularity: 90,
            images: [
                {
                    url: 'https://example.com/bruno.jpg',
                    height: 300,
                    width: 300
                }
            ],
            followers: {
                total: 2000000
            }
        }
    ]

    it('should render loading state', () => {
        mockUseGetArtists.mockReturnValue({
            data: undefined,
            error: null,
            isLoading: true
        })

        render(<Artists />)

        expect(screen.getByTestId('loading')).toBeInTheDocument()
        expect(screen.getByText('Carregando...')).toBeInTheDocument()
    })

    it('should render error state', () => {
        mockUseGetArtists.mockReturnValue({
            data: undefined,
            error: new Error('Failed to fetch'),
            isLoading: false
        })

        render(<Artists />)

        expect(screen.getByTestId('error-feedback')).toBeInTheDocument()
        expect(screen.getByText('Erro ao carregar artistas')).toBeInTheDocument()
        expect(screen.getByText('Não foi possível carregar a lista de artistas. Verifique sua conexão e tente novamente.')).toBeInTheDocument()
    })

    it('should render artists grid when data is loaded', () => {
        mockUseGetArtists.mockReturnValue({
            data: mockArtists,
            error: null,
            isLoading: false
        })

        render(<Artists />)

        // Verifica o título e descrição
        expect(screen.getByText('Artistas em Destaque')).toBeInTheDocument()
        expect(screen.getByText('Descubra os melhores artistas da música')).toBeInTheDocument()

        // Verifica se os artistas foram renderizados
        expect(screen.getByText('Kendrick Lamar')).toBeInTheDocument()
        expect(screen.getByText('Michael Jackson')).toBeInTheDocument()
        expect(screen.getByText('Bruno Mars')).toBeInTheDocument()

        // Verifica as imagens pelos atributos alt
        const kendrickImage = screen.getByAltText('Foto de Kendrick Lamar')
        const michaelImage = screen.getByAltText('Foto de Michael Jackson')
        const brunoImage = screen.getByAltText('Foto de Bruno Mars')

        expect(kendrickImage).toBeInTheDocument()
        expect(michaelImage).toBeInTheDocument()
        expect(brunoImage).toBeInTheDocument()

        // Verifica se as imagens têm os srcs corretos
        expect(kendrickImage).toHaveAttribute('src', 'https://example.com/kendrick.jpg')
        expect(michaelImage).toHaveAttribute('src', 'https://example.com/michael.jpg')
        expect(brunoImage).toHaveAttribute('src', 'https://example.com/bruno.jpg')

        // Verifica a popularidade
        expect(screen.getByText('95')).toBeInTheDocument()
        expect(screen.getByText('100')).toBeInTheDocument()
        expect(screen.getByText('90')).toBeInTheDocument()
    })

    it('should call useGetArtists with correct parameters', () => {
        mockUseGetArtists.mockReturnValue({
            data: mockArtists,
            error: null,
            isLoading: false
        })

        render(<Artists />)

        expect(mockUseGetArtists).toHaveBeenCalledWith(ARTISTIS_ID)
    })

    it('should handle artist card click and navigate', async () => {
        const user = userEvent.setup()
        mockUseGetArtists.mockReturnValue({
            data: mockArtists,
            error: null,
            isLoading: false
        })

        render(<Artists />)

        const firstArtistCard = screen.getByText('Kendrick Lamar').closest('[class*="group"]')
        expect(firstArtistCard).toBeInTheDocument()

        await user.click(firstArtistCard!)

        expect(mockNavigate).toHaveBeenCalledWith('/artist/1')
    })

    it('should handle multiple artist card clicks', async () => {
        const user = userEvent.setup()
        mockUseGetArtists.mockReturnValue({
            data: mockArtists,
            error: null,
            isLoading: false
        })

        render(<Artists />)

        const secondArtistCard = screen.getByText('Michael Jackson').closest('[class*="group"]')
        await user.click(secondArtistCard!)

        expect(mockNavigate).toHaveBeenCalledWith('/artist/2')

        const thirdArtistCard = screen.getByText('Bruno Mars').closest('[class*="group"]')
        await user.click(thirdArtistCard!)

        expect(mockNavigate).toHaveBeenCalledWith('/artist/3')
    })

    it('should display popularity bars correctly', () => {
        mockUseGetArtists.mockReturnValue({
            data: mockArtists,
            error: null,
            isLoading: false
        })

        render(<Artists />)

        const popularityLabels = screen.getAllByText('Popularidade:')
        expect(popularityLabels).toHaveLength(3)

        expect(screen.getByText('95')).toBeInTheDocument()
        expect(screen.getByText('100')).toBeInTheDocument()
        expect(screen.getByText('90')).toBeInTheDocument()
    })

    it('should display "Clique para ver detalhes" text', () => {
        mockUseGetArtists.mockReturnValue({
            data: mockArtists,
            error: null,
            isLoading: false
        })

        render(<Artists />)

        const detailTexts = screen.getAllByText('Clique para ver detalhes')
        expect(detailTexts).toHaveLength(3)
    })

    it('should handle empty artists array', () => {
        mockUseGetArtists.mockReturnValue({
            data: [],
            error: null,
            isLoading: false
        })

        render(<Artists />)

        expect(screen.getByText('Artistas em Destaque')).toBeInTheDocument()
        expect(screen.getByText('Descubra os melhores artistas da música')).toBeInTheDocument()

        expect(screen.queryByText('Kendrick Lamar')).not.toBeInTheDocument()
    })

    it('should handle artist with multiple images', () => {
        const artistWithMultipleImages = [
            {
                id: '1',
                name: 'Artist With Multiple Images',
                popularity: 75,
                images: [
                    {
                        url: 'https://example.com/image1.jpg',
                        height: 300,
                        width: 300
                    },
                    {
                        url: 'https://example.com/image2.jpg',
                        height: 600,
                        width: 600
                    }
                ],
                followers: {
                    total: 100000
                }
            }
        ]

        mockUseGetArtists.mockReturnValue({
            data: artistWithMultipleImages,
            error: null,
            isLoading: false
        })

        render(<Artists />)

        // Verifica se a primeira imagem é usada
        expect(screen.getByAltText('Foto de Artist With Multiple Images')).toHaveAttribute('src', 'https://example.com/image1.jpg')
    })

    it('should handle keyboard navigation on artist cards', async () => {
        const user = userEvent.setup()
        mockUseGetArtists.mockReturnValue({
            data: mockArtists,
            error: null,
            isLoading: false
        })

        render(<Artists />)

        const firstArtistCard = screen.getByText('Kendrick Lamar').closest('[class*="group"]')

        await user.click(firstArtistCard!)
        await user.keyboard('{Enter}')

        expect(mockNavigate).toHaveBeenCalledWith('/artist/1')
    })

    it('should handle artist with zero popularity', () => {
        const artistWithZeroPopularity = [
            {
                id: '1',
                name: 'Unknown Artist',
                popularity: 0,
                images: [
                    {
                        url: 'https://example.com/unknown.jpg',
                        height: 300,
                        width: 300
                    }
                ],
                followers: {
                    total: 0
                }
            }
        ]

        mockUseGetArtists.mockReturnValue({
            data: artistWithZeroPopularity,
            error: null,
            isLoading: false
        })

        render(<Artists />)

        expect(screen.getByText('Unknown Artist')).toBeInTheDocument()
        expect(screen.getByText('0')).toBeInTheDocument()
    })

    it('should handle artist with very high popularity', () => {
        const artistWithHighPopularity = [
            {
                id: '1',
                name: 'Super Popular Artist',
                popularity: 100,
                images: [
                    {
                        url: 'https://example.com/super.jpg',
                        height: 300,
                        width: 300
                    }
                ],
                followers: {
                    total: 10000000
                }
            }
        ]

        mockUseGetArtists.mockReturnValue({
            data: artistWithHighPopularity,
            error: null,
            isLoading: false
        })

        render(<Artists />)

        expect(screen.getByText('Super Popular Artist')).toBeInTheDocument()
        expect(screen.getByText('100')).toBeInTheDocument()
    })
}) 