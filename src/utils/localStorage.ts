export const getStoredPokemons = (key: 'library' | 'favorites'): number[] => {
    const stored = localStorage.getItem(`pokemon-${key}`)
    return stored ? JSON.parse(stored) : []
}

export const addPokemonToStorage = (
    pokemonId: number,
    key: 'library' | 'favorites'
): void => {
    const stored = getStoredPokemons(key)
    if (!stored.includes(pokemonId)) {
        stored.push(pokemonId)
        localStorage.setItem(`pokemon-${key}`, JSON.stringify(stored))
    }
}

export const removePokemonFromStorage = (
    pokemonId: number,
    key: 'library' | 'favorites'
): void => {
    const stored = getStoredPokemons(key)
    const filtered = stored.filter((id) => id !== pokemonId)
    localStorage.setItem(`pokemon-${key}`, JSON.stringify(filtered))
}

export const isPokemonInStorage = (
    pokemonId: number,
    key: 'library' | 'favorites'
): boolean => {
    const stored = getStoredPokemons(key)
    return stored.includes(pokemonId)
}
