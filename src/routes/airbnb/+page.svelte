<script lang="ts">
    import { goto } from '$app/navigation';
    import { browser } from '$app/environment';
    import AirbnbListings from '$lib/components/AirbnbListings.svelte';
    import { Rating } from '@skeletonlabs/skeleton-svelte';
    import { enhance } from '$app/forms';
    import { updated } from '$app/state';
    import type { ActionData, PageData } from './$types';

    // Correctly type both data and form using a single $props call
    const { data, form } = $props<{ data: PageData; form: ActionData | null }>();

    //console.log(data.userProfile)
    if (!data.userProfile && browser) {
        console.log('No user profile');
        goto('/');
    }

    let scrollElement: HTMLElement;
    let formVisible = $state(true);
    let starValue = $state(2);
    let listingName = $state('My Listing');
    let loading = $state(false);

    let selectedListing = $state('');

    // Callback function to handle listing selection
    function handleSelectListing(listing: any) {
        console.log('Selected listing:', listing);
        selectedListing = listing;
        formVisible = true;
        // Set the listing name for the review form
        if (listing && listing.name) {
            listingName = listing.name;
        }
        scrollElement.scrollIntoView({ behavior: 'smooth' });
    }

    // Reset the form
    function resetForm() {
        formVisible = false;
        selectedListing = '';
        starValue = 1;
    }
</script>
<!-- 🌿 TOP NAVIGATION -->
<nav class="bg-gradient-to-r from-white to-green-500 text-white shadow-lg sticky top-0 z-50">
	<div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
		<!-- Keep Airbnb logo default size -->
		<div class="flex items-center text-left">
			<img src="/airbnb.png" alt="Airbnb Logo" class="m-2" />
			<h5 class="h6 m-2 text-gray-700 italic">Living Your Best Life</h5>
		</div>
		<div class="flex gap-4 text-sm md:text-base">
			<a href="/" class="hover:text-white/80 transition">🌍 Home</a>
			<a href="/movies" class="hover:text-white/80 transition">🎬 Movies</a>
			<a href="/airbnb" class="hover:text-white/80 transition">🏡 Airbnb</a>
			<a href="/sales" class="hover:text-white/80 transition">💰 Sales</a>
		</div>
	</div>
</nav>

<main bind:this={scrollElement}>
    <!-- Your form that uses the selected listing ID -->
    <!-- new -->
    <!-- <header class="flex items-center text-left">
        <img src="/airbnb.png" alt="Airbnb Logo" class=" m-2" />
        <h5 class="h6 m-2 bg-white text-gray-700 italic">Living Your Best Life</h5>
    </header> -->

    {#if selectedListing && formVisible}
        <!-- <form
            method="POST"
            action="?/submitReview"
            class="mx-auto mt-8 max-w-2xl rounded-lg bg-white p-4 shadow-lg border-2 border-green-400"
            use:enhance={() => {
                loading = true;

                return async ({ update }) => {
                    await update();
                    if (form?.success) {
                        resetForm();
                    }
                    loading = false;
                };
            }}
        > -->
        <form
        method="POST"
        action="?/submitReview"
            class="mx-auto mt-8 w-96 h-[300px] rounded-lg bg-white p-4 shadow-lg border-2 border-green-400 flex flex-col justify-between overflow-hidden"
        use:enhance={() => {
            loading = true;
            return async ({ update }) => {
                await update();
                if (form?.success) {
                    resetForm();
                }
                loading = false;
            };
        }}
    >
    
            <input type="hidden" name="selectedListing" value={selectedListing} />
            <input type="hidden" name="username" value={data.userProfile.name} />
            <input type="hidden" name="listingName" value={listingName} />
            <div>
                <p class="text-md"><strong>Review of: {listingName}</strong></p>

                <Rating value={starValue} allowHalf onValueChange={(e) => (starValue = e.value)} />
                <label for="review" class="mt-2 mb-2 block">Your Review</label>
                <textarea
                    class="textarea w-full"
                    id="review"
                    rows="4"
                    required
                    name="review"
                    placeholder="Write your review here"
                ></textarea>
                <div class="m-2 flex justify-end gap-2">
                    <button
                        class="btn border-2 border-gray-600 bg-red-500 px-2 py-1 text-black"
                        type="button"
                        onclick={() => (formVisible = false)}>Cancel</button
                    >
                    <button
                        class="btn border-2 border-gray-600 bg-green-400 px-2 py-1 text-black"
                        type="submit"
                        disabled={loading}>{loading ? 'Uploading review...' : 'Submit Review'}</button
                    >
                </div>
            </div>
        </form>
        {#if form}
            <div class={`${form.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {form.message}
            </div>
        {/if}
    {/if}

    <!-- {#if form?.reviews}
        <div class="w-full">
    
            <div
                class="flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto scroll-smooth px-4 py-10"
            >
    
                {#each form.reviews as review, i}
                    <div class="bg-gray-500 card preset-filled w-40 shrink-0 snap-start py-20 text-center md:w-80">
                        <span>{review.comments}</span>
                    </div>
                {/each}
            </div>
        </div>
    {/if} -->
    <!-- new -->
    {#if form?.reviews}
        <div class="w-full">
            <!-- Scroll Container -->
            <!-- <h1 class="ml-3"> {selectedListing}</h1> -->
            <div 
                class="ml-2 flex snap-x snap-mandatory justify-start gap-4 overflow-x-auto scroll-smooth px-4 py-2"
            >
                {#each form.reviews as review,i}
                    <div
                        class="card preset-filled w-40 shrink-0 snap-start rounded-md bg-gray-500 px-2 py-1 text-center md:w-80 overflow-y-auto"
                    >
                        <h1>{listingName}</h1>
                        <div class="flex scale-75 justify-center text-red-600">
                            <Rating value={review.rating} disabled />
                        </div>
						<p> <strong>{review.reviewer_name.split(' ')[0]}</strong></p>
                    
                        <span class="block max-h-24 text-sm text-left">
                            {review.comments}
                        </span>
                    </div>
                {/each}
            </div>
            <!-- new -->
            <!-- Cancel Button -->
            <div class="mt-2 flex justify-center">
                <button
                    class="btn mb-5 border-1 border-green-500 bg-red-400 px-2 py-1 text-white"
                    onclick={() => goto('/airbnb')}
                >
                    Close Reviews
                </button>
            </div>
        </div>
    {/if}

    <AirbnbListings listings={data.airbnbs} onSelectListing={handleSelectListing} />
</main>
