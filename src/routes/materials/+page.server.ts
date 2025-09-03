import { PUBLIC_SERVER_URL } from '$env/static/public';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, fetch }) => {
    const query = url.searchParams.get('q');

    if (!query) {
        return { materials: [] };
    }

    try {
        // Search for materials
        const searchUrl = new URL(`${PUBLIC_SERVER_URL}/api/v0/materials/search`);
        searchUrl.searchParams.set('query', query);
        searchUrl.searchParams.set('top_k', '8');

        const searchResponse = await fetch(searchUrl.toString());
        if (!searchResponse.ok) {
            console.error(`Failed to search materials ${searchUrl.toString()}:`, await searchResponse.text());
            return { materials: [] };
        }
        const materials = await searchResponse.json();
        console.log(materials);

        if (!materials || materials.length === 0) {
            return { materials: [] };
        }

        // Get thumbnails for the found materials
        const materialUids = materials.map((material: { uid: string }) => material.uid);
        const thumbnailsResponse = await fetch(`${PUBLIC_SERVER_URL}/api/v0/materials/thumbnails`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ material_uids: materialUids })
        });

        let thumbnails: Record<string, string> = {};
        if (thumbnailsResponse.ok) {
            thumbnails = await thumbnailsResponse.json();
        } else {
            console.error('Failed to get material thumbnails:', await thumbnailsResponse.text());
            // Continue without thumbnails if this call fails
        }

        // Combine material data with thumbnails
        const materialObjects = materials.map((material: { uid: string; name: string }) => ({
            id: material.uid,
            name: material.name || material.uid,
            thumbnail: thumbnails[material.uid]
                ? `data:image/jpeg;base64,${thumbnails[material.uid]}`
                : 'https://placehold.co/400x400/ccc/999?text=No+Image'
        }));

        return {
            materials: materialObjects
        };
    } catch (error) {
        console.error('An error occurred during material data fetching:', error);
        return { materials: [], error: 'Failed to load materials from the server.' };
    }
};