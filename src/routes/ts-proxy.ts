import type { Request, Response } from 'express';
import * as https from 'https';
import { allowedOrigins } from '../utils/utils';
// export const runtime = "edge"
// Define the function for handling the API request
export default async function TsProxy(req: Request, res: Response): Promise<any> {
    try {
        const origin = req.headers.origin
        if (origin && allowedOrigins.includes(origin)) {
            res.setHeader('Access-Control-Allow-Origin', origin);
        }
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=86400');
        res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');

        // Get the URL from the query parameter and ensure it's a string
        const url = decodeURIComponent(req.query.url as string);
        // Get the headers from the query or default to an empty object
        const headers = req.query.headers ? JSON.parse(req.query.headers as string) : {};
        // res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=60, max-age=0');
        // Ensure that the URL is provided
        if (!url) {
            return res.status(400).json({ error: 'URL parameter is required' });
        }

        // Set up options for the HTTPS request, including headers
        // console.log(headers)
        // const options: https.RequestOptions = {
        //     headers,
        // };

        // Make the HTTPS request
        const response = await fetch(url, { headers });
        const arrayBuffer = await response.arrayBuffer();

        // Convert to Buffer
        const buffer = Buffer.from(arrayBuffer);
        res.send(buffer)

        // https.get(url, options, (response) => {
        //     // Forward the response status code from the external server
        //     res.status(response.statusCode || 200);

        //     // Forward all headers from the external response to the client


        //     // Pipe the external response body to the client
        //     response.pipe(res);
        // }).on('error', (error) => {
        //     // Handle any errors in the HTTPS request
        //     console.error('Error in HTTPS request:', error);
        //     res.status(500).json({ error: 'Failed to fetch the resource' });
        // });
    } catch (error) {
        const msg = ' ts proxy boke '
        console.error(msg)
        console.error(error)
        res.send(error)
    }
}
