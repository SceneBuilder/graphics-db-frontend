import { PUBLIC_SERVER_URL, PUBLIC_SERVER_API_URL } from '$env/static/public';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, fetch }) => {
	const query = url.searchParams.get('q');
	const validateScale = url.searchParams.get('validate_scale') === 'true';

	if (!query) {
		return { objects: [] };
	}

	try {
		// Search for objects
		const searchUrl = new URL(`${PUBLIC_SERVER_API_URL}/objects/search`);
		searchUrl.searchParams.set('query', query);
		searchUrl.searchParams.set('top_k', '12');
		if (validateScale) {
			searchUrl.searchParams.set('validate_scale', 'true');
		}

		const searchResponse = await fetch(searchUrl.toString());
		if (!searchResponse.ok) {
			console.error(`Failed to search objects ${searchUrl.toString()}:`, await searchResponse.text());
			return { objects: [] };
		}
		const objects = await searchResponse.json();
		console.log(objects);

		if (!objects || objects.length === 0) {
			return { objects: [] };
		}

		// Get thumbnails for the found objects
		const assetUids = objects.map((asset: { uid: string }) => asset.uid);
		const thumbnailsResponse = await fetch(`${PUBLIC_SERVER_API_URL}/objects/thumbnails`, {
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

		// Combine object data with thumbnails
		const data = objects.map((asset: { uid: string; name: string }) => ({
			id: asset.uid,
			name: asset.name,
			thumbnail: thumbnails[asset.uid]
				? `${PUBLIC_SERVER_URL}${thumbnails[asset.uid]}`
				: 'https://placehold.co/400x400/ccc/999?text=No+Image'
		}));

		return {
			data
		};
	} catch (error) {
		console.error('An error occurred during data fetching:', error);
		return { objects: [], error: 'Failed to load data from the server.' };
	}
};
