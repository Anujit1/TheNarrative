// modules
const express = require('express');
const path = require('path');
const {PORT, MONGO_URI} = require('./config');

// variables
const app = express();

// view engine
app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

// route
app.get('/', (req, res) => {
  return res.render('home');
})

app.listen(PORT, () => console.log(`Server Started\nhttp://localhost:${PORT}`));