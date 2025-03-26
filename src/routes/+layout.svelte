<script lang="ts">
	import '../app.css';
	import type { PageData } from './$types'

	const { data, children } = $props<{ data: PageData, children: any }>();

	//console.log(data)
</script>

{@render children()}
