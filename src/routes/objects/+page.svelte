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
	import {
		Table,
		TableBody,
		TableCell,
		TableHead,
		TableHeader,
		TableRow
	} from '$lib/components/ui/table/index.js';
	import { PUBLIC_SERVER_URL } from '$env/static/public';

	export let data: PageData;

	let selectedObject: PageData['objects'][number] | null = null;
	let objectMetadata: { dimensions: { x: number; y: number; z: number } } | null = null;
	let loadingMetadata = false;

	async function fetchObjectMetadata(assetId: string) {
		loadingMetadata = true;
		try {
			const response = await fetch(`${PUBLIC_SERVER_URL}/api/v0/assets/${assetId}/metadata`);
			if (response.ok) {
				objectMetadata = await response.json();
			} else {
				objectMetadata = null;
			}
		} catch (error) {
			console.error('Failed to fetch object metadata:', error);
			objectMetadata = null;
		}
		loadingMetadata = false;
	}

	$: if (selectedObject) {
		fetchObjectMetadata(selectedObject.id);
	} else {
		objectMetadata = null;
	}
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
			<DialogFooter class="flex-col items-start space-y-4">
				{#if loadingMetadata}
					<div class="text-sm text-muted-foreground">Loading dimensions...</div>
				{:else if objectMetadata?.dimensions}
					<div class="w-full">
						<h3 class="text-sm font-semibold mb-2">Dimensions</h3>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Axis</TableHead>
									<TableHead>Size</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								<TableRow>
									<TableCell>X</TableCell>
									<TableCell>{objectMetadata.dimensions.x.toFixed(3)}</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>Y</TableCell>
									<TableCell>{objectMetadata.dimensions.y.toFixed(3)}</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>Z</TableCell>
									<TableCell>{objectMetadata.dimensions.z.toFixed(3)}</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</div>
				{/if}
				<div class="flex justify-end w-full">
					<a href={`${PUBLIC_SERVER_URL}/api/v0/assets/download/${selectedObject.id}/glb`} download={`${selectedObject.name}.glb`}>
						<Button>Download GLB</Button>
					</a>
				</div>
			</DialogFooter>
		</DialogContent>
	</Dialog>
{/if}
