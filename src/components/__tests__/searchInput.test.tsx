import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

    it('should call handleFilter when user types', async () => {
        const user = userEvent.setup()
        render(<SearchInput handleFilter={mockHandleFilter} value="" />)

        const input = screen.getByPlaceholderText('Buscar por nome da música...')
        await user.type(input, 'new search')

        expect(mockHandleFilter).toHaveBeenCalledTimes(10)
        expect(mockHandleFilter).toHaveBeenNthCalledWith(1, 'n')
        expect(mockHandleFilter).toHaveBeenNthCalledWith(2, 'e')
        expect(mockHandleFilter).toHaveBeenNthCalledWith(3, 'w')
        expect(mockHandleFilter).toHaveBeenNthCalledWith(4, ' ')
        expect(mockHandleFilter).toHaveBeenNthCalledWith(5, 's')
        expect(mockHandleFilter).toHaveBeenNthCalledWith(6, 'e')
        expect(mockHandleFilter).toHaveBeenNthCalledWith(7, 'a')
        expect(mockHandleFilter).toHaveBeenNthCalledWith(8, 'r')
        expect(mockHandleFilter).toHaveBeenNthCalledWith(9, 'c')
        expect(mockHandleFilter).toHaveBeenNthCalledWith(10, 'h')
    })

    it('should handle special characters in input', async () => {
        const user = userEvent.setup()
        render(<SearchInput handleFilter={mockHandleFilter} value="" />)

        const input = screen.getByPlaceholderText('Buscar por nome da música...')
        const specialValue = 'test@#$%^&*()'
        await user.type(input, specialValue)


        expect(mockHandleFilter).toHaveBeenCalledTimes(13)
        expect(mockHandleFilter).toHaveBeenLastCalledWith(')')
    })

    it('should handle multiple character inputs', async () => {
        const user = userEvent.setup()
        render(<SearchInput handleFilter={mockHandleFilter} value="" />)

        const input = screen.getByPlaceholderText('Buscar por nome da música...')

        await user.type(input, 'a')
        await user.type(input, 'b')
        await user.type(input, 'c')

        expect(mockHandleFilter).toHaveBeenCalledTimes(3)
        expect(mockHandleFilter).toHaveBeenNthCalledWith(1, 'a')
        expect(mockHandleFilter).toHaveBeenNthCalledWith(2, 'b')
        expect(mockHandleFilter).toHaveBeenNthCalledWith(3, 'c')
    })

    it('should handle empty input after typing', async () => {
        const user = userEvent.setup()
        render(<SearchInput handleFilter={mockHandleFilter} value="initial" />)

        const input = screen.getByDisplayValue('initial')
        await user.clear(input)

        expect(mockHandleFilter).toHaveBeenCalledWith('')
    })

    it('should handle numeric input', async () => {
        const user = userEvent.setup()
        render(<SearchInput handleFilter={mockHandleFilter} value="" />)

        const input = screen.getByPlaceholderText('Buscar por nome da música...')
        await user.type(input, '123')

        expect(mockHandleFilter).toHaveBeenCalledTimes(3)
        expect(mockHandleFilter).toHaveBeenLastCalledWith('3')
    })

    it('should handle long text input', async () => {
        const user = userEvent.setup()
        render(<SearchInput handleFilter={mockHandleFilter} value="" />)

        const input = screen.getByPlaceholderText('Buscar por nome da música...')
        const longText = 'This is a very long search text'
        await user.type(input, longText)

        expect(mockHandleFilter).toHaveBeenCalledTimes(longText.length)
        expect(mockHandleFilter).toHaveBeenLastCalledWith('t')
    })

    it('should handle input with spaces', async () => {
        const user = userEvent.setup()
        render(<SearchInput handleFilter={mockHandleFilter} value="" />)

        const input = screen.getByPlaceholderText('Buscar por nome da música...')
        const textWithSpaces = 'search with spaces'
        await user.type(input, textWithSpaces)

        expect(mockHandleFilter).toHaveBeenCalledTimes(textWithSpaces.length)
        expect(mockHandleFilter).toHaveBeenLastCalledWith('s')
    })

    it('should handle input with accented characters', async () => {
        const user = userEvent.setup()
        render(<SearchInput handleFilter={mockHandleFilter} value="" />)

        const input = screen.getByPlaceholderText('Buscar por nome da música...')
        const accentedText = 'música brasileira'
        await user.type(input, accentedText)

        expect(mockHandleFilter).toHaveBeenCalledTimes(accentedText.length)
        expect(mockHandleFilter).toHaveBeenLastCalledWith('a')
    })

    it('should handle user typing character by character', async () => {
        const user = userEvent.setup()
        render(<SearchInput handleFilter={mockHandleFilter} value="" />)

        const input = screen.getByPlaceholderText('Buscar por nome da música...')

        await user.type(input, 'hello')

        expect(mockHandleFilter).toHaveBeenCalledTimes(5)
        expect(mockHandleFilter).toHaveBeenNthCalledWith(1, 'h')
        expect(mockHandleFilter).toHaveBeenNthCalledWith(2, 'e')
        expect(mockHandleFilter).toHaveBeenNthCalledWith(3, 'l')
        expect(mockHandleFilter).toHaveBeenNthCalledWith(4, 'l')
        expect(mockHandleFilter).toHaveBeenNthCalledWith(5, 'o')
    })

    it('should handle paste operation', async () => {
        const user = userEvent.setup()
        render(<SearchInput handleFilter={mockHandleFilter} value="" />)

        const input = screen.getByPlaceholderText('Buscar por nome da música...')

        await user.click(input)
        await user.paste('pasted text')

        expect(mockHandleFilter).toHaveBeenCalledWith('pasted text')
    })

    it('should handle clear operation', async () => {
        const user = userEvent.setup()
        render(<SearchInput handleFilter={mockHandleFilter} value="initial text" />)

        const input = screen.getByDisplayValue('initial text')

        await user.clear(input)

        expect(mockHandleFilter).toHaveBeenCalledWith('')
    })

    it('should handle backspace operations', async () => {
        const user = userEvent.setup()
        render(<SearchInput handleFilter={mockHandleFilter} value="hello" />)

        const input = screen.getByDisplayValue('hello')

        await user.click(input)
        await user.keyboard('{Backspace}')
        expect(mockHandleFilter).toHaveBeenCalledWith('hell')


        mockHandleFilter.mockClear()

        render(<SearchInput handleFilter={mockHandleFilter} value="hell" />)
        const updatedInput = screen.getByDisplayValue('hell')
        await user.click(updatedInput)
        await user.keyboard('{Backspace}')
        expect(mockHandleFilter).toHaveBeenCalledWith('hel')
    })

    it('should handle keyboard navigation', async () => {
        const user = userEvent.setup()
        render(<SearchInput handleFilter={mockHandleFilter} value="hello" />)

        const input = screen.getByDisplayValue('hello')

        await user.click(input)
        await user.keyboard('{ArrowLeft}')
        await user.keyboard('{ArrowRight}')
        await user.keyboard('{Home}')
        await user.keyboard('{End}')

        expect(mockHandleFilter).not.toHaveBeenCalled()
    })

    it('should handle focus and blur events', async () => {
        const user = userEvent.setup()
        render(<SearchInput handleFilter={mockHandleFilter} value="" />)

        const input = screen.getByPlaceholderText('Buscar por nome da música...')

        await user.click(input)
        expect(input).toHaveFocus()

        await user.tab()
        expect(input).not.toHaveFocus()
    })
}) 