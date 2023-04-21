https.get(url, options, (apiRes) => {
  let data = '';

  apiRes.on('data', (chunk) => {
    data += chunk;
  });

  apiRes.on('end', () => {
    try {
      const parsedData = JSON.parse(data);
      allData = [...allData, ...parsedData];
    } catch (e) {
      console.error(`Error parsing JSON: ${e.message}`);
    }

    if (allData.length >= 500) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.write(JSON.stringify(allData));
      res.end();
    } else {
      const nextUrl = `https://api.brawlhalla.com/rankings/1v1/brz/${pageNumber + 1}?api_key=C2KZNXSHOPILAEPYOVH6`;
      fetchData(nextUrl, pageNumber + 1);
    }
  });
});
