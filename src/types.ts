export interface WeatherData {
  temperature: number;
  windspeed: number;
  winddirection: number;
}

export interface WeatherUnit {
  temperature: string;
  windspeed: string;
  winddirection: string;
}

export interface CurrentWeatherResponse {
  current_weather: WeatherData;
  current_weather_units: WeatherUnit;
}

export interface City {
  name: string;
  lat: number;
  lon: number;
}
