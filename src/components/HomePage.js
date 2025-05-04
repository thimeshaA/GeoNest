import React, { useState, useEffect } from "react";
import CountryGrid from "./CountryGrid";
import CountryMap from "./CountryMap";
import { useAuth } from "../context/AuthContext";
import { favorites } from "../services/api";

export default function HomePage() {
  const [countries, setCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [regionFilter, setRegionFilter] = useState("All Regions");
  const [languageFilter, setLanguageFilter] = useState("All Languages");
  const [activeTab, setActiveTab] = useState("grid");
  const [favoriteCountries, setFavoriteCountries] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    // Fetch country data from a public API or local JSON
    // For now, we will fetch from restcountries.com API
    fetch("https://restcountries.com/v3.1/all")
      .then((res) => res.json())
      .then((data) => {
        // Sort countries by name
        const sorted = data.sort((a, b) =>
          a.name.common.localeCompare(b.name.common)
        );
        setCountries(sorted);
      })
      .catch((err) => console.error("Failed to fetch countries:", err));
  }, []);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (user) {
        try {
          const response = await favorites.getFavorites();
          setFavoriteCountries(response.data);
        } catch (error) {
          console.error('Error fetching favorites:', error);
        }
      }
    };

    fetchFavorites();
  }, [user]);

  const handleToggleFavorite = async (countryCode) => {
    if (!user) return;
    
    try {
      if (favoriteCountries.includes(countryCode)) {
        await favorites.removeFavorite(countryCode);
        setFavoriteCountries(prev => prev.filter(code => code !== countryCode));
      } else {
        await favorites.addFavorite(countryCode);
        setFavoriteCountries(prev => [...prev, countryCode]);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  // Get unique languages from countries
  const languages = React.useMemo(() => {
    const langSet = new Set();
    countries.forEach((country) => {
      if (country.languages) {
        Object.values(country.languages).forEach((lang) => langSet.add(lang));
      }
    });
    return ["All Languages", ...Array.from(langSet).sort()];
  }, [countries]);

  // Filter countries by search, region, and language
  const filteredCountries = countries.filter((country) => {
    const matchesSearch =
      country.name.common.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (country.altSpellings &&
        country.altSpellings.some((alt) =>
          alt.toLowerCase().includes(searchTerm.toLowerCase())
        ));
    const matchesRegion =
      regionFilter === "All Regions" || country.region === regionFilter;
    const matchesLanguage =
      languageFilter === "All Languages" ||
      (country.languages &&
        Object.values(country.languages).includes(languageFilter));
    return matchesSearch && matchesRegion && matchesLanguage;
  });

  const favoriteCountriesList = countries.filter(country => 
    favoriteCountries.includes(country.cca3)
  );

  const regions = ["All Regions", "Africa", "Americas", "Asia", "Europe", "Oceania"];

  return (
    <div>
      <div className="flex flex-col gap-2 h-[220px] justify-center">
        <h1 className="text-5xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent dark:from-emerald-400 dark:to-teal-300">
            GeoNest
          </span>
        </h1>
        <p className="text-muted-foreground max-w-3xl">
          Explore countries around the world. Click on any country to discover detailed information, view its location
          on the map, and learn about its culture, economy, and geography.
        </p>
      </div>
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex gap-2">
          {["grid", "map", "favorites"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md font-semibold transition-colors ${
                activeTab === tab
                  ? "bg-gradient-to-r from-emerald-600 to-teal-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              {tab === "grid" ? "Countries" : tab === "map" ? "Map" : "Favorites"}
            </button>
          ))}
        </div>
        {activeTab !== "favorites" && (
          <div className="flex gap-2 flex-wrap">
            <input
              type="text"
              placeholder="Search countries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
            <select
              value={languageFilter}
              onChange={(e) => setLanguageFilter(e.target.value)}
              className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              {languages.map((language) => (
                <option key={language} value={language}>
                  {language}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {activeTab === "grid" ? (
        <CountryGrid
          countries={filteredCountries}
          favoriteCountries={favoriteCountries}
          onToggleFavorite={handleToggleFavorite}
        />
      ) : activeTab === "map" ? (
        <CountryMap countries={filteredCountries} />
      ) : (
        <div>
          {!user ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">Sign in to view favorites</h2>
              <p className="text-gray-500 mb-6">Please sign in to view and manage your favorite countries.</p>
            </div>
          ) : favoriteCountriesList.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">No favorites yet</h2>
              <p className="text-gray-500">Start adding countries to your favorites by clicking the heart icon on any country card.</p>
            </div>
          ) : (
            <CountryGrid
              countries={favoriteCountriesList}
              favoriteCountries={favoriteCountries}
              onToggleFavorite={handleToggleFavorite}
            />
          )}
        </div>
      )}
    </div>
  );
}
