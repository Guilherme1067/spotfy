import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ArtistDetails } from '../artistDetails'
import { useArtistDetails } from '../hooks/useArtistDetailsHook'

// Mock dos hooks e dependências
vi.mock('../hooks/useArtistDetailsHook')
vi.mock('react-router-dom', () => ({
    useParams: () => ({ artistId: '1' })
}))

// Mock dos componentes filhos
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

vi.mock('../topTracks', () => ({
    TopTracks: ({ artistId }: { artistId: string }) => (
        <div data-testid="top-tracks">
            <h2>Top Tracks para {artistId}</h2>
        </div>
    )
}))

vi.mock('../searchInput', () => ({
    SearchInput: ({ handleFilter, value, isAlbum }: { handleFilter: (value: string) => void; value: string; isAlbum: boolean }) => (
        <input
            data-testid="search-input"
            value={value}
            onChange={(e) => handleFilter(e.target.value)}
            placeholder={isAlbum ? "Buscar por nome do álbum..." : "Buscar por nome da música..."}
        />
    )
}))

const mockUseArtistDetails = vi.mocked(useArtistDetails)

describe('ArtistDetails Component', () => {
    const mockArtist = {
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
    }

    const mockAlbums = {
        total: 25,
        items: [
            {
                id: 'album1',
                name: 'To Pimp A Butterfly',
                release_date: '2015-03-15',
                total_tracks: 16,
                album_type: 'album',
                images: [
                    {
                        url: 'https://example.com/album1.jpg',
                        height: 300,
                        width: 300
                    }
                ]
            },
            {
                id: 'album2',
                name: 'DAMN.',
                release_date: '2017-04-14',
                total_tracks: 14,
                album_type: 'album',
                images: [
                    {
                        url: 'https://example.com/album2.jpg',
                        height: 300,
                        width: 300
                    }
                ]
            },
            {
                id: 'album3',
                name: 'Good Kid, M.A.A.D City',
                release_date: '2012-10-22',
                total_tracks: 12,
                album_type: 'album',
                images: [
                    {
                        url: 'https://example.com/album3.jpg',
                        height: 300,
                        width: 300
                    }
                ]
            }
        ]
    }

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should render loading state', () => {
        mockUseArtistDetails.mockReturnValue({
            activeTab: 'albums',
            setActiveTab: vi.fn(),
            setAlbumFilter: vi.fn(),
            totalPages: 3,
            currentArtist: mockArtist,
            filteredAlbums: mockAlbums.items,
            setPage: vi.fn(),
            albumFilter: '',
            isDetailsPagesLoading: true,
            page: 0,
            params: { artistId: '1' },
            artistsError: null,
            albumsError: null
        })

        render(<ArtistDetails />)

        expect(screen.getByTestId('loading')).toBeInTheDocument()
        expect(screen.getByText('Carregando...')).toBeInTheDocument()
    })

    it('should render error state', () => {
        mockUseArtistDetails.mockReturnValue({
            activeTab: 'albums',
            setActiveTab: vi.fn(),
            setAlbumFilter: vi.fn(),
            totalPages: 3,
            currentArtist: mockArtist,
            filteredAlbums: mockAlbums.items,
            setPage: vi.fn(),
            albumFilter: '',
            isDetailsPagesLoading: false,
            page: 0,
            params: { artistId: '1' },
            artistsError: new Error('Failed to fetch'),
            albumsError: null
        })

        render(<ArtistDetails />)

        expect(screen.getByTestId('error-feedback')).toBeInTheDocument()
        expect(screen.getByText('Erro ao carregar detalhes do artista')).toBeInTheDocument()
        expect(screen.getByText('Não foi possível carregar as informações do artista. Verifique sua conexão e tente novamente.')).toBeInTheDocument()
    })

    it('should render artist details and albums tab by default', () => {
        mockUseArtistDetails.mockReturnValue({
            activeTab: 'albums',
            setActiveTab: vi.fn(),
            setAlbumFilter: vi.fn(),
            totalPages: 3,
            currentArtist: mockArtist,
            filteredAlbums: mockAlbums.items,
            setPage: vi.fn(),
            albumFilter: '',
            isDetailsPagesLoading: false,
            page: 0,
            params: { artistId: '1' },
            artistsError: null,
            albumsError: null
        })

        render(<ArtistDetails />)

        // Verifica informações do artista
        expect(screen.getByText('Kendrick Lamar')).toBeInTheDocument()
        expect(screen.getByText('95')).toBeInTheDocument()
        expect(screen.getByAltText('Foto de Kendrick Lamar')).toBeInTheDocument()

        // Verifica as abas
        expect(screen.getByText('🎵 Álbuns')).toBeInTheDocument()
        expect(screen.getByText('🎧 Top Tracks')).toBeInTheDocument()

        // Verifica se a aba de álbuns está ativa
        expect(screen.getByText('Álbuns')).toBeInTheDocument()
        expect(screen.getByText('Discografia completa do artista')).toBeInTheDocument()

        // Verifica os álbuns
        expect(screen.getByText('To Pimp A Butterfly')).toBeInTheDocument()
        expect(screen.getByText('DAMN.')).toBeInTheDocument()
        expect(screen.getByText('Good Kid, M.A.A.D City')).toBeInTheDocument()
    })

    it('should switch to tracks tab when clicked', async () => {
        const mockSetActiveTab = vi.fn()
        mockUseArtistDetails.mockReturnValue({
            activeTab: 'albums',
            setActiveTab: mockSetActiveTab,
            setAlbumFilter: vi.fn(),
            totalPages: 3,
            currentArtist: mockArtist,
            filteredAlbums: mockAlbums.items,
            setPage: vi.fn(),
            albumFilter: '',
            isDetailsPagesLoading: false,
            page: 0,
            params: { artistId: '1' },
            artistsError: null,
            albumsError: null
        })

        const user = userEvent.setup()
        render(<ArtistDetails />)

        // Clica na aba de tracks
        const tracksTab = screen.getByText('🎧 Top Tracks')
        await user.click(tracksTab)

        expect(mockSetActiveTab).toHaveBeenCalledWith('tracks')
    })

    it('should render tracks tab content', () => {
        mockUseArtistDetails.mockReturnValue({
            activeTab: 'tracks',
            setActiveTab: vi.fn(),
            setAlbumFilter: vi.fn(),
            totalPages: 3,
            currentArtist: mockArtist,
            filteredAlbums: mockAlbums.items,
            setPage: vi.fn(),
            albumFilter: '',
            isDetailsPagesLoading: false,
            page: 0,
            params: { artistId: '1' },
            artistsError: null,
            albumsError: null
        })

        render(<ArtistDetails />)

        expect(screen.getByTestId('top-tracks')).toBeInTheDocument()
        expect(screen.getByText('Top Tracks para 1')).toBeInTheDocument()
    })

    it('should handle album search', async () => {
        const mockSetAlbumFilter = vi.fn()
        mockUseArtistDetails.mockReturnValue({
            activeTab: 'albums',
            setActiveTab: vi.fn(),
            setAlbumFilter: mockSetAlbumFilter,
            totalPages: 3,
            currentArtist: mockArtist,
            filteredAlbums: mockAlbums.items,
            setPage: vi.fn(),
            albumFilter: '',
            isDetailsPagesLoading: false,
            page: 0,
            params: { artistId: '1' },
            artistsError: null,
            albumsError: null
        })

        const user = userEvent.setup()
        render(<ArtistDetails />)

        // Encontra o input de busca
        const searchInput = screen.getByTestId('search-input')
        expect(searchInput).toHaveAttribute('placeholder', 'Buscar por nome do álbum...')

        // Digita no campo de busca
        await user.type(searchInput, 'butterfly')

        // userEvent.type() simula caractere por caractere, então verificamos a última chamada
        expect(mockSetAlbumFilter).toHaveBeenCalledTimes(9)
        expect(mockSetAlbumFilter).toHaveBeenLastCalledWith('y')
    })

    it('should show filtered albums count', () => {
        mockUseArtistDetails.mockReturnValue({
            activeTab: 'albums',
            setActiveTab: vi.fn(),
            setAlbumFilter: vi.fn(),
            totalPages: 3,
            currentArtist: mockArtist,
            filteredAlbums: [mockAlbums.items[0]], // Apenas 1 álbum filtrado
            setPage: vi.fn(),
            albumFilter: 'butterfly',
            isDetailsPagesLoading: false,
            page: 0,
            params: { artistId: '1' },
            artistsError: null,
            albumsError: null
        })

        render(<ArtistDetails />)

        expect(screen.getByText('1 álbum encontrado')).toBeInTheDocument()
    })

    it('should show no albums found message', () => {
        mockUseArtistDetails.mockReturnValue({
            activeTab: 'albums',
            setActiveTab: vi.fn(),
            setAlbumFilter: vi.fn(),
            totalPages: 3,
            currentArtist: mockArtist,
            filteredAlbums: [], // Nenhum álbum encontrado
            setPage: vi.fn(),
            albumFilter: 'nonexistent',
            isDetailsPagesLoading: false,
            page: 0,
            params: { artistId: '1' },
            artistsError: null,
            albumsError: null
        })

        render(<ArtistDetails />)

        // Verifica se a mensagem de "nenhum álbum encontrado" está presente
        const noAlbumsMessages = screen.getAllByText('Nenhum álbum encontrado')
        expect(noAlbumsMessages.length).toBeGreaterThan(0)
        expect(screen.getByText('Tente buscar por outro termo')).toBeInTheDocument()
    })

    it('should handle pagination', async () => {
        const mockSetPage = vi.fn()
        mockUseArtistDetails.mockReturnValue({
            activeTab: 'albums',
            setActiveTab: vi.fn(),
            setAlbumFilter: vi.fn(),
            totalPages: 3,
            currentArtist: mockArtist,
            filteredAlbums: mockAlbums.items,
            setPage: mockSetPage,
            albumFilter: '',
            isDetailsPagesLoading: false,
            page: 0,
            params: { artistId: '1' },
            artistsError: null,
            albumsError: null
        })

        const user = userEvent.setup()
        render(<ArtistDetails />)

        // Verifica se a paginação está presente
        expect(screen.getByText('Página 1 de 3')).toBeInTheDocument()

        // Clica no botão próximo usando aria-label
        const nextButton = screen.getByLabelText('Go to next page')
        await user.click(nextButton)

        expect(mockSetPage).toHaveBeenCalledWith(1)
    })

    it('should handle pagination previous button', async () => {
        const mockSetPage = vi.fn()
        mockUseArtistDetails.mockReturnValue({
            activeTab: 'albums',
            setActiveTab: vi.fn(),
            setAlbumFilter: vi.fn(),
            totalPages: 3,
            currentArtist: mockArtist,
            filteredAlbums: mockAlbums.items,
            setPage: mockSetPage,
            albumFilter: '',
            isDetailsPagesLoading: false,
            page: 1, // Página atual é 1
            params: { artistId: '1' },
            artistsError: null,
            albumsError: null
        })

        const user = userEvent.setup()
        render(<ArtistDetails />)

        // Verifica se a paginação está presente
        expect(screen.getByText('Página 2 de 3')).toBeInTheDocument()

        // Clica no botão anterior usando aria-label
        const previousButton = screen.getByLabelText('Go to previous page')
        await user.click(previousButton)

        expect(mockSetPage).toHaveBeenCalledWith(0)
    })

    it('should not show pagination when filtering', () => {
        mockUseArtistDetails.mockReturnValue({
            activeTab: 'albums',
            setActiveTab: vi.fn(),
            setAlbumFilter: vi.fn(),
            totalPages: 3,
            currentArtist: mockArtist,
            filteredAlbums: [mockAlbums.items[0]],
            setPage: vi.fn(),
            albumFilter: 'butterfly', // Com filtro ativo
            isDetailsPagesLoading: false,
            page: 0,
            params: { artistId: '1' },
            artistsError: null,
            albumsError: null
        })

        render(<ArtistDetails />)

        // Paginação não deve aparecer quando há filtro
        expect(screen.queryByText('Página 1 de 3')).not.toBeInTheDocument()
    })

    it('should display album details correctly', () => {
        mockUseArtistDetails.mockReturnValue({
            activeTab: 'albums',
            setActiveTab: vi.fn(),
            setAlbumFilter: vi.fn(),
            totalPages: 3,
            currentArtist: mockArtist,
            filteredAlbums: mockAlbums.items,
            setPage: vi.fn(),
            albumFilter: '',
            isDetailsPagesLoading: false,
            page: 0,
            params: { artistId: '1' },
            artistsError: null,
            albumsError: null
        })

        render(<ArtistDetails />)

        // Verifica detalhes do primeiro álbum
        expect(screen.getByText('To Pimp A Butterfly')).toBeInTheDocument()
        expect(screen.getByText('Lançamento: 2015-03-15')).toBeInTheDocument()
        expect(screen.getByText('16 faixas')).toBeInTheDocument()

        // Verifica se há pelo menos um elemento com "album" (pode haver múltiplos)
        const albumElements = screen.getAllByText('album')
        expect(albumElements.length).toBeGreaterThan(0)

        // Verifica a imagem do álbum
        expect(screen.getByAltText('To Pimp A Butterfly')).toBeInTheDocument()
    })


    it('should handle album without images gracefully', () => {
        const albumsWithoutImages = {
            ...mockAlbums,
            items: [
                {
                    ...mockAlbums.items[0],
                    images: []
                }
            ]
        }

        mockUseArtistDetails.mockReturnValue({
            activeTab: 'albums',
            setActiveTab: vi.fn(),
            setAlbumFilter: vi.fn(),
            totalPages: 3,
            currentArtist: mockArtist,
            filteredAlbums: albumsWithoutImages.items,
            setPage: vi.fn(),
            albumFilter: '',
            isDetailsPagesLoading: false,
            page: 0,
            params: { artistId: '1' },
            artistsError: null,
            albumsError: null
        })

        // O componente deve renderizar sem erro, mesmo com álbuns sem imagens
        expect(() => render(<ArtistDetails />)).not.toThrow()
    })

    it('should handle keyboard navigation on tabs', async () => {
        const mockSetActiveTab = vi.fn()
        mockUseArtistDetails.mockReturnValue({
            activeTab: 'albums',
            setActiveTab: mockSetActiveTab,
            setAlbumFilter: vi.fn(),
            totalPages: 3,
            currentArtist: mockArtist,
            filteredAlbums: mockAlbums.items,
            setPage: vi.fn(),
            albumFilter: '',
            isDetailsPagesLoading: false,
            page: 0,
            params: { artistId: '1' },
            artistsError: null,
            albumsError: null
        })

        const user = userEvent.setup()
        render(<ArtistDetails />)

        // Navega para a aba de tracks usando Tab e Enter
        const tracksTab = screen.getByText('🎧 Top Tracks')
        await user.click(tracksTab)
        await user.keyboard('{Enter}')

        expect(mockSetActiveTab).toHaveBeenCalledWith('tracks')
    })

    it('should handle artist with zero popularity', () => {
        const artistWithZeroPopularity = {
            ...mockArtist,
            popularity: 0
        }

        mockUseArtistDetails.mockReturnValue({
            activeTab: 'albums',
            setActiveTab: vi.fn(),
            setAlbumFilter: vi.fn(),
            totalPages: 3,
            currentArtist: artistWithZeroPopularity,
            filteredAlbums: mockAlbums.items,
            setPage: vi.fn(),
            albumFilter: '',
            isDetailsPagesLoading: false,
            page: 0,
            params: { artistId: '1' },
            artistsError: null,
            albumsError: null
        })

        render(<ArtistDetails />)

        expect(screen.getByText('Kendrick Lamar')).toBeInTheDocument()
        expect(screen.getByText('0')).toBeInTheDocument()
    })

    it('should handle artist with maximum popularity', () => {
        const artistWithMaxPopularity = {
            ...mockArtist,
            popularity: 100
        }

        mockUseArtistDetails.mockReturnValue({
            activeTab: 'albums',
            setActiveTab: vi.fn(),
            setAlbumFilter: vi.fn(),
            totalPages: 3,
            currentArtist: artistWithMaxPopularity,
            filteredAlbums: mockAlbums.items,
            setPage: vi.fn(),
            albumFilter: '',
            isDetailsPagesLoading: false,
            page: 0,
            params: { artistId: '1' },
            artistsError: null,
            albumsError: null
        })

        render(<ArtistDetails />)

        expect(screen.getByText('Kendrick Lamar')).toBeInTheDocument()
        expect(screen.getByText('100')).toBeInTheDocument()
    })
}) 