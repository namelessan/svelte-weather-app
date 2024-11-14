<script lang="ts">
  import { writable } from 'svelte/store';
  import { onDestroy, onMount } from 'svelte';

  interface Location {
    id: string;
    name: string;
    country: string;
    lat: number;
    lon: number;
  }

  interface Props {
    locationSelect: (payload: {
      lat: number;
      lon: number;
      name: string;
    }) => void;
  }

  const searchResults = writable<Location[]>([]);
  const error = writable<string | null>(null);

  let loading = $state(false);
  let query = $state('');
  let visible = $state(false);
  let timeoutId: ReturnType<typeof setTimeout>;

  const { locationSelect }: Props = $props();

  async function fetchLocations(query: string) {
    if (!query) return;
    loading = true;
    error.set(null);

    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}`
      );
      if (!response.ok) throw new Error('Failed to fetch locations');

      const data = await response.json();
      const locations =
        data.results?.map((loc: any) => ({
          id: loc.id || `${loc.lat}-${loc.lon}`, // Unique identifier
          name: loc.name,
          country: loc.country,
          lat: loc.latitude,
          lon: loc.longitude,
        })) || [];

      searchResults.set(locations);
    } catch (err) {
      error.set((err as Error).message);
      searchResults.set([]);
    } finally {
      loading = false;
    }
  }

  function handleInputChange() {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fetchLocations(query);
    }, 300); // Debounce search input by 300ms
  }

  function selectLocation(location: Location) {
    locationSelect({
      lat: location.lat,
      lon: location.lon,
      name: `${location.name}, ${location.country}`,
    });
    // searchResults.set([]); // Clear results on selection
    query = `${location.name}, ${location.country}`; // set the query input to current selected location
    hideDropdown();
  }

  const hideDropdown = () => {
    visible = false;
  };

  const showDropdown = () => {
    visible = true;
  };

  onMount(() => {
    window.onclick = (event: MouseEvent) => {
      if (event && event.target) {
        const searchWrapper = document.querySelector('.search-wrapper');

        if (!searchWrapper?.contains(event.target as Node)) {
          hideDropdown();
        }
      }
    };
  });

  onDestroy(() => {
    clearTimeout(timeoutId); // Clear timeout on component destruction
  });
</script>

<div class="search-wrapper">
  <div class="search-box">
    <input
      type="text"
      bind:value={query}
      placeholder="Search for a city..."
      oninput={handleInputChange}
      onfocus={showDropdown}
      class="search-input"
    />

    <div class="dropdown" class:visible>
      {#if loading}
        <p class="loading">Loading...</p>
      {:else if $error}
        <p class="error">Error: {$error}</p>
      {:else if $searchResults.length > 0}
        <ul class="results-list">
          {#each $searchResults as location}
            <li class="result-item" onclick={() => selectLocation(location)}>
              {location.name}, {location.country}
            </li>
          {/each}
        </ul>
      {/if}
    </div>
  </div>
</div>

<style>
  .search-box {
    margin-bottom: 1em;
    position: relative;
    display: inline-block;
  }

  .search-input {
    height: 38px;
    font-size: 16px;
    width: 300px;
    box-sizing: border-box;
  }

  .dropdown {
    width: 300px;
    box-sizing: border-box;
    position: absolute;
    top: 38px;
    left: 0;
    border: 1px solid #ddd;
    display: none;
    background-color: #fff;
  }

  .dropdown.visible {
    display: block;
  }

  .results-list {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }

  .result-item {
    cursor: pointer;
    padding: 0.5em;
    border-bottom: 1px solid #ddd;
  }

  .result-item:hover {
    background-color: #f0f0f0;
  }

  .loading {
    font-size: 1em;
    color: #888;
  }

  .error {
    color: red;
  }
</style>
