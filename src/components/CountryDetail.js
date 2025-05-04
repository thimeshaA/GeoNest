import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ArrowLeft, Globe, MapPin, Users, Building, Languages, Coins, Flag, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { favorites } from '../services/api';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

export default function CountryDetail() {
  const { cca3 } = useParams();
  const [country, setCountry] = useState(null);
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [borderCountries, setBorderCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch country data
        const countryRes = await fetch(`https://restcountries.com/v3.1/alpha/${cca3}`);
        if (!countryRes.ok) throw new Error("Failed to fetch country");
        const countryData = await countryRes.json();
        setCountry(countryData[0]);

        // Fetch border countries if any
        if (countryData[0]?.borders?.length) {
          const borderRes = await fetch(`https://restcountries.com/v3.1/alpha?codes=${countryData[0].borders.join(",")}`);
          if (borderRes.ok) {
            const borderData = await borderRes.json();
            setBorderCountries(borderData);
          }
        }

        // Fetch GeoJSON data
        const geoRes = await fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson');
        const geoData = await geoRes.json();
        setGeoJsonData(geoData);

        // Check if country is in favorites
        if (user) {
          try {
            const userFavorites = await favorites.getFavorites();
            setIsFavorite(userFavorites.data.includes(cca3));
          } catch (error) {
            console.error('Error fetching favorites:', error);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [cca3, user]);

  const toggleFavorite = async () => {
    if (!user) return;
    
    try {
      if (isFavorite) {
        await favorites.removeFavorite(cca3);
      } else {
        await favorites.addFavorite(cca3);
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 p-4">
        <div className="flex items-center gap-4">
          <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-8 w-64 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="h-[300px] w-full bg-gray-200 rounded animate-pulse"></div>
          <div className="space-y-4">
            <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-6 w-1/2 bg-gray-200 rounded animate-pulse"></div>
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-5 w-full bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!country || !geoJsonData) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Error</h2>
        <p className="text-gray-500 mb-6">Failed to load country data</p>
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </div>
    );
  }

  // Find the polygon feature for this country
  const feature = geoJsonData.features.find((f) => f.properties.ISO_A3 === cca3);
  const capitalLatLng = country.capitalInfo?.latlng || null;

  // Style for polygon
  const style = {
    fillColor: '#4f46e5',
    weight: 2,
    opacity: 1,
    color: '#4338ca',
    fillOpacity: 0.5,
  };

  // Extract currencies and languages
  const currencies = country.currencies
    ? Object.values(country.currencies).map((c) => `${c.name} (${c.symbol || 'No symbol'})`).join(', ')
    : 'N/A';

  const languages = country.languages
    ? Object.values(country.languages).join(', ')
    : 'N/A';

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="relative h-[300px] w-full overflow-hidden rounded-lg">
              <img
                src={country.flags.svg || country.flags.png}
                alt={country.flags.alt || `Flag of ${country.name.common}`}
                className="object-cover w-full h-full"
              />
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-1">{country.name.official}</h2>
                <p className="text-gray-500">
                  {country.name.nativeName ? Object.values(country.name.nativeName)[0].official : ""}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-emerald-500" />
                  <div>
                    <p className="font-medium">Region</p>
                    <p className="text-sm text-gray-500">
                      {country.region}, {country.subregion}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-emerald-500" />
                  <div>
                    <p className="font-medium">Capital</p>
                    <p className="text-sm text-gray-500">{country.capital?.[0] || "N/A"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-emerald-500" />
                  <div>
                    <p className="font-medium">Population</p>
                    <p className="text-sm text-gray-500">{country.population.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Languages className="h-5 w-5 text-emerald-500" />
                  <div>
                    <p className="font-medium">Languages</p>
                    <p className="text-sm text-gray-500">{languages}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Coins className="h-5 w-5 text-emerald-500" />
                  <div>
                    <p className="font-medium">Currency</p>
                    <p className="text-sm text-gray-500">{currencies}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-emerald-500" />
                  <div>
                    <p className="font-medium">UN Member</p>
                    <p className="text-sm text-gray-500">{country.unMember ? "Yes" : "No"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'map':
        return (
          <div className="h-[500px] w-full rounded-lg border overflow-hidden">
            <MapContainer
              center={capitalLatLng || [0, 0]}
              zoom={capitalLatLng ? 6 : 2}
              scrollWheelZoom={true}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {feature && <GeoJSON data={feature} style={style} />}
              {capitalLatLng && (
                <Marker position={capitalLatLng}>
                  <Popup>
                    Capital: {country.capital ? country.capital[0] : 'N/A'}
                  </Popup>
                </Marker>
              )}
            </MapContainer>
          </div>
        );

      case 'details':
        return (
          <div className="grid gap-6 md:grid-cols-2">
            <div className=" border border-emerald-600 rounded-lg shadow p-6">
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <Flag className="h-5 w-5 mr-2 text-emerald-500" />
                Country Information
              </h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2">
                  <p className="text-sm font-medium">Official Name</p>
                  <p className="text-sm ">{country.name.official}</p>
                </div>
                <div className="grid grid-cols-2">
                  <p className="text-sm font-medium">Alpha Codes</p>
                  <p className="text-sm ">
                    {country.cca2}, {country.cca3}, {country.ccn3}
                  </p>
                </div>
                <div className="grid grid-cols-2">
                  <p className="text-sm font-medium">TLD</p>
                  <p className="text-sm ">{country.tld?.join(", ") || "N/A"}</p>
                </div>
                <div className="grid grid-cols-2">
                  <p className="text-sm font-medium">Independent</p>
                  <p className="text-sm">{country.independent ? "Yes" : "No"}</p>
                </div>
              </div>
            </div>

            <div className="border border-emerald-600 rounded-lg shadow p-6">
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <Globe className="h-5 w-5 mr-2 text-emerald-500" />
                Geography
              </h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2">
                  <p className="text-sm font-medium">Coordinates</p>
                  <p className="text-sm ">{country.latlng?.join(", ") || "N/A"}</p>
                </div>
                <div className="grid grid-cols-2">
                  <p className="text-sm font-medium">Area</p>
                  <p className="text-sm ">{country.area?.toLocaleString()} km²</p>
                </div>
                <div className="grid grid-cols-2">
                  <p className="text-sm font-medium">Landlocked</p>
                  <p className="text-sm ">{country.landlocked ? "Yes" : "No"}</p>
                </div>
                <div className="grid grid-cols-2">
                  <p className="text-sm font-medium">Borders</p>
                  <p className="text-sm ">{country.borders?.join(", ") || "None"}</p>
                </div>
              </div>
            </div>

            <div className="border border-emerald-600 rounded-lg shadow p-6">
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <Users className="h-5 w-5 mr-2 text-emerald-500" />
                Demographics
              </h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2">
                  <p className="text-sm font-medium">Population</p>
                  <p className="text-sm ">{country.population.toLocaleString()}</p>
                </div>
                <div className="grid grid-cols-2">
                  <p className="text-sm font-medium">Gini Index</p>
                  <p className="text-sm ">
                    {country.gini
                      ? Object.entries(country.gini)
                          .map(([year, value]) => `${value} (${year})`)
                          .join(", ")
                      : "N/A"}
                  </p>
                </div>
                <div className="grid grid-cols-2">
                  <p className="text-sm font-medium">Demonyms</p>
                  <p className="text-sm ">
                    {country.demonyms ? `${country.demonyms.eng?.m || 'N/A'} (m), ${country.demonyms.eng?.f || 'N/A'} (f)` : "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <div className="border border-emerald-600 rounded-lg shadow p-6">
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <Coins className="h-5 w-5 mr-2 text-emerald-500" />
                Other Information
              </h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2">
                  <p className="text-sm font-medium">Timezones</p>
                  <p className="text-sm">{country.timezones?.join(", ") || "N/A"}</p>
                </div>
                <div className="grid grid-cols-2">
                  <p className="text-sm font-medium">Start of Week</p>
                  <p className="text-sm ">
                    {country.startOfWeek
                      ? country.startOfWeek.charAt(0).toUpperCase() + country.startOfWeek.slice(1)
                      : "N/A"}
                  </p>
                </div>
                <div className="grid grid-cols-2">
                  <p className="text-sm font-medium">Driving Side</p>
                  <p className="text-sm ">
                    {country.car?.side
                      ? country.car.side.charAt(0).toUpperCase() + country.car.side.slice(1)
                      : "N/A"}
                  </p>
                </div>
                <div className="grid grid-cols-2">
                  <p className="text-sm font-medium">FIFA Code</p>
                  <p className="text-sm ">{country.fifa || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 p-4 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 ">
        <div className="md:flex items-center  hidden gap-4">
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-emerald-600 to-teal-500"
          >
            <ArrowLeft className="mr-2 h-4 w-4 " />
            Back to Countries
          </Link>
          <h1 className="text-3xl font-bold">{country.name.common}</h1>
        </div>
        {user && (
          <button
            onClick={toggleFavorite}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
              isFavorite
                ? 'text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30'
                : 'text-gray-500 hover:text-red-500 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700'
            }`}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
            <span>{isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}</span>
          </button>
        )}
      </div>

      <div className="border-b border-gray-200 ">
        <nav className="-mb-px flex space-x-10">
          <button
            onClick={() => setActiveTab('overview')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'map'
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Map
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'details'
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Details
          </button>
        </nav>
      </div>

      <div className="mt-6">
        {renderTabContent()}
      </div>

      {borderCountries.length > 0 && activeTab === 'overview' && (
        <div className="border border-emerald-600 rounded-lg shadow p-6 mt-8">
          <h3 className="text-lg font-medium mb-4">Bordering Countries</h3>
          <div className="flex flex-wrap gap-2">
            {borderCountries.map((border) => (
              <Link
                to={`/country/${border.cca3}`}
                key={border.cca3}
                className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-full text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <img
                  src={border.flags.svg || border.flags.png}
                  alt={`Flag of ${border.name.common}`}
                  className="w-4 h-3 mr-2 rounded-sm"
                />
                {border.name.common}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}