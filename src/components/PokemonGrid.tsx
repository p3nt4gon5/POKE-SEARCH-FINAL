import React from 'react'
import { PokemonDetail } from '../types/pokemon'
import PokemonCard from './PokemonCard'
import { Loader2 } from 'lucide-react'

interface PokemonGridProps {
    pokemons: PokemonDetail[]
    loading: boolean
    onPokemonClick: (pokemon: PokemonDetail) => void
    onLibraryChange?: () => void
}

const PokemonGrid: React.FC<PokemonGridProps> = ({
    pokemons,
    loading,
    onPokemonClick,
    onLibraryChange,
}) => {
    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                <span className="ml-2 text-gray-600">Loading Pokemon...</span>
            </div>
        )
    }

    if (pokemons.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No Pokemon found</p>
                <p className="text-gray-400 mt-2">
                    Try a different search term
                </p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {pokemons.map((pokemon) => (
                <PokemonCard
                    key={pokemon.id}
                    pokemon={pokemon}
                    onClick={() => onPokemonClick(pokemon)}
                    onLibraryChange={onLibraryChange}
                />
            ))}
        </div>
    )
}

export default PokemonGrid
