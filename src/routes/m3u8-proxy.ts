// import { BASE_PATH, userAgent } from "../../utils/utils";
import { BASE_PATH,userAgent,allowedOrigins } from "../utils/utils";
import type { Request, Response } from "express";
// import axios from "axios"; // Import axios

// export const runtime = "edge"

export default async function m3u8(req: Request, res: Response) {
    try {
        const origin = req.headers.origin
        console.log(allowedOrigins)
        console.log(' nigga chod ')

        if (origin && allowedOrigins.includes(origin)) {
            res.setHeader('Access-Control-Allow-Origin', origin);
        }
    
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=86400');
        
        const url:any = decodeURIComponent(req.query.url as string)
        console.log(url)
        let headers: any = decodeURIComponent(req.query.headers  as string )
        let h =JSON.parse( headers)
        console.log(h)
        console.log(headers)
        var hString = encodeURIComponent(JSON.stringify(h))
        // console.log(headers);
        // res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=60, max-age=0');

        if (typeof url === 'string') {
            let rootArr = url.split('/');
            rootArr.pop();
            const root = rootArr.join('/');
             
            try {
                // console.log(' mother ')
                const r = await fetch(url, { headers: h });
                const data = await  r.text();
                // console.log(data)
                // const headersObj = Object.fromEntries(r.headers.entries());
                const splited = data.split('\n');
                // console.log(splited)
                // headers = encodeURIComponent(headers);
                
                for (let i = 0; i < splited.length; i++) { // Correct loop condition
                    const line = splited[i];
                    
                    try {
                        if (line.includes('BANDWIDTH')) {
                            if (i + 1 < splited.length) { // Check bounds before accessing splited[i + 1]
                                i = i + 1;
                                const nextLine = splited[i];
                                const mod = `${BASE_PATH}/m3u8-proxy.m3u8?url=${encodeURIComponent(encodeURIComponent((nextLine.includes('http') ? '' : root + '/') + nextLine))}&headers=${hString}`;
                                splited[i] = mod; // Modify the next line
                            }
                        } else if (line.includes('EXTINF')) {
                            if (i + 1 < splited.length) { // Check bounds before accessing splited[i + 1]
                                i = i + 1;
                                let nextLine = splited[i];
                                const mod = `${BASE_PATH}/ts-proxy.ts?url=${encodeURIComponent(encodeURIComponent((nextLine.includes('http') ? '' : root + '/') + nextLine))}&headers=${hString}`;
                                splited[i] = mod;
                            }
                        } else if (line.includes('#EXT-X-MAP')) {
                            const match = line.match(/URI="(.*?)"/);
                            if (match) {
                                const initUrl = match[1];
                                const fullInitUrl = initUrl.startsWith('http') ? initUrl : `${root}/${initUrl}`;
                                const proxiedInitUrl = `${BASE_PATH}/ts-proxy.ts?url=${encodeURIComponent(encodeURIComponent(fullInitUrl))}&headers=${hString}`;
                                splited[i] = line.replace(initUrl, proxiedInitUrl);
                            }
                        } else if (line.includes('#EXT-X-MEDIA') && line.includes('URI="')) {
                            const match = line.match(/URI="(.*?)"/);
                            if (match) {
                                const audioUrl = match[1];
                                const fullAudioUrl = audioUrl.startsWith('http') ? audioUrl : `${root}/${audioUrl}`;
                                const proxiedAudioUrl = `${BASE_PATH}/m3u8-proxy.m3u8?url=${encodeURIComponent(encodeURIComponent(fullAudioUrl))}&headers=${hString}`;
                                splited[i] = line.replace(audioUrl, proxiedAudioUrl);
                            }
                        }
                    } catch (error) {
                        console.log(`Error processing line ${i}: ${line}`, error);
                    }
                }
            
                const joined = splited.join('\n');
                // console.log(joined)
                res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
                // console.log(headersObj)
                // res.header(headersObj)
                res.status(200).send(joined);
                // res.json(headersObj)
                // res.send('mother fucker ')
            } catch (error) {
                console.error("Error fetching the URL:", error);
                res.status(500).json({ error: 'Failed to fetch the m3u8 URL' });
            }
        } else {
            res.status(400).json({ error: 'Invalid URL parameter' });
        }
    } catch (error) {
        const msg = ' m3u8 proxy broke '
        console.error(error)
        res.send(error)
    }
    }
