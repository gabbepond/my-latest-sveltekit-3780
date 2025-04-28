<script lang="ts">
	const {
		listings = [],
		onSelectListing = (listing: any) => {}
	} = $props<{
		listings: any[],
		onSelectListing?: (listing: any) => void
	}>();

	function handleReviewClick(listing: any) {
		onSelectListing(listing);
	}

	const defaultImage = '/comingsoon.jpg';
</script>

<div class="flex w-full flex-wrap justify-center gap-6 py-6">
	{#each listings as listing}
		<div class="relative w-80 h-[480px] flex flex-col bg-white rounded-2xl shadow-xl border border-green-300 hover:scale-[1.03] hover:shadow-2xl transition-transform">
			<div class="relative h-48 w-full overflow-hidden rounded-t-2xl">
				<img
					class="w-full h-full object-cover"
					src={listing.images?.picture_url || defaultImage}
					onerror={(e) => e.currentTarget.src = defaultImage}
					alt={listing.name}
					loading="lazy"
				/>
				<div class="absolute top-2 right-2 bg-white/80 text-blue-600 text-xs px-2 py-1 rounded-md shadow">
					${listing.price}
				</div>
			</div>

			<div class="flex flex-col flex-grow px-4 py-3">
				<h3 class="text-lg font-semibold text-gray-800 line-clamp-1">{listing.name}</h3>
				<p class="text-sm text-gray-600 mt-2 flex-grow overflow-auto h-24 scrollbar-thin scrollbar-thumb-green-400 scrollbar-track-green-100">{listing.summary}</p>

				<div class="mt-2 flex justify-end">
					<button
						onclick={() => handleReviewClick(listing)}
						class="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white text-sm font-medium px-4 py-2 rounded-full shadow"
					>
						✍️ Review
					</button>
				</div>
			</div>
		</div>
	{/each}
</div>

<!-- Gabbe -->