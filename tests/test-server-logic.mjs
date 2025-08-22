import dotenv from 'dotenv';
import { load } from '../src/routes/objects/+page.server.js';

// Load environment variables from .env file
dotenv.config();

async function runTest() {
  console.log(`Testing against server: ${process.env.PUBLIC_SERVER_URL}`);

  // Mock the event object that SvelteKit passes to the load function
  const mockEvent = {
    url: new URL('http://localhost:5173/objects?q=test'),
    fetch: fetch, // Use the global fetch for Node.js
  };

  try {
    console.log('Calling load function...');
    // We can pass the mock event without a type cast in a JavaScript file.
    const result = await load(mockEvent);

    console.log('\n--- Result from load function ---');
    console.log(JSON.stringify(result, null, 2));
    console.log('---------------------------------');

    if (result.error) {
      console.error('\nError reported by load function:', result.error);
    } else if (result.objects && result.objects.length > 0) {
      console.log(`\nSuccessfully fetched ${result.objects.length} objects.`);
    } else {
      console.log('\nNo objects were returned. Check the search query and backend server.');
    }

  } catch (error) {
    console.error('\n--- An error occurred during the test ---');
    console.error(error);
    console.log('------------------------------------------');
  }
}

runTest();
