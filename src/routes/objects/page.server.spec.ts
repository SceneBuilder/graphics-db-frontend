import { describe, it, expect, vi } from 'vitest';
import { load } from './+page.server';
import type { PageServerLoadEvent } from './$types';

// Mock the environment variables module
vi.mock('$env/static/public', () => ({
	PUBLIC_SERVER_URL: 'http://test-server.com'
}));

describe('+page.server.ts', () => {
	it('searches for assets and fetches their thumbnails', async () => {
		const mockAssets = [
			{ uid: 'uid1', name: 'Test Asset 1' },
			{ uid: 'uid2', name: 'Test Asset 2' }
		];

		const mockThumbnails = {
			uid1: 'base64-encoded-image-1',
			uid2: 'base64-encoded-image-2'
		};

		// Mock the fetch function to return different responses based on the URL
		const mockFetch = vi.fn().mockImplementation((url) => {
			if (url.toString().includes('/objects/search')) {
				return Promise.resolve(new Response(JSON.stringify(mockAssets)));
			}
			if (url.toString().includes('/objects/thumbnails')) {
				return Promise.resolve(new Response(JSON.stringify(mockThumbnails)));
			}
			return Promise.resolve(new Response('Not Found', { status: 404 }));
		});

		// Mock the event object passed to the load function
		const mockEvent = {
			url: new URL('http://localhost:5173/objects?q=test'),
			fetch: mockFetch
		} as unknown as PageServerLoadEvent;

		const result = await load(mockEvent);

		// Assertions
		expect(mockFetch).toHaveBeenCalledTimes(2);
		expect(mockFetch).toHaveBeenCalledWith(
			'http://test-server.com/objects/search?query=test&top_k=12'
		);
		expect(mockFetch).toHaveBeenCalledWith('http://test-server.com/objects/thumbnails', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ asset_uids: ['uid1', 'uid2'] })
		});

		if (!result) {
			expect.fail('load function returned undefined');
		}

		expect(result.objects).toHaveLength(2);
		expect(result.objects[0]).toEqual({
			id: 'uid1',
			name: 'Test Asset 1',
			thumbnail: 'data:image/png;base64,base64-encoded-image-1'
		});
	});

	it('returns an empty array if no query is provided', async () => {
		const mockFetch = vi.fn();
		const mockEvent = {
			url: new URL('http://localhost:5173/objects'),
			fetch: mockFetch
		} as unknown as PageServerLoadEvent;

		const result = await load(mockEvent);

		if (!result) {
			expect.fail('load function returned undefined');
		}

		expect(mockFetch).not.toHaveBeenCalled();
		expect(result.objects).toEqual([]);
	});
});
