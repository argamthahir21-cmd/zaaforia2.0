const https = require('https');

https.get('https://dns.google/resolve?name=_mongodb._tcp.cluster0.opgsshg.mongodb.net&type=SRV', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log("SRV response:", data);
  });
}).on('error', err => {
  console.log('Error: ', err.message);
});

https.get('https://dns.google/resolve?name=cluster0.opgsshg.mongodb.net&type=TXT', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log("TXT response:", data);
  });
});
