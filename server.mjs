import { createServer } from 'http';
import https from 'https';

createServer((req, res) => {
  const playerName = req.url.replace('/', '');
  const apiKey = 'C2KZNXSHOPILAEPYOVH6';
  const baseUrl = 'https://api.brawlhalla.com/rankings/1v1/brz/';
  let page = 1;
  let players = [];

  const fetchPlayers = () => {
    const url = `${baseUrl}${page}?api_key=${apiKey}`;

    https.get(url, (apiRes) => {
      let data = '';

      apiRes.on('data', (chunk) => {
        data += chunk;
      });

      apiRes.on('end', () => {
        const jsonData = JSON.parse(data);

        if (jsonData.hasOwnProperty('error')) {
          res.writeHead(404);
          res.write(`Error: ${jsonData.error}`);
          res.end();
        } else {
          const foundPlayers = jsonData.filter(player => player.name === playerName);
          players = players.concat(foundPlayers);

          if (foundPlayers.length > 0) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.write(JSON.stringify(players));
            res.end();
          } else {
            page++;
            fetchPlayers();
          }
        }
      });
    });
  };

  fetchPlayers();
}).listen(process.env.PORT);
