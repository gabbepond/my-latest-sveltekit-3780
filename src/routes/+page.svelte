<script lang="ts">
    import { browser } from '$app/environment';
    import type { PageData } from './$types'

    // Use $props() rune to get data from layout.server.ts load function
    const { data } = $props<{ data: PageData }>();

    //console.log('User Profile:', data.userProfile);
    //console.log('Is Authenticated:', data.isAuthenticated);

    //console.log('Browser:', browser);
    
</script>

<div class="container mx-auto flex flex-col h-screen">
    <!-- Navigation Menu -->
    <nav class="bg-gray-800 text-white p-6">
        <div class="flex justify-between items-center">
            <h1 class="text-xl font-bold">Gabbe's App</h1>
            <div class="flex space-x-4">
                <a href="/movies" class="hover:text-red-400">Movies</a>
                <a href="/airbnb" class="hover:text-red-400">Airbnb</a>
            </div>
        </div>
    </nav>

    <!-- Main Content -->
    <div class="flex flex-grow items-center justify-center">
        {#if data.isAuthenticated}
            <div class="flex flex-col items-center space-y-4">
                <h1 class="m-5 text-2xl text-gray-800">Welcome {data.userProfile?.given_name}!</h1>
                <a href="/api/auth/logout" class="btn bg-red-600 text-white">Logout</a>
            </div>
        {:else}
            <div class="flex flex-col items-center space-y-10">
                <h2 class="text-4xl text-blue-700">Welcome to Gabbe's Movie App</h2>
                <div class="flex gap-x-4 drop-shadow-lg">
                    <a
                        href="/api/auth/login?post_login_redirect_url=/"
                        class="btn bg-red-600 text-white">Login</a>
                    <a href="/api/auth/register" class="btn bg-red-600 text-white">Signup</a>
                </div>
            </div>
        {/if}
    </div>
</div>