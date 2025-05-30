<script lang="ts">
    import { Slider, Pagination } from '@skeletonlabs/skeleton-svelte'
    import type { MovieType } from '$lib/types/MovieType'
    import Movie from '$lib/components/Movie.svelte'
    import { browser } from '$app/environment'

    let movies = $state<MovieType[]>(
        browser ? JSON.parse(localStorage.getItem('movies') || '[]') : []
    )

    let selectedRatings = $state<Record<string, boolean>>(
        browser
            ? JSON.parse(
                    localStorage.getItem('selectedRatings') ||
                        '{"G": false, "PG": false, "PG-13": false, "R": false}'
                )
            : { G: false, PG: false, 'PG-13': false, R: false }
    )

    let yearRange = $state<[number, number]>(
        browser ? JSON.parse(localStorage.getItem('yearRange') || '[1900, 2016]') : [1900, 2016]
    )

    let scoreRange = $state<[number, number]>(
        browser ? JSON.parse(localStorage.getItem('scoreRange') || '[0, 10]') : [0, 10]
    )

    // Constants
    const minYear = 1900
    const maxYear = 2016

    $effect(() => {
        if (browser) {
            localStorage.setItem('movies', JSON.stringify(movies))
            localStorage.setItem('selectedRatings', JSON.stringify(selectedRatings))
            localStorage.setItem('yearRange', JSON.stringify(yearRange))
            localStorage.setItem('scoreRange', JSON.stringify(scoreRange))
        }
    })

    function constructUrl(movieId: string) {
        return `/movies/${movieId}`
    }

    // Add pagination state
    let page = $state(0)
    let pageSize = $state(12) // Number of movie posters per page to show
    // goo
    let paginatedMovies = $derived(movies.slice(page * pageSize, (page + 1) * pageSize))
    
    let totalPages = $derived(Math.ceil(movies.length / pageSize))

    // Handle rating selection
    function handleRatingChange(rating: string, checked: boolean) {
        selectedRatings[rating] = checked
        console.log({
            yearRange: [...yearRange],
            selectedRatings: { ...selectedRatings },
            scoreRange: [...scoreRange]
        })
    }

    function handlePageChange(event: any) {
        //goo -1
        page = event.page -1
    }

    async function handleSearch() {
        try {
            const searchCriteria = {
                yearRange,
                selectedRatings: Object.entries(selectedRatings)
                    .filter(([_, isSelected]) => isSelected)
                    .map(([rating]) => rating),
                scoreRange
            }

            // Make API call to search for movies
            const response = await fetch('/api/movies', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(searchCriteria)
            })

            if (!response.ok) {
                throw new Error('Failed to search for movies')
            }
            const data = await response.json()
            console.log('Search results: ', data)
            movies = data
        } catch (error) {
            console.error('Search error: ', error)
        }
    }
</script>

        
        <!-- 🌿 TOP NAVIGATION -->
<nav class="bg-gradient-to-r from-white to-cyan-600 text-white shadow-lg sticky top-0 z-50">
	<div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
		<h1 class="text-xl font-bold text-cyan-600">Gabbe's MovieVerse</h1>
		<div class="flex gap-4 text-sm md:text-base">
			<a href="/" class="hover:text-white/80 transition">🌍 Home</a>
			<a href="/movies" class="hover:text-white/80 transition">🎬 Movies</a>
			<a href="/airbnb" class="hover:text-white/80 transition">🏡 Airbnb</a>
			<a href="/sales" class="hover:text-white/80 transition">💰 Sales</a>
		</div>
	</div>
</nav>


<div class="min-h-screen bg-cyan-600">
    <div class="container mx-auto px-4 py-2">
        <div class="card">
            <header class="mb-2 text-center">
                <h5 class="h5 rounded-lg bg-gradient-to-r from-primary-200 to-tertiary-200">
                    🎬 Movie Discovery
                </h5>
            </header>

            <!-- Year Range Section -->
            <section class="flex">
                <h5 class="h5 mb-2 pt-2 text-secondary-50">Release Year Range</h5>
                <div class="grow px-4">
                    <div class="mb-2 flex justify-between font-bold">
                        <span class="text-surface-200">{yearRange[0]}</span>
                        <span class="text-surface-200">{yearRange[1]}</span>
                    </div>
                    <!-- goo -->
                    <Slider value={yearRange} onValueChange={(e) => yearRange = e.value as [number, number]} min={minYear} max={maxYear} step={1} />
                </div>
            </section>

            <!-- Ratings Section -->
            <section class="flex flex-col md:flex-row">
                <h5 class="h5 mr-4 text-secondary-50">Ratings</h5>
                <div class="flex flex-wrap gap-4 font-bold">
                    {#each Object.entries(selectedRatings) as [rating, checked]}
                        <label class="flex cursor-pointer items-center space-x-2">
                            <input
                                type="checkbox"
                                name="rating-{rating}"
                                {checked}
                                onchange={(e) => handleRatingChange(rating, e.currentTarget.checked)}
                                class="checkbox"
                            />
                            <span class="text-surface-200">{rating}</span>
                        </label>
                    {/each}
                </div>
            </section>

            <!-- Critic Score Section -->
            <section class="mb-2 flex grow">
                <h5 class="h5 mb-4 text-secondary-50">Critic Range</h5>
                <div class="grow px-4">
                    <div class="mb-2 flex justify-between font-bold">
                        <span class="text-surface-200">{scoreRange[0]}</span>
                        <span class="text-surface-200">{scoreRange[1]}</span>
                    </div>
                    <!-- goo -->
                    <Slider value={scoreRange} onValueChange={(e) => scoreRange = e.value as [number, number]} min={0} max={10} step={1} />
                </div>
            </section>

            <!-- Search Button -->
            <div class="text-center">
                <button
                    type="button"
                    class="btn rounded-full bg-primary-50 font-semibold preset-filled text-black"
                    onclick={handleSearch}>
                    Find Movies 🍿
                </button>
            </div>
        </div>
    </div>
    <hr />
    <div class="container mx-auto p-2">
        <h5 class="h5 text-center text-surface-200">{movies.length} movies found</h5>
        <div class="flex flex-wrap justify-center">
            {#if movies.length > 0}
                {#each paginatedMovies as movie}
                    <a href={constructUrl(movie.id)}>
                        <Movie {...movie} />
                    </a>
                {/each}
            {:else}
                <p class="text-center text-surface-200">No movies available for selected filters</p>
            {/if}
        </div>
        {#if movies.length > 0}
            <div class="mb-8 mt-4 flex justify-center">
                <!-- goo add +1-->
                <Pagination data={movies} page={page + 1} {pageSize} onPageChange={handlePageChange} siblingCount={5}/>

            </div>
        {/if}
    </div>
</div>

