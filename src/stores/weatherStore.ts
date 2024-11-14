import { writable } from 'svelte/store';
import type {
  CurrentWeatherResponse,
  WeatherData,
  WeatherUnit,
} from '../types';

export const weatherData = writable<WeatherData | null>(null);
export const weatherUnit = writable<WeatherUnit | null>(null);
export const loading = writable<boolean>(false);
export const error = writable<string | null>(null);

export async function fetchWeather(lat: number, lon: number) {
  loading.set(true);
  error.set(null);

  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }

    const data: CurrentWeatherResponse = await response.json();
    weatherData.set(data.current_weather);
    weatherUnit.set(data.current_weather_units);
  } catch (err) {
    error.set((err as Error).message);
  } finally {
    loading.set(false);
  }
}
