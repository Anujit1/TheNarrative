// modules
const express = require('express');
const path = require('path');
const {PORT, MONGO_URI} = require('./config');
const userRoute = require('./routes/user')
const { connectMongodb } = require('./connections');
const localsMiddleware = require('./middleware/locals');

// variables
const app = express();
connectMongodb(MONGO_URI);

//middleware
app.use(express.urlencoded({extended: false})); 
app.use(localsMiddleware);

// view engine
app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

// route
app.get('/', (req, res) => {
  return res.render('home');
});

app.use('/user', userRoute);

app.listen(PORT, () => console.log(`Server Started\nhttp://localhost:${PORT}`));