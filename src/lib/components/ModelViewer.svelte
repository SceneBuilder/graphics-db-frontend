<script lang="ts">
	import { Canvas, T, useThrelte } from '@threlte/core';
	import { GLTF, OrbitControls } from '@threlte/extras';
	import { PUBLIC_SERVER_URL } from '$env/static/public';
	import { Box3, Vector3, Group, PerspectiveCamera } from 'three';

	export let assetUid: string;

	$: glbUrl = `${PUBLIC_SERVER_URL}/assets/download/${assetUid}/glb`;

	let camera: PerspectiveCamera;
	let controls: any;

	const zoomToFit = (scene: Group) => {
		console.log('Invoked');
		// if (!camera || !controls) return;

		// 1. Calculate the bounding box of the loaded scene
		const box = new Box3().setFromObject(scene);
		const size = box.getSize(new Vector3());
		const center = box.getCenter(new Vector3());

		// 2. Find the largest dimension of the bounding box
		const maxDim = Math.max(size.x, size.y, size.z);

		// 3. Calculate the distance the camera needs to be from the object
		const fov = camera.fov * (Math.PI / 180);
		let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));

		// Add some padding so the model isn't touching the edges
		cameraZ *= 1.5;

		// 4. Update camera and controls
		// camera.position.set(center.x, center.y, center.z + cameraZ);
		camera.position.set(center.x + cameraZ, center.y + cameraZ, center.z + cameraZ);
		controls.target.copy(center);
		controls.update();
	};
</script>

<div class="h-96 w-full">
	<Canvas>
		<T.PerspectiveCamera makeDefault position={[5, 2, 5]} bind:ref={camera}>
			<OrbitControls enableDamping bind:ref={controls} />
		</T.PerspectiveCamera>

		<!-- Lighting -->
		<T.AmbientLight intensity={0.5} />
		<T.DirectionalLight position={[10, 10, 5]} intensity={1} />

		<!-- 3D Model -->
		<GLTF url={glbUrl} onload={(event) => zoomToFit(event.scene)} />

		<!-- DEBUG -->
		<!-- <GLTF url={glbUrl} onload={(event) => console.log(event)} /> -->
	</Canvas>
</div>
