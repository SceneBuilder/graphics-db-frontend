import { expect, test } from '@playwright/test';

test('home page has expected h1', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('heading', { name: 'Objects' })).toBeVisible();
});

test('object search end-to-end test', async ({ page }) => {
	// Navigate to the objects search page
	await page.goto('/objects');

	// Find the search input and fill it
	await page.getByPlaceholder('Search for objects...').fill('test');

	// Click the search button
	await page.getByRole('button', { name: 'Search' }).click();

	// Wait for the results to load and check that at least one result is visible
	// This confirms the round-trip to the server was successful.
	await expect(page.locator('div[data-testid="search-result-item"]').first()).toBeVisible();
});
