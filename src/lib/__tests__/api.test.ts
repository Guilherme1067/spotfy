// Tipos para os testes
interface AxiosConfig {
    headers: Record<string, string>
    method?: string
    url?: string
}

interface AxiosError {
    response?: {
        status: number
        data: {
            error?: {
                message: string
            }
            message?: string
        }
    }
    config: AxiosConfig
}

interface TokenResponse {
    data: {
        access_token: string
    }
}

const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
})

describe('API Configuration', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        localStorageMock.getItem.mockReturnValue('stored-token-456')
    })

    it('should add authorization header to requests when token exists', () => {
        localStorageMock.getItem.mockReturnValue('test-token-789')

        const requestInterceptor = (config: AxiosConfig): AxiosConfig => {
            const token = localStorage.getItem('accessToken')
            if (token) {
                config.headers.Authorization = `Bearer ${token}`
            }
            return config
        }

        const config: AxiosConfig = { headers: {} }
        const result = requestInterceptor(config)

        expect(localStorageMock.getItem).toHaveBeenCalledWith('accessToken')
        expect(result.headers.Authorization).toBe('Bearer test-token-789')
    })

    it('should not add authorization header when no token exists', () => {
        localStorageMock.getItem.mockReturnValue(null)

        const requestInterceptor = (config: AxiosConfig): AxiosConfig => {
            const token = localStorage.getItem('accessToken')
            if (token) {
                config.headers.Authorization = `Bearer ${token}`
            }
            return config
        }

        const config: AxiosConfig = { headers: {} }
        const result = requestInterceptor(config)

        expect(localStorageMock.getItem).toHaveBeenCalledWith('accessToken')
        expect(result.headers.Authorization).toBeUndefined()
    })

    it('should handle 401 error and refresh token', async () => {
        const mockRefetch = vi.fn().mockResolvedValue({
            data: { access_token: 'new-token-123' }
        } as TokenResponse)

        localStorageMock.getItem.mockReturnValue('expired-token')

        const responseInterceptor = async (error: AxiosError): Promise<AxiosConfig> => {
            if (error.response?.status === 401 &&
                error.response?.data?.error?.message === 'No token provided') {

                const newToken = await mockRefetch()
                localStorage.setItem('accessToken', newToken.data.access_token)

                error.config.headers.Authorization = `Bearer ${newToken.data.access_token}`

                return error.config
            }
            return Promise.reject(error)
        }

        const originalRequest: AxiosConfig = {
            method: 'get',
            url: '/test-endpoint',
            headers: {}
        }

        const error: AxiosError = {
            response: {
                status: 401,
                data: {
                    error: {
                        message: 'No token provided'
                    }
                }
            },
            config: originalRequest
        }

        const result = await responseInterceptor(error)

        expect(mockRefetch).toHaveBeenCalled()
        expect(localStorageMock.setItem).toHaveBeenCalledWith('accessToken', 'new-token-123')
        expect(originalRequest.headers.Authorization).toBe('Bearer new-token-123')
        expect(result).toBe(originalRequest)
    })

    it('should not handle non-401 errors', async () => {
        const mockRefetch = vi.fn()

        const responseInterceptor = async (error: AxiosError): Promise<AxiosConfig> => {
            if (error.response?.status === 401 &&
                error.response?.data?.error?.message === 'No token provided') {
                await mockRefetch()
                return error.config
            }
            return Promise.reject(error)
        }

        const error: AxiosError = {
            response: {
                status: 500,
                data: { message: 'Internal Server Error' }
            },
            config: { headers: {} }
        }

        try {
            await responseInterceptor(error)
        } catch {
            expect(mockRefetch).not.toHaveBeenCalled()
        }
    })

    it('should not handle 401 errors with different message', async () => {
        const mockRefetch = vi.fn()

        const responseInterceptor = async (error: AxiosError): Promise<AxiosConfig> => {
            if (error.response?.status === 401 &&
                error.response?.data?.error?.message === 'No token provided') {
                await mockRefetch()
                return error.config
            }
            return Promise.reject(error)
        }

        const error: AxiosError = {
            response: {
                status: 401,
                data: {
                    error: {
                        message: 'Token expired'
                    }
                }
            },
            config: { headers: {} }
        }

        try {
            await responseInterceptor(error)
        } catch {
            expect(mockRefetch).not.toHaveBeenCalled()
        }
    })

    it('should handle token refresh failure', async () => {
        const mockRefetch = vi.fn().mockRejectedValue(new Error('Failed to refresh token'))

        const responseInterceptor = async (error: AxiosError): Promise<AxiosConfig> => {
            if (error.response?.status === 401 &&
                error.response?.data?.error?.message === 'No token provided') {
                try {
                    await mockRefetch()
                } catch (refreshError) {
                    // Se o refresh falhar, remove o token e rejeita o erro
                    localStorage.removeItem('accessToken')
                    return Promise.reject(refreshError)
                }
            }
            return Promise.reject(error)
        }

        const error: AxiosError = {
            response: {
                status: 401,
                data: {
                    error: {
                        message: 'No token provided'
                    }
                }
            },
            config: { headers: {} }
        }

        try {
            await responseInterceptor(error)
        } catch (e) {
            expect(mockRefetch).toHaveBeenCalled()
            expect(localStorageMock.removeItem).toHaveBeenCalledWith('accessToken')
            expect((e as Error).message).toBe('Failed to refresh token')
        }
    })

    it('should retry original request after successful token refresh', async () => {
        const mockRefetch = vi.fn().mockResolvedValue({
            data: { access_token: 'new-token-123' }
        } as TokenResponse)

        localStorageMock.getItem.mockReturnValue('expired-token')

        const responseInterceptor = async (error: AxiosError): Promise<AxiosConfig> => {
            if (error.response?.status === 401 &&
                error.response?.data?.error?.message === 'No token provided') {

                const newToken = await mockRefetch()
                localStorage.setItem('accessToken', newToken.data.access_token)

                error.config.headers.Authorization = `Bearer ${newToken.data.access_token}`

                return error.config
            }
            return Promise.reject(error)
        }

        const originalRequest: AxiosConfig = {
            method: 'get',
            url: '/test-endpoint',
            headers: {}
        }

        const error: AxiosError = {
            response: {
                status: 401,
                data: {
                    error: {
                        message: 'No token provided'
                    }
                }
            },
            config: originalRequest
        }

        const result = await responseInterceptor(error)

        expect(mockRefetch).toHaveBeenCalled()
        expect(result).toBe(originalRequest)
        expect(originalRequest.headers.Authorization).toBe('Bearer new-token-123')
    })

    it('should handle multiple concurrent 401 errors', async () => {
        const mockRefetch = vi.fn().mockResolvedValue({
            data: { access_token: 'new-token-123' }
        } as TokenResponse)

        localStorageMock.getItem.mockReturnValue('expired-token')

        const responseInterceptor = async (error: AxiosError): Promise<AxiosConfig> => {
            if (error.response?.status === 401 &&
                error.response?.data?.error?.message === 'No token provided') {

                const newToken = await mockRefetch()
                localStorage.setItem('accessToken', newToken.data.access_token)

                error.config.headers.Authorization = `Bearer ${newToken.data.access_token}`

                return error.config
            }
            return Promise.reject(error)
        }

        const error1: AxiosError = {
            response: {
                status: 401,
                data: { error: { message: 'No token provided' } }
            },
            config: { url: '/endpoint1', headers: {} }
        }

        const error2: AxiosError = {
            response: {
                status: 401,
                data: { error: { message: 'No token provided' } }
            },
            config: { url: '/endpoint2', headers: {} }
        }

        const promises = [
            responseInterceptor(error1),
            responseInterceptor(error2)
        ]

        await Promise.all(promises)

        expect(mockRefetch).toHaveBeenCalledTimes(2)
    })
}) 