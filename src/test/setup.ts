/// <reference types="vitest/globals" />
import '@testing-library/jest-dom'

const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
    length: 0,
    key: vi.fn(),
} as Storage
global.localStorage = localStorageMock

vi.mock('import.meta.env', () => ({
    env: {
        VITE_SPOTFY_CLIENT_ID: 'test_client_id',
        VITE_SPOTFY_SECRET: 'test_client_secret',
    },
})) 