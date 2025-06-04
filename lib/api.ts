import type { WeatherData, ForecastData, TemperatureUnit } from "@/types/weather"

const API_KEY = "347cbe31110b5ebb0465f0059cc8527a"
const BASE_URL = "https://api.openweathermap.org/data/2.5"

export async function fetchWeatherData(query: string, unit: TemperatureUnit = "metric"): Promise<WeatherData> {
  // Check if query is coordinates or city name
  const isCoords = query.includes("lat=")
  const url = `${BASE_URL}/weather?${isCoords ? query : `q=${query}`}&appid=${API_KEY}&units=${unit}`

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

  // Format the data to match our WeatherData type
  return {
    name: data.name,
    country: data.sys.country,
    dt: data.dt,
    weather: data.weather,
    main: data.main,
    wind: data.wind,
    clouds: data.clouds,
    visibility: data.visibility,
    sys: data.sys,
    coord: data.coord,
    timezone: data.timezone,
  }
}

export async function fetchForecastData(query: string, unit: TemperatureUnit = "metric"): Promise<ForecastData> {
  // Check if query is coordinates or city name
  const isCoords = query.includes("lat=")
  const url = `${BASE_URL}/forecast?${isCoords ? query : `q=${query}`}&appid=${API_KEY}&units=${unit}`

  const response = await fetch(url)

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Forecast data not available for this location.")
    } else {
      throw new Error(`Weather service error: ${response.status}`)
    }
  }

  return await response.json()
}

export function getWeatherIconUrl(iconCode: string): string {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`
}

export function formatTemperature(temp: number, unit: TemperatureUnit): string {
  return `${Math.round(temp)}°${unit === "metric" ? "C" : "F"}`
}

export function formatDate(timestamp: number, timezone = 0, options: Intl.DateTimeFormatOptions = {}): string {
  // Convert timestamp to milliseconds and add timezone offset
  const utcTime = timestamp * 1000
  const localTime = utcTime + timezone * 1000
  const date = new Date(localTime)

  const defaultOptions: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC", // Use UTC since we've already adjusted for timezone
    ...options,
  }

  return new Intl.DateTimeFormat("en-US", defaultOptions).format(date)
}

export function formatTime(timestamp: number, timezone = 0): string {
  // The timestamp is in UTC seconds, timezone is offset in seconds
  // Convert timestamp to milliseconds and add timezone offset
  const utcTime = timestamp * 1000
  const localTime = utcTime + timezone * 1000
  const date = new Date(localTime)

  // Format the time
  const hours = date.getUTCHours()
  const minutes = date.getUTCMinutes()

  // Convert to 12-hour format
  const hour12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours
  const ampm = hours >= 12 ? "PM" : "AM"
  const minutesStr = minutes.toString().padStart(2, "0")

  return `${hour12}:${minutesStr} ${ampm}`
}

export function getWindDirection(degrees: number): string {
  const directions = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ]
  const index = Math.round(degrees / 22.5) % 16
  return directions[index]
}
