<script lang="ts">
  import type { MovieType } from '$lib/types/MovieType';
  import { Rating } from '@skeletonlabs/skeleton-svelte';
  // goo
  import { writable } from 'svelte/store';

  let { movie } = $props<{ movie: MovieType }>();
  // goo 5
  let imgError = $state(false);
  const defaultImage = '/defaultMoviePoster.png';

  function handleImageError() {
      imgError = true;
  }
  
  // Calculate star rating
  const stars = Array.from({ length: 5 }, (_, i) => i < Math.round(movie.rating));
  let ratingOutOfFive = movie.imdb.rating / 2;
  console.log("rating ", ratingOutOfFive);
  console.log("rating ", movie.imdb.rating);
  console.log("movie ", movie)
  // goo
  // Create a proper Svelte store
  const rating = writable(movie?.imdb?.rating || 0);

  // Keep the movie object in sync when store value changes
  rating.subscribe(value => {
    if (movie?.imdb) {
      movie.imdb.rating = value;
    }
  })
  
</script>
<!-- here -->
<div class="card w-full max-w-2xl bg-white dark:bg-gray-800 shadow-xl border border-black">
  <!-- here -->
  <div class="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6 p-2">
    <!-- Movie Poster -->
    <div class="relative aspect-[2/3] w-full">
      <!-- goo  7    src={movie.poster || "/placeholder.svg"} -->
      <img
        src={imgError ? defaultImage : movie.poster}
        alt="{movie.title} poster"
        onerror={handleImageError}
        loading="lazy"
        class="w-full h-full object-cover rounded-lg"
      />
    </div>

    <!-- Content -->
    <div class="p-6 flex flex-col gap-2">
      <!-- Header -->
      <div class="space-y-1">
        <h2 class="text-3xl font-bold tracking-tight">
          {movie.title} <span class="text-gray-500 dark:text-gray-400">({movie.year})</span>
        </h2>
        <!-- here -->
        <h2 class="text-lg tracking-tight">
          Rated: {movie.rated} <span class="text-gray-500 dark:text-gray-400"></span>
        </h2>
        <h2 class="text-sm text-gray-500 dark:text-gray-400">
          Awards: <span class="font-semibold">{movie.awards.text}</span>
        </h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Directed by <span class="font-semibold">{movie.directors.join(',')}</span>
        </p>
      </div>

      <!-- Rating -->
      <div class="flex items-center gap-4">
        <!-- here -->
        <div class="flex gap-1">
          <!-- goo -->
          <!-- <Rating value={ratingOutOfFive} allowHalf readOnly /> -->
          <Rating value={$rating} allowHalf readOnly></Rating>
        </div>
        <span class="text-sm font-medium">{ratingOutOfFive} Stars</span>
        <!-- <span class="text-sm text-gray-500 dark:text-gray-400">({movie.reviews} reviews)</span> -->
      </div>

      <!-- Metadata -->
      <div class="flex gap-4 text-sm">
        <span class="px-2.5 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-100">
          {movie.runtime} minutes
        </span>
        {#each movie.genre as g}
          <span class="px-2.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100">
            {g}
          </span>
        {/each}
      </div>

      <!-- Plot -->
      <p class="text-gray-700 dark:text-gray-300 line-clamp-3">
        {movie.plot}
      </p>

      <!-- Cast -->
      <div class="space-y-1">
        <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100">Starring</h3>
        <div class="flex flex-wrap gap-1">
          {#each movie.cast as actor}
            <span class="px-2.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 text-sm">
              {actor}
            </span>
          {/each}
        </div>
      </div>

      <!-- Genres -->
      <div class="flex gap-4 mt-auto">
        <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100">Genres</h3>
        <span class="text-sm font-medium">{movie.genres.join(', ')}</span>
        <!-- here -->    
      </div>
      <!-- here -->
      <div class="flex gap-4 mt-auto">
        <button class="btn preset-outlined-primary-50-950 bg-red-500 text-white" type="button">
          Add to Watchlist
        </button>
    </div>
    </div>
  </div>
</div>

<style>
  /* Add any custom styles here if needed */
</style>
