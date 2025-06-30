import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Library, Heart, Trash2 } from 'lucide-react'
import PokemonGrid from './PokemonGrid'
import { PokemonDetail } from '../types/pokemon'
import {
    getStoredPokemons,
    removePokemonFromStorage,
} from '../utils/localStorage'

interface LibraryPageProps {
    type: 'library' | 'favorites'
}

const LibraryPage: React.FC<LibraryPageProps> = ({ type }) => {
    const navigate = useNavigate()
    const [pokemons, setPokemons] = useState<PokemonDetail[]>([])
    const [loading, setLoading] = useState(true)

    const title = type === 'library' ? 'My Library' : 'Favorite Pokemon'
    const icon = type === 'library' ? Library : Heart
    const IconComponent = icon

    useEffect(() => {
        const loadPokemons = async () => {
            setLoading(true)
            const storedIds = getStoredPokemons(type)

            if (storedIds.length === 0) {
                setPokemons([])
                setLoading(false)
                return
            }

            try {
                const promises = storedIds.map(async (id) => {
                    const response = await fetch(
                        `https://pokeapi.co/api/v2/pokemon/${id}`
                    )
                    return response.json()
                })

                const pokemonDetails = await Promise.all(promises)
                setPokemons(pokemonDetails)
            } catch (error) {
                console.error('Error loading pokemons:', error)
                setPokemons([])
            } finally {
                setLoading(false)
            }
        }

        loadPokemons()
    }, [type])

    const handlePokemonClick = (pokemon: PokemonDetail) => {
        navigate(`/pokemon/${pokemon.id}`)
    }

    const handleLibraryChange = () => {
        // Reload the page to reflect changes
        window.location.reload()
    }

    const clearAll = () => {
        const storedIds = getStoredPokemons(type)
        storedIds.forEach((id) => removePokemonFromStorage(id, type))
        setPokemons([])
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => navigate('/')}
                            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 
                       transition-colors duration-200"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span>Back to Search</span>
                        </button>

                        {pokemons.length > 0 && (
                            <button
                                onClick={clearAll}
                                className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white 
                         rounded-lg hover:bg-red-600 transition-colors duration-200"
                            >
                                <Trash2 className="w-4 h-4" />
                                <span>Clear All</span>
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center space-x-3 mb-4">
                        <IconComponent
                            className={`w-12 h-12 ${
                                type === 'library'
                                    ? 'text-blue-500'
                                    : 'text-red-500'
                            }`}
                        />
                        <h1 className="text-4xl font-bold text-gray-800">
                            {title}
                        </h1>
                    </div>
                    <p className="text-xl text-gray-600">
                        {pokemons.length === 0
                            ? `You don't have any Pokemon in your ${
                                  type === 'library' ? 'library' : 'favorites'
                              } yet`
                            : `${pokemons.length} Pokemon in your ${
                                  type === 'library' ? 'library' : 'favorites'
                              }`}
                    </p>
                </div>

                {pokemons.length === 0 && !loading ? (
                    <div className="text-center py-16">
                        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-12 max-w-2xl mx-auto">
                            <IconComponent
                                className={`w-16 h-16 mx-auto mb-6 ${
                                    type === 'library'
                                        ? 'text-blue-500'
                                        : 'text-red-500'
                                }`}
                            />
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">
                                {type === 'library'
                                    ? 'Library is empty'
                                    : 'No favorite Pokemon'}
                            </h3>
                            <p className="text-gray-600 text-lg mb-6">
                                {type === 'library'
                                    ? 'Find Pokemon and add them to your library'
                                    : 'Find Pokemon and add them to your favorites'}
                            </p>
                            <button
                                onClick={() => navigate('/')}
                                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                         transition-colors duration-200"
                            >
                                Start Searching
                            </button>
                        </div>
                    </div>
                ) : (
                    <PokemonGrid
                        pokemons={pokemons}
                        loading={loading}
                        onPokemonClick={handlePokemonClick}
                        onLibraryChange={handleLibraryChange}
                    />
                )}
            </main>
        </div>
    )
}

export default LibraryPage
