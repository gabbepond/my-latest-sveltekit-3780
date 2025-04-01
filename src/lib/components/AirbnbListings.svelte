<script lang="ts">
    // Use the props run with the onSelectListing callback
    const { 
        listings = [], 
        onSelectListing = (listing: any) => {} 
    } = $props<{ 
        listings: any[],
        onSelectListing?: (listing: any) => void 
    }>();
    
    // Function to handle review button click
    function handleReviewClick(listing: any) {
        // Call the callback prop directly
        onSelectListing(listing);
    }
    let imageUrl: string;
    let imgError = $state(false)
const defaultImage = '/comingsoon.jpg'

function handleImageError() {
    imgError = true
}

</script>


<div class="flex w-full flex-wrap justify-center gap-4">
    {#each listings as listing}
    
        <div class="mt-5 w-80 h-[450px] flex flex-col bg-white shadow-lg rounded-lg overflow-hidden border-2 border-red-400">
       
            <img 
            class="w-full h-44 object-cover object-center rounded-lg" 
            src={listing.images?.picture_url}
            onerror={handleImageError}
            alt={listing.name} 
            loading="lazy"
        />
            <div class="p-4 flex flex-col flex-grow">
                <h3 class="text-gray-800 text-md font-medium">{listing.name}</h3>
                <p class="mt-2 text-gray-600 line-clamp-4 flex-grow">{listing.summary}</p>
                <div class="flex justify-between items-center mt-3">
                    <h4 class="text-lg font-medium text-gray-700">${listing.price}</h4>
                    <button 
                        class="px-3 py-1 bg-gray-800 text-white text-xs font-medium uppercase rounded"
                        onclick={() => handleReviewClick(listing)}
                    >
                        Review
                    </button>
                </div>
            </div>
        </div>
    {/each}
</div>

<!-- 
<div class="flex w-full flex-wrap justify-center">
    {#each listings as listing}
        <div class="m-4 w-1/4">
            <div class="bg-white shadow-lg rounded-lg overflow-hidden">
                <img class="w-full h-56 object-cover object-center" src={listing.images.picture_url} alt={listing.name} />
                <div class="p-4">
                    <h3 class="text-gray-800 text-xl font-medium">{listing.name}</h3>
                    <p class="mt-2 text-gray-600">{listing.summary}</p>
                    <div class="flex justify-between mt-3 items-center">
                        <h4 class="text-xl font-medium text-gray-700">${listing.price}</h4>
                        <button 
                            class="px-3 py-1 bg-gray-800 text-white text-xs font-medium uppercase rounded"
                            onclick={() => handleReviewClick(listing)}
                        >
                            Review
                        </button>
                    </div>
                </div>
            </div>
        </div>
    {/each}
</div> -->