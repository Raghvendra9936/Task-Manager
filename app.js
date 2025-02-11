const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const Events = require('./models/events');

const app = express();


// Database Connection
mongoose
  .connect('mongodb://localhost:27017/TaskManager', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Database connection error:', err));

// Middleware
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// View Engine Setup
app.set('view engine', 'jade');
app.set('views', path.join(__dirname, 'views'));


// Protected Home Route
app.get('/', (req, res) => {
  res.render('home', { username: req.user.username });
});

// Event Routes
app.post('/events', (req, res) => {
  let event = req.body;
  Events.insertMany(event, (err, events) => {
    if (err) throw err;
    res.json(events);
  });
});

app.get('/events', (req, res) => {
  Events.find((err, events) => {
    if (err) throw err;
    res.json(events);
  });
});

app.delete('/events/:_id', (req, res) => {
  Events.remove({ _id: req.params._id }, (err, events) => {
    if (err) throw err;
    res.json(events);
  });
});

app.put('/events/:_id', (req, res) => {
  let event = req.body;
  let update = { '$set': { ...event } };
  Events.updateOne({ _id: req.params._id }, update, (err, events) => {
    if (err) throw err;
    res.json(events);
  });
});

app.use('*', function(req, res){
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});


// Catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});


// SERVER FUNCTIONALITY (Previously in www)
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const server = http.createServer(app);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function normalizePort(val) {
  const port = parseInt(val, 10);
  if (isNaN(port)) return val;
  if (port >= 0) return port;
  return false;
}

function onError(error) {
  if (error.syscall !== 'listen') throw error;
  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  console.log('Listening on ' + bind);
}

module.exports = app;

