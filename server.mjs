import { createServer } from 'http';
import https from 'https';

createServer((req, res) => {
  const playerName = req.url.split('/')[1];

  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  let currentPage = 1;
  let foundPlayer = false;

  const fetchPlayerData = () => {
    const url = `https://api.brawlhalla.com/rankings/1v1/brz/${currentPage}?api_key=C2KZNXSHOPILAEPYOVH6`;

    https.get(url, options, (apiRes) => {
      let data = '';

      apiRes.on('data', (chunk) => {
        data += chunk;
      });

      apiRes.on('end', () => {
        const jsonData = JSON.parse(data);

        const playerData = jsonData.filter(row => row.name.toLowerCase() === playerName.toLowerCase());

        if (playerData.length > 0) {
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
          res.writeHead(200, {'Content-Type': 'application/json'});
          res.write(JSON.stringify(playerData[0]));
          res.end();
          foundPlayer = true;
        } else if (jsonData.length === 100 && !foundPlayer) {
          currentPage++;
          fetchPlayerData();
        } else {
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
          res.writeHead(404, {'Content-Type': 'application/json'});
          res.write(JSON.stringify({ error: 'Jogador não encontrado' }));
          res.end();
        }
      });
    }).on('error', (err) => {
      console.error(err);
    });
  };

  fetchPlayerData();
}).listen(process.env.PORT);
