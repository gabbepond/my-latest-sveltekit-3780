<script lang="ts">
	import { browser } from '$app/environment';
	import type { PageData } from './$types';

	const { data } = $props<{ data: PageData }>();
</script>

<div class="flex h-screen w-full">
	{#if data.isAuthenticated}
		<!-- Left Sidebar Navigation -->
		<nav class="w-64 min-w-64 bg-gradient-to-b from-blue-600 to-green-500 text-white p-6 space-y-6 shadow-xl">
			<h1 class="text-3xl font-extrabold tracking-wide">🌱 Gabbeverse</h1>
			<div class="space-y-2 text-lg">
				<a href="/" class="block px-4 py-2 rounded-lg hover:bg-white hover:text-blue-600 transition">🌍 Home</a>
				<a href="/movies" class="block px-4 py-2 rounded-lg hover:bg-white hover:text-green-600 transition">🎬 Movies</a>
				<a href="/airbnb" class="block px-4 py-2 rounded-lg hover:bg-white hover:text-emerald-600 transition">🏡 Airbnb</a>
				<a href="/sales" class="block px-4 py-2 rounded-lg hover:bg-white hover:text-lime-600 transition">💰 Sales</a>
			</div>
		</nav>
	{/if}

	<!-- Main Content -->
	<div class="flex-1 flex items-center justify-center p-10 overflow-auto bg-gradient-to-br from-blue-50 to-green-50">
		{#if data.isAuthenticated}
			<div class="text-center space-y-6">
				<h1 class="text-4xl font-bold text-green-700">Welcome {data.userProfile?.given_name}! 👋</h1>
				<a
					href="/api/auth/logout"
					class="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full shadow transition"
				>
					Logout
				</a>
			</div>
		{:else}
			<div class="text-center space-y-10">
				<h2 class="text-4xl font-bold text-blue-700">Welcome to Gabbeverse 🌍</h2>
				<div class="flex justify-center gap-6">
					<a
						href="/api/auth/login?post_login_redirect_url=/"
						class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full shadow transition"
					>
						Login
					</a>
					<a
						href="/api/auth/register"
						class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full shadow transition"
					>
						Signup
					</a>
				</div>
			</div>
		{/if}
	</div>
</div>
