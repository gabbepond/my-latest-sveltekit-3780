<script lang="ts">
    let {title, year, poster} = $props();
    // goo
    let imgError = $state(false)
    const defaultImage = '/defaultMoviePoster.png'
    
    function handleImageError() {
        imgError = true
    }
    </script>
    
    <div
    class="card card-hover m-4 block max-w-xs divide-y overflow-hidden border-[1px] p-2 border-surface-200-800 divide-surface-200-800 preset-filled-surface-100-900"
    >
    <!-- goo -->
    <h2 class="text-lg text-center">{title}</h2>
    <h3 class="text-sm text-center">{year}</h3>
    
    <!-- <img src={poster} alt={title} /> -->
    <!-- goo -->
    <!-- <img src={poster} alt={title} class="w-64 h-80 object-cover" /> -->
    <img src={imgError ? defaultImage : poster} alt={title} class="w-64 h-80 object-cover"
    onerror={handleImageError} loading="lazy" />
    </div>