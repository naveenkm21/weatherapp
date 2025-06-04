import { Card, CardContent } from "@/components/ui/card"
import type { WeatherData, TemperatureUnit } from "@/types/weather"
import { formatTemperature, formatDate, getWeatherIconUrl } from "@/lib/api"

interface CurrentWeatherProps {
  data: WeatherData
  unit: TemperatureUnit
}

export default function CurrentWeather({ data, unit }: CurrentWeatherProps) {
  return (
    <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-700 text-white">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h2 className="text-3xl font-bold flex items-center gap-2">
              {data.name}, {data.sys.country}
            </h2>
            <p className="text-lg opacity-90">{formatDate(data.dt, data.timezone)}</p>
          </div>

          <div className="flex items-center">
            <img
              src={getWeatherIconUrl(data.weather[0].icon) || "/placeholder.svg"}
              alt={data.weather[0].description}
              className="w-20 h-20"
            />
            <div className="text-center">
              <div className="text-5xl font-bold">{formatTemperature(data.main.temp, unit)}</div>
              <p className="text-xl capitalize">{data.weather[0].description}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 text-center">
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-sm opacity-80">Feels Like</p>
            <p className="text-xl font-semibold">{formatTemperature(data.main.feels_like, unit)}</p>
          </div>

          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-sm opacity-80">Humidity</p>
            <p className="text-xl font-semibold">{data.main.humidity}%</p>
          </div>

          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-sm opacity-80">Wind</p>
            <p className="text-xl font-semibold">
              {data.wind.speed} {unit === "metric" ? "m/s" : "mph"}
            </p>
          </div>

          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-sm opacity-80">Pressure</p>
            <p className="text-xl font-semibold">{data.main.pressure} hPa</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
