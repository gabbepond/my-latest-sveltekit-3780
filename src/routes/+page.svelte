<script lang="ts">
	import { browser } from '$app/environment';
    import type { PageData } from './$types'

	// Use $props() rune to get data from layout.server.ts load function
    const { data } = $props<{ data: PageData }>();

    //console.log('User Profile:', data.userProfile);
    //console.log('Is Authenticated:', data.isAuthenticated);

	//console.log('Browser:', browser);
	
</script>

<div class="container mx-auto flex h-screen items-center justify-center">
  	{#if data.isAuthenticated}
		<div>
			<a href="/movies">
				<img src="./movies-new.png" alt="Movie icon"/>
				<span class="text-white text-lg font-bold hover:text-red-400">Movies</span>
			</a>
			<a href="/airbnb">
				<img src="./airbnb.png" alt="Movie icon"/>
				<h2>Airbnb</h2>
			</a>
			
			
			<h1>Welcome {data.userProfile?.given_name}!</h1>
			<a href="/api/auth/logout" class="btn bg-red-600 text-white">Logout</a>
			

		</div>
	{:else}
		<div class="flex flex-col items-center space-y-10 ">


			<h2 class="text-4xl text-blue-700 ">Welcome to Gabbe's Movie App</h2>
			<div class="flex gap-x-4 drop-shadow-lg">
				<a
					href="/api/auth/login?post_login_redirect_url=/"
					class="btn bg-red-600 text-white">Login</a
				>
				<a href="/api/auth/register" class="btn bg-red-600 text-white">Signup</a>
			</div>
			<!-- <a href="/api/auth/logout" class="btn bg-red-600 text-white">Logout</a> -->
		</div>
 	{/if}
</div>
