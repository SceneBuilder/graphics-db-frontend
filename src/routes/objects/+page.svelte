<script lang="ts">
	import SearchResultsGrid from '$lib/components/SearchResultsGrid.svelte';
	import SearchHeader from '$lib/components/SearchHeader.svelte';
	import type { PageData } from './$types';
	import {
		Dialog,
		DialogContent,
		DialogHeader,
		DialogTitle
	} from '$lib/components/ui/dialog/index.js';

	export let data: PageData;

	let selectedObject: PageData['objects'][number] | null = null;
</script>

<SearchHeader title="Objects" />

<main class="container mx-auto p-4">
	<SearchResultsGrid objects={data.objects} on:select={(e) => (selectedObject = e.detail)} />
</main>

{#if selectedObject}
	<Dialog open={!!selectedObject} onOpenChange={(open) => !open && (selectedObject = null)}>
		<DialogContent>
			<DialogHeader>
				<DialogTitle>{selectedObject.name}</DialogTitle>
			</DialogHeader>
			<img src={selectedObject.thumbnail} alt={selectedObject.name} class="mx-auto rounded-lg" />
		</DialogContent>
	</Dialog>
{/if}
