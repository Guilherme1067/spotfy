import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { SearchInput } from '../searchInput'

describe('SearchInput Component', () => {
    const mockHandleFilter = vi.fn()

    beforeEach(() => {
        mockHandleFilter.mockClear()
    })

    it('should render search input with default placeholder', () => {
        render(<SearchInput handleFilter={mockHandleFilter} value="" />)

        const input = screen.getByPlaceholderText('Buscar por nome da música...')
        expect(input).toBeInTheDocument()
    })

    it('should render search input with album placeholder when isAlbum is true', () => {
        render(<SearchInput handleFilter={mockHandleFilter} value="" isAlbum={true} />)

        const input = screen.getByPlaceholderText('Buscar por nome do álbum...')
        expect(input).toBeInTheDocument()
    })

    it('should display the provided value', () => {
        const testValue = 'test search'
        render(<SearchInput handleFilter={mockHandleFilter} value={testValue} />)

        const input = screen.getByDisplayValue(testValue)
        expect(input).toBeInTheDocument()
    })

    it('should call handleFilter when user types', () => {
        render(<SearchInput handleFilter={mockHandleFilter} value="" />)

        const input = screen.getByPlaceholderText('Buscar por nome da música...')
        fireEvent.change(input, { target: { value: 'new search' } })

        expect(mockHandleFilter).toHaveBeenCalledWith('new search')
    })

    it('should have correct CSS classes', () => {
        render(<SearchInput handleFilter={mockHandleFilter} value="" />)

        const input = screen.getByPlaceholderText('Buscar por nome da música...')
        expect(input).toHaveClass(
            'w-full',
            'px-4',
            'py-3',
            'bg-white/10',
            'backdrop-blur-sm',
            'border',
            'border-white/20',
            'rounded-lg',
            'text-white',
            'placeholder-gray-400',
            'focus:outline-none',
            'focus:ring-2',
            'focus:ring-blue-500',
            'focus:border-transparent',
            'transition-all',
            'duration-300'
        )
    })

    it('should render search icon', () => {
        render(<SearchInput handleFilter={mockHandleFilter} value="" />)

        // Verifica se o ícone de busca está presente
        const searchIcon = screen.getByRole('img', { hidden: true })
        expect(searchIcon).toBeInTheDocument()
    })

    it('should have correct input type', () => {
        render(<SearchInput handleFilter={mockHandleFilter} value="" />)

        const input = screen.getByPlaceholderText('Buscar por nome da música...')
        expect(input).toHaveAttribute('type', 'text')
    })

    it('should handle empty string input', () => {
        render(<SearchInput handleFilter={mockHandleFilter} value="" />)

        const input = screen.getByPlaceholderText('Buscar por nome da música...')
        fireEvent.change(input, { target: { value: '' } })

        expect(mockHandleFilter).toHaveBeenCalledWith('')
    })

    it('should handle special characters in input', () => {
        render(<SearchInput handleFilter={mockHandleFilter} value="" />)

        const input = screen.getByPlaceholderText('Buscar por nome da música...')
        const specialValue = 'test@#$%^&*()'
        fireEvent.change(input, { target: { value: specialValue } })

        expect(mockHandleFilter).toHaveBeenCalledWith(specialValue)
    })

    it('should maintain focus state correctly', () => {
        render(<SearchInput handleFilter={mockHandleFilter} value="" />)

        const input = screen.getByPlaceholderText('Buscar por nome da música...')
        fireEvent.focus(input)

        expect(input).toHaveFocus()
    })
}) 