fetch('http://193.93.153.143:3000/cf-clearance-scraper', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        url: 'https://mistydawn62.pro/file2/t5s422mzT~7ssrAHzHbU~JgOhhyCZApCF8~+FD3lQAhkO+Wl9+D~+U7Q3TWjW4k2gsn~MTKEZuclYACqgOQPiBAOHfz3fQh0o8iYz8KEmG11RseUqfHDQcd~xeU8NHfHYx3nIPT0qlf~PNKYq5hbwax732i60+gEM6rMDL1kk~Y=/MTA4MA==/aW5kZXgubTN1OA==.m3u8',
        mode: "turnstile-max"
    })
})
.then(res => res.json())
.then(async (scraperResult) => {
    console.log('Scraper Result:', scraperResult);

    const { Cookie, 'User-Agent': UserAgent } = scraperResult;

    if (!Cookie || !UserAgent) {
        console.error('Missing Cookie or User-Agent');
        return;
    }

    // Now make the real request
    const m3u8Response = await fetch('https://mistydawn62.pro/file2/t5s422mzT~7ssrAHzHbU~JgOhhyCZApCF8~+FD3lQAhkO+Wl9+D~+U7Q3TWjW4k2gsn~MTKEZuclYACqgOQPiBAOHfz3fQh0o8iYz8KEmG11RseUqfHDQcd~xeU8NHfHYx3nIPT0qlf~PNKYq5hbwax732i60+gEM6rMDL1kk~Y=/MTA4MA==/aW5kZXgubTN1OA==.m3u8', {
        method: 'GET',
        headers: {
            'Accept': '*/*',
            'Accept-Encoding': 'gzip, deflate, br, zstd',
            'Accept-Language': 'en-US,en;q=0.5',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'DNT': '1',
            'Host': 'mistydawn62.pro',
            'Origin': 'https://megacloud.store',
            'Pragma': 'no-cache',
            'Referer': 'https://megacloud.store/',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'cross-site',
            'Sec-GPC': '1',
            'User-Agent': UserAgent,
            'Cookie': Cookie
        }
    });

    if (!m3u8Response.ok) {
        console.error('Failed to fetch .m3u8 file:', m3u8Response.status);
        return;
    }

    const m3u8Text = await m3u8Response.text();
    console.log('M3U8 Content:', m3u8Text);
})
.catch(console.error);
