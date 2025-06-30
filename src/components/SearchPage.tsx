import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Library, Heart, Sparkles } from 'lucide-react'
import SearchInput from './SearchInput'
import PokemonGrid from './PokemonGrid'
import { usePokemonList } from '../hooks/usePokemon'
import { Pokemon, PokemonDetail } from '../types/pokemon'
import Fuse from 'fuse.js'

const SearchPage: React.FC = () => {
    const navigate = useNavigate()
    const { allPokemons, loading: allPokemonsLoading } = usePokemonList()
    const [searchResults, setSearchResults] = useState<PokemonDetail[]>([])
    const [loading, setLoading] = useState(false)
    const [hasSearched, setHasSearched] = useState(false)

    const fetchPokemonDetails = async (
        pokemons: Pokemon[]
    ): Promise<PokemonDetail[]> => {
        const promises = pokemons.map(async (pokemon) => {
            const response = await fetch(
                `https://pokeapi.co/api/v2/pokemon/${pokemon.id}`
            )
            return response.json()
        })
        return Promise.all(promises)
    }

    const normalize = (input: string) =>
        input
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]/g, '')

    const handleSearch = async (searchTerm: string) => {
        setLoading(true)
        setHasSearched(true)

        try {
            const normalizedList = allPokemons.map((pokemon) => ({
                ...pokemon,
                norm: normalize(pokemon.name),
            }))

            const fuse = new Fuse(normalizedList, {
                keys: ['norm'],
                includeScore: true,
                threshold: 0.4,
            })

            const results = fuse.search(normalize(searchTerm)).slice(0, 20)
            const matched = results.map((r) => r.item)

            const details = await fetchPokemonDetails(matched)
            setSearchResults(details)
        } catch (error) {
            console.error('Error searching pokemons:', error)
            setSearchResults([])
        } finally {
            setLoading(false)
        }
    }
    const handlePokemonSelect = async (pokemon: Pokemon) => {
        setLoading(true)
        setHasSearched(true)

        try {
            const response = await fetch(
                `https://pokeapi.co/api/v2/pokemon/${pokemon.id}`
            )
            const detail = await response.json()
            setSearchResults([detail])
        } catch (error) {
            console.error('Error fetching pokemon:', error)
            setSearchResults([])
        } finally {
            setLoading(false)
        }
    }

    const handlePokemonClick = (pokemon: PokemonDetail) => {
        navigate(`/pokemon/${pokemon.id}`)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Sparkles className="w-8 h-8 text-purple-500" />
                            <h1
                                className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 
                           bg-clip-text text-transparent"
                            >
                                Pokemon Explorer
                            </h1>
                        </div>

                        <div className="flex space-x-4">
                            <button
                                onClick={() => navigate('/library')}
                                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white 
                         rounded-lg hover:bg-blue-600 transition-colors duration-200"
                            >
                                <Library className="w-4 h-4" />
                                <span>Library</span>
                            </button>
                            <button
                                onClick={() => navigate('/favorites')}
                                className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white 
                         rounded-lg hover:bg-red-600 transition-colors duration-200"
                            >
                                <Heart className="w-4 h-4" />
                                <span>Favorites</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Hero Section */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
                        Find your
                        <span
                            className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 
                           bg-clip-text text-transparent"
                        >
                            {' '}
                            Pokemon
                        </span>
                    </h2>
                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        Explore the world of Pokemon, add them to your library
                        and create a collection of favorites
                    </p>

                    <SearchInput
                        allPokemons={allPokemons}
                        onSearch={handleSearch}
                        onPokemonSelect={handlePokemonSelect}
                    />
                </div>

                {/* Results */}
                {hasSearched && (
                    <div className="mt-12">
                        <div className="mb-6">
                            <h3 className="text-2xl font-bold text-gray-800">
                                Search Results
                                {!loading && (
                                    <span className="text-gray-500 ml-2">
                                        ({searchResults.length})
                                    </span>
                                )}
                            </h3>
                        </div>

                        <PokemonGrid
                            pokemons={searchResults}
                            loading={loading}
                            onPokemonClick={handlePokemonClick}
                        />
                    </div>
                )}

                {/* Initial State */}
                {!hasSearched && !allPokemonsLoading && (
                    <div className="text-center py-16">
                        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-12 max-w-2xl mx-auto">
                            <Sparkles className="w-16 h-16 text-purple-500 mx-auto mb-6" />
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">
                                Start your adventure!
                            </h3>
                            <p className="text-gray-600 text-lg">
                                Enter a Pokemon name in the search bar above to
                                find your new friend
                            </p>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}

export default SearchPage
