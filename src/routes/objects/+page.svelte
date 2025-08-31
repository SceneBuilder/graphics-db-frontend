<script lang="ts">
	import SearchResultsGrid from '$lib/components/SearchResultsGrid.svelte';
	import SearchHeader from '$lib/components/SearchHeader.svelte';
	import ModelViewer from '$lib/components/ModelViewer.svelte';
	import type { PageData } from './$types';
	import {
		Dialog,
		DialogContent,
		DialogHeader,
		DialogTitle,
		DialogFooter
	} from '$lib/components/ui/dialog/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { PUBLIC_SERVER_URL } from '$env/static/public';

	export let data: PageData;

	let selectedObject: PageData['objects'][number] | null = null;
</script>

<SearchHeader title="Objects" />

<main class="container mx-auto p-4">
	<SearchResultsGrid objects={data.objects} on:select={(e) => (selectedObject = e.detail)} />
</main>

{#if selectedObject}
	<Dialog open={!!selectedObject} onOpenChange={(open) => !open && (selectedObject = null)}>
		<DialogContent class="max-w-4xl">
			<DialogHeader>
				<DialogTitle>{selectedObject.name}</DialogTitle>
			</DialogHeader>
			<div class="space-y-6">
				<!-- <div>
					<img src={selectedObject.thumbnail} alt={selectedObject.name} class="w-full rounded-lg" />
				</div> -->
				<div>
					<ModelViewer assetUid={selectedObject.id} />
				</div>
			</div>
			<DialogFooter>
				<a href={`${PUBLIC_SERVER_URL}/assets/download/${selectedObject.id}/glb`} download={`${selectedObject.name}.glb`}>
					<Button>Download GLB</Button>
				</a>
			</DialogFooter>
		</DialogContent>
	</Dialog>
{/if}
