import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function CountryGrid({ countries, favoriteCountries, onToggleFavorite }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleFavoriteClick = (e, countryCode) => {
    e.stopPropagation();
    if (user && onToggleFavorite) {
      onToggleFavorite(countryCode);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {countries.map((country) => (
        <div
          key={country.cca3}
          className="relative cursor-pointer rounded-lg shadow-md overflow-hidden bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow duration-300"
        >
          {user && (
            <button
              onClick={(e) => handleFavoriteClick(e, country.cca3)}
              className={`absolute top-2 right-2 p-1 rounded-full ${
                favoriteCountries.includes(country.cca3)
                  ? 'text-red-500 hover:text-red-600'
                  : 'text-gray-400 hover:text-red-500'
              }`}
              title={favoriteCountries.includes(country.cca3) ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={`h-6 w-6 ${favoriteCountries.includes(country.cca3) ? 'fill-current' : ''}`} />
            </button>
          )}
          <div onClick={() => navigate(`/country/${country.cca3}`)}>
            <img
              src={country.flags?.svg || country.flags?.png}
              alt={`Flag of ${country.name.common}`}
              className="w-full h-40 object-cover"
              loading="lazy"
            />
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-1">{country.name.common}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Capital: {country.capital ? country.capital[0] : 'N/A'}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Region: {country.region}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Population: {country.population.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
