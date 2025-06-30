import React from 'react';
import { Heart, BookOpen } from 'lucide-react';
import { PokemonDetail } from '../types/pokemon';
import { isPokemonInStorage, addPokemonToStorage, removePokemonFromStorage } from '../utils/localStorage';

interface PokemonCardProps {
  pokemon: PokemonDetail;
  onClick: () => void;
  onLibraryChange?: () => void;
}

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
};

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon, onClick, onLibraryChange }) => {
  const isInLibrary = isPokemonInStorage(pokemon.id, 'library');
  const isInFavorites = isPokemonInStorage(pokemon.id, 'favorites');

  const handleLibraryToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInLibrary) {
      removePokemonFromStorage(pokemon.id, 'library');
    } else {
      addPokemonToStorage(pokemon.id, 'library');
    }
    onLibraryChange?.();
  };

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInFavorites) {
      removePokemonFromStorage(pokemon.id, 'favorites');
    } else {
      addPokemonToStorage(pokemon.id, 'favorites');
    }
    onLibraryChange?.();
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 
               transform hover:-translate-y-2 cursor-pointer overflow-hidden group"
    >
      <div className="relative">
        <div className="bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 p-6">
          <img
            src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
            alt={pokemon.name}
            className="w-32 h-32 mx-auto object-contain drop-shadow-lg 
                     group-hover:scale-110 transition-transform duration-300"
            loading="lazy"
          />
        </div>

        <div className="absolute top-2 right-2 flex space-x-2">
          <button
            onClick={handleLibraryToggle}
            className={`p-2 rounded-full shadow-lg transition-all duration-200 
                     ${isInLibrary ? 'bg-blue-500 text-white' : 'bg-white text-gray-400 hover:text-blue-500'}`}
          >
            <BookOpen className="w-4 h-4" />
          </button>
          <button
            onClick={handleFavoriteToggle}
            className={`p-2 rounded-full shadow-lg transition-all duration-200 
                     ${isInFavorites ? 'bg-red-500 text-white' : 'bg-white text-gray-400 hover:text-red-500'}`}
          >
            <Heart className={`w-4 h-4 ${isInFavorites ? 'fill-current' : ''}`} />
          </button>
        </div>

        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
          <span className="text-sm font-bold text-gray-600">#{pokemon.id.toString().padStart(3, '0')}</span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 capitalize mb-3 text-center">
          {pokemon.name}
        </h3>

        <div className="flex justify-center space-x-2 mb-4">
          {pokemon.types.map((type) => (
            <span
              key={type.type.name}
              className={`px-3 py-1 rounded-full text-white text-sm font-medium capitalize 
                        ${typeColors[type.type.name] || 'bg-gray-400'}`}
            >
              {type.type.name}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div className="text-center">
            <div className="font-semibold text-gray-800">Высота</div>
            <div>{(pokemon.height / 10).toFixed(1)} м</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-gray-800">Вес</div>
            <div>{(pokemon.weight / 10).toFixed(1)} кг</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonCard;
