import { createServer } from 'http';
import https from 'https';

const apiKey = 'C2KZNXSHOPILAEPYOVH6';
const playerName = 'player_name'; // Substitua por um nome de jogador válido

const searchForPlayer = (page) => {
  const url = `https://api.brawlhalla.com/rankings/1v1/brz/${page}?api_key=${apiKey}`;

  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        const result = JSON.parse(data);

        if (result.length > 0) {
          const player = result.find((entry) => entry.name === playerName);

          if (player) {
            resolve(player);
          } else {
            resolve(searchForPlayer(page + 1));
          }
        } else {
          reject(new Error('No more pages to search'));
        }
      });
    });
  });
};

createServer((req, res) => {
  searchForPlayer(1)
    .then((player) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.write(JSON.stringify(player));
      res.end();
    })
    .catch((err) => {
      res.writeHead(500, {'Content-Type': 'text/plain'});
      res.write(err.message);
      res.end();
    });
}).listen(process.env.PORT);
