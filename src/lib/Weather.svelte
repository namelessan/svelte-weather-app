<script lang="ts">
  import {
    weatherData,
    weatherUnit,
    loading,
    error,
    fetchWeather,
  } from '../stores/weatherStore';
  import type { City } from '../types';
  import LocationSearch from './LocationSearch.svelte';

  let selectedLocation = { lat: 0, lon: 0, name: '' };

  function locationSelect(payload: City) {
    selectedLocation = payload;
    fetchWeather(selectedLocation.lat, selectedLocation.lon);
  }
</script>

<h1>Weather App</h1>

<label for="city-select">Select City:</label>
<LocationSearch {locationSelect}></LocationSearch>

{#if $loading}
  <p class="loading">Loading...</p>
{:else if $error}
  <p class="error">Error: {$error}</p>
{:else if $weatherData}
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
