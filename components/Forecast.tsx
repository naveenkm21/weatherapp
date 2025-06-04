import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ForecastData, TemperatureUnit } from "@/types/weather"
import { formatTemperature, getWeatherIconUrl } from "@/lib/api"

interface ForecastProps {
  data: ForecastData
  unit: TemperatureUnit
}

export default function Forecast({ data, unit }: ForecastProps) {
  // Group forecast data by day
  const groupedForecast = data.list.reduce(
    (acc, item) => {
      const date = new Date(item.dt * 1000)
      const day = date.toLocaleDateString("en-US", { weekday: "short" })

      if (!acc[day]) {
        acc[day] = []
      }

      acc[day].push(item)
      return acc
    },
    {} as Record<string, typeof data.list>,
  )

  // Get daily forecast (use noon forecast for each day)
  const dailyForecast = Object.entries(groupedForecast)
    .map(([day, forecasts]) => {
      // Find forecast closest to noon
      const noonForecast = forecasts.reduce((closest, current) => {
        const currentHour = new Date(current.dt * 1000).getHours()
        const closestHour = new Date(closest.dt * 1000).getHours()

        return Math.abs(currentHour - 12) < Math.abs(closestHour - 12) ? current : closest
      })

      return {
        day,
        forecast: noonForecast,
      }
    })
    .slice(0, 5) // Limit to 5 days

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">5-Day Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {dailyForecast.map(({ day, forecast }) => (
            <div key={day} className="flex flex-col items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
              <h3 className="font-medium text-lg">{day}</h3>
              <img
                src={getWeatherIconUrl(forecast.weather[0].icon) || "/placeholder.svg"}
                alt={forecast.weather[0].description}
                className="w-16 h-16 my-2"
              />
              <p className="text-lg font-semibold">{formatTemperature(forecast.main.temp, unit)}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{forecast.weather[0].description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
