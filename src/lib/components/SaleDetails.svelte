<script lang="ts">
	import type { DecimalValue, Item, Customer, SaleData } from '$lib/types/SalesTypes'
	import { onMount } from 'svelte'
	import { Chart, registerables } from 'chart.js'
	import { Rating } from '@skeletonlabs/skeleton-svelte'

	// Register Chart.js components
	Chart.register(...registerables)

	// Props for the component using Svelte 5 $props rune
	let { salesData } = $props<{ salesData: SaleData | null }>()

    const gotData = $state(true)

    let itemsChartCanvas = $state<HTMLCanvasElement | null>(null)

	// Default sale data to prevent undefined errors
	function defaultsalesData(): SaleData {
		return {
			_id: '5bd761dcae323e45a93ccfe8',
			saleDate: new Date().toISOString(),
			items: [
				{
					name: 'printer paper',
					tags: ['office', 'stationary'],
					price: { $numberDecimal: '40.01' },
					quantity: 2
				},
				{
					name: 'notepad',
					tags: ['office', 'writing', 'school'],
					price: { $numberDecimal: '35.29' },
					quantity: 2
				},
				{
					name: 'pens',
					tags: ['writing', 'office', 'school', 'stationary'],
					price: { $numberDecimal: '56.12' },
					quantity: 5
				}
			],
			storeLocation: 'Denver',
			customer: {
				gender: 'M',
				age: 42,
				email: 'cauho@witwuta.sv',
				satisfaction: 4
			},
			couponUsed: false,
			purchaseMethod: 'Online'
		}
	}

	// Calculate totals and statistics using Svelte 5 $derived rune with null checks
	const totalItems = $derived(
		salesData?.items?.reduce((sum: number, item: Item) => sum + item.quantity, 0) || 0
	)

	const totalCost = $derived(
		salesData?.items
			?.reduce(
				(sum: number, item: Item) => sum + parseFloat(item.price.$numberDecimal) * item.quantity,
				0
			)
			?.toFixed(2) || '0.00'
	)

	// Get all unique tags and their counts for the tag cloud
	const tags = $derived(salesData?.items?.flatMap((item: Item) => item.tags) || [])

	const tagCounts = $derived(
		tags.reduce(
			(acc: { [x: string]: any }, tag: string | number) => {
				acc[tag] = (acc[tag] || 0) + 1
				return acc
			},
			{} as Record<string, number>
		)
	)

	// Format date nicely
	const formattedDate = $derived(
		new Date(salesData?.saleDate || new Date()).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		})
	)

	// Check if the sale was on a weekend
	const isWeekend = $derived([0, 6].includes(new Date(salesData?.saleDate || new Date()).getDay()))



	onMount(() => {
		if (salesData && salesData.items && itemsChartCanvas) {
			renderItemsChart()
		}
	})

	function renderItemsChart() {
		if (!itemsChartCanvas) return
		const ctx = itemsChartCanvas.getContext('2d')
		if (!ctx) return

		const labels = salesData.items.map((item: any) => item.name)
		const quantities = salesData.items.map((item: any) => item.quantity)
		const backgroundColors = salesData.items.map(
			(_: any, i: number) => `hsla(${(i * 137) % 360}, 70%, 60%, 0.7)`
		)

		new Chart(ctx, {
			type: 'bar',
			data: {
				labels: labels,
				datasets: [
					{
						label: 'Quantity',
						data: quantities,
						backgroundColor: backgroundColors,
						borderColor: backgroundColors.map((color: any) => color.replace('0.7', '1')),
						borderWidth: 1
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: {
						display: false
					},
					title: {
						display: true,
						text: 'Items by Quantity'
					},
					tooltip: {
						callbacks: {
							label: function (context) {
								return `Quantity: ${context.raw}`
							}
						}
					}
				},
				scales: {
					y: {
						beginAtZero: true,
						ticks: {
							precision: 0
						}
					}
				}
			}
		})
	}
</script>

{#if !gotData}
	<div class="mx-auto max-w-7xl p-4">
		<div class="rounded-lg bg-white p-8 text-center shadow-lg dark:bg-gray-800">
			<div class="animate-pulse">
				<div class="mx-auto mb-4 h-8 w-3/4 rounded bg-gray-300 dark:bg-gray-600"></div>
				<div class="mx-auto h-4 w-1/2 rounded bg-gray-300 dark:bg-gray-600"></div>
			</div>
			<p class="mt-4 text-gray-500 dark:text-gray-400">Loading sales data...</p>
		</div>
	</div>
{:else}
	<div class="mx-auto max-w-7xl p-4">
		<div class="overflow-hidden rounded-lg bg-white shadow-lg dark:bg-gray-800">
			<!-- Header -->
			<div class="bg-blue-600 p-4 text-white md:p-6">
				<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
					<div>
						<h1 class="text-xl font-bold md:text-2xl">Sale Receipt</h1>
						<p class="text-blue-100">ID: {salesData._id.substring(0, 8)}...</p>
					</div>
					<div class="flex flex-col items-start md:items-end">
						<span class="font-semibold">{formattedDate}</span>
						<span class="rounded-full bg-blue-700 px-2 py-1 text-xs font-medium">
							{salesData.purchaseMethod}
							{#if isWeekend}
								<span class="ml-1 rounded-sm bg-yellow-500 px-1 text-[10px] text-black"
									>Weekend</span
								>
							{/if}
						</span>
					</div>
				</div>
			</div>

			<!-- Summary Cards -->
			<div class="grid grid-cols-1 gap-4 p-4 md:grid-cols-3">
				<!-- Store Location -->
				<div class="rounded-lg bg-gray-100 p-4 dark:bg-gray-700">
					<h2 class="text-sm font-medium text-gray-500 dark:text-gray-300">Store Location</h2>
					<p class="text-lg font-bold">{salesData.storeLocation}</p>
				</div>

				<!-- Total Items -->
				<div class="rounded-lg bg-gray-100 p-4 dark:bg-gray-700">
					<h2 class="text-sm font-medium text-gray-500 dark:text-gray-300">Total Items</h2>
					<p class="text-lg font-bold">{totalItems}</p>
				</div>

				<!-- Total Cost -->
				<div class="rounded-lg bg-gray-100 p-4 dark:bg-gray-700">
					<h2 class="text-sm font-medium text-gray-500 dark:text-gray-300">Total Cost</h2>
					<p class="text-lg font-bold">${totalCost}</p>
					{#if salesData.couponUsed}
						<span class="text-xs font-medium text-green-500">Coupon Applied</span>
					{/if}
				</div>
			</div>

			<!-- Customer Information -->
			<div class="border-t border-gray-200 p-4 dark:border-gray-700">
				<h2 class="mb-3 text-lg font-semibold">Customer Information</h2>
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
					<div>
						<p class="text-sm text-gray-500 dark:text-gray-400">Email</p>
						<p class="font-medium">{salesData.customer.email}</p>
					</div>
					<div>
						<p class="text-sm text-gray-500 dark:text-gray-400">Age</p>
						<p class="font-medium">{salesData.customer.age}</p>
					</div>
					<div>
						<p class="text-sm text-gray-500 dark:text-gray-400">Gender</p>
						<p class="font-medium">{salesData.customer.gender}</p>
					</div>
					<div>
						<p class="text-sm text-gray-500 dark:text-gray-400">Satisfaction</p>
						<div class="flex items-center">
							<Rating value={salesData?.customer?.satisfaction} readOnly />
							<!-- 							{#each Array(5) as _, i}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-5 w-5 {i < salesData.customer.satisfaction
										? 'text-yellow-400'
										: 'text-gray-300'}"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
									/>
								</svg>
							{/each} -->
						</div>
					</div>
				</div>
			</div>

			<!-- Items Table -->
			<div class="border-t border-gray-200 p-4 dark:border-gray-700">
				<h2 class="mb-3 text-lg font-semibold">Items Purchased</h2>
				<div class="overflow-x-auto">
					<table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
						<thead class="bg-gray-50 dark:bg-gray-800">
							<tr>
								<th
									scope="col"
									class="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300"
									>Item</th
								>
								<th
									scope="col"
									class="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300"
									>Tags</th
								>
								<th
									scope="col"
									class="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300"
									>Unit Price</th
								>
								<th
									scope="col"
									class="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300"
									>Quantity</th
								>
								<th
									scope="col"
									class="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300"
									>Subtotal</th
								>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
							{#each salesData.items as item, i}
								<tr
									class={i % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'}
								>
									<td class="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white"
										>{item.name}</td
									>
									<td class="px-4 py-3 text-sm text-gray-500 dark:text-gray-300">
										<div class="flex flex-wrap gap-1">
											{#each item.tags as tag}
												<span
													class="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-800 dark:bg-blue-800 dark:text-blue-100"
													>{tag}</span
												>
											{/each}
										</div>
									</td>
									<td class="px-4 py-3 text-sm text-gray-500 dark:text-gray-300"
										>${item.price.$numberDecimal}</td
									>
									<td class="px-4 py-3 text-sm text-gray-500 dark:text-gray-300">{item.quantity}</td
									>
									<td class="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
										${(parseFloat(item.price.$numberDecimal) * item.quantity).toFixed(2)}
									</td>
								</tr>
							{/each}
						</tbody>
						<tfoot>
							<tr class="bg-gray-50 dark:bg-gray-700">
								<td
									colspan="4"
									class="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-white"
									>Total</td
								>
								<td class="px-4 py-3 text-sm font-bold text-gray-900 dark:text-white"
									>${totalCost}</td
								>
							</tr>
						</tfoot>
					</table>
				</div>
			</div>

			<!-- Visual Data -->
			<div
				class="grid grid-cols-1 gap-4 border-t border-gray-200 p-4 lg:grid-cols-2 dark:border-gray-700"
			>
				<!-- Items by Quantity Chart -->
				<div class="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
					<h3 class="mb-4 font-medium text-gray-700 dark:text-gray-300">Items by Quantity</h3>
					<div class="relative h-64">
						<canvas bind:this={itemsChartCanvas}></canvas>
					</div>
				</div>

				<!-- Tag Cloud -->
				<div class="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
					<h3 class="mb-4 font-medium text-gray-700 dark:text-gray-300">Popular Tags</h3>
					<div class="flex flex-wrap gap-2">
						{#each Object.entries(tagCounts) as [tag, count] (tag)}
							<span
								class="rounded-full px-3 py-1"
								style="font-size: {100 + (count as number) * 20}%; background-color: #{(
									Math.abs(tag.charCodeAt(0) * 12345) % 0xffffff |
									0x200000
								).toString(16)}20"
							>
								{tag} ({count})
							</span>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}