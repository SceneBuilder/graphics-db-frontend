import { PUBLIC_SERVER_URL } from '$env/static/public';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, fetch }) => {
	const query = url.searchParams.get('q');
	const validateScale = url.searchParams.get('validate_scale') === 'true';

	if (!query) {
		return { objects: [] };
	}

	try {
		// Search for assets
		const searchUrl = new URL(`${PUBLIC_SERVER_URL}/assets/search`);
		searchUrl.searchParams.set('query', query);
		searchUrl.searchParams.set('top_k', '12');
		if (validateScale) {
			searchUrl.searchParams.set('validate_scale', 'true');
		}
		
		const searchResponse = await fetch(searchUrl.toString());
		if (!searchResponse.ok) {
			console.error('Failed to search assets:', await searchResponse.text());
			return { objects: [] };
		}
		const assets = await searchResponse.json();

		if (!assets || assets.length === 0) {
			return { objects: [] };
		}

		// Get thumbnails for the found assets
		const assetUids = assets.map((asset: { uid: string }) => asset.uid);
		const thumbnailsResponse = await fetch(`${PUBLIC_SERVER_URL}/assets/thumbnails`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ asset_uids: assetUids })
		});

		let thumbnails: Record<string, string> = {};
		if (thumbnailsResponse.ok) {
			thumbnails = await thumbnailsResponse.json();
		} else {
			console.error('Failed to get thumbnails:', await thumbnailsResponse.text());
			// Continue without thumbnails if this call fails
		}

		// Combine asset data with thumbnails
		const objects = assets.map((asset: { uid: string; name: string }) => ({
			id: asset.uid,
			name: asset.name,
			thumbnail: thumbnails[asset.uid]
				? `data:image/png;base64,${thumbnails[asset.uid]}`
				: 'https://placehold.co/400x400/ccc/999?text=No+Image'
		}));

		return {
			objects
		};
	} catch (error) {
		console.error('An error occurred during data fetching:', error);
		return { objects: [], error: 'Failed to load data from the server.' };
	}
};
