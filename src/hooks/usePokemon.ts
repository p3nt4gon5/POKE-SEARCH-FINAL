import { useState, useEffect } from 'react'
import { Pokemon, PokemonDetail, PokemonListResponse } from '../types/pokemon'

export const usePokemonList = () => {
    const [allPokemons, setAllPokemons] = useState<Pokemon[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchAllPokemons = async () => {
            try {
                const response = await fetch(
                    'https://pokeapi.co/api/v2/pokemon?limit=1000'
                )
                const data: PokemonListResponse = await response.json()
                setAllPokemons(
                    data.results.map((pokemon, index) => ({
                        ...pokemon,
                        id: index + 1,
                    }))
                )
            } catch (error) {
                console.error('Error fetching pokemons:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchAllPokemons()
    }, [])

    return { allPokemons, loading }
}

export const usePokemonDetail = (pokemonId: string | undefined) => {
    const [pokemon, setPokemon] = useState<PokemonDetail | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!pokemonId) return

        const fetchPokemon = async () => {
            try {
                const response = await fetch(
                    `https://pokeapi.co/api/v2/pokemon/${pokemonId}`
                )
                const data: PokemonDetail = await response.json()
                setPokemon(data)
            } catch (error) {
                console.error('Error fetching pokemon detail:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchPokemon()
    }, [pokemonId])

    return { pokemon, loading }
}
