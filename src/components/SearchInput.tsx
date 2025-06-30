import React, { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { Pokemon } from '../types/pokemon'

interface SearchInputProps {
    allPokemons: Pokemon[]
    onSearch: (searchTerm: string) => void
    onPokemonSelect: (pokemon: Pokemon) => void
}

const SearchInput: React.FC<SearchInputProps> = ({
    allPokemons,
    onSearch,
    onPokemonSelect,
}) => {
    const [searchTerm, setSearchTerm] = useState('')
    const [suggestions, setSuggestions] = useState<Pokemon[]>([])
    const [showSuggestions, setShowSuggestions] = useState(false)

    useEffect(() => {
        if (searchTerm.length > 0) {
            const filtered = allPokemons
                .filter((pokemon) =>
                    pokemon.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                )
                .slice(0, 8)
            setSuggestions(filtered)
            setShowSuggestions(true)
        } else {
            setSuggestions([])
            setShowSuggestions(false)
        }
    }, [searchTerm, allPokemons])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchTerm.trim()) {
            onSearch(searchTerm)
            setShowSuggestions(false)
        }
    }

    const handleSuggestionClick = (pokemon: Pokemon) => {
        setSearchTerm(pokemon.name)
        setShowSuggestions(false)
        onPokemonSelect(pokemon)
    }

    return (
        <div className="relative w-full max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="relative">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search for a Pokemon..."
                        className="w-full pl-12 pr-4 py-4 text-lg border-2 border-transparent rounded-2xl 
                     bg-white shadow-lg focus:outline-none focus:border-blue-500 
                     transition-all duration-300 hover:shadow-xl"
                    />
                </div>
            </form>

            {showSuggestions && suggestions.length > 0 && (
                <div
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border 
                      border-gray-200 overflow-hidden z-50 max-h-80 overflow-y-auto"
                >
                    {suggestions.map((pokemon) => (
                        <button
                            key={pokemon.id}
                            onClick={() => handleSuggestionClick(pokemon)}
                            className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors 
                       duration-200 border-b border-gray-100 last:border-b-0
                       flex items-center space-x-3"
                        >
                            <img
                                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
                                alt={pokemon.name}
                                className="w-8 h-8"
                                loading="lazy"
                            />
                            <span className="capitalize font-medium text-gray-800">
                                {pokemon.name}
                            </span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

export default SearchInput
