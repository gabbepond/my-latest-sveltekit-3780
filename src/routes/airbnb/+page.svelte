<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import AirbnbListings from '$lib/components/AirbnbListings.svelte';
	import { Rating } from '@skeletonlabs/skeleton-svelte';
	import { enhance } from '$app/forms';
	import { updated } from '$app/state';
	import type { ActionData, PageData } from './$types';

	const { data, form } = $props<{ data: PageData; form: ActionData | null }>();

	if (!data.userProfile && browser) goto('/');

	let scrollElement: HTMLElement;
	let formVisible = $state(true);
	let starValue = $state(2);
	let listingName = $state('My Listing');
	let loading = $state(false);
	let selectedListing = $state('');

	function handleSelectListing(listing: any) {
		selectedListing = listing;
		formVisible = true;
		if (listing?.name) listingName = listing.name;
		scrollElement.scrollIntoView({ behavior: 'smooth' });
	}

	function resetForm() {
		formVisible = false;
		selectedListing = '';
		starValue = 1;
	}
</script>

<!-- 🌿 TOP NAVIGATION -->
<nav class="bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-md sticky top-0 z-50">
	<div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
		<div class="flex items-center text-left">
			<img src="/airbnb.png" alt="Airbnb Logo" class="m-2" />
			<h5 class="h6 m-2 text-gray-100 italic">Living Your Best Life</h5>
		</div>
		<div class="flex gap-4 text-sm md:text-base">
			<a href="/" class="hover:text-white/80 transition">🌍 Home</a>
			<a href="/movies" class="hover:text-white/80 transition">🎬 Movies</a>
			<a href="/airbnb" class="hover:text-white/80 transition">🏡 Airbnb</a>
			<a href="/sales" class="hover:text-white/80 transition">💰 Sales</a>
		</div>
	</div>
</nav>

<main bind:this={scrollElement} class="min-h-screen bg-gradient-to-br from-blue-50 to-green-100 px-6 py-10">
	{#if selectedListing && formVisible}
		<form
			method="POST"
			action="?/submitReview"
			class="mx-auto max-w-md rounded-2xl bg-white shadow-xl p-6 border-l-4 border-green-400 flex flex-col space-y-4"
			use:enhance={() => {
				loading = true;
				return async ({ update }) => {
					await update();
					if (form?.success) resetForm();
					loading = false;
				};
			}}
		>
			<input type="hidden" name="selectedListing" value={selectedListing} />
			<input type="hidden" name="username" value={data.userProfile.name} />
			<input type="hidden" name="listingName" value={listingName} />

			<div>
				<h2 class="text-xl font-semibold text-green-700 mb-2">🌿 Review: {listingName}</h2>
				<Rating value={starValue} allowHalf onValueChange={(e) => (starValue = e.value)} />
			</div>

			<label for="review" class="text-sm font-medium">Your Review</label>
			<textarea
				id="review"
				name="review"
				required
				rows="4"
				class="textarea textarea-bordered w-full rounded-md shadow-sm"
				placeholder="Share your experience..."
			></textarea>

			<div class="flex justify-end gap-2 pt-4">
				<button
					type="button"
					onclick={() => (formVisible = false)}
					class="btn bg-red-500 text-white hover:bg-red-600 px-4 py-1.5 rounded-full"
				>
					Cancel
				</button>
				<button
					type="submit"
					disabled={loading}
					class="btn bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded-full shadow-md"
				>
					{loading ? 'Uploading...' : 'Submit Review'}
				</button>
			</div>
		</form>

		{#if form}
			<div class={`mt-4 text-center font-medium px-4 py-2 rounded ${form.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
				{form.message}
			</div>
		{/if}
	{/if}

    {#if form?.reviews}
    <div class="w-full">
        <!-- Scroll Container -->
        <!-- <h1 class="ml-3"> {selectedListing}</h1> -->
        <div
            class="ml-2 flex snap-x snap-mandatory justify-start gap-4 overflow-x-auto scroll-smooth px-4 py-2"
        >
            {#each form.reviews as review, i}
                <div
                    class="card preset-filled w-40 shrink-0 snap-start overflow-y-auto rounded-md bg-white text-black shadow-md  px-2 py-1 text-center md:w-80"
                >
                    <h1>{listingName}</h1>
                    <div class="flex scale-75 justify-center text-red-700">
                        <Rating value={review.rating} disabled />
                    </div>
                    <!-- <p class="text-sm"> <strong>{review.reviewer_name}</strong></p> -->
                    <p><strong>{review.reviewer_name.split(' ')[0]}</strong></p>

                    <span class="block max-h-24 text-left text-sm">
                        {review.comments}
                    </span>
                </div>
            {/each}
        </div>
        <!-- new -->
        <!-- Cancel Button -->
        <div class="mt-2 flex justify-center">
            <button
                class="btn mb-5 border-1 border-green-500 bg-blue-500 px-2 py-1 text-white"
                onclick={() => goto('/airbnb')}
            >
                Close Reviews
            </button>
        </div>
    </div>
{/if}


	<AirbnbListings listings={data.airbnbs} onSelectListing={handleSelectListing} />
</main>