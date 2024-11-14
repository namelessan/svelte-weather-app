<script lang="ts">
  import {
    weatherData,
    weatherUnit,
    loading,
    error,
    fetchWeather,
  } from '../stores/weatherStore';
  import type { City } from '../types';
  import { onMount } from 'svelte';

  const cities: City[] = [
    { name: 'Ha Noi, Vietnam', lat: 20.47366, lon: 106.02292 },
    { name: 'Ho Chi Minh city, Vietnam', lat: 10.82302, lon: 106.62965 },
    { name: 'Munich, Germany', lat: 48.13743, lon: 11.57549 },
  ];

  let selectedCity: City = cities[0];

  // Fetch weather on mount for default city
  onMount(() => {
    fetchWeather(selectedCity.lat, selectedCity.lon);
  });

  function handleCityChange() {
    fetchWeather(selectedCity.lat, selectedCity.lon);
  }
</script>

<h1>Weather App</h1>

<label for="city-select">Select City:</label>
<select id="city-select" bind:value={selectedCity} on:change={handleCityChange}>
  {#each cities as city}
    <option value={city}>{city.name}</option>
  {/each}
</select>

{#if $loading}
  <p class="loading">Loading...</p>
{:else if $error}
  <p class="error">Error: {$error}</p>
{:else if $weatherData && $weatherUnit}
  <div class="weather-info">
    <p>Temperature: {$weatherData.temperature} {$weatherUnit.temperature}</p>
    <p>Wind Speed: {$weatherData.windspeed} {$weatherUnit.windspeed}</p>
    <p>
      Wind Direction: {$weatherData.winddirection}{$weatherUnit.winddirection}
    </p>
  </div>
{/if}

<style>
  .loading {
    font-size: 1.2em;
    color: #888;
  }

  .error {
    color: red;
  }

  .weather-info {
    margin-top: 1em;
  }
</style>
