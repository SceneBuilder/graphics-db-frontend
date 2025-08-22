<script lang="ts">
	import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button/index.js';

	export let title: string;
</script>

<header class="border-b px-4 py-2 lg:px-6">
	<div class="flex items-center gap-4">
		<h1 class="text-lg font-semibold">{title}</h1>
		<form class="flex flex-1 items-center space-x-2">
			<Input class="flex-1" name="q" placeholder="Search for {title.toLowerCase()}..." />
			<Button type="submit">Search</Button>
			<Button variant="secondary" size="icon" class="size-8">
				<ChevronRightIcon />
			</Button>
		</form>
	</div>
</header>
