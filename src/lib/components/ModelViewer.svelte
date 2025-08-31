<script lang="ts">
	import { Canvas, T } from '@threlte/core';
	import { GLTF, OrbitControls } from '@threlte/extras';
	import { PUBLIC_SERVER_URL } from '$env/static/public';

	export let assetUid: string;

	$: glbUrl = `${PUBLIC_SERVER_URL}/assets/download/${assetUid}/glb`;
</script>

<div class="h-96 w-full">
	<Canvas>
		<T.PerspectiveCamera makeDefault position={[0, 0, 5]}>
			<OrbitControls enableDamping />
		</T.PerspectiveCamera>

		<!-- Lighting -->
		<T.AmbientLight intensity={0.5} />
		<T.DirectionalLight position={[10, 10, 5]} intensity={1} />

		<!-- 3D Model -->
		<GLTF url={glbUrl} />
	</Canvas>
</div>
