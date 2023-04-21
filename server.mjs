import { createServer } from 'http';
import https from 'https';
import url from 'url';

createServer((req, res) => {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const player = parsedUrl.query.playerName;
  const url = 'https://api.brawlhalla.com/rankings/1v1/brz/1?name=${playerName}&api_key=C2KZNXSHOPILAEPYOVH6';

  https.get(url, options, (apiRes) => {
    let data = '';

    apiRes.on('data', (chunk) => {
      data += chunk;
    });

    apiRes.on('end', () => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.write(data);
      res.end();
    });
  });
}).listen(process.env.PORT);
