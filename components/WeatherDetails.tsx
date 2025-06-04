"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { WeatherData, TemperatureUnit } from "@/types/weather"
import { formatTime, getWindDirection } from "@/lib/api"
import { Sunrise, Sunset, Wind, Droplets, Eye, Gauge, CloudRain } from "lucide-react"

interface WeatherDetailsProps {
  data: WeatherData
  unit: TemperatureUnit
}

export default function WeatherDetails({ data, unit }: WeatherDetailsProps) {
  const detailItems = [
    {
      icon: <Sunrise size={24} className="text-orange-500" />,
      label: "Sunrise",
      value: formatTime(data.sys.sunrise, data.timezone),
    },
    {
      icon: <Sunset size={24} className="text-red-500" />,
      label: "Sunset",
      value: formatTime(data.sys.sunset, data.timezone),
    },
    {
      icon: <Wind size={24} className="text-blue-500" />,
      label: "Wind",
      value: `${data.wind.speed} ${unit === "metric" ? "m/s" : "mph"} ${getWindDirection(data.wind.deg)}`,
    },
    {
      icon: <Droplets size={24} className="text-blue-400" />,
      label: "Humidity",
      value: `${data.main.humidity}%`,
    },
    {
      icon: <Eye size={24} className="text-gray-500" />,
      label: "Visibility",
      value: `${(data.visibility / 1000).toFixed(1)} km`,
    },
    {
      icon: <Gauge size={24} className="text-purple-500" />,
      label: "Pressure",
      value: `${data.main.pressure} hPa`,
    },
    {
      icon: <CloudRain size={24} className="text-blue-600" />,
      label: "Cloudiness",
      value: `${data.clouds.all}%`,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">Weather Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {detailItems.map((item, index) => (
            <div key={index} className="flex items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
              <div className="mr-3">{item.icon}</div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{item.label}</p>
                <p className="font-medium">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
