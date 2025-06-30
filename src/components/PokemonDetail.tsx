import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Heart, BookOpen, Ruler, Weight } from 'lucide-react'
import { usePokemonDetail } from '../hooks/usePokemon'
import {
    isPokemonInStorage,
    addPokemonToStorage,
    removePokemonFromStorage,
} from '../utils/localStorage'

const typeColors: { [key: string]: string } = {
    normal: 'bg-gray-400',
    fire: 'bg-red-500',
    water: 'bg-blue-500',
    electric: 'bg-yellow-400',
    grass: 'bg-green-500',
    ice: 'bg-blue-300',
    fighting: 'bg-red-700',
    poison: 'bg-purple-500',
    ground: 'bg-yellow-600',
    flying: 'bg-indigo-400',
    psychic: 'bg-pink-500',
    bug: 'bg-green-400',
    rock: 'bg-yellow-800',
    ghost: 'bg-purple-700',
    dragon: 'bg-indigo-700',
    dark: 'bg-gray-800',
    steel: 'bg-gray-500',
    fairy: 'bg-pink-300',
}

const PokemonDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { pokemon, loading } = usePokemonDetail(id)

    if (loading) {
        return (
            <div
                className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 
                    flex items-center justify-center"
            >
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading Pokemon...</p>
                </div>
            </div>
        )
    }

    if (!pokemon) {
        return (
            <div
                className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 
                    flex items-center justify-center"
            >
                <div className="text-center">
                    <p className="text-gray-600">Pokemon not found</p>
                    <button
                        onClick={() => navigate('/')}
                        className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                     transition-colors duration-200"
                    >
                        Back to Search
                    </button>
                </div>
            </div>
        )
    }

    const isInLibrary = isPokemonInStorage(pokemon.id, 'library')
    const isInFavorites = isPokemonInStorage(pokemon.id, 'favorites')

    const handleLibraryToggle = () => {
        if (isInLibrary) {
            removePokemonFromStorage(pokemon.id, 'library')
        } else {
            addPokemonToStorage(pokemon.id, 'library')
        }
        // Force re-render
        window.location.reload()
    }

    const handleFavoriteToggle = () => {
        if (isInFavorites) {
            removePokemonFromStorage(pokemon.id, 'favorites')
        } else {
            addPokemonToStorage(pokemon.id, 'favorites')
        }
        // Force re-render
        window.location.reload()
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-40">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 
                     transition-colors duration-200"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Back to Search</span>
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                    {/* Pokemon Image Section */}
                    <div className="bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 p-8 relative">
                        <div className="text-center">
                            <img
                                src={
                                    pokemon.sprites.other['official-artwork']
                                        .front_default ||
                                    pokemon.sprites.front_default
                                }
                                alt={pokemon.name}
                                className="w-64 h-64 mx-auto object-contain drop-shadow-2xl"
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="absolute top-4 right-4 flex space-x-3">
                            <button
                                onClick={handleLibraryToggle}
                                className={`p-3 rounded-full shadow-lg transition-all duration-200 
                         ${
                             isInLibrary
                                 ? 'bg-blue-500 text-white'
                                 : 'bg-white text-gray-400 hover:text-blue-500'
                         }`}
                            >
                                <BookOpen className="w-6 h-6" />
                            </button>
                            <button
                                onClick={handleFavoriteToggle}
                                className={`p-3 rounded-full shadow-lg transition-all duration-200 
                         ${
                             isInFavorites
                                 ? 'bg-red-500 text-white'
                                 : 'bg-white text-gray-400 hover:text-red-500'
                         }`}
                            >
                                <Heart
                                    className={`w-6 h-6 ${
                                        isInFavorites ? 'fill-current' : ''
                                    }`}
                                />
                            </button>
                        </div>

                        {/* Pokemon Number */}
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2">
                            <span className="text-lg font-bold text-gray-600">
                                #{pokemon.id.toString().padStart(3, '0')}
                            </span>
                        </div>
                    </div>

                    {/* Pokemon Info Section */}
                    <div className="p-8">
                        {/* Name and Types */}
                        <div className="text-center mb-8">
                            <h1 className="text-4xl font-bold text-gray-800 capitalize mb-4">
                                {pokemon.name}
                            </h1>
                            <div className="flex justify-center space-x-3">
                                {pokemon.types.map((type) => (
                                    <span
                                        key={type.type.name}
                                        className={`px-4 py-2 rounded-full text-white text-lg font-medium capitalize 
                              ${typeColors[type.type.name] || 'bg-gray-400'}`}
                                    >
                                        {type.type.name}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Physical Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="bg-gray-50 rounded-2xl p-6">
                                <div className="flex items-center space-x-3 mb-3">
                                    <Ruler className="w-6 h-6 text-blue-500" />
                                    <h3 className="text-xl font-semibold text-gray-800">
                                        Physical Data
                                    </h3>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            Height:
                                        </span>
                                        <span className="font-semibold">
                                            {(pokemon.height / 10).toFixed(1)} m
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            Weight:
                                        </span>
                                        <span className="font-semibold">
                                            {(pokemon.weight / 10).toFixed(1)}{' '}
                                            kg
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-2xl p-6">
                                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                                    Abilities
                                </h3>
                                <div className="space-y-2">
                                    {pokemon.abilities.map((ability, index) => (
                                        <div
                                            key={index}
                                            className="bg-white rounded-lg px-3 py-2"
                                        >
                                            <span className="capitalize font-medium text-gray-700">
                                                {ability.ability.name.replace(
                                                    '-',
                                                    ' '
                                                )}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="bg-gray-50 rounded-2xl p-6">
                            <h3 className="text-xl font-semibold text-gray-800 mb-6">
                                Stats
                            </h3>
                            <div className="space-y-4">
                                {pokemon.stats.map((stat) => {
                                    const percentage =
                                        (stat.base_stat / 255) * 100
                                    return (
                                        <div key={stat.stat.name}>
                                            <div className="flex justify-between mb-2">
                                                <span className="capitalize text-gray-600 font-medium">
                                                    {stat.stat.name.replace(
                                                        '-',
                                                        ' '
                                                    )}
                                                </span>
                                                <span className="font-bold text-gray-800">
                                                    {stat.base_stat}
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-3">
                                                <div
                                                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full 
                                   transition-all duration-1000"
                                                    style={{
                                                        width: `${percentage}%`,
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default PokemonDetail
