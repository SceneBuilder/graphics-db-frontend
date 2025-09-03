<script lang="ts">
	import SearchResultsGrid from '$lib/components/SearchResultsGrid.svelte';
	import SearchHeader from '$lib/components/SearchHeader.svelte';
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

	let selectedMaterial: PageData['materials'][number] | null = null;
	let materialMetadata: any | null = null;
	let loadingMetadata = false;

	async function fetchMaterialMetadata(materialId: string) {
		loadingMetadata = true;
		try {
			const response = await fetch(`${PUBLIC_SERVER_URL}/api/v0/materials/${materialId}/metadata`);
			if (response.ok) {
				materialMetadata = await response.json();
			} else {
				materialMetadata = null;
			}
		} catch (error) {
			console.error('Failed to fetch material metadata:', error);
			materialMetadata = null;
		}
		loadingMetadata = false;
	}

	$: if (selectedMaterial) {
		fetchMaterialMetadata(selectedMaterial.id);
	} else {
		materialMetadata = null;
	}
</script>

<SearchHeader title="Materials" />

<main class="container mx-auto p-4">
	<SearchResultsGrid objects={data.materials} on:select={(e) => (selectedMaterial = e.detail)} />
</main>

{#if selectedMaterial}
	<Dialog open={!!selectedMaterial} onOpenChange={(open) => !open && (selectedMaterial = null)}>
		<DialogContent class="max-w-10xl max-h-[90vh] overflow-y-auto">
			<DialogHeader>
				<DialogTitle>{selectedMaterial.name}</DialogTitle>
			</DialogHeader>
			<div class="space-y-6">
				<div class="flex min-h-[24rem] justify-center">
					<div class="flex max-h-96 max-w-lg items-center justify-center">
						<img
							src={selectedMaterial.thumbnail}
							alt={selectedMaterial.name}
							class="max-h-96 max-w-full rounded-lg object-contain"
						/>
					</div>
				</div>
				{#if loadingMetadata}
					<div class="text-muted-foreground text-sm">Loading metadata...</div>
				{:else if materialMetadata}
					<div class="w-full">
						<h3 class="mb-2 text-sm font-semibold">Material Information</h3>
						<Table>
							<TableBody>
								<TableRow>
									<TableCell class="font-medium">Source</TableCell>
									<TableCell>{materialMetadata.source || 'Unknown'}</TableCell>
								</TableRow>
								<!-- <TableRow>
									<TableCell class="font-medium">License</TableCell>
									<TableCell>{materialMetadata.license || 'Unknown'}</TableCell>
								</TableRow> -->

								{#if materialMetadata.url}
									<TableRow>
										<TableCell class="font-medium">Source URL</TableCell>
										<TableCell>
											<a
												href={materialMetadata.url}
												target="_blank"
												rel="noopener noreferrer"
												class="text-blue-500 hover:underline"
											>
												View on Poly Haven
											</a>
										</TableCell>
									</TableRow>
								{/if}
							</TableBody>
						</Table>
					</div>
				{/if}
			</div>
			<DialogFooter class="flex justify-end">
				<a
					href={`${PUBLIC_SERVER_URL}/api/v0/materials/download/${selectedMaterial.id}/diffuse`}
					download={`${selectedMaterial.name}_diffuse.jpg`}
				>
					<Button>Download Diffuse Map</Button>
				</a>
			</DialogFooter>
		</DialogContent>
	</Dialog>
{/if}
