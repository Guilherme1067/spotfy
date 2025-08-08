import { LucideSearch } from "lucide-react";

interface ISearchInputProps {
    handleFilter: (value: string) => void;
    value: string;
    isAlbum?: boolean
}

export const SearchInput = ({ handleFilter, value, isAlbum }: ISearchInputProps) => {
    return (
        <div className="relative w-full max-w-md">
            <input
                type="text"
                placeholder={isAlbum ? "Buscar por nome do álbum..." : "Buscar por nome da música..."}
                value={value}
                onChange={(e) => handleFilter(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <LucideSearch className="text-gray-400" size={18} />
            </div>
        </div>
    )
}