const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index', {
    serverName: 'MonServeur MC',
    serverAddress: 'ton-ip-vps:25566',
    description: 'Un serveur Minecraft Paper sur VPS, monitoré avec Prometheus et Grafana.',
    rules: [
      'Pas de triche',
      'Respecter les autres joueurs',
      'Pas de destruction de constructions sans accord',
      'Griefing interdit'
    ]
  });
});

app.listen(3000, () => console.log('Landing page on port 3000'));

