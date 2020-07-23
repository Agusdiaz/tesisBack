const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const EventController = require('./controllers/EventController')

// Importo router
const apiRoutes = require('./ApiRoutes');

// Todo lo que recibe la app se tratara como json
app.use(bodyParser.urlencoded(
    {
      extended: true,
    }));
app.use(bodyParser.json());
app.use(cors());

const port = process.env.PORT || 8080;

app.get('/', (req, res) => res.send('Hello World with Express'));

// Uso Api routes en App
app.use(apiRoutes);

app.listen(port, function() {
  console.log('Running RestHub on port ' + port);
});