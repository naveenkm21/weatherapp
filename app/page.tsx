"use client"

import { useState, useEffect } from "react"
import SearchBar from "@/components/SearchBar"
import CurrentWeather from "@/components/CurrentWeather"
import Forecast from "@/components/Forecast"
import WeatherDetails from "@/components/WeatherDetails"
import UnitToggle from "@/components/UnitToggle"
import SearchHistory from "@/components/SearchHistory"
import SimpleLeafletMap from "@/components/SimpleLeafletMap"
import ThemeToggle from "@/components/ThemeToggle"
import LoadingState from "@/components/LoadingState"
import ErrorDisplay from "@/components/ErrorDisplay"
import { fetchWeatherData, fetchForecastData } from "@/lib/api"
import type { WeatherData, ForecastData, TemperatureUnit } from "@/types/weather"

export default function Home() {
  // State management
  const [city, setCity] = useState<string>("")
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [forecastData, setForecastData] = useState<ForecastData | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [unit, setUnit] = useState<TemperatureUnit>("metric")
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [darkMode, setDarkMode] = useState<boolean>(false)

  // Load search history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("searchHistory")
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory))
    }

    // Check user's preferred color scheme
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setDarkMode(true)
    }
  }, [])

  // Save search history to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory))
  }, [searchHistory])

  // Apply dark mode class to body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode")
    } else {
      document.body.classList.remove("dark-mode")
    }
  }, [darkMode])

  // Handle search submission
  const handleSearch = async (searchCity: string) => {
    if (!searchCity.trim()) return

    setLoading(true)
    setError(null)

    try {
      // Fetch current weather data
      const weather = await fetchWeatherData(searchCity, unit)
      setWeatherData(weather)

      // Fetch forecast data
      const forecast = await fetchForecastData(searchCity, unit)
      setForecastData(forecast)

      // Update search history
      const cityName = `${weather.name}, ${weather.country}`
      if (!searchHistory.includes(cityName)) {
        const updatedHistory = [cityName, ...searchHistory].slice(0, 5)
        setSearchHistory(updatedHistory)
      }

      // Update current city
      setCity(cityName)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
      console.error("Error fetching weather data:", err)
    } finally {
      setLoading(false)
    }
  }

  // Handle unit toggle
  const handleUnitChange = async (newUnit: TemperatureUnit) => {
    setUnit(newUnit)
    if (weatherData) {
      setLoading(true)
      setError(null)

      try {
        // Re-fetch data with new unit using coordinates for accuracy
        const coordQuery = `lat=${weatherData.coord.lat}&lon=${weatherData.coord.lon}`

        const weather = await fetchWeatherData(coordQuery, newUnit)
        setWeatherData(weather)

        const forecast = await fetchForecastData(coordQuery, newUnit)
        setForecastData(forecast)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update temperature units")
      } finally {
        setLoading(false)
      }
    }
  }

  // Handle theme toggle
  const handleThemeToggle = () => {
    setDarkMode(!darkMode)
  }

  // Handle geolocation request
  const handleGeolocation = () => {
    if (navigator.geolocation) {
      setLoading(true)
      setError(null)
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords
            const weather = await fetchWeatherData(`lat=${latitude}&lon=${longitude}`, unit)
            setWeatherData(weather)

            const forecast = await fetchForecastData(`lat=${latitude}&lon=${longitude}`, unit)
            setForecastData(forecast)

            const cityName = `${weather.name}, ${weather.country}`
            setCity(cityName)

            // Update search history
            if (!searchHistory.includes(cityName)) {
              const updatedHistory = [cityName, ...searchHistory].slice(0, 5)
              setSearchHistory(updatedHistory)
            }
          } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to get weather for your location")
          } finally {
            setLoading(false)
          }
        },
        (err) => {
          setError("Unable to retrieve your location. Please allow location access or search manually.")
          setLoading(false)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        },
      )
    } else {
      setError("Geolocation is not supported by your browser")
    }
  }

  return (
    <main className={`min-h-screen p-4 md:p-8 ${darkMode ? "dark" : ""}`}>
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-gradient">Weather App</h1>
          <p className="text-lg opacity-80">Get detailed weather information for any location</p>
        </header>

        <div className="flex justify-between items-center mb-6">
          <UnitToggle unit={unit} onUnitChange={handleUnitChange} />
          <ThemeToggle darkMode={darkMode} onToggle={handleThemeToggle} />
        </div>

        <SearchBar onSearch={handleSearch} onGeolocation={handleGeolocation} />

        {searchHistory.length > 0 && (
          <SearchHistory history={searchHistory} onSelect={handleSearch} onClear={() => setSearchHistory([])} />
        )}

        {error && <ErrorDisplay message={error} />}

        {loading ? (
          <LoadingState />
        ) : (
          weatherData && (
            <div className="mt-8 grid gap-8">
              <CurrentWeather data={weatherData} unit={unit} />

              {forecastData && <Forecast data={forecastData} unit={unit} />}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <WeatherDetails data={weatherData} unit={unit} />
                <SimpleLeafletMap
                  city={city}
                  coordinates={{
                    lat: weatherData.coord.lat,
                    lon: weatherData.coord.lon,
                  }}
                />
              </div>
            </div>
          )
        )}
      </div>
    </main>
  )
}
