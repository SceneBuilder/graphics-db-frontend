<script lang="ts">
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import SearchResultsGrid from '$lib/components/SearchResultsGrid.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<header class="border-b px-4 py-2 lg:px-6">
	<div class="flex items-center gap-4">
		<h1 class="text-lg font-semibold">Objects</h1>
		<form class="flex w-full max-w-sm items-center space-x-2">
			<Input name="q" placeholder="Search for objects..." />
			<Button type="submit">Search</Button>
		</form>
	</div>
</header>

<main class="container mx-auto p-4">
	<SearchResultsGrid objects={data.objects} />
</main>
