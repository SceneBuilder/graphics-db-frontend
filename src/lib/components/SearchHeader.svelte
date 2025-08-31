<script lang="ts">
	import SettingsIcon from '@lucide/svelte/icons/settings';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuTrigger,
		DropdownMenuCheckboxItem,
		DropdownMenuLabel,
		DropdownMenuSeparator
	} from '$lib/components/ui/dropdown-menu/index.js';

	export let title: string;

	let validateScale = false;
</script>

<header class="border-b px-4 py-2 lg:px-6">
	<div class="flex items-center gap-4">
		<h1 class="text-lg font-semibold">{title}</h1>
		<form class="flex flex-1 items-center space-x-2">
			<Input class="flex-1" name="q" placeholder="Search for {title.toLowerCase()}..." />
			{#if validateScale}
				<input type="hidden" name="validate_scale" value="true" />
			{/if}
			<Button type="submit">Search</Button>
			<DropdownMenu>
				<DropdownMenuTrigger>
					<Button variant="secondary" size="icon" class="size-8">
						<SettingsIcon class="size-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLabel>Options</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuCheckboxItem bind:checked={validateScale}>
						Validate Scale
					</DropdownMenuCheckboxItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</form>
	</div>
</header>
