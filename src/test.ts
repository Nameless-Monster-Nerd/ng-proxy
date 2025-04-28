// multiRequest.ts

import axios, { AxiosError } from 'axios';

const urls = [
  'http://127.0.0.1:3000/m3u8-proxy.m3u8?url=https%3A%2F%2Ftest-streams.mux.dev%2Fx36xhzz%2Fx36xhzz.m3u8&headers={}',
  'http://127.0.0.1:3000/ts-proxy.ts?url=https%3A%2F%2Fraw.githubusercontent.com%2FNicolasCARPi%2Fexample-files%2Frefs%2Fheads%2Fmaster%2FREADME.md&headers={}',
//   'http://127.0.0.1/3',
];

async function fetchUrls(urls: string[]): Promise<void> {
  try {
    // Send requests with a timeout of 1.5 seconds
    const requests = urls.map(url => 
      axios.get(url, { timeout: 1500 }) // Timeout set to 1.5 seconds
    );
    
    const responses = await Promise.all(requests);

    // Check if all responses are successful
    const failedResponses = responses.filter(response => response.status !== 200);

    if (failedResponses.length > 0) {
      throw new Error('One or more URLs are unavailable or failed to respond within 1.5 seconds');
    }

    console.log('All URLs are available within the timeout');
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.code === 'ECONNABORTED') {
        console.error('Request timed out for one or more URLs');
      } else {
        console.error('Error occurred while fetching URLs:', error.message);
      }
    } else {
      console.error('Unknown error occurred:', error);
    }
  }
}

fetchUrls(urls);
