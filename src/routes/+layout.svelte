<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { Button } from '$lib/components/ui/button/index.js';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<header class="flex h-14 items-center px-4 lg:px-6">
	<a class="flex items-center justify-center" href="/">
		<span class="font-semibold">Graphics-DB</span>
	</a>
	<nav class="mx-auto flex gap-4 sm:gap-6">
		<Button variant="ghost" href="/objects" class="text-sm font-medium">Objects</Button>
		<Button variant="ghost" href="/materials" class="text-sm font-medium">Materials</Button>
		<Button variant="ghost" href="/environments" class="text-sm font-medium">Environments</Button>
	</nav>
	<nav class="flex gap-4 sm:gap-6">
		<Button variant="link" href="/api-docs" class="text-sm font-medium">API</Button>
		<Button variant="link" href="https://github.com/yunho-c/graphics-db" class="text-sm font-medium"
			>GitHub</Button
		>
	</nav>
</header>

{@render children?.()}

<footer
	class="flex w-full shrink-0 flex-col items-center gap-2 border-t px-4 py-6 sm:flex-row md:px-6"
>
	<p class="text-xs text-gray-500 dark:text-gray-400">
		© 2025
		<Button
			variant="link"
			href="https://github.com/yunho-c/graphics-db/contributors/"
			class="h-auto p-0 text-xs font-normal text-gray-500 dark:text-gray-400"
			target="_blank"
		>
			Graphics-DB Contributors.
		</Button>
		All rights reserved.
	</p>
	<nav class="flex gap-4 sm:ml-auto sm:gap-6">
		<Button variant="link" href="https://github.com/safe-robotics-lab-gt" class="text-xs">
			Safe Robotics Lab @ GitHub
		</Button>
		<!-- <Button variant="link" href="#" class="text-xs">
			Privacy
		</Button> -->
	</nav>
</footer>
