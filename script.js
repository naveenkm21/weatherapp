// Weather App JavaScript
class WeatherApp {
  constructor() {
    // OpenWeatherMap API configuration
    this.API_KEY = "347cbe31110b5ebb0465f0059cc8527a"
    this.BASE_URL = "https://api.openweathermap.org/data/2.5/weather"

    // DOM elements
    this.cityInput = document.getElementById("cityInput")
    this.searchBtn = document.getElementById("searchBtn")
    this.errorMessage = document.getElementById("errorMessage")
    this.errorText = document.getElementById("errorText")
    this.weatherSection = document.getElementById("weatherSection")

    // Weather display elements
    this.cityName = document.getElementById("cityName")
    this.currentDate = document.getElementById("currentDate")
    this.weatherIcon = document.getElementById("weatherIcon")
    this.temperature = document.getElementById("temperature")
    this.weatherDescription = document.getElementById("weatherDescription")
    this.feelsLike = document.getElementById("feelsLike")
    this.humidity = document.getElementById("humidity")
    this.windSpeed = document.getElementById("windSpeed")
    this.pressure = document.getElementById("pressure")
    this.visibility = document.getElementById("visibility")

    this.initializeEventListeners()
  }

  /**
   * Initialize event listeners for user interactions
   */
  initializeEventListeners() {
    // Search button click event
    this.searchBtn.addEventListener("click", () => {
      this.handleWeatherSearch()
    })

    // Enter key press in input field
    this.cityInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.handleWeatherSearch()
      }
    })

    // Clear error message when user starts typing
    this.cityInput.addEventListener("input", () => {
      this.hideError()
    })
  }

  /**
   * Handle weather search functionality
   */
  async handleWeatherSearch() {
    const city = this.cityInput.value.trim()

    // Validate input
    if (!city) {
      this.showError("Please enter a city name")
      return
    }

    // Show loading state
    this.setLoadingState(true)
    this.hideError()
    this.hideWeatherData()

    try {
      // Fetch weather data
      const weatherData = await this.fetchWeatherData(city)

      // Display weather data
      this.displayWeatherData(weatherData)
    } catch (error) {
      // Handle and display errors
      this.handleError(error)
    } finally {
      // Hide loading state
      this.setLoadingState(false)
    }
  }

  /**
   * Fetch weather data from OpenWeatherMap API
   * @param {string} city - City name to search for
   * @returns {Promise<Object>} Weather data object
   */
  async fetchWeatherData(city) {
    const url = `${this.BASE_URL}?q=${encodeURIComponent(city)}&appid=${this.API_KEY}&units=metric`

    const response = await fetch(url)

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("City not found. Please check the spelling and try again.")
      } else if (response.status === 401) {
        throw new Error("API key error. Please check your API configuration.")
      } else {
        throw new Error(`Weather service error: ${response.status}`)
      }
    }

    const data = await response.json()
    return data
  }

  /**
   * Display weather data in the UI
   * @param {Object} data - Weather data from API
   */
  displayWeatherData(data) {
    // Update city name and date
    this.cityName.textContent = `${data.name}, ${data.sys.country}`
    this.currentDate.textContent = this.formatDate(new Date())

    // Update weather icon
    const iconCode = data.weather[0].icon
    this.weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`
    this.weatherIcon.alt = data.weather[0].description

    // Update temperature and description
    this.temperature.textContent = Math.round(data.main.temp)
    this.weatherDescription.textContent = data.weather[0].description
    this.feelsLike.textContent = `Feels like ${Math.round(data.main.feels_like)}°C`

    // Update weather details
    this.humidity.textContent = `${data.main.humidity}%`
    this.windSpeed.textContent = `${data.wind.speed} m/s`
    this.pressure.textContent = `${data.main.pressure} hPa`
    this.visibility.textContent = data.visibility ? `${(data.visibility / 1000).toFixed(1)} km` : "N/A"

    // Show weather section
    this.showWeatherData()
  }

  /**
   * Handle and display errors
   * @param {Error} error - Error object
   */
  handleError(error) {
    console.error("Weather App Error:", error)

    let errorMessage = "An unexpected error occurred. Please try again."

    if (error.message.includes("City not found")) {
      errorMessage = error.message
    } else if (error.message.includes("API key")) {
      errorMessage = error.message
    } else if (error.name === "TypeError" && error.message.includes("fetch")) {
      errorMessage = "Network error. Please check your internet connection and try again."
    } else if (error.message.includes("Weather service error")) {
      errorMessage = "Weather service is temporarily unavailable. Please try again later."
    }

    this.showError(errorMessage)
  }

  /**
   * Show error message
   * @param {string} message - Error message to display
   */
  showError(message) {
    this.errorText.textContent = message
    this.errorMessage.style.display = "block"
  }

  /**
   * Hide error message
   */
  hideError() {
    this.errorMessage.style.display = "none"
  }

  /**
   * Show weather data section
   */
  showWeatherData() {
    this.weatherSection.style.display = "block"
  }

  /**
   * Hide weather data section
   */
  hideWeatherData() {
    this.weatherSection.style.display = "none"
  }

  /**
   * Set loading state for search button
   * @param {boolean} isLoading - Loading state
   */
  setLoadingState(isLoading) {
    this.searchBtn.disabled = isLoading

    const btnText = this.searchBtn.querySelector(".btn-text")
    const btnLoading = this.searchBtn.querySelector(".btn-loading")

    if (isLoading) {
      btnText.style.display = "none"
      btnLoading.style.display = "inline-block"
    } else {
      btnText.style.display = "inline-block"
      btnLoading.style.display = "none"
    }
  }

  /**
   * Format date for display
   * @param {Date} date - Date object to format
   * @returns {string} Formatted date string
   */
  formatDate(date) {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
    return date.toLocaleDateString("en-US", options)
  }
}

// Initialize the weather app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new WeatherApp()
})

// Add some additional utility functions for enhanced functionality

/**
 * Utility function to debounce API calls (optional enhancement)
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Utility function to validate city name input
 * @param {string} city - City name to validate
 * @returns {boolean} True if valid, false otherwise
 */
function isValidCityName(city) {
  // Basic validation: only letters, spaces, hyphens, and apostrophes
  const cityRegex = /^[a-zA-Z\s\-']+$/
  return cityRegex.test(city) && city.length >= 2 && city.length <= 50
}
