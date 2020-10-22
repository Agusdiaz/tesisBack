const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const engines = require('consolidate');
const path = require('path');
const EventController = require('./controllers/EventController')

// Importo router
const apiRoutes = require('./ApiRoutes');

const app = express();

// Todo lo que recibe la app se tratara como json
app.use(bodyParser.urlencoded(
    {
      extended: true,
    }));
app.use(bodyParser.json());
app.use(cors());

const port = process.env.PORT || 8080;
const host =  process.env.HOST || '172.20.0.20';
app.get('/', (req, res) => res.send('Hello World with Express'));

// Uso Api routes en App
app.use(apiRoutes);

//For render views
app.engine("ejs", engines.ejs);
app.set('views', path.join(__dirname, './views'));
app.set("view engine", "ejs");

app.listen(port, host, function() {
  console.log('Running RestHub on port '+ host + ':' + port);
});

EventController.checkAllShopsSchedules()
EventController.checkAllPromosHours()
