<script lang="ts">
	import { onMount } from 'svelte';
	import type { SaleData, Item } from '$lib/types/SalesTypes';
	import SaleDetails from '$lib/components/SaleDetails.svelte';
	import { Accordion } from '@skeletonlabs/skeleton-svelte';
	import BadgeDollarSign from '@lucide/svelte/icons/badge-dollar-sign';
	import Sparkles from '@lucide/svelte/icons/sparkles';

	let salesData = $state<SaleData[]>([]);
	let itemName = $state<string>('');
	let couponUsed = $state<boolean>(false);
	let loading = $state<boolean>(false);

	onMount(() => {
		console.log('Mounted. Ready to fetch sales.');
	});

	const totalCost = (sale: SaleData) => {
		return sale.items
			?.reduce((sum: number, item: Item) => sum + parseFloat(item.price.$numberDecimal) * item.quantity, 0)
			?.toFixed(2) || '0.00';
	};

	async function getSalesData() {
		loading = true;
		const response = await fetch(`/api/sales?itemName=${itemName}&couponUsed=${couponUsed}`);
		if (!response.ok) {
			console.error('Fetch error');
			salesData = [];
			loading = false;
			return;
		}
		const data = await response.json();
		console.log('Sales data:', data);
		salesData = data;
		loading = false;
	}

	const storeStats = async () => {
		loading = true;

		const salesDataToStore = salesData.map((sale) => ({
			_id: sale._id,
			items: sale.items.filter((item) => item.name.toLowerCase().includes(itemName.toLowerCase())).map((item) => ({
				name: item.name,
				price: item.price.$numberDecimal
			})),
			purchaseMethod: sale.purchaseMethod,
			storeLocation: sale.storeLocation,
			saleDate: sale.saleDate
		}));

		const snapshot = {
			salesData: salesDataToStore,
			itemName,
			couponUsed,
			createdAt: new Date().toISOString()
		};

		const response = await fetch('/api/sales', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(snapshot)
		});

		if (!response.ok) {
			console.error('Error saving snapshot');
			salesData = [];
		} else {
			console.log('Snapshot stored successfully');
		}

		loading = false;
	};
</script>
 <!-- 🌿 TOP NAVIGATION -->
        <nav class="bg-gradient-to-r from-white to-indigo-600 text-white shadow-lg sticky top-0 z-50">
            <div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                <h1 class="text-xl font-bold text-indigo-600">SalesVerse</h1>
                <div class="flex gap-4 text-sm md:text-base">
                    <a href="/" class="hover:text-white/80 transition">🌍 Home</a>
                    <a href="/movies" class="hover:text-white/80 transition">🎬 Movies</a>
                    <a href="/airbnb" class="hover:text-white/80 transition">🏡 Airbnb</a>
                    <a href="/sales" class="hover:text-white/80 transition">💰 Sales</a>
                </div>
            </div>
        </nav>

<main class="min-h-screen w-full bg-gradient-to-br from-violet-100 to-sky-100 py-12 px-6">
	<div class="max-w-5xl mx-auto bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-10">
		<div class="flex items-center justify-between mb-8">
			<h1 class="text-4xl font-extrabold text-indigo-800 flex items-center gap-2">
				<Sparkles class="text-indigo-500 animate-bounce" /> SaleScope
			</h1>
			<div class="text-sm text-indigo-600">Analyze your store performance in style</div>
		</div>

		<form class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<div class="flex flex-col gap-2">
				<label for="itemName" class="font-medium text-indigo-800">Search Item</label>
				<input
					id="itemName"
					type="text"
					placeholder="Try 'notepad', 'pens', etc."
					class="input input-bordered w-full"
					bind:value={itemName}
				/>
			</div>

			<div class="flex flex-col gap-2">
				<label class="font-medium text-indigo-800">Coupon Used?</label>
				<label class="inline-flex items-center gap-2">
					<input type="checkbox" class="checkbox checkbox-primary" bind:checked={couponUsed} />
					<span>Yes, filter only discounted sales</span>
				</label>
			</div>

			<div class="col-span-full flex gap-4">
				<button class="btn btn-primary bg-indigo-700 text-white w-full md:w-auto" on:click|preventDefault={getSalesData}>
					Get Sales Data
				</button>
				<button
					class="btn btn-secondary w-full md:w-auto bg-indigo-200"
					disabled={!itemName || salesData.length === 0}
					on:click|preventDefault={storeStats}
				>
					💾 Save Snapshot
				</button>
			</div>
		</form>
	</div>

	{#if loading}
		<p class="text-center mt-10 text-lg text-indigo-600 animate-pulse">Loading sales magic...</p>
	{:else if salesData.length > 0}
		<div class="mt-12 max-w-5xl mx-auto">
			<p class="text-2xl font-semibold mb-6 text-center text-indigo-800">
				Found <span class="font-bold text-primary-600">{salesData.length}</span> relevant sale{salesData.length > 1 ? 's' : ''} 🛒
			</p>
			<Accordion class="rounded-xl overflow-hidden" collapsible>
				{#each salesData as sale}
					<Accordion.Item value={sale._id} leadClasses="flex items-center gap-2 text-primary-700 font-bold">
						{#snippet lead()}<BadgeDollarSign size={24} /> ${totalCost(sale)}{/snippet}
						{#snippet control()}{sale.storeLocation}{/snippet}
						{#snippet panel()}<SaleDetails salesData={sale} />{/snippet}
					</Accordion.Item>
				{/each}
			</Accordion>
		</div>
	{:else}
		<p class="text-center mt-10 text-xl text-gray-500">No sales match your query. Try another filter! ❌</p>
	{/if}
</main>